import { View, Text } from 'react-native';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-zinc-300',
  success: 'bg-green-900/50 text-green-400',
  warning: 'bg-yellow-900/50 text-yellow-400',
  danger: 'bg-red-900/50 text-red-400',
  info: 'bg-blue-900/50 text-blue-400',
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <View className={`rounded-full px-2 py-0.5 self-start ${variants[variant].split(' ')[0]}`}>
      <Text className={`text-xs font-semibold ${variants[variant].split(' ')[1]}`}>{label}</Text>
    </View>
  );
}
