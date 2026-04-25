import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

export default function Home() {
  useEffect(() => {
    router.replace('/(cliente)/');
  }, []);

  return <View className="flex-1 bg-black" />;
}
