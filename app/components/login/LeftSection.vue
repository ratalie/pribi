<script setup lang="ts">
import { motion } from "motion-v";
import HeaderSection from "./HeaderSection.vue";
import VisibilitySection from "./VisibilitySection.vue";

/**
 * LeftSection Component (A)
 * Sección izquierda que contiene HeaderSection (X) y VisibilitySection (Y)
 * Estructura vertical modular y separada
 */
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, x: -50 }"
    :animate="{ opacity: 1, x: 0 }"
    :transition="{ duration: 0.8, ease: 'easeOut' }"
    class="flex flex-col h-full min-h-screen p-12 lg:p-16 xl:p-20 relative z-10"
  >
    <!-- X: Header Section - Título, descripción, features -->
    <div class="flex-shrink-0 mb-auto pt-8 lg:pt-12">
      <HeaderSection />
    </div>

    <!-- Spacer para distribución vertical -->
    <div class="flex-grow min-h-[60px]" />

    <!-- Y: Visibility Section - Slider/Carousel de la app -->
    <div class="flex-shrink-0 w-full max-w-2xl mx-auto pb-8 lg:pb-12">
      <VisibilitySection />
    </div>
  </motion.div>
</template>

