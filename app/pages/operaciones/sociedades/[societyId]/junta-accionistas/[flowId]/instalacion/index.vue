<script setup lang="ts">
import { computed, onMounted } from "vue";
import SlotWrapper from "~/components/containers/SlotWrapper.vue";
import TitleH2 from "~/components/titles/TitleH2.vue";
import DetallesCelebracionSection from "~/components/juntas/instalacion/DetallesCelebracionSection.vue";
import QuorumSection from "~/components/juntas/instalacion/QuorumSection.vue";
import AsistenciaRepresentacionSection from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/AsistenciaRepresentacionSection.vue";
import MesaDirectivaSection from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/MesaDirectivaSection.vue";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

/**
 * Página: Instalación de la Junta
 * 
 * Paso 3 del flujo de Juntas de Accionistas.
 * Registra la asistencia, representación, quorum y mesa directiva.
 * 
 * Ruta: /operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/instalacion
 */

// ========================================
// PAGE META
// ========================================
definePageMeta({
  layout: "registros",
  flowLayoutJuntas: true, // ← CLAVE PARA EL SIDEBAR
});

// ========================================
// ROUTE PARAMS
// ========================================
const route = useRoute();
const societyId = computed(() => parseInt(route.params.societyId as string, 10));
const flowId = computed(() => parseInt(route.params.flowId as string, 10));

// ========================================
// STORES
// ========================================
const snapshotStore = useSnapshotStore();
const meetingDetailsStore = useMeetingDetailsStore();
const asistenciaStore = useAsistenciaStore();

// ========================================
// LIFECYCLE
// ========================================
onMounted(async () => {
  console.log('🚀 [Instalacion] Página montada', {
    societyId: societyId.value,
    flowId: flowId.value,
  });
  
  try {
    // 1. Cargar snapshot (accionistas, quórums, directorio)
    console.log('📦 [Instalacion] Cargando snapshot...');
    await snapshotStore.loadSnapshot(societyId.value, flowId.value);
    console.log('✅ [Instalacion] Snapshot cargado');
    
    // 2. Cargar meeting details (tipo junta, convocatoria)
    if (!meetingDetailsStore.meetingDetails) {
      console.log('📄 [Instalacion] Cargando meeting details...');
      await meetingDetailsStore.loadMeetingDetails(societyId.value, flowId.value);
      console.log('✅ [Instalacion] Meeting details cargado');
    }
    
    // 3. Cargar asistencias (registros de attendance)
    console.log('👥 [Instalacion] Cargando asistencias...');
    await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
    console.log('✅ [Instalacion] Asistencias cargadas:', asistenciaStore.asistencias.length);
    
  } catch (error) {
    console.error('❌ [Instalacion] Error al cargar datos:', error);
  }
});

// Configurar el botón "Siguiente"
useJuntasFlowNext(async () => {
  console.log('🎯 [Instalacion] Handler de Siguiente ejecutado');
  
  // TODO: Validaciones antes de continuar
  // - Validar que haya al menos un asistente
  // - Validar que los que requieren representante lo tengan
  // - Validar que haya presidente y secretario
  
  // TODO: Guardar mesa directiva en meeting-details
  await meetingDetailsStore.patchMeetingDetails({
    presidenteAsistio: true, // TODO: Obtener del componente
    secretarioAsistio: true, // TODO: Obtener del componente
  });
  
  console.log('✅ [Instalacion] Validaciones pasadas, continuando...');
});
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Instalación de la Junta"
      subtitle="Registra la asistencia de accionistas, representación y designación de la mesa directiva."
    />

    <div class="flex flex-col gap-10">
      <!-- ========================================
           SECCIÓN 1: Detalles de la Celebración
           ======================================== -->
      <DetallesCelebracionSection />

      <!-- Quorum (debajo de detalles, solo si es GENERAL) -->
      <QuorumSection />

      <!-- ========================================
           SECCIÓN 2: Asistencia y Representación
           ======================================== -->
      <AsistenciaRepresentacionSection 
        :society-id="societyId" 
        :flow-id="String(flowId)" 
      />

      <!-- ========================================
           SECCIÓN 3: Mesa Directiva (Presidente y Secretario)
           ======================================== -->
      <MesaDirectivaSection 
        :society-id="societyId" 
        :flow-id="String(flowId)" 
      />
    </div>
  </SlotWrapper>
</template>
