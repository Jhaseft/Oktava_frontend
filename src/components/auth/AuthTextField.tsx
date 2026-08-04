import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/src/theme/theme';

type Props = TextInputProps &
  Readonly<{
    label: string;
    error?: string | null;
    secure?: boolean;
    required?: boolean;
  }>;

export function AuthTextField({ label, error, secure, required, ...input }: Props) {
  const [visible, setVisible] = useState(false);
  const hasError = !!error;

  return (
    <View className="gap-2">
      <Text className="text-brand-black text-[13px] font-lemon-medium">
        {label}
        {required && <Text className="text-brand-red"> *</Text>}
      </Text>
      <View className="relative">
        <TextInput
          placeholderTextColor={colors.textFaint}
          secureTextEntry={secure && !visible}
          className={`bg-white rounded-xl px-4 py-3.5 text-brand-black text-[15px] font-lemon border ${
            hasError ? 'border-brand-red' : 'border-brand-border'
          } ${secure ? 'pr-12' : ''}`}
          {...input}
        />
        {secure && (
          <TouchableOpacity
            onPress={() => setVisible((v) => !v)}
            className="absolute right-3.5 top-0 bottom-0 justify-center"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {visible ? <EyeOff size={18} color={colors.textMuted} /> : <Eye size={18} color={colors.textMuted} />}
          </TouchableOpacity>
        )}
      </View>
      {hasError && <Text className="text-brand-red text-[12px] font-lemon">{error}</Text>}
    </View>
  );
}
