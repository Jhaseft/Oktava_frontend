import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react-native";
import { useRouter } from "expo-router";

type TitlePart = {
  text: string;
  color: string;
};

type Props = {
  title?: string;
  titleParts?: TitlePart[];
};

export default function HeaderTitle({ title="OKTAVA", titleParts }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  return (
    <>
  
      <View className="flex-1 pt-10 mb-6 flex-row items-center bg-black px-2">
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.7}
          className="mr-8 "
        >
          <Menu color="white" size={35} />
        </TouchableOpacity>

        <Text className="text-[30px] font-black italic">
          {titleParts
            ? titleParts.map((part, i) => (
                <Text key={i} className={`${part.color}`}>
                  {part.text}
                </Text>
              ))
            : <Text className="text-white">{title}</Text>}
        </Text>

        <View className="flex-1" />

        <TouchableOpacity
          onPress={() => router.push("/(cliente)")}
          activeOpacity={0.7}
        >
          <ShoppingCart color="white" size={35} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View className="flex-1 flex-row bg-black/50">
          
        
          <View className="w-3/4 bg-[#111] pt-[60px] px-6">
            <TouchableOpacity
              onPress={() => setMenuVisible(false)}
              activeOpacity={0.7}
              className="self-end mb-8"
            >
              <X color="white" size={26} />
            </TouchableOpacity>

            <Text className="text-white text-[22px] font-black italic mb-8">
              Menú
            </Text>

            {["Inicio", "Productos", "Perfil", "Configuración"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setMenuVisible(false)}
                activeOpacity={0.7}
                className="py-3.5 border-b border-[#333]"
              >
                <Text className="text-white text-base">{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Pressable
            className="flex-1"
            onPress={() => setMenuVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}