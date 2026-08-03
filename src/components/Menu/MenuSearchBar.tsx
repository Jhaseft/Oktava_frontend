import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  autoFocus?: boolean;
};

export function MenuSearchBar({ value, onChangeText, onClear, autoFocus }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f6f6f6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e6e6e6',
        marginHorizontal: 16,
        marginBottom: 14,
        paddingHorizontal: 14,
        height: 46,
        gap: 10,
      }}
    >
      <Ionicons name="search" size={18} color="#9a9a9a" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar platos o bebidas.."
        placeholderTextColor="#9a9a9a"
        className="font-lemon"
        style={{ flex: 1, color: '#141414', fontSize: 14 }}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        autoFocus={autoFocus}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={18} color="#9a9a9a" />
        </TouchableOpacity>
      )}
    </View>
  );
}
