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

  const borderColor = error ? '#ef4444' : '#374151';

  return (
    <>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {/* Selector de código de país */}
        <Pressable
          onPress={() => {
            setShowPicker(true);
            setPickerSearch('');
          }}
          disabled={!editable}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#000',
            borderWidth: 1,
            borderColor: '#374151',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 12,
          }}
        >
          <Text style={{ fontSize: 18 }}>{dial.flag}</Text>
          <Text style={{ color: '#d1d5db', fontSize: 15, marginLeft: 2 }}>{dial.dial}</Text>
          <ChevronDown size={14} color="#6b7280" style={{ marginLeft: 2 }} />
        </Pressable>

        {/* Campo de número (solo dígitos nacionales) */}
        <TextInput
          value={number}
          onChangeText={(t) => onChangeNumber(t.replace(/\D/g, ''))}
          placeholder={placeholder}
          placeholderTextColor="#4b5563"
          keyboardType="phone-pad"
          editable={editable}
          maxLength={15}
          style={{
            flex: 1,
            backgroundColor: '#000',
            borderWidth: 1,
            borderColor,
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
            color: '#d1d5db',
            fontSize: 16,
          }}
        />
      </View>

      {/* Modal selector de país */}
      <Modal visible={showPicker} animationType="slide" transparent>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}
          onPress={() => setShowPicker(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: '#111',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: '70%',
              paddingTop: 12,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#374151' }} />
            </View>

            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', marginHorizontal: 16, marginBottom: 12 }}>
              Código de país
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 16,
                marginBottom: 8,
                backgroundColor: '#1f2937',
                borderRadius: 8,
                paddingHorizontal: 12,
                gap: 8,
              }}
            >
              <Search size={16} color="#6b7280" />
              <TextInput
                value={pickerSearch}
                onChangeText={setPickerSearch}
                placeholder="Buscar país o código..."
                placeholderTextColor="#4b5563"
                style={{ flex: 1, color: '#d1d5db', fontSize: 14, paddingVertical: 10 }}
              />
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => `${item.name}-${item.dial}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChangeDial(item);
                    setShowPicker(false);
                  }}
                  style={({ pressed }) => {
                    let bg = 'transparent';
                    if (pressed) bg = '#1f2937';
                    else if (item.name === dial.name) bg = '#1c1c1e';
                    return {
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      backgroundColor: bg,
                    };
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{item.flag}</Text>
                  <Text style={{ flex: 1, color: '#d1d5db', fontSize: 15 }}>{item.name}</Text>
                  <Text style={{ color: '#6b7280', fontSize: 14 }}>{item.dial}</Text>
                  {item.name === dial.name && (
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444' }} />
                  )}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
