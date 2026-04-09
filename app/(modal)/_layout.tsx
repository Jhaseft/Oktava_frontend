import { Stack } from "expo-router";
import { View } from "react-native";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";

export default function ModalLayout() {
  const { isLoading, isAuthenticated } = useRequireAuth();

  if (isLoading || !isAuthenticated) {
    return <View className="flex-1 bg-black" />;
  }

  return <Stack screenOptions={{ headerShown: true }} />;
}
