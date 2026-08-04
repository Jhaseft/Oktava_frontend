import { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { router } from 'expo-router';
import { productService } from '@/src/services/product.service';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { useCart } from '@/src/context/CartContext';
import type { Category } from '@/src/types/product.types';
import { HomeHeader } from '@/src/components/home/HomeHeader';
import { PromoCarousel } from '@/src/components/home/PromoCarousel';
import { StoreStatusBanner } from '@/src/components/home/StoreStatusBanner';
import { ActiveOrderCard } from '@/src/components/home/ActiveOrderCard';
import { SearchBarButton } from '@/src/components/home/SearchBarButton';
import { CategoryGrid } from '@/src/components/home/CategoryGrid';
import { DrawerMenu } from '@/src/components/ui/DrawerMenu';
import { HOME_BANNERS } from '@/src/data/banners';

export default function HomeScreen() {
  const { totalItems } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const load = useCallback(async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(Array.isArray(cats) ? cats : []);
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

  if (loading) return <LoadingState message="Cargando..." />;

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        style={{ zIndex: 60, elevation: 60 }}
      >
        <HomeHeader
          totalItems={totalItems}
          menuOpen={drawerOpen}
          onMenuPress={() => setDrawerOpen((v) => !v)}
        />
      </View>
      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} topOffset={headerHeight} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c1121f" />
        }
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        <PromoCarousel images={HOME_BANNERS} />

           <ActiveOrderCard />

            <StoreStatusBanner />

     

        <SearchBarButton onPress={() => router.push('/(cliente)/search')} />

        {categories.length > 0 ? (
          <CategoryGrid categories={categories} />
        ) : (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text className="font-lemon" style={{ color: '#6b6b6b', fontSize: 15 }}>
              Sin categorías disponibles
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
