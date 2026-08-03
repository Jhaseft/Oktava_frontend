import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme/theme';

type RowProps = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  danger?: boolean;
  right?: React.ReactNode;
};

function Row({ icon, label, onPress, danger, right }: RowProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} className="flex-row items-center gap-4 px-5 py-4">
      <Ionicons name={icon} size={22} color={danger ? colors.red : colors.black} />
      <Text className={`flex-1 font-lemon-bold text-[15px] tracking-wide ${danger ? 'text-brand-red' : 'text-brand-black'}`}>
        {label}
      </Text>
      {right ?? <Ionicons name="chevron-forward" size={16} color={colors.borderStrong} />}
    </TouchableOpacity>
  );
}

function Divider() {
  return <View className="h-px bg-brand-border mx-5" />;
}

type Props = {
  onAddresses: () => void;
  onOrders: () => void;
  onSettings: () => void;
  onSupport: () => void;
  onDelete: () => void;
  onLogout: () => void;
};

export function ProfileMenu({ onAddresses, onOrders, onSettings, onSupport, onDelete, onLogout }: Props) {
  return (
    <View className="mx-4 mt-4 rounded-3xl bg-white border border-brand-border overflow-hidden">
      <Row icon="location-outline" label="Mis direcciones" onPress={onAddresses} />
      <Divider />
      <Row icon="receipt-outline" label="Mis pedidos" onPress={onOrders} />
      <Divider />
      <Row icon="settings-outline" label="Ajustes" onPress={onSettings} />
      <Divider />
      <Row
        icon="headset-outline"
        label="Soporte"
        onPress={onSupport}
        right={
          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: '#25D366' }}>
            <Ionicons name="call" size={18} color="#ffffff" />
          </View>
        }
      />
      <Divider />
      <Row icon="trash-outline" label="Eliminar cuenta" onPress={onDelete} />
      <Divider />
      <Row icon="log-out-outline" label="Cerrar sesión" onPress={onLogout} danger />
    </View>
  );
}
