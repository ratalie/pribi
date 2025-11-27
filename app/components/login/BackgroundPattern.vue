<script setup lang="ts">
import { onMounted, ref } from "vue";
import { motion } from "motion-v";

/**
 * BackgroundPattern Component
 * Patrón de fondo animado moderno y profesional
 * Puede ser editado independientemente sin afectar otros componentes
 */

interface Particle {
  initialX: number;
  initialY: number;
  targetX: number;
  targetY: number;
  delay: number;
  duration: number;
}

const particles = ref<Particle[]>([]);

onMounted(() => {
  if (typeof window === "undefined") return;

  const width = window.innerWidth * 0.5;
  const height = window.innerHeight;

  // Generar partículas con posiciones iniciales y target calculadas
  particles.value = Array.from({ length: 20 }, () => {
    const initialX = Math.random() * width;
    const initialY = Math.random() * height;
    const targetX = Math.random() * width;
    const targetY = Math.random() * height;

    return {
      initialX,
      initialY,
      targetX,
      targetY,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 10,
    };
  });
});
</script>

<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <!-- Gradient base -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-[var(--primary-800)] via-[var(--primary-700)] to-[var(--primary-900)]"
    />

    <!-- Animated gradient overlay -->
    <motion.div
      class="absolute inset-0 opacity-30"
      :animate="{
        background: [
          'radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 50%, var(--primary-400) 0%, transparent 50%)',
          'radial-gradient(circle at 50% 80%, var(--primary-600) 0%, transparent 50%)',
          'radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)',
        ],
      }"
      :transition="{
        duration: 10,
        repeat: Infinity,
        ease: 'linear',
      }"
    />

    <!-- Geometric shapes -->
    <motion.div
      class="absolute top-20 left-10 w-64 h-64 rounded-full bg-[var(--primary-400)] opacity-10 blur-3xl"
      :animate="{
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -20, 0],
      }"
      :transition="{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }"
    />

    <motion.div
      class="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[var(--primary-300)] opacity-10 blur-3xl"
      :animate="{
        scale: [1, 1.3, 1],
        x: [0, -40, 0],
        y: [0, 30, 0],
      }"
      :transition="{
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1,
      }"
    />

    <!-- Grid pattern overlay -->
    <div
      class="absolute inset-0 opacity-[0.02]"
      :style="{
        backgroundImage: `
          linear-gradient(var(--primary-25) 1px, transparent 1px),
          linear-gradient(90deg, var(--primary-25) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }"
    />

    <!-- Floating particles -->
    <motion.div
      v-for="(particle, i) in particles"
      :key="i"
      class="absolute w-1 h-1 bg-white rounded-full"
      :style="{
        left: `${particle.initialX}px`,
        top: `${particle.initialY}px`,
      }"
      :initial="{
        x: 0,
        y: 0,
        opacity: 0.1,
      }"
      :animate="{
        x: particle.targetX - particle.initialX,
        y: particle.targetY - particle.initialY,
        opacity: [0.1, 0.5, 0.1],
      }"
      :transition="{
        duration: particle.duration,
        repeat: Infinity,
        ease: 'linear',
        delay: particle.delay,
      }"
    />
  </div>
</template>
