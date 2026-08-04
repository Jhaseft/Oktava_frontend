import { useRef } from 'react';
import { View, TextInput } from 'react-native';
import { colors } from '@/src/theme/theme';

type Props = Readonly<{
  value: string[];
  onChange: (digits: string[]) => void;
  editable?: boolean;
}>;

export function OtpInput({ value, onChange, editable = true }: Props) {
  const refs = useRef<(TextInput | null)[]>([]);
  const length = value.length;

  const setDigit = (raw: string, index: number) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  };

  const onKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !value[index] && index > 0) refs.current[index - 1]?.focus();
  };

  return (
    <View className="flex-row gap-2 justify-between">
      {value.map((d, i) => (
        <TextInput
          key={i}
          ref={(r) => {
            refs.current[i] = r;
          }}
          value={d}
          onChangeText={(v) => setDigit(v, i)}
          onKeyPress={({ nativeEvent }) => onKeyPress(nativeEvent.key, i)}
          keyboardType="number-pad"
          maxLength={1}
          editable={editable}
          placeholderTextColor={colors.textFaint}
          className={`flex-1 aspect-square rounded-xl border text-center text-brand-black text-xl font-lemon-bold bg-white ${
            d ? 'border-brand-red' : 'border-brand-border'
          }`}
        />
      ))}
    </View>
  );
}
