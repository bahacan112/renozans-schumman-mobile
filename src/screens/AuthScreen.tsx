/**
 * Sign-in / Sign-up screen with the app's cosmic theme.
 */
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiError } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import Starfield from '../components/Starfield';
import { COLORS, FONTS, KP_COLORS } from '../theme';

type Mode = 'login' | 'register';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [googleBusy, setGoogleBusy] = useState(false);
  const isLogin = mode === 'login';

  const onGoogle = async () => {
    setError(null);
    setGoogleBusy(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google girişi başarısız oldu.');
    } finally {
      setGoogleBusy(false);
    }
  };

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError('E-posta ve şifre gerekli.');
      return;
    }
    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalı.');
      return;
    }
    setBusy(true);
    try {
      if (isLogin) await signIn(email, password);
      else await signUp(email, password, name);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Beklenmeyen bir hata oluştu.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <Starfield glowColor={KP_COLORS.portal} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoGlow}>
            <Text style={{ fontSize: 30 }}>🌌</Text>
          </View>
          <Text style={styles.title}>SCHUMANN REZONANSI</Text>
          <Text style={styles.subtitle}>Kozmik Portal'a Giriş</Text>

          <View style={styles.card}>
            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, isLogin && styles.tabActive]}
                onPress={() => {
                  setMode('login');
                  setError(null);
                }}
              >
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                  Giriş Yap
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, !isLogin && styles.tabActive]}
                onPress={() => {
                  setMode('register');
                  setError(null);
                }}
              >
                <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                  Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <Field
                label="İsim (opsiyonel)"
                value={name}
                onChangeText={setName}
                placeholder="Adınız"
                autoCapitalize="words"
              />
            )}
            <Field
              label="E-posta"
              value={email}
              onChangeText={setEmail}
              placeholder="ornek@eposta.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Field
              label="Şifre"
              value={password}
              onChangeText={setPassword}
              placeholder="En az 8 karakter"
              secureTextEntry
              autoCapitalize="none"
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity
              style={[styles.submit, busy && { opacity: 0.7 }]}
              onPress={submit}
              disabled={busy}
              activeOpacity={0.85}
            >
              {busy ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.submitText}>
                  {isLogin ? 'Giriş Yap' : 'Hesap Oluştur'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google */}
            <TouchableOpacity
              style={[styles.googleBtn, googleBusy && { opacity: 0.7 }]}
              onPress={onGoogle}
              disabled={googleBusy}
              activeOpacity={0.85}
            >
              {googleBusy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.googleG}>G</Text>
                  <Text style={styles.googleText}>Google ile devam et</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            Devam ederek kozmik enerji akışını takip etmeyi kabul edersiniz.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor="rgba(255,255,255,0.25)"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgSpace },
  content: { paddingHorizontal: 24, alignItems: 'center' },
  logoGlow: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderWidth: 1.5,
    borderColor: COLORS.primaryGold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONTS.sansExtrabold,
    fontSize: 18,
    color: COLORS.primaryGold,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 28,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 20,
    padding: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  tabActive: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
  },
  tabText: { fontFamily: FONTS.sansSemibold, fontSize: 13, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primaryGold },
  field: { marginBottom: 14 },
  fieldLabel: {
    fontFamily: FONTS.sansMedium,
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    fontFamily: FONTS.sans,
    fontSize: 14,
  },
  error: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: KP_COLORS.storm,
    marginTop: 4,
    marginBottom: 8,
  },
  submit: {
    backgroundColor: COLORS.primaryGold,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: { fontFamily: FONTS.sansExtrabold, fontSize: 14, color: '#000' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { fontFamily: FONTS.sans, fontSize: 11, color: COLORS.textMuted },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    paddingVertical: 14,
  },
  googleG: {
    fontFamily: FONTS.sansBlack,
    fontSize: 16,
    color: '#4285F4',
    width: 20,
    textAlign: 'center',
  },
  googleText: { fontFamily: FONTS.sansSemibold, fontSize: 14, color: '#fff' },
  footer: {
    fontFamily: FONTS.sans,
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 15,
  },
});
