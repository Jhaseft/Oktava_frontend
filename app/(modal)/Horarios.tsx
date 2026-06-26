import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getStoreHours, BusinessHour } from '@/src/services/store.service';
import { useStoreStatus } from '@/src/context/StoreStatusContext';

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
    <View style={{ flex: 1, backgroundColor: '#111' }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: '#111' },
          headerTitleAlign: 'center',
          headerTintColor: 'white',
          headerTitle: 'Horarios',
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
        {/* Estado actual */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            borderWidth: 1.5,
            borderColor: isOpen ? '#22c55e' : '#ef4444',
            backgroundColor: isOpen ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
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
              backgroundColor: isOpen ? '#22c55e' : '#ef4444',
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: isOpen ? '#4ade80' : '#f87171', fontSize: 15, fontWeight: '800' }}>
              {isOpen ? 'Abierto ahora' : 'Cerrado'}
            </Text>
            {!isOpen && !!message && (
              <Text style={{ color: '#f87171', fontSize: 12, marginTop: 2 }}>{message}</Text>
            )}
          </View>
        </View>

        {/* Lista semanal */}
        <View style={{ backgroundColor: '#1a1a1a', borderRadius: 16, borderWidth: 1, borderColor: '#2a2a2a', overflow: 'hidden' }}>
          {loading ? (
            <View style={{ padding: 28, alignItems: 'center' }}>
              <ActivityIndicator color="#e50909" />
            </View>
          ) : error || !hours ? (
            <View style={{ padding: 24 }}>
              <Text style={{ color: '#888', textAlign: 'center' }}>
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
                    backgroundColor: isToday ? 'rgba(229,9,9,0.08)' : 'transparent',
                    borderTopWidth: idx === 0 ? 0 : 1,
                    borderTopColor: '#2a2a2a',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {isToday && <Ionicons name="ellipse" size={8} color="#e50909" />}
                    <Text
                      style={{
                        color: isToday ? '#ffffff' : '#e0e0e0',
                        fontSize: 15,
                        fontWeight: isToday ? '700' : '500',
                      }}
                    >
                      {DAY_LABELS[d]}
                      {isToday ? '  ·  Hoy' : ''}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: day?.isClosed ? '#f87171' : isToday ? '#ffffff' : '#bbbbbb',
                      fontSize: 14,
                      fontWeight: day?.isClosed ? '600' : '500',
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
