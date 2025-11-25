<script setup lang="ts">
import { motion } from "motion-v";

/**
 * HeaderSection Component (X)
 * Sección superior con título, subtítulo y descripción
 * Completamente aislado y editable independientemente
 */

const features = [
  "Gestión avanzada de proyectos",
  "Colaboración en tiempo real",
  "Seguridad de nivel empresarial",
];
</script>

<template>
  <div class="space-y-8">
    <!-- Logo/Brand -->
    <motion.div
      :initial="{ opacity: 0, y: -20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, delay: 0.2 }"
      class="inline-flex items-center gap-3"
    >
      <div
        class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center"
      >
        <div
          class="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--primary-200)] to-white"
        />
      </div>
      <span class="text-white/90 text-lg">PROBO</span>
    </motion.div>

    <!-- Main Title -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, delay: 0.4 }"
      class="space-y-5"
    >
      <h1 class="text-white text-5xl xl:text-6xl leading-tight max-w-xl">
        Bienvenido de vuelta
      </h1>
      <p class="text-[var(--primary-100)] text-lg xl:text-xl max-w-lg leading-relaxed">
        Accede a tu cuenta y continúa gestionando tus proyectos de manera profesional
      </p>
    </motion.div>

    <!-- Features list -->
    <motion.div
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 0.6, delay: 0.6 }"
      class="space-y-4 pt-2"
    >
      <motion.div
        v-for="(feature, index) in features"
        :key="index"
        :initial="{ opacity: 0, x: -20 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.4, delay: 0.8 + index * 0.1 }"
        class="flex items-center gap-3"
      >
        <div
          class="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
        >
          <svg
            class="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="3"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <span class="text-white/85 text-base">{{ feature }}</span>
      </motion.div>
    </motion.div>
  </div>
</template>

