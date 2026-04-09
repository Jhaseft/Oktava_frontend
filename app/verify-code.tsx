import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

export default function VerifyCodeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-black px-7">
      <Text className="text-center text-3xl font-extrabold text-white">
        Flujo OTP deshabilitado
      </Text>
      <Text className="mt-4 text-center text-base text-gray-400">
        El backend actual no soporta verificacion por codigo. El registro ahora es
        directo en una sola pantalla.
      </Text>

      <Pressable
        onPress={() => router.replace("/register")}
        className="mt-8 h-12 w-full items-center justify-center rounded-full bg-[#E10600]"
      >
        <Text className="text-base font-bold text-white">Ir a registro</Text>
      </Pressable>

      <Pressable onPress={() => router.replace("/login")} className="mt-4">
        <Text className="text-sm text-gray-300">Volver a login</Text>
      </Pressable>
    </View>
  );
}
