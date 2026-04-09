const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

// ─── Handler global de 401 ───────────────────────────
// AuthContext lo registra al montar. Cuando una llamada autenticada
// recibe 401, se dispara para limpiar sesión y redirigir al login.

let unauthorizedHandler: (() => void) | null = null;

export function registerUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

export function clearUnauthorizedHandler(): void {
  unauthorizedHandler = null;
}

// ─── Tipos ────────────────────────────────────────────

export type AuthUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type SignUpRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

// ─── Error tipado ─────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ─── Helper base de fetch ─────────────────────────────

async function post<T>(path: string, body: object): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Sin conexión. Verifica tu internet.', 0);
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // 401 en endpoints NO públicos → sesión inválida o expirada
    // /auth/sign-in puede devolver 401 legítimamente (credenciales incorrectas),
    // por eso lo excluimos del handler automático.
    if (res.status === 401 && path !== '/auth/sign-in') {
      unauthorizedHandler?.();
    }
    // NestJS envía { message, error, statusCode }
    const msg = Array.isArray(data.message)
      ? data.message[0]
      : (data.message ?? 'Error desconocido');
    throw new ApiError(msg, res.status);
  }

  return data as T;
}

// ─── Servicios de auth ────────────────────────────────

export const authApi = {
  /**
   * Login con email y contraseña.
   * POST /auth/sign-in
   */
  signIn: (email: string, password: string) =>
    post<AuthResponse>('/auth/sign-in', { email, password }),

  /**
   * Registro directo con perfil completo.
   * POST /auth/sign-up
   */
  signUp: (data: SignUpRequest) => post<AuthResponse>('/auth/sign-up', data),
};
