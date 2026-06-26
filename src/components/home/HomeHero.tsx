import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useStoreStatus } from '@/src/context/StoreStatusContext';

const heroBg = require('../../../assets/hero-bg.jpg');

type Props = {
  onOrderNow: () => void;
  onViewMenu: () => void;
};

export function HomeHero({ onOrderNow, onViewMenu }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const { isOpen, message } = useStoreStatus();

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
    <ImageBackground source={heroBg} style={styles.root} resizeMode="cover">
      {/* Overlay base suave — deja ver la imagen */}
      <LinearGradient
        colors={['rgba(0,0,0,0.62)', 'rgba(0,0,0,0.38)', 'rgba(0,0,0,0.10)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />
      {/* Degradado vertical suave abajo */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.45)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      {/* Glow orb top-right */}
      <View style={styles.glowTopRight} pointerEvents="none" />
      {/* Glow orb left-center */}
      <View style={styles.glowLeft} pointerEvents="none" />
      {/* Glow orb bottom-center */}
      <View style={styles.glowBottom} pointerEvents="none" />

      {/* Content */}
      <View style={styles.content}>

        {/* Status badge — dinámico según el horario del local */}
        <View style={styles.badgeRow}>
          <View style={[styles.badge, isOpen ? styles.badgeOpen : styles.badgeClosed]}>
            <Animated.View
              style={[styles.dot, isOpen ? styles.dotOpen : styles.dotClosed, { opacity: pulseAnim }]}
            />
            <Text style={[styles.badgeText, isOpen ? styles.badgeTextOpen : styles.badgeTextClosed]}>
              {isOpen ? 'ABIERTO AHORA' : 'CERRADO'}
            </Text>
          </View>
        </View>
        {!isOpen && !!message && (
          <Text style={styles.closedNote}>{message}</Text>
        )}

        {/* Headline */}
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.headlineWhite}>El Sabor</Text>
          <Text style={styles.headlineRed}>Que Te</Text>
          <Text style={styles.headlineWhite}>Obsesiona</Text>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Pollo a la leña, combos crispy y guarniciones irresistibles. Listos en minutos.
        </Text>

        {/* CTAs */}
        <View style={styles.ctaRow}>
          <TouchableOpacity onPress={onOrderNow} activeOpacity={0.85} style={styles.ctaPrimary}>
            <Text style={styles.ctaPrimaryText}>Pedir ahora</Text>
            <Ionicons name="arrow-forward" size={15} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onViewMenu} activeOpacity={0.8} style={styles.ctaSecondary}>
            <Text style={styles.ctaSecondaryText}>Ver menú</Text>
          </TouchableOpacity>
        </View>

        {/* Meta info */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color="#555" />
            <Text style={styles.metaText}>15–25 min promedio</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={13} color="#555" />
            <Text style={styles.metaText}>Delivery y recojo</Text>
          </View>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { position: 'relative' },
  glowTopRight: {
    position: 'absolute', top: -40, right: -40,
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: '#e50909', opacity: 0.07,
  },
  glowLeft: {
    position: 'absolute', left: -60, top: '25%',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#b91c1c', opacity: 0.18,
  },
  glowBottom: {
    position: 'absolute', bottom: -20, alignSelf: 'center',
    width: 260, height: 100, borderRadius: 130,
    backgroundColor: '#e50909', opacity: 0.05,
  },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 9,
    borderWidth: 1.5,
    borderRadius: 24, paddingHorizontal: 16, paddingVertical: 9,
  },
  badgeOpen: { borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.14)' },
  badgeClosed: { borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.14)' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotOpen: { backgroundColor: '#22c55e' },
  dotClosed: { backgroundColor: '#ef4444' },
  badgeText: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5 },
  badgeTextOpen: { color: '#4ade80' },
  badgeTextClosed: { color: '#f87171' },
  closedNote: { color: '#f87171', fontSize: 12, fontWeight: '600', marginBottom: 16, maxWidth: 280 },
  headlineWhite: { color: '#ffffff', fontSize: 38, fontWeight: '900', lineHeight: 42, letterSpacing: -0.5 },
  headlineRed:   { color: '#e50909', fontSize: 38, fontWeight: '900', lineHeight: 42, letterSpacing: -0.5 },
  subtitle: { color: '#999', fontSize: 13, lineHeight: 19, marginBottom: 22, maxWidth: 260 },
  ctaRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  ctaPrimary: {
    flex: 1, backgroundColor: '#e50909', borderRadius: 14,
    paddingVertical: 13, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
    shadowColor: '#e50909', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 6,
  },
  ctaPrimaryText: { color: '#ffffff', fontSize: 14, fontWeight: '700' },
  ctaSecondary: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14, paddingVertical: 13, alignItems: 'center',
  },
  ctaSecondaryText: { color: '#cccccc', fontSize: 14, fontWeight: '600' },
  metaRow: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { color: '#555', fontSize: 12 },
});
