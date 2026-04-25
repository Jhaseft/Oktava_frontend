import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';

type MenuRowProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  danger?: boolean;
};

function MenuRow({ icon, label, onPress, danger }: MenuRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-4 bg-zinc-900 rounded-2xl px-4 py-4 border border-white/5"
    >
      <Ionicons name={icon} size={20} color={danger ? '#f87171' : '#a1a1aa'} />
      <Text className={`flex-1 font-semibold text-sm ${danger ? 'text-red-400' : 'text-white'}`}>{label}</Text>
      {!danger && <Ionicons name="chevron-forward" size={16} color="#52525b" />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <View className="flex-1 bg-black px-5 pt-14">
      {/* User info */}
      <View className="items-center gap-2 py-8">
        <View className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/40 items-center justify-center">
          <Text className="text-white text-2xl font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Text>
        </View>
        <Text className="text-white text-xl font-bold">{user?.firstName} {user?.lastName}</Text>
        <Text className="text-zinc-400 text-sm">{user?.email}</Text>
        {user?.phone && <Text className="text-zinc-500 text-sm">{user.phone}</Text>}
      </View>

      <View className="gap-3">
        <MenuRow
          icon="location-outline"
          label="Mis direcciones"
          onPress={() => router.push('/(cliente)/addresses')}
        />
        <MenuRow
          icon="receipt-outline"
          label="Mis pedidos"
          onPress={() => router.push('/(cliente)/orders')}
        />
        <MenuRow
          icon="log-out-outline"
          label="Cerrar sesión"
          onPress={handleLogout}
          danger
        />
      </View>
    </View>
  );
}
