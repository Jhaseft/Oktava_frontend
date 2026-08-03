/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./App.tsx", "./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Tipografía Lemon Milk (registrada en app/_layout.tsx vía expo-font).
      fontFamily: {
        lemon: ["LemonMilk"],
        "lemon-medium": ["LemonMilk-Medium"],
        "lemon-bold": ["LemonMilk-Bold"],
        "lemon-light": ["LemonMilk-Light"],
      },
      // Paleta de marca (fondo blanco, detalles negro + rojo elegante).
      colors: {
        brand: {
          red: "#c1121f",
          reddark: "#8d0e17",
          black: "#141414",
          muted: "#6b6b6b",
          border: "#e6e6e6",
          surface: "#f6f6f6",
        },
      },
    },
  },
  plugins: [],
}