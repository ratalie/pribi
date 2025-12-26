<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
    <div class="flex flex-col items-center gap-4 md:flex-row md:justify-between">
      <div
        class="text-sm flex items-center gap-2 text-center md:text-left"
        style="
          color: var(--text-muted);
          font-family: var(--font-secondary);
        "
      >
        <CheckCircle2 class="w-4 h-4 text-green-500 flex-shrink-0" />
        <p>
          {{ message }}
        </p>
      </div>
      <div class="flex flex-col items-center gap-2 w-full md:w-auto">
        <p
          v-if="errorMessage"
          class="text-sm text-red-500 font-medium"
          style="font-family: var(--font-secondary)"
        >
          {{ errorMessage }}
        </p>
        <Button
          variant="primary"
          size="lg"
          class="w-full md:w-auto shadow-lg hover:shadow-xl transition-all"
          :disabled="isSubmitting || disabled"
          @click="$emit('start-flow')"
          style="
            background: linear-gradient(135deg, var(--primary-800), var(--primary-600));
            font-family: var(--font-secondary);
            font-weight: 600;
          "
        >
          <LoaderCircle
            v-if="isSubmitting"
            class="mr-2 h-5 w-5 animate-spin"
          />
          <component
            v-else
            :is="icon"
            class="mr-2 h-5 w-5"
          />
          {{ buttonLabel }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, LoaderCircle } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

interface Props {
  isSubmitting: boolean;
  errorMessage: string | null;
  message?: string;
  buttonLabel?: string;
  icon?: any;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  message: "Puedes reanudar un borrador guardado desde el módulo de historial cuando esté disponible.",
  buttonLabel: "Comenzar formulario guiado",
  icon: undefined,
  disabled: false,
});

defineEmits<{
  "start-flow": [];
}>();
</script>




