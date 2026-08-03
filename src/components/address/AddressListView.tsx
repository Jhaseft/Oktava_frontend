import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Address } from '@/src/types/address.types';
import { colors } from '@/src/theme/theme';

type Props = {
  addresses: Address[];
  onBack: () => void;
  onAdd: () => void;
  onPressAddress: (addr: Address) => void;
  onDelete: (addr: Address) => void;
};

export function AddressListView({ addresses, onBack, onAdd, onPressAddress, onDelete }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 12 }}>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={26} color={colors.black} />
          </TouchableOpacity>
          <Text className="font-lemon-bold text-brand-black uppercase" style={{ fontSize: 24 }}>
            Direcciones
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}
      >
        {addresses.length === 0 ? (
          <View className="items-center pt-24 gap-3 px-8">
            <Ionicons name="location-outline" size={48} color={colors.borderStrong} />
            <Text className="font-lemon text-brand-muted text-center" style={{ fontSize: 15 }}>
              Aún no tienes direcciones. Agrega una para tus pedidos delivery.
            </Text>
          </View>
        ) : (
          addresses.map((addr) => (
            <TouchableOpacity
              key={addr.id}
              onPress={() => onPressAddress(addr)}
              activeOpacity={0.7}
              className="flex-row items-center gap-3 bg-white rounded-2xl px-4 py-4 border border-brand-border"
            >
              <Ionicons name="location-outline" size={22} color={colors.black} />
              <View className="flex-1">
                <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 17 }}>{addr.label}</Text>
                <Text className="font-lemon text-brand-muted" style={{ fontSize: 13 }} numberOfLines={1}>
                  {addr.direction}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => onDelete(addr)}
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View className="px-4" style={{ paddingBottom: insets.bottom + 12, paddingTop: 8 }}>
        <TouchableOpacity
          onPress={onAdd}
          activeOpacity={0.85}
          className="flex-row items-center justify-center gap-2 rounded-2xl py-4"
          style={{ backgroundColor: colors.red }}
        >
          <Ionicons name="add" size={22} color="#ffffff" />
          <Text className="text-white font-lemon-bold uppercase tracking-wide" style={{ fontSize: 15 }}>
            Agregar nueva dirección
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
