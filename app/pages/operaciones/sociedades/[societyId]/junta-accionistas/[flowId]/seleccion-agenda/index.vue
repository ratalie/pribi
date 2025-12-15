<script setup lang="ts">
  import SeleccionPuntosAgendaContainer from "~/components/juntas/seleccion-agenda/SeleccionPuntosAgendaContainer.vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { AgendaItemsMapper } from "~/core/hexag/juntas/infrastructure/mappers/agenda-items.mapper";
  import { useAgendaItemsStore } from "~/core/presentation/juntas/stores/agenda-items.store";
  import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";

  /**
   * Página: Selección de Puntos de Agenda
   *
   * Paso 1 del flujo de Juntas de Accionistas.
   * Usa arquitectura hexagonal que YA funciona.
   *
   * Ruta: /operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/seleccion-agenda
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();

  // Extraer IDs de la ruta
  const societyId = computed(() => {
    const param = route.params.societyId;
    if (typeof param === "string") return parseInt(param, 10);
    if (Array.isArray(param) && param[0]) return parseInt(param[0] as string, 10);
    return null;
  });

  const flowId = computed(() => {
    const param = route.params.flowId;
    if (typeof param === "string") return param;
    if (Array.isArray(param) && param[0]) return param[0] as string;
    return null;
  });

  // Stores
  const juntasFlowStore = useJuntasFlowStore();
  const agendaItemsStore = useAgendaItemsStore();

  // Configurar el botón "Siguiente" (USANDO ARQUITECTURA QUE YA FUNCIONA)
  useJuntasFlowNext(async () => {
    // Validar que al menos un punto esté seleccionado
    const selectedPuntos = juntasFlowStore.getDynamicSubSteps;

    console.log("🔍 [seleccion-agenda/index] Validando puntos seleccionados:", {
      selectedPuntos,
      length: selectedPuntos.length,
      storeState: juntasFlowStore.selectedSubSteps,
    });

    if (selectedPuntos.length === 0) {
      throw new Error("Debes seleccionar al menos un punto de agenda para continuar.");
    }

    // Validar que tengamos societyId y flowId
    if (!societyId.value || !flowId.value) {
      throw new Error(
        "No se pudo identificar la sociedad o la junta. Por favor, recarga la página."
      );
    }

    // Convertir IDs del frontend a estructura del backend
    const payload = AgendaItemsMapper.frontendIdsToDTO(selectedPuntos);

    // Guardar en el backend usando arquitectura hexagonal que YA funciona
    const flowIdNumber = parseInt(flowId.value, 10);
    if (Number.isNaN(flowIdNumber)) {
      throw new Error("ID de junta inválido.");
    }

    await agendaItemsStore.saveAgendaItems(societyId.value, flowIdNumber, payload);
  });
</script>

<template>
  <section class="h-full flex flex-col">
    <div class="flex-1 min-h-0">
      <SeleccionPuntosAgendaContainer :society-id="societyId" :flow-id="flowId" />
    </div>
  </section>
</template>
