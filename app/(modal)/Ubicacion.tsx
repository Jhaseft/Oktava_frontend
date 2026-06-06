import { Stack } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MAPS_URL = "https://maps.app.goo.gl/qdJixHTAnECPLuaB6";

type InfoRowProps = { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; value: string };

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 10 }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#1a1a1a", alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={icon} size={18} color="#e50909" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, color: "#666", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{label}</Text>
        <Text style={{ fontSize: 14, color: "#e0e0e0", lineHeight: 20 }}>{value}</Text>
      </View>
    </View>
  );
}

export default function UbicacionScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#111" },
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerTitle: "Ubica la Oktava",
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>

        {/* Card dirección y horarios */}
        <View style={{ backgroundColor: "#1a1a1a", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#2a2a2a" }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "white", marginBottom: 16 }}>Nuestra ubicación</Text>

          <InfoRow icon="location-outline" label="Dirección" value={"Av. Villazón Km 8\nPasarela Acera Sud\nCochabamba, Bolivia"} />

          <View style={{ height: 1, backgroundColor: "#2a2a2a", marginVertical: 4 }} />

          <InfoRow icon="time-outline" label="Lunes a Viernes" value="11:00 – 24:00" />
          <InfoRow icon="time-outline" label="Sábado y Domingo" value="10:00 – 24:00" />

          <View style={{ height: 1, backgroundColor: "#2a2a2a", marginVertical: 4 }} />

          <InfoRow icon="call-outline" label="Contacto" value="Disponible por WhatsApp" />
        </View>

        {/* Botón Google Maps */}
        <TouchableOpacity
          onPress={() => Linking.openURL(MAPS_URL)}
          activeOpacity={0.85}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: "#e50909",
            borderRadius: 14,
            paddingVertical: 16,
          }}
        >
          <Ionicons name="navigate" size={20} color="white" />
          <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>Abrir en Google Maps</Text>
        </TouchableOpacity>

        {/* Card cómo llegar */}
        <View style={{ backgroundColor: "#1a1a1a", borderRadius: 16, padding: 20, borderWidth: 1, borderColor: "#2a2a2a" }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "white", marginBottom: 10 }}>¿Cómo llegar?</Text>
          <Text style={{ fontSize: 13, color: "#888", lineHeight: 20 }}>
            Estamos sobre la Av. Villazón, a la altura del Km 8, justo en la pasarela de la acera sud. Fácil acceso en micro o trufi desde el centro de Cochabamba.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}
