import { View, Text } from 'react-native';
import { colors } from '@/src/theme/theme';
import { formatCurrency, optionsExtraTotal } from '@/src/lib/order';
import type { OrderItem } from '@/src/types/order.types';

function OrderItemRow({ item, last }: Readonly<{ item: OrderItem; last: boolean }>) {
  const extra = optionsExtraTotal(item);
  return (
    <View
      className="flex-row items-start"
      style={{ gap: 10, padding: 12, borderBottomWidth: last ? 0 : 1, borderBottomColor: colors.border }}
    >
      <View
        className="items-center justify-center rounded-lg"
        style={{ width: 24, height: 24, marginTop: 1, backgroundColor: 'rgba(193,18,31,0.12)' }}
      >
        <Text className="font-lemon-bold text-brand-red" style={{ fontSize: 11 }}>{item.quantity}</Text>
      </View>

      <View className="flex-1" style={{ gap: 3 }}>
        <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 14, lineHeight: 18 }}>{item.productName}</Text>
        {item.selectedOptions.length > 0 && (
          <Text className="font-lemon text-brand-muted" style={{ fontSize: 12, lineHeight: 16 }}>
            {item.selectedOptions.map((o) => o.optionName).join(' · ')}
            {extra > 0 && <Text className="text-brand-red">{`  +${formatCurrency(extra)}`}</Text>}
          </Text>
        )}
        {item.notes ? (
          <Text className="font-lemon text-brand-muted" style={{ fontSize: 11, fontStyle: 'italic' }}>{item.notes}</Text>
        ) : null}
      </View>

      <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 14, marginTop: 1 }}>{formatCurrency(item.subtotal)}</Text>
    </View>
  );
}

type Props = Readonly<{ items: OrderItem[] }>;

export function OrderItemsList({ items }: Props) {
  return (
    <View style={{ gap: 8 }}>
      <Text className="font-lemon-bold text-brand-muted uppercase" style={{ fontSize: 11, letterSpacing: 0.6 }}>Productos</Text>
      <View className="rounded-2xl border border-brand-border bg-brand-surface overflow-hidden">
        {items.map((item, i) => (
          <OrderItemRow key={item.id} item={item} last={i === items.length - 1} />
        ))}
      </View>
    </View>
  );
}
