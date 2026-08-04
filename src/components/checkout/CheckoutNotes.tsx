import { View, TextInput } from 'react-native';
import { colors } from '@/src/theme/theme';
import { FieldLabel } from './FieldLabel';

type Props = Readonly<{ value: string; onChange: (text: string) => void }>;

export function CheckoutNotes({ value, onChange }: Props) {
  return (
    <View className="gap-2">
      <FieldLabel>Notas (opcional)</FieldLabel>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Ej: Sin cebolla, extra salsa..."
        placeholderTextColor={colors.textFaint}
        multiline
        numberOfLines={3}
        className="bg-white text-brand-black rounded-xl px-4 py-3 border border-brand-border text-sm font-lemon"
        style={{ textAlignVertical: 'top', minHeight: 80 }}
      />
    </View>
  );
}
