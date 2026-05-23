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
  if (isSelected) return '#e50909';
  if (isDisabled) return '#222';
  return '#333';
}

function rowBorderColor(isSelected: boolean, isDisabled: boolean): string {
  if (isSelected) return '#e50909';
  if (isDisabled) return '#222';
  return 'rgba(255,255,255,0.08)';
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
        backgroundColor: isSelected ? 'rgba(229,9,9,0.08)' : '#1a1a1a',
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
            borderColor: isSelected ? '#e50909' : 'rgba(255,255,255,0.4)',
            backgroundColor: isSelected ? '#e50909' : 'rgba(0,0,0,0.5)',
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
          backgroundColor: isSelected ? 'rgba(229,9,9,0.10)' : 'transparent',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', lineHeight: 17 }}>
          {option.name}
        </Text>
        {option.extraPrice > 0 ? (
          <Text style={{ color: '#e50909', fontSize: 11, fontWeight: '700', marginTop: 2 }}>
            +Bs. {option.extraPrice.toFixed(0)}
          </Text>
        ) : (
          <Text style={{ color: '#555', fontSize: 11, marginTop: 2 }}>Incluido</Text>
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
        backgroundColor: isSelected ? 'rgba(229,9,9,0.10)' : 'rgba(255,255,255,0.03)',
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
          borderColor: isSelected ? '#e50909' : '#555',
          backgroundColor: isSelected ? '#e50909' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isSelected && <Ionicons name="checkmark" size={11} color="#fff" />}
      </View>

      <Text style={{ flex: 1, color: '#e5e5e5', fontSize: 15, fontWeight: '500' }}>
        {option.name}
      </Text>

      {option.extraPrice > 0 && (
        <Text style={{ color: '#e50909', fontSize: 13, fontWeight: '700', flexShrink: 0 }}>
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
      <View style={{ flex: 1, backgroundColor: '#0f0f0f' }}>

        {/* ── Hero image ── */}
        <View style={{ height: 260, position: 'relative' }}>
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="restaurant-outline" size={60} color="#333" />
            </View>
          )}
          <LinearGradient
            colors={['transparent', '#0f0f0f']}
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
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Volver</Text>
          </TouchableOpacity>

          {/* Product info */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 16 }}>
            <Text style={{ color: '#e50909', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
              Personaliza tu pedido
            </Text>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800', lineHeight: 28 }} numberOfLines={2}>
              {product.name}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '600', marginTop: 2 }}>
              Desde Bs. {product.price.toFixed(0)}
            </Text>
          </View>
        </View>

        {/* ── Options (scrollable) ── */}
        <ScrollView
          style={{ flex: 1, backgroundColor: '#111' }}
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
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                      {group.name}
                    </Text>
                    <View
                      style={{
                        backgroundColor: group.isRequired ? 'rgba(229,9,9,0.15)' : '#222',
                        borderRadius: 20,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                      }}
                    >
                      <Text
                        style={{
                          color: group.isRequired ? '#e50909' : '#666',
                          fontSize: 9,
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: 0.8,
                        }}
                      >
                        {group.isRequired ? 'Requerido' : 'Opcional'}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: '#555', fontSize: 12 }}>
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
                      backgroundColor: 'rgba(229,9,9,0.1)',
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons name="warning" size={14} color="#e50909" />
                    <Text style={{ color: '#e50909', fontSize: 12, fontWeight: '600', flex: 1 }}>
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
            backgroundColor: '#111',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.08)',
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: insets.bottom + 12,
          }}
        >
          {extra > 0 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 10 }}>
              <Text style={{ color: '#666', fontSize: 13 }}>
                Base <Text style={{ color: '#ccc', fontWeight: '600' }}>Bs. {product.price.toFixed(0)}</Text>
              </Text>
              <Text style={{ color: '#444', fontSize: 13 }}>+</Text>
              <Text style={{ color: '#666', fontSize: 13 }}>
                Extras <Text style={{ color: '#e50909', fontWeight: '700' }}>Bs. {extra.toFixed(0)}</Text>
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#e50909',
              borderRadius: 16,
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <Ionicons name="cart" size={19} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
              Agregar al carrito — Bs. {total.toFixed(0)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
