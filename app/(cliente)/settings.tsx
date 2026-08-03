import { View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotificationSetting } from '@/src/hooks/useNotificationSetting';
import { colors } from '@/src/theme/theme';

function Divider() {
  return <View className="h-px bg-brand-border mx-5" />;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { enabled, toggle } = useNotificationSetting();

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/(cliente)/profile'));
  const go = (path: string) => router.push(path as Parameters<typeof router.push>[0]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <View className="flex-row items-center gap-3 px-4 pb-3 bg-white" style={{ paddingTop: insets.top + 8 }}>
        <TouchableOpacity onPress={goBack} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={26} color={colors.black} />
        </TouchableOpacity>
        <Text className="font-lemon-bold uppercase text-brand-black" style={{ fontSize: 22 }}>Ajustes</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Text className="font-lemon-bold text-brand-muted uppercase px-6 mt-6 mb-2" style={{ fontSize: 11, letterSpacing: 0.8 }}>
          Notificaciones
        </Text>
        <View className="mx-4 rounded-2xl bg-white border border-brand-border overflow-hidden">
          <View className="flex-row items-center gap-4 px-5 py-4">
            <Ionicons name="notifications-outline" size={22} color={colors.black} />
            <View className="flex-1">
              <Text className="font-lemon-bold text-brand-black text-[15px]">Notificaciones push</Text>
              <Text className="font-lemon text-brand-muted text-[12px]">
                {enabled ? 'Activadas' : 'Desactivadas · toca para activar'}
              </Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={toggle}
              trackColor={{ false: colors.borderStrong, true: colors.red }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <Text className="font-lemon-bold text-brand-muted uppercase px-6 mt-8 mb-2" style={{ fontSize: 11, letterSpacing: 0.8 }}>
          Legal
        </Text>
        <View className="mx-4 rounded-2xl bg-white border border-brand-border overflow-hidden">
          <TouchableOpacity onPress={() => go('/(modal)/Privacidad')} activeOpacity={0.6} className="flex-row items-center gap-4 px-5 py-4">
            <Ionicons name="shield-checkmark-outline" size={22} color={colors.black} />
            <Text className="flex-1 font-lemon-bold text-brand-black text-[15px]">Políticas de privacidad</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.borderStrong} />
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity onPress={() => go('/(modal)/Terminos')} activeOpacity={0.6} className="flex-row items-center gap-4 px-5 py-4">
            <Ionicons name="document-text-outline" size={22} color={colors.black} />
            <Text className="flex-1 font-lemon-bold text-brand-black text-[15px]">Términos y condiciones</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.borderStrong} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
