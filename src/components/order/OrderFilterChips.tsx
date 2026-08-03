import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { ORDER_FILTERS, type OrderFilter } from '@/src/hooks/useOrders';
import { colors } from '@/src/theme/theme';

type Props = {
  active: OrderFilter;
  onSelect: (filter: OrderFilter) => void;
};

export function OrderFilterChips({ active, onSelect }: Props) {
  return (
    <View className="pb-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, alignItems: 'flex-start' }}
      >
        {ORDER_FILTERS.map(({ key, label }) => {
          const isActive = active === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onSelect(key)}
              activeOpacity={0.7}
              style={{
                borderRadius: 999,
                paddingHorizontal: 18,
                paddingVertical: 9,
                backgroundColor: isActive ? colors.red : colors.surface,
                borderWidth: 1,
                borderColor: isActive ? colors.red : colors.border,
              }}
            >
              <Text
                className={isActive ? 'font-lemon-bold' : 'font-lemon'}
                style={{ color: isActive ? '#ffffff' : colors.text, fontSize: 13, letterSpacing: 0.2, textTransform: 'uppercase' }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
