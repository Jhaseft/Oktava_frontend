import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';

type RowProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  danger?: boolean;
};

function Row({ icon, label, onPress, danger }: RowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-3.5 bg-[#111111] rounded-2xl px-4 py-4"
    >
      <Ionicons name={icon} size={20} color={danger ? '#e50909' : '#888888'} />
      <Text className={`flex-1 font-semibold text-sm ${danger ? 'text-[#e50909]' : 'text-white'}`}>
        {label}
      </Text>
      {!danger && <Ionicons name="chevron-forward" size={16} color="#333333" />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, token, signOut } = useAuth();

  if (!token) {
    return (
      <View className="flex-1 bg-black items-center justify-center gap-4 px-8">
        <Ionicons name="person-outline" size={64} color="#333333" />
        <Text className="text-white text-lg font-bold text-center">
          Inicia sesión para ver tu perfil
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/login')}
          activeOpacity={0.8}
          className="bg-[#e50909] rounded-[10px] h-[50px] items-center justify-center w-full"
        >
          <Text className="text-white font-bold text-[15px]">Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/register')}
          activeOpacity={0.8}
          className="border border-[#333333] rounded-[10px] h-[50px] items-center justify-center w-full"
        >
          <Text className="text-white font-semibold text-[15px]">Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <View className="items-center pb-8" style={{ paddingTop: insets.top + 24 }}>
        <View className="w-20 h-20 rounded-full bg-[#1a1a1a] border-2 border-[#e50909] items-center justify-center mb-3.5">
          <Text className="text-white text-[26px] font-black">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Text>
        </View>
        <Text className="text-white text-xl font-extrabold">
          {user?.firstName} {user?.lastName}
        </Text>
        <Text className="text-[#666666] text-[13px] mt-1">{user?.email}</Text>
        {user?.phone && (
          <Text className="text-[#555555] text-[13px] mt-0.5">{user.phone}</Text>
        )}
      </View>

      {/* Menu rows */}
      <View className="px-4 gap-2.5">
        <Row
          icon="location-outline"
          label="Mis direcciones"
          onPress={() => router.push('/(cliente)/addresses')}
        />
        <Row
          icon="receipt-outline"
          label="Mis pedidos"
          onPress={() => router.push('/(cliente)/orders')}
        />
        <View className="h-px bg-[#1a1a1a] my-1" />
        <Row
          icon="log-out-outline"
          label="Cerrar sesión"
          onPress={handleLogout}
          danger
        />
      </View>
    </ScrollView>
  );
}
