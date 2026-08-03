import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, DefaultTheme } from "@react-navigation/native";
import { View } from "react-native";
import { useFonts } from "expo-font";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/src/theme/theme";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";
import { OrderProvider } from "@/src/context/OrderContext";
import { StoreStatusProvider } from "@/src/context/StoreStatusContext";
import { useNotifications } from "@/src/hooks/useNotifications";
import { registerPushToken } from "@/src/services/notifications.service";
import { UpdateGate } from "@/src/components/ui/UpdateGate";

// Interfaz clara: fondo blanco de navegación (React Navigation) detrás de
// pantallas y de las zonas transparentes de la tab bar.
const NavTheme = {
  ...DefaultTheme,
  dark: false,
  colors: { ...DefaultTheme.colors, background: colors.bg, card: colors.bg },
};

function AppInit() {
  const { expoPushToken } = useNotifications();
  const { token } = useAuth();

  // TEMPORAL (solo para pruebas): imprime el push token para copiarlo.
  useEffect(() => {
    if (expoPushToken) console.log('📱 Expo Push Token:', expoPushToken);
  }, [expoPushToken]);

  // TEMPORAL (solo para pruebas): imprime el JWT para copiarlo.
  useEffect(() => {
    if (token) console.log('🔑 JWT:', token);
  }, [token]);

  // Envía el push token al backend solo cuando hay sesión iniciada
  // (el endpoint /notifications/token requiere JWT).
  useEffect(() => {
    if (expoPushToken && token) {
      registerPushToken(expoPushToken).catch((e) =>
        console.warn('No se pudo guardar el push token:', e),
      );
    }
  }, [expoPushToken, token]);

  return null;
}

export default function Layout() {
  const insets = useSafeAreaInsets();
  // Tipografía Lemon Milk. Si el .ttf/.otf aún no está en assets/fonts, la app
  // sigue funcionando con la fuente del sistema (no bloquea el arranque).
  useFonts({
    LemonMilk: require("../assets/fonts/LEMONMILK-Regular.otf"),
    "LemonMilk-Medium": require("../assets/fonts/LEMONMILK-Medium.otf"),
    "LemonMilk-Bold": require("../assets/fonts/LEMONMILK-Bold.otf"),
    "LemonMilk-Light": require("../assets/fonts/LEMONMILK-Light.otf"),
  });

  return (
    <AuthProvider>
      <AppInit />
      <OrderProvider>
      <CartProvider>
        <StoreStatusProvider>
          <View
            className="flex-1"
            style={{ backgroundColor: colors.bg, paddingBottom: insets.bottom }}
          >
            <StatusBar style="dark" />
            <UpdateGate>
              <ThemeProvider value={NavTheme}>
                <Stack screenOptions={{ headerShown: false }} />
              </ThemeProvider>
            </UpdateGate>
          </View>
        </StoreStatusProvider>
      </CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
}
