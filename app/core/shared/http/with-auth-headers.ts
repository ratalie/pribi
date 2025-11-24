import type { FetchOptions } from "ofetch";
import { useAuthStore } from "~/core/presentation/auth/stores/auth.store";

/**
 * Verificar si un token JWT está expirado
 * Retorna true si está expirado o no se puede decodificar
 * 
 * NOTA: Esta validación es opcional y NO bloquea requests.
 * El backend rechazará el request si el token es inválido.
 */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false; // No es JWT válido, pero no bloqueamos
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp * 1000; // Convertir a ms
    return Date.now() >= exp;
  } catch {
    // Si no se puede decodificar, no es JWT válido
    // Pero NO bloqueamos, solo retornamos false
    return false;
  }
}

export function withAuthHeaders(): FetchOptions;
export function withAuthHeaders<T extends FetchOptions>(options: T): T;
export function withAuthHeaders<T extends FetchOptions>(options?: T) {
  const authStore = useAuthStore();
  const runtimeConfig = useRuntimeConfig();
  const fallbackToken = (runtimeConfig.public?.defaultAuthToken as string | undefined)?.trim();
  const token = (authStore.session?.token ?? fallbackToken)?.trim();

  // Validar token expirado (solo warning en dev, NO bloquea)
  if (token && import.meta.dev) {
    if (isTokenExpired(token)) {
      console.warn(
        "[withAuthHeaders] Token expirado detectado. Considera refrescar el token."
      );
      // NO bloqueamos aquí, solo avisamos
      // El backend rechazará el request si el token es inválido
    }
  }

  const normalized = ((options ?? {}) as FetchOptions) ?? {};
  const headers = new Headers((normalized.headers as HeadersInit | undefined) ?? undefined);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    if (import.meta.dev) {
      const preview = token.length > 12 ? `${token.slice(0, 6)}…${token.slice(-4)}` : token;
      console.debug("[withAuthHeaders] Token aplicado", {
        hasSessionToken: Boolean(authStore.session?.token),
        usingFallbackToken: !authStore.session?.token && Boolean(fallbackToken),
        preview,
      });
    }
  } else {
    console.warn(
      "[withAuthHeaders] Sin token disponible. Asegúrate de iniciar sesión o definir NUXT_PUBLIC_DEFAULT_AUTH_TOKEN."
    );
  }

  return {
    ...(normalized as Record<string, unknown>),
    headers: Object.fromEntries(headers.entries()),
  } as T extends FetchOptions ? T : FetchOptions;
}
