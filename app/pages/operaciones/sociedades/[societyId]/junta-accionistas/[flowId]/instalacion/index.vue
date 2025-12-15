<script setup lang="ts">
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
  import AsistenciaRepresentacionSection from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/AsistenciaRepresentacionSection.vue";
  import MesaDirectivaSection from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/MesaDirectivaSection.vue";
  import DetallesCelebracionSection from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/organisms/DetallesCelebracionSection.vue";
  import QuorumSection from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/organisms/QuorumSection.vue";
  import { useInstalacionPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/composables/useInstalacionPage";
  import { useJuntasRouteParams } from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/composables/useJuntasRouteParams";

  /**
   * Página: Instalación de la Junta
   *
   * Paso 3 del flujo de Juntas de Accionistas.
   * Registra la asistencia, representación, quorum y mesa directiva.
   *
   * Ruta: /operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/instalacion
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // Composable principal que maneja toda la lógica de la página
  useInstalacionPage();

  // Obtener IDs de la ruta para el template
  const { societyId, flowId } = useJuntasRouteParams();

  // Stores para el template (estado de carga)
  const snapshotStore = useSnapshotStore();
  const meetingDetailsStore = useMeetingDetailsStore();
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Instalación de la Junta"
      subtitle="Registra la asistencia de accionistas, representación y designación de la mesa directiva."
    />

    <!-- Esperar a que el snapshot esté cargado -->
    <div
      v-if="snapshotStore.status === 'loading'"
      class="flex justify-center items-center py-12"
    >
      <span class="text-slate-500">Cargando datos de la junta...</span>
    </div>

    <div
      v-else-if="snapshotStore.snapshot && meetingDetailsStore.meetingDetails"
      class="flex flex-col gap-10"
    >
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
        v-if="societyId && flowId"
        :society-id="societyId!"
        :flow-id="flowId!"
      />

      <!-- ========================================
           SECCIÓN 3: Mesa Directiva (Presidente y Secretario)
           ======================================== -->
      <MesaDirectivaSection
        v-if="societyId && flowId"
        :society-id="societyId!"
        :flow-id="flowId!"
      />
    </div>

    <div v-else class="flex justify-center items-center py-12">
      <span class="text-red-500">Error al cargar el snapshot</span>
    </div>
  </SlotWrapper>
</template>
