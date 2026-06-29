/**
 * Floating in-app cosmic toast notification.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { COLORS, FONTS } from '../theme';

export default function Toast({
  message,
  topInset = 0,
}: {
  message: string | null;
  topInset?: number;
}) {
  const translateY = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (message) {
      Animated.spring(translateY, {
        toValue: topInset + 8,
        useNativeDriver: true,
        bounciness: 10,
      }).start();
      const t = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -120,
          duration: 350,
          useNativeDriver: true,
        }).start();
      }, 4200);
      return () => clearTimeout(t);
    } else {
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [message, topInset]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.toast, { transform: [{ translateY }] }]}>
      <Text style={styles.icon}>🔔</Text>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 0,
    left: 15,
    right: 15,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(15,15,25,0.97)',
    borderWidth: 1,
    borderColor: COLORS.primaryGold,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  icon: { fontSize: 18 },
  text: { flex: 1, fontFamily: FONTS.sansMedium, fontSize: 12, color: '#fff', lineHeight: 17 },
});
