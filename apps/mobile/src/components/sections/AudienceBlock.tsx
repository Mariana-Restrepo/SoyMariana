import type { MetricsFile } from '@soymariana/content';
import { formatPercent } from '@soymariana/core';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Reveal } from '@/components/ui/Reveal';
import { colors, radii, shadows } from '@/theme';

type Audience = NonNullable<MetricsFile['audience']>;

/**
 * Quién me acompaña: edad, país y género en barras de porcentaje (mismos datos que la web).
 * El valor siempre está en texto; la barra es solo apoyo visual. Cada grupo dice de quién
 * son los datos (seguidores o espectadores).
 */
export function AudienceBlock({ audience }: { audience: Audience }) {
  return (
    <View style={styles.wrap}>
      <AppText variant="h3" accessibilityRole="header">
        {audience.title}
      </AppText>

      <View style={styles.groups}>
        {audience.groups.map((group, groupIndex) => {
          const top = Math.max(...group.items.map((item) => item.value));
          return (
            <Reveal key={group.id} index={groupIndex}>
              <View style={[styles.card, shadows.soft]}>
                <AppText variant="h3" accessibilityRole="header" style={styles.groupTitle}>
                  {group.title}
                </AppText>
                <AppText variant="small" color={colors.inkSoft}>
                  {group.caption}
                </AppText>

                <View style={styles.rows}>
                  {group.items.map((item) => {
                    const isTop = item.value === top;
                    const value = formatPercent(item.value);
                    return (
                      <View
                        key={item.label}
                        accessible
                        accessibilityLabel={`${item.label}: ${value}`}
                      >
                        <View style={styles.rowText}>
                          <AppText variant="small" importantForAccessibility="no">
                            {item.label}
                          </AppText>
                          <AppText
                            variant={isTop ? 'label' : 'small'}
                            color={isTop ? colors.cerezaInk : colors.ink}
                            importantForAccessibility="no"
                          >
                            {value}
                          </AppText>
                        </View>
                        <View style={styles.track}>
                          <View
                            style={[
                              styles.bar,
                              {
                                width: `${item.value}%`,
                                backgroundColor: isTop ? colors.cereza : colors.rosa,
                              },
                            ]}
                          />
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            </Reveal>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 40 },
  groups: { marginTop: 18, gap: 14 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 22,
  },
  groupTitle: { fontSize: 22, lineHeight: 26 },
  rows: { marginTop: 16, gap: 14 },
  rowText: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  track: {
    marginTop: 6,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(43, 31, 38, 0.1)',
    overflow: 'hidden',
  },
  bar: { height: '100%', minWidth: 3, borderRadius: radii.pill },
});
