import { Stack, router } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WHATSAPP_URL = "https://wa.me/59170000000?text=Hola%2C%20quisiera%20solicitar%20la%20eliminaci%C3%B3n%20de%20mi%20cuenta%20de%20Oktava.";

export default function EliminarCuentaScreen() {
  const handleRequest = () => {
    Alert.alert(
      "Solicitar eliminación",
      "Serás redirigido a WhatsApp para enviar tu solicitud de eliminación de cuenta. Este proceso puede tardar hasta 7 días hábiles.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Continuar", onPress: () => Linking.openURL(WHATSAPP_URL) },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#111" },
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerTitle: "Eliminar cuenta",
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}>

        {/* Warning */}
        <View style={{ backgroundColor: "#1f0a0a", borderWidth: 1, borderColor: "#5a1010", borderRadius: 14, padding: 16, flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
          <Ionicons name="warning-outline" size={22} color="#e50909" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#e50909", marginBottom: 6 }}>Acción irreversible</Text>
            <Text style={{ fontSize: 13, color: "#cc6666", lineHeight: 19 }}>
              Al eliminar tu cuenta perderás permanentemente todos tus datos, historial de pedidos y direcciones guardadas. Esta acción no se puede deshacer.
            </Text>
          </View>
        </View>

        {/* Qué se elimina */}
        <View style={{ backgroundColor: "#1a1a1a", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#2a2a2a" }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "white", marginBottom: 12 }}>Qué se eliminará</Text>
          {[
            "Tu perfil y datos personales",
            "Historial de pedidos",
            "Direcciones guardadas",
            "Métodos de pago registrados",
            "Acceso a la cuenta",
          ].map((item) => (
            <View key={item} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Ionicons name="close-circle-outline" size={16} color="#e50909" />
              <Text style={{ fontSize: 13, color: "#888" }}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Proceso */}
        <View style={{ backgroundColor: "#1a1a1a", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#2a2a2a" }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "white", marginBottom: 12 }}>Proceso de eliminación</Text>
          <Text style={{ fontSize: 13, color: "#888", lineHeight: 20 }}>
            Para solicitar la eliminación de tu cuenta, envíanos un mensaje por WhatsApp desde el número asociado a tu cuenta. Procesaremos tu solicitud en un plazo de hasta 7 días hábiles.
          </Text>
        </View>

        {/* Botón */}
        <TouchableOpacity
          onPress={handleRequest}
          activeOpacity={0.85}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: "#1f0a0a",
            borderWidth: 1,
            borderColor: "#e50909",
            borderRadius: 14,
            paddingVertical: 16,
            marginTop: 4,
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#e50909" />
          <Text style={{ fontSize: 15, fontWeight: "700", color: "#e50909" }}>Solicitar eliminación</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={{ alignItems: "center", paddingVertical: 12 }}>
          <Text style={{ fontSize: 13, color: "#555" }}>Cancelar y volver</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
