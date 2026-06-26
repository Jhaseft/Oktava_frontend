import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";
import { OrderProvider } from "@/src/context/OrderContext";
import { StoreStatusProvider } from "@/src/context/StoreStatusContext";
import { useNotifications } from "@/src/hooks/useNotifications";
import { registerPushToken } from "@/src/services/notifications.service";
import { UpdateGate } from "@/src/components/ui/UpdateGate";

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
  return (
    <AuthProvider>
      <AppInit />
      <OrderProvider>
      <CartProvider>
        <StoreStatusProvider>
          <View className="flex-1 bg-black" style={{ paddingBottom: insets.bottom, backgroundColor: "black" }}>
            <StatusBar style="light" />
            <UpdateGate>
              <Stack screenOptions={{ headerShown: false }} />
            </UpdateGate>
          </View>
        </StoreStatusProvider>
      </CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
}
