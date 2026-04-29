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
        style={{
          color: '#ffffff',
          fontSize: 15,
          fontWeight: '800',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        }}
      >
        {title}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: '#2a2a2a' }} />
    </View>
  );
}
