import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { api } from './api';
import { isVersionLower } from '@/src/lib/version';

/**
 * IDs de tienda de OKtava.
 * - Android: package definido en app.json (`android.package`).
 * - iOS: reemplazar IOS_APP_ID con el ID numérico de App Store cuando exista.
 */
const ANDROID_PACKAGE = 'com.oktava.app';
const IOS_APP_ID = '0000000000'; // TODO: poner el App Store ID real

export const STORE_URLS = {
  // market:// abre la app de Play Store directamente; el https es fallback web.
  androidApp: `market://details?id=${ANDROID_PACKAGE}`,
  androidWeb: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
  iosApp: `itms-apps://apps.apple.com/app/id${IOS_APP_ID}`,
  iosWeb: `https://apps.apple.com/app/id${IOS_APP_ID}`,
};

/**
 * Fallback local: versión mínima que esta build conoce como soportada.
 * Si el backend responde, su valor manda. Esto solo evita quedar sin guard
 * cuando no hay red en el primer arranque.
 */
const LOCAL_MIN_SUPPORTED_VERSION = '7.0.0';

export type VersionConfig = {
  /** Versión mínima por debajo de la cual la actualización es obligatoria. */
  minSupportedVersion: string;
  /** Mensaje opcional a mostrar en la pantalla de actualización. */
  message?: string;
};

export type VersionStatus = {
  currentVersion: string;
  config: VersionConfig;
  /** Bloqueante: la versión instalada es menor que la mínima soportada. */
  mustUpdate: boolean;
};

/** Versión instalada de la app (definida en app.json -> expo.version). */
export function getCurrentVersion(): string {
  return Constants.expoConfig?.version ?? '0.0.0';
}

/**
 * Obtiene la config de versión desde el backend.
 * Endpoint esperado: GET /app/version -> { minSupportedVersion, message? }
 * Si falla (sin red / endpoint inexistente), usa el fallback local.
 */
async function fetchVersionConfig(): Promise<VersionConfig> {
  try {
    const data = await api.get<Partial<VersionConfig>>('/app/version');
    return {
      minSupportedVersion: data.minSupportedVersion ?? LOCAL_MIN_SUPPORTED_VERSION,
      message: data.message,
    };
  } catch {
    // Fail-open: nunca bloqueamos al usuario por un error de red del guard.
    return { minSupportedVersion: LOCAL_MIN_SUPPORTED_VERSION };
  }
}

/** Resuelve el estado de versión comparando la instalada con la config remota. */
export async function checkVersion(): Promise<VersionStatus> {
  const currentVersion = getCurrentVersion();
  const config = await fetchVersionConfig();

  return {
    currentVersion,
    config,
    mustUpdate: isVersionLower(currentVersion, config.minSupportedVersion),
  };
}

/** URL de tienda según la plataforma (app nativa con fallback web). */
export function getStoreUrl(): { primary: string; fallback: string } {
  if (Platform.OS === 'ios') {
    return { primary: STORE_URLS.iosApp, fallback: STORE_URLS.iosWeb };
  }
  return { primary: STORE_URLS.androidApp, fallback: STORE_URLS.androidWeb };
}
