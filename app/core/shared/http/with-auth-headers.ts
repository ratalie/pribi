import type { FetchOptions } from "ofetch";
import { useAuthStore } from "~/core/presentation/auth/stores/auth.store";

export function withAuthHeaders(): FetchOptions;
export function withAuthHeaders<T extends FetchOptions>(options: T): T;
export function withAuthHeaders<T extends FetchOptions>(options?: T) {
  const authStore = useAuthStore();
  const runtimeConfig = useRuntimeConfig();
  const fallbackToken = (runtimeConfig.public?.defaultAuthToken as string | undefined)?.trim();
  const token = (authStore.session?.token ?? fallbackToken)?.trim();

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
