import { api } from './api';
import type { Order, CreateOrderDto } from '@/src/types/order.types';

export const orderService = {
  createOrder: (dto: CreateOrderDto): Promise<Order> => api.post('/orders', dto),
  getMyOrders: (): Promise<Order[]> => api.get('/orders/my'),
  confirmReceived: (id: string): Promise<Order> => api.patch(`/orders/${id}/confirm-received`),
};
