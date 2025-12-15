<template>
  <div class="flex gap-6 min-h-0 flex-1">
    <!-- Panel Izquierdo: Selección de Puntos -->
    <PanelSeleccionPuntos
      :puntos-por-categoria="puntosPorCategoria"
      :selected-puntos="selectedPuntosArray"
      :is-junta-obligatoria="isJuntaObligatoriaValue"
      :is-category-expanded="isCategoryExpandedFn"
      @toggle-junta-obligatoria="handleToggleJuntaObligatoria"
      @toggle-category="handleToggleCategory"
      @toggle-punto="handleTogglePunto"
    />

    <!-- Panel Derecho: Vista Previa de Agenda -->
    <PanelVistaPreviaAgenda
      :agenda-ordenada="agendaPreview.agendaOrdenada.value"
      :agenda-por-categoria="agendaPreview.agendaPorCategoria.value"
      :is-junta-obligatoria="juntaObligatoria.isJuntaObligatoria.value"
      :get-punto-number="agendaPreview.getPuntoNumber"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from "pinia";
  import { AgendaItemsMapper } from "~/core/hexag/juntas/infrastructure/mappers/agenda-items.mapper";
  import { useAgendaItemsStore } from "~/core/presentation/juntas/stores/agenda-items.store";
  import { useAgendaPreview } from "./composables/useAgendaPreview";
  import { useCategoriasAgenda } from "./composables/useCategoriasAgenda";
  import { useJuntaObligatoria } from "./composables/useJuntaObligatoria";
  import { usePuntosAgenda } from "./composables/usePuntosAgenda";
  import PanelSeleccionPuntos from "./organisms/PanelSeleccionPuntos.vue";
  import PanelVistaPreviaAgenda from "./organisms/PanelVistaPreviaAgenda.vue";

  /**
   * Props del componente
   */
  interface Props {
    societyId?: number | null;
    flowId?: string | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    societyId: null,
    flowId: null,
  });

  /**
   * Container para seleccionar puntos de agenda
   *
   * Este componente orquesta todos los composables y componentes
   * siguiendo el patrón de arquitectura hexagonal y Atomic Design.
   */

  // Stores
  const agendaItemsStore = useAgendaItemsStore();
  const { agendaItems } = storeToRefs(agendaItemsStore);

  // Composables
  const puntosAgenda = usePuntosAgenda();
  const categorias = useCategoriasAgenda();
  const juntaObligatoria = useJuntaObligatoria(puntosAgenda);

  // Crear un ref reactivo para agendaPreview (necesita ser mutable)
  const selectedPuntosForPreview = computed(() => [...puntosAgenda.selectedPuntos.value]);
  const agendaPreview = useAgendaPreview(selectedPuntosForPreview);

  // Computed para puntos por categoría
  const puntosPorCategoria = computed(() => categorias.puntosPorCategoria.value);

  // Computed para selectedPuntos como array (reactivo)
  // Usar directamente el ref sin readonly para mantener reactividad
  const selectedPuntosArray = computed(() => {
    // Acceder directamente al valor del ref para mantener reactividad
    const puntos = puntosAgenda.selectedPuntos.value;
    return [...puntos];
  });

  // Computed para isJuntaObligatoria
  const isJuntaObligatoriaValue = computed(() => juntaObligatoria.isJuntaObligatoria.value);

  // Función wrapper para isCategoryExpanded
  const isCategoryExpandedFn = (categoria: string) => categorias.isCategoryExpanded(categoria);

  // Handlers
  const handleToggleJuntaObligatoria = () => {
    juntaObligatoria.toggleJuntaObligatoria();
  };

  const handleToggleCategory = (categoria: string) => {
    categorias.toggleCategory(categoria);
  };

  const handleTogglePunto = (puntoId: string, checked: boolean) => {
    console.log(`🟠 [SeleccionPuntosAgendaContainer] Toggle punto:`, { puntoId, checked });

    if (checked) {
      puntosAgenda.addPunto(puntoId);
    } else {
      puntosAgenda.removePunto(puntoId);
    }

    // Sincronizar junta obligatoria después de cambiar puntos
    juntaObligatoria.syncFromPuntos();
  };

  // Cargar datos del backend al montar
  onMounted(async () => {
    // Primero cargar desde el store local
    puntosAgenda.initializeFromStore();

    // Si tenemos societyId y flowId, cargar desde el backend
    if (props.societyId && props.flowId) {
      const flowIdNumber = parseInt(props.flowId, 10);
      if (!Number.isNaN(flowIdNumber)) {
        try {
          await agendaItemsStore.loadAgendaItems(props.societyId, flowIdNumber);

          // Si hay datos cargados, convertir a IDs del frontend y actualizar
          if (agendaItems.value) {
            const frontendIds = AgendaItemsMapper.dtoToFrontendIds(agendaItems.value);
            puntosAgenda.initializeFromExternal(frontendIds);

            // Sincronizar estado de junta obligatoria
            juntaObligatoria.initializeFromPuntos();
          }
        } catch (error) {
          console.error(
            "[SeleccionPuntosAgendaContainer] Error al cargar agenda items:",
            error
          );
        }
      }
    } else {
      // Si no hay datos del backend, inicializar junta obligatoria desde puntos actuales
      juntaObligatoria.initializeFromPuntos();
    }
  });
</script>
