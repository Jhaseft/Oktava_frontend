import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import {
  Clock,
  MapPin,
  Percent,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/theme';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.82;
const ANIM_IN = 280;
const ANIM_OUT = 220;

// Número de WhatsApp de OKtava (formato internacional sin '+', para wa.me).
const WHATSAPP_PHONE = '59162565829';

type IconRow = {
  label: string;
  Icon: LucideIcon;
  onPress: () => void;
};

type LinkRow = {
  label: string;
  onPress: () => void;
};

type SocialLink = {
  icon: React.ComponentProps<typeof FontAwesome6>['name'];
  url: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Altura del header: el drawer se abre justo debajo de este offset. */
  topOffset?: number;
};

export function DrawerMenu({ visible, onClose, topOffset = 0 }: Props) {
  const insets = useSafeAreaInsets();
  // El panel entra deslizándose desde la izquierda.
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: ANIM_IN, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: ANIM_IN, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: ANIM_OUT,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, { toValue: 0, duration: ANIM_OUT, useNativeDriver: true }),
      ]).start(() => setMounted(false));
    }
  }, [visible, slideAnim, fadeAnim]);

  // Cierra el drawer y navega cuando termina la animación de salida.
  const go = (action: () => void) => {
    onClose();
    setTimeout(action, 260);
  };

  const push = (path: string) => router.push(path as Parameters<typeof router.push>[0]);

  // 5 accesos principales (con ícono SVG a la izquierda).
  const iconRows: IconRow[] = [
    { label: 'Pedidos', Icon: ShoppingBag, onPress: () => go(() => push('/(cliente)/orders')) },
    {
      label: 'Ofertas',
      Icon: Percent,
      onPress: () =>
        go(() =>
          router.push({
            pathname: '/(cliente)/menu',
            params: { category: 'oferta', ts: Date.now().toString() },
          }),
        ),
    },
    {
      label: 'Explora Menú',
      Icon: UtensilsCrossed,
      onPress: () => go(() => push('/(cliente)/menu')),
    },
    { label: 'Ubicación', Icon: MapPin, onPress: () => go(() => push('/(modal)/Ubicacion')) },
    { label: 'Horarios', Icon: Clock, onPress: () => go(() => push('/(modal)/Horarios')) },
  ];

  // Enlaces informativos (sin ícono).
  const linkRows: LinkRow[] = [
    { label: 'FAQ', onPress: () => go(() => push('/(modal)/FAQ')) },
    { label: 'Términos y condiciones', onPress: () => go(() => push('/(modal)/Terminos')) },
    { label: 'Políticas de privacidad', onPress: () => go(() => push('/(modal)/Privacidad')) },
  ];

  const socialLinks: SocialLink[] = [
    { icon: 'instagram', url: 'https://www.instagram.com/pasarela8oktava' },
    { icon: 'tiktok', url: 'https://www.tiktok.com/@pasarela8oktava' },
  ];

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch {
      // Si no hay app/navegador que pueda abrir el enlace, se ignora.
    }
  };

  // Abre el marcador telefónico con el número de soporte.
  const callSupport = () => openLink(`tel:+${WHATSAPP_PHONE}`);

  if (!mounted) return null;

  // Modal a pantalla completa: cubre TODO (incluida la barra inferior flotante).
  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: topOffset }}
      />

      <View className="absolute left-0 right-0 bottom-0" style={{ top: topOffset }}>
     
        <Animated.View
          className="absolute inset-0 bg-[rgba(20,20,20,0.45)]"
          style={{ opacity: fadeAnim }}
        >
          <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />
        </Animated.View>

       <Animated.View
          className="absolute left-0 top-0 bottom-0 bg-white"
          style={{
            width: DRAWER_WIDTH,
            transform: [{ translateX: slideAnim }],
            paddingBottom: insets.bottom + 8,
            borderRightWidth: 1,
            borderRightColor: colors.border,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ paddingTop: 12 }}
          >
          {iconRows.map(({ label, Icon, onPress }) => (
              <TouchableOpacity
                key={label}
                onPress={onPress}
                activeOpacity={0.6}
                className="flex-row items-center gap-5 px-6 py-4"
              >
                <Icon size={24} color={colors.red} strokeWidth={2} />
                <Text className="text-brand-black text-[16px] font-lemon-bold tracking-wide">
                  {label}
                </Text>
              </TouchableOpacity>
            ))}

           
            <View className="h-px bg-brand-border mx-6 my-4" />

            {linkRows.map(({ label, onPress }) => (
              <TouchableOpacity key={label} onPress={onPress} activeOpacity={0.6} className="px-6 py-3">
                <Text className="text-brand-red text-[16px] font-lemon-bold tracking-wide">
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View>
            <View className="items-center py-3">
              <Image
                source={require('../../../assets/iconoweb.png')}
                resizeMode="contain"
                className="h-32 w-32"
              />
            </View>

            <View className="h-px bg-brand-border mx-6" />

            <TouchableOpacity
              onPress={callSupport}
              activeOpacity={0.7}
              className="flex-row items-center gap-4 px-6 py-5"
            >
              <View className="w-11 h-11 rounded-full bg-brand-red items-center justify-center">
                <Ionicons name="call" size={20} color="#ffffff" />
              </View>
              <Text className="text-brand-black text-base font-lemon-bold tracking-widest">
                CONTACTANOS
              </Text>
            </TouchableOpacity>

         
            <View className="flex-row justify-center gap-8 pb-3">
              {socialLinks.map(({ icon, url }) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => openLink(url)}
                  activeOpacity={0.6}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <FontAwesome6 name={icon} size={26} color={colors.black} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
