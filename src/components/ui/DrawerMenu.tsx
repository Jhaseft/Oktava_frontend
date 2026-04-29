import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.82;
const ANIM_IN = 280;
const ANIM_OUT = 220;

type AccordionItem = {
  key: string;
  label: string;
  children: { label: string; onPress: () => void }[];
};

type SocialLink = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  bg: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function DrawerMenu({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [modalMounted, setModalMounted] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setModalMounted(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: ANIM_IN,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIM_IN,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: ANIM_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIM_OUT,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalMounted(false);
        setOpenAccordion(null);
      });
    }
  }, [visible, slideAnim, fadeAnim]);

  const navigate = (path: string) => {
    onClose();
    setTimeout(() => router.push(path as Parameters<typeof router.push>[0]), 260);
  };

  const accordionItems: AccordionItem[] = [
    {
      key: 'cuenta',
      label: 'Mi cuenta',
      children: [
        { label: 'Perfil', onPress: () => navigate('/(cliente)/profile') },
        { label: 'Mis pedidos', onPress: () => navigate('/(cliente)/orders') },
        { label: 'Mis direcciones', onPress: () => navigate('/(cliente)/addresses') },
      ],
    },
    {
      key: 'oktava',
      label: 'La Oktava',
      children: [
        { label: 'Sobre nosotros', onPress: onClose },
      ],
    },
    {
      key: 'legal',
      label: 'Legal',
      children: [
        { label: 'Términos y condiciones', onPress: onClose },
        { label: 'Política de privacidad', onPress: onClose },
      ],
    },
  ];

  const socialLinks: SocialLink[] = [
    { icon: 'logo-whatsapp', bg: '#25D366' },
    { icon: 'logo-instagram', bg: '#E1306C' },
    { icon: 'musical-notes', bg: '#010101' },
    { icon: 'logo-facebook', bg: '#1877F2' },
  ];

  const toggleAccordion = (key: string) =>
    setOpenAccordion((prev) => (prev === key ? null : key));

  if (!modalMounted) return null;

  return (
    <Modal
      visible={modalMounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={StyleSheet.absoluteFill}>
        {/* Backdrop */}
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.65)', opacity: fadeAnim }]}
        >
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        </Animated.View>

        {/* Drawer panel */}
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: DRAWER_WIDTH,
            backgroundColor: '#111111',
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 8,
          }}
        >
          {/* Drawer header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: '#1e1e1e',
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={26} color="#ffffff" />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#e50909', letterSpacing: -0.5 }}>
                OK
              </Text>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#ffffff', letterSpacing: -0.5 }}>
                TA
              </Text>
              <Text style={{ fontSize: 22, fontWeight: '900', color: '#e50909', letterSpacing: -0.5 }}>
                VA
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigate('/(cliente)/cart')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="cart-outline" size={26} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {/* Accordion items */}
            {accordionItems.map((item) => {
              const isOpen = openAccordion === item.key;
              return (
                <View
                  key={item.key}
                  style={{ borderBottomWidth: 1, borderBottomColor: '#1e1e1e' }}
                >
                  <TouchableOpacity
                    onPress={() => toggleAccordion(item.key)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingHorizontal: 20,
                      paddingVertical: 20,
                    }}
                  >
                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '600' }}>
                      {item.label}
                    </Text>
                    <Ionicons
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#888888"
                    />
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={{ paddingBottom: 10, paddingHorizontal: 20 }}>
                      {item.children.map((child) => (
                        <TouchableOpacity
                          key={child.label}
                          onPress={child.onPress}
                          activeOpacity={0.7}
                          style={{ paddingVertical: 12 }}
                        >
                          <Text style={{ color: '#aaaaaa', fontSize: 14 }}>
                            {child.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}

            {/* Action links */}
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#1e1e1e',
                marginTop: 8,
              }}
            >
              <Text style={{ color: '#e50909', fontSize: 16, fontWeight: '700' }}>
                Ubica la Oktava
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#e50909" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate('/(cliente)/menu')}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingVertical: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#1e1e1e',
              }}
            >
              <Text style={{ color: '#e50909', fontSize: 16, fontWeight: '700' }}>
                Nuestro Menú
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#e50909" />
            </TouchableOpacity>
          </ScrollView>

          {/* Social icons */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 14,
              paddingVertical: 22,
              borderTopWidth: 1,
              borderTopColor: '#1e1e1e',
            }}
          >
            {socialLinks.map(({ icon, bg }, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  backgroundColor: bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name={icon} size={22} color="#ffffff" />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
