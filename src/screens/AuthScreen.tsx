/**
 * Auth screen — sign-in / sign-up / forgot-password / reset-password,
 * plus Google sign-in. Single screen with an internal flow state (no nav lib).
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
import { ApiError, api } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import Starfield from '../components/Starfield';
import { COLORS, FONTS, KP_COLORS } from '../theme';

type Mode = 'login' | 'register';
type Flow = 'auth' | 'forgot' | 'reset';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [flow, setFlow] = useState<Flow>('auth');
  const [mode, setMode] = useState<Mode>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // reset flow
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const isLogin = mode === 'login';
  const clearMsgs = () => {
    setError(null);
    setNotice(null);
  };

  const run = async (fn: () => Promise<void>) => {
    clearMsgs();
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof ApiError || e instanceof Error ? e.message : 'Beklenmeyen bir hata oluştu.');
    } finally {
      setBusy(false);
    }
  };

  const submitAuth = () =>
    run(async () => {
      if (!email.trim() || !password) throw new Error('E-posta ve şifre gerekli.');
      if (password.length < 8) throw new Error('Şifre en az 8 karakter olmalı.');
      if (isLogin) await signIn(email, password);
      else await signUp(email, password, name);
    });

  const submitForgot = () =>
    run(async () => {
      if (!email.trim()) throw new Error('E-posta gerekli.');
      const res = await api.forgotPassword(email.trim());
      setDevCode(res.devCode ?? null);
      setResetCode(res.devCode ?? '');
      setNotice(
        res.devCode
          ? 'Geliştirme modu: kodunuz aşağıda hazır. Yeni şifrenizi belirleyin.'
          : 'Eğer bu e-posta kayıtlıysa, sıfırlama kodu gönderildi.'
      );
      setFlow('reset');
    });

  const submitReset = () =>
    run(async () => {
      if (resetCode.trim().length !== 6) throw new Error('6 haneli kodu girin.');
      if (newPassword.length < 8) throw new Error('Yeni şifre en az 8 karakter olmalı.');
      await api.resetPassword(email.trim(), resetCode.trim(), newPassword);
      setFlow('auth');
      setMode('login');
      setPassword('');
      setNewPassword('');
      setResetCode('');
      setDevCode(null);
      setNotice('Şifreniz güncellendi. Yeni şifrenizle giriş yapabilirsiniz.');
    });

  const onGoogle = async () => {
    clearMsgs();
    setGoogleBusy(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google girişi başarısız oldu.');
    } finally {
      setGoogleBusy(false);
    }
  };

  const goAuth = () => {
    clearMsgs();
    setFlow('auth');
  };

  return (
    <View style={styles.root}>
      <Starfield glowColor={KP_COLORS.portal} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoGlow}>
            <Text style={{ fontSize: 30 }}>🌌</Text>
          </View>
          <Text style={styles.title}>SCHUMANN REZONANSI</Text>
          <Text style={styles.subtitle}>
            {flow === 'auth' ? "Kozmik Portal'a Giriş" : flow === 'forgot' ? 'Şifre Sıfırlama' : 'Yeni Şifre Belirle'}
          </Text>

          <View style={styles.card}>
            {notice && <Text style={styles.notice}>{notice}</Text>}

            {/* ===== AUTH (login/register) ===== */}
            {flow === 'auth' && (
              <>
                <View style={styles.tabs}>
                  <TouchableOpacity
                    style={[styles.tab, isLogin && styles.tabActive]}
                    onPress={() => {
                      setMode('login');
                      clearMsgs();
                    }}
                  >
                    <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Giriş Yap</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tab, !isLogin && styles.tabActive]}
                    onPress={() => {
                      setMode('register');
                      clearMsgs();
                    }}
                  >
                    <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Kayıt Ol</Text>
                  </TouchableOpacity>
                </View>

                {!isLogin && (
                  <Field label="İsim (opsiyonel)" value={name} onChangeText={setName} placeholder="Adınız" autoCapitalize="words" />
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

                {isLogin && (
                  <TouchableOpacity onPress={() => { clearMsgs(); setFlow('forgot'); }}>
                    <Text style={styles.link}>Şifremi unuttum?</Text>
                  </TouchableOpacity>
                )}

                {error && <Text style={styles.error}>{error}</Text>}

                <PrimaryButton busy={busy} onPress={submitAuth} label={isLogin ? 'Giriş Yap' : 'Hesap Oluştur'} />

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>veya</Text>
                  <View style={styles.dividerLine} />
                </View>

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
              </>
            )}

            {/* ===== FORGOT (request code) ===== */}
            {flow === 'forgot' && (
              <>
                <Text style={styles.hint}>
                  Hesabınızın e-postasını girin; size 6 haneli bir sıfırlama kodu göndereceğiz.
                </Text>
                <Field
                  label="E-posta"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="ornek@eposta.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {error && <Text style={styles.error}>{error}</Text>}
                <PrimaryButton busy={busy} onPress={submitForgot} label="Sıfırlama Kodu Gönder" />
                <TouchableOpacity onPress={goAuth}>
                  <Text style={[styles.link, { textAlign: 'center', marginTop: 14 }]}>← Girişe dön</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ===== RESET (code + new password) ===== */}
            {flow === 'reset' && (
              <>
                {devCode && (
                  <View style={styles.devBox}>
                    <Text style={styles.devLabel}>GELİŞTİRME MODU — KODUNUZ</Text>
                    <Text style={styles.devCode}>{devCode}</Text>
                  </View>
                )}
                <Field
                  label="Sıfırlama Kodu (6 hane)"
                  value={resetCode}
                  onChangeText={setResetCode}
                  placeholder="000000"
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <Field
                  label="Yeni Şifre"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="En az 8 karakter"
                  secureTextEntry
                  autoCapitalize="none"
                />
                {error && <Text style={styles.error}>{error}</Text>}
                <PrimaryButton busy={busy} onPress={submitReset} label="Şifreyi Güncelle" />
                <TouchableOpacity onPress={goAuth}>
                  <Text style={[styles.link, { textAlign: 'center', marginTop: 14 }]}>← Girişe dön</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text style={styles.footer}>Devam ederek kozmik enerji akışını takip etmeyi kabul edersiniz.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function PrimaryButton({ busy, onPress, label }: { busy: boolean; onPress: () => void; label: string }) {
  return (
    <TouchableOpacity style={[styles.submit, busy && { opacity: 0.7 }]} onPress={onPress} disabled={busy} activeOpacity={0.85}>
      {busy ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>{label}</Text>}
    </TouchableOpacity>
  );
}

function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput {...props} placeholderTextColor="rgba(255,255,255,0.25)" style={styles.input} />
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
  title: { fontFamily: FONTS.sansExtrabold, fontSize: 18, color: COLORS.primaryGold, letterSpacing: 1 },
  subtitle: { fontFamily: FONTS.sans, fontSize: 12, color: COLORS.textMuted, marginTop: 4, marginBottom: 28 },
  card: {
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 20,
    padding: 20,
  },
  tabs: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  tabActive: { backgroundColor: 'rgba(212,175,55,0.15)', borderWidth: 1, borderColor: 'rgba(212,175,55,0.4)' },
  tabText: { fontFamily: FONTS.sansSemibold, fontSize: 13, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.primaryGold },
  field: { marginBottom: 14 },
  fieldLabel: { fontFamily: FONTS.sansMedium, fontSize: 11, color: COLORS.textMuted, marginBottom: 6 },
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
  link: { fontFamily: FONTS.sansSemibold, fontSize: 12, color: COLORS.primaryGold, marginTop: 2, marginBottom: 4 },
  hint: { fontFamily: FONTS.sans, fontSize: 12, color: COLORS.textMuted, lineHeight: 17, marginBottom: 16 },
  error: { fontFamily: FONTS.sansMedium, fontSize: 12, color: KP_COLORS.storm, marginTop: 4, marginBottom: 8 },
  notice: {
    fontFamily: FONTS.sansMedium,
    fontSize: 12,
    color: KP_COLORS.quiet,
    marginBottom: 14,
    lineHeight: 17,
  },
  submit: { backgroundColor: COLORS.primaryGold, borderRadius: 14, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
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
  googleG: { fontFamily: FONTS.sansBlack, fontSize: 16, color: '#4285F4', width: 20, textAlign: 'center' },
  googleText: { fontFamily: FONTS.sansSemibold, fontSize: 14, color: '#fff' },
  devBox: {
    backgroundColor: 'rgba(0,229,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,255,0.3)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  devLabel: { fontFamily: FONTS.sansBold, fontSize: 9, color: KP_COLORS.portal, letterSpacing: 1 },
  devCode: { fontFamily: FONTS.monoBold, fontSize: 26, color: '#fff', letterSpacing: 6, marginTop: 4 },
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
