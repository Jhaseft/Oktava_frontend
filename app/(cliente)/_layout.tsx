import { Tabs, router } from 'expo-router';
import { TouchableOpacity, View, Text, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SvgProps } from "react-native-svg";
import { useOrders } from '@/src/context/OrderContext';

import HomeIcon from "@/assets/icons/casa.svg";
import SearchIcon from "@/assets/icons/lupa.svg";
import TagIcon from "@/assets/icons/etiqueta.svg";
import UserIcon from "@/assets/icons/usuario.svg";

// ─── Colores ───────────────────────────────────────────────────────────────────

const BAR_SURFACE = '#ffffff'; // superficie de la barra (la abertura queda transparente)
const BAR_BORDER = '#e6e6e6';  // hairline que perfila la barra sobre el fondo blanco
const ACTIVE = '#c1121f';      // rojo elegante
const INACTIVE = '#000000';

// Solo Inicio y Menú muestran la barra (flota sobre su contenido). En Buscar,
// Perfil y las pantallas de detalle/pago (carrito, checkout, pedidos, pagos) se
// oculta para dejar la pantalla enfocada / no tapar sus botones inferiores.
// Nota: "Ofertas" navega al Menú, así que ahí la barra sigue visible.
const PRIMARY_TABS = new Set(['index', 'menu']);

// ─── Geometría de la barra ─────────────────────────────────────────────────────

const BAR_HEIGHT = 75;   // alto visible (sin contar el safe-area inferior)
const CORNER = 1;       // redondeo de esquinas superiores
const RISE = 50;         // cuánto MÁS BAJAS están las esquinas respecto al centro
const NOTCH_HALF = 400;   // medio ancho por donde el borde sube hacia el centro
const POCKET_HALF = 50;  // medio ancho de la cuna donde se acuna el botón
const NOTCH_DIP = 90;    // profundidad de la cuna (respecto a la cresta central)

// Contorno de la barra: las esquinas quedan más abajo (y = RISE) y el borde
// SUBE en curva hacia el centro (cresta en y = 0), con una cuna para el botón.
// Todo lo que queda fuera del contorno (arriba de la curva) es transparente.
function buildBarPath(width: number, height: number): string {
  const cx = width / 2;
  return [
    `M0,${CORNER + RISE}`,
    `Q0,${RISE} ${CORNER},${RISE}`,                                    // esquina sup. izq. (abajo)
    `Q${cx - NOTCH_HALF},${RISE} ${cx - POCKET_HALF},0`,               // el borde sube hacia el centro
    `Q${cx},${NOTCH_DIP} ${cx + POCKET_HALF},0`,                       // cuna del botón
    `Q${cx + NOTCH_HALF},${RISE} ${width - CORNER},${RISE}`,           // el borde baja hacia la esquina
    `Q${width},${RISE} ${width},${CORNER + RISE}`,                     // esquina sup. der. (abajo)
    `L${width},${height}`,
    `L0,${height}`,
    'Z',
  ].join(' ');
}


// ─── Ítem lateral (Inicio · Buscar · Ofertas · Perfil) ─────────────────────────
type IconComponent = React.FC<SvgProps>;
function SideItem({
  icon: Icon,
  label,
  active,
  onPress,
  badge = false,
}: {
  icon: IconComponent;
  label: string;
  active: boolean;
  onPress: () => void;
  badge?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1 items-center justify-center gap-1 py-1"
    >
      <View>
        <Icon
          width={26}
          height={26}
          color={active ? ACTIVE : INACTIVE}
        />
        {badge && (
          <View
            className="absolute rounded-full bg-brand-red"
            style={{ top: -2, right: -3, width: 10, height: 10, borderWidth: 1.5, borderColor: BAR_SURFACE }}
          />
        )}
      </View>

      <Text
        className={`text-[12px] font-lemon-bold uppercase ${
          active ? "text-brand-red" : "text-brand-black"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
 
// ─── Slot central: solo la etiqueta "Menú", alineada con las demás ─────────────
// El botón redondo va aparte (flotante), así la etiqueta queda a la misma altura
// que Inicio/Buscar/Ofertas/Perfil. El View de 22px reserva el espacio del ícono
// para que la etiqueta se alinee exactamente con los otros ítems.

function CenterLabel({ active }: { active: boolean }) {
  return (
    <View className="flex-1 items-center justify-center gap-1 py-1">
      <View className="h-[22px]" />
      <Text className={`text-[12px] font-lemon-bold uppercase ${active ? 'text-brand-red' : 'text-brand-black'}`}>
        Menú
      </Text>
    </View>
  );
}

// ─── Botón redondo flotante (Menú), centrado en el hueco cóncavo ───────────────
// `top` controla qué tan arriba flota; súbelo (más negativo) si haces el notch
// más profundo. `pointerEvents="box-none"` deja pasar los toques a los lados.

function FloatingMenuButton({ onPress }: { onPress: () => void }) {
  return (
    <View className="absolute left-0 right-0 items-center" style={{ top: -25 }} pointerEvents="box-none">
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <View
          className="w-[58px] h-[58px] rounded-full bg-brand-red items-center justify-center"
          style={{
            shadowColor: ACTIVE,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="restaurant" size={26} color="#ffffff" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── Tab bar personalizada (barra negra con abertura transparente) ─────────────

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const { activeOrders } = useOrders();
  const hasActiveOrder = activeOrders.length > 0;
  const currentName = state.routes[state.index]?.name;

  // El layout raíz ya aplica paddingBottom: insets.bottom a toda la app, por eso
  // aquí NO se suma el safe-area (evita el doble espaciado). Solo un respiro.
  const bottomPad = 8;
  const totalH = BAR_HEIGHT + bottomPad;

  // En pantallas de detalle/pago no se dibuja la barra.
  if (!PRIMARY_TABS.has(currentName)) return null;

  const goToTab = (routeName: string) => {
    const route = state.routes.find((r) => r.name === routeName);
    if (!route) return;
    const isFocused = currentName === routeName;
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  // Ofertas es un atajo: abre el Menú preseleccionando la categoría de ofertas.
  const goToOfertas = () => {
    router.push({
      pathname: '/(cliente)/menu',
      params: { category: 'oferta', ts: Date.now().toString() },
    });
  };

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <View style={{ width, height: totalH }}>
        <Svg width={width} height={totalH} style={{ position: 'absolute', top: 0, left: 0 }}>
          <Path d={buildBarPath(width, totalH)} fill={BAR_SURFACE} stroke={BAR_BORDER} strokeWidth={1} />
        </Svg>

    
        <View
          className="flex-row items-end px-2"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, paddingBottom: bottomPad }}
        >
          <SideItem icon={HomeIcon} label="Inicio" active={currentName === 'index'} badge={hasActiveOrder} onPress={() => goToTab('index')} />
          <SideItem icon={SearchIcon} label="Buscar" active={currentName === 'search'} onPress={() => goToTab('search')} />
          <CenterLabel active={currentName === 'menu'} />
          <SideItem icon={TagIcon} label="Ofertas" active={false} onPress={goToOfertas} />
          <SideItem icon={UserIcon} label="Perfil" active={currentName === 'profile'} onPress={() => goToTab('profile')} />
        </View>

   
        <FloatingMenuButton onPress={() => goToTab('menu')} />
      </View>
    </View>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function ClienteLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      backBehavior="history"
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="search" options={{ title: 'Buscar' }} />
      <Tabs.Screen name="menu" options={{ title: 'Menú' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />

      <Tabs.Screen name="cart" options={{ href: null }} />
      <Tabs.Screen name="orders" options={{ href: null }} />
      <Tabs.Screen name="checkout" options={{ href: null }} />
      <Tabs.Screen name="addresses" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="qr-payment" options={{ href: null }} />
      <Tabs.Screen name="niubiz-payment" options={{ href: null }} />
    </Tabs>
  );
}
