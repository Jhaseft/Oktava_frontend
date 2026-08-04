import { STATUS_ICONS } from '@/src/components/order/statusIcons';
import type { OrderStatus } from '@/src/types/order.types';

type Props = Readonly<{ status: OrderStatus; color: string; size?: number }>;

// Ícono SVG por estado (assets/icons/status/*.svg). `color` tiñe el trazo (currentColor).
export function OrderStatusIcon({ status, color, size = 15 }: Props) {
  const Icon = STATUS_ICONS[status];
  if (!Icon) return null;
  return <Icon width={size} height={size} color={color} />;
}
