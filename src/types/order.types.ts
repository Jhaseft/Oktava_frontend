export type OrderStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'ON_THE_WAY'
  | 'PICKED_UP'
  | 'COMPLETED'
  | 'CANCELLED';

export type OrderType = 'DELIVERY' | 'PICKUP';

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  orderType: OrderType;
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  address?: {
    id: string;
    street: string;
    city: string;
    reference: string | null;
  } | null;
};

export type CreateOrderItem = {
  productId: string;
  quantity: number;
};

export type CreateOrderDto = {
  orderType: OrderType;
  items: CreateOrderItem[];
  addressId?: string;
  notes?: string;
};
