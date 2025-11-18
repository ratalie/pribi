import type { AuthSessionDTO } from "../../application/dtos/auth-session.dto";
import type { LoginCredentialsDTO } from "../../application/dtos/login-credentials.dto";
import type { AuthRepository } from "../../domain/ports/auth.repository";

interface AuthApiResponse {
  success: boolean;
  message: string;
  code: number;
  data?: {
    studyName?: string;
    roleName?: string;
    token?: string;
  };
}

export class AuthHttpRepository implements AuthRepository {
  private resolveEndpoint(): string {
    const config = useRuntimeConfig();
    const authEndpoint = (config.public?.authEndpoint as string | undefined) || "/api/v2/auth";
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const appBase = (config.app?.baseURL as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    // Si el endpoint es absoluto, úsalo directamente.
    if (/^https?:\/\//i.test(authEndpoint)) {
      return authEndpoint;
    }

    // Determinar host base (prioriza apiBase -> appBase -> origin -> fallback).
    const candidateBases = [apiBase, appBase, origin, "http://localhost"];

    for (const base of candidateBases) {
      if (!base) continue;
      try {
        const baseUrl = new URL(base, origin || "http://localhost");
        return new URL(authEndpoint, baseUrl.origin).toString();
      } catch {
        continue;
      }
    }

    return authEndpoint;
  }

  async login(credentials: LoginCredentialsDTO): Promise<AuthSessionDTO> {
    const endpoint = this.resolveEndpoint();

    try {
      const response = await $fetch<AuthApiResponse>(endpoint, {
        method: "POST",
        body: credentials,
      });

      if (!response.success || !response.data?.token) {
        throw new Error(response.message || "Credenciales inválidas.");
      }

      return {
        token: response.data.token,
        studyName: response.data.studyName,
        roleName: response.data.roleName,
        issuedAt: new Date().toISOString(),
      };
    } catch (error: any) {
      const message =
        error?.data?.message ??
        error?.message ??
        "No pudimos completar la autenticación. Inténtalo nuevamente.";
      throw new Error(message);
    }
  }
}
