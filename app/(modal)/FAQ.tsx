import { Stack } from "expo-router";
import { View, Text, ScrollView } from "react-native";
import { colors, fonts } from "@/src/theme/theme";

const faqs = [
  {
    q: "¿Cómo hago un pedido?",
    a: "Explora el menú, agrega los productos que quieras al carrito y confirma tu pedido eligiendo delivery o pickup. Recibirás una confirmación cuando esté en preparación.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Puedes pagar en línea con tarjeta a través de nuestra pasarela segura, o mediante QR según la modalidad disponible al momento de tu pedido.",
  },
  {
    q: "¿Cuánto tarda el delivery?",
    a: "Los tiempos son referenciales y dependen de tu ubicación y la demanda del momento. Te mantendremos informado del estado de tu pedido.",
  },
  {
    q: "¿Puedo recoger mi pedido en el local (pickup)?",
    a: "Sí. Elige la opción pickup al confirmar y te avisaremos cuando tu pedido esté listo para recoger.",
  },
  {
    q: "¿Puedo cancelar un pedido?",
    a: "Si el pedido aún no fue confirmado puedes solicitar la cancelación. Una vez en preparación, la cancelación puede no ser posible.",
  },
  {
    q: "¿Cómo cambio mi dirección de entrega?",
    a: "Desde tu perfil, en la sección de direcciones, puedes agregar, editar o eliminar tus direcciones guardadas.",
  },
  {
    q: "¿Cómo contacto con soporte?",
    a: "Usa el botón de Contacto (WhatsApp) en el menú lateral. Te responderemos a la brevedad.",
  },
];

export default function FAQScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: colors.bg },
          headerTitleAlign: "center",
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.bold },
          headerTitle: "FAQ",
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: 11,
            color: colors.red,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 6,
          }}
        >
          Ayuda
        </Text>
        <Text style={{ fontFamily: fonts.bold, fontSize: 22, color: colors.text, marginBottom: 4 }}>
          Preguntas frecuentes
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textFaint, marginBottom: 24 }}>
          Resolvemos las dudas más comunes sobre tus pedidos.
        </Text>

        {faqs.map((f, i) => (
          <View
            key={i}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.text, marginBottom: 8 }}>
              {f.q}
            </Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, lineHeight: 20 }}>
              {f.a}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
