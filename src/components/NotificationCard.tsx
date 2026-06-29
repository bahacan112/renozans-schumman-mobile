/**
 * Section 5 — Premium-gated notification preferences.
 * Premium users pick which Kp ranges they want to be notified about.
 */
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, KP_COLORS } from '../theme';

const BANDS = [
  { band: 1, label: 'Hareketlenme', range: 'Kp 3 – 5', color: KP_COLORS.unsettled },
  { band: 2, label: 'Jeomanyetik Fırtına', range: 'Kp 5 – 7', color: KP_COLORS.storm },
  { band: 3, label: 'Portal Geçişi', range: 'Kp 7+', color: KP_COLORS.portal },
];

export default function NotificationCard({
  isPremium,
  prefs,
  onTogglePref,
  onUnlockPress,
}: {
  isPremium: boolean;
  prefs: number[];
  onTogglePref: (band: number) => void;
  onUnlockPress: () => void;
}) {
  if (!isPremium) {
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onUnlockPress}>
        <View style={styles.row}>
          <Text style={styles.lockIcon}>🔒</Text>
          <View style={styles.info}>
            <View style={styles.titleRow}>
              <Text style={styles.h4}>Kozmik Rezonans Bildirimleri</Text>
              <View style={styles.lockBadge}>
                <Text style={styles.lockBadgeText}>PREMIUM</Text>
              </View>
            </View>
            <Text style={styles.desc}>
              Hangi Kp aralıklarında bildirim alacağınızı seçin. Premium'a yükselterek aktif edin.
            </Text>
          </View>
          <View style={styles.buyBtn}>
            <Text style={styles.buyText}>Satın Al</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  const anyOn = prefs.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <Text style={styles.lockIcon}>🔔</Text>
          <Text style={styles.h4}>Kozmik Rezonans Bildirimleri</Text>
        </View>
        <View style={[styles.activeBadge, !anyOn && styles.offBadge]}>
          <Text style={[styles.activeBadgeText, !anyOn && { color: '#fff' }]}>
            {anyOn ? 'AKTİF' : 'KAPALI'}
          </Text>
        </View>
      </View>
      <Text style={styles.desc}>
        Bildirim almak istediğiniz Kp aralıklarını seçin. Sadece seçtikleriniz hem uygulamada hem
        telefon bildirimi olarak gelir.
      </Text>

      <View style={styles.bandList}>
        {BANDS.map((b) => {
          const on = prefs.includes(b.band);
          return (
            <View key={b.band} style={styles.bandRow}>
              <View style={[styles.dot, { backgroundColor: b.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.bandLabel}>{b.label}</Text>
                <Text style={styles.bandRange}>{b.range}</Text>
              </View>
              <Switch
                value={on}
                onValueChange={() => onTogglePref(b.band)}
                trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(212,175,55,0.4)' }}
                thumbColor={on ? COLORS.primaryGold : '#7f7f95'}
                ios_backgroundColor="rgba(255,255,255,0.1)"
              />
            </View>
          );
        })}
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
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  lockIcon: { fontSize: 16 },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  h4: { fontFamily: FONTS.sansBold, fontSize: 12, color: '#fff' },
  desc: { fontFamily: FONTS.sans, fontSize: 10, color: COLORS.textMuted, marginTop: 8, lineHeight: 15 },
  lockBadge: { backgroundColor: COLORS.primaryGold, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  lockBadgeText: { fontFamily: FONTS.sansBlack, fontSize: 8, color: '#000', letterSpacing: 0.8 },
  activeBadge: { backgroundColor: KP_COLORS.portal, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  offBadge: { backgroundColor: 'rgba(255,255,255,0.15)' },
  activeBadgeText: { fontFamily: FONTS.sansBlack, fontSize: 8, color: '#000', letterSpacing: 0.8 },
  buyBtn: { borderWidth: 1.5, borderColor: 'rgba(212,175,55,0.45)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 },
  buyText: { fontFamily: FONTS.sansBold, fontSize: 11, color: COLORS.primaryGold },
  bandList: { marginTop: 12, gap: 4 },
  bandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  dot: { width: 9, height: 9, borderRadius: 4.5 },
  bandLabel: { fontFamily: FONTS.sansSemibold, fontSize: 12, color: '#fff' },
  bandRange: { fontFamily: FONTS.mono, fontSize: 10, color: COLORS.textMuted, marginTop: 1 },
});
