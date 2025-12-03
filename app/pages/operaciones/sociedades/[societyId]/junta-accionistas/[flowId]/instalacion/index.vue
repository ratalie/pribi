<template>
  <div class="px-11 py-11 flex flex-col gap-10">
    <!-- 1. Detalles de la celebración -->
    <DetallesCelebracionSection v-if="meetingDetailsStore.meetingDetails" />
    
    <!-- 2. Quórum requerido (dinámico según convocatoria) -->
    <QuorumSection v-if="snapshotStore.quorums" />
    
    <!-- 3. Tabla de asistencia -->
    <AsistenciaTable
      :asistencias="asistenciaStore.asistenciasEnriquecidas"
      @toggle-asistencia="handleToggleAsistencia"
    />
    
    <!-- 4. Métricas de quórum -->
    <QuorumMetricsSection
      v-if="asistenciaStore.quorumEstado"
      :quorum="asistenciaStore.quorumEstado"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import DetallesCelebracionSection from '~/components/juntas/instalacion/DetallesCelebracionSection.vue';
import QuorumSection from '~/components/juntas/instalacion/QuorumSection.vue';
import AsistenciaTable from '~/components/juntas/instalacion/AsistenciaTable.vue';
import QuorumMetricsSection from '~/components/juntas/instalacion/QuorumMetricsSection.vue';
import { useSnapshotStore } from '~/core/presentation/juntas/stores/snapshot.store';
import { useMeetingDetailsStore } from '~/core/presentation/juntas/stores/meeting-details.store';
import { useAsistenciaStore } from '~/core/presentation/juntas/stores/asistencia.store';
import { useJuntasFlowNext } from '~/composables/useJuntasFlowNext';

const route = useRoute();
const snapshotStore = useSnapshotStore();
const meetingDetailsStore = useMeetingDetailsStore();
const asistenciaStore = useAsistenciaStore();

const societyId = computed(() => parseInt(route.params.societyId as string));
const flowId = computed(() => parseInt(route.params.flowId as string));

onMounted(async () => {
  console.log('🚀 [Instalacion] Página montada', {
    societyId: societyId.value,
    flowId: flowId.value,
  });
  
  try {
    // 1. Cargar snapshot (accionistas, quórums, directorio)
    await snapshotStore.loadSnapshot(societyId.value, flowId.value);
    
    // 2. Cargar meeting details (tipo junta, convocatoria)
    if (!meetingDetailsStore.meetingDetails) {
      await meetingDetailsStore.loadMeetingDetails(societyId.value, flowId.value);
    }
    
    // 3. Cargar asistencias (registros de attendance)
    await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
    
    console.log('✅ [Instalacion] Datos cargados exitosamente');
  } catch (error) {
    console.error('❌ [Instalacion] Error al cargar datos:', error);
  }
});

const handleToggleAsistencia = async (registroId: string) => {
  try {
    await asistenciaStore.toggleAsistencia(societyId.value, flowId.value, registroId);
  } catch (error) {
    console.error('❌ [Instalacion] Error al toggle asistencia:', error);
  }
};

// Navegación
useJuntasFlowNext(async () => {
  console.log('🎯 [Instalacion] Handler de Siguiente ejecutado');
  
  // TODO: Validaciones antes de continuar
  // - Validar que todos los que requieren representante lo tengan
  // - Validar que haya al menos un asistente
  // - Validar presidente y secretario
  
  // TODO: Guardar presidente y secretario en meeting-details
  
  console.log('✅ [Instalacion] Validaciones pasadas, continuando...');
});

definePageMeta({
  layout: 'registros',
  flowLayoutJuntas: true,
});
</script>
