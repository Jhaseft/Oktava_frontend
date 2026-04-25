import { ScrollView, TouchableOpacity, Text } from 'react-native';
import type { Category } from '@/types/product.types';

type CategoryTabsProps = {
  categories: Category[];
  active: string | 'all';
  onChange: (id: string | 'all') => void;
};

export function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
    >
      <TouchableOpacity
        onPress={() => onChange('all')}
        activeOpacity={0.7}
        className={`rounded-full border px-4 py-2 ${
          active === 'all'
            ? 'border-red-500 bg-red-500/20'
            : 'border-white/10 bg-white/5'
        }`}
      >
        <Text
          className={`text-sm font-semibold ${active === 'all' ? 'text-white' : 'text-zinc-300'}`}
        >
          Todos
        </Text>
      </TouchableOpacity>

      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => onChange(cat.id)}
          activeOpacity={0.7}
          className={`rounded-full border px-4 py-2 ${
            active === cat.id
              ? 'border-red-500 bg-red-500/20'
              : 'border-white/10 bg-white/5'
          }`}
        >
          <Text
            className={`text-sm font-semibold ${active === cat.id ? 'text-white' : 'text-zinc-300'}`}
          >
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
