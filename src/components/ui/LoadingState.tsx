import { View, ActivityIndicator, Text } from 'react-native';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center bg-white gap-3">
      <ActivityIndicator color="#c1121f" size="large" />
      {message && <Text className="text-brand-muted text-sm font-lemon uppercase tracking-wide">{message}</Text>}
    </View>
  );
}
