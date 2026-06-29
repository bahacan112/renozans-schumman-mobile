/**
 * Schumann Rezonansı & Kozmik Akış — React Native (Expo) port.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
  useFonts,
} from '@expo-google-fonts/outfit';
import { StatusBar } from 'expo-status-bar';
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
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import GuideAccordion, { AnalysisCard } from './src/components/GuideAccordion';
import NotificationCard from './src/components/NotificationCard';
import PremiumModal from './src/components/PremiumModal';
import Simulator from './src/components/Simulator';
import Spectrogram, { SpecHover } from './src/components/Spectrogram';
import Starfield from './src/components/Starfield';
import StatusCard from './src/components/StatusCard';
import Toast from './src/components/Toast';
import TrendChart, { ChartHover } from './src/components/TrendChart';
import { fetchSchumannData, HistoryPoint, SchumannData } from './src/data';
import { formatTime, getKpSpiritualDetails } from './src/kp';
import { COLORS, FONTS } from './src/theme';

function AppInner() {
  const insets = useSafeAreaInsets();

  const [data, setData] = useState<SchumannData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [simulating, setSimulating] = useState(false);
  const [simKp, setSimKp] = useState(0);

  const [isPremium, setIsPremium] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [premiumVisible, setPremiumVisible] = useState(false);

  const [specHover, setSpecHover] = useState<SpecHover>(null);
  const [chartHover, setChartHover] = useState<ChartHover>(null);
  const [toast, setToast] = useState<string | null>(null);

  const alertCooldown = useRef(false);

  const showToast = useCallback((msg: string) => {
    setToast(null);
    requestAnimationFrame(() => setToast(msg));
  }, []);

  // Load persisted prefs once
  useEffect(() => {
    (async () => {
      const [p, n] = await Promise.all([
        AsyncStorage.getItem('is_premium'),
        AsyncStorage.getItem('schumann_notifications'),
      ]);
      setIsPremium(p === 'true');
      setNotifEnabled(n === 'true');
    })();
  }, []);

  const load = useCallback(async () => {
    const d = await fetchSchumannData();
    setData(d);
    setLoading(false);
    setRefreshing(false);
  }, []);

  // Initial fetch + 5-minute background poll
  useEffect(() => {
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [load]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load();
  }, [load]);

  // Active Kp + history (apply simulated peak at "now" index 15)
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
    setIsPremium(true);
    await AsyncStorage.setItem('is_premium', 'true');
    setPremiumVisible(false);
    showToast('Ödeme başarılı! Kozmik Portal Premium üyeliğiniz aktif edildi.');
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <Starfield glowColor={glowColor} />
      <Toast message={toast} topInset={insets.top + 60} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() =>
            showToast('Bu özellik Schumann Rezonansı ana uygulamasında aktif olacaktır.')
          }
        >
          <Text style={styles.headerBtnText}>‹</Text>
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
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primaryGold} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppInner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgSpace },
  center: { alignItems: 'center', justifyContent: 'center' },
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
  headerBtnText: { color: COLORS.primaryGold, fontSize: 22, lineHeight: 24 },
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
  footer: { alignItems: 'center', paddingVertical: 14, gap: 4 },
  footerText: { fontFamily: FONTS.sans, fontSize: 9, color: 'rgba(255,255,255,0.25)' },
  footerVersion: { fontFamily: FONTS.mono, fontSize: 8, color: 'rgba(255,255,255,0.15)' },
});
