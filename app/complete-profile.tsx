import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";

export default function CompleteProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-black px-7">
      <Text className="text-center text-3xl font-extrabold text-white">
        Pantalla sin uso
      </Text>
      <Text className="mt-4 text-center text-base text-gray-400">
        El perfil se completa durante el registro directo con /auth/sign-up.
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
