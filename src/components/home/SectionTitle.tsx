import { View, Text } from 'react-native';

type Props = { title: string };

export function SectionTitle({ title }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 14,
        gap: 10,
      }}
    >
      <Text
        className="font-lemon-bold"
        style={{
          color: '#141414',
          fontSize: 15,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: '#e6e6e6' }} />
    </View>
  );
}
