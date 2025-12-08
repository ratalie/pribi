<template>
  <div
    class="bg-gradient-to-r rounded-xl p-8 text-white"
    style="background: linear-gradient(135deg, #10B981 0%, #059669 100%)"
  >
    <!-- Icono + Título -->
    <div class="flex items-center gap-4 mb-4">
      <div
        class="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm"
      >
        <Icon name="lucide:check-circle-2" class="w-10 h-10 text-white" />
      </div>
      <div>
        <h1
          class="text-3xl mb-1"
          style="font-family: var(--font-primary); font-weight: 700"
        >
          ¡Proceso Finalizado!
        </h1>
        <p
          class="text-lg opacity-90"
          style="font-family: var(--font-secondary)"
        >
          Has completado todos los pasos. Ahora puedes descargar tus documentos
        </p>
      </div>
    </div>

    <!-- Métricas -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
        <p class="text-sm opacity-80 mb-1">Documentos Generados</p>
        <p
          class="text-2xl"
          style="font-family: var(--font-primary); font-weight: 700"
        >
          {{ totalDocumentos }}
        </p>
      </div>
      <div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
        <p class="text-sm opacity-80 mb-1">Puntos Aprobados</p>
        <p
          class="text-2xl"
          style="font-family: var(--font-primary); font-weight: 700"
        >
          {{ puntosAprobados }}
        </p>
      </div>
      <div class="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
        <p class="text-sm opacity-80 mb-1">Estado</p>
        <p
          class="text-2xl"
          style="font-family: var(--font-primary); font-weight: 700"
        >
          Completo
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalDocumentos: number;
  puntosAprobados: number;
}>();
</script>

