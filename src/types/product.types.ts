export type Category = {
  id: string;
  name: string;
  description?: string | null;
  slug?: string;
  imageUrl?: string | null;
  isActive?: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryId?: string | null;
  category?: Category | string | null;
  status?: string;
};
