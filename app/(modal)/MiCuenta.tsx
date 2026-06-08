import { Stack } from "expo-router";
import { View, Text } from "react-native";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";

export default function MiCuentaScreen() {
  const { isLoading, isAuthenticated } = useRequireAuth();

  if (isLoading || !isAuthenticated) {
    return <View className="flex-1 bg-black" />;
  }

  return (
    <View className="flex-1 bg-[#111] justify-center items-center">
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#111" },
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerTitle: "Mi cuenta",
        }}
      />
      <Text className="text-white text-4xl italic font-bold">
        MI CUENTA
      </Text>
    </View>
  );
}
