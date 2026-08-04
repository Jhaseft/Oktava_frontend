import { Stack, router } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { useRequireAuth } from '@/src/hooks/useRequireAuth';
import { AccountInfoRow } from '@/src/components/profile/AccountInfoRow';
import { colors, fonts } from '@/src/theme/theme';

export default function MiCuentaScreen() {
  const { isLoading, isAuthenticated } = useRequireAuth();
  const { user } = useAuth();

  if (isLoading || !isAuthenticated || !user) {
    return <View className="flex-1 bg-white" />;
  }

  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: colors.bg },
          headerTitleAlign: 'center',
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.bold },
          headerTitle: 'Mi cuenta',
        }}
      />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40, gap: 16 }}>
        <View className="items-center gap-3" style={{ paddingVertical: 8 }}>
          <View className="w-24 h-24 rounded-full items-center justify-center" style={{ backgroundColor: colors.red }}>
            {initials ? (
              <Text className="text-white font-lemon-bold" style={{ fontSize: 32 }}>{initials}</Text>
            ) : (
              <Ionicons name="person" size={44} color="#ffffff" />
            )}
          </View>
          <Text className="font-lemon-bold text-brand-black text-center" style={{ fontSize: 20 }}>{fullName}</Text>
        </View>

        <View className="rounded-2xl bg-brand-surface border border-brand-border" style={{ paddingHorizontal: 16 }}>
          <AccountInfoRow icon="person-outline" label="Nombre" value={user.firstName || '—'} />
          <View className="h-px bg-brand-border" />
          <AccountInfoRow icon="people-outline" label="Apellido" value={user.lastName || '—'} />
          <View className="h-px bg-brand-border" />
          <AccountInfoRow icon="mail-outline" label="Correo electrónico" value={user.email} />
          <View className="h-px bg-brand-border" />
          <AccountInfoRow
            icon="call-outline"
            label="Teléfono"
            value={user.phone ?? 'Sin número'}
            badge={user.phone ? { text: user.phoneVerified ? 'Verificado' : 'Sin verificar', ok: user.phoneVerified } : undefined}
          />
        </View>

        {(!user.phone || !user.phoneVerified) && (
          <TouchableOpacity
            onPress={() => router.push(user.phone ? '/verify-phone?from=profile' : '/complete-profile')}
            activeOpacity={0.85}
            className="flex-row items-center justify-center gap-2 rounded-2xl bg-brand-red"
            style={{ paddingVertical: 16 }}
          >
            <Ionicons name="shield-checkmark-outline" size={18} color="#ffffff" />
            <Text className="text-white font-lemon-bold" style={{ fontSize: 14 }}>
              {user.phone ? 'Verificar número' : 'Agregar número'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
