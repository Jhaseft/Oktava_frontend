import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';
import { formatOrderDate } from '@/src/lib/order';

type Props = Readonly<{ orderNumber: string; createdAt: string; onClose: () => void }>;

export function OrderDetailHeader({ orderNumber, createdAt, onClose }: Props) {
  return (
    <>
      <View className="self-center rounded-full" style={{ width: 36, height: 4, backgroundColor: colors.borderStrong, marginTop: 10, marginBottom: 4 }} />
      <View className="flex-row items-center justify-between border-b border-brand-border" style={{ paddingHorizontal: 20, paddingVertical: 14 }}>
        <View style={{ gap: 2 }}>
          <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 18 }}>#{orderNumber}</Text>
          <Text className="font-lemon text-brand-muted" style={{ fontSize: 12 }}>{formatOrderDate(createdAt)}</Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={0.7}
          className="items-center justify-center rounded-full bg-brand-surface"
          style={{ width: 32, height: 32 }}
        >
          <Ionicons name="close" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </>
  );
}
