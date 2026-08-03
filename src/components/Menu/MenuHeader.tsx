import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnimatedHamburger } from '@/src/components/ui/AnimatedHamburger';
import { colors } from '@/src/theme/theme';

type Props = { totalItems: number; onMenuPress: () => void; menuOpen?: boolean };

export function MenuHeader({ totalItems, onMenuPress, menuOpen = false }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center justify-between bg-white px-4 pb-3 border-b border-brand-border"
      style={{ paddingTop: insets.top + 8 }}
    >
      <AnimatedHamburger active={menuOpen} onPress={onMenuPress} size={26} color={colors.black} />

    
      <Text className="text-brand-black text-xl font-lemon-bold tracking-[3px]">
        OK<Text className="text-brand-red">TAVA</Text>
      </Text>

      <TouchableOpacity
        onPress={() => router.push('/(cliente)/cart')}
        activeOpacity={0.7}
        style={{ position: 'relative' }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="cart-outline" size={26} color={colors.black} />
        {totalItems > 0 && (
          <View
            className="absolute items-center justify-center bg-brand-red rounded-lg px-[3px]"
            style={{ top: -4, right: -6, minWidth: 16, height: 16 }}
          >
            <Text className="text-white text-[9px] font-lemon-bold">{totalItems}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
