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
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: '#111111',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 16,
      }}
    >
      <Ionicons name={icon} size={20} color={danger ? '#e50909' : '#888888'} />
      <Text style={{ flex: 1, color: danger ? '#e50909' : '#ffffff', fontWeight: '600', fontSize: 14 }}>
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
      <View style={{ flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 32 }}>
        <Ionicons name="person-outline" size={64} color="#333333" />
        <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '700', textAlign: 'center' }}>
          Inicia sesión para ver tu perfil
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/login')}
          activeOpacity={0.8}
          style={{ backgroundColor: '#e50909', borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center', width: '100%' }}
        >
          <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 15 }}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/register')}
          activeOpacity={0.8}
          style={{ borderWidth: 1, borderColor: '#333333', borderRadius: 10, height: 50, alignItems: 'center', justifyContent: 'center', width: '100%' }}
        >
          <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 15 }}>Crear cuenta</Text>
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
      style={{ flex: 1, backgroundColor: '#000000' }}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <View style={{ alignItems: 'center', paddingTop: insets.top + 24, paddingBottom: 32 }}>
        <View style={{
          width: 80, height: 80, borderRadius: 40,
          backgroundColor: '#1a1a1a',
          borderWidth: 2, borderColor: '#e50909',
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        }}>
          <Text style={{ color: '#ffffff', fontSize: 26, fontWeight: '900' }}>
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Text>
        </View>
        <Text style={{ color: '#ffffff', fontSize: 20, fontWeight: '800' }}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={{ color: '#666666', fontSize: 13, marginTop: 4 }}>{user?.email}</Text>
        {user?.phone && (
          <Text style={{ color: '#555555', fontSize: 13, marginTop: 2 }}>{user.phone}</Text>
        )}
      </View>

      {/* Menu rows */}
      <View style={{ paddingHorizontal: 16, gap: 10 }}>
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
        <View style={{ height: 1, backgroundColor: '#1a1a1a', marginVertical: 4 }} />
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
