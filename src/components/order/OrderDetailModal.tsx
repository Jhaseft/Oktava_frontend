import { Modal, View, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OrderDetailHeader } from '@/src/components/order/OrderDetailHeader';
import { OrderStatusRow } from '@/src/components/order/OrderStatusRow';
import { OrderAddressCard } from '@/src/components/order/OrderAddressCard';
import { OrderItemsList } from '@/src/components/order/OrderItemsList';
import { OrderTotals } from '@/src/components/order/OrderTotals';
import type { Order } from '@/src/types/order.types';

type Props = Readonly<{ order: Order | null; onClose: () => void }>;

export function OrderDetailModal({ order, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={!!order} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom }}>
        {order && (
          <>
            <OrderDetailHeader orderNumber={order.orderNumber} createdAt={order.createdAt} onClose={onClose} />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
              <OrderStatusRow status={order.status} orderType={order.orderType} />

              {order.orderType === 'DELIVERY' && order.address && <OrderAddressCard address={order.address} />}

              <OrderItemsList items={order.items ?? []} />

              {order.notes && (
                <View className="rounded-2xl border border-brand-border bg-brand-surface" style={{ padding: 14, gap: 6 }}>
                  <Text className="font-lemon-bold text-brand-muted uppercase" style={{ fontSize: 11, letterSpacing: 0.6 }}>Instrucciones</Text>
                  <Text className="font-lemon text-brand-muted" style={{ fontSize: 13, lineHeight: 18 }}>{order.notes}</Text>
                </View>
              )}

              <OrderTotals
                subtotal={Number(order.subtotal)}
                deliveryFee={Number(order.deliveryFee)}
                total={Number(order.total)}
                orderType={order.orderType}
              />
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
}
