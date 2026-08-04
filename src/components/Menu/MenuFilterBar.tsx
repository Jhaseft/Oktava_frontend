import { View } from 'react-native';
import { MenuSearchBar } from '@/src/components/Menu/MenuSearchBar';
import { CategoryChipList } from '@/src/components/Menu/CategoryChipList';
import type { Category } from '@/src/types/product.types';

type Props = {
  search: string;
  onSearch: (t: string) => void;
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
};

/** Barra pegajosa del menú: buscador + chips de categoría (scroll-spy). */
export function MenuFilterBar({ search, onSearch, categories, activeCategory, onSelectCategory }: Props) {
  return (
    <View className="bg-white pt-3.5 border-b border-brand-border">
      <MenuSearchBar value={search} onChangeText={onSearch} onClear={() => onSearch('')} />
      <CategoryChipList categories={categories} activeId={activeCategory} onSelect={onSelectCategory} />
    </View>
  );
}
