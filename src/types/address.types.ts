export type Address = {
  id: string;
  street: string;
  city: string;
  reference: string | null;
  isDefault: boolean;
};

export type CreateAddressDto = {
  street: string;
  city: string;
  reference?: string;
  isDefault?: boolean;
};

export type UpdateAddressDto = Partial<CreateAddressDto>;
