import { Stack } from "expo-router";
import { View, Text } from "react-native";

export default function CartScreen() {
  return (
    <View className="flex-1 bg-[#111] justify-center items-center" >
      <Stack.Screen
      options={{
        headerStyle:{backgroundColor:"#111"},
        headerTitleAlign: "left",
        headerTintColor: "white",
        headerTitle:"Carrito",
      }}
    />
      <Text className="text-white text-4xl italic font-bold">
        Carrito
      </Text>
      <Text className="text-white italic text-3xl">
        Tu carrito está vacío
      </Text>
    </View>
  );
}
