import { View, Text } from 'react-native';
import { Button } from '@/src/components/ui/Button';

type CartSummaryProps = {
  totalItems: number;
  totalAmount: number;
  onCheckout: () => void;
  loading?: boolean;
};

export function CartSummary({ totalItems, totalAmount, onCheckout, loading }: CartSummaryProps) {
  return (
    <View className="bg-zinc-900 rounded-2xl p-4 gap-3 border border-white/5">
      <View className="flex-row justify-between">
        <Text className="text-zinc-400 text-sm">Productos ({totalItems})</Text>
        <Text className="text-white text-sm">BOB/ {totalAmount.toFixed(2)}</Text>
      </View>
      <View className="h-px bg-white/10" />
      <View className="flex-row justify-between">
        <Text className="text-white font-bold text-base">Total</Text>
        <Text className="text-red-400 font-bold text-base">BOB/ {totalAmount.toFixed(2)}</Text>
      </View>
      <Button label="Proceder con el pedido" onPress={onCheckout} loading={loading} />
    </View>
  );
}
