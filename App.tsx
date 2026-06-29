/**
 * Schumann Rezonansı & Kozmik Akış — React Native (Expo).
 * Root: fonts → providers → auth gate.
 */
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
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import AuthScreen from './src/screens/AuthScreen';
import MainScreen from './src/screens/MainScreen';
import { COLORS } from './src/theme';

function Splash() {
  return (
    <View style={[styles.root, styles.center]}>
      <ActivityIndicator size="large" color={COLORS.primaryGold} />
    </View>
  );
}

function Root() {
  const { status } = useAuth();
  if (status === 'loading') return <Splash />;
  if (status === 'signedIn') return <MainScreen />;
  return <AuthScreen />;
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

  if (!fontsLoaded) return <Splash />;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bgSpace },
  center: { alignItems: 'center', justifyContent: 'center' },
});
