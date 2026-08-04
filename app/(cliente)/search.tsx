import { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';
import { productService } from '@/src/services/product.service';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { ProductCard } from '@/src/components/Menu/ProductCard';
import { ProductDetailModal } from '@/src/components/Menu/ProductDetailModal';
import { MenuSearchBar } from '@/src/components/Menu/MenuSearchBar';
import { useCart } from '@/src/context/CartContext';
import type { Product } from '@/src/types/product.types';
import type { SelectedOptionGroup } from '@/src/types/cart.types';

function toPairs<T>(arr: T[]): [T, T | null][] {
  const pairs: [T, T | null][] = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push([arr[i], arr[i + 1] ?? null]);
  }
  return pairs;
}

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { addItem, updateQuantity, items } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  useEffect(() => {
    productService
      .getProducts()
      .then((prods) => setProducts(Array.isArray(prods) ? prods : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = useCallback(
    (product: Product) => {
      if (product.optionGroups?.length) {
        setDetailProduct(product);
      } else {
        addItem(product);
      }
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

  const query = search.trim().toLowerCase();

  const results = useMemo(() => {
    if (!query) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        (p.description?.toLowerCase().includes(query) ?? false),
    );
  }, [products, query]);

  if (loading) return <LoadingState message="Cargando..." />;

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ProductDetailModal
        visible={!!detailProduct}
        product={detailProduct}
        onConfirm={handleDetailConfirm}
        onClose={() => setDetailProduct(null)}
      />

      <View style={{ paddingTop: insets.top + 8, paddingBottom: 6 }}>
        <View className="flex-row items-center gap-3 px-4 mb-3">
          <TouchableOpacity
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/(cliente)'))}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={26} color={colors.black} />
          </TouchableOpacity>
          <Text className="font-lemon-bold uppercase" style={{ color: '#141414', fontSize: 24 }}>
            Buscar
          </Text>
        </View>
        <MenuSearchBar
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch('')}
          autoFocus
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        {!query && (
          <View style={{ alignItems: 'center', paddingTop: 60, gap: 12, paddingHorizontal: 32 }}>
            <Ionicons name="search-outline" size={44} color="#cccccc" />
            <Text className="font-lemon" style={{ color: '#6b6b6b', fontSize: 15, textAlign: 'center' }}>
              Escribe para buscar platos o bebidas
            </Text>
          </View>
        )}

        {query.length > 0 && results.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 60, gap: 10 }}>
            <Ionicons name="sad-outline" size={40} color="#cccccc" />
            <Text className="font-lemon" style={{ color: '#6b6b6b', fontSize: 15 }}>
              Sin resultados para "{search.trim()}"
            </Text>
          </View>
        )}

        {results.length > 0 && (
          <View style={{ paddingHorizontal: 16, gap: 12, paddingTop: 4 }}>
            {toPairs(results).map(([left, right]) => (
              <View key={left.id} style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <ProductCard
                    product={left}
                    quantity={getProductQuantity(left.id)}
                    onAdd={handleAdd}
                    onRemove={handleRemoveProduct}
                    onOpenDetail={setDetailProduct}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  {right ? (
                    <ProductCard
                      product={right}
                      quantity={getProductQuantity(right.id)}
                      onAdd={handleAdd}
                      onRemove={handleRemoveProduct}
                      onOpenDetail={setDetailProduct}
                    />
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
