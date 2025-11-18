<script setup lang="ts">
  interface Props {
    claseAcciones: string;
    accionesAsignadas: string;
    accionesSuscritas: string;
  }

  defineProps<Props>();
</script>

<template>
  <div
    class="relative min-h-44 min-w-72 px-8 py-6 flex flex-col gap-12 rounded-2xl overflow-hidden bg-linear-to-br from-violet-500 to-violet-700"
  >
    <!-- Círculo superior derecho -->
    <div
      class="absolute bottom-20 left-[150px] w-[321px] h-[226px] bg-primary-800 opacity-30 rounded-full z-0"
    />
    <!-- Círculo inferior izquierdo -->
    <div
      class="absolute top-[90px] right-[120px] w-[321px] h-[226px] bg-primary-800 opacity-30 rounded-full z-0"
    />

    <p class="text-neutral-white-100 font-bold">{{ claseAcciones }}</p>

    <div class="relative z-10 text-neutral-white-100">
      <p class="font-medium">Acciones</p>
      <p class="text-xl font-bold">{{ accionesAsignadas }}/{{ accionesSuscritas }}</p>
    </div>
  </div>
</template>
