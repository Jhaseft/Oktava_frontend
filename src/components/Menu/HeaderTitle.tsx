import { View, Text, TouchableOpacity, Modal, Pressable, Linking } from "react-native";
import { useState } from "react";
import { ChevronDown, ChevronRight, Menu, ShoppingCart, X } from "lucide-react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type TitlePart = { text: string; color: string };
type Props = { title?: string; titleParts?: TitlePart[] };

const MENU_ITEMS = [
  { nombre: "Mi cuenta",   ruta: "/(modal)/MiCuenta"  },
  { nombre: "La Oktava",   ruta: "/(modal)/Ubicacion" },
  { nombre: "Legal",       ruta: "/(modal)/Legal"     },
];

const RED_LINKS = [
  { nombre: "Ubica la Oktava", ruta: "/(modal)/Ubicacion" },
  { nombre: "Nuestro Menu",    ruta: "/(modal)/Menu"      },
];

const REDES = [
  { icon: "whatsapp",  bg: "#25D366", url: "https://wa.me/tuNumero"          },
  { icon: "instagram", bg: "#E1306C", url: "https://instagram.com/tuCuenta"  },
  { icon: "tiktok",    bg: "#010101", url: "https://tiktok.com/@tuCuenta"    },
  { icon: "facebook",  bg: "#1877F2", url: "https://facebook.com/tuPagina"   },
];

function OktavaLogo({ titleParts, title }: { titleParts?: TitlePart[]; title: string }) {
  return (
    <Text className="text-[38px] font-black italic">
      {titleParts
        ? titleParts.map((p, i) => <Text key={i} className={p.color}>{p.text}</Text>)
        : <Text className="text-white">{title}</Text>}
    </Text>
  );
}

function SocialIcon({ icon, bg, url }: { icon: string; bg: string; url: string }) {
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(url)}
      activeOpacity={0.8}
      style={{ backgroundColor: bg, width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginRight: 10 }}
    >
      <FontAwesome5 name={icon} size={22} color="white" solid />
    </TouchableOpacity>
  );
}

export default function HeaderTitle({ title = "OKTAVA", titleParts }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      <View className="flex-1 pt-10 mb-4 flex-row items-center bg-black px-2">
        <TouchableOpacity onPress={() => setMenuVisible(true)} activeOpacity={0.7} className="mr-4">
          <Menu color="white" size={35} />
        </TouchableOpacity>

        <OktavaLogo titleParts={titleParts} title={title} />
        <View className="flex-1" />

        <TouchableOpacity onPress={() => router.push("/(carrito)")} activeOpacity={0.7}>
          <ShoppingCart color="white" size={35} />
        </TouchableOpacity>
      </View>

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <View className="flex-1 flex-row bg-black/50">

          <View className="w-3/4 bg-[#111] pt-[35px] px-6 justify-between pb-8">


            <View >

              <View className="flex-row gap-3 border-b-4 border-white mb-4 pb-2">
                <TouchableOpacity onPress={() => setMenuVisible(false)} activeOpacity={0.7}>
                  <X color="white" size={42} />
                </TouchableOpacity>
                <OktavaLogo titleParts={titleParts} title={title} />
              </View>

     
              {MENU_ITEMS.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => { setMenuVisible(false); router.push(item.ruta); }}
                  activeOpacity={0.7}
                  className="flex-row justify-between items-center py-4 border-b border-white/30"
                >
                  <Text className="text-white text-[18px] font-semibold">{item.nombre}</Text>
                  <ChevronDown color="white" size={26} />
                </TouchableOpacity>
              ))}

      
              <View className="mt-64">
                {RED_LINKS.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => { setMenuVisible(false); router.push(item.ruta); }}
                    activeOpacity={0.7}
                    className="flex-row justify-between items-center py-4 border-b border-white/20"
                  >
                    <Text className="text-red-600 text-[18px] font-semibold">{item.nombre}</Text>
                    <ChevronRight color="#dc2626" size={26} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

           
            <View className="flex-row mb-10 gap-3">
              {REDES.map((r, i) => <SocialIcon key={i} {...r} />)}
            </View>

          </View>

          <Pressable className="flex-1" onPress={() => setMenuVisible(false)} />
            
        </View>
      </Modal>
    </>
  );
}