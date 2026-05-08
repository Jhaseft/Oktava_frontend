import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Product } from '@/src/types/product.types';

type Props = Readonly<{
  product: Product;
  quantity: number;
  onAdd: (product: Product) => void;
  onRemove: (product: Product) => void;
}>;

function QuantityControl({ product, quantity, onAdd, onRemove }: Props) {
  if (quantity > 0) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TouchableOpacity
          onPress={() => onRemove(product)}
          activeOpacity={0.7}
          style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#e50909', alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="remove" size={16} color="#ffffff" />
        </TouchableOpacity>
        <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14, minWidth: 16, textAlign: 'center' }}>
          {quantity}
        </Text>
        <TouchableOpacity
          onPress={() => onAdd(product)}
          activeOpacity={0.7}
          style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#e50909', alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="add" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <TouchableOpacity
      onPress={() => onAdd(product)}
      activeOpacity={0.7}
      style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#e50909', alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons name="add" size={22} color="#ffffff" />
    </TouchableOpacity>
  );
}

export function PromoProductCard({ product, quantity, onAdd, onRemove }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: '#111111', borderRadius: 14, overflow: 'hidden' }}>
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: '100%', aspectRatio: 1.05 }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: '100%',
            aspectRatio: 1.05,
            backgroundColor: '#1a1a1a',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="restaurant-outline" size={36} color="#333333" />
        </View>
      )}

      <View style={{ padding: 10, gap: 4 }}>
        <Text
          style={{ color: '#ffffff', fontWeight: '700', fontSize: 13, lineHeight: 18 }}
          numberOfLines={2}
        >
          {product.name}
        </Text>

        {product.description ? (
          <Text
            style={{ color: '#888888', fontSize: 11, lineHeight: 15 }}
            numberOfLines={2}
          >
            {product.description}
          </Text>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 6,
          }}
        >
          <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>
            {product.price.toFixed(2)} Bs.
          </Text>

          {product.isAvailable
            ? <QuantityControl product={product} quantity={quantity} onAdd={onAdd} onRemove={onRemove} />
            : <Text style={{ color: '#555555', fontSize: 11 }}>Agotado</Text>
          }
        </View>
      </View>
    </View>
  );
}
