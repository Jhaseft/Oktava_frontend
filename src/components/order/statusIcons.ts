import type React from 'react';
import type { SvgProps } from 'react-native-svg';
import type { OrderStatus } from '@/src/types/order.types';

import Pending from '@/assets/icons/status/pending.svg';
import PendingPayment from '@/assets/icons/status/pending-payment.svg';
import Accepted from '@/assets/icons/status/accepted.svg';
import Preparing from '@/assets/icons/status/preparing.svg';
import OnTheWay from '@/assets/icons/status/on-the-way.svg';
import PickedUp from '@/assets/icons/status/picked-up.svg';
import Completed from '@/assets/icons/status/completed.svg';
import Cancelled from '@/assets/icons/status/cancelled.svg';
import PaymentFailed from '@/assets/icons/status/payment-failed.svg';

// Un SVG por estado. Reemplazá el archivo en assets/icons/status/ para cambiar el ícono.
export const STATUS_ICONS: Record<OrderStatus, React.FC<SvgProps>> = {
  PENDING: Pending,
  PENDING_PAYMENT: PendingPayment,
  ACCEPTED: Accepted,
  PREPARING: Preparing,
  ON_THE_WAY: OnTheWay,
  PICKED_UP: PickedUp,
  COMPLETED: Completed,
  CANCELLED: Cancelled,
  PAYMENT_FAILED: PaymentFailed,
};
