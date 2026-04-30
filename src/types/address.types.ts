export type Address = {
  id: string;
  label: string;
  direction: string;
  latitude: number;
  longitude: number;
  placeId?: string | null;
  departament: string;
  reference?: string | null;
  contact?: string | null;
};

export type CreateAddressDto = {
  label: string;
  direction: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  departament: string;
  reference?: string;
  contact?: string;
};

export type UpdateAddressDto = Partial<CreateAddressDto>;
