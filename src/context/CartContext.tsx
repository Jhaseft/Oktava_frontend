import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartItem, SelectedOptionGroup } from '@/types/cart.types';
import type { Product } from '@/types/product.types';

const CART_KEY = '@oktava:cart';

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  addItem: (product: Product, selectedOptions?: SelectedOptionGroup[]) => void;
  removeItem: (_cartId: string) => void;
  updateQuantity: (_cartId: string, quantity: number) => void;
  clearCart: () => void;
};

function sortedGroups(arr: SelectedOptionGroup[]): SelectedOptionGroup[] {
  return [...arr].sort((x, y) => x.groupId.localeCompare(y.groupId));
}

function groupOptionIds(g: SelectedOptionGroup): string {
  return [...g.items].map((o) => o.optionId).sort((x, y) => x.localeCompare(y)).join(',');
}

function sameOptions(a: SelectedOptionGroup[] | undefined, b: SelectedOptionGroup[]): boolean {
  const sa = a ?? [];
  if (sa.length !== b.length) return false;
  return sortedGroups(sa).every((ga, i) => {
    const gb = sortedGroups(b)[i];
    return ga.groupId === gb.groupId && groupOptionIds(ga) === groupOptionIds(gb);
  });
}

function calcExtraPrice(selectedOptions: SelectedOptionGroup[]): number {
  return selectedOptions.reduce(
    (sum, group) => sum + group.items.reduce((s, o) => s + o.extraPrice, 0),
    0,
  );
}

function makeCartId(product: Product, hasOptions: boolean): string {
  if (!hasOptions) return product.id;
  return `${product.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CART_KEY)
      .then((raw) => {
        if (!raw) return;
        const parsed: any[] = JSON.parse(raw);
        const migrated: CartItem[] = parsed.map((item) => ({
          _cartId: item._cartId ?? item.productId,
          productId: item.productId,
          name: item.name,
          unitPrice: item.unitPrice ?? item.price ?? 0,
          extraPrice: item.extraPrice ?? 0,
          imageUrl: item.imageUrl ?? null,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions ?? [],
        }));
        setItems(migrated);
      })
      .catch(() => {});
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    AsyncStorage.setItem(CART_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const addItem = useCallback(
    (product: Product, selectedOptions: SelectedOptionGroup[] = []) => {
      setItems((prev) => {
        const existing = prev.find(
          (i) => i.productId === product.id && sameOptions(i.selectedOptions, selectedOptions),
        );

        let next: CartItem[];
        if (existing) {
          next = prev.map((i) =>
            i._cartId === existing._cartId ? { ...i, quantity: i.quantity + 1 } : i,
          );
        } else {
          const hasOptions = selectedOptions.length > 0;
          next = [
            ...prev,
            {
              _cartId: makeCartId(product, hasOptions),
              productId: product.id,
              name: product.name,
              unitPrice: product.price,
              extraPrice: calcExtraPrice(selectedOptions),
              imageUrl: product.imageUrl,
              quantity: 1,
              selectedOptions,
            },
          ];
        }

        AsyncStorage.setItem(CART_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [],
  );

  const removeItem = useCallback(
    (_cartId: string) => {
      persist(items.filter((i) => i._cartId !== _cartId));
    },
    [items, persist],
  );

  const updateQuantity = useCallback(
    (_cartId: string, quantity: number) => {
      if (quantity <= 0) {
        persist(items.filter((i) => i._cartId !== _cartId));
      } else {
        persist(items.map((i) => (i._cartId === _cartId ? { ...i, quantity } : i)));
      }
    },
    [items, persist],
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + (i.unitPrice + i.extraPrice) * i.quantity,
    0,
  );

  const value = useMemo(
    () => ({ items, totalItems, totalAmount, addItem, removeItem, updateQuantity, clearCart }),
    [items, totalItems, totalAmount, addItem, removeItem, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
