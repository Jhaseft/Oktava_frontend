import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Product } from '../../types/product.types';

type ProductCardProps = Readonly<{
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onRemove: (product: Product) => void;
  onOpenOptions: (product: Product) => void;
}>;

function QuantityControl({ product, quantity, onAdd, onRemove, onOpenOptions }: ProductCardProps) {
  const hasOptions = (product.optionGroups?.length ?? 0) > 0;

  if (quantity > 0) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TouchableOpacity
          onPress={() => onRemove(product)}
          activeOpacity={0.7}
          style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#c1121f', alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="remove" size={16} color="#ffffff" />
        </TouchableOpacity>
        <Text className="font-lemon-bold" style={{ color: '#141414', fontSize: 14, minWidth: 16, textAlign: 'center' }}>
          {quantity}
        </Text>
        <TouchableOpacity
          onPress={() => hasOptions ? onOpenOptions(product) : onAdd(product)}
          activeOpacity={0.7}
          style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#c1121f', alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="add" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <TouchableOpacity
      onPress={() => hasOptions ? onOpenOptions(product) : onAdd(product)}
      activeOpacity={0.7}
      style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#c1121f', alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons name="add" size={20} color="#ffffff" />
    </TouchableOpacity>
  );
}

export function ProductCard({ product, quantity, onAdd, onRemove, onOpenOptions }: ProductCardProps) {
  return (
    <View style={{ backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e6e6e6' }}>
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: '100%', aspectRatio: 1 }}
          resizeMode="cover"
        />
      ) : (
        <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#f6f6f6', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="restaurant-outline" size={36} color="#cccccc" />
        </View>
      )}

      <View style={{ padding: 10, gap: 4 }}>
        <Text className="font-lemon-bold" style={{ color: '#141414', fontSize: 13, lineHeight: 18 }} numberOfLines={2}>
          {product.name}
        </Text>

        {product.description ? (
          <Text className="font-lemon" style={{ color: '#6b6b6b', fontSize: 11, lineHeight: 16 }} numberOfLines={2}>
            {product.description}
          </Text>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <Text className="font-lemon-bold" style={{ color: '#141414', fontSize: 14 }}>
            {product.price.toFixed(2)} Bs.
          </Text>

          {product.isAvailable
            ? <QuantityControl product={product} quantity={quantity} onAdd={onAdd} onRemove={onRemove} onOpenOptions={onOpenOptions} />
            : <Text className="font-lemon" style={{ color: '#9a9a9a', fontSize: 11 }}>Agotado</Text>
          }
        </View>
      </View>
    </View>
  );
}
