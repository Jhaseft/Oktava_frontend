import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthProvider } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";
import { OrderProvider } from "@/src/context/OrderContext";
import { useNotifications } from "@/src/hooks/useNotifications";

function AppInit() {
  const { expoPushToken } = useNotifications();

  useEffect(() => {
    if (expoPushToken) {
      console.log('Expo Push Token:', expoPushToken);
      // TODO: enviar el token al backend para guardar por usuario
      // api.post('/users/push-token', { token: expoPushToken });
    }
  }, [expoPushToken]);

  return null;
}

export default function Layout() {
  const insets = useSafeAreaInsets();
  return (
    <AuthProvider>
      <AppInit />
      <OrderProvider>
      <CartProvider>
        <View className="flex-1 bg-black" style={{ paddingBottom: insets.bottom, backgroundColor: "black" }}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
}
