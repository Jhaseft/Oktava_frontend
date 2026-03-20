import { router } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function IndexScreen() {
  useEffect(() => {
    router.replace("/login");
  }, []);

  return <View className="flex-1 bg-black" />;
}
