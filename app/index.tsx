import ScreenHeader from "@/src/components/Menu/ScreenHeader";
import { router } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function IndexScreen() {
  useEffect(() => {
    router.replace("/login");
  }, []);
  return (
    <View>

      <ScreenHeader
        titleParts={[
          { text: "OK", color: "text-[#CB0000]" },
          { text: "TA", color: "text-[#FFFFFF]" },
          { text: "VA", color: "text-[#FF0000]" },
        ]}
      />

      <Text className="text-2xl font-bold text-gray-800">Hola Mundosss</Text>
      <Text className="text-base text-gray-500 mt-2">Página de inicio</Text>

    </View>

  );
}
