import { View, Text } from 'react-native';
import type { OrderStatus } from '@/types/order.types';

const STEPS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED'];

const STEP_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Enviado',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  READY: 'Listo',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

type OrderStatusStepperProps = {
  status: OrderStatus;
};

export function OrderStatusStepper({ status }: OrderStatusStepperProps) {
  if (status === 'CANCELLED') {
    return (
      <View className="items-center py-2">
        <Text className="text-red-400 font-semibold">Pedido cancelado</Text>
      </View>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <View className="flex-row items-center justify-between px-2">
      {STEPS.map((step, index) => {
        const done = index <= currentIndex;
        return (
          <View key={step} className="items-center flex-1">
            <View
              className={`w-6 h-6 rounded-full items-center justify-center ${
                done ? 'bg-red-500' : 'bg-zinc-700'
              }`}
            >
              <Text className="text-white text-xs font-bold">{index + 1}</Text>
            </View>
            <Text className={`text-xs mt-1 text-center ${done ? 'text-red-400' : 'text-zinc-600'}`}>
              {STEP_LABELS[step]}
            </Text>
            {index < STEPS.length - 1 && (
              <View
                className={`absolute top-3 left-[60%] right-[-60%] h-0.5 ${
                  index < currentIndex ? 'bg-red-500' : 'bg-zinc-700'
                }`}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}
