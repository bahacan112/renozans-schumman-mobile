/**
 * Schumann Resonance — Design tokens
 * Ported from the original web SPA :root variables.
 */

export const KP_COLORS = {
  quiet: '#10b981', // Sakin - Emerald Green
  unsettled: '#f59e0b', // Kararsız - Amber/Gold
  active: '#f97316', // Aktif - Orange
  storm: '#ef4444', // Fırtına - Red
  portal: '#00e5ff', // Portal - Electric Cyan
  extreme: '#ffffff', // Ekstrem - Bright White
} as const;

export const COLORS = {
  primaryGold: '#d4af37',
  primaryGoldRgb: '212, 175, 55',
  bgDark: '#05050a',
  bgSpace: '#030308',
  bgCard: 'rgba(18, 18, 28, 0.55)',
  borderLight: 'rgba(255, 255, 255, 0.08)',
  borderGold: 'rgba(212, 175, 55, 0.2)',
  textMain: '#ffffff',
  textMuted: '#8e8ea8',
} as const;

export const FONTS = {
  sans: 'Outfit_400Regular',
  sansMedium: 'Outfit_500Medium',
  sansSemibold: 'Outfit_600SemiBold',
  sansBold: 'Outfit_700Bold',
  sansExtrabold: 'Outfit_800ExtraBold',
  sansBlack: 'Outfit_900Black',
  mono: 'JetBrainsMono_400Regular',
  monoBold: 'JetBrainsMono_700Bold',
} as const;
