<template>
  <div
    class="relative flex flex-col items-center lg:flex-1 group"
    :style="{
      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
    }"
  >
    <!-- Punto del Timeline -->
    <div class="relative z-10">
      <!-- Círculo Exterior Animado -->
      <div
        class="absolute inset-0 rounded-full animate-ping opacity-20"
        :class="colorClasses.bg"
        style="animation-duration: 2s; width: 80px; height: 80px; top: -8px; left: -8px;"
      />
      
      <!-- Círculo Principal -->
      <div
        class="relative w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-125 group-hover:shadow-2xl cursor-pointer"
        :class="colorClasses.bg"
        style="background: linear-gradient(135deg, var(--primary-600), var(--primary-400))"
      >
        <component
          :is="icon"
          class="w-8 h-8 text-white transition-transform duration-300 group-hover:rotate-12"
        />
        
        <!-- Número del Paso -->
        <div
          class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-white"
          :class="colorClasses.bg"
        >
          {{ number }}
        </div>
      </div>
    </div>

    <!-- Información del Paso (debajo del círculo) -->
    <div class="mt-6 text-center max-w-[140px]">
      <div class="flex items-center justify-center gap-2 mb-2">
        <h3
          class="text-sm font-bold"
          style="
            color: var(--text-primary);
            font-family: var(--font-primary);
          "
        >
          {{ title }}
        </h3>
        <div
          v-if="hasSubSteps"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700"
          style="font-family: var(--font-secondary)"
        >
          <Zap class="w-3 h-3" />
        </div>
      </div>
      <p
        class="text-xs leading-relaxed"
        style="
          color: var(--text-muted);
          font-family: var(--font-secondary);
        "
      >
        {{ description }}
      </p>
    </div>

    <!-- Línea Conectora (Desktop - Horizontal, solo si no es el último) -->
    <div
      v-if="!isLast"
      class="hidden lg:block absolute top-12 left-1/2 w-full h-1.5 bg-gradient-to-r from-primary-300 to-primary-200 rounded-full"
      style="width: calc(100% - 4rem); transform: translateX(2rem);"
    />
  </div>
</template>

<script setup lang="ts">
import { Zap } from "lucide-vue-next";

interface Props {
  number: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  colorClasses: { bg: string; text: string };
  index: number;
  isLast: boolean;
  hasSubSteps?: boolean;
}

withDefaults(defineProps<Props>(), {
  hasSubSteps: false,
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>




