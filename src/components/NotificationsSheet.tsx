/**
 * Bottom-sheet "inbox" listing Kp alert notifications.
 */
import React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NotificationItem } from '../api/client';
import { formatTime } from '../kp';
import { COLORS, FONTS, KP_COLORS } from '../theme';

function bandColor(band: number) {
  if (band >= 2) return KP_COLORS.portal;
  if (band >= 1) return KP_COLORS.storm;
  return KP_COLORS.quiet;
}

export default function NotificationsSheet({
  visible,
  items,
  onClose,
}: {
  visible: boolean;
  items: NotificationItem[];
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Bildirimler</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {items.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔔</Text>
              <Text style={styles.emptyText}>Henüz bildirim yok.</Text>
              <Text style={styles.emptySub}>
                Jeomanyetik fırtına (Kp ≥ 5) başladığında burada görünecek.
              </Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(it) => it.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 24 }}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={[styles.dot, { backgroundColor: bandColor(item.band) }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemBody}>{item.body}</Text>
                    <Text style={styles.itemTime}>{formatTime(new Date(item.createdAt).toISOString())}</Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(3,3,8,0.75)' },
  sheet: {
    maxHeight: '80%',
    minHeight: '45%',
    backgroundColor: '#0b0b16',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(212,175,55,0.3)',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: { fontFamily: FONTS.sansExtrabold, fontSize: 16, color: '#fff' },
  closeBtn: {
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
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, gap: 8 },
  emptyIcon: { fontSize: 34, opacity: 0.5 },
  emptyText: { fontFamily: FONTS.sansBold, fontSize: 14, color: '#fff' },
  emptySub: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 16,
  },
  item: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  itemTitle: { fontFamily: FONTS.sansBold, fontSize: 13, color: '#fff' },
  itemBody: {
    fontFamily: FONTS.sans,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
    lineHeight: 16,
  },
  itemTime: { fontFamily: FONTS.mono, fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 5 },
});
