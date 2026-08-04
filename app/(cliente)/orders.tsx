import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { useOrders } from '@/src/hooks/useOrders';
import { useAndroidBackHandler } from '@/src/hooks/useAndroidBackHandler';
import { OrderCard } from '@/src/components/order/OrderCard';
import { OrderFilterChips } from '@/src/components/order/OrderFilterChips';
import { OrderDetailModal } from '@/src/components/order/OrderDetailModal';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { AuthRequired } from '@/src/components/ui/AuthRequired';
import { colors } from '@/src/theme/theme';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { token } = useAuth();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const o = useOrders();

  const fromCheckout = from === 'checkout';

  // Si venimos del flujo de pedido (checkout/pago), el checkout quedó vacío en el
  // historial del Tabs, así que "atrás" vuelve al menú en vez de al checkout.
  const handleBack = () => {
    if (fromCheckout) { router.navigate('/(cliente)/menu'); return; }
    router.back();
  };

  // Mismo control para el botón físico "atrás" del teléfono.
  useAndroidBackHandler(
    useCallback(() => {
      router.navigate('/(cliente)/menu');
      return true;
    }, []),
    fromCheckout,
  );

  if (!token) return <AuthRequired icon="receipt-outline" message="Inicia sesión para ver tus pedidos" />;
  if (o.loading) return <LoadingState message="Cargando pedidos..." />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View className="flex-row items-center gap-3 px-4 pb-3" style={{ paddingTop: insets.top + 8 }}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={26} color={colors.black} />
        </TouchableOpacity>
        <Text className="font-lemon-bold uppercase text-brand-black" style={{ fontSize: 24 }}>Mis pedidos</Text>
      </View>

      <OrderFilterChips active={o.filter} onSelect={o.setFilter} />

      {o.visible.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <Ionicons name="receipt-outline" size={64} color={colors.borderStrong} />
          <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 18 }}>Sin pedidos</Text>
          <Text className="font-lemon text-brand-muted text-center" style={{ fontSize: 14 }}>
            {o.orders.length === 0 ? 'Aún no has realizado ningún pedido.' : 'No hay pedidos en este filtro.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={o.refreshing} onRefresh={o.onRefresh} tintColor={colors.red} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, gap: 10 }}
        >
          {o.visible.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={() => o.setSelected(order)}
              onConfirmReceived={() => o.confirmReceived(order.id)}
              confirming={o.confirming === order.id}
            />
          ))}
        </ScrollView>
      )}

      <OrderDetailModal order={o.selected} onClose={() => o.setSelected(null)} />
    </View>
  );
}
