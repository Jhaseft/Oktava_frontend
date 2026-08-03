// ─── Sistema de diseño OKtava ────────────────────────────────────────────────
// Interfaz clara: fondo blanco con detalles en negro y rojo elegante.
// Tipografía: Lemon Milk (https://www.dafont.com/es/lemon-milk.font).

export const colors = {
  // Superficies
  bg: '#ffffff', // fondo principal
  surface: '#f6f6f6', // tarjetas / superficies sutiles
  surfaceAlt: '#efefef',

  // Texto
  text: '#141414', // negro principal
  textMuted: '#6b6b6b', // texto secundario
  textFaint: '#9a9a9a',

  // Marca
  red: '#c1121f', // rojo elegante (acento principal)
  redDark: '#8d0e17',
  black: '#141414',
  white: '#ffffff',

  // Bordes / divisores
  border: '#e6e6e6',
  borderStrong: '#d4d4d4',
} as const;

// Familias registradas en app/_layout.tsx (expo-font).
export const fonts = {
  regular: 'LemonMilk',
  medium: 'LemonMilk-Medium',
  bold: 'LemonMilk-Bold',
  light: 'LemonMilk-Light',
} as const;
