import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';
import type { CartItem } from '@/src/types/cart.types';

type Props = Readonly<{ item: CartItem }>;

export function SummaryItemRow({ item }: Props) {
  const options = item.selectedOptions.flatMap((g) => g.items);
  const linePrice = (item.unitPrice + item.extraPrice) * item.quantity;

  return (
    <View className="flex-row items-center gap-3">
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} className="rounded-xl" style={{ width: 44, height: 44 }} resizeMode="cover" />
      ) : (
        <View className="rounded-xl items-center justify-center" style={{ width: 44, height: 44, backgroundColor: colors.surface }}>
          <Ionicons name="restaurant-outline" size={20} color={colors.borderStrong} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-brand-black text-sm font-lemon-medium" numberOfLines={1}>{item.name}</Text>
        {options.map((opt) => (
          <Text key={opt.optionId} className="text-brand-muted text-xs font-lemon">
            + {opt.name}{opt.extraPrice > 0 ? ` (Bs. ${opt.extraPrice.toFixed(2)})` : ''}
          </Text>
        ))}
        <Text className="text-brand-muted text-xs font-lemon">Cantidad: {item.quantity}</Text>
      </View>
      <Text className="text-brand-black text-sm font-lemon-bold">Bs. {linePrice.toFixed(2)}</Text>
    </View>
  );
}
