import { Stack, router } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useStoreStatus } from "@/src/context/StoreStatusContext";
import { colors, fonts } from "@/src/theme/theme";

const MAPS_URL = "https://maps.app.goo.gl/qdJixHTAnECPLuaB6";

type InfoRowProps = { icon: React.ComponentProps<typeof Ionicons>["name"]; label: string; value: string };

function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12, paddingVertical: 10 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: colors.bg,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={18} color={colors.red} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>
          {label}
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.text, lineHeight: 20 }}>{value}</Text>
      </View>
    </View>
  );
}

export default function UbicacionScreen() {
  const { isOpen, status } = useStoreStatus();
  const today = status?.today;
  let todayValue = "Consulta los horarios";
  if (today) {
    todayValue = today.isClosed ? "Cerrado hoy" : `${today.openTime} – ${today.closeTime}`;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: colors.bg },
          headerTitleAlign: "center",
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.bold },
          headerTitle: "Ubica la Oktava",
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.text, marginBottom: 16 }}>Nuestra ubicación</Text>

          <InfoRow icon="location-outline" label="Dirección" value={"Av. Villazón Km 8\nPasarela Acera Sud\nCochabamba, Bolivia"} />

          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />

          <InfoRow
            icon="time-outline"
            label={isOpen ? "Abierto ahora · Horario de hoy" : "Cerrado ahora · Horario de hoy"}
            value={todayValue}
          />

          <TouchableOpacity
            onPress={() => router.push("/(modal)/Horarios")}
            activeOpacity={0.7}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10, paddingLeft: 48 }}
          >
            <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.red }}>Ver todos los horarios</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.red} />
          </TouchableOpacity>

          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />

          <InfoRow icon="call-outline" label="Contacto" value="Disponible por WhatsApp" />
        </View>

        <TouchableOpacity
          onPress={() => Linking.openURL(MAPS_URL)}
          activeOpacity={0.85}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: colors.red,
            borderRadius: 14,
            paddingVertical: 16,
          }}
        >
          <Ionicons name="navigate" size={20} color="#ffffff" />
          <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: "#ffffff", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Abrir en Google Maps
          </Text>
        </TouchableOpacity>

        <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.text, marginBottom: 10 }}>¿Cómo llegar?</Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, lineHeight: 20 }}>
            Estamos sobre la Av. Villazón, a la altura del Km 8, justo en la pasarela de la acera sud. Fácil acceso en micro o trufi desde el centro de Cochabamba.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
