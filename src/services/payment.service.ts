import { api } from './api';

// ─── Tipos de request ─────────────────────────────────────────────────────────

export interface NiubizSessionItem {
  productId: string;
  quantity: number;
}

export interface CreateNiubizSessionPayload {
  orderType: 'DELIVERY' | 'PICKUP';
  addressId?: string;
  notes?: string;
  items: NiubizSessionItem[];
}

// ─── Tipos de respuesta ───────────────────────────────────────────────────────

export interface NiubizSessionResponse {
  orderId: string;
  orderNumber: string;
  sessionKey: string;
  purchaseNumber: string;
  merchantId: string;
  amount: number;
  currency: string;
  channel: string;
}

export interface NiubizAuthorizeResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  paymentStatus: 'paid' | 'failed';
  orderStatus: string;
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

export const paymentService = {
  /**
   * Crea la orden en PENDING_PAYMENT y obtiene la sessionKey de Niubiz.
   * El backend calcula el monto; el frontend NO debe enviar `amount`.
   */
  createNiubizSession: (
    payload: CreateNiubizSessionPayload,
  ): Promise<NiubizSessionResponse> =>
    api.post<NiubizSessionResponse>('/payments/niubiz/session', payload),

  /**
   * Autoriza el cargo con el transactionToken generado por el widget JS de Niubiz.
   * El backend busca el monto desde la BD usando orderId.
   */
  authorizeNiubizPayment: (params: {
    orderId: string;
    transactionToken: string;
  }): Promise<NiubizAuthorizeResponse> =>
    api.post<NiubizAuthorizeResponse>('/payments/niubiz/authorize', params),
};
