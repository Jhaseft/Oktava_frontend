import { Stack, router } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type LegalItem = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  route: string;
};

const items: LegalItem[] = [
  {
    icon: "document-text-outline",
    title: "Términos y condiciones",
    description: "Condiciones de uso de la plataforma, pedidos, pagos y cancelaciones.",
    route: "/(modal)/Terminos",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Política de privacidad",
    description: "Cómo recopilamos, usamos y protegemos tu información personal.",
    route: "/(modal)/Privacidad",
  },
  {
    icon: "trash-outline",
    title: "Eliminar cuenta",
    description: "Solicita la eliminación permanente de tu cuenta y datos.",
    route: "/(modal)/EliminarCuenta",
  },
];

export default function LegalScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#111" },
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerTitle: "Legal",
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
        <Text style={{ fontSize: 13, color: "#666", marginBottom: 8, lineHeight: 19 }}>
          Consulta nuestras políticas, términos de uso y cómo gestionamos tu información.
        </Text>

        {items.map((item) => (
          <TouchableOpacity
            key={item.route}
            onPress={() => router.push(item.route)}
            activeOpacity={0.75}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              backgroundColor: "#1a1a1a",
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: "#2a2a2a",
            }}
          >
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: "#111", alignItems: "center", justifyContent: "center" }}>
              <Ionicons name={item.icon} size={20} color="#e50909" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: "white", marginBottom: 3 }}>{item.title}</Text>
              <Text style={{ fontSize: 12, color: "#666", lineHeight: 17 }}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#444" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
