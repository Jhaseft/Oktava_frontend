import { router } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { useRequireAuth } from "@/src/hooks/useRequireAuth";

export default function Home() {
  const { user, signOut } = useAuth();
  const { isLoading, isAuthenticated } = useRequireAuth();

  if (isLoading || !isAuthenticated) {
    return <View className="flex-1 bg-black" />;
  }

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <View className="flex-1 items-center justify-center bg-black px-6 gap-5">
      <Text className="text-7xl font-extrabold tracking-widest text-white">
        <Text className="text-[#E10600]">home</Text>
      </Text>

      {user && (
        <Text className="text-white text-base">
          Hola, {user.firstName} {user.lastName}
        </Text>
      )}

      <Pressable onPress={() => router.push("/login")}>
        <Text className="text-white">Go to Login</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/register")}>
        <Text className="text-white">Go to Register</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/(cliente)")}>
        <Text className="text-white">Go to Home</Text>
      </Pressable>

      <Pressable
        onPress={handleLogout}
        className="mt-4 h-12 w-full items-center justify-center rounded-full bg-[#E10600]"
      >
        <Text className="text-base font-bold text-white">CERRAR SESIÓN</Text>
      </Pressable>
    </View>
  );
}
