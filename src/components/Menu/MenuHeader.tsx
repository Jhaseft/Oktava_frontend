import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = { totalItems: number; onMenuPress: () => void };

export function MenuHeader({ totalItems, onMenuPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
        backgroundColor: '#000000',
      }}
    >
      <TouchableOpacity
        onPress={onMenuPress}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="menu" size={26} color="#ffffff" />
      </TouchableOpacity>

      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#e50909', letterSpacing: -0.5 }}>
          OK
        </Text>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#ffffff', letterSpacing: -0.5 }}>
          TA
        </Text>
        <Text style={{ fontSize: 24, fontWeight: '900', color: '#e50909', letterSpacing: -0.5 }}>
          VA
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push('/(cliente)/cart')}
        activeOpacity={0.7}
        style={{ position: 'relative' }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="cart-outline" size={26} color="#ffffff" />
        {totalItems > 0 && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              right: -6,
              backgroundColor: '#e50909',
              borderRadius: 8,
              minWidth: 16,
              height: 16,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 3,
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 9, fontWeight: '800' }}>
              {totalItems}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
