import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Address } from '@/types/address.types';

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
      className={`bg-zinc-900 rounded-2xl p-4 border ${
        selected ? 'border-red-500' : 'border-white/5'
      }`}
    >
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <Ionicons name="location-outline" size={16} color="#f87171" />
            <Text className="text-white font-semibold text-sm flex-1" numberOfLines={1}>
              {address.label}
            </Text>
          </View>
          <Text className="text-zinc-300 text-xs ml-6" numberOfLines={2}>
            {address.direction}
          </Text>
          <Text className="text-zinc-400 text-xs ml-6">{address.departament}</Text>
          {address.reference && (
            <Text className="text-zinc-500 text-xs ml-6">{address.reference}</Text>
          )}
          {address.contact && (
            <Text className="text-zinc-500 text-xs ml-6">{address.contact}</Text>
          )}
        </View>

        {(onEdit || onDelete) && (
          <View className="flex-row gap-2">
            {onEdit && (
              <TouchableOpacity onPress={onEdit} activeOpacity={0.7}>
                <Ionicons name="pencil-outline" size={18} color="#a1a1aa" />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity onPress={onDelete} activeOpacity={0.7}>
                <Ionicons name="trash-outline" size={18} color="#f87171" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
