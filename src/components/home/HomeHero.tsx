import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onOrderNow: () => void;
  onViewMenu: () => void;
};

export function HomeHero({ onOrderNow, onViewMenu }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.25, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <LinearGradient
      colors={['#0f0f0f', '#080808', '#000000']}
      style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28 }}
    >
      {/* Red glow accent */}
      <View
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: '#e50909',
          opacity: 0.07,
        }}
      />

      {/* Status badge */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 18 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            borderWidth: 1,
            borderColor: '#e50909',
            backgroundColor: 'rgba(229,9,9,0.1)',
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <Animated.View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: '#e50909',
              opacity: pulseAnim,
            }}
          />
          <Text style={{ color: '#ff6b6b', fontSize: 11, fontWeight: '600' }}>
            Pedidos en línea · Abierto ahora
          </Text>
        </View>
      </View>

      {/* Headline */}
      <View style={{ marginBottom: 10 }}>
        <Text style={{ color: '#ffffff', fontSize: 38, fontWeight: '900', lineHeight: 42, letterSpacing: -0.5 }}>
          El Sabor
        </Text>
        <Text style={{ color: '#e50909', fontSize: 38, fontWeight: '900', lineHeight: 42, letterSpacing: -0.5 }}>
          Que Te
        </Text>
        <Text style={{ color: '#ffffff', fontSize: 38, fontWeight: '900', lineHeight: 42, letterSpacing: -0.5 }}>
          Obsesiona
        </Text>
      </View>

      {/* Subtitle */}
      <Text
        style={{ color: '#666666', fontSize: 13, lineHeight: 19, marginBottom: 22, maxWidth: 260 }}
      >
        Pollo a la leña, combos crispy y guarniciones irresistibles. Listos en minutos.
      </Text>

      {/* CTAs */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
        <TouchableOpacity
          onPress={onOrderNow}
          activeOpacity={0.85}
          style={{
            flex: 1,
            backgroundColor: '#e50909',
            borderRadius: 14,
            paddingVertical: 13,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
            shadowColor: '#e50909',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>Pedir ahora</Text>
          <Ionicons name="arrow-forward" size={15} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onViewMenu}
          activeOpacity={0.8}
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.12)',
            borderRadius: 14,
            paddingVertical: 13,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#cccccc', fontSize: 14, fontWeight: '600' }}>Ver menú</Text>
        </TouchableOpacity>
      </View>

      {/* Meta info */}
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="time-outline" size={13} color="#555555" />
          <Text style={{ color: '#555555', fontSize: 12 }}>15–25 min promedio</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Ionicons name="location-outline" size={13} color="#555555" />
          <Text style={{ color: '#555555', fontSize: 12 }}>Delivery y recojo</Text>
        </View>
      </View>
    </LinearGradient>
  );
}
