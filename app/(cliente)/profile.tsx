import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile } from '@/src/hooks/useProfile';
import { AuthRequired } from '@/src/components/ui/AuthRequired';
import { ProfileHero } from '@/src/components/profile/ProfileHero';
import { ProfileMenu } from '@/src/components/profile/ProfileMenu';
import { colors } from '@/src/theme/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const p = useProfile();

  if (!p.isLoggedIn) {
    return <AuthRequired message="Inicia sesión para ver tu perfil" showRegister />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View className="flex-row items-center gap-3 px-4 pb-3 bg-white" style={{ paddingTop: insets.top + 8 }}>
        <TouchableOpacity onPress={p.goBack} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={26} color={colors.black} />
        </TouchableOpacity>
        <Text className="font-lemon-bold uppercase text-brand-black" style={{ fontSize: 22 }}>Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <ProfileHero
          fullName={p.fullName}
          initials={p.initials}
          phone={p.phone}
          email={p.email}
          completionPct={p.completionPct}
          isComplete={p.isComplete}
          onComplete={() => p.go('/complete-profile')}
        />
        <ProfileMenu
          onAddresses={() => p.go('/(cliente)/addresses')}
          onOrders={() => p.go('/(cliente)/orders')}
          onSettings={() => p.go('/(cliente)/settings')}
          onSupport={p.callSupport}
          onDelete={() => p.go('/(modal)/EliminarCuenta')}
          onLogout={p.logout}
        />
      </ScrollView>
    </View>
  );
}
