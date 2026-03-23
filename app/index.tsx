import ScreenHeader from "@/src/components/Menu/ScreenHeader";
import { View, Text } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 bg-white justify-center items-center">

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
