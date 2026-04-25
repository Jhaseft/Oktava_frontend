import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';

export default function CartRedirect() {
  useEffect(() => {
    router.replace('/(cliente)/cart');
  }, []);

  return <View className="flex-1 bg-black" />;
}
