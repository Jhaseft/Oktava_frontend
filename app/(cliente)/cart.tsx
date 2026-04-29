import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/src/context/CartContext';
import { CartItemCard } from '@/src/components/cart/CartItemCard';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { items, totalItems, totalAmount, updateQuantity, removeItem } = useCart();

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 16,
        paddingTop: insets.top + 8,
        paddingBottom: 12,
      }}>
        <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: '900' }}>
          Carrito{totalItems > 0 && (
            <Text style={{ color: '#555555', fontSize: 18, fontWeight: '400' }}> ({totalItems})</Text>
          )}
        </Text>
      </View>

      {items.length === 0 ? (
        /* Empty state */
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 32 }}>
          <Ionicons name="cart-outline" size={64} color="#333333" />
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700', textAlign: 'center' }}>
            Tu carrito está vacío
          </Text>
          <Text style={{ color: '#666666', fontSize: 14, textAlign: 'center' }}>
            Agrega productos desde el menú.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(cliente)/menu')}
            activeOpacity={0.7}
            style={{
              marginTop: 8,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#333333',
              paddingHorizontal: 24,
              paddingVertical: 12,
            }}
          >
            <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 14 }}>Ir al menú</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.productId}
          contentContainerStyle={{ gap: 10, paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CartItemCard
              item={item}
              onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
              onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
              onRemove={() => removeItem(item.productId)}
            />
          )}
          ListFooterComponent={
            <View style={{
              marginTop: 8,
              backgroundColor: '#111111',
              borderRadius: 16,
              padding: 16,
              gap: 12,
            }}>
              {/* Summary rows */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#888888', fontSize: 14 }}>Productos ({totalItems})</Text>
                <Text style={{ color: '#ffffff', fontSize: 14 }}>S/ {totalAmount.toFixed(2)}</Text>
              </View>
              <View style={{ height: 1, backgroundColor: '#2a2a2a' }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 16 }}>Total</Text>
                <Text style={{ color: '#e50909', fontWeight: '700', fontSize: 16 }}>
                  S/ {totalAmount.toFixed(2)}
                </Text>
              </View>

              {/* Checkout button */}
              <TouchableOpacity
                onPress={() => router.push('/(cliente)/checkout')}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#e50909',
                  borderRadius: 10,
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 4,
                }}
              >
                <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 15 }}>
                  Ir al checkout
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}
