/**
 * Section 1 — Current status dashboard with pulsing radial Kp ring.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { getKpSpiritualDetails } from '../kp';
import { COLORS, FONTS } from '../theme';

const RING = 82;

export default function StatusCard({
  kp,
  updatedLabel,
}: {
  kp: number;
  updatedLabel: string;
}) {
  const details = getKpSpiritualDetails(kp);
  const pulse = useRef(new Animated.Value(0)).current;

  // Higher Kp -> faster pulse (1s min, 4s max), mirroring the web version.
  const duration = Math.max(1, 4 - kp / 3) * 1000;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [duration]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });

  return (
    <View style={styles.card}>
      <Animated.View
        style={[
          styles.ringContainer,
          {
            transform: [{ scale }],
            shadowColor: details.color,
            borderColor: details.color,
          },
        ]}
      >
        <Svg
          width={RING}
          height={RING}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Circle
            cx={RING / 2}
            cy={RING / 2}
            r={RING / 2 - 4}
            stroke={details.color}
            strokeWidth={3.5}
            fill="rgba(0,0,0,0.55)"
            opacity={0.9}
          />
        </Svg>
        <Text style={[styles.kpValue, { color: details.color }]}>
          {kp.toFixed(2)}
        </Text>
        <Text style={styles.kpUnit}>Kp</Text>
      </Animated.View>

      <View style={styles.info}>
        <Text style={styles.label}>{details.label}</Text>
        <Text style={styles.spiritual}>{details.spiritual}</Text>
        <Text style={styles.update}>Son Ölçüm: {updatedLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'rgba(14,14,22,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 16,
  },
  ringContainer: {
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    borderWidth: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  kpValue: {
    fontFamily: FONTS.monoBold,
    fontSize: 20,
    lineHeight: 22,
  },
  kpUnit: {
    fontFamily: FONTS.sansBold,
    fontSize: 9,
    textTransform: 'uppercase',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  info: { flex: 1 },
  label: {
    fontFamily: FONTS.sansBold,
    fontSize: 15,
    color: '#fff',
  },
  spiritual: {
    fontFamily: FONTS.sansSemibold,
    fontSize: 11,
    color: COLORS.primaryGold,
    marginTop: 3,
  },
  update: {
    fontFamily: FONTS.sans,
    fontSize: 9,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});
