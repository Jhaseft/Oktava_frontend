import { Stack, router } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '@/src/theme/theme';

const WHATSAPP_URL =
  'https://wa.me/59165359695?text=Hola%2C%20quisiera%20solicitar%20la%20eliminaci%C3%B3n%20de%20mi%20cuenta%20de%20Oktava.';

const DELETED_ITEMS = [
  'Tu perfil y datos personales',
  'Historial de pedidos',
  'Direcciones guardadas',
  'Métodos de pago registrados',
  'Acceso a la cuenta',
];

export default function EliminarCuentaScreen() {
  const handleRequest = () => {
    Alert.alert(
      'Solicitar eliminación',
      'Serás redirigido a WhatsApp para enviar tu solicitud de eliminación de cuenta. Este proceso puede tardar hasta 7 días hábiles.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: () => Linking.openURL(WHATSAPP_URL) },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: colors.bg },
          headerTitleAlign: 'center',
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.bold },
          headerTitle: 'Eliminar cuenta',
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}>
        <View
          className="flex-row items-start gap-3 rounded-2xl p-4"
          style={{ backgroundColor: 'rgba(193,18,31,0.06)', borderWidth: 1, borderColor: 'rgba(193,18,31,0.30)' }}
        >
          <Ionicons name="warning-outline" size={22} color={colors.red} />
          <View className="flex-1">
            <Text className="font-lemon-bold text-brand-red" style={{ fontSize: 14, marginBottom: 6 }}>
              Acción irreversible
            </Text>
            <Text className="font-lemon text-brand-muted" style={{ fontSize: 13, lineHeight: 19 }}>
              Al eliminar tu cuenta perderás permanentemente todos tus datos, historial de pedidos y direcciones
              guardadas. Esta acción no se puede deshacer.
            </Text>
          </View>
        </View>

        <View className="rounded-2xl p-4 bg-brand-surface border border-brand-border">
          <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 14, marginBottom: 12 }}>
            Qué se eliminará
          </Text>
          {DELETED_ITEMS.map((item) => (
            <View key={item} className="flex-row items-center gap-2.5" style={{ marginBottom: 8 }}>
              <Ionicons name="close-circle-outline" size={16} color={colors.red} />
              <Text className="font-lemon text-brand-muted" style={{ fontSize: 13 }}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        <View className="rounded-2xl p-4 bg-brand-surface border border-brand-border">
          <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 14, marginBottom: 12 }}>
            Proceso de eliminación
          </Text>
          <Text className="font-lemon text-brand-muted" style={{ fontSize: 13, lineHeight: 20 }}>
            Para solicitar la eliminación de tu cuenta, envíanos un mensaje por WhatsApp desde el número asociado a tu
            cuenta. Procesaremos tu solicitud en un plazo de hasta 7 días hábiles.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleRequest}
          activeOpacity={0.85}
          className="flex-row items-center justify-center gap-2.5 rounded-2xl bg-white"
          style={{ borderWidth: 1, borderColor: colors.red, paddingVertical: 16, marginTop: 4 }}
        >
          <Ionicons name="trash-outline" size={20} color={colors.red} />
          <Text className="font-lemon-bold text-brand-red" style={{ fontSize: 15 }}>
            Solicitar eliminación
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="items-center" style={{ paddingVertical: 12 }}>
          <Text className="font-lemon-medium text-brand-muted" style={{ fontSize: 13 }}>
            Cancelar y volver
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
