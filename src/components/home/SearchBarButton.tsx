import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';

type Props = {
  onPress: () => void;
  placeholder?: string;
};

export function SearchBarButton({ onPress, placeholder = 'Buscar por nombre de producto' }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="mx-4 mt-4 h-14 flex-row items-center gap-3 rounded-2xl bg-white border border-brand-border px-4"
      style={{
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <Ionicons name="search" size={20} color={colors.textMuted} />
      <Text className="flex-1 font-lemon text-[15px] text-brand-muted" numberOfLines={1}>
        {placeholder}
      </Text>
    </TouchableOpacity>
  );
}
