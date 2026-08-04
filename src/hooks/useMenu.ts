import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { productService } from '@/src/services/product.service';
import { useCart } from '@/src/context/CartContext';
import { buildSections, activeSectionId } from '@/src/lib/menuSections';
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

  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});

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

  const registerSection = useCallback((id: string, y: number) => {
    sectionOffsets.current[id] = y;
  }, []);

  const scrollToCategory = useCallback((id: string) => {
    setActiveCategory(id);
    if (id === 'all') {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    const y = sectionOffsets.current[id];
    if (y != null) scrollRef.current?.scrollTo({ y: Math.max(y - SCROLL_GAP, 0), animated: true });
  }, []);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const current = activeSectionId(sections, sectionOffsets.current, e.nativeEvent.contentOffset.y + SCROLL_GAP);
      setActiveCategory((prev) => (prev === current ? prev : current));
    },
    [sections],
  );

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
    onScroll,
    registerSection,
    getQuantity,
    handleAdd,
    handleRemove,
    detailProduct,
    setDetailProduct,
    handleDetailConfirm,
    totalItems,
  };
}
