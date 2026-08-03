import { useEffect, useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
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
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const layouts = useRef<Record<string, { x: number; width: number }>>({});

  // Mantiene el chip activo visible (centrado) cuando cambia por scroll-spy o tap.
  useEffect(() => {
    const l = layouts.current[activeId];
    if (!l) return;
    const target = l.x + l.width / 2 - width / 2;
    scrollRef.current?.scrollTo({ x: Math.max(target, 0), animated: true });
  }, [activeId, width]);

  return (
    <ScrollView
      ref={scrollRef}
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
            onLayout={(e) => {
              layouts.current[chip.id] = {
                x: e.nativeEvent.layout.x,
                width: e.nativeEvent.layout.width,
              };
            }}
            activeOpacity={0.7}
            style={{
              borderRadius: 999,
              paddingHorizontal: 18,
              paddingVertical: 9,
              backgroundColor: isActive ? '#c1121f' : '#f6f6f6',
              borderWidth: 1,
              borderColor: isActive ? '#c1121f' : '#e6e6e6',
            }}
          >
            <Text
              className={isActive ? 'font-lemon-bold' : 'font-lemon'}
              style={{
                color: isActive ? '#ffffff' : '#141414',
                fontSize: 13,
                letterSpacing: 0.2,
                textTransform: 'uppercase',
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
