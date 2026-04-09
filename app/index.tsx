import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { useAuth } from "@/src/context/AuthContext";

export default function IndexScreen() {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (token) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [token, isLoading]);

  // Pantalla negra mientras se hidrata la sesión desde AsyncStorage
  return <View className="flex-1 bg-black" />;
}
