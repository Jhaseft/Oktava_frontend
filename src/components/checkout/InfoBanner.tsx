import { View, Text } from 'react-native';

type Variant = 'error' | 'success';

type Props = Readonly<{ variant: Variant; message: string }>;

const STYLES: Record<Variant, { bg: string; border: string; text: string }> = {
  error: { bg: 'rgba(193,18,31,0.08)', border: 'rgba(193,18,31,0.30)', text: '#c1121f' },
  success: { bg: 'rgba(22,163,74,0.10)', border: 'rgba(22,163,74,0.30)', text: '#16a34a' },
};

export function InfoBanner({ variant, message }: Props) {
  const s = STYLES[variant];
  return (
    <View className="rounded-xl px-4 py-3" style={{ backgroundColor: s.bg, borderColor: s.border, borderWidth: 1 }}>
      <Text className="text-sm font-lemon-medium" style={{ color: s.text }}>{message}</Text>
    </View>
  );
}
