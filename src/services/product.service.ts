import { api } from './api';
import type { Product, Category } from '@/src/types/product.types';

export const productService = {
  getCategories: (): Promise<Category[]> => api.get('/categories'),
  getProducts: (): Promise<Product[]> => api.get('/products'),
  getProductById: (id: string): Promise<Product> => api.get(`/products/${id}`),
};
