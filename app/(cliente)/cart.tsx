import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { useCart } from '@/src/context/CartContext';
import { useStoreStatus } from '@/src/context/StoreStatusContext';
import { CartItemCard } from '@/src/components/cart/CartItemCard';
import { colors } from '@/src/theme/theme';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { items, totalItems, totalAmount, updateQuantity, removeItem } = useCart();
  const { isOpen: storeOpen, message: storeMessage } = useStoreStatus();

  const goToMenu = () => router.push('/(cliente)/menu');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        className="flex-row items-center gap-3"
        style={{ paddingHorizontal: 16, paddingTop: insets.top + 8, paddingBottom: 12 }}
      >
        <TouchableOpacity
          onPress={goToMenu}
          activeOpacity={0.7}
          className="items-center justify-center rounded-full"
          style={{ width: 38, height: 38, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.black} />
        </TouchableOpacity>

        <Text className="font-lemon-bold text-brand-black uppercase" style={{ fontSize: 20 }}>
          Carrito
          {totalItems > 0 && (
            <Text className="font-lemon text-brand-muted" style={{ fontSize: 16 }}> ({totalItems})</Text>
          )}
        </Text>
      </View>

      {items.length === 0 ? (
        <View className="items-center justify-center" style={{ flex: 1, gap: 16, paddingHorizontal: 32 }}>
          <Ionicons name="cart-outline" size={64} color={colors.borderStrong} />
          <Text className="font-lemon-bold text-brand-black text-center" style={{ fontSize: 16 }}>
            Tu carrito está vacío
          </Text>
          <Text className="font-lemon text-brand-muted text-center" style={{ fontSize: 13 }}>
            Agrega productos desde el menú.
          </Text>
          <TouchableOpacity
            onPress={goToMenu}
            activeOpacity={0.8}
            className="flex-row items-center rounded-xl"
            style={{ marginTop: 8, backgroundColor: colors.red, paddingHorizontal: 24, paddingVertical: 12, gap: 8 }}
          >
            <Ionicons name="restaurant-outline" size={18} color={colors.white} />
            <Text className="font-lemon-bold text-white" style={{ fontSize: 13 }}>Ir al menú</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._cartId}
          contentContainerStyle={{ gap: 10, paddingHorizontal: 16, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CartItemCard
              item={item}
              onIncrease={() => updateQuantity(item._cartId, item.quantity + 1)}
              onDecrease={() => updateQuantity(item._cartId, item.quantity - 1)}
              onRemove={() => removeItem(item._cartId)}
            />
          )}
          ListFooterComponent={
            <View
              className="rounded-2xl"
              style={{ marginTop: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 12 }}
            >
              <View className="flex-row justify-between">
                <Text className="font-lemon text-brand-muted" style={{ fontSize: 13 }}>Productos ({totalItems})</Text>
                <Text className="font-lemon text-brand-black" style={{ fontSize: 13 }}>BOB/ {totalAmount.toFixed(2)}</Text>
              </View>

              <View style={{ height: 1, backgroundColor: colors.border }} />

              <View className="flex-row justify-between">
                <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 15 }}>Total</Text>
                <Text className="font-lemon-bold text-brand-red" style={{ fontSize: 15 }}>
                  BOB/ {totalAmount.toFixed(2)}
                </Text>
              </View>

              {!storeOpen && (
                <View
                  className="rounded-xl"
                  style={{ backgroundColor: 'rgba(193,18,31,0.08)', borderColor: 'rgba(193,18,31,0.30)', borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10 }}
                >
                  <Text className="font-lemon-medium text-brand-red" style={{ fontSize: 12 }}>
                    {storeMessage || 'La tienda está cerrada. No puedes hacer pedidos en este momento.'}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => {
                  if (!storeOpen) return;
                  router.push(token ? '/(cliente)/checkout' : '/login');
                }}
                disabled={!storeOpen}
                activeOpacity={0.8}
                className="items-center justify-center rounded-xl"
                style={{ backgroundColor: storeOpen ? colors.red : colors.borderStrong, height: 50, marginTop: 4 }}
              >
                <Text
                  className="font-lemon-bold"
                  style={{ color: storeOpen ? colors.white : colors.textMuted, fontSize: 14 }}
                >
                  {storeOpen ? 'Proceder con el pedido' : 'Tienda cerrada'}
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}
