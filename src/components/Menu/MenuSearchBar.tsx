import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
};

export function MenuSearchBar({ value, onChangeText, onClear }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 14,
        paddingHorizontal: 14,
        height: 46,
        gap: 10,
      }}
    >
      <Ionicons name="search" size={18} color="#666666" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar platos o bebidas.."
        placeholderTextColor="#555555"
        style={{ flex: 1, color: '#ffffff', fontSize: 14 }}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={18} color="#555555" />
        </TouchableOpacity>
      )}
    </View>
  );
}
