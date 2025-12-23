<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 lg:p-12">
    <div class="relative">
      <!-- Línea de Timeline Principal (Desktop) -->
      <div class="hidden lg:block absolute top-12 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 rounded-full" />
      
      <!-- Línea de Timeline Principal (Mobile) -->
      <div class="lg:hidden absolute left-12 top-0 bottom-0 w-1.5 bg-gradient-to-b from-primary-200 via-primary-300 to-primary-200 rounded-full" />

      <!-- Pasos del Timeline -->
      <div class="space-y-12 lg:space-y-0 lg:flex lg:justify-between">
        <PasoCard
          v-for="(step, index) in pasos"
          :key="step.number"
          :number="step.number"
          :title="step.title"
          :description="step.description"
          :icon="step.icon"
          :color="step.color"
          :color-classes="getColorClasses(step.color)"
          :index="index"
          :is-last="index === pasos.length - 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PasoCard from "../molecules/PasoCard.vue";
import type { Paso } from "../../types/agregar.types";

interface Props {
  pasos: Paso[];
  getColorClasses: (color: string) => { bg: string; text: string };
}

defineProps<Props>();
</script>

