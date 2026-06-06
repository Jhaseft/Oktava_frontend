import { Stack } from "expo-router";
import { View, Text, ScrollView } from "react-native";

const sections = [
  { title: "1. Introducción", body: `En Oktava nos comprometemos a proteger tu privacidad. Esta Política describe qué información recopilamos, cómo la usamos y qué derechos tienes sobre ella.\n\nAl utilizar nuestra plataforma, aceptas las prácticas descritas en este documento.` },
  { title: "2. Datos que recopilamos", body: `Información que nos proporcionas directamente:\n• Nombre y apellido.\n• Número de teléfono.\n• Correo electrónico.\n• Dirección de entrega.\n\nInformación generada por el uso del servicio:\n• Historial de pedidos.\n• Preferencias de entrega.\n• Interacciones con la plataforma.\n\nInformación técnica:\n• Dirección IP y tipo de dispositivo.\n• Navegador y sistema operativo.` },
  { title: "3. Uso de los datos", body: `Utilizamos tu información para:\n\n• Procesar y gestionar tus pedidos.\n• Enviarte confirmaciones y actualizaciones del estado de tu pedido.\n• Mejorar nuestro servicio y la experiencia en la plataforma.\n• Comunicarnos contigo ante consultas o incidencias.\n\nNo utilizamos tu información para publicidad de terceros sin tu consentimiento.` },
  { title: "4. Datos de pedidos", body: `Almacenamos el historial de tus pedidos para:\n\n• Permitirte hacer seguimiento de órdenes activas y anteriores.\n• Facilitar nuevos pedidos con datos ya utilizados.\n• Atender reclamos sobre pedidos específicos.\n\nEl historial se conserva mientras tu cuenta esté activa.` },
  { title: "5. Datos de dirección", body: `Las direcciones de entrega se almacenan para facilitar futuros pedidos. Puedes gestionarlas, editarlas o eliminarlas desde tu perfil en cualquier momento.\n\nNo compartimos tus datos de dirección con terceros ajenos al proceso de entrega.` },
  { title: "6. Datos de contacto", body: `Tu teléfono y correo se utilizan únicamente para:\n\n• Confirmaciones y notificaciones de pedidos.\n• Contactarte ante inconvenientes con una entrega.\n• Responder a tus consultas de soporte.\n\nNo realizamos marketing sin tu consentimiento previo.` },
  { title: "7. Pagos y seguridad", body: `Los datos de tu método de pago son procesados directamente por una pasarela externa certificada. Oktava no almacena ni tiene acceso a esta información.\n\nSolo recibimos confirmación del resultado de la transacción para gestionar tu pedido.` },
  { title: "8. Derechos del usuario", body: `Tienes derecho a:\n\n• Acceder a tus datos personales.\n• Solicitar la corrección de datos incorrectos.\n• Solicitar la eliminación de tus datos.\n• Revocar tu consentimiento cuando corresponda.\n• Solicitar la portabilidad de tus datos.\n\nPara ejercer estos derechos, contáctanos a través de la plataforma.` },
  { title: "9. Cambios en esta política", body: `Oktava puede actualizar esta política en cualquier momento. Los cambios serán publicados con la fecha de actualización.\n\nEl uso continuado del servicio tras los cambios implica su aceptación.` },
];

export default function PrivacidadScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#111" },
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerTitle: "Política de privacidad",
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ fontSize: 11, color: "#e50909", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Legal</Text>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "white", marginBottom: 4 }}>Política de privacidad</Text>
        <Text style={{ fontSize: 12, color: "#555", marginBottom: 24 }}>Última actualización: Mayo 2025</Text>

        <View style={{ backgroundColor: "#1a1200", borderWidth: 1, borderColor: "#3a2e00", borderRadius: 12, padding: 14, marginBottom: 24, flexDirection: "row", gap: 10 }}>
          <Text style={{ fontSize: 16 }}>⚠️</Text>
          <Text style={{ fontSize: 12, color: "#c8a600", lineHeight: 18, flex: 1 }}>
            Este documento es un texto base con fines informativos. Debe ser revisado antes de su publicación definitiva.
          </Text>
        </View>

        {sections.map((s, i) => (
          <View key={i} style={{ backgroundColor: "#1a1a1a", borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#2a2a2a" }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "white", marginBottom: 8 }}>{s.title}</Text>
            <Text style={{ fontSize: 13, color: "#888", lineHeight: 20 }}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
