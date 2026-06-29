/**
 * Section 2 — Schumann resonance waterfall spectrogram (SVG).
 * Each 3-hour block renders 5 frequency bands (7.8/14/20/26/32 Hz) whose
 * intensity is driven by the interpolated Kp value. Tap a column for details.
 */
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import type { HistoryPoint } from '../data';
import { formatTimeRange, getKpSpiritualDetails } from '../kp';
import { COLORS, FONTS, KP_COLORS } from '../theme';

const H = 135;
const COL_W = 34;
const HZ_LABELS = ['32 Hz', '26 Hz', '20 Hz', '14 Hz', '7.8 Hz'];

// vertical band centers (top->bottom) and their intensity multipliers
const BANDS = [
  { yPct: 0.12, alpha: 0.12 }, // 32 Hz
  { yPct: 0.32, alpha: 0.22 }, // 26 Hz
  { yPct: 0.52, alpha: 0.38 }, // 20 Hz
  { yPct: 0.72, alpha: 0.62 }, // 14 Hz
  { yPct: 0.9, alpha: 0.95 }, // 7.8 Hz fundamental
];
const BAND_H = 16;

function kpRGB(kp: number): string {
  if (kp < 3) return '16,185,129';
  if (kp < 4) return '245,158,11';
  if (kp < 5) return '249,115,22';
  if (kp < 8) return '239,68,68';
  return '0,229,255';
}

export type SpecHover = {
  time: string;
  kp: number;
  predicted: boolean;
} | null;

export default function Spectrogram({
  history,
  hover,
  onHover,
}: {
  history: HistoryPoint[];
  hover: SpecHover;
  onHover: (h: SpecHover) => void;
}) {
  const now = Date.now();
  const width = Math.max(history.length * COL_W, 1);

  // index of NOW divider
  const t0 = history.length ? new Date(history[0].time).getTime() : 0;
  const tN = history.length
    ? new Date(history[history.length - 1].time).getTime()
    : 0;
  const nowX =
    history.length && now >= t0 && now <= tN
      ? ((now - t0) / (tN - t0)) * width
      : -1;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Schumann Rezonans Spektrogramı</Text>
        <Text style={styles.sub}>
          Atmosferik boşlukta rezonans frekanslarının uyarılma şiddeti
        </Text>
      </View>

      {/* Tooltip */}
      <View style={styles.tooltipBar}>
        {hover ? (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>
              Zaman: <Text style={{ color: '#fff' }}>{formatTimeRange(hover.time)}</Text>
              {hover.predicted ? ' (Tahmin)' : ' (Ölçüm)'} |{' '}
              Kp:{' '}
              <Text style={{ color: getKpSpiritualDetails(hover.kp).color }}>
                {hover.kp.toFixed(2)}
              </Text>{' '}
              | <Text style={{ color: getKpSpiritualDetails(hover.kp).color }}>
                {getKpSpiritualDetails(hover.kp).label}
              </Text>
            </Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>
            Detayları görmek için dalgaların üzerine dokunun
          </Text>
        )}
      </View>

      {/* Canvas area */}
      <View style={styles.specRow}>
        <View style={styles.hzScale}>
          {HZ_LABELS.map((l) => (
            <Text key={l} style={styles.hzLabel}>
              {l}
            </Text>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
        >
          <Svg width={width} height={H}>
            <Rect x={0} y={0} width={width} height={H} fill={COLORS.bgSpace} />

            {history.map((item, i) => {
              const x = i * COL_W;
              const itemTime = new Date(item.time).getTime();
              const forecast = itemTime >= now;
              const rgb = kpRGB(item.kp);
              const dim = forecast ? 0.35 : 1;
              const intensity = Math.min(1, item.kp / 9 + 0.15);

              return (
                <React.Fragment key={i}>
                  {BANDS.map((b, bi) => (
                    <Rect
                      key={bi}
                      x={x + 1}
                      y={b.yPct * H - BAND_H / 2}
                      width={COL_W - 2}
                      height={BAND_H}
                      rx={3}
                      fill={`rgb(${rgb})`}
                      opacity={b.alpha * dim * intensity}
                    />
                  ))}
                  {/* invisible hit target */}
                  <Rect
                    x={x}
                    y={0}
                    width={COL_W}
                    height={H}
                    fill="transparent"
                    onPressIn={() => onHover(item)}
                  />
                  {hover && hover.time === item.time && (
                    <Rect
                      x={x}
                      y={0}
                      width={COL_W}
                      height={H}
                      fill="rgba(255,255,255,0.06)"
                      stroke="rgba(255,255,255,0.25)"
                      strokeWidth={0.5}
                    />
                  )}
                </React.Fragment>
              );
            })}

            {nowX >= 0 && (
              <Line
                x1={nowX}
                y1={0}
                x2={nowX}
                y2={H}
                stroke={KP_COLORS.portal}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            )}
          </Svg>
        </ScrollView>
      </View>
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
  tooltipBar: {
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  tooltip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  tooltipText: { fontFamily: FONTS.sans, fontSize: 9, color: COLORS.textMuted },
  placeholder: {
    fontFamily: FONTS.sans,
    fontSize: 9,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  specRow: {
    flexDirection: 'row',
    height: H,
    backgroundColor: COLORS.bgSpace,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  hzScale: {
    width: 44,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#06060c',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.06)',
  },
  hzLabel: { fontFamily: FONTS.mono, fontSize: 8, color: COLORS.primaryGold },
  scroll: { flex: 1 },
});
