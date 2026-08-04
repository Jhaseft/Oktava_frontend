import { View } from 'react-native';
import { SectionTitle } from '@/src/components/home/SectionTitle';
import { ProductCard } from '@/src/components/Menu/ProductCard';
import { toPairs, type MenuSection as Section } from '@/src/lib/menuSections';
import type { Product } from '@/src/types/product.types';

type Props = {
  section: Section;
  getQuantity: (id: string) => number;
  onAdd: (p: Product) => void;
  onRemove: (p: Product) => void;
  onOpenDetail: (p: Product) => void;
  onLayoutY: (y: number) => void;
};

export function MenuSection({ section, getQuantity, onAdd, onRemove, onOpenDetail, onLayoutY }: Props) {
  return (
    <View onLayout={(e) => onLayoutY(e.nativeEvent.layout.y)} style={{ marginBottom: 24 }}>
      <SectionTitle title={section.category.name} />
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {toPairs(section.products).map(([left, right]) => (
          <View key={left.id} style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <ProductCard
                product={left}
                quantity={getQuantity(left.id)}
                onAdd={onAdd}
                onRemove={onRemove}
                onOpenDetail={onOpenDetail}
              />
            </View>
            <View style={{ flex: 1 }}>
              {right ? (
                <ProductCard
                  product={right}
                  quantity={getQuantity(right.id)}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onOpenDetail={onOpenDetail}
                />
              ) : (
                <View style={{ flex: 1 }} />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
