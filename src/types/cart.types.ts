export type SelectedOption = {
  optionId: string;
  name: string;
  extraPrice: number;
};

export type SelectedOptionGroup = {
  groupId: string;
  groupName: string;
  items: SelectedOption[];
};

export type CartItem = {
  _cartId: string;
  productId: string;
  name: string;
  unitPrice: number;
  extraPrice: number;
  imageUrl: string | null;
  quantity: number;
  selectedOptions: SelectedOptionGroup[];
};
