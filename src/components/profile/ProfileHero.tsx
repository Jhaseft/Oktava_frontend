import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/src/theme/theme';

type Props = {
  fullName: string;
  initials: string;
  phone: string | null;
  email: string;
  completionPct: number;
  isComplete: boolean;
  onComplete: () => void;
  onPress: () => void;
};

export function ProfileHero({ fullName, initials, phone, email, completionPct, isComplete, onComplete, onPress }: Props) {
  return (
    <View className="mx-4 mt-4 rounded-3xl overflow-hidden">
      <LinearGradient colors={[colors.red, colors.redDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingHorizontal: 22, paddingTop: 30, paddingBottom: 30 }}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} className="flex-row items-center gap-4">
          <View className="w-24 h-24 rounded-full bg-white items-center justify-center">
            {initials ? (
              <Text className="text-brand-red font-lemon-bold text-3xl">{initials}</Text>
            ) : (
              <Ionicons name="person" size={44} color={colors.red} />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-white font-lemon-bold text-xl" numberOfLines={2}>{fullName}</Text>
            <Text className="font-lemon text-[14px] mt-1.5" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {phone ?? 'Agregar número'}
            </Text>
            <Text className="font-lemon text-[14px] mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }} numberOfLines={1}>
              {email}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.9)" />
        </TouchableOpacity>

        <View className="h-2 rounded-full mt-7 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
          <View className="h-full rounded-full bg-white" style={{ width: `${completionPct}%` }} />
        </View>

        {!isComplete && (
          <TouchableOpacity onPress={onComplete} activeOpacity={0.85} className="bg-white rounded-2xl items-center justify-center mt-5 py-4">
            <Text className="text-brand-red font-lemon-bold text-[15px] uppercase tracking-wide">Completar perfil</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
}
