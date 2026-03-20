import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react-native";
import { useRouter } from "expo-router";

type Props = {
  title: string;
};

export default function HeaderTitle({ title }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Header bar */}
      <View className="flex-1 pt-10 flex-row items-center bg-black px-2">

        {/* Burger menu + título pegados a la izquierda */}
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.7}
          className="mr-3"
        >
          <Menu color="white" size={26} />
        </TouchableOpacity>

        <Text className="text-[22px] font-black italic text-white">
          {title}
        </Text>

        {/* Spacer empuja el carrito a la derecha */}
        <View className="flex-1" />

        {/* Carrito bien a la derecha */}
        <TouchableOpacity
          onPress={() => router.push("/(cliente)")}
          activeOpacity={0.7}
        >
          <ShoppingCart color="white" size={26} />
        </TouchableOpacity>

      </View>

      {/* Modal del burger menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={{ flex: 1, flexDirection: "row", backgroundColor: "rgba(0,0,0,0.5)" }}>

          {/* Panel lateral izquierdo */}
          <View style={{ width: "75%", backgroundColor: "#111", paddingTop: 60, paddingHorizontal: 24 }}>

            {/* Botón cerrar */}
            <TouchableOpacity
              onPress={() => setMenuVisible(false)}
              activeOpacity={0.7}
              style={{ alignSelf: "flex-end", marginBottom: 32 }}
            >
              <X color="white" size={26} />
            </TouchableOpacity>

            {/* Items del menú */}
            <Text style={{ color: "white", fontSize: 22, fontWeight: "900", fontStyle: "italic", marginBottom: 32 }}>
              Menú
            </Text>

            {["Inicio", "Productos", "Perfil", "Configuración"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setMenuVisible(false)}
                activeOpacity={0.7}
                style={{ paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#333" }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Área oscura a la derecha — toca para cerrar */}
          <Pressable
            style={{ flex: 1 }}
            onPress={() => setMenuVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}
