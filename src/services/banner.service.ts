import { api } from './api';
import type { Banner } from '@/src/types/banner.types';

export const bannerService = {
  /** GET /banners — banners activos ordenados por sortOrder (asc). */
  getBanners: (): Promise<Banner[]> => api.get('/banners'),
};
