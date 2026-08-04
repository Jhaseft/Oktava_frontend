import { useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMenu } from '@/src/hooks/useMenu';
import { HomeHeader } from '@/src/components/home/HomeHeader';
import { DrawerMenu } from '@/src/components/ui/DrawerMenu';
import { MenuFilterBar } from '@/src/components/Menu/MenuFilterBar';
import { MenuSection } from '@/src/components/Menu/MenuSection';
import { ProductOptionsModal } from '@/src/components/Menu/ProductOptionsModal';
import { LoadingState } from '@/src/components/ui/LoadingState';
import { colors } from '@/src/theme/theme';

export default function MenuScreen() {
  const m = useMenu();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

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
      <ProductOptionsModal
        visible={!!m.optionsProduct}
        product={m.optionsProduct}
        onConfirm={m.handleOptionsConfirm}
        onClose={() => m.setOptionsProduct(null)}
      />

      <ScrollView
        ref={m.scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={m.onScroll}
        refreshControl={<RefreshControl refreshing={m.refreshing} onRefresh={m.onRefresh} tintColor={colors.red} />}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 96 }}
      >
        {m.error && (
          <View style={{ alignItems: 'center', paddingTop: 48, paddingHorizontal: 32, gap: 16 }}>
            <Ionicons name="wifi-outline" size={48} color={colors.red} />
            <Text className="font-lemon-bold text-brand-black text-center" style={{ fontSize: 15 }}>{m.error}</Text>
            <TouchableOpacity onPress={m.retry} activeOpacity={0.75} className="rounded-xl px-6 py-3" style={{ backgroundColor: colors.red }}>
              <Text className="font-lemon-bold text-white" style={{ fontSize: 14 }}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        )}

        {!m.error && m.sections.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 60, gap: 10 }}>
            <Ionicons name="restaurant-outline" size={40} color={colors.borderStrong} />
            <Text className="font-lemon text-brand-muted" style={{ fontSize: 15 }}>
              {m.search.trim() ? 'Sin resultados para tu búsqueda' : 'No hay productos disponibles'}
            </Text>
          </View>
        )}

        {!m.error &&
          m.sections.map((section) => (
            <MenuSection
              key={section.category.id}
              section={section}
              getQuantity={m.getQuantity}
              onAdd={m.handleAdd}
              onRemove={m.handleRemove}
              onOpenOptions={m.setOptionsProduct}
              onLayoutY={(y) => m.registerSection(section.category.id, y)}
            />
          ))}
      </ScrollView>
    </View>
  );
}
