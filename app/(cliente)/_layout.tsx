import { Stack } from "expo-router";
import { View } from "react-native";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";

export default function ClienteLayout() {
  const { isLoading, isAuthenticated } = useRequireAuth();

  // No renderizar contenido privado hasta confirmar sesión
  if (isLoading || !isAuthenticated) {
    return <View className="flex-1 bg-black" />;
  }

  return <Stack screenOptions={{ headerShown: true }} />;
}
