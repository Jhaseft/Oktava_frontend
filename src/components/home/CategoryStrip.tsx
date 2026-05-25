import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import type { Category } from '@/src/types/product.types';

type CategoryTheme = {
  match: RegExp;
  emoji: string;
  from: string;
  to: string;
  border: string;
};

const THEMES: CategoryTheme[] = [
  { match: /combo/i,                   emoji: '🍗', from: '#7f1d1d', to: '#3b0a0a', border: '#ef4444' },
  { match: /pollo|pech|brot|crispy/i,  emoji: '🔥', from: '#7c2d12', to: '#3b1007', border: '#f97316' },
  { match: /guarnicion|acomp|papa/i,   emoji: '🍟', from: '#713f12', to: '#3b1f06', border: '#eab308' },
  { match: /bebida|drink|jugo|gaseosa/i, emoji: '🥤', from: '#0c4a6e', to: '#042338', border: '#38bdf8' },
  { match: /postre|dulce|torta|helado/i, emoji: '🍩', from: '#831843', to: '#3d0921', border: '#f472b6' },
  { match: /.*/,                        emoji: '🍴', from: '#27272a', to: '#111113', border: '#52525b' },
];

function getTheme(name: string): CategoryTheme {
  return THEMES.find((t) => t.match.test(name)) ?? THEMES[THEMES.length - 1];
}

type Props = {
  categories: Category[];
};

export function CategoryStrip({ categories }: Props) {
  return (
    <View>
      {/* Header row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginBottom: 14,
        }}
      >
        <View>
          <Text style={{ color: '#e50909', fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 2 }}>
            Explora
          </Text>
          <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '900', letterSpacing: -0.3 }}>
            ¿Qué te antojas?
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(cliente)/menu')} activeOpacity={0.7}>
          <Text style={{ color: '#e50909', fontSize: 13, fontWeight: '600' }}>Ver todo →</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      >
        {categories.map((cat) => {
          const theme = getTheme(cat.name);
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.8}
              onPress={() => router.push('/(cliente)/menu')}
            >
              <LinearGradient
                colors={[theme.from, theme.to]}
                style={{
                  width: 106,
                  height: 106,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: `${theme.border}44`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: 10,
                }}
              >
                <Text style={{ fontSize: 36 }}>{theme.emoji}</Text>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    textAlign: 'center',
                  }}
                  numberOfLines={2}
                >
                  {cat.name}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
