import { View, Text, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useCart } from '@/src/context/CartContext';
import { CartItemCard } from '@/src/components/cart/CartItemCard';
import { CartSummary } from '@/src/components/cart/CartSummary';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { Button } from '@/src/components/ui/Button';

export default function CartScreen() {
  const { items, totalItems, totalAmount, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-black">
        <View className="px-5 pt-14 pb-4">
          <Text className="text-white text-2xl font-bold">Carrito</Text>
        </View>
        <EmptyState title="Tu carrito está vacío" description="Agrega productos desde el menú." />
        <View className="px-5 pb-8">
          <Button label="Ir al menú" onPress={() => router.push('/(cliente)/menu')} variant="secondary" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="px-5 pt-14 pb-4">
        <Text className="text-white text-2xl font-bold">
          Carrito <Text className="text-zinc-500 text-lg font-normal">({totalItems})</Text>
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
            onRemove={() => removeItem(item.productId)}
          />
        )}
        ListFooterComponent={
          <View className="mt-4">
            <CartSummary
              totalItems={totalItems}
              totalAmount={totalAmount}
              onCheckout={() => router.push('/(cliente)/checkout')}
            />
          </View>
        }
      />
    </View>
  );
}
