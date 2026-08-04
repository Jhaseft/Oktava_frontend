import { View, Text } from 'react-native';

type Props = Readonly<{ label?: string }>;

export function AuthDivider({ label = 'O' }: Props) {
  return (
    <View className="flex-row items-center">
      <View className="flex-1 h-px bg-brand-border" />
      <Text className="text-brand-muted text-[13px] font-lemon mx-3.5">{label}</Text>
      <View className="flex-1 h-px bg-brand-border" />
    </View>
  );
}
