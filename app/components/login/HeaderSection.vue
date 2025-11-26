<script setup lang="ts">
import { motion } from "motion-v";
import logoProboImagen from "~/assets/icons/probo-logo-imagen.svg";
import logoProboTexto from "~/assets/icons/probo-logo-texto.svg";

/**
 * HeaderSection Component (X)
 * Sección superior con logo, título y descripción
 * Completamente aislado y editable independientemente
 */
</script>

<template>
  <div class="space-y-4">
    <!-- Logo PROBO Grande -->
    <motion.div
      :initial="{ opacity: 0, y: -20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, delay: 0.2 }"
      class="flex items-center gap-3 mb-4"
    >
      <img
        :src="logoProboImagen"
        alt="PROBO Logo"
        class="h-12 w-12 lg:h-16 lg:w-16"
      />
      <img
        :src="logoProboTexto"
        alt="PROBO"
        class="h-7 lg:h-9 w-auto"
      />
    </motion.div>

    <!-- Main Title -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.6, delay: 0.4 }"
      class="space-y-2.5"
    >
      <h1 class="text-white t-h2 lg:t-h1 font-primary max-w-2xl leading-tight">
        Aplicación para gestión jurídica, documentaria y
      </h1>
      <p class="text-white/95 t-h6 lg:t-h5 font-secondary max-w-2xl leading-snug font-medium">
        Almacena, gestiona y genera los documentos societarios de forma instantánea
      </p>
      <p class="text-[var(--primary-100)] t-t1 font-secondary max-w-2xl leading-snug text-sm lg:text-base">
        Mantén la información societaria actualizada, sube y analiza tus Documentos societarios, y crea los documentos generados por juntas.
      </p>
    </motion.div>
  </div>
</template>

