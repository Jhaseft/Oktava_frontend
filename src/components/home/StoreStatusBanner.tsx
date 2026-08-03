import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useStoreStatus } from '@/src/context/StoreStatusContext';
import { colors } from '@/src/theme/theme';

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function StoreStatusBanner() {
  const { isOpen, message, status } = useStoreStatus();
  const today = status?.today;

  const todayName = today ? DAYS[today.dayOfWeek] : 'Hoy';
  const hoursText =
    today && !today.isClosed ? `${today.openTime} – ${today.closeTime}` : 'Cerrado hoy';

  const subtitle = isOpen ? `${todayName} · ${hoursText}` : message || `${todayName} · ${hoursText}`;

  return (
    <View className="mx-4 mt-3 rounded-2xl overflow-hidden" style={{ backgroundColor: colors.black }}>
      <View className="flex-row items-center gap-2 px-4 pt-3 pb-1">
        <Ionicons name="time-outline" size={15} color="#b5b5b5" />
        <Text className="text-[#b5b5b5] font-lemon text-[11px] uppercase tracking-widest">
          Horario de hoy
        </Text>
      </View>

      <View className="flex-row items-center justify-between px-4 pb-3">
        <View className="flex-row items-center gap-2.5 flex-1 pr-3">
          <View
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: isOpen ? '#22c55e' : colors.red }}
          />
          <View className="flex-1">
            <Text className="text-white font-lemon-bold text-lg tracking-wide">
              {isOpen ? 'ABIERTO' : 'CERRADO'}
            </Text>
            <Text className="text-[#9a9a9a] font-lemon text-[12px]" numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(modal)/Horarios')}
          activeOpacity={0.85}
          className="flex-row items-center gap-1.5 rounded-full bg-brand-red px-4 py-2.5"
        >
          <Ionicons name="calendar-outline" size={14} color="#ffffff" />
          <Text className="text-white font-lemon-bold text-[11px] uppercase tracking-wide">
            Horarios
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
