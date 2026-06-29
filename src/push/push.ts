/**
 * FCM push registration + handlers (@react-native-firebase, modular API).
 * All Firebase access is guarded: if the native Firebase app isn't configured
 * (e.g. google-services not applied), push is skipped without crashing — the
 * in-app inbox (polling) keeps working.
 */
import { getApp } from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  requestPermission,
  type FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { api } from '../api/client';

const noop = () => {};

/** Returns the messaging instance, or null if Firebase isn't ready. */
function safeMessaging(): FirebaseMessagingTypes.Module | null {
  try {
    return getMessaging(getApp());
  } catch (e) {
    console.warn('[push] Firebase not configured — push disabled', e);
    return null;
  }
}

async function ensurePermission(
  messaging: FirebaseMessagingTypes.Module
): Promise<boolean> {
  if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
    const res = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (res !== PermissionsAndroid.RESULTS.GRANTED) return false;
  }
  const status = await requestPermission(messaging);
  return (
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL
  );
}

/** Request permission, get the FCM token, register it with the backend. */
export async function registerForPush(userToken: string): Promise<void> {
  try {
    const messaging = safeMessaging();
    if (!messaging) return;
    if (!(await ensurePermission(messaging))) return;
    const fcmToken = await getToken(messaging);
    if (fcmToken) await api.registerPushToken(userToken, fcmToken);
  } catch (e) {
    console.warn('[push] register failed', e);
  }
}

/** Re-register when FCM rotates the token. Returns an unsubscribe fn. */
export function watchTokenRefresh(userToken: string): () => void {
  const messaging = safeMessaging();
  if (!messaging) return noop;
  return onTokenRefresh(messaging, async (t) => {
    try {
      await api.registerPushToken(userToken, t);
    } catch {
      // ignore
    }
  });
}

/** Foreground messages don't show a system notification; surface them in-app. */
export function watchForegroundMessages(
  onMsg: (title: string, body: string) => void
): () => void {
  const messaging = safeMessaging();
  if (!messaging) return noop;
  return onMessage(messaging, async (msg) => {
    const n = msg.notification;
    if (n) onMsg(n.title || 'Kozmik Bildirim', n.body || '');
  });
}
