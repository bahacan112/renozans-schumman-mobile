/**
 * Section 4 — Cosmic energy simulator. Drags Kp 0..9 and lets the parent
 * re-render every view against the simulated value.
 */
import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getKpSpiritualDetails } from '../kp';
import { COLORS, FONTS, KP_COLORS } from '../theme';

export default function Simulator({
  simulating,
  value,
  onChange,
  onReset,
}: {
  simulating: boolean;
  value: number;
  onChange: (v: number) => void;
  onReset: () => void;
}) {
  const activeColor = simulating ? getKpSpiritualDetails(value).color : '#fff';
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Kozmik Enerji Simülatörü</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>TEST PANELİ</Text>
        </View>
      </View>
      <Text style={styles.sub}>
        Farklı Kp seviyelerinin etkilerini ve renk değişimlerini test edin
      </Text>

      <View style={styles.sliderRow}>
        <Text style={styles.sliderEnd}>Kp 0</Text>
        <Slider
          style={{ flex: 1, height: 30 }}
          minimumValue={0}
          maximumValue={9}
          step={0.1}
          value={value}
          minimumTrackTintColor={COLORS.primaryGold}
          maximumTrackTintColor="rgba(255,255,255,0.12)"
          thumbTintColor={COLORS.primaryGold}
          onValueChange={onChange}
        />
        <Text style={[styles.sliderEnd, { textAlign: 'right' }]}>Kp 9</Text>
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Simüle Edilen Değer:</Text>
        <Text style={[styles.statusVal, { color: activeColor }]}>
          {simulating ? `Kp ${value.toFixed(1)}` : 'Canlı Akış'}
        </Text>
        {simulating && (
          <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
            <Text style={styles.resetText}>Canlı Veriye Dön</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(18,18,28,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
    borderRadius: 20,
    padding: 16,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontFamily: FONTS.sansBold, fontSize: 14, color: '#fff' },
  sub: { fontFamily: FONTS.sans, fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  badge: {
    backgroundColor: 'rgba(0,229,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.3)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { fontFamily: FONTS.sansExtrabold, fontSize: 8, color: KP_COLORS.portal },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  sliderEnd: { fontFamily: FONTS.mono, fontSize: 9, color: COLORS.textMuted, width: 30 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  statusLabel: { fontFamily: FONTS.sans, fontSize: 11, color: COLORS.textMuted },
  statusVal: { fontFamily: FONTS.sansBold, fontSize: 11, flex: 1 },
  resetBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  resetText: { fontFamily: FONTS.sans, fontSize: 9, color: '#fff' },
});
