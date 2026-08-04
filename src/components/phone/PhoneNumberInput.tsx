import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ChevronDown, Search } from 'lucide-react-native';
import { colors } from '@/src/theme/theme';

export type CountryCode = { flag: string; name: string; dial: string };

export const COUNTRY_CODES: CountryCode[] = [
  { flag: '🇧🇴', name: 'Bolivia',         dial: '+591' },
  { flag: '🇨🇴', name: 'Colombia',        dial: '+57'  },
  { flag: '🇲🇽', name: 'México',          dial: '+52'  },
  { flag: '🇦🇷', name: 'Argentina',       dial: '+54'  },
  { flag: '🇨🇱', name: 'Chile',           dial: '+56'  },
  { flag: '🇵🇪', name: 'Perú',            dial: '+51'  },
  { flag: '🇻🇪', name: 'Venezuela',       dial: '+58'  },
  { flag: '🇪🇨', name: 'Ecuador',         dial: '+593' },
  { flag: '🇵🇾', name: 'Paraguay',        dial: '+595' },
  { flag: '🇺🇾', name: 'Uruguay',         dial: '+598' },
  { flag: '🇵🇦', name: 'Panamá',          dial: '+507' },
  { flag: '🇨🇷', name: 'Costa Rica',      dial: '+506' },
  { flag: '🇬🇹', name: 'Guatemala',       dial: '+502' },
  { flag: '🇭🇳', name: 'Honduras',        dial: '+504' },
  { flag: '🇸🇻', name: 'El Salvador',     dial: '+503' },
  { flag: '🇳🇮', name: 'Nicaragua',       dial: '+505' },
  { flag: '🇩🇴', name: 'Rep. Dominicana', dial: '+1'   },
  { flag: '🇺🇸', name: 'Estados Unidos',  dial: '+1'   },
  { flag: '🇪🇸', name: 'España',          dial: '+34'  },
  { flag: '🇧🇷', name: 'Brasil',          dial: '+55'  },
];

/** País por defecto: Bolivia (OKtava opera en Bolivia). */
export const DEFAULT_COUNTRY = COUNTRY_CODES[0];

/** Construye el número en formato E.164 (ej. +59171234567). */
export function toE164(dial: CountryCode, nationalDigits: string): string {
  return `${dial.dial}${nationalDigits.replace(/\D/g, '')}`;
}

type Props = Readonly<{
  /** Solo los dígitos nacionales (sin el código de país). */
  number: string;
  onChangeNumber: (digits: string) => void;
  dial: CountryCode;
  onChangeDial: (c: CountryCode) => void;
  error?: boolean;
  editable?: boolean;
  placeholder?: string;
}>;

export function PhoneNumberInput({
  number,
  onChangeNumber,
  dial,
  onChangeDial,
  error = false,
  editable = true,
  placeholder = '71234567',
}: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  const filtered = useMemo(
    () =>
      COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
          c.dial.includes(pickerSearch),
      ),
    [pickerSearch],
  );

  const borderColor = error ? colors.red : colors.border;

  return (
    <>
      <View className="flex-row" style={{ gap: 8 }}>
        <Pressable
          onPress={() => {
            setShowPicker(true);
            setPickerSearch('');
          }}
          disabled={!editable}
          className="flex-row items-center justify-center bg-white rounded-xl"
          style={{ height: 52, gap: 6, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14 }}
        >
          <Text style={{ fontSize: 20 }}>{dial.flag}</Text>
          <Text className="font-lemon-medium text-brand-black" style={{ fontSize: 15 }}>{dial.dial}</Text>
          <ChevronDown size={16} color={colors.textMuted} />
        </Pressable>

        <TextInput
          value={number}
          onChangeText={(t) => onChangeNumber(t.replace(/\D/g, ''))}
          placeholder={placeholder}
          placeholderTextColor={colors.textFaint}
          keyboardType="phone-pad"
          editable={editable}
          maxLength={15}
          className="flex-1 bg-white rounded-xl text-brand-black font-lemon"
          style={{ height: 52, borderWidth: 1, borderColor, paddingHorizontal: 16, fontSize: 16, letterSpacing: 1 }}
        />
      </View>

      <Modal visible={showPicker} animationType="slide" transparent>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={() => setShowPicker(false)}>
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-white"
            style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16, height: '70%', paddingTop: 12 }}
          >
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong }} />
            </View>

            <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 16, marginHorizontal: 16, marginBottom: 12 }}>
              Código de país
            </Text>

            <View
              className="flex-row items-center rounded-xl bg-brand-surface"
              style={{ marginHorizontal: 16, marginBottom: 8, paddingHorizontal: 12, gap: 8, borderWidth: 1, borderColor: colors.border }}
            >
              <Search size={16} color={colors.textMuted} />
              <TextInput
                value={pickerSearch}
                onChangeText={setPickerSearch}
                placeholder="Buscar país o código..."
                placeholderTextColor={colors.textFaint}
                className="flex-1 text-brand-black font-lemon"
                style={{ fontSize: 14, paddingVertical: 10 }}
              />
            </View>

            <FlatList
              data={filtered}
              style={{ flex: 1 }}
              keyExtractor={(item) => `${item.name}-${item.dial}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const selected = item.name === dial.name;
                return (
                  <Pressable
                    onPress={() => {
                      onChangeDial(item);
                      setShowPicker(false);
                    }}
                    className="flex-row items-center gap-3 px-4 py-3.5"
                    style={{ backgroundColor: selected ? 'rgba(193,18,31,0.06)' : 'transparent' }}
                  >
                    <Text style={{ fontSize: 22 }}>{item.flag}</Text>
                    <Text className="flex-1 font-lemon text-brand-black" style={{ fontSize: 15 }}>{item.name}</Text>
                    <Text className="font-lemon-medium text-brand-muted" style={{ fontSize: 14 }}>{item.dial}</Text>
                    {selected && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red }} />}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
