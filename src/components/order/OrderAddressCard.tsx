import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';
import { addressMapsUrl } from '@/src/lib/order';
import type { OrderAddress } from '@/src/types/order.types';

type Props = Readonly<{ address: OrderAddress }>;

export function OrderAddressCard({ address }: Props) {
  const openMap = () => Linking.openURL(addressMapsUrl(address)).catch(() => {});

  return (
    <View className="rounded-2xl border border-brand-border bg-brand-surface" style={{ padding: 14, gap: 6 }}>
      <View className="flex-row items-center" style={{ gap: 5, marginBottom: 2 }}>
        <Ionicons name="location-outline" size={13} color={colors.textMuted} />
        <Text className="font-lemon-bold text-brand-muted uppercase" style={{ fontSize: 11, letterSpacing: 0.6 }}>
          Dirección de entrega
        </Text>
      </View>

      <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 14 }}>{address.label}</Text>
      {!!address.direction && (
        <Text className="font-lemon text-brand-muted" style={{ fontSize: 13 }}>{address.direction}</Text>
      )}
      {!!address.reference && (
        <Text className="font-lemon text-brand-muted" style={{ fontSize: 12 }}>Ref: {address.reference}</Text>
      )}

      <TouchableOpacity
        onPress={openMap}
        activeOpacity={0.8}
        className="flex-row items-center self-start rounded-full border border-brand-red"
        style={{ gap: 6, marginTop: 8, paddingHorizontal: 14, paddingVertical: 8 }}
      >
        <Ionicons name="navigate" size={15} color={colors.red} />
        <Text className="font-lemon-bold text-brand-red uppercase" style={{ fontSize: 13, letterSpacing: 0.3 }}>
          Ver dirección
        </Text>
      </TouchableOpacity>
    </View>
  );
}
