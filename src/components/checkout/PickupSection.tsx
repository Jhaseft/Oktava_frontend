import { View } from 'react-native';
import { FieldLabel } from './FieldLabel';
import { StorePickupMap } from './StorePickupMap';

export function PickupSection() {
  return (
    <View className="gap-2">
      <FieldLabel>Ubicación del local</FieldLabel>
      <StorePickupMap />
    </View>
  );
}
