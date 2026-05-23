import { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerMenu } from '@/src/components/ui/DrawerMenu';
import { productService } from '@/src/services/product.service';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { ProductCard } from '@/src/components/Menu/ProductCard';
import { ProductOptionsModal } from '@/src/components/Menu/ProductOptionsModal';
import { useCart } from '@/src/context/CartContext';
import type { Product, Category } from '@/src/types/product.types';
import type { SelectedOptionGroup } from '@/src/types/cart.types';
import { MenuHeader } from '@/src/components/Menu/MenuHeader';
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
  const { addItem, updateQuantity, items, totalItems } = useCart();

  const [optionsProduct, setOptionsProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== 'all') {
      list = list.filter((p) => getProductCategoryId(p) === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false),
      );
    }
    return list;
  }, [products, activeCategory, search]);

  const sections = useMemo(
    () => buildSections(filtered, categories, activeCategory),
    [filtered, categories, activeCategory],
  );

  const handleRetry = useCallback(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  if (loading) return <LoadingState message="Cargando menú..." />;

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <MenuHeader totalItems={totalItems} onMenuPress={() => setDrawerOpen(true)} />
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ProductOptionsModal
        visible={!!optionsProduct}
        product={optionsProduct}
        onConfirm={handleOptionsConfirm}
        onClose={() => setOptionsProduct(null)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#e50909"
          />
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={{ paddingTop: 14 }}>
          <MenuSearchBar
            value={search}
            onChangeText={setSearch}
            onClear={() => setSearch('')}
          />
          <CategoryChipList
            categories={categories}
            activeId={activeCategory}
            onSelect={setActiveCategory}
          />
        </View>

        {/* Error state */}
        {error && (
          <View style={{ alignItems: 'center', paddingTop: 48, paddingHorizontal: 32, gap: 16 }}>
            <Ionicons name="wifi-outline" size={48} color="#e50909" />
            <Text style={{ color: '#ffffff', fontSize: 15, fontWeight: '700', textAlign: 'center' }}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={handleRetry}
              activeOpacity={0.75}
              style={{
                backgroundColor: '#e50909',
                borderRadius: 10,
                paddingHorizontal: 24,
                paddingVertical: 12,
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>
                Reintentar
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty state */}
        {!error && sections.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 60, gap: 10 }}>
            <Ionicons name="restaurant-outline" size={40} color="#444444" />
            <Text style={{ color: '#888888', fontSize: 15 }}>
              {search.trim() ? 'Sin resultados para tu búsqueda' : 'No hay productos disponibles'}
            </Text>
          </View>
        )}

        {/* Sections */}
        {!error &&
          sections.map((section) => (
            <View key={section.category.id} style={{ marginBottom: 24 }}>
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
