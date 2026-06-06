import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const logoImg = require('../../../assets/oktava_logo.png');
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
      <View className="absolute inset-0">
        {/* Backdrop */}
        <Animated.View
          className="absolute inset-0 bg-[rgba(0,0,0,0.65)]"
          style={{ opacity: fadeAnim }}
        >
          <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />
        </Animated.View>

        {/* Drawer panel */}
        <Animated.View
          className="absolute left-0 top-0 bottom-0 bg-[#111111]"
          style={{
            width: DRAWER_WIDTH,
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 8,
          }}
        >
          {/* Drawer header */}
          <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-[#1e1e1e]">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={26} color="#ffffff" />
            </TouchableOpacity>

            <Image source={logoImg} style={{ width: 120, height: 30 }} resizeMode="contain" />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {/* Accordion items */}
            {accordionItems.map((item) => {
              const isOpen = openAccordion === item.key;
              return (
                <View key={item.key} className="border-b border-[#1e1e1e]">
                  <TouchableOpacity
                    onPress={() => toggleAccordion(item.key)}
                    activeOpacity={0.7}
                    className="flex-row items-center justify-between px-5 py-5"
                  >
                    <Text className="text-white text-base font-semibold">
                      {item.label}
                    </Text>
                    <Ionicons
                      name={isOpen ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#888888"
                    />
                  </TouchableOpacity>

                  {isOpen && (
                    <View className="pb-2.5 px-5">
                      {item.children.map((child) => (
                        <TouchableOpacity
                          key={child.label}
                          onPress={child.onPress}
                          activeOpacity={0.7}
                          className="py-3"
                        >
                          <Text className="text-[#aaaaaa] text-sm">
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
              className="flex-row items-center justify-between px-5 py-5 border-b border-[#1e1e1e] mt-2"
            >
              <Text className="text-[#e50909] text-base font-bold">
                Ubica la Oktava
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#e50909" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate('/(cliente)/menu')}
              activeOpacity={0.7}
              className="flex-row items-center justify-between px-5 py-5 border-b border-[#1e1e1e]"
            >
              <Text className="text-[#e50909] text-base font-bold">
                Nuestro Menú
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#e50909" />
            </TouchableOpacity>
          </ScrollView>

          {/* Social icons */}
          <View className="flex-row justify-center gap-3.5 py-[22px] border-t border-[#1e1e1e]">
            {socialLinks.map(({ icon, bg }, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                className="w-[46px] h-[46px] rounded-full items-center justify-center"
                style={{ backgroundColor: bg }}
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
