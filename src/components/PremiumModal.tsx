/**
 * Premium upgrade bottom-sheet modal.
 */
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS } from '../theme';

const FEATURES = [
  { h: 'Anlık Fırtına Uyarısı', p: "Kp endeksi 5'i geçtiğinde telefonunuza anlık bildirim gelir." },
  { h: 'Gelişmiş Hücresel Analiz', p: 'Hücresel uyanış ve DNA portal geçişlerine dair derin tavsiyeler.' },
  { h: 'Reklamsız Kozmik Deneyim', p: 'Frekansları hiçbir reklam bölünmesi olmadan dinleyin ve izleyin.' },
];

export default function PremiumModal({
  visible,
  onClose,
  onUpgrade,
}: {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <View style={styles.iconGlow}>
                <Text style={{ fontSize: 24 }}>⚡</Text>
              </View>
              <Text style={styles.h3}>Kozmik Portal Premium</Text>
              <Text style={styles.headerSub}>
                Evrensel Enerji Akışını Anlık Takip Edin
              </Text>
            </View>

            <View style={styles.features}>
              {FEATURES.map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Text style={styles.check}>✓</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.featureH}>{f.h}</Text>
                    <Text style={styles.featureP}>{f.p}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.priceBox}>
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>EN POPÜLER</Text>
              </View>
              <Text style={styles.priceTitle}>Yıllık Üyelik</Text>
              <Text style={styles.priceVal}>
                ₺399.99 <Text style={styles.priceUnit}>/ yıl</Text>
              </Text>
              <Text style={styles.priceDesc}>Aylık ₺33.33'a denk gelir</Text>
            </View>

            <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgrade} activeOpacity={0.85}>
              <Text style={styles.upgradeText}>Şimdi Premium'a Geç ›</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(3,3,8,0.75)' },
  sheet: {
    maxHeight: '85%',
    backgroundColor: '#0b0b16',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(212,175,55,0.35)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: COLORS.textMuted, fontSize: 14 },
  header: { alignItems: 'center', marginTop: 8, marginBottom: 20 },
  iconGlow: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderWidth: 1.5,
    borderColor: COLORS.primaryGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  h3: { fontFamily: FONTS.sansExtrabold, fontSize: 18, color: '#fff' },
  headerSub: { fontFamily: FONTS.sans, fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  features: {
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  featureItem: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  check: { color: COLORS.primaryGold, fontSize: 16, fontWeight: '700' },
  featureH: { fontFamily: FONTS.sansBold, fontSize: 12, color: '#fff' },
  featureP: { fontFamily: FONTS.sans, fontSize: 10, color: COLORS.textMuted, marginTop: 2, lineHeight: 14 },
  priceBox: {
    backgroundColor: 'rgba(212,175,55,0.05)',
    borderWidth: 1.5,
    borderColor: COLORS.primaryGold,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 6,
  },
  saveBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: COLORS.primaryGold,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  saveBadgeText: { fontFamily: FONTS.sansExtrabold, fontSize: 8, color: '#000', letterSpacing: 0.5 },
  priceTitle: { fontFamily: FONTS.sansBold, fontSize: 13, color: COLORS.primaryGold },
  priceVal: { fontFamily: FONTS.sansExtrabold, fontSize: 22, color: '#fff', marginVertical: 6 },
  priceUnit: { fontFamily: FONTS.sans, fontSize: 11, color: COLORS.textMuted },
  priceDesc: { fontFamily: FONTS.sans, fontSize: 10, color: COLORS.textMuted },
  upgradeBtn: {
    backgroundColor: COLORS.primaryGold,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
  },
  upgradeText: { fontFamily: FONTS.sansExtrabold, fontSize: 13, color: '#000' },
});
