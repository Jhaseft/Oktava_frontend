import { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { MenuSection as Section } from '@/src/lib/menuSections';
import { useMenu } from '@/src/hooks/useMenu';
import { HomeHeader } from '@/src/components/home/HomeHeader';
import { DrawerMenu } from '@/src/components/ui/DrawerMenu';
import { MenuFilterBar } from '@/src/components/Menu/MenuFilterBar';
import { MenuSection } from '@/src/components/Menu/MenuSection';
import { ProductDetailModal } from '@/src/components/Menu/ProductDetailModal';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { colors } from '@/src/theme/theme';

export default function MenuScreen() {
  const m = useMenu();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const renderSection = useCallback(
    ({ item }: { item: Section }) => (
      <MenuSection
        section={item}
        getQuantity={m.getQuantity}
        onAdd={m.handleAdd}
        onRemove={m.handleRemove}
        onOpenDetail={m.setDetailProduct}
      />
    ),
    [m.getQuantity, m.handleAdd, m.handleRemove, m.setDetailProduct],
  );
1
  if (m.loading) return <LoadingState message="Cargando menú..." />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}>
        <HomeHeader
          totalItems={m.totalItems}
          menuOpen={drawerOpen}
          onMenuPress={() => setDrawerOpen((v) => !v)}
        />
      </View>

      <MenuFilterBar
        search={m.search}
        onSearch={m.setSearch}
        categories={m.categories}
        activeCategory={m.activeCategory}
        onSelectCategory={m.scrollToCategory}
      />

      <DrawerMenu visible={drawerOpen} onClose={() => setDrawerOpen(false)} topOffset={headerHeight} />
      <ProductDetailModal
        visible={!!m.detailProduct}
        product={m.detailProduct}
        onConfirm={m.handleDetailConfirm}
        onClose={() => m.setDetailProduct(null)}
      />

      {m.error ? (
        <View style={{ alignItems: 'center', paddingTop: 48, paddingHorizontal: 32, gap: 16 }}>
          <Ionicons name="wifi-outline" size={48} color={colors.red} />
          <Text className="font-lemon-bold text-brand-black text-center" style={{ fontSize: 15 }}>{m.error}</Text>
          <TouchableOpacity onPress={m.retry} activeOpacity={0.75} className="rounded-xl px-6 py-3" style={{ backgroundColor: colors.red }}>
            <Text className="font-lemon-bold text-white" style={{ fontSize: 14 }}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={m.scrollRef}
          data={m.sections}
          keyExtractor={(s) => s.category.id}
          renderItem={renderSection}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onViewableItemsChanged={m.onViewableItemsChanged}
          viewabilityConfig={m.viewabilityConfig}
          onScrollToIndexFailed={m.onScrollToIndexFailed}
          initialNumToRender={3}
          maxToRenderPerBatch={4}
          windowSize={7}
          refreshControl={<RefreshControl refreshing={m.refreshing} onRefresh={m.onRefresh} tintColor={colors.red} />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 96 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 60, gap: 10 }}>
              <Ionicons name="restaurant-outline" size={40} color={colors.borderStrong} />
              <Text className="font-lemon text-brand-muted" style={{ fontSize: 15 }}>
                {m.search.trim() ? 'Sin resultados para tu búsqueda' : 'No hay productos disponibles'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
