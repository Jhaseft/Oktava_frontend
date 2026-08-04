import { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/theme';
import {
  OptionGroups,
  buildSelectedGroups,
  calcExtra,
  toggleSelection,
  validateSelections,
  type Selections,
} from '@/src/components/Menu/OptionGroups';
import type { OptionGroup, OptionItem, Product } from '@/src/types/product.types';
import type { SelectedOptionGroup } from '@/src/types/cart.types';

type Props = Readonly<{
  visible: boolean;
  product: Product | null;
  onConfirm: (product: Product, selectedOptions: SelectedOptionGroup[], quantity: number) => void;
  onClose: () => void;
}>;

export function ProductDetailModal({ visible, product, onConfirm, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [selections, setSelections] = useState<Selections>(new Map());
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (visible) {
      setSelections(new Map());
      setErrors(new Set());
      setQuantity(1);
    }
  }, [visible, product?.id]);

  const onToggle = useCallback((group: OptionGroup, option: OptionItem) => {
    setSelections((prev) => toggleSelection(prev, group, option));
    setErrors((prev) => {
      const next = new Set(prev);
      next.delete(group.id);
      return next;
    });
  }, []);

  if (!product) return null;

  const groups = product.optionGroups ?? [];
  const available = product.isAvailable;
  const unitPrice = product.price + calcExtra(groups, selections);
  const total = unitPrice * quantity;

  const handleAdd = () => {
    if (!available) return;
    const newErrors = validateSelections(groups, selections);
    if (newErrors.size > 0) {
      setErrors(newErrors);
      return;
    }
    onConfirm(product, buildSelectedGroups(groups, selections), quantity);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Pressable style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)' }} onPress={onClose} />
        <View
          className="bg-white"
          style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '88%', overflow: 'hidden' }}
        >
          <View style={{ height: 210, backgroundColor: colors.surface }}>
            {product.imageUrl ? (
              <Image source={{ uri: product.imageUrl }} style={{ width: '100%', height: '100%' }} contentFit="contain" cachePolicy="memory-disk" transition={150} />
            ) : (
              <View className="items-center justify-center" style={{ width: '100%', height: '100%', backgroundColor: colors.surface }}>
                <Ionicons name="restaurant-outline" size={56} color="#cccccc" />
              </View>
            )}
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              className="absolute items-center justify-center rounded-full"
              style={{ top: 12, right: 12, width: 34, height: 34, backgroundColor: 'rgba(0,0,0,0.55)' }}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flexGrow: 0, flexShrink: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-row items-start justify-between" style={{ gap: 12 }}>
              <Text className="flex-1 font-lemon-bold text-brand-black" style={{ fontSize: 20, lineHeight: 25 }}>{product.name}</Text>
              <Text className="font-lemon-bold text-brand-red" style={{ fontSize: 18 }}>Bs. {product.price.toFixed(2)}</Text>
            </View>

            {!available && (
              <View className="self-start rounded-full" style={{ marginTop: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text className="font-lemon-medium text-brand-muted" style={{ fontSize: 11 }}>Agotado</Text>
              </View>
            )}

            {product.description ? (
              <Text className="font-lemon text-brand-muted" style={{ fontSize: 14, lineHeight: 21, marginTop: 10 }}>{product.description}</Text>
            ) : null}

            {Array.isArray(product.includes) && product.includes.length > 0 && (
              <View style={{ marginTop: 14, gap: 6 }}>
                {product.includes.map((item) => (
                  <View key={item} className="flex-row items-center" style={{ gap: 8 }}>
                    <Ionicons name="checkmark-circle" size={15} color={colors.red} />
                    <Text className="font-lemon text-brand-black" style={{ fontSize: 13 }}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {groups.length > 0 && (
              <View style={{ marginTop: 22 }}>
                <OptionGroups product={product} selections={selections} errors={errors} onToggle={onToggle} />
              </View>
            )}
          </ScrollView>

          <View
            className="flex-row items-center bg-white"
            style={{ gap: 12, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 12 }}
          >
            <View className="flex-row items-center rounded-xl" style={{ borderWidth: 1, borderColor: colors.border, padding: 4, gap: 4 }}>
              <TouchableOpacity
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                activeOpacity={0.7}
                className="items-center justify-center rounded-lg"
                style={{ width: 34, height: 34, backgroundColor: colors.surface }}
              >
                <Ionicons name="remove" size={18} color={colors.black} />
              </TouchableOpacity>
              <Text className="font-lemon-bold text-brand-black text-center" style={{ fontSize: 15, minWidth: 24 }}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity((q) => q + 1)}
                activeOpacity={0.7}
                className="items-center justify-center rounded-lg"
                style={{ width: 34, height: 34, backgroundColor: colors.red }}
              >
                <Ionicons name="add" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleAdd}
              disabled={!available}
              activeOpacity={0.85}
              className="flex-1 flex-row items-center justify-center rounded-xl"
              style={{ backgroundColor: available ? colors.red : colors.borderStrong, paddingVertical: 15, gap: 8 }}
            >
              <Ionicons name="cart" size={18} color="#fff" />
              <Text className="font-lemon-bold text-white" style={{ fontSize: 14 }}>
                {available ? `Agregar — Bs. ${total.toFixed(2)}` : 'Agotado'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
