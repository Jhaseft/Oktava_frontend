export type Category = {
  id: string;
  name: string;
  description?: string | null;
  slug?: string;
  imageUrl?: string | null;
  isActive?: boolean;
};

export type OptionItem = {
  id: string;
  name: string;
  extraPrice: number;
  imageUrl?: string | null;
};

export type OptionGroup = {
  id: string;
  name: string;
  isRequired: boolean;
  isMultiple: boolean;
  options: OptionItem[];
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
  includes?: string[] | null;
  optionGroups?: OptionGroup[];
};
