import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import type { AuthUser } from '@/src/services/authApi';
import { registerUnauthorizedHandler, clearUnauthorizedHandler } from '@/src/services/authApi';
import { api } from '@/src/services/api';

const TOKEN_KEY = '@oktava:token';
const USER_KEY = '@oktava:user';

// ─── Tipos ────────────────────────────────────────────

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (token: string, user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (partial: Partial<AuthUser>) => Promise<void>;
  refreshMe: () => Promise<void>;
};

// ─── Contexto ─────────────────────────────────────────

const AuthContext = createContext<AuthState | null>(null);

// ─── Provider ─────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Registra el handler global de 401: si el backend responde sesión inválida,
  // limpia AsyncStorage y redirige al login automáticamente.
  useEffect(() => {
    registerUnauthorizedHandler(async () => {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
      setToken(null);
      setUser(null);
      router.replace('/login');
    });
    return () => clearUnauthorizedHandler();
  }, []);

  // Rehidrata la sesión al abrir la app
  useEffect(() => {
    async function hydrate() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser) as AuthUser);
        }
      } catch {
        // Si falla la lectura, la sesión queda vacía sin bloquear la app
      } finally {
        setIsLoading(false);
      }
    }
    hydrate();
  }, []);

  async function signIn(newToken: string, newUser: AuthUser) {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, newToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser)),
    ]);
    setToken(newToken);
    setUser(newUser);
  }

  async function signOut() {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
    setToken(null);
    setUser(null);
  }

  async function updateUser(partial: Partial<AuthUser>) {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      AsyncStorage.setItem(USER_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }

  async function refreshMe() {
    try {
      const fresh = await api.get<AuthUser>('/auth/me');
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(fresh));
      setUser(fresh);
    } catch {
      // silencioso — si falla, el user local sigue siendo válido
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, signIn, signOut, updateUser, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
