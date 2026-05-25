import { useEffect, useState, useCallback, useMemo } from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { router } from 'expo-router';
import { productService } from '@/src/services/product.service';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { useCart } from '@/src/context/CartContext';
import type { Product, Category } from '@/src/types/product.types';
import { HomeHeader } from '@/src/components/home/HomeHeader';
import { HomeHero } from '@/src/components/home/HomeHero';
import { SectionTitle } from '@/src/components/home/SectionTitle';
import { CategoryStrip } from '@/src/components/home/CategoryStrip';
import { PromoProductCard } from '@/src/components/home/PromoProductCard';
import { DrawerMenu } from '@/src/components/ui/DrawerMenu';

const PROMO_COUNT = 4;

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function toPairs<T>(arr: T[]): [T, T | null][] {
  const pairs: [T, T | null][] = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push([arr[i], arr[i + 1] ?? null]);
  }
  return pairs;
}

export default function HomeScreen() {
  const { addItem, updateQuantity, items, totalItems } = useCart();

  const handleRemove = useCallback(
    (p: Product) => {
      const current = items.find((i) => i.productId === p.id)?.quantity ?? 1;
      updateQuantity(p.id, current - 1);
    },
    [items, updateQuantity],
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [shuffled, setShuffled] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const [cats, prods] = await Promise.all([
        productService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(cats);
      setShuffled(shuffle(prods));
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

  const promos = useMemo(
    () => shuffled.filter((p) => p.isAvailable).slice(0, PROMO_COUNT),
    [shuffled],
  );
  const promoPairs = useMemo(() => toPairs(promos), [promos]);

  if (loading) return <LoadingState message="Cargando..." />;

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      <HomeHeader totalItems={totalItems} onMenuPress={() => setDrawerOpen(true)} />
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e50909" />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero */}
        <HomeHero
          onOrderNow={() => router.push('/(cliente)/menu')}
          onViewMenu={() => router.push('/(cliente)/menu')}
        />

        {/* Category strip */}
        {categories.length > 0 && (
          <View style={{ marginTop: 28, marginBottom: 28 }}>
            <CategoryStrip categories={categories} />
          </View>
        )}

        {/* Selección del día */}
        {promoPairs.length > 0 && (
          <View style={{ marginBottom: 28 }}>
            <SectionTitle title="Selección del día" />
            <View style={{ paddingHorizontal: 16, gap: 12 }}>
              {promoPairs.map(([left, right]) => (
                <View key={left.id} style={{ flexDirection: 'row', gap: 12 }}>
                  <PromoProductCard
                    product={left}
                    quantity={items.find((i) => i.productId === left.id)?.quantity ?? 0}
                    onAdd={addItem}
                    onRemove={handleRemove}
                  />
                  {right ? (
                    <PromoProductCard
                      product={right}
                      quantity={items.find((i) => i.productId === right.id)?.quantity ?? 0}
                      onAdd={addItem}
                      onRemove={handleRemove}
                    />
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty state */}
        {categories.length === 0 && promoPairs.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ color: '#666666', fontSize: 15 }}>
              Sin productos disponibles
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
