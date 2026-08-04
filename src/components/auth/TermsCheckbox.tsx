import { Pressable, View, Text } from 'react-native';
import { colors } from '@/src/theme/theme';

type Props = Readonly<{ checked: boolean; onToggle: () => void; disabled?: boolean }>;

export function TermsCheckbox({ checked, onToggle, disabled }: Props) {
  return (
    <Pressable onPress={onToggle} disabled={disabled} className="flex-row items-start gap-3">
      <View
        className="items-center justify-center rounded"
        style={{
          marginTop: 2,
          width: 18,
          height: 18,
          borderWidth: 1,
          borderColor: checked ? colors.red : colors.borderStrong,
          backgroundColor: checked ? colors.red : 'transparent',
        }}
      >
        {checked && <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: '#ffffff' }} />}
      </View>
      <Text className="flex-1 text-[13px] font-lemon text-brand-muted">
        Acepto los términos y condiciones y las políticas de privacidad.
      </Text>
    </Pressable>
  );
}
