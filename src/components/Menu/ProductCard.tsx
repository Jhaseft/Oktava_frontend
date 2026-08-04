import { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';
import type { Product } from '../../types/product.types';

type ProductCardProps = Readonly<{
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onRemove: (product: Product) => void;
  onOpenDetail: (product: Product) => void;
}>;

function CartAction({ product, quantity, onAdd, onRemove, onOpenDetail }: ProductCardProps) {
  const hasOptions = (product.optionGroups?.length ?? 0) > 0;

  if (quantity > 0) {
    return (
      <View
        className="flex-row items-center justify-between rounded-xl"
        style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 4 }}
      >
        <TouchableOpacity
          onPress={() => onRemove(product)}
          activeOpacity={0.7}
          className="items-center justify-center rounded-lg"
          style={{ width: 30, height: 30, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border }}
        >
          <Ionicons name="remove" size={18} color={colors.red} />
        </TouchableOpacity>

        <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 14, minWidth: 20, textAlign: 'center' }}>
          {quantity}
        </Text>

        <TouchableOpacity
          onPress={() => (hasOptions ? onOpenDetail(product) : onAdd(product))}
          activeOpacity={0.7}
          className="items-center justify-center rounded-lg"
          style={{ width: 30, height: 30, backgroundColor: colors.red }}
        >
          <Ionicons name="add" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => onOpenDetail(product)}
      activeOpacity={0.8}
      className="flex-row items-center justify-center rounded-xl"
      style={{ height: 38, backgroundColor: colors.red, gap: 6 }}
    >
      <MaterialCommunityIcons name="cart-arrow-down" size={18} color={colors.white} />
      <Text className="font-lemon-bold text-white" style={{ fontSize: 12 }}>Agregar</Text>
    </TouchableOpacity>
  );
}

function ProductCardBase({ product, quantity, onAdd, onRemove, onOpenDetail }: ProductCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onOpenDetail(product)}
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border }}
    >
      <View>
        {product.imageUrl ? (
          <Image
            source={product.imageUrl}
            style={{ width: '100%', aspectRatio: 1 }}
            contentFit="cover"
            transition={150}
            cachePolicy="memory-disk"
          />
        ) : (
          <View
            className="items-center justify-center"
            style={{ width: '100%', aspectRatio: 1, backgroundColor: colors.surface }}
          >
            <Ionicons name="restaurant-outline" size={36} color="#cccccc" />
          </View>
        )}

        {quantity > 0 && (
          <View
            className="absolute items-center justify-center rounded-full"
            style={{ top: 8, right: 8, minWidth: 26, height: 26, paddingHorizontal: 6, backgroundColor: colors.red }}
          >
            <Text className="font-lemon-bold text-white" style={{ fontSize: 12 }}>{quantity}</Text>
          </View>
        )}
      </View>

      <View style={{ padding: 10, gap: 4 }}>
        <Text
          className="font-lemon-bold text-brand-black"
          style={{ fontSize: 13, lineHeight: 18, height: 36 }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.name}
        </Text>

        <Text
          className="font-lemon text-brand-muted"
          style={{ fontSize: 11, lineHeight: 16, height: 16 }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {product.description ?? ''}
        </Text>

        <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 15, marginTop: 4 }}>
          {product.price.toFixed(2)} Bs.
        </Text>

        <View style={{ marginTop: 6 }}>
          {product.isAvailable ? (
            <CartAction
              product={product}
              quantity={quantity}
              onAdd={onAdd}
              onRemove={onRemove}
              onOpenDetail={onOpenDetail}
            />
          ) : (
            <View
              className="items-center justify-center rounded-xl"
              style={{ height: 38, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
            >
              <Text className="font-lemon text-brand-muted" style={{ fontSize: 11 }}>Agotado</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Memoizado: en el menú (ScrollView largo) evita re-renderizar todas las cards
// cuando cambia el scroll-spy o el carrito de otro producto.
export const ProductCard = memo(ProductCardBase);
