import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const listenerRefs = useRef<{ remove: () => void }[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const Notifications = await import('expo-notifications');
        const Device = await import('expo-device');
        const { default: Constants } = await import('expo-constants');

        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
          }),
        });

        const received = Notifications.addNotificationReceivedListener(() => {});
        const responded = Notifications.addNotificationResponseReceivedListener((response) => {
          const data = response.notification.request.content.data;
          console.log('Notificación tocada:', data);
        });
        listenerRefs.current = [received, responded];

        if (!Device.isDevice) {
          console.warn('Las notificaciones push requieren un dispositivo físico');
          return;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') return;

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
          });
        }

        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
        if (!cancelled) setExpoPushToken(token ?? null);
      } catch (e) {
        console.warn('Notificaciones push no disponibles en este entorno:', e);
      }
    })();

    return () => {
      cancelled = true;
      listenerRefs.current.forEach((l) => l.remove());
    };
  }, []);

  return { expoPushToken };
}
