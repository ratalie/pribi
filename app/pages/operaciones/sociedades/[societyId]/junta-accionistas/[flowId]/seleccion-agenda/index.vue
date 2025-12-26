<template>
  <section class="h-full flex flex-col">
    <div class="flex gap-6 min-h-0 flex-1">
      <!-- Panel Izquierdo: Selección de Puntos -->
      <PanelSeleccionPuntos />

      <!-- Panel Derecho: Vista Previa de Agenda -->
      <PanelVistaPreviaAgenda />
    </div>
  </section>
</template>

<script setup lang="ts">
  import PanelSeleccionPuntos from "~/core/presentation/operaciones/junta-accionistas/pasos/seleccion-agenda/components/organisms/PanelSeleccionPuntos.vue";
  import PanelVistaPreviaAgenda from "~/core/presentation/operaciones/junta-accionistas/pasos/seleccion-agenda/components/organisms/PanelVistaPreviaAgenda.vue";
  import { useSeleccionAgendaPage } from "~/core/presentation/operaciones/junta-accionistas/pasos/seleccion-agenda/composables/useSeleccionAgendaPage";

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

  // Composable principal que maneja toda la lógica de la página
  useSeleccionAgendaPage();
</script>
