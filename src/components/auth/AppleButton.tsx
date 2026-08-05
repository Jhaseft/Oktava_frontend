import { Platform, Pressable, Text, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';

type Props = Readonly<{ onPress: () => void; loading: boolean; disabled?: boolean }>;

export function AppleButton({ onPress, loading, disabled }: Props) {
  // Sign in with Apple solo existe en iOS.
  if (Platform.OS !== 'ios') return null;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center justify-center gap-2.5 border border-brand-border rounded-full h-[50px] bg-white ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      {loading ? (
        <ActivityIndicator color={colors.red} size="small" />
      ) : (
        <>
          <FontAwesome name="apple" size={20} color={colors.black} />
          <Text className="text-brand-black text-[13px] font-lemon-bold">Continuar con Apple</Text>
        </>
      )}
    </Pressable>
  );
}
