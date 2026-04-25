import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { productService } from '@/src/services/product.service';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { ProductCard } from '@/src/components/Menu/ProductCard';
import { useCart } from '@/src/context/CartContext';
import type { Product, Category } from '@/src/types/product.types';

export default function HomeScreen() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [cats, products] = await Promise.all([
        productService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(cats);
      setFeatured(products.filter((p) => p.isAvailable).slice(0, 6));
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
    <ScrollView
      className="flex-1 bg-black"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#ef4444" />}
    >
      {/* Header */}
      <View className="px-5 pt-14 pb-6 gap-1">
        <Text className="text-zinc-400 text-sm">Hola,</Text>
        <Text className="text-white text-2xl font-bold">{user?.firstName} {user?.lastName}</Text>
      </View>

      {/* Hero banner */}
      <View className="mx-5 rounded-2xl bg-red-500/20 border border-red-500/30 p-5 mb-6">
        <Text className="text-white font-bold text-xl mb-1">Menú del día</Text>
        <Text className="text-zinc-300 text-sm mb-4">Descubre lo mejor de nuestra cocina</Text>
        <TouchableOpacity
          onPress={() => router.push('/(cliente)/menu')}
          activeOpacity={0.7}
          className="bg-red-500 self-start rounded-xl px-4 py-2"
        >
          <Text className="text-white font-semibold text-sm">Ver menú completo</Text>
        </TouchableOpacity>
      </View>

      {/* Categories strip */}
      {categories.length > 0 && (
        <View className="mb-6">
          <Text className="text-white font-bold text-lg px-5 mb-3">Categorías</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => router.push('/(cliente)/menu')}
                activeOpacity={0.7}
                className="bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 items-center justify-center min-w-[80px]"
              >
                <Text className="text-white text-xs font-semibold text-center">{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Featured products */}
      {featured.length > 0 && (
        <View className="px-5 pb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white font-bold text-lg">Destacados</Text>
            <TouchableOpacity onPress={() => router.push('/(cliente)/menu')} activeOpacity={0.7}>
              <Text className="text-red-400 text-sm">Ver todos</Text>
            </TouchableOpacity>
          </View>
          <View className="gap-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={addItem} />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
