import { mapsSearchUrl } from '@/src/lib/maps';
import type { Order, OrderAddress, OrderStatus } from '@/src/types/order.types';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: 'Pago pendiente',
  PENDING: 'Pendiente',
  ACCEPTED: 'Aceptado',
  PREPARING: 'Preparando',
  ON_THE_WAY: 'En camino',
  PICKED_UP: 'Listo para recoger',
  PAYMENT_FAILED: 'Pago fallido',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

export const STATUS_VARIANT: Record<OrderStatus, BadgeVariant> = {
  PENDING_PAYMENT: 'warning',
  PENDING: 'warning',
  ACCEPTED: 'info',
  PREPARING: 'info',
  ON_THE_WAY: 'info',
  PICKED_UP: 'success',
  PAYMENT_FAILED: 'danger',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

export function formatCurrency(v: number | string): string {
  return `Bs. ${Number(v).toFixed(0)}`;
}

export function formatOrderDate(d: string): string {
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(d));
}

/** Link de Google Maps para una dirección de pedido: prioriza lat/lng reales. */
export function addressMapsUrl(address: OrderAddress): string {
  const { latitude: lat, longitude: lng } = address;
  if (lat != null && lng != null) return mapsSearchUrl(`${lat},${lng}`);
  return mapsSearchUrl(address.direction || address.label);
}

export type StatusIconName =
  | 'clock'
  | 'card'
  | 'check'
  | 'cooking'
  | 'delivery'
  | 'bag'
  | 'checkCircle'
  | 'xCircle'
  | 'alert';

export type StatusUI = { color: string; tint: string; icon: StatusIconName };

// Un color + ícono por estado. `color` = acento (ícono, borde, texto); `tint` = fondo suave.
export const STATUS_UI: Record<OrderStatus, StatusUI> = {
  PENDING_PAYMENT: { color: '#d97706', tint: 'rgba(217,119,6,0.10)', icon: 'card' },
  PENDING:         { color: '#d97706', tint: 'rgba(217,119,6,0.10)', icon: 'clock' },
  ACCEPTED:        { color: '#2563eb', tint: 'rgba(37,99,235,0.10)',  icon: 'check' },
  PREPARING:       { color: '#ea580c', tint: 'rgba(234,88,12,0.10)',  icon: 'cooking' },
  ON_THE_WAY:      { color: '#2563eb', tint: 'rgba(37,99,235,0.10)',  icon: 'delivery' },
  PICKED_UP:       { color: '#16a34a', tint: 'rgba(22,163,74,0.10)',  icon: 'bag' },
  PAYMENT_FAILED:  { color: '#c1121f', tint: 'rgba(193,18,31,0.08)',  icon: 'alert' },
  COMPLETED:       { color: '#16a34a', tint: 'rgba(22,163,74,0.10)',  icon: 'checkCircle' },
  CANCELLED:       { color: '#c1121f', tint: 'rgba(193,18,31,0.08)',  icon: 'xCircle' },
};

export function statusUI(status: OrderStatus): StatusUI {
  return STATUS_UI[status] ?? { color: '#6b6b6b', tint: 'rgba(107,107,107,0.10)', icon: 'clock' };
}

export function statusLabel(status: OrderStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function statusVariant(status: OrderStatus): BadgeVariant {
  return STATUS_VARIANT[status] ?? 'default';
}

export function optionsExtraTotal(item: Order['items'][number]): number {
  return item.selectedOptions.reduce((acc, o) => acc + o.extraPrice, 0);
}
