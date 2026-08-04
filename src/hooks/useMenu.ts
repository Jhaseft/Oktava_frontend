import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FlatList, ViewToken } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { productService } from '@/src/services/product.service';
import { useCart } from '@/src/context/CartContext';
import { buildSections, type MenuSection } from '@/src/lib/menuSections';
import type { Product, Category } from '@/src/types/product.types';
import type { SelectedOptionGroup } from '@/src/types/cart.types';

// Pequeño respiro para que el título quede justo debajo de la barra de filtros.
const SCROLL_GAP = 8;

/** Estado y lógica del menú: datos, búsqueda, secciones, scroll-spy y carrito. */
export function useMenu() {
  const params = useLocalSearchParams<{ category?: string; ts?: string }>();
  const { addItem, updateQuantity, items, totalItems } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const scrollRef = useRef<FlatList<MenuSection>>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        productService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar el menú');
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const retry = useCallback(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  // El buscador filtra por texto; los chips NO filtran (son scroll-spy/navegación).
  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description?.toLowerCase().includes(q) ?? false),
    );
  }, [products, search]);

  const sections = useMemo(() => buildSections(filtered, categories), [filtered, categories]);

  const scrollToCategory = useCallback((id: string) => {
    setActiveCategory(id);
    if (id === 'all') {
      scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
      return;
    }
    const index = sections.findIndex((s) => s.category.id === id);
    if (index >= 0) scrollRef.current?.scrollToIndex({ index, animated: true, viewOffset: SCROLL_GAP });
  }, [sections]);

  // Con virtualización, scrollToIndex puede fallar si la sección aún no se midió:
  // saltamos por aproximación y reintentamos al render siguiente.
  const onScrollToIndexFailed = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      scrollRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
      setTimeout(() => {
        scrollRef.current?.scrollToIndex({ index: info.index, animated: true, viewOffset: SCROLL_GAP });
      }, 120);
    },
    [],
  );

  // Scroll-spy con virtualización: la primera sección visible marca la categoría
  // activa. (Los offsets por onLayout no sirven en FlatList: son relativos a la celda.)
  // Refs estables: FlatList no permite cambiar estos props en caliente.
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems.find((v) => v.isViewable);
      if (!first) return;
      const id = (first.item as MenuSection).category.id;
      setActiveCategory((prev) => (prev === id ? prev : id));
    },
  ).current;

  // Atajo "Ofertas" (u otra categoría): al llegar con ?category=... baja a la sección.
  useEffect(() => {
    const key = params.category?.trim().toLowerCase();
    if (!key || categories.length === 0) return;
    const match = categories.find(
      (c) => c.id === params.category || c.slug?.toLowerCase() === key || c.name.toLowerCase().includes(key),
    );
    if (!match) return;
    const t = setTimeout(() => scrollToCategory(match.id), 400);
    return () => clearTimeout(t);
  }, [params.category, params.ts, categories, scrollToCategory]);

  // Agregado rápido (botón +/− de la card): incrementa 1 sin abrir el modal.
  const handleAdd = useCallback(
    (product: Product) => {
      if (product.optionGroups?.length) setDetailProduct(product);
      else addItem(product);
    },
    [addItem],
  );

  const handleDetailConfirm = useCallback(
    (product: Product, selectedOptions: SelectedOptionGroup[], quantity: number) => {
      for (let i = 0; i < quantity; i++) addItem(product, selectedOptions);
      setDetailProduct(null);
    },
    [addItem],
  );

  const handleRemove = useCallback(
    (product: Product) => {
      const slot = items.find((i) => i.productId === product.id);
      if (slot) updateQuantity(slot._cartId, slot.quantity - 1);
    },
    [items, updateQuantity],
  );

  const getQuantity = useCallback(
    (productId: string) =>
      items.filter((i) => i.productId === productId).reduce((s, i) => s + i.quantity, 0),
    [items],
  );

  return {
    loading,
    error,
    refreshing,
    onRefresh,
    retry,
    search,
    setSearch,
    categories,
    sections,
    activeCategory,
    scrollRef,
    scrollToCategory,
    onViewableItemsChanged,
    viewabilityConfig,
    onScrollToIndexFailed,
    getQuantity,
    handleAdd,
    handleRemove,
    detailProduct,
    setDetailProduct,
    handleDetailConfirm,
    totalItems,
  };
}
