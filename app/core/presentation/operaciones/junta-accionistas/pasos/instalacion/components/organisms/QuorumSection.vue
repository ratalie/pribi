<template>
  <!-- SOLO MOSTRAR EN JUNTA GENERAL (no en Universal) -->
  <div 
    v-if="tipoJunta === TipoJunta.GENERAL" 
    class="flex flex-col gap-5 p-6 bg-white rounded-lg border border-gray-200"
  >
    <TitleH4
      title="Quórums para instalación de la junta"
      subtitle="Porcentajes requeridos según los puntos de agenda seleccionados"
      :variant="Titles.WITH_SUBTITLE_SPACING"
    />
    
    <!-- 2 Cards de quórum dinámicos -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Quórum Simple (Instalación) -->
      <div class="flex flex-col gap-3 p-4 border border-blue-200 rounded-lg bg-blue-50">
        <span class="t-t3 font-secondary font-bold text-blue-800">
          Quórum simple (instalación)
        </span>
        <span class="t-h4 font-primary font-bold text-blue-600">
          {{ quorumSimple }}%
        </span>
        
        <!-- Lista de puntos simples seleccionados -->
        <div v-if="puntosSimples.length > 0" class="flex flex-col gap-1">
          <span class="t-b3 font-secondary text-blue-700 font-semibold">
            Puntos de agenda (simples):
          </span>
          <ul class="list-disc list-inside space-y-0.5">
            <li
              v-for="punto in puntosSimples"
              :key="punto"
              class="t-b3 font-secondary text-blue-600"
            >
              {{ getLabelPunto(punto) }}
            </li>
          </ul>
        </div>
        <span v-else class="t-b3 font-secondary text-blue-600 italic">
          No hay puntos simples seleccionados
        </span>
      </div>
      
      <!-- Quórum Calificado (Instalación) -->
      <div class="flex flex-col gap-3 p-4 border border-purple-200 rounded-lg bg-purple-50">
        <span class="t-t3 font-secondary font-bold text-purple-800">
          Quórum calificado (instalación)
        </span>
        <span class="t-h4 font-primary font-bold text-purple-600">
          {{ quorumCalificado }}%
        </span>
        
        <!-- Lista de puntos calificados seleccionados -->
        <div v-if="puntosCalificados.length > 0" class="flex flex-col gap-1">
          <span class="t-b3 font-secondary text-purple-700 font-semibold">
            Puntos de agenda (calificados):
          </span>
          <ul class="list-disc list-inside space-y-0.5">
            <li
              v-for="punto in puntosCalificados"
              :key="punto"
              class="t-b3 font-secondary text-purple-600"
            >
              {{ getLabelPunto(punto) }}
            </li>
          </ul>
        </div>
        <span v-else class="t-b3 font-secondary text-purple-600 italic">
          No hay puntos calificados seleccionados
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TitleH4 from '~/components/titles/TitleH4.vue';
import Titles from '~/types/enums/Titles.enum';
import { TipoJunta } from '~/core/hexag/juntas/domain/enums/tipo-junta.enum';
import { OrdenConvocatoria } from '~/core/hexag/juntas/domain/enums/orden-convocatoria.enum';
import { useSnapshotStore } from '~/core/presentation/juntas/stores/snapshot.store';
import { useMeetingDetailsStore } from '~/core/presentation/juntas/stores/meeting-details.store';
import { useJuntasFlowStore } from '~/stores/useJuntasFlowStore';
import {
  getTipoAcuerdo,
  TipoAcuerdo,
  LABELS_PUNTOS,
} from '~/core/hexag/juntas/domain/constants/agenda-classification.constants';

const snapshotStore = useSnapshotStore();
const meetingDetailsStore = useMeetingDetailsStore();
const juntasFlowStore = useJuntasFlowStore();

// Tipo de junta (para ocultar en Universal)
const tipoJunta = computed(() => meetingDetailsStore.meetingDetails?.tipoJunta);

// Quórums de instalación según convocatoria
const quorumSimple = computed(() => {
  const quorums = snapshotStore.quorums;
  if (!quorums) return 0;
  
  const convocatoria = meetingDetailsStore.meetingDetails?.instaladaEnConvocatoria || OrdenConvocatoria.PRIMERA;
  
  return convocatoria === OrdenConvocatoria.PRIMERA
    ? quorums.primeraConvocatoriaSimple
    : quorums.segundaConvocatoriaSimple;
});

const quorumCalificado = computed(() => {
  const quorums = snapshotStore.quorums;
  if (!quorums) return 0;
  
  const convocatoria = meetingDetailsStore.meetingDetails?.instaladaEnConvocatoria || OrdenConvocatoria.PRIMERA;
  
  return convocatoria === OrdenConvocatoria.PRIMERA
    ? quorums.primeraConvocatoriaCalificada
    : quorums.segundaConvocatoriaCalificada;
});

// Puntos seleccionados clasificados por tipo
const puntosSimples = computed(() => {
  return juntasFlowStore.selectedSubSteps.filter(
    (id) => getTipoAcuerdo(id) === TipoAcuerdo.SIMPLE
  );
});

const puntosCalificados = computed(() => {
  return juntasFlowStore.selectedSubSteps.filter(
    (id) => getTipoAcuerdo(id) === TipoAcuerdo.CALIFICADO
  );
});

// Helper para obtener label amigable
const getLabelPunto = (puntoId: string): string => {
  return LABELS_PUNTOS[puntoId] || puntoId;
};
</script>





