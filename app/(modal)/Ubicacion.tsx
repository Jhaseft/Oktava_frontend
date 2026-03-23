import { Stack } from "expo-router";
import { View, Text } from "react-native";

export default function CartScreen() {
  return (
    <View className="flex-1 bg-[#111] justify-center items-center" >
      <Stack.Screen
      options={{
        headerStyle:{backgroundColor:"#111"},
        headerTitleAlign: "center",
        headerTintColor: "white",
        headerTitle:"Sucursales",
      }}
    />
      <Text className="text-white text-4xl italic font-bold">
        UBICACION
      </Text>
     
    </View>
  );
}
