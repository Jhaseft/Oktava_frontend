import { Text } from 'react-native';

type Props = Readonly<{ children: string }>;

export function FieldLabel({ children }: Props) {
  return (
    <Text className="text-brand-muted text-xs font-lemon-medium uppercase tracking-wider">{children}</Text>
  );
}
