import { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';

type Props = {
  /** Cuando es true, las 3 rayitas se transforman en una X. */
  active: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
};

const ANIM_DURATION = 260;

/**
 * Ícono de menú que anima entre hamburguesa (☰) y una X según `active`.
 * La barra central se desvanece mientras las otras dos rotan hasta cruzarse.
 */
export function AnimatedHamburger({
  active,
  onPress,
  size = 26,
  color = '#ffffff',
}: Props) {
  const progress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: active ? 1 : 0,
      duration: ANIM_DURATION,
      useNativeDriver: true,
    }).start();
  }, [active, progress]);

  const barWidth = size;
  const barHeight = Math.max(2, Math.round(size * 0.1));
  const offset = Math.round(size * 0.26); // separación de las barras respecto al centro
  const containerHeight = offset * 2 + barHeight;

  const bar = {
    position: 'absolute' as const,
    width: barWidth,
    height: barHeight,
    borderRadius: barHeight,
    backgroundColor: color,
  };

  const topStyle = {
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-offset, 0],
        }),
      },
      {
        rotate: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const bottomStyle = {
    transform: [
      {
        translateY: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [offset, 0],
        }),
      },
      {
        rotate: progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-45deg'],
        }),
      },
    ],
  };

  const middleStyle = {
    opacity: progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] }),
    transform: [
      {
        scaleX: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
      },
    ],
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{
        width: barWidth,
        height: containerHeight,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View style={[bar, topStyle]} />
      <Animated.View style={[bar, middleStyle]} />
      <Animated.View style={[bar, bottomStyle]} />
    </TouchableOpacity>
  );
}
