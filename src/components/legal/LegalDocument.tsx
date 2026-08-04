import { Stack } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { colors, fonts } from '@/src/theme/theme';

export type LegalSection = { title: string; body: string };

type Props = Readonly<{
  headerTitle: string;
  title: string;
  updated: string;
  sections: LegalSection[];
  disclaimer?: string;
}>;

const DEFAULT_DISCLAIMER =
  'Este documento es un texto base con fines informativos. Debe ser revisado antes de su publicación definitiva.';

export function LegalDocument({ headerTitle, title, updated, sections, disclaimer = DEFAULT_DISCLAIMER }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: colors.bg },
          headerTitleAlign: 'center',
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.bold },
          headerTitle,
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text className="font-lemon-bold text-brand-red uppercase" style={{ fontSize: 11, letterSpacing: 1, marginBottom: 6 }}>
          Legal
        </Text>
        <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 22, marginBottom: 4 }}>
          {title}
        </Text>
        <Text className="font-lemon text-brand-muted" style={{ fontSize: 12, marginBottom: 24 }}>
          Última actualización: {updated}
        </Text>

        {disclaimer ? (
          <View
            className="flex-row gap-2.5 rounded-xl"
            style={{ backgroundColor: 'rgba(193,18,31,0.06)', borderWidth: 1, borderColor: 'rgba(193,18,31,0.30)', padding: 14, marginBottom: 24 }}
          >
            <Text style={{ fontSize: 16 }}>⚠️</Text>
            <Text className="flex-1 font-lemon text-brand-muted" style={{ fontSize: 12, lineHeight: 18 }}>
              {disclaimer}
            </Text>
          </View>
        ) : null}

        {sections.map((s) => (
          <View key={s.title} className="rounded-2xl bg-brand-surface border border-brand-border" style={{ padding: 16, marginBottom: 12 }}>
            <Text className="font-lemon-bold text-brand-black" style={{ fontSize: 13, marginBottom: 8 }}>
              {s.title}
            </Text>
            <Text className="font-lemon text-brand-muted" style={{ fontSize: 13, lineHeight: 20 }}>
              {s.body}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
