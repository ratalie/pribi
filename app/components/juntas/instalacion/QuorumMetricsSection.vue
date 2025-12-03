<template>
  <div class="flex flex-col gap-6 p-6 bg-white rounded-lg border border-gray-200">
    <!-- Título con porcentaje -->
    <div class="flex justify-between items-center">
      <span class="t-h5 font-primary font-bold text-gray-800">
        Acciones presentes
      </span>
      <span class="t-h5 font-primary font-bold text-gray-700">
        {{ quorum.porcentajePresente.toFixed(2) }}%
      </span>
    </div>
    
    <!-- Barra de progreso -->
    <div class="w-full bg-gray-200 rounded-full h-3">
      <div
        class="h-3 rounded-full transition-all duration-300"
        :class="cumpleSimple ? 'bg-green-500' : 'bg-red-500'"
        :style="{ width: `${Math.min(quorum.porcentajePresente, 100)}%` }"
      />
    </div>
    
    <!-- Mensaje de estado -->
    <div v-if="quorum.accionesPresentes === 0" class="text-sm text-gray-500">
      Aún no se ha registrado ninguna asistencia
    </div>
    <div v-else class="flex flex-col gap-2">
      <!-- Quórum Simple -->
      <div class="flex items-center gap-2">
        <span :class="cumpleSimple ? 'text-green-600' : 'text-red-600'" class="text-xl">
          {{ cumpleSimple ? '✅' : '❌' }}
        </span>
        <span class="t-b1 font-secondary" :class="cumpleSimple ? 'text-green-700' : 'text-red-700'">
          Quórum simple ({{ quorum.quorumSimple }}%): 
          {{ cumpleSimple ? 'Alcanzado' : 'No alcanzado' }}
        </span>
      </div>
      
      <!-- Quórum Calificado -->
      <div class="flex items-center gap-2">
        <span :class="cumpleCalificado ? 'text-green-600' : 'text-red-600'" class="text-xl">
          {{ cumpleCalificado ? '✅' : '❌' }}
        </span>
        <span class="t-b1 font-secondary" :class="cumpleCalificado ? 'text-green-700' : 'text-red-700'">
          Quórum calificado ({{ quorum.quorumCalificado }}%): 
          {{ cumpleCalificado ? 'Alcanzado' : 'No alcanzado' }}
        </span>
      </div>
    </div>
    
    <!-- Cards de métricas -->
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1 p-4 border border-gray-200 rounded-lg">
        <span class="t-b2 font-secondary text-gray-600">Total de acciones</span>
        <span class="t-h4 font-primary font-bold text-gray-900">
          {{ quorum.totalAcciones.toLocaleString() }}
        </span>
      </div>
      
      <div class="flex flex-col gap-1 p-4 border border-gray-200 rounded-lg">
        <span class="t-b2 font-secondary text-gray-600">Acciones presentes</span>
        <span class="t-h4 font-primary font-bold text-gray-900">
          {{ quorum.accionesPresentes.toLocaleString() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QuorumEstado } from '~/core/hexag/juntas/domain/entities/quorum-estado.entity';

const props = defineProps<{
  quorum: QuorumEstado;
}>();

const cumpleSimple = computed(() => props.quorum.cumpleQuorumSimple);
const cumpleCalificado = computed(() => props.quorum.cumpleQuorumCalificado);
</script>


