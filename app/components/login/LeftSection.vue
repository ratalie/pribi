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
    class="flex flex-col h-full w-full p-8 lg:p-10 xl:p-12 relative z-10 justify-between"
  >
    <!-- X: Header Section - Título, descripción, features -->
    <div class="flex-shrink-0">
      <HeaderSection />
    </div>

    <!-- Y: Visibility Section - Slider/Carousel de la app -->
    <div class="flex-shrink-0 w-full max-w-2xl mx-auto">
      <VisibilitySection />
    </div>
  </motion.div>
</template>

