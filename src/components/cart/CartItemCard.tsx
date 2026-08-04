import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';
import type { CartItem } from '@/src/types/cart.types';

type CartItemCardProps = Readonly<{
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}>;

export function CartItemCard({ item, onIncrease, onDecrease, onRemove }: CartItemCardProps) {
  const allOptions = item.selectedOptions.flatMap((g) => g.items);
  const linePrice = (item.unitPrice + item.extraPrice) * item.quantity;

  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl p-3"
      style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border }}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} className="w-16 h-16 rounded-xl" resizeMode="cover" />
      ) : (
        <View className="w-16 h-16 rounded-xl items-center justify-center" style={{ backgroundColor: colors.surface }}>
          <Ionicons name="restaurant-outline" size={24} color={colors.borderStrong} />
        </View>
      )}

      <View className="flex-1 gap-0.5">
        <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 13 }} numberOfLines={1}>
          {item.name}
        </Text>
        {allOptions.map((opt) => (
          <Text key={opt.optionId} className="font-lemon text-brand-muted" style={{ fontSize: 11 }}>
            + {opt.name}{opt.extraPrice > 0 ? ` (Bs. ${opt.extraPrice.toFixed(2)})` : ''}
          </Text>
        ))}
        <Text className="font-lemon-bold text-brand-red" style={{ fontSize: 13, marginTop: 2 }}>
          BOB/ {linePrice.toFixed(2)}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={onDecrease}
          activeOpacity={0.7}
          className="w-7 h-7 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border }}
        >
          <Ionicons name="remove" size={16} color={colors.red} />
        </TouchableOpacity>

        <Text className="font-lemon-bold text-brand-black w-5 text-center" style={{ fontSize: 13 }}>
          {item.quantity}
        </Text>

        <TouchableOpacity
          onPress={onIncrease}
          activeOpacity={0.7}
          className="w-7 h-7 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.red }}
        >
          <Ionicons name="add" size={16} color={colors.white} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRemove}
          activeOpacity={0.7}
          className="w-7 h-7 rounded-full items-center justify-center ml-1"
          style={{ backgroundColor: colors.surface }}
        >
          <Ionicons name="trash-outline" size={14} color={colors.red} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
