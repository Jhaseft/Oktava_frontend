export type PaymentMethod = 'CASH' | 'QR';

export const PAYMENT_OPTIONS: { method: PaymentMethod; label: string; icon: string }[] = [
  { method: 'CASH', label: 'Al recoger', icon: 'cash-outline' },
  { method: 'QR', label: 'Por QR', icon: 'qr-code-outline' },
];

export function paymentMethodLabel(method: PaymentMethod): string {
  return method === 'CASH' ? 'Al recoger' : 'Por QR';
}
