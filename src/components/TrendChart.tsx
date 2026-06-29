/**
 * Section 3 — Geomagnetic Kp trend bar chart (last 72h) with NOW divider,
 * dashed forecast bars, legend and tap-for-detail tooltip.
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { HistoryPoint } from '../data';
import { formatTimeRange, getKpSpiritualDetails } from '../kp';
import { COLORS, FONTS, KP_COLORS } from '../theme';

const CHART_H = 120;

export type ChartHover = HistoryPoint | null;

export default function TrendChart({
  history,
  hover,
  onHover,
}: {
  history: HistoryPoint[];
  hover: ChartHover;
  onHover: (h: ChartHover) => void;
}) {
  const now = Date.now();
  const t0 = history.length ? new Date(history[0].time).getTime() : 0;
  const tEnd = history.length
    ? new Date(history[history.length - 1].time).getTime() + 3 * 60 * 60 * 1000
    : 0;
  const nowPct =
    history.length && now >= t0 && now <= tEnd ? (now - t0) / (tEnd - t0) : -1;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Jeomanyetik Kp Eğilimi (Son 72 Saat)</Text>
        <Text style={styles.sub}>
          Ölçülen ve tahmin edilen jeomanyetik fırtına değerleri
        </Text>
      </View>

      <View style={styles.tooltipBar}>
        {hover ? (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>
              Zaman: {formatTimeRange(hover.time)}
              {hover.predicted ? ' (Tahmin)' : ' (Ölçüm)'} | Kp:{' '}
              <Text style={{ color: getKpSpiritualDetails(hover.kp).color }}>
                {hover.kp.toFixed(2)}
              </Text>
            </Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>
            Detayları görmek için sütunların üzerine dokunun
          </Text>
        )}
      </View>

      <View style={styles.chartOuter}>
        <View style={styles.chart}>
          {history.map((item, i) => {
            const itemTime = new Date(item.time).getTime();
            const predicted = itemTime >= now;
            const color = getKpSpiritualDetails(item.kp).color;
            const heightPct = Math.max(10, (item.kp / 9) * 100);
            const active = hover?.time === item.time;
            return (
              <TouchableOpacity
                key={i}
                style={styles.barWrap}
                activeOpacity={0.7}
                onPress={() => onHover(item)}
              >
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${heightPct}%`,
                      backgroundColor: predicted ? 'transparent' : color,
                      borderColor: color,
                      borderWidth: predicted ? 1 : 0,
                      borderStyle: predicted ? 'dashed' : 'solid',
                      opacity: predicted ? 0.7 : active ? 1 : 0.92,
                      shadowColor: color,
                      shadowOpacity: active ? 0.9 : 0,
                      shadowRadius: 8,
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}

          {nowPct >= 0 && (
            <View
              pointerEvents="none"
              style={[styles.nowDivider, { left: `${nowPct * 100}%` }]}
            >
              <Text style={styles.nowText}>ŞİMDİ</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.legend}>
        <Legend dot={KP_COLORS.quiet} label="Sakin (0-3)" />
        <Legend dot={KP_COLORS.active} label="Aktif (3-5)" />
        <Legend dot={KP_COLORS.storm} label="Fırtına (5+)" />
        <Legend dashed label="Tahmin" />
      </View>
    </View>
  );
}

function Legend({
  dot,
  dashed,
  label,
}: {
  dot?: string;
  dashed?: boolean;
  label: string;
}) {
  return (
    <View style={styles.legendItem}>
      {dashed ? (
        <View style={styles.legendDashed} />
      ) : (
        <View style={[styles.legendDot, { backgroundColor: dot }]} />
      )}
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 20,
    padding: 16,
  },
  header: { marginBottom: 12 },
  title: { fontFamily: FONTS.sansBold, fontSize: 14, color: '#fff' },
  sub: { fontFamily: FONTS.sans, fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  tooltipBar: { minHeight: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  tooltip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  tooltipText: { fontFamily: FONTS.sans, fontSize: 9, color: COLORS.textMuted },
  placeholder: { fontFamily: FONTS.sans, fontSize: 9, color: COLORS.textMuted, fontStyle: 'italic' },
  chartOuter: {
    height: CHART_H,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    marginTop: 5,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    position: 'relative',
  },
  barWrap: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 1,
  },
  bar: { width: '100%', borderRadius: 2 },
  nowDivider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1.5,
    backgroundColor: KP_COLORS.portal,
    alignItems: 'center',
  },
  nowText: {
    position: 'absolute',
    top: -12,
    fontFamily: FONTS.sansExtrabold,
    fontSize: 7,
    color: KP_COLORS.portal,
    backgroundColor: COLORS.bgDark,
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: KP_COLORS.portal,
    width: 34,
    textAlign: 'center',
    marginLeft: -17,
  },
  legend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, flexWrap: 'wrap', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendDashed: {
    width: 7,
    height: 7,
    borderRadius: 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primaryGold,
  },
  legendLabel: { fontFamily: FONTS.sans, fontSize: 9, color: COLORS.textMuted },
});
