import { computed } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

import type { LoginCredentialsDTO } from "~/core/hexag/auth/application/dtos/login-credentials.dto";
import { useAuthStore } from "../stores/auth.store";

const loginSchema = toTypedSchema(
  z.object({
    email: z
      .string({
        required_error: "El correo es obligatorio.",
      })
      .email("Ingresa un correo válido."),
    password: z
      .string({
        required_error: "La contraseña es obligatoria.",
      })
      .min(1, "La contraseña es obligatoria."),
  })
);

export function useLoginForm() {
  const authStore = useAuthStore();

  const form = useForm<LoginCredentialsDTO>({
    validationSchema: loginSchema,
    initialValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = computed(() => authStore.status === "loading");
  const authError = computed(() => authStore.errorMessage);

  return {
    form,
    isSubmitting,
    authError,
    authStore,
    handleSubmit: form.handleSubmit,
  };
}

