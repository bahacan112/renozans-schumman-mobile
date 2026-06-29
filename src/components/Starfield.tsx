/**
 * Animated cosmic starfield background + dynamic Kp aurora glow.
 * SVG-based port of the original canvas starfield.
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { COLORS } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Star = {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  twinkle: Animated.Value;
  duration: number;
};

export default function Starfield({ glowColor }: { glowColor: string }) {
  const { width, height } = Dimensions.get('window');

  const stars = useMemo<Star[]>(() => {
    const count = Math.min(140, Math.floor((width * height) / 9000));
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.3 + 0.5,
      baseOpacity: Math.random() * 0.6 + 0.2,
      twinkle: new Animated.Value(Math.random()),
      duration: 1200 + Math.random() * 2600,
    }));
  }, [width, height]);

  const driftRefs = useRef(stars);

  useEffect(() => {
    const loops = driftRefs.current.map((s) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(s.twinkle, {
            toValue: 1,
            duration: s.duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(s.twinkle, {
            toValue: 0.15,
            duration: s.duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      )
    );
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient
            id="aurora"
            cx="80%"
            cy="18%"
            rx="60%"
            ry="60%"
            fx="80%"
            fy="18%"
          >
            <Stop offset="0" stopColor={glowColor} stopOpacity={0.1} />
            <Stop offset="0.5" stopColor={glowColor} stopOpacity={0.03} />
            <Stop offset="1" stopColor={glowColor} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Rect x={0} y={0} width={width} height={height} fill={COLORS.bgSpace} />
        <Rect x={0} y={0} width={width} height={height} fill="url(#aurora)" />

        {stars.map((s, i) => (
          <AnimatedCircle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.size}
            fill="#ffffff"
            opacity={s.twinkle.interpolate({
              inputRange: [0, 1],
              outputRange: [s.baseOpacity * 0.3, s.baseOpacity],
            })}
          />
        ))}
      </Svg>
    </View>
  );
}
