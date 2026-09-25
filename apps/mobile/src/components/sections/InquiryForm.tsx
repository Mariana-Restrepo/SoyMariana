import { collab, links } from '@soymariana/content';
import {
  emptyInquiry,
  submitInquiry,
  toInquiry,
  track,
  validateInquiry,
  type InquiryDraft,
  type InquiryErrors,
  type InquiryStep,
} from '@soymariana/core';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Em } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Field } from '@/components/ui/Field';
import { safeMailto } from '@/lib/links';
import { colors, radii, shadows } from '@/theme';

type Status =
  | { kind: 'editing' }
  | { kind: 'sending' }
  | { kind: 'done'; via: 'endpoint' | 'simulated' | 'ignored' | 'mailto' }
  | { kind: 'error'; message: string };

const endpoint = process.env.EXPO_PUBLIC_INQUIRY_ENDPOINT || undefined;
const initial = (): InquiryDraft => ({ ...emptyInquiry, collabType: collab.types[0] ?? '' });

/** Formulario de 2 pasos (mismo modelo, validación y mensajes que la web, vía packages/core). */
export function InquiryForm() {
  const [draft, setDraft] = useState<InquiryDraft>(initial);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [step, setStep] = useState<InquiryStep>(1);
  const [status, setStatus] = useState<Status>({ kind: 'editing' });

  const set = <K extends keyof InquiryDraft>(key: K, value: InquiryDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const next = () => {
    const found = validateInquiry(draft, 1);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(2);
  };

  const submit = async () => {
    const found = validateInquiry(draft, 'all');
    setErrors(found);
    if (Object.keys(found).length > 0) {
      if (found.name || found.brand || found.email) setStep(1);
      return;
    }
    setStatus({ kind: 'sending' });
    const result = await submitInquiry(toInquiry(draft, collab.types[0] ?? ''), {
      endpoint,
      email: links.email,
      simulate: __DEV__ && !endpoint,
    });
    if (!result.ok) {
      track('inquiry_error');
      setStatus({ kind: 'error', message: result.error });
      return;
    }
    track('inquiry_submit', { via: result.via });
    if (result.via === 'mailto') Linking.openURL(result.href).catch(() => {});
    setStatus({ kind: 'done', via: result.via });
  };

  const reset = () => {
    setDraft(initial());
    setErrors({});
    setStep(1);
    setStatus({ kind: 'editing' });
  };

  if (status.kind === 'done') {
    return (
      <View style={[styles.card, shadows.soft, styles.done]} accessibilityLiveRegion="polite">
        <AppText variant="number" color={colors.cereza}>
          ♡
        </AppText>
        <AppText variant="h2" style={styles.center}>
          Listo, <Em>ya lo tengo</Em>
        </AppText>
        <AppText variant="body" style={styles.center}>
          {status.via === 'mailto'
            ? 'Se abrió tu correo con el mensaje listo. Solo dale enviar y te leo con calma.'
            : 'Te leo con calma y te respondo pronto.'}
        </AppText>
        {status.via === 'simulated' && (
          <AppText variant="small" color={colors.inkSoft} style={styles.center}>
            Modo desarrollo: no se envió nada. Configura EXPO_PUBLIC_INQUIRY_ENDPOINT o un correo
            real para producción.
          </AppText>
        )}
        <Button label="Enviar otra idea" variant="quiet" onPress={reset} />
      </View>
    );
  }

  const sending = status.kind === 'sending';
  const mail = safeMailto(links.email);

  return (
    <View style={[styles.card, shadows.soft]}>
      <AppText variant="eyebrow" color={colors.inkSoft}>
        ¿Creamos algo?
      </AppText>
      <AppText variant="h2" accessibilityRole="header" style={styles.title}>
        Cuéntame <Em>tu idea</Em>
      </AppText>

      <View style={styles.steps} accessibilityElementsHidden importantForAccessibility="no">
        {[1, 2].map((n) => (
          <View key={n} style={[styles.stepBar, step >= n && { backgroundColor: colors.cereza }]} />
        ))}
      </View>
      <AppText
        variant="small"
        color={colors.inkSoft}
        style={styles.stepLabel}
        accessibilityLiveRegion="polite"
      >
        Paso {step} de 2
      </AppText>

      <AppText variant="small" color={colors.inkSoft} style={styles.requiredNote}>
        <AppText variant="label" color={colors.cerezaInk} importantForAccessibility="no">
          *
        </AppText>{' '}
        Obligatorio
      </AppText>

      {step === 1 ? (
        <View>
          <Field
            label="Tu nombre"
            required
            autoComplete="name"
            value={draft.name}
            error={errors.name}
            onChangeText={(v) => set('name', v)}
          />
          <Field
            label="Marca"
            required
            autoComplete="organization-title"
            value={draft.brand}
            error={errors.brand}
            onChangeText={(v) => set('brand', v)}
          />
          <Field
            label="Correo"
            required
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={draft.email}
            error={errors.email}
            onChangeText={(v) => set('email', v)}
          />
          <Field
            label="Instagram o TikTok de la marca"
            optional
            autoCapitalize="none"
            placeholder="@"
            value={draft.brandSocial}
            onChangeText={(v) => set('brandSocial', v)}
          />
          <View style={styles.actions}>
            <Button label="Siguiente →" variant="cereza" onPress={next} />
          </View>
        </View>
      ) : (
        <View>
          <AppText variant="label" style={styles.typeLabel}>
            Tipo de colaboración
          </AppText>
          <View style={styles.types}>
            {collab.types.map((type) => (
              <Chip
                key={type}
                label={type}
                pressed={draft.collabType === type}
                onPress={() => set('collabType', type)}
              />
            ))}
          </View>
          <Field
            label="Cuéntame sobre el proyecto"
            required
            multiline
            value={draft.message}
            error={errors.message}
            onChangeText={(v) => set('message', v)}
          />
          <Field
            label="Presupuesto aproximado"
            optional
            value={draft.budget}
            onChangeText={(v) => set('budget', v)}
          />

          {status.kind === 'error' && (
            <View style={styles.errorBox} accessibilityRole="alert">
              <AppText variant="small" color={colors.cerezaInk}>
                Ay, algo falló ({status.message}) Inténtalo de nuevo
                {mail ? ` o escríbeme a ${links.email}` : ''}.
              </AppText>
            </View>
          )}

          <View style={[styles.actions, styles.between]}>
            <Button label="← Atrás" variant="quiet" onPress={() => setStep(1)} disabled={sending} />
            <Button
              label={sending ? 'Enviando…' : 'Cuéntame tu idea'}
              variant="cereza"
              onPress={submit}
              disabled={sending}
            />
          </View>
        </View>
      )}

      <AppText variant="small" color={colors.inkSoft} style={styles.privacy}>
        Solo uso tus datos para responderte. No los comparto con nadie.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii.lg, padding: 22 },
  done: { alignItems: 'center', gap: 12, paddingVertical: 32 },
  center: { textAlign: 'center' },
  title: { marginTop: 8 },
  steps: { flexDirection: 'row', gap: 6, marginTop: 14 },
  stepBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: 'rgba(43,31,38,0.12)' },
  stepLabel: { marginTop: 6 },
  requiredNote: { marginTop: 2, marginBottom: 14 },
  typeLabel: { marginBottom: 8 },
  types: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  between: { justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' },
  errorBox: { backgroundColor: colors.cerezaTint, borderRadius: 12, padding: 12, marginBottom: 12 },
  privacy: { marginTop: 16 },
});
