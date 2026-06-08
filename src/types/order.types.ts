export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PENDING'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'ON_THE_WAY'
  | 'PICKED_UP'
  | 'PAYMENT_FAILED'
  | 'COMPLETED'
  | 'CANCELLED';

export type OrderType = 'DELIVERY' | 'PICKUP';

export type OrderItemOption = {
  id: string;
  optionId: string;
  optionName: string;
  extraPrice: number;
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes: string | null;
  selectedOptions: OrderItemOption[];
};

export type OrderAddress = {
  id: string;
  label: string;
  direction: string;
  departament: string;
  reference: string | null;
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
  address?: OrderAddress | null;
};

export type CreateOrderItemOption = {
  optionId: string;
  optionName: string;
  extraPrice: number;
};

export type CreateOrderItem = {
  productId: string;
  quantity: number;
  selectedOptions?: CreateOrderItemOption[];
};

export type CreateOrderDto = {
  orderType: OrderType;
  items: CreateOrderItem[];
  addressId?: string;
  notes?: string;
};
