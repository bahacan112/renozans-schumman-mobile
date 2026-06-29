/**
 * Section 5 — Premium-gated cosmic notification toggle.
 */
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, KP_COLORS } from '../theme';

export default function NotificationCard({
  isPremium,
  enabled,
  onToggle,
  onUnlockPress,
}: {
  isPremium: boolean;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  onUnlockPress: () => void;
}) {
  if (!isPremium) {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={onUnlockPress}
      >
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
              Bu özellik Premium üyelerimiz içindir. Premium'a yükselterek
              bildirimleri aktif edebilirsiniz.
            </Text>
          </View>
          <View style={styles.buyBtn}>
            <Text style={styles.buyText}>Satın Al</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={[styles.lockIcon, enabled && { opacity: 1 }]}>🔔</Text>
        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.h4}>Kozmik Rezonans Bildirimleri</Text>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>AKTİF</Text>
            </View>
          </View>
          <Text style={styles.desc}>
            Manyetik fırtınalarda (Kp ≥ 5) anlık uyanış kapısı ve güneş fırtınası
            uyarıları alın.
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(212,175,55,0.4)' }}
          thumbColor={enabled ? COLORS.primaryGold : '#7f7f95'}
          ios_backgroundColor="rgba(255,255,255,0.1)"
        />
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
  lockIcon: { fontSize: 18 },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  h4: { fontFamily: FONTS.sansBold, fontSize: 12, color: '#fff' },
  desc: { fontFamily: FONTS.sans, fontSize: 10, color: COLORS.textMuted, marginTop: 4, lineHeight: 14 },
  lockBadge: {
    backgroundColor: COLORS.primaryGold,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  lockBadgeText: { fontFamily: FONTS.sansBlack, fontSize: 8, color: '#000', letterSpacing: 0.8 },
  activeBadge: {
    backgroundColor: KP_COLORS.portal,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeBadgeText: { fontFamily: FONTS.sansBlack, fontSize: 8, color: '#000', letterSpacing: 0.8 },
  buyBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(212,175,55,0.45)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  buyText: { fontFamily: FONTS.sansBold, fontSize: 11, color: COLORS.primaryGold },
});
