import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DrawerMenu } from '@/src/components/ui/DrawerMenu';
import { productService } from '@/src/services/product.service';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { ProductCard } from '@/src/components/Menu/ProductCard';
import { ProductOptionsModal } from '@/src/components/Menu/ProductOptionsModal';
import { useCart } from '@/src/context/CartContext';
import type { Product, Category } from '@/src/types/product.types';
import type { SelectedOptionGroup } from '@/src/types/cart.types';
import { HomeHeader } from '@/src/components/home/HomeHeader';
import { MenuSearchBar } from '@/src/components/Menu/MenuSearchBar';
import { CategoryChipList } from '@/src/components/Menu/CategoryChipList';
import { SectionTitle } from '@/src/components/home/SectionTitle';

function toPairs<T>(arr: T[]): [T, T | null][] {
  const pairs: [T, T | null][] = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push([arr[i], arr[i + 1] ?? null]);
  }
  return pairs;
}

function getProductCategoryId(product: Product): string | null {
  if (typeof product.category === 'object' && product.category?.id) {
    return product.category.id;
  }
  if (typeof product.categoryId === 'string' && product.categoryId) {
    return product.categoryId;
  }
  return null;
}

function getProductCategoryName(product: Product): string {
  if (typeof product.category === 'object' && product.category?.name) {
    return product.category.name;
  }
  if (typeof product.category === 'string' && product.category.trim()) {
    return product.category;
  }
  return 'Categoría';
}

type Section = { category: Category; products: Product[] };

function buildActiveCategorySection(
  filtered: Product[],
  categories: Category[],
  activeCategory: string,
): Section[] {
  if (filtered.length === 0) return [];
  const found = categories.find((c) => c.id === activeCategory);
  if (found) return [{ category: found, products: filtered }];
  return [{
    category: { id: activeCategory, name: getProductCategoryName(filtered[0]), description: null },
    products: filtered,
  }];
}

function mapKnownCategories(categories: Category[], filtered: Product[]): Section[] {
  return categories
    .map((c) => ({ category: c, products: filtered.filter((p) => getProductCategoryId(p) === c.id) }))
    .filter((s) => s.products.length > 0);
}

function groupProductsIntoMap(products: Product[], excludeIds?: Set<string>): Section[] {
  const map = new Map<string, Section>();
  for (const p of products) {
    const categoryId = getProductCategoryId(p);
    if (!categoryId || excludeIds?.has(categoryId)) continue;
    if (!map.has(categoryId)) {
      map.set(categoryId, {
        category: { id: categoryId, name: getProductCategoryName(p), description: null },
        products: [],
      });
    }
    map.get(categoryId)!.products.push(p);
  }
  return Array.from(map.values());
}

function buildSections(
  filtered: Product[],
  categories: Category[],
  activeCategory: string,
): Section[] {
  if (activeCategory !== 'all') {
    return buildActiveCategorySection(filtered, categories, activeCategory);
  }
  if (categories.length > 0) {
    const byKnown = mapKnownCategories(categories, filtered);
    const knownIds = new Set(categories.map((c) => c.id));
    return [...byKnown, ...groupProductsIntoMap(filtered, knownIds)];
  }
  return groupProductsIntoMap(filtered);
}

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const { addItem, updateQuantity, items, totalItems } = useCart();
  const params = useLocalSearchParams<{ category?: string; ts?: string }>();

  const [optionsProduct, setOptionsProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [subHeaderHeight, setSubHeaderHeight] = useState(0);

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
      const msg = e instanceof Error ? e.message : 'Error al cargar el menú';
      setError(msg);
    }
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  // Atajo "Ofertas" (u otra categoría): al llegar con ?category=... baja hasta
  // la sección cuyo id, slug o nombre coincida. El param `ts` fuerza reaplicar
  // aunque se navegue con el mismo valor. Espera a que las secciones midan su Y.
  useEffect(() => {
    const key = params.category?.trim().toLowerCase();
    if (!key || categories.length === 0) return;
    const match = categories.find(
      (c) =>
        c.id === params.category ||
        c.slug?.toLowerCase() === key ||
        c.name.toLowerCase().includes(key),
    );
    if (!match) return;
    const t = setTimeout(() => scrollToCategory(match.id), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category, params.ts, categories]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleAdd = useCallback(
    (product: Product) => {
      if (product.optionGroups?.length) {
        setOptionsProduct(product);
      } else {
        addItem(product);
      }
    },
    [addItem],
  );

  const handleOptionsConfirm = useCallback(
    (product: Product, selectedOptions: SelectedOptionGroup[]) => {
      addItem(product, selectedOptions);
      setOptionsProduct(null);
    },
    [addItem],
  );

  const handleRemoveProduct = useCallback(
    (product: Product) => {
      const slot = items.find((i) => i.productId === product.id);
      if (!slot) return;
      updateQuantity(slot._cartId, slot.quantity - 1);
    },
    [items, updateQuantity],
  );

  const getProductQuantity = useCallback(
    (productId: string) =>
      items.filter((i) => i.productId === productId).reduce((s, i) => s + i.quantity, 0),
    [items],
  );

  // Los chips ya NO filtran: se muestran todas las secciones y el chip activo
  // refleja la sección visible (scroll-spy). Solo el buscador filtra por texto.
  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false),
    );
  }, [products, search]);

  const sections = useMemo(
    () => buildSections(filtered, categories, 'all'),
    [filtered, categories],
  );

  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});

  // Header colapsable: al bajar se oculta (translateY), al subir reaparece.
  const headerAnim = useRef(new Animated.Value(0)).current;
  const headerHidden = useRef(false);
  const lastScrollY = useRef(0);

  // Toca un chip -> baja hasta esa sección (dejándola bajo la barra pegajosa).
  const scrollToCategory = useCallback(
    (id: string) => {
      setActiveCategory(id);
      if (id === 'all') {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        return;
      }
      const y = sectionOffsets.current[id];
      if (y != null) {
        scrollRef.current?.scrollTo({ y: Math.max(y - subHeaderHeight - 4, 0), animated: true });
      }
    },
    [subHeaderHeight],
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;

      // Scroll-spy: marca el chip de la sección que quedó bajo la barra pegajosa.
      const spyY = y + subHeaderHeight + 8;
      let current = 'all';
      for (const s of sections) {
        const off = sectionOffsets.current[s.category.id];
        if (off != null && off <= spyY) current = s.category.id;
      }
      setActiveCategory((prev) => (prev === current ? prev : current));

      // Oculta/muestra el header según la dirección del scroll. Colapsa solo hasta
      // dejar el buscador justo debajo del status bar (no se mete arriba del todo).
      const collapseDistance = Math.max(headerHeight - insets.top, 0);
      const dy = y - lastScrollY.current;
      if (y > headerHeight && dy > 3 && !headerHidden.current) {
        headerHidden.current = true;
        Animated.timing(headerAnim, {
          toValue: -collapseDistance,
          duration: 220,
          useNativeDriver: true,
        }).start();
      } else if ((dy < -3 || y <= headerHeight) && headerHidden.current) {
        headerHidden.current = false;
        Animated.timing(headerAnim, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }).start();
      }
      lastScrollY.current = y;
    },
    [sections, headerHeight, subHeaderHeight, headerAnim, insets.top],
  );

  const handleRetry = useCallback(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  if (loading) return <LoadingState message="Cargando menú..." />;

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          zIndex: 60,
          elevation: 60,
          transform: [{ translateY: headerAnim }],
        }}
      >
        <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
          <HomeHeader
            totalItems={totalItems}
            menuOpen={drawerOpen}
            onMenuPress={() => setDrawerOpen((v) => !v)}
          />
        </View>
        <View
          onLayout={(e) => setSubHeaderHeight(e.nativeEvent.layout.height)}
          className="bg-white pt-3.5 border-b border-brand-border"
        >
          <MenuSearchBar value={search} onChangeText={setSearch} onClear={() => setSearch('')} />
          <CategoryChipList
            categories={categories}
            activeId={activeCategory}
            onSelect={scrollToCategory}
          />
        </View>
      </Animated.View>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor: '#ffffff',
          zIndex: 61,
          elevation: 61,
        }}
      />

      <DrawerMenu
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        topOffset={headerHeight}
      />
      <ProductOptionsModal
        visible={!!optionsProduct}
        product={optionsProduct}
        onConfirm={handleOptionsConfirm}
        onClose={() => setOptionsProduct(null)}
      />

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#c1121f"
          />
        }
        contentContainerStyle={{ paddingTop: headerHeight + subHeaderHeight + 8, paddingBottom: 96 }}
      >
        {error && (
          <View style={{ alignItems: 'center', paddingTop: 48, paddingHorizontal: 32, gap: 16 }}>
            <Ionicons name="wifi-outline" size={48} color="#c1121f" />
            <Text className="font-lemon-bold" style={{ color: '#141414', fontSize: 15, textAlign: 'center' }}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={handleRetry}
              activeOpacity={0.75}
              style={{
                backgroundColor: '#c1121f',
                borderRadius: 10,
                paddingHorizontal: 24,
                paddingVertical: 12,
              }}
            >
              <Text className="font-lemon-bold" style={{ color: '#ffffff', fontSize: 14 }}>
                Reintentar
              </Text>
            </TouchableOpacity>
          </View>
        )}

   
        {!error && sections.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 60, gap: 10 }}>
            <Ionicons name="restaurant-outline" size={40} color="#cccccc" />
            <Text className="font-lemon" style={{ color: '#6b6b6b', fontSize: 15 }}>
              {search.trim() ? 'Sin resultados para tu búsqueda' : 'No hay productos disponibles'}
            </Text>
          </View>
        )}


        {!error &&
          sections.map((section) => (
            <View
              key={section.category.id}
              onLayout={(e) => {
                sectionOffsets.current[section.category.id] = e.nativeEvent.layout.y;
              }}
              style={{ marginBottom: 24 }}
            >
              <SectionTitle title={section.category.name} />
              <View style={{ paddingHorizontal: 16, gap: 12 }}>
                {toPairs(section.products).map(([left, right]) => (
                  <View key={left.id} style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <ProductCard
                        product={left}
                        quantity={getProductQuantity(left.id)}
                        onAdd={handleAdd}
                        onRemove={handleRemoveProduct}
                        onOpenOptions={setOptionsProduct}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      {right ? (
                        <ProductCard
                          product={right}
                          quantity={getProductQuantity(right.id)}
                          onAdd={handleAdd}
                          onRemove={handleRemoveProduct}
                          onOpenOptions={setOptionsProduct}
                        />
                      ) : (
                        <View style={{ flex: 1 }} />
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}
