/**
 * Main authenticated screen — the Schumann dashboard.
 * Premium status is now server-backed via AuthContext.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ApiError, api, NotificationItem } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import GuideAccordion, { AnalysisCard } from '../components/GuideAccordion';
import NotificationCard from '../components/NotificationCard';
import NotificationsSheet from '../components/NotificationsSheet';
import PremiumModal from '../components/PremiumModal';
import Simulator from '../components/Simulator';
import Spectrogram, { SpecHover } from '../components/Spectrogram';
import Starfield from '../components/Starfield';
import StatusCard from '../components/StatusCard';
import Toast from '../components/Toast';
import TrendChart, { ChartHover } from '../components/TrendChart';
import { fetchSchumannData, HistoryPoint, SchumannData } from '../data';
import { formatTime, getKpSpiritualDetails } from '../kp';
import { COLORS, FONTS, KP_COLORS } from '../theme';

export default function MainScreen() {
  const insets = useSafeAreaInsets();
  const { user, token, signOut, upgradePremium } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);

  const [data, setData] = useState<SchumannData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [simulating, setSimulating] = useState(false);
  const [simKp, setSimKp] = useState(0);

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [premiumVisible, setPremiumVisible] = useState(false);

  const [specHover, setSpecHover] = useState<SpecHover>(null);
  const [chartHover, setChartHover] = useState<ChartHover>(null);
  const [toast, setToast] = useState<string | null>(null);

  const alertCooldown = useRef(false);
  const isPremium = Boolean(user?.isPremium);

  const showToast = useCallback((msg: string) => {
    setToast(null);
    requestAnimationFrame(() => setToast(msg));
  }, []);

  // Notification preference is a device-local setting
  useEffect(() => {
    AsyncStorage.getItem('schumann_notifications').then((n) =>
      setNotifEnabled(n === 'true')
    );
  }, []);

  const load = useCallback(async () => {
    const d = await fetchSchumannData();
    setData(d);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  // Notifications inbox (poll every 2 min)
  const loadNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.notifications(token);
      setNotifications(res.items);
      setUnread(res.unreadCount);
    } catch {
      // ignore transient errors
    }
  }, [token]);

  useEffect(() => {
    loadNotifications();
    const id = setInterval(loadNotifications, 2 * 60 * 1000);
    return () => clearInterval(id);
  }, [loadNotifications]);

  const openNotifications = async () => {
    setNotifOpen(true);
    await loadNotifications();
    if (token) {
      try {
        await api.markNotificationsRead(token);
      } catch {
        // ignore
      }
    }
    setUnread(0);
  };

  const activeKp = simulating ? simKp : data?.current_kp ?? 0;
  const baseHistory: HistoryPoint[] = data?.history ?? [];
  const history = simulating
    ? baseHistory.map((it, idx) => (idx === 15 ? { ...it, kp: simKp } : it))
    : baseHistory;

  const glowColor = getKpSpiritualDetails(activeKp).color;

  const onSimChange = (v: number) => {
    setSimulating(true);
    setSimKp(v);
    if (v >= 5 && notifEnabled && !alertCooldown.current) {
      alertCooldown.current = true;
      setTimeout(() => {
        showToast(
          `⚠️ KRİTİK KOZMİK AKIŞ: Kp ${v.toFixed(1)}! İyonosferde güçlü fırtına uyarısı. Derin DNA aktivasyon portalı açıldı.`
        );
        alertCooldown.current = false;
      }, 1200);
    }
  };

  const onSimReset = () => {
    setSimulating(false);
    setSimKp(0);
  };

  const onToggleNotif = async (v: boolean) => {
    setNotifEnabled(v);
    await AsyncStorage.setItem('schumann_notifications', String(v));
    showToast(
      v
        ? 'Kozmik Rezonans Bildirimleri Aktif! Anlık güneş fırtınası uyarıları cihazınıza iletilecektir.'
        : 'Kozmik rezonans bildirimleri kapatıldı.'
    );
  };

  const onUpgrade = async () => {
    try {
      await upgradePremium();
      setPremiumVisible(false);
      showToast('Ödeme başarılı! Kozmik Portal Premium üyeliğiniz aktif edildi.');
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Yükseltme başarısız oldu.');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Starfield glowColor={glowColor} />
      <Toast message={toast} topInset={insets.top + 60} />

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.headerBtn} onPress={openNotifications}>
          <Text style={[styles.headerBtnText, { fontSize: 17 }]}>🔔</Text>
          {unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.h1}>SCHUMANN REZONANSI</Text>
          <Text style={styles.h1sub}>Canlı Jeomanyetik Kp ve Kozmik Akış</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn} onPress={onRefresh}>
          <Text style={[styles.headerBtnText, { fontSize: 18 }]}>⟳</Text>
        </TouchableOpacity>
      </View>

      {loading && !data ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primaryGold} />
          <Text style={styles.loadingText}>Kozmik dalgalanmalar ölçülüyor...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 30 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primaryGold}
            />
          }
        >
          {/* Account / logout */}
          <View style={styles.accountCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.name || user?.email || '?').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.accountName} numberOfLines={1}>
                {user?.name || 'Kozmik Yolcu'}
              </Text>
              <Text style={styles.accountEmail} numberOfLines={1}>
                {user?.email}
                {isPremium ? '  ·  ⭐ Premium' : ''}
              </Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
              <Text style={styles.logoutText}>Çıkış</Text>
            </TouchableOpacity>
          </View>

          <StatusCard
            kp={activeKp}
            updatedLabel={data ? formatTime(data.updated_at) : '--:--'}
          />
          <Spectrogram history={history} hover={specHover} onHover={setSpecHover} />
          <TrendChart history={history} hover={chartHover} onHover={setChartHover} />
          <Simulator
            simulating={simulating}
            value={simKp}
            onChange={onSimChange}
            onReset={onSimReset}
          />
          <NotificationCard
            isPremium={isPremium}
            enabled={notifEnabled}
            onToggle={onToggleNotif}
            onUnlockPress={() => setPremiumVisible(true)}
          />
          <AnalysisCard text={getKpSpiritualDetails(activeKp).desc} />
          <GuideAccordion />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Schumann Kozmik Portal © 2026</Text>
            <Text style={styles.footerVersion}>v2.1.0 React Native</Text>
          </View>
        </ScrollView>
      )}

      <PremiumModal
        visible={premiumVisible}
        onClose={() => setPremiumVisible(false)}
        onUpgrade={onUpgrade}
      />

      <NotificationsSheet
        visible={notifOpen}
        items={notifications}
        onClose={() => setNotifOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgSpace },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'rgba(10,10,15,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderGold,
  },
  headerBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnGhost: { width: 42, height: 42 },
  headerBtnText: { color: COLORS.primaryGold, fontSize: 22, lineHeight: 24 },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: KP_COLORS.storm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(10,10,15,1)',
  },
  badgeText: { fontFamily: FONTS.sansExtrabold, fontSize: 9, color: '#fff' },
  headerTitle: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  h1: {
    fontFamily: FONTS.sansExtrabold,
    fontSize: 15,
    color: COLORS.primaryGold,
    letterSpacing: 0.5,
  },
  h1sub: { fontFamily: FONTS.sans, fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  loadingText: { fontFamily: FONTS.sans, fontSize: 13, color: COLORS.textMuted },
  content: { padding: 15, gap: 15 },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 16,
    padding: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: FONTS.sansExtrabold, fontSize: 16, color: COLORS.primaryGold },
  accountName: { fontFamily: FONTS.sansBold, fontSize: 13, color: '#fff' },
  accountEmail: { fontFamily: FONTS.sans, fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  logoutBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  logoutText: { fontFamily: FONTS.sansSemibold, fontSize: 11, color: COLORS.textMuted },
  footer: { alignItems: 'center', paddingVertical: 14, gap: 4 },
  footerText: { fontFamily: FONTS.sans, fontSize: 9, color: 'rgba(255,255,255,0.25)' },
  footerVersion: { fontFamily: FONTS.mono, fontSize: 8, color: 'rgba(255,255,255,0.15)' },
});
