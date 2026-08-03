import { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  useWindowDimensions,
  type ImageSourcePropType,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { colors } from '@/src/theme/theme';

type Props = {
  images: ImageSourcePropType[];
  autoPlayMs?: number;
};

const H_MARGIN = 16;

export function PromoCarousel({ images, autoPlayMs = 4500 }: Props) {
  const { width } = useWindowDimensions();
  const bannerHeight = (width - H_MARGIN * 2) * 0.62;
  const scrollRef = useRef<ScrollView>(null);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      const next = (indexRef.current + 1) % images.length;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      indexRef.current = next;
      setIndex(next);
    }, autoPlayMs);
    return () => clearInterval(id);
  }, [images.length, width, autoPlayMs]);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    indexRef.current = i;
    setIndex(i);
  };

  if (images.length === 0) return null;

  return (
    <View className="mt-3">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
      >
        {images.map((src, i) => (
          <View key={i} style={{ width }} className="px-4">
            <Image
              source={src}
              resizeMode="cover"
              style={{ width: '100%', height: bannerHeight, borderRadius: 20 }}
            />
          </View>
        ))}
      </ScrollView>

      {images.length > 1 && (
        <View className="flex-row justify-center items-center gap-1.5 mt-2.5">
          {images.map((_, i) => (
            <View
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: i === index ? 18 : 6,
                backgroundColor: i === index ? colors.red : colors.borderStrong,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
