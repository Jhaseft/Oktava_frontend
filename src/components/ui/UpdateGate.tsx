import { View, Text, Linking, Image } from 'react-native';
import { Button } from './Button';
import { useVersionGuard } from '@/src/hooks/useVersionGuard';
import { getStoreUrl } from '@/src/services/appVersion.service';

async function openStore() {
  const { primary, fallback } = getStoreUrl();
  try {
    const supported = await Linking.canOpenURL(primary);
    await Linking.openURL(supported ? primary : fallback);
  } catch {
    await Linking.openURL(fallback).catch(() => {});
  }
}

/** Pantalla bloqueante de actualización obligatoria. */
function ForcedUpdateScreen({ message }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-black px-8 gap-5">
      <Image
        source={require('../../../assets/logo.png')}
        style={{ width: 96, height: 96 }}
        resizeMode="contain"
      />
      <Text className="text-white text-2xl font-bold text-center">
        Actualización requerida
      </Text>
      <Text className="text-zinc-400 text-base text-center">
        {message ??
          'Tu versión de OKtava ya no es compatible. Actualiza desde la tienda para seguir usando la app.'}
      </Text>
      <Button label="Actualizar ahora" onPress={openStore} className="w-full mt-2" />
    </View>
  );
}

/**
 * Envuelve la app. Si la versión instalada es menor que la mínima soportada,
 * bloquea con la pantalla de actualización obligatoria (botón a la tienda).
 * En cualquier otro caso renderiza la app normal.
 */
export function UpdateGate({ children }: { children: React.ReactNode }) {
  const { mustUpdate, status } = useVersionGuard();

  if (mustUpdate) {
    return <ForcedUpdateScreen message={status?.config.message} />;
  }

  return <>{children}</>;
}
