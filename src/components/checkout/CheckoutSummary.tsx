import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';
import { paymentMethodLabel, type PaymentMethod } from '@/src/types/checkout.types';
import { SummaryItemRow } from './SummaryItemRow';
import type { CartItem } from '@/src/types/cart.types';
import type { Address } from '@/src/types/address.types';
import type { OrderType } from '@/src/types/order.types';

type Props = Readonly<{
  items: CartItem[];
  totalAmount: number;
  grandTotal: number;
  orderType: OrderType;
  outOfRange: boolean;
  selectedAddress: Address | null;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
}>;

function Row({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-brand-muted text-sm font-lemon">{label}</Text>
      {children}
    </View>
  );
}

export function CheckoutSummary({
  items, totalAmount, grandTotal, orderType, outOfRange, selectedAddress, deliveryFee, paymentMethod,
}: Props) {
  return (
    <View className="rounded-2xl overflow-hidden bg-white border border-brand-border">
      <View className="flex-row items-center gap-2 px-4 py-3 bg-brand-red">
        <Ionicons name="receipt-outline" size={18} color={colors.white} />
        <Text className="text-white font-lemon-bold uppercase" style={{ fontSize: 13 }}>Resumen</Text>
      </View>

      <View className="p-4 gap-3">
        {items.map((item) => <SummaryItemRow key={item._cartId} item={item} />)}

        <View className="h-px bg-brand-border my-1" />

        <Row label="Subtotal">
          <Text className="text-brand-black text-sm font-lemon-medium">Bs. {totalAmount.toFixed(2)}</Text>
        </Row>

        {orderType === 'DELIVERY' && (
          <Row label="Delivery">
            {outOfRange && <Text className="text-brand-red text-sm font-lemon-medium">Fuera de cobertura</Text>}
            {!outOfRange && selectedAddress && <Text className="text-brand-black text-sm font-lemon-medium">Bs. {deliveryFee.toFixed(2)}</Text>}
            {!outOfRange && !selectedAddress && <Text className="text-brand-muted text-sm font-lemon">— selecciona dirección</Text>}
          </Row>
        )}

        <Row label="Método de pago">
          <Text className="text-brand-black text-sm font-lemon-medium">{paymentMethodLabel(paymentMethod)}</Text>
        </Row>

        <View className="flex-row justify-between items-center rounded-xl px-4 py-3 mt-1 bg-brand-red">
          <Text className="text-white font-lemon-bold" style={{ fontSize: 15 }}>Total</Text>
          <Text className="text-white font-lemon-bold" style={{ fontSize: 16 }}>Bs. {grandTotal.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}
