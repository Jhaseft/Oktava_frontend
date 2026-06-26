import { api } from './api';

export type BusinessHour = {
  dayOfWeek: number; // 0=Domingo .. 6=Sábado
  isClosed: boolean;
  openTime: string; // "HH:mm"
  closeTime: string;
};

export type StoreStatus = {
  isOpen: boolean;
  paused: boolean;
  message: string;
  today?: {
    dayOfWeek: number;
    isClosed: boolean;
    openTime: string;
    closeTime: string;
  };
};

/**
 * Obtiene el estado de la tienda (abierto/cerrado) desde el backend.
 * GET /store/status -> { isOpen, paused, message, today }
 * Fail-open: si falla la red, asumimos abierto para no bloquear por un error.
 */
export async function getStoreStatus(): Promise<StoreStatus> {
  try {
    return await api.get<StoreStatus>('/store/status');
  } catch {
    return { isOpen: true, paused: false, message: '' };
  }
}

/** Horario semanal (público) para mostrarlo al cliente. */
export async function getStoreHours(): Promise<BusinessHour[]> {
  return api.get<BusinessHour[]>('/store/hours');
}
