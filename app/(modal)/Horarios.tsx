import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStoreHours, BusinessHour } from '@/src/services/store.service';
import { useStoreStatus } from '@/src/context/StoreStatusContext';
import { colors, fonts } from '@/src/theme/theme';

// Orden de visualización Lunes→Domingo (dayOfWeek sigue convención JS: 0=Domingo).
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DAY_LABELS: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

export default function HorariosScreen() {
  const { isOpen, message } = useStoreStatus();
  const [hours, setHours] = useState<BusinessHour[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const todayDow = new Date(Date.now() - 4 * 3600 * 1000).getUTCDay(); // hora Bolivia (UTC-4)

  useEffect(() => {
    getStoreHours()
      .then((data) => setHours(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: colors.bg },
          headerTitleAlign: 'center',
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.bold },
          headerTitle: 'Horarios',
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            borderWidth: 1.5,
            borderColor: isOpen ? '#22c55e' : colors.red,
            backgroundColor: isOpen ? 'rgba(34,197,94,0.10)' : 'rgba(193,18,31,0.06)',
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
        >
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: isOpen ? '#22c55e' : colors.red,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: fonts.bold, color: isOpen ? '#15803d' : colors.red, fontSize: 15 }}>
              {isOpen ? 'Abierto ahora' : 'Cerrado'}
            </Text>
            {!isOpen && !!message && (
              <Text style={{ fontFamily: fonts.regular, color: colors.redDark, fontSize: 12, marginTop: 2 }}>{message}</Text>
            )}
          </View>
        </View>

        <View style={{ backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
          {loading ? (
            <View style={{ padding: 28, alignItems: 'center' }}>
              <ActivityIndicator color={colors.red} />
            </View>
          ) : error || !hours ? (
            <View style={{ padding: 24 }}>
              <Text style={{ fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center' }}>
                No se pudieron cargar los horarios.
              </Text>
            </View>
          ) : (
            DAY_ORDER.map((d, idx) => {
              const day = hours.find((h) => h.dayOfWeek === d);
              const isToday = d === todayDow;
              return (
                <View
                  key={d}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    backgroundColor: isToday ? 'rgba(193,18,31,0.06)' : 'transparent',
                    borderTopWidth: idx === 0 ? 0 : 1,
                    borderTopColor: colors.border,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {isToday && <Ionicons name="ellipse" size={8} color={colors.red} />}
                    <Text
                      style={{
                        fontFamily: isToday ? fonts.bold : fonts.medium,
                        color: isToday ? colors.text : '#3a3a3a',
                        fontSize: 15,
                      }}
                    >
                      {DAY_LABELS[d]}
                      {isToday ? '  ·  Hoy' : ''}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: day?.isClosed ? fonts.bold : fonts.medium,
                      color: day?.isClosed ? colors.red : isToday ? colors.text : colors.textMuted,
                      fontSize: 14,
                    }}
                  >
                    {day?.isClosed ? 'Cerrado' : `${day?.openTime} – ${day?.closeTime}`}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}
