import { View, Text } from 'react-native';

type Props = Readonly<{ message: string }>;

export function AuthErrorBanner({ message }: Props) {
  return (
    <View
      className="rounded-xl px-4 py-3"
      style={{ backgroundColor: 'rgba(193,18,31,0.08)', borderColor: 'rgba(193,18,31,0.30)', borderWidth: 1 }}
    >
      <Text className="text-brand-red text-[13px] font-lemon-medium">{message}</Text>
    </View>
  );
}
