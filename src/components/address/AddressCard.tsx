import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';
import type { Address } from '@/src/types/address.types';

type AddressCardProps = {
  address: Address;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  selected?: boolean;
};

export function AddressCard({ address, onEdit, onDelete, onSelect, selected }: AddressCardProps) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={onSelect ? 0.7 : 1}
      className={`rounded-2xl p-4 border ${selected ? 'border-brand-red bg-brand-red/5' : 'border-brand-border bg-white'}`}
    >
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Ionicons name="location" size={16} color={colors.red} />
            <Text className="text-brand-black font-lemon-bold text-sm flex-1" numberOfLines={1}>
              {address.label}
            </Text>
          </View>
          <Text className="text-brand-black text-xs ml-6 font-lemon" numberOfLines={2}>
            {address.direction}
          </Text>
          <Text className="text-brand-muted text-xs ml-6 font-lemon">{address.departament}</Text>
          {address.reference && (
            <Text className="text-brand-muted text-xs ml-6 font-lemon">{address.reference}</Text>
          )}
          {address.contact && (
            <Text className="text-brand-muted text-xs ml-6 font-lemon">{address.contact}</Text>
          )}
        </View>

        {(onEdit || onDelete) && (
          <View className="flex-row gap-3">
            {onEdit && (
              <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
                <Ionicons name="pencil-outline" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} activeOpacity={0.7}>
                <Ionicons name="trash-outline" size={18} color={colors.red} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {selected && (
        <View className="flex-row items-center gap-1 mt-2 ml-6">
          <Ionicons name="checkmark-circle" size={14} color={colors.red} />
          <Text className="text-brand-red text-xs font-lemon-medium">Seleccionada</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
