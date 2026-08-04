import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';

type Props = Readonly<{
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  badge?: { text: string; ok: boolean };
}>;

export function AccountInfoRow({ icon, label, value, badge }: Props) {
  return (
    <View className="flex-row items-center gap-3" style={{ paddingVertical: 14 }}>
      <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.surface }}>
        <Ionicons name={icon} size={18} color={colors.red} />
      </View>
      <View className="flex-1">
        <Text className="font-lemon text-brand-muted" style={{ fontSize: 11 }}>{label}</Text>
        <Text className="font-lemon-medium text-brand-black" style={{ fontSize: 14, marginTop: 1 }} numberOfLines={1}>
          {value}
        </Text>
      </View>
      {badge && (
        <View
          className="flex-row items-center gap-1 rounded-full"
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            backgroundColor: badge.ok ? 'rgba(22,163,74,0.10)' : 'rgba(193,18,31,0.08)',
            borderWidth: 1,
            borderColor: badge.ok ? 'rgba(22,163,74,0.30)' : 'rgba(193,18,31,0.30)',
          }}
        >
          <Ionicons
            name={badge.ok ? 'checkmark-circle' : 'alert-circle'}
            size={13}
            color={badge.ok ? '#16a34a' : colors.red}
          />
          <Text className="font-lemon-medium" style={{ fontSize: 11, color: badge.ok ? '#16a34a' : colors.red }}>
            {badge.text}
          </Text>
        </View>
      )}
    </View>
  );
}
