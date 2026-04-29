import { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerMenu } from '@/src/components/ui/DrawerMenu';
import { productService } from '@/src/services/product.service';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { ProductCard } from '@/src/components/Menu/ProductCard';
import { useCart } from '@/src/context/CartContext';
import type { Product, Category } from '@/src/types/product.types';
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

export default function MenuScreen() {
  const { addItem, totalItems } = useCart();

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

  const sections = useMemo(() => {
    if (activeCategory !== 'all') {
      if (filtered.length === 0) return [];
      const selectedCategory = categories.find((c) => c.id === activeCategory);
      if (selectedCategory) {
        return [{ category: selectedCategory, products: filtered }];
      }
      return [
        {
          category: {
            id: activeCategory,
            name: getProductCategoryName(filtered[0]),
            description: null,
          },
          products: filtered,
        },
      ];
    }

    if (categories.length > 0) {
      const byKnownCategories = categories
        .map((c) => ({
          category: c,
          products: filtered.filter((p) => getProductCategoryId(p) === c.id),
        }))
        .filter((s) => s.products.length > 0);

      const knownIds = new Set(categories.map((c) => c.id));
      const extrasById = new Map<string, { category: Category; products: Product[] }>();
      for (const p of filtered) {
        const categoryId = getProductCategoryId(p);
        if (!categoryId || knownIds.has(categoryId)) continue;
        if (!extrasById.has(categoryId)) {
          extrasById.set(categoryId, {
            category: {
              id: categoryId,
              name: getProductCategoryName(p),
              description: null,
            },
            products: [],
          });
        }
        extrasById.get(categoryId)!.products.push(p);
      }
      return [...byKnownCategories, ...Array.from(extrasById.values())];
    }

    // Fallback: agrupar por categoria embebida en cada producto
    const seen = new Map<string, { category: Category; products: Product[] }>();
    for (const p of filtered) {
      const categoryId = getProductCategoryId(p);
      if (!categoryId) continue;
      if (!seen.has(categoryId)) {
        seen.set(categoryId, {
          category: {
            id: categoryId,
            name: getProductCategoryName(p),
            description: null,
          },
          products: [],
        });
      }
      seen.get(categoryId)!.products.push(p);
    }
    return Array.from(seen.values());
  }, [filtered, categories, activeCategory]);

  if (loading) return <LoadingState message="Cargando menú..." />;

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <MenuHeader totalItems={totalItems} onMenuPress={() => setDrawerOpen(true)} />
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />

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
              onPress={() => { setLoading(true); load().finally(() => setLoading(false)); }}
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
                {toPairs(section.products).map(([left, right], idx) => (
                  <View key={idx} style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <ProductCard product={left} onAdd={addItem} />
                    </View>
                    <View style={{ flex: 1 }}>
                      {right ? (
                        <ProductCard product={right} onAdd={addItem} />
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

