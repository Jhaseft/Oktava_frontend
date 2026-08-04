import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { OptionGroup, OptionItem, Product } from '@/src/types/product.types';
import type { SelectedOption, SelectedOptionGroup } from '@/src/types/cart.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const OPTION_PLACEHOLDER = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop';

export type Selections = Map<string, Set<string>>;

export function isSingleSelect(group: OptionGroup): boolean {
  return group.maxSelections <= 1;
}

// Mínimo real de opciones a elegir: un grupo requerido siempre exige al menos 1.
export function minRequired(group: OptionGroup): number {
  return group.isRequired ? Math.max(1, group.minSelections) : group.minSelections;
}

// Texto guía que se muestra a la derecha del nombre del grupo.
export function selectionHint(group: OptionGroup): string {
  const { minSelections: min, maxSelections: max } = group;
  if (max <= 1) return group.isRequired ? 'Elige 1' : 'Elige 1 o ninguno';
  if (min > 0 && min === max) return `Elige ${max}`;
  if (min > 0) return `Elige ${min}–${max}`;
  return `Elige hasta ${max}`;
}

function groupHasImages(group: OptionGroup): boolean {
  return group.options.some((o) => !!o.imageUrl);
}

export function calcExtra(groups: OptionGroup[], selections: Selections): number {
  let extra = 0;
  for (const group of groups) {
    const chosen = selections.get(group.id);
    if (!chosen) continue;
    for (const opt of group.options) {
      if (chosen.has(opt.id)) extra += opt.extraPrice;
    }
  }
  return extra;
}

export function validateSelections(groups: OptionGroup[], selections: Selections): Set<string> {
  const errors = new Set<string>();
  for (const group of groups) {
    if ((selections.get(group.id)?.size ?? 0) < minRequired(group)) errors.add(group.id);
  }
  return errors;
}

export function buildSelectedGroups(groups: OptionGroup[], selections: Selections): SelectedOptionGroup[] {
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

export function toggleSelection(prev: Selections, group: OptionGroup, option: OptionItem): Selections {
  const next = new Map(prev);
  const current = new Set(next.get(group.id) ?? []);

  if (group.maxSelections > 1) {
    // Multi-selección: se agrega/quita libremente, respetando el tope máximo.
    if (current.has(option.id)) current.delete(option.id);
    else if (current.size < group.maxSelections) current.add(option.id);
    next.set(group.id, current);
  } else if (current.has(option.id) && !group.isRequired) {
    // Single-select opcional: tocar la ya elegida la deselecciona (puede quedar vacío).
    next.set(group.id, new Set());
  } else {
    // Single-select: reemplaza la selección (requerido no se puede vaciar).
    next.set(group.id, new Set([option.id]));
  }
  return next;
}

function OptionCard({ option, isSelected, box, onToggle }: Readonly<{ option: OptionItem; isSelected: boolean; box: boolean; onToggle: () => void }>) {
  const cardWidth = (SCREEN_WIDTH - 40 - 10) / 2;
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      className="rounded-2xl overflow-hidden"
      style={{ width: cardWidth, borderWidth: 2, borderColor: isSelected ? '#c1121f' : '#e6e6e6', backgroundColor: isSelected ? 'rgba(193,18,31,0.06)' : '#f6f6f6' }}
    >
      <View style={{ aspectRatio: 4 / 3, width: '100%' }}>
        <Image source={{ uri: option.imageUrl ?? OPTION_PLACEHOLDER }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        <View
          className="absolute items-center justify-center"
          style={{ top: 8, right: 8, width: 26, height: 26, borderRadius: box ? 6 : 13, borderWidth: 2, borderColor: isSelected ? '#c1121f' : 'rgba(255,255,255,0.6)', backgroundColor: isSelected ? '#c1121f' : 'rgba(0,0,0,0.4)' }}
        >
          {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
      </View>
      <View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
        <Text className="font-lemon-medium text-brand-black" style={{ fontSize: 13, lineHeight: 17 }}>{option.name}</Text>
        {option.extraPrice > 0 ? (
          <Text className="font-lemon-bold text-brand-red" style={{ fontSize: 11, marginTop: 2 }}>+Bs. {option.extraPrice.toFixed(0)}</Text>
        ) : (
          <Text className="font-lemon text-brand-muted" style={{ fontSize: 11, marginTop: 2 }}>Incluido</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

function OptionRow({ option, isSelected, box, onToggle }: Readonly<{ option: OptionItem; isSelected: boolean; box: boolean; onToggle: () => void }>) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.7}
      className="flex-row items-center rounded-2xl"
      style={{ gap: 14, borderWidth: 1, borderColor: isSelected ? '#c1121f' : '#e6e6e6', backgroundColor: isSelected ? 'rgba(193,18,31,0.08)' : '#f6f6f6', paddingHorizontal: 16, paddingVertical: 14 }}
    >
      <View
        className="items-center justify-center"
        style={{ width: 20, height: 20, borderRadius: box ? 5 : 10, borderWidth: 2, borderColor: isSelected ? '#c1121f' : '#c4c4c4', backgroundColor: isSelected ? '#c1121f' : 'transparent', flexShrink: 0 }}
      >
        {isSelected && <Ionicons name="checkmark" size={11} color="#fff" />}
      </View>
      <Text className="flex-1 font-lemon-medium text-brand-black" style={{ fontSize: 15 }}>{option.name}</Text>
      {option.extraPrice > 0 && <Text className="font-lemon-bold text-brand-red" style={{ fontSize: 13, flexShrink: 0 }}>+Bs. {option.extraPrice.toFixed(0)}</Text>}
    </TouchableOpacity>
  );
}

type Props = Readonly<{
  product: Product;
  selections: Selections;
  errors: Set<string>;
  onToggle: (group: OptionGroup, option: OptionItem) => void;
}>;

export function OptionGroups({ product, selections, errors, onToggle }: Props) {
  const groups = product.optionGroups ?? [];

  return (
    <>
      {groups.map((group) => {
        const selectedIds = selections.get(group.id) ?? new Set<string>();
        const hasError = errors.has(group.id);
        const useCards = groupHasImages(group);
        const min = minRequired(group);
        // Cuadrado (deseleccionable) para múltiples u opcionales; círculo (radio) solo para single requerido.
        const box = group.maxSelections > 1 || !group.isRequired;

        return (
          <View key={group.id} style={{ marginBottom: 24 }}>
            <View className="flex-row items-center justify-between" style={{ marginBottom: 12 }}>
              <View className="flex-row items-center" style={{ gap: 8, flex: 1 }}>
                <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 16 }}>{group.name}</Text>
                <View
                  className="rounded-full"
                  style={{ backgroundColor: group.isRequired ? 'rgba(193,18,31,0.10)' : '#efefef', paddingHorizontal: 8, paddingVertical: 3 }}
                >
                  <Text className="font-lemon-bold uppercase" style={{ color: group.isRequired ? '#c1121f' : '#9a9a9a', fontSize: 9, letterSpacing: 0.8 }}>
                    {group.isRequired ? 'Requerido' : 'Opcional'}
                  </Text>
                </View>
              </View>
              <Text className="font-lemon text-brand-muted" style={{ fontSize: 12 }}>{selectionHint(group)}</Text>
            </View>

            {hasError && (
              <View className="flex-row items-center rounded-xl" style={{ gap: 8, backgroundColor: 'rgba(193,18,31,0.08)', paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 }}>
                <Ionicons name="warning" size={14} color="#c1121f" />
                <Text className="flex-1 font-lemon-medium text-brand-red" style={{ fontSize: 12 }}>{`Selecciona al menos ${min} ${min > 1 ? 'opciones' : 'opción'} para continuar.`}</Text>
              </View>
            )}

            {useCards ? (
              <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                {group.options.map((option) => (
                  <OptionCard key={option.id} option={option} isSelected={selectedIds.has(option.id)} box={box} onToggle={() => onToggle(group, option)} />
                ))}
              </View>
            ) : (
              <View style={{ gap: 8 }}>
                {group.options.map((option) => (
                  <OptionRow key={option.id} option={option} isSelected={selectedIds.has(option.id)} box={box} onToggle={() => onToggle(group, option)} />
                ))}
              </View>
            )}
          </View>
        );
      })}
    </>
  );
}
