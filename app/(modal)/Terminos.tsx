import { Stack } from "expo-router";
import { View, Text, ScrollView } from "react-native";

const sections = [
  { title: "1. Introducción", body: `Bienvenido a Oktava. Al acceder y utilizar este sitio web o nuestra plataforma de pedidos, aceptas cumplir y estar sujeto a los siguientes términos y condiciones. Si no estás de acuerdo con alguno de estos términos, te pedimos que no utilices el servicio.\n\nEstos términos se aplican a todos los usuarios del sitio, incluyendo visitantes, clientes registrados y cualquier persona que realice un pedido a través de nuestra plataforma.` },
  { title: "2. Uso del sitio", body: `El uso de este sitio está permitido exclusivamente para fines lícitos y personales. Queda prohibido:\n\n• Usar el sitio de manera que cause daño o sobrecarga en nuestros servidores.\n• Intentar acceder sin autorización a áreas restringidas del sistema.\n• Utilizar el sitio para actividades ilegales o fraudulentas.\n• Publicar o transmitir contenido ofensivo o difamatorio.\n\nOktava se reserva el derecho de restringir el acceso a usuarios que incumplan estas condiciones.` },
  { title: "3. Registro y cuenta", body: `Para realizar pedidos es necesario crear una cuenta. Al registrarte, te comprometes a:\n\n• Proporcionar información veraz, completa y actualizada.\n• Mantener la confidencialidad de tus credenciales.\n• Notificarnos de inmediato si sospechas de un acceso no autorizado.\n\nEres responsable de todas las actividades realizadas desde tu cuenta.` },
  { title: "4. Pedidos", body: `Al realizar un pedido:\n\n• Confirmas que la información de entrega es correcta.\n• Entiendes que el pedido está sujeto a disponibilidad de productos.\n• Recibirás una confirmación que indica que tu pedido fue recibido y está siendo procesado.\n\nOktava se reserva el derecho de rechazar o cancelar un pedido en caso de errores de precio o sospecha de fraude.` },
  { title: "5. Precios y disponibilidad", body: `Los precios mostrados están expresados en la moneda local e incluyen los impuestos aplicables. Oktava se reserva el derecho de modificar los precios en cualquier momento.\n\nEn caso de que un producto no esté disponible después de confirmado tu pedido, nos comunicaremos contigo para ofrecerte una alternativa.` },
  { title: "6. Pagos", body: `Al realizar un pago:\n\n• Confirmas que estás autorizado a utilizar el método de pago seleccionado.\n• Aceptas los cargos correspondientes al monto total del pedido.\n\nLos datos de tarjeta son procesados por nuestra pasarela de pago externa y no son almacenados por Oktava.` },
  { title: "7. Delivery y pickup", body: `Oktava ofrece dos modalidades:\n\nDelivery: El pedido es enviado a la dirección que proporciones. Los tiempos estimados son referenciales.\n\nPickup: Puedes recoger tu pedido directamente en nuestro local. Te notificaremos cuando esté listo.\n\nOktava no se hace responsable por demoras causadas por información de dirección incorrecta.` },
  { title: "8. Cancelaciones", body: `Las cancelaciones están sujetas al estado del pedido:\n\n• Si el pedido aún no fue confirmado, puedes solicitar la cancelación.\n• Una vez en preparación, la cancelación puede no ser posible.\n• Si la cancelación es imputable a Oktava, se procesará el reembolso completo.` },
  { title: "9. Cambios en los términos", body: `Oktava se reserva el derecho de actualizar estos términos en cualquier momento. Los cambios serán publicados con indicación de la fecha de actualización.\n\nEl uso continuado del servicio tras la publicación de cambios constituye la aceptación de los nuevos términos.` },
  { title: "10. Contacto", body: `Si tienes preguntas o reclamos relacionados con estos términos, contáctanos a través de los medios disponibles en la plataforma. Haremos nuestro mejor esfuerzo para responder a la brevedad.` },
];

export default function TerminosScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#111" }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#111" },
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerTitle: "Términos y condiciones",
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ fontSize: 11, color: "#e50909", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Legal</Text>
        <Text style={{ fontSize: 22, fontWeight: "800", color: "white", marginBottom: 4 }}>Términos y condiciones</Text>
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
