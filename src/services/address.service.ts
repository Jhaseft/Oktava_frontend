import { api } from './api';
import type { Address, CreateAddressDto, UpdateAddressDto } from '@/src/types/address.types';

export const addressService = {
  getAddresses: (): Promise<Address[]> => api.get('/addresses'),
  createAddress: (dto: CreateAddressDto): Promise<Address> => api.post('/addresses', dto),
  updateAddress: (id: string, dto: UpdateAddressDto): Promise<Address> => api.patch(`/addresses/${id}`, dto),
  deleteAddress: (id: string): Promise<void> => api.delete(`/addresses/${id}`),
};
