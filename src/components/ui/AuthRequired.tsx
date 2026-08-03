import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '@/src/theme/theme';

type Props = {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  message: string;
  showRegister?: boolean;
};

export function AuthRequired({ icon = 'person-outline', message, showRegister }: Props) {
  return (
    <View className="flex-1 bg-white items-center justify-center gap-4 px-8">
      <Ionicons name={icon} size={64} color={colors.borderStrong} />
      <Text className="text-brand-black text-lg font-lemon-bold text-center">{message}</Text>
      <TouchableOpacity
        onPress={() => router.push('/login')}
        activeOpacity={0.85}
        className="bg-brand-red rounded-2xl h-[52px] items-center justify-center w-full"
      >
        <Text className="text-white font-lemon-bold text-[15px] uppercase tracking-wide">Iniciar sesión</Text>
      </TouchableOpacity>
      {showRegister && (
        <TouchableOpacity
          onPress={() => router.push('/register')}
          activeOpacity={0.85}
          className="border border-brand-border rounded-2xl h-[52px] items-center justify-center w-full"
        >
          <Text className="text-brand-black font-lemon-bold text-[15px] uppercase tracking-wide">Crear cuenta</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
