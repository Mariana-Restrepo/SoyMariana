import { metrics, type Metric } from '@soymariana/content';
import { useIsFocused } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Em } from '@/components/ui/AppText';
import { HeartMark } from '@/components/ui/Icons';
import { Reveal } from '@/components/ui/Reveal';
import { useCountUp } from '@/hooks/use-count-up';
import { colors, radii, shadows } from '@/theme';

const tint = {
  rosa: colors.rosaTint,
  azul: colors.azulTint,
  cereza: colors.cerezaTint,
  crema: colors.paper,
} as const;

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const focused = useIsFocused();
  const text = useCountUp(metric.value, metric.format, focused);
  return (
    <Reveal index={index}>
      <View
        accessible
        accessibilityLabel={`${text} ${metric.label}`}
        style={[styles.card, { backgroundColor: tint[metric.tone] }]}
      >
        <View style={styles.deco}>
          <HeartMark color={index % 2 === 0 ? colors.cereza : colors.azul} size={18} />
        </View>
        <AppText variant="number" importantForAccessibility="no">
          {text}
        </AppText>
        <AppText variant="body" importantForAccessibility="no">
          {metric.label}
        </AppText>
      </View>
    </Reveal>
  );
}

/**
 * Números honestos. Solo se muestran las métricas de metrics.json: no se inventa nada.
 * Las "pendientes" (audiencia, ciudades, engagement…) quedan ocultas hasta tener datos reales.
 */
export function MetricsBlock() {
  return (
    <View style={styles.wrap}>
      <AppText variant="eyebrow" color={colors.inkSoft} style={styles.eyebrow}>
        Los números
      </AppText>
      <AppText variant="h2" accessibilityRole="header">
        Sin <Em>maquillaje</Em>
      </AppText>

      <View style={styles.list}>
        {metrics.metrics.map((metric, i) => (
          <MetricCard key={metric.id} metric={metric} index={i} />
        ))}
      </View>

      <View style={[styles.updated, shadows.soft]}>
        <View style={styles.dot} />
        <AppText variant="small" color={colors.inkSoft}>
          Actualizado: {metrics.updatedAt}
        </AppText>
      </View>
      {metrics.note ? (
        <AppText variant="small" color={colors.inkSoft} style={styles.note}>
          {metrics.note}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 48 },
  eyebrow: { marginBottom: 10 },
  list: { marginTop: 22, gap: 14 },
  card: {
    borderRadius: radii.lg,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  deco: { position: 'absolute', right: 16, top: 14 },
  updated: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.pill,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.cereza },
  note: { marginTop: 10 },
});
