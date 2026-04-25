import { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { productService } from '@/src/services/product.service';
import { CategoryTabs } from '@/src/components/Menu/CategoryTabs';
import { ProductCard } from '@/src/components/Menu/ProductCard';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { useCart } from '@/src/context/CartContext';
import type { Product, Category } from '@/src/types/product.types';

export default function MenuScreen() {
  const { addItem } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [cats, prods] = await Promise.all([
        productService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch {}
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? products
        : products.filter((p) => p.category.id === activeCategory),
    [products, activeCategory],
  );

  if (loading) return <LoadingState message="Cargando menú..." />;

  return (
    <View className="flex-1 bg-black">
      <View className="px-5 pt-14 pb-3">
        <Text className="text-white text-2xl font-bold mb-4">Menú</Text>
        <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 20 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 24, paddingTop: 8 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ef4444" />
        }
        renderItem={({ item }) => (
          <View className="flex-1">
            <ProductCard product={item} onAdd={addItem} />
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 mt-20">
            <EmptyState title="Sin productos" description="No hay productos en esta categoría." />
          </View>
        }
      />
    </View>
  );
}
