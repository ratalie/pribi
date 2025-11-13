import type { FetchOptions } from "ofetch";
import { useAuthStore } from "~/core/presentation/auth/stores/auth.store";

export function withAuthHeaders(): FetchOptions<unknown>;
export function withAuthHeaders<T extends FetchOptions<unknown>>(options: T): T;
export function withAuthHeaders<T extends FetchOptions<unknown>>(options?: T) {
  const authStore = useAuthStore();
  const token = authStore.session?.token;

  const normalized = ((options ?? {}) as FetchOptions<unknown>) ?? {};
  const headers = new Headers((normalized.headers as HeadersInit | undefined) ?? undefined);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return {
    ...(normalized as Record<string, unknown>),
    headers: Object.fromEntries(headers.entries()),
  } as T extends FetchOptions<unknown> ? T : FetchOptions<unknown>;
}

