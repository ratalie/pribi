<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { LoaderCircle } from "lucide-vue-next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLoginForm } from "~/core/presentation/auth/composables/useLoginForm";
import { useToastFeedback } from "~/core/presentation/shared/composables/useToastFeedback";

definePageMeta({
  layout: false,
});

useHead({
  title: "Inicia sesión - PROBO",
});

const router = useRouter();
const config = useRuntimeConfig();
const defaultRedirect =
  (config.public?.defaultRedirectAfterLogin as string | undefined) ||
  "/registros/sociedades/dashboard";

const { form, handleSubmit, isSubmitting, authError, authStore } = useLoginForm();
const { withAsyncToast } = useToastFeedback();

const { errors, defineField } = form;
const [email, emailField] = defineField("email");
const [password, passwordField] = defineField("password");

const showAuthError = computed(
  () => authStore.status === "error" && authError.value && !errors.value.password && !errors.value.email
);

const onSubmit = handleSubmit(async (values) => {
  try {
    await withAsyncToast(
      () => authStore.login(values),
      {
        loading: {
          title: "Iniciando sesión...",
          description: "Validando credenciales.",
        },
        success: {
          title: "¡Bienvenido!",
          description: "Sesión iniciada correctamente.",
        },
        error: (error) => ({
          title: "Error al iniciar sesión",
          description: error?.message ?? "Verifica tus credenciales e inténtalo nuevamente.",
        }),
      }
    );

    await router.push(defaultRedirect);
  } catch {
    // El toast de error ya se mostró desde useToastFeedback.
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
    <div class="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <Card class="border-slate-800/60 bg-slate-900/80 backdrop-blur">
        <CardHeader class="space-y-3 text-center">
          <CardTitle class="text-2xl font-semibold">Accede al panel PROBO</CardTitle>
          <CardDescription class="text-slate-300">
            Ingresa con tu correo corporativo para continuar.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form class="space-y-6" @submit.prevent="onSubmit">
            <div class="space-y-2">
              <Label for="email">Correo</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="usuario101@gmail.com"
                :aria-invalid="Boolean(errors.email)"
                v-bind="emailField"
                class="bg-slate-950/60 text-white"
              />
              <p v-if="errors.email" class="text-sm text-red-400">
                {{ errors.email }}
              </p>
            </div>

            <div class="space-y-2">
              <Label for="password">Contraseña</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••"
                :aria-invalid="Boolean(errors.password)"
                v-bind="passwordField"
                class="bg-slate-950/60 text-white"
              />
              <p v-if="errors.password" class="text-sm text-red-400">
                {{ errors.password }}
              </p>
            </div>

            <p v-if="showAuthError" class="text-sm text-red-400">
              {{ authError }}
            </p>

            <Button type="submit" class="w-full" :disabled="isSubmitting">
              <LoaderCircle v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

