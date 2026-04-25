import { View, ActivityIndicator, Text } from 'react-native';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center bg-black gap-3">
      <ActivityIndicator color="#ef4444" size="large" />
      {message && <Text className="text-zinc-400 text-sm">{message}</Text>}
    </View>
  );
}
