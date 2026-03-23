import { router, Stack } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-black px-6 gap-5">
      <Text className="text-7xl font-extrabold tracking-widest text-white">
        <Text className="text-[#E10600]">home</Text>
      </Text>
      <Pressable onPress={() => router.push("/login")}>
        <Text className="text-white">Go to Login</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/register")}>
        <Text className="text-white">Go to Register</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/verify-code")}>
        <Text className="text-white">Go to Verify Code</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/complete-profile")}>
        <Text className="text-white">Go to Complete Profile</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/(cliente)")}>
        <Text className="text-white">Go to Home</Text>
      </Pressable>

    </View>
  );
}
