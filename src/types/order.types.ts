export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
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
  status: OrderStatus;
  type: OrderType;
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
  type: OrderType;
  items: CreateOrderItem[];
  addressId?: string;
  notes?: string;
};
