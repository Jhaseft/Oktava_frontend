import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import type { Category } from '@/src/types/product.types';
import { colors } from '@/src/theme/theme';

type Props = {
  categories: Category[];
};

export function CategoryGrid({ categories }: Props) {
  const openCategory = (cat: Category) =>
    router.push({
      pathname: '/(cliente)/menu',
      params: { category: cat.id, ts: Date.now().toString() },
    });

  return (
    <View className="px-4 mt-5 flex-row flex-wrap justify-between">
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => openCategory(cat)}
          activeOpacity={0.85}
          className="mb-5"
          style={{ width: '48%' }}
        >
          <View
            className="rounded-3xl overflow-hidden bg-brand-surface border border-brand-border"
            style={{ aspectRatio: 1 }}
          >
            {cat.imageUrl ? (
              <Image source={{ uri: cat.imageUrl }} resizeMode="cover" className="w-full h-full" />
            ) : (
              <View
                className="w-full h-full items-center justify-center px-3"
                style={{ backgroundColor: colors.black }}
              >
                <Text className="text-white font-lemon-bold text-lg text-center uppercase tracking-wide">
                  {cat.name}
                </Text>
              </View>
            )}
          </View>
          <Text
            className="text-brand-black font-lemon-bold text-[15px] text-center mt-2 tracking-wide"
            numberOfLines={1}
          >
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
