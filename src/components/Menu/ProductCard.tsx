import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Product } from '../../types/product.types';

type ProductCardProps = {
  product: Product;
  onAdd: (product: Product) => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <View style={{ backgroundColor: '#111111', borderRadius: 12, overflow: 'hidden' }}>
      {product.imageUrl ? (
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: '100%', aspectRatio: 1 }}
          resizeMode="cover"
        />
      ) : (
        <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="restaurant-outline" size={36} color="#333333" />
        </View>
      )}

      <View style={{ padding: 10, gap: 4 }}>
        <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 13, lineHeight: 18 }} numberOfLines={2}>
          {product.name}
        </Text>

        {product.description ? (
          <Text style={{ color: '#888888', fontSize: 11, lineHeight: 16 }} numberOfLines={2}>
            {product.description}
          </Text>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 14 }}>
            {product.price.toFixed(2)} Bs.
          </Text>

          {product.isAvailable ? (
            <TouchableOpacity
              onPress={() => onAdd(product)}
              activeOpacity={0.7}
              style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#e50909', alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="add" size={20} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <Text style={{ color: '#555555', fontSize: 11 }}>Agotado</Text>
          )}
        </View>
      </View>
    </View>
  );
}
