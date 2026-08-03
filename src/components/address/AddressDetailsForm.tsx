import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/theme';

const CARD_SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 1,
} as const;

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  multiline?: boolean;
  minHeight?: number;
};

function FieldCard({ label, value, onChangeText, placeholder, multiline, minHeight }: FieldProps) {
  return (
    <View className="bg-white rounded-2xl px-5 py-3.5 mb-4" style={CARD_SHADOW}>
      <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 16 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        multiline={multiline}
        className="font-lemon"
        style={{
          color: colors.text,
          fontSize: 15,
          paddingVertical: 6,
          marginTop: 2,
          minHeight,
          textAlignVertical: multiline ? 'top' : 'auto',
        }}
      />
    </View>
  );
}

type Props = {
  isEditing: boolean;
  label: string;
  setLabel: (t: string) => void;
  direction: string;
  setDirection: (t: string) => void;
  reference: string;
  setReference: (t: string) => void;
  saving: boolean;
  onBack: () => void;
  onSave: () => void;
};

export function AddressDetailsForm({
  isEditing,
  label,
  setLabel,
  direction,
  setDirection,
  reference,
  setReference,
  saving,
  onBack,
  onSave,
}: Props) {
  const insets = useSafeAreaInsets();
  const canSave = !!label.trim() && !!direction.trim();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 6 }}>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity onPress={onBack} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={26} color={colors.black} />
          </TouchableOpacity>
          <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 22 }}>
            {isEditing ? 'Editar dirección' : 'Nueva dirección'}
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}
      >
        <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 26, marginBottom: 4 }}>
          Confirma tu dirección
        </Text>
        <Text className="font-lemon text-brand-muted" style={{ fontSize: 15, marginBottom: 20 }}>
          Ingresa la dirección o punto de referencia
        </Text>

        <FieldCard label="Alias" value={label} onChangeText={setLabel} placeholder="Ingresar alias" />
        <FieldCard label="Dirección" value={direction} onChangeText={setDirection} placeholder="Ingresar dirección" multiline />
        <FieldCard label="Instrucciones" value={reference} onChangeText={setReference} placeholder="Ej.: En frente de la plaza" multiline minHeight={44} />
      </ScrollView>

      <View className="px-5 bg-white border-t border-brand-border" style={{ paddingBottom: insets.bottom + 12, paddingTop: 12 }}>
        <TouchableOpacity
          onPress={onSave}
          activeOpacity={0.85}
          disabled={!canSave || saving}
          className="rounded-2xl items-center justify-center py-4"
          style={{ backgroundColor: canSave ? colors.red : '#e5e5e5' }}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text
              className="font-lemon-bold uppercase tracking-wide"
              style={{ fontSize: 15, color: canSave ? '#ffffff' : colors.textFaint }}
            >
              {isEditing ? 'Guardar cambios' : 'Guardar dirección'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
