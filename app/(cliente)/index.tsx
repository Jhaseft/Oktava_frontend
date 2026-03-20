import { View, Text } from "react-native";

export default function CartScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#111", justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: "white", fontSize: 24, fontWeight: "900", fontStyle: "italic" }}>
        Carrito
      </Text>
      <Text style={{ color: "#aaa", fontSize: 14, marginTop: 8 }}>
        Tu carrito está vacío
      </Text>
    </View>
  );
}
