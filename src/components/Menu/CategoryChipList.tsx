import { ScrollView, TouchableOpacity, Text } from 'react-native';
import type { Category } from '@/src/types/product.types';

type ChipItem = { id: string; name: string };

type Props = {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
};

const ALL_CHIP: ChipItem = { id: 'all', name: 'Todos' };

export function CategoryChipList({ categories, activeId, onSelect }: Props) {
  const chips: ChipItem[] = [ALL_CHIP, ...categories];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 8,
        paddingBottom: 20,
      }}
    >
      {chips.map((chip) => {
        const isActive = activeId === chip.id;
        return (
          <TouchableOpacity
            key={chip.id}
            onPress={() => onSelect(chip.id)}
            activeOpacity={0.7}
            style={{
              borderRadius: 999,
              paddingHorizontal: 18,
              paddingVertical: 9,
              backgroundColor: isActive ? '#e50909' : '#1a1a1a',
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: 13,
                fontWeight: isActive ? '700' : '500',
                letterSpacing: 0.2,
              }}
            >
              {chip.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
