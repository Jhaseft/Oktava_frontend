import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export function OrderStatusBanner() {
  return (
    <TouchableOpacity
      onPress={() => router.push('/(cliente)/orders')}
      activeOpacity={0.75}
      style={{
        marginHorizontal: 16,
        marginBottom: 24,
        backgroundColor: '#1e1e1e',
        borderRadius: 14,
        paddingVertical: 26,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        borderWidth: 1,
        borderColor: '#2a2a2a',
      }}
    >
      <Ionicons name="receipt-outline" size={20} color="#888888" />
      <Text
        style={{
          color: '#aaaaaa',
          fontSize: 13,
          fontWeight: '700',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}
      >
        Estado de Pedidos
      </Text>
      <View style={{ position: 'absolute', right: 16 }}>
        <Ionicons name="chevron-forward" size={16} color="#555555" />
      </View>
    </TouchableOpacity>
  );
}
