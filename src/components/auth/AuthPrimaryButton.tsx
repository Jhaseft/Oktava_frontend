import { Pressable, Text, ActivityIndicator } from 'react-native';

type Props = Readonly<{ label: string; onPress: () => void; loading?: boolean; disabled?: boolean }>;

export function AuthPrimaryButton({ label, onPress, loading, disabled }: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      className={`rounded-xl h-[52px] items-center justify-center ${inactive ? 'bg-brand-red/50' : 'bg-brand-red'}`}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text className="text-white text-[15px] font-lemon-bold uppercase tracking-wide">{label}</Text>
      )}
    </Pressable>
  );
}
