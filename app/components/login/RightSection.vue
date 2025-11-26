<script setup lang="ts">
import { ref, computed } from "vue";
import { motion } from "motion-v";
import { Eye, EyeOff, Lock, Mail } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoginForm } from "~/core/presentation/auth/composables/useLoginForm";
import { useToastFeedback } from "~/core/presentation/shared/composables/useToastFeedback";
import { useRouter } from "vue-router";
import logoProbo from "~/assets/icons/logo-probo.svg";

/**
 * RightSection Component (B)
 * Formulario de login - completamente aislado del resto
 * Conecta con el backend usando useLoginForm existente
 */

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

const showPassword = ref(false);
const remember = ref(false);

const showAuthError = computed(
  () =>
    authStore.status === "error" &&
    authError.value &&
    !errors.value.password &&
    !errors.value.email
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
        error: (error: unknown) => ({
          title: "Error al iniciar sesión",
          description:
            error instanceof Error
              ? error.message
              : "Verifica tus credenciales e inténtalo nuevamente.",
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
  <motion.div
    :initial="{ opacity: 0, x: 50 }"
    :animate="{ opacity: 1, x: 0 }"
    :transition="{ duration: 0.8, ease: 'easeOut', delay: 0.2 }"
    class="h-full flex flex-col justify-center items-center p-6 lg:p-8 xl:p-12 lg:bg-transparent overflow-y-auto"
  >
    <div class="w-full max-w-md space-y-6">
      <!-- Logo PROBO -->
      <motion.div
        :initial="{ opacity: 0, y: -20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.3 }"
        class="flex items-center gap-3"
      >
        <img
          :src="logoProbo"
          alt="PROBO Logo"
          class="h-8 w-auto"
        />
      </motion.div>

      <!-- Mensaje inicial -->
      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.4 }"
        class="space-y-2.5"
      >
        <h2 class="text-[var(--gray-900)] t-h2 font-primary">Bienvenido</h2>
        <p class="text-[var(--gray-500)] t-t1 font-secondary leading-relaxed">
          Accede a tu cuenta para gestionar tus sociedades y operaciones
        </p>
      </motion.div>

      <!-- Section Hero - Formulario -->
      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.5 }"
      >

      <!-- Formulario -->
      <motion.form
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.5 }"
        @submit.prevent="onSubmit"
        class="space-y-4"
      >
        <!-- Email field -->
        <div class="space-y-2">
          <Label for="email" class="text-[var(--gray-700)] t-t1 font-secondary"> Correo Electrónico </Label>
          <div class="relative">
            <Mail
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]"
            />
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              :aria-invalid="Boolean(errors.email)"
              v-bind="emailField"
              class="pl-10 h-12 bg-white border-[var(--gray-200)] focus:border-[var(--primary-500)] focus:ring-[var(--primary-500)]"
              required
            />
          </div>
          <p v-if="errors.email" class="text-sm text-red-400">{{ errors.email }}</p>
        </div>

        <!-- Password field -->
        <div class="space-y-2">
          <Label for="password" class="text-[var(--gray-700)] t-t1 font-secondary"> Contraseña </Label>
          <div class="relative">
            <Lock
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--gray-400)]"
            />
            <Input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :aria-invalid="Boolean(errors.password)"
              v-bind="passwordField"
              class="pl-10 pr-10 h-12 bg-white border-[var(--gray-200)] focus:border-[var(--primary-500)] focus:ring-[var(--primary-500)]"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gray-400)] hover:text-[var(--gray-600)] transition-colors"
            >
              <EyeOff v-if="showPassword" class="w-5 h-5" />
              <Eye v-else class="w-5 h-5" />
            </button>
          </div>
          <p v-if="errors.password" class="text-sm text-red-400">{{ errors.password }}</p>
        </div>

        <!-- Remember me & Forgot password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <Checkbox id="remember" v-model:checked="remember" />
            <label for="remember" class="t-t1 text-[var(--gray-600)] font-secondary cursor-pointer">
              Recordarme
            </label>
          </div>
          <button
            type="button"
            class="t-t1 text-[var(--primary-600)] hover:text-[var(--primary-700)] font-secondary transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <!-- Error message -->
        <p v-if="showAuthError" class="text-sm text-red-400">{{ authError }}</p>

        <!-- Submit button -->
        <Button
          type="submit"
          :disabled="isSubmitting"
          class="w-full h-12 bg-[var(--primary-800)] hover:bg-[var(--primary-700)] text-white transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <template v-if="isSubmitting">
            <div class="flex items-center gap-2">
              <motion.div
                :animate="{ rotate: 360 }"
                :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Iniciando sesión...
            </div>
          </template>
          <template v-else> Iniciar Sesión </template>
        </Button>
      </motion.form>
      </motion.div>
    </div>
  </motion.div>
</template>

