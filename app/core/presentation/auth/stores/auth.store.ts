import { computed, ref } from "vue";
import { defineStore } from "pinia";

import type { LoginCredentialsDTO } from "~/core/hexag/auth/application/dtos/login-credentials.dto";
import type { AuthSessionDTO } from "~/core/hexag/auth/application/dtos/auth-session.dto";
import { LoginUseCase } from "~/core/hexag/auth/application/use-cases/login.use-case";
import { AuthHttpRepository } from "~/core/hexag/auth/infrastructure/repositories/auth.http.repository";

type Status = "idle" | "loading" | "error";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const repository = new AuthHttpRepository();
    const loginUseCase = new LoginUseCase(repository);

    const session = ref<AuthSessionDTO | null>(null);
    const status = ref<Status>("idle");
    const errorMessage = ref<string | null>(null);

    const isAuthenticated = computed(() => Boolean(session.value?.token));

    async function login(credentials: LoginCredentialsDTO) {
      status.value = "loading";
      errorMessage.value = null;

      try {
        const result = await loginUseCase.execute(credentials);
        session.value = result;
        status.value = "idle";
        return result;
      } catch (error: any) {
        status.value = "error";
        errorMessage.value =
          error?.message ?? "No pudimos iniciar sesión. Revisa tus credenciales.";
        throw error;
      }
    }

    function logout() {
      session.value = null;
      status.value = "idle";
      errorMessage.value = null;
    }

    return {
      session,
      status,
      errorMessage,
      isAuthenticated,
      login,
      logout,
    };
  },
  {
    persist: true,
  }
);

