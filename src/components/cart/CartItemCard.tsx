import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { CartItem } from '@/types/cart.types';

type CartItemCardProps = {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItemCard({ item, onIncrease, onDecrease, onRemove }: CartItemCardProps) {
  return (
    <View className="flex-row items-center gap-3 bg-zinc-900 rounded-2xl p-3 border border-white/5">
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} className="w-16 h-16 rounded-xl" resizeMode="cover" />
      ) : (
        <View className="w-16 h-16 rounded-xl bg-zinc-800 items-center justify-center">
          <Ionicons name="restaurant-outline" size={24} color="#52525b" />
        </View>
      )}

      <View className="flex-1 gap-1">
        <Text className="text-white font-semibold text-sm" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-red-400 font-bold text-sm">
          S/ {(item.price * item.quantity).toFixed(2)}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={onDecrease}
          activeOpacity={0.7}
          className="w-7 h-7 rounded-full bg-white/10 items-center justify-center"
        >
          <Ionicons name="remove" size={16} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white font-semibold w-5 text-center">{item.quantity}</Text>

        <TouchableOpacity
          onPress={onIncrease}
          activeOpacity={0.7}
          className="w-7 h-7 rounded-full bg-red-500 items-center justify-center"
        >
          <Ionicons name="add" size={16} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRemove}
          activeOpacity={0.7}
          className="w-7 h-7 rounded-full bg-white/5 items-center justify-center ml-1"
        >
          <Ionicons name="trash-outline" size={14} color="#f87171" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
