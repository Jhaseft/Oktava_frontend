import { Stack } from "expo-router";
import { View, Text, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const logoImg = require("../../assets/oktava_logo.png");

type StatProps = { value: string; label: string };

function Stat({ value, label }: StatProps) {
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Text style={{ fontSize: 26, fontWeight: "900", color: "#e50909" }}>{value}</Text>
      <Text style={{ fontSize: 11, color: "#666", textAlign: "center", marginTop: 2 }}>{label}</Text>
    </View>
  );
}

type PillarProps = { icon: React.ComponentProps<typeof Ionicons>["name"]; title: string; description: string };

function Pillar({ icon, title, description }: PillarProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "#1a1a1a", borderRadius: 14, padding: 14, alignItems: "center", gap: 6, borderWidth: 1, borderColor: "#2a2a2a" }}>
      <Ionicons name={icon} size={24} color="#e50909" />
      <Text style={{ fontSize: 12, fontWeight: "700", color: "white", textAlign: "center" }}>{title}</Text>
      <Text style={{ fontSize: 11, color: "#666", textAlign: "center", lineHeight: 16 }}>{description}</Text>
    </View>
  );
}

export default function SobreNosotrosScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#111" },
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerTitle: "Sobre nosotros",
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 20 }}>

        {/* Logo + tagline */}
        <View style={{ alignItems: "center", gap: 12, paddingVertical: 10 }}>
          <Image source={logoImg} style={{ width: 180, height: 45 }} resizeMode="contain" />
          <Text style={{ fontSize: 13, color: "#666", textAlign: "center", maxWidth: 260, lineHeight: 20 }}>
            El sabor que te obsesiona. Fast food premium en el corazón de Cochabamba.
          </Text>
        </View>

        {/* Historia */}
        <View style={{ backgroundColor: "#1a1a1a", borderRadius: 14, padding: 18, borderWidth: 1, borderColor: "#2a2a2a" }}>
          <Text style={{ fontSize: 11, color: "#e50909", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Nuestra historia</Text>
          <Text style={{ fontSize: 14, color: "#ccc", lineHeight: 22 }}>
            Oktava nació con una misión simple: llevar sabores auténticos y de calidad a las mesas de Cochabamba. Desde nuestro primer día, combinamos ingredientes frescos, técnicas cuidadas y un equipo apasionado para crear una experiencia de fast food diferente — sin apuros, sin compromisos.
          </Text>
        </View>

        {/* Stats */}
        <View style={{ backgroundColor: "#1a1a1a", borderRadius: 14, padding: 18, borderWidth: 1, borderColor: "#2a2a2a" }}>
          <Text style={{ fontSize: 11, color: "#666", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 14, textAlign: "center" }}>En números</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            <Stat value="500+" label={"Pedidos\nentregados"} />
            <View style={{ width: 1, backgroundColor: "#2a2a2a" }} />
            <Stat value="4.9★" label={"Calificación\npromedio"} />
            <View style={{ width: 1, backgroundColor: "#2a2a2a" }} />
            <Stat value="3+" label={"Años\nde sabor"} />
          </View>
        </View>

        {/* Pillars */}
        <View>
          <Text style={{ fontSize: 11, color: "#666", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Por qué elegirnos</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pillar icon="flash-outline" title="Entrega rápida" description={"Tu pedido en\n~15 minutos"} />
            <Pillar icon="flame-outline" title="Sabor premium" description={"Ingredientes\nseleccionados"} />
            <Pillar icon="leaf-outline" title="Siempre fresco" description={"Preparado\nal momento"} />
          </View>
        </View>

        {/* Misión / Visión */}
        <View style={{ gap: 12 }}>
          <View style={{ backgroundColor: "#1a1a1a", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#2a2a2a" }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#e50909", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Nuestra misión</Text>
            <Text style={{ fontSize: 13, color: "#888", lineHeight: 20 }}>
              Ofrecer una experiencia de fast food premium que combine rapidez, sabor y calidad sin sacrificar ninguno de los tres.
            </Text>
          </View>
          <View style={{ backgroundColor: "#1a1a1a", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#2a2a2a" }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#e50909", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Nuestra visión</Text>
            <Text style={{ fontSize: 13, color: "#888", lineHeight: 20 }}>
              Ser el referente de fast food de calidad en Bolivia, expandiendo el sabor Oktava a más ciudades y más mesas.
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
