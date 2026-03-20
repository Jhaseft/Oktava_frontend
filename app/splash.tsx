import { router } from "expo-router";
import { useEffect } from "react";
import { View, Text } from "react-native";

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-black px-6">
      <View className="intems-center">
        <Text className="text-7xl font-extrabold tracking-widest text-[#E10600]">
          OK<Text className="text-white">TA</Text>VA
        </Text>

        <View className="mt-3 flex-row items-center">
          <View className="h-[2] w-[50px] bg-white" />
          <Text className="mx-3 text-[12px] font-semibold tracking-[2px] text-white">
            SABOR PERUANO
          </Text>
          <View className="h-[2] w-[50px] bg-white" />
        </View>
      </View>
    </View>
  );
}
