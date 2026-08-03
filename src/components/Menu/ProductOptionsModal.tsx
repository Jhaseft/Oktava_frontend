import { useState, useCallback } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { OptionGroup, OptionItem, Product } from '@/types/product.types';
import type { SelectedOption, SelectedOptionGroup } from '@/types/cart.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const OPTION_PLACEHOLDER = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';

type Props = Readonly<{
  visible: boolean;
  product: Product | null;
  onConfirm: (product: Product, selectedOptions: SelectedOptionGroup[]) => void;
  onClose: () => void;
}>;

type Selections = Map<string, Set<string>>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSingleSelect(group: OptionGroup): boolean {
  return !group.isMultiple;
}

function groupHasImages(group: OptionGroup): boolean {
  return group.options.some((o) => !!o.imageUrl);
}

function calcTotal(product: Product, groups: OptionGroup[], selections: Selections): number {
  let extra = 0;
  for (const group of groups) {
    const chosen = selections.get(group.id);
    if (!chosen) continue;
    for (const opt of group.options) {
      if (chosen.has(opt.id)) extra += opt.extraPrice;
    }
  }
  return product.price + extra;
}

function calcExtra(product: Product, groups: OptionGroup[], selections: Selections): number {
  return calcTotal(product, groups, selections) - product.price;
}

function validateSelections(groups: OptionGroup[], selections: Selections): Set<string> {
  const errors = new Set<string>();
  for (const group of groups) {
    if (group.isRequired && (selections.get(group.id)?.size ?? 0) === 0) {
      errors.add(group.id);
    }
  }
  return errors;
}

function buildSelectedGroups(groups: OptionGroup[], selections: Selections): SelectedOptionGroup[] {
  return groups
    .map((group) => {
      const chosen = selections.get(group.id);
      if (!chosen || chosen.size === 0) return null;
      const items: SelectedOption[] = group.options
        .filter((opt) => chosen.has(opt.id))
        .map((opt) => ({ optionId: opt.id, name: opt.name, extraPrice: opt.extraPrice }));
      return { groupId: group.id, groupName: group.name, items };
    })
    .filter((g): g is SelectedOptionGroup => g !== null);
}

function cardBorderColor(isSelected: boolean, isDisabled: boolean): string {
  if (isSelected) return '#c1121f';
  if (isDisabled) return '#efefef';
  return '#e6e6e6';
}

function rowBorderColor(isSelected: boolean, isDisabled: boolean): string {
  if (isSelected) return '#c1121f';
  if (isDisabled) return '#efefef';
  return '#e6e6e6';
}

// ─── OptionCard (grupo con imágenes) ─────────────────────────────────────────

function OptionCard({
  option,
  isSelected,
  isDisabled,
  single,
  onToggle,
}: Readonly<{
  option: OptionItem;
  isSelected: boolean;
  isDisabled: boolean;
  single: boolean;
  onToggle: () => void;
}>) {
  const cardWidth = (SCREEN_WIDTH - 48 - 10) / 2;

  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={{
        width: cardWidth,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: cardBorderColor(isSelected, isDisabled),
        opacity: isDisabled ? 0.35 : 1,
        backgroundColor: isSelected ? 'rgba(193,18,31,0.06)' : '#f6f6f6',
      }}
    >
      {/* Image */}
      <View style={{ aspectRatio: 4 / 3, width: '100%' }}>
        <Image
          source={{ uri: option.imageUrl ?? OPTION_PLACEHOLDER }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {isSelected && (
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(229,9,9,0.15)' }} />
        )}
        {/* Check indicator */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 26,
            height: 26,
            borderRadius: single ? 13 : 6,
            borderWidth: 2,
            borderColor: isSelected ? '#c1121f' : 'rgba(255,255,255,0.4)',
            backgroundColor: isSelected ? '#c1121f' : 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isSelected && <Ionicons name="checkmark" size={14} color="#fff" strokeWidth={3} />}
        </View>
      </View>

      {/* Label */}
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 8,
          backgroundColor: isSelected ? 'rgba(193,18,31,0.08)' : 'transparent',
        }}
      >
        <Text className="font-lemon-medium" style={{ color: '#141414', fontSize: 13, lineHeight: 17 }}>
          {option.name}
        </Text>
        {option.extraPrice > 0 ? (
          <Text className="font-lemon-bold" style={{ color: '#c1121f', fontSize: 11, marginTop: 2 }}>
            +Bs. {option.extraPrice.toFixed(0)}
          </Text>
        ) : (
          <Text className="font-lemon" style={{ color: '#9a9a9a', fontSize: 11, marginTop: 2 }}>Incluido</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── OptionRow (grupo sin imágenes) ──────────────────────────────────────────

function OptionRow({
  option,
  isSelected,
  isDisabled,
  single,
  onToggle,
}: Readonly<{
  option: OptionItem;
  isSelected: boolean;
  isDisabled: boolean;
  single: boolean;
  onToggle: () => void;
}>) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: rowBorderColor(isSelected, isDisabled),
        backgroundColor: isSelected ? 'rgba(193,18,31,0.08)' : '#f6f6f6',
        paddingHorizontal: 16,
        paddingVertical: 14,
        opacity: isDisabled ? 0.35 : 1,
      }}
    >
      {/* Radio / checkbox indicator */}
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: single ? 10 : 5,
          borderWidth: 2,
          borderColor: isSelected ? '#c1121f' : '#c4c4c4',
          backgroundColor: isSelected ? '#c1121f' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isSelected && <Ionicons name="checkmark" size={11} color="#fff" />}
      </View>

      <Text className="font-lemon-medium" style={{ flex: 1, color: '#141414', fontSize: 15 }}>
        {option.name}
      </Text>

      {option.extraPrice > 0 && (
        <Text className="font-lemon-bold" style={{ color: '#c1121f', fontSize: 13, flexShrink: 0 }}>
          +Bs. {option.extraPrice.toFixed(0)}
        </Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Modal principal ──────────────────────────────────────────────────────────

export function ProductOptionsModal({ visible, product, onConfirm, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [selections, setSelections] = useState<Selections>(new Map());
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const handleClose = useCallback(() => {
    setSelections(new Map());
    setErrors(new Set());
    onClose();
  }, [onClose]);

  const toggleOption = useCallback((group: OptionGroup, option: OptionItem) => {
    setSelections((prev) => {
      const next = new Map(prev);
      const current = new Set(next.get(group.id) ?? []);

      if (isSingleSelect(group)) {
        next.set(group.id, new Set([option.id]));
      } else if (current.has(option.id)) {
        current.delete(option.id);
        next.set(group.id, current);
      } else {
        current.add(option.id);
        next.set(group.id, current);
      }

      return next;
    });
    // clear error for this group once user interacts
    setErrors((prev) => {
      const next = new Set(prev);
      next.delete(group.id);
      return next;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (!product) return;
    const groups = product.optionGroups ?? [];
    const newErrors = validateSelections(groups, selections);
    if (newErrors.size > 0) {
      setErrors(newErrors);
      return;
    }
    onConfirm(product, buildSelectedGroups(groups, selections));
    setSelections(new Map());
    setErrors(new Set());
  }, [product, selections, onConfirm]);

  if (!product) return null;

  const groups = product.optionGroups ?? [];
  const total = calcTotal(product, groups, selections);
  const extra = calcExtra(product, groups, selections);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

        {/* ── Hero image ── */}
        <View style={{ height: 260, position: 'relative' }}>
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#f6f6f6', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="restaurant-outline" size={60} color="#cccccc" />
            </View>
          )}
          <LinearGradient
            colors={['transparent', '#ffffff']}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 160 }}
          />

          {/* Back button */}
          <TouchableOpacity
            onPress={handleClose}
            activeOpacity={0.8}
            style={{
              position: 'absolute',
              top: insets.top + 8,
              left: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: 'rgba(0,0,0,0.55)',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Ionicons name="arrow-back" size={15} color="#fff" />
            <Text className="font-lemon-medium" style={{ color: '#fff', fontSize: 13 }}>Volver</Text>
          </TouchableOpacity>

          {/* Product info */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 16 }}>
            <Text className="font-lemon-bold" style={{ color: '#c1121f', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
              Personaliza tu pedido
            </Text>
            <Text className="font-lemon-bold" style={{ color: '#141414', fontSize: 24, lineHeight: 28 }} numberOfLines={2}>
              {product.name}
            </Text>
            <Text className="font-lemon-medium" style={{ color: '#6b6b6b', fontSize: 14, marginTop: 2 }}>
              Desde Bs. {product.price.toFixed(0)}
            </Text>
          </View>
        </View>

        {/* ── Options (scrollable) ── */}
        <ScrollView
          style={{ flex: 1, backgroundColor: '#ffffff' }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {groups.map((group) => {
            const selectedIds = selections.get(group.id) ?? new Set<string>();
            const hasError = errors.has(group.id);
            const single = isSingleSelect(group);
            const useCards = groupHasImages(group);

            return (
              <View key={group.id} style={{ marginBottom: 28 }}>
                {/* Group header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <Text className="font-lemon-bold" style={{ color: '#141414', fontSize: 16 }}>
                      {group.name}
                    </Text>
                    <View
                      style={{
                        backgroundColor: group.isRequired ? 'rgba(193,18,31,0.10)' : '#efefef',
                        borderRadius: 20,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                      }}
                    >
                      <Text
                        className="font-lemon-bold"
                        style={{
                          color: group.isRequired ? '#c1121f' : '#9a9a9a',
                          fontSize: 9,
                          textTransform: 'uppercase',
                          letterSpacing: 0.8,
                        }}
                      >
                        {group.isRequired ? 'Requerido' : 'Opcional'}
                      </Text>
                    </View>
                  </View>
                  <Text className="font-lemon" style={{ color: '#9a9a9a', fontSize: 12 }}>
                    {single ? 'Elige 1' : 'Elige varios'}
                  </Text>
                </View>

                {/* Error banner */}
                {hasError && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      backgroundColor: 'rgba(193,18,31,0.08)',
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons name="warning" size={14} color="#c1121f" />
                    <Text className="font-lemon-medium" style={{ color: '#c1121f', fontSize: 12, flex: 1 }}>
                      Selecciona al menos 1 opción para continuar.
                    </Text>
                  </View>
                )}

                {/* Options */}
                {useCards ? (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                    {group.options.map((option) => {
                      const isSelected = selectedIds.has(option.id);
                      return (
                        <OptionCard
                          key={option.id}
                          option={option}
                          isSelected={isSelected}
                          isDisabled={false}
                          single={single}
                          onToggle={() => toggleOption(group, option)}
                        />
                      );
                    })}
                  </View>
                ) : (
                  <View style={{ gap: 8 }}>
                    {group.options.map((option) => {
                      const isSelected = selectedIds.has(option.id);
                      return (
                        <OptionRow
                          key={option.id}
                          option={option}
                          isSelected={isSelected}
                          isDisabled={false}
                          single={single}
                          onToggle={() => toggleOption(group, option)}
                        />
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* ── Sticky footer ── */}
        <View
          style={{
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#e6e6e6',
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: insets.bottom + 12,
          }}
        >
          {extra > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 10 }}>
              <Text className="font-lemon" style={{ color: '#9a9a9a', fontSize: 13 }}>
                Base <Text className="font-lemon-bold" style={{ color: '#141414' }}>Bs. {product.price.toFixed(0)}</Text>
              </Text>
              <Text style={{ color: '#c4c4c4', fontSize: 13 }}>+</Text>
              <Text className="font-lemon" style={{ color: '#9a9a9a', fontSize: 13 }}>
                Extras <Text className="font-lemon-bold" style={{ color: '#c1121f' }}>Bs. {extra.toFixed(0)}</Text>
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#c1121f',
              borderRadius: 16,
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <Ionicons name="cart" size={19} color="#fff" />
            <Text className="font-lemon-bold" style={{ color: '#fff', fontSize: 15 }}>
              Agregar al carrito — Bs. {total.toFixed(0)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
