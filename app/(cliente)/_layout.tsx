import { Tabs } from 'expo-router';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRequireAuth } from '@/src/hooks/useRequireAuth';
import { useCart } from '@/src/context/CartContext';

// ─── Tab bar icon helper ───────────────────────────────────────────────────────

function TabIcon({ name, color }: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons name={name} size={22} color={color} />;
}

// ─── Floating center button (Carrito) ─────────────────────────────────────────

type CartButtonProps = {
  onPress?: () => void;
  accessibilityState?: { selected?: boolean };
  totalItems: number;
};

function CartTabButton({ onPress, totalItems }: CartButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        top: -18,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#e50909',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#e50909',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 8,
        elevation: 8,
        position: 'relative',
      }}
    >
      <Ionicons name="cart-outline" size={26} color="#ffffff" />
      {totalItems > 0 && (
        <View style={{
          position: 'absolute',
          top: 6,
          right: 6,
          backgroundColor: '#ffffff',
          borderRadius: 8,
          minWidth: 16,
          height: 16,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 3,
        }}>
          <Text style={{ color: '#e50909', fontSize: 9, fontWeight: '800' }}>{totalItems}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function ClienteLayout() {
  const { isLoading, isAuthenticated } = useRequireAuth();
  const { totalItems } = useCart();

  if (isLoading || !isAuthenticated) {
    return <View style={{ flex: 1, backgroundColor: '#000000' }} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 0,
        },
        tabBarActiveTintColor: '#e50909',
        tabBarInactiveTintColor: '#5a5a5a',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <TabIcon name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menú',
          tabBarIcon: ({ color }) => <TabIcon name="restaurant-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: '',
          tabBarShowLabel: false,
          tabBarButton: (props) => (
            <CartTabButton
              onPress={props.onPress ?? undefined}
              accessibilityState={props.accessibilityState ?? undefined}
              totalItems={totalItems}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Pedidos',
          tabBarIcon: ({ color }) => <TabIcon name="receipt-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabIcon name="person-outline" color={color} />,
        }}
      />
      {/* Hidden screens */}
      <Tabs.Screen name="checkout" options={{ href: null }} />
      <Tabs.Screen name="addresses" options={{ href: null }} />
    </Tabs>
  );
}
