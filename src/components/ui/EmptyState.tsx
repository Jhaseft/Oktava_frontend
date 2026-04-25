import { View, Text } from 'react-native';

type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 gap-2">
      <Text className="text-white text-lg font-semibold text-center">{title}</Text>
      {description && (
        <Text className="text-zinc-400 text-sm text-center">{description}</Text>
      )}
    </View>
  );
}
