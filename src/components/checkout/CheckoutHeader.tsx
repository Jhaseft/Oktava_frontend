import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';

type Props = Readonly<{ onBack: () => void }>;

export function CheckoutHeader({ onBack }: Props) {
  return (
    <View className="flex-row items-center gap-3">
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        className="items-center justify-center rounded-full bg-brand-surface border border-brand-border"
        style={{ width: 38, height: 38 }}
      >
        <Ionicons name="arrow-back" size={20} color={colors.black} />
      </TouchableOpacity>
      <Text className="text-brand-black text-xl font-lemon-bold uppercase">Checkout</Text>
    </View>
  );
}
