import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Product } from '../../types/product.types';

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <View className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/5">
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          className="w-full h-36"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-36 bg-zinc-800 items-center justify-center">
          <Ionicons name="restaurant-outline" size={32} color="#52525b" />
        </View>
      )}

      <View className="p-3 gap-1">
        <Text className="text-white font-semibold text-sm" numberOfLines={1}>
          {product.name}
        </Text>
        {product.description && (
          <Text className="text-zinc-400 text-xs" numberOfLines={2}>
            {product.description}
          </Text>
        )}

        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-red-400 font-bold text-base">
            S/ {product.price.toFixed(2)}
          </Text>
          {product.isAvailable ? (
            <TouchableOpacity
              onPress={() => onAdd(product)}
              activeOpacity={0.7}
              className="bg-red-500 rounded-full w-8 h-8 items-center justify-center"
            >
              <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <Text className="text-zinc-600 text-xs">Agotado</Text>
          )}
        </View>
      </View>
    </View>
  );
}
