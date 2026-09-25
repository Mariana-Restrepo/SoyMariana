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
import { useEffect, useRef, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { InputField, SelectField, TextareaField } from '@/components/ui/Field';
import { cn, isDev, safeMailto } from '@/lib/utils';

type Props = { open: boolean; onClose: () => void };

type Status =
  | { kind: 'editing' }
  | { kind: 'sending' }
  | { kind: 'done'; via: 'endpoint' | 'simulated' | 'ignored' | 'mailto' }
  | { kind: 'error'; message: string };

const endpoint = (import.meta.env.VITE_INQUIRY_ENDPOINT as string | undefined) || undefined;
const initial = (): InquiryDraft => ({ ...emptyInquiry, collabType: collab.types[0] ?? '' });

/**
 * Formulario de 2 pasos (para que no se sienta gigante). Valida con packages/core.
 * Empieza limpio en cada apertura porque quien lo usa lo monta con una `key` nueva.
 */
export default function InquiryDialog({ open, onClose }: Props) {
  const [draft, setDraft] = useState<InquiryDraft>(initial);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [step, setStep] = useState<InquiryStep>(1);
  const [status, setStatus] = useState<Status>({ kind: 'editing' });
  const [honeypot, setHoneypot] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Lleva el foco al primer campo con error, o al primero del paso nuevo.
  useEffect(() => {
    if (!open || status.kind !== 'editing') return;
    const root = formRef.current;
    if (!root) return;
    const target =
      root.querySelector<HTMLElement>('[aria-invalid="true"]') ??
      root.querySelector<HTMLElement>(
        '[data-step]:not([hidden]) input, [data-step]:not([hidden]) textarea',
      );
    target?.focus();
  }, [errors, step, open, status.kind]);

  const set = <K extends keyof InquiryDraft>(key: K, value: InquiryDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const next = () => {
    const found = validateInquiry(draft, 1);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(2);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (step === 1) return next();
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
      simulate: isDev && !endpoint,
      honeypot,
    });
    if (!result.ok) {
      track('inquiry_error');
      setStatus({ kind: 'error', message: result.error });
      return;
    }
    track('inquiry_submit', { via: result.via });
    if (result.via === 'mailto') window.location.href = result.href;
    setStatus({ kind: 'done', via: result.via });
  };

  const mail = safeMailto(links.email);
  const sending = status.kind === 'sending';

  return (
    <Dialog open={open} onClose={onClose} labelledBy="inquiry-title">
      {status.kind === 'done' ? (
        <div className="px-2 py-8 text-center">
          <p aria-hidden="true" className="text-5xl text-cereza">
            ♡
          </p>
          <h2 id="inquiry-title" className="my-2 text-[2.2rem] leading-none">
            Listo, <em>ya lo tengo</em>
          </h2>
          <p role="status">
            {status.via === 'mailto'
              ? 'Se abrió tu correo con el mensaje listo. Solo dale enviar y te leo con calma.'
              : 'Te leo con calma y te respondo pronto.'}
          </p>
          {status.via === 'simulated' && (
            <p className="mt-2 text-[0.82rem] text-ink-soft">
              Modo desarrollo: no se envió nada. Configura VITE_INQUIRY_ENDPOINT o un correo real
              para producción.
            </p>
          )}
          <Button variant="quiet" className="mt-5" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      ) : (
        <form ref={formRef} noValidate onSubmit={submit}>
          <p className="mb-4 text-eyebrow font-medium uppercase tracking-[0.14em] text-ink-soft">
            ¿Creamos algo?
          </p>
          <h2 id="inquiry-title" className="mb-1 text-[2rem] leading-none">
            Cuéntame <em>tu idea</em>
          </h2>

          <div className="mb-5 mt-3.5 flex gap-1.5" aria-hidden="true">
            {[1, 2].map((n) => (
              <i
                key={n}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors duration-300',
                  step >= n ? 'bg-cereza' : 'bg-ink/12',
                )}
              />
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            Paso {step} de 2
          </p>

          <div data-step="1" hidden={step !== 1}>
            <InputField
              label="Tu nombre"
              autoComplete="name"
              value={draft.name}
              error={errors.name}
              onChange={(e) => set('name', e.target.value)}
            />
            <InputField
              label="Marca"
              autoComplete="organization"
              value={draft.brand}
              error={errors.brand}
              onChange={(e) => set('brand', e.target.value)}
            />
            <InputField
              label="Correo"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={draft.email}
              error={errors.email}
              onChange={(e) => set('email', e.target.value)}
            />
            <InputField
              label="Instagram o TikTok de la marca"
              optional
              placeholder="@"
              value={draft.brandSocial}
              onChange={(e) => set('brandSocial', e.target.value)}
            />
            <div className="mt-2 flex justify-end">
              <Button variant="cereza" onClick={next}>
                Siguiente →
              </Button>
            </div>
          </div>

          <div data-step="2" hidden={step !== 2}>
            <SelectField
              label="Tipo de colaboración"
              options={collab.types}
              value={draft.collabType}
              onChange={(e) => set('collabType', e.target.value)}
            />
            <TextareaField
              label="Cuéntame sobre el proyecto"
              value={draft.message}
              error={errors.message}
              onChange={(e) => set('message', e.target.value)}
            />
            <InputField
              label="Presupuesto aproximado"
              optional
              value={draft.budget}
              onChange={(e) => set('budget', e.target.value)}
            />

            {/* Campo trampa anti-spam: las personas no lo ven ni lo llenan. */}
            <input
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            {status.kind === 'error' && (
              <p
                role="alert"
                className="mb-3 rounded-md bg-cereza-tint p-3 text-[0.9rem] text-cereza-ink"
              >
                Ay, algo falló ({status.message}) Inténtalo de nuevo
                {mail ? (
                  <>
                    {' '}
                    o escríbeme a{' '}
                    <a href={mail} className="underline">
                      {links.email}
                    </a>
                  </>
                ) : null}
                .
              </p>
            )}

            <div className="mt-2 flex justify-between gap-2.5">
              <Button variant="quiet" onClick={() => setStep(1)} disabled={sending}>
                ← Atrás
              </Button>
              <Button type="submit" variant="cereza" disabled={sending} aria-busy={sending}>
                {sending ? 'Enviando…' : 'Cuéntame tu idea'}
              </Button>
            </div>
          </div>

          <p className="mt-3.5 text-[0.78rem] text-ink-soft">
            Solo uso tus datos para responderte. No los comparto con nadie.
          </p>
        </form>
      )}
    </Dialog>
  );
}
