/**
 * Auth state: persists the backend JWT, restores the session on boot,
 * and exposes sign-in / sign-up / sign-out / premium actions.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { api, AuthUser, GOOGLE_WEB_CLIENT_ID } from '../api/client';

GoogleSignin.configure({ webClientId: GOOGLE_WEB_CLIENT_ID });

const TOKEN_KEY = 'auth_token';

type Status = 'loading' | 'signedOut' | 'signedIn';

type AuthContextValue = {
  status: Status;
  user: AuthUser | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  upgradePremium: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const persist = useCallback(async (t: string, u: AuthUser) => {
    setToken(t);
    setUser(u);
    setStatus('signedIn');
    await AsyncStorage.setItem(TOKEN_KEY, t);
  }, []);

  // Restore session on boot
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(TOKEN_KEY);
      if (!saved) {
        setStatus('signedOut');
        return;
      }
      try {
        const { user: u } = await api.me(saved);
        setToken(saved);
        setUser(u);
        setStatus('signedIn');
      } catch {
        // expired/invalid token
        await AsyncStorage.removeItem(TOKEN_KEY);
        setStatus('signedOut');
      }
    })();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { token: t, user: u } = await api.login(email.trim(), password);
      await persist(t, u);
    },
    [persist]
  );

  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      const { token: t, user: u } = await api.register(email.trim(), password, name?.trim());
      await persist(t, u);
    },
    [persist]
  );

  const signInWithGoogle = useCallback(async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    let response;
    try {
      response = await GoogleSignin.signIn();
    } catch (e: any) {
      if (e?.code === statusCodes.SIGN_IN_CANCELLED) return; // user dismissed
      throw new Error('Google girişi başlatılamadı.');
    }
    if (!isSuccessResponse(response)) return; // cancelled
    const idToken = response.data.idToken;
    if (!idToken) throw new Error('Google kimlik anahtarı alınamadı.');
    const { token: t, user: u } = await api.google(idToken);
    await persist(t, u);
  }, [persist]);

  const signOut = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
    } catch {
      // not signed in with Google; ignore
    }
    await AsyncStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setStatus('signedOut');
  }, []);

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const { user: u } = await api.me(token);
      setUser(u);
    } catch {
      await signOut();
    }
  }, [token, signOut]);

  const upgradePremium = useCallback(async () => {
    if (!token) return;
    const { user: u } = await api.upgradePremium(token);
    setUser(u);
  }, [token]);

  const value = useMemo(
    () => ({ status, user, token, signIn, signUp, signInWithGoogle, signOut, upgradePremium, refresh }),
    [status, user, token, signIn, signUp, signInWithGoogle, signOut, upgradePremium, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
