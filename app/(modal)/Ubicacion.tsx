import React, { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, Linking, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useStoreStatus } from "@/src/context/StoreStatusContext";
import { STORE_LAT, STORE_LNG, hasGoogleMapsKey } from "@/src/lib/maps";
import { colors, fonts } from "@/src/theme/theme";

const MAPS_URL = "https://maps.app.goo.gl/8iyDFFjpr3iAxgQ76";
const logoPin = require("../../assets/iconoweb.png");
 
const STORE_REGION = {
  latitude: STORE_LAT,
  longitude: STORE_LNG,
  latitudeDelta: 0.006,
  longitudeDelta: 0.006,
};

function LogoPin() {
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 27,
          backgroundColor: "#ffffff",
          borderWidth: 3,
          borderColor: colors.red,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image source={logoPin} style={{ width: 32, height: 32 }} resizeMode="contain" />
      </View>
      <View
        style={{
          width: 0,
          height: 0,
          marginTop: -2,
          borderLeftWidth: 8,
          borderRightWidth: 8,
          borderTopWidth: 12,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: colors.red,
        }}
      />
    </View>
  );
}

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
  // El marcador se re-dibuja ~2s (para que el logo cargue completo) y luego se
  // "congela". Mover el mapa no lo re-renderiza, así que no parpadea.
  const [tracksPin, setTracksPin] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setTracksPin(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const today = status?.today;
  const todayValue = today
    ? today.isClosed
      ? "Cerrado hoy"
      : `${today.openTime} – ${today.closeTime}`
    : "Consulta los horarios";

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
        <View style={{ height: 240, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: colors.border }}>
          {hasGoogleMapsKey ? (
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1 }}
              initialRegion={STORE_REGION}
            >
              <Marker
                coordinate={{ latitude: STORE_LAT, longitude: STORE_LNG }}
                anchor={{ x: 0.5, y: 1 }}
                tracksViewChanges={tracksPin}
                onPress={() => Linking.openURL(MAPS_URL).catch(() => {})}
              >
                <LogoPin />
              </Marker>
            </MapView>
          ) : (
            <View className="flex-1 items-center justify-center gap-2" style={{ backgroundColor: colors.surface }}>
              <Ionicons name="map-outline" size={40} color={colors.borderStrong} />
              <Text className="font-lemon text-brand-muted" style={{ fontSize: 13 }}>Mapa no disponible</Text>
            </View>
          )}
        </View>
           <TouchableOpacity
          onPress={() => Linking.openURL(MAPS_URL).catch(() => {})}
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
            Ver en Google Maps
          </Text>
        </TouchableOpacity>

        <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 16, color: colors.text, marginBottom: 8 }}>Nuestra ubicación</Text>

          <InfoRow icon="location-outline" label="Dirección" value={"Av. Villazón Km 8\nPasarela Acera Sud\nCochabamba, Bolivia"} />

          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />

          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 }}>
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
              <Ionicons name="time-outline" size={18} color={colors.red} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: colors.textMuted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>
                Horario de hoy
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.text }}>{todayValue}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    borderRadius: 999,
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    backgroundColor: isOpen ? "rgba(34,197,94,0.12)" : "rgba(193,18,31,0.10)",
                  }}
                >
                  <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: isOpen ? "#22c55e" : colors.red }} />
                  <Text style={{ fontFamily: fonts.bold, fontSize: 10, color: isOpen ? "#15803d" : colors.red, textTransform: "uppercase" }}>
                    {isOpen ? "Abierto" : "Cerrado"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/(modal)/Horarios")}
            activeOpacity={0.7}
            style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8, paddingLeft: 48 }}
          >
            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.red }}>Ver todos los horarios</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.red} />
          </TouchableOpacity>
        </View>

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
