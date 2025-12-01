<script setup lang="ts">
  import { ChevronDown, ChevronRight, Info } from "lucide-vue-next";
  import { storeToRefs } from "pinia";
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import { AgendaItemsMapper } from "~/core/hexag/juntas/infrastructure/mappers/agenda-items.mapper";
  import { useAgendaItemsStore } from "~/core/presentation/juntas/stores/agenda-items.store";
  import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";

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
   * Componente para seleccionar puntos de agenda
   *
   * Diseño basado en probo-figma-ai (React)
   * - Panel izquierdo: Categorías colapsables con checkboxes
   * - Panel derecho: Vista previa de agenda con items seleccionados
   */

  // Stores
  const juntasFlowStore = useJuntasFlowStore();
  const agendaItemsStore = useAgendaItemsStore();
  const { agendaItems } = storeToRefs(agendaItemsStore);

  // Todos los sub-steps posibles, agrupados por categoría
  const PUNTOS_AGENDA = [
    // CATEGORÍA: Aumento de Capital
    {
      id: "aporte-dinerarios",
      title: "Aportes dinerarios",
      category: "Aumento de Capital",
    },
    {
      id: "aporte-no-dinerario",
      title: "Aporte no dinerario",
      category: "Aumento de Capital",
    },
    {
      id: "capitalizacion-creditos",
      title: "Capitalización de créditos",
      category: "Aumento de Capital",
    },

    // CATEGORÍA: Remoción
    {
      id: "remocion-gerente",
      title: "Remoción de gerente general",
      category: "Remoción",
    },
    {
      id: "remocion-apoderados",
      title: "Remoción de apoderados",
      category: "Remoción",
    },
    {
      id: "remocion-directores",
      title: "Remoción de directores",
      category: "Remoción",
    },

    // CATEGORÍA: Nombramiento
    {
      id: "nombramiento-gerente",
      title: "Nombramiento de gerente general",
      category: "Nombramiento",
    },
    {
      id: "nombramiento-apoderados",
      title: "Nombramiento de apoderados",
      category: "Nombramiento",
    },
    {
      id: "nombramiento-directores",
      title: "Nombramiento de directores",
      category: "Nombramiento",
    },
    {
      id: "nombramiento-nuevo-directorio",
      title: "Nombramiento del nuevo directorio",
      category: "Nombramiento",
    },

    // CATEGORÍA: Gestión Social y Resultados Económicos
    {
      id: "pronunciamiento-gestion",
      title: "Pronunciamiento de la gestión social y resultados económicos",
      category: "Gestión Social y Resultados Económicos",
    },
    {
      id: "aplicacion-resultados",
      title: "Aplicación de resultados",
      category: "Gestión Social y Resultados Económicos",
    },
    {
      id: "delegacion-auditores",
      title:
        "Designación y/o delegación en el directorio de la designación de auditores externos",
      category: "Gestión Social y Resultados Económicos",
    },
  ] as const;

  // Puntos obligatorios para Junta Obligatoria Anual
  const PUNTOS_JUNTA_OBLIGATORIA = [
    "pronunciamiento-gestion",
    "aplicacion-resultados",
    "delegacion-auditores",
  ];

  // Estado local
  const selectedPuntos = ref<string[]>([]);
  const isJuntaObligatoria = ref(false);
  const expandedCategories = ref<string[]>([
    "Aumento de Capital",
    "Remoción",
    "Nombramiento",
    "Gestión Social y Resultados Económicos",
  ]);

  // Cargar datos del backend al montar
  onMounted(async () => {
    // Primero cargar desde el store local
    selectedPuntos.value = [...juntasFlowStore.getDynamicSubSteps];

    // Si tenemos societyId y flowId, cargar desde el backend
    if (props.societyId && props.flowId) {
      const flowIdNumber = parseInt(props.flowId, 10);
      if (!Number.isNaN(flowIdNumber)) {
        try {
          await agendaItemsStore.loadAgendaItems(props.societyId, flowIdNumber);

          // Si hay datos cargados, convertir a IDs del frontend y actualizar
          if (agendaItems.value) {
            const frontendIds = AgendaItemsMapper.dtoToFrontendIds(agendaItems.value);
            selectedPuntos.value = frontendIds;
            juntasFlowStore.updateDynamicSubSteps(frontendIds);

            // Verificar si es junta obligatoria (todos los puntos obligatorios están seleccionados)
            const tieneTodosObligatorios = PUNTOS_JUNTA_OBLIGATORIA.every((id) =>
              frontendIds.includes(id)
            );
            isJuntaObligatoria.value = tieneTodosObligatorios;
          }
        } catch (error) {
          console.error("[SeleccionPuntosAgenda] Error al cargar agenda items:", error);
        }
      }
    }
  });

  // Agrupar puntos por categoría
  const puntosPorCategoria = computed(() => {
    const categorias: Record<string, Array<(typeof PUNTOS_AGENDA)[number]>> = {};

    PUNTOS_AGENDA.forEach((punto) => {
      const categoria = punto.category;
      if (!categorias[categoria]) {
        categorias[categoria] = [];
      }
      categorias[categoria]!.push(punto);
    });

    return categorias;
  });

  // Obtener agenda ordenada (solo puntos seleccionados)
  // Orden: Por categorías (orden de PUNTOS_AGENDA) y dentro de cada categoría, orden de aparición
  const agendaOrdenada = computed(() => {
    const ordenados: Array<(typeof PUNTOS_AGENDA)[number]> = [];

    // Iterar sobre PUNTOS_AGENDA en su orden original
    PUNTOS_AGENDA.forEach((punto) => {
      // Si está seleccionado, agregarlo al array ordenado
      if (selectedPuntos.value.includes(punto.id)) {
        ordenados.push(punto);
      }
    });

    return ordenados;
  });

  // Manejar cambio en checkbox
  const handlePuntoChange = (puntoId: string, checked: boolean) => {
    if (checked) {
      if (!selectedPuntos.value.includes(puntoId)) {
        selectedPuntos.value.push(puntoId);
      }
    } else {
      selectedPuntos.value = selectedPuntos.value.filter((id) => id !== puntoId);
    }

    // Guardar en el store inmediatamente
    juntasFlowStore.updateDynamicSubSteps([...selectedPuntos.value]);
  };

  // Verificar si un punto está seleccionado
  const isPuntoSelected = (puntoId: string) => {
    return selectedPuntos.value.includes(puntoId);
  };

  // Toggle categoría
  const toggleCategory = (category: string) => {
    if (expandedCategories.value.includes(category)) {
      expandedCategories.value = expandedCategories.value.filter((c) => c !== category);
    } else {
      expandedCategories.value.push(category);
    }
  };

  // Toggle Junta Obligatoria
  const toggleJuntaObligatoria = () => {
    const newValue = !isJuntaObligatoria.value;
    isJuntaObligatoria.value = newValue;

    if (newValue) {
      // Agregar puntos obligatorios si no están
      PUNTOS_JUNTA_OBLIGATORIA.forEach((id) => {
        if (!selectedPuntos.value.includes(id)) {
          selectedPuntos.value.push(id);
        }
      });
    } else {
      // Remover puntos obligatorios
      selectedPuntos.value = selectedPuntos.value.filter(
        (id) => !PUNTOS_JUNTA_OBLIGATORIA.includes(id)
      );
    }

    // Actualizar store
    juntasFlowStore.updateDynamicSubSteps([...selectedPuntos.value]);
  };
</script>

<template>
  <div class="flex gap-6 min-h-0 flex-1">
    <!-- ================================================
        COLUMNA IZQUIERDA: SELECCIÓN DE PUNTOS
    ================================================ -->
    <div class="flex-1 min-h-0 flex flex-col">
      <div
        class="bg-white border rounded-xl p-6 flex-1 overflow-y-auto min-h-0"
        style="
          border-color: var(--border-default, #e5e7eb);
          border-radius: var(--radius-large, 0.75rem);
        "
      >
        <!-- Header con Toggle Junta Obligatoria -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3
              class="text-lg mb-1 font-primary font-semibold"
              style="color: var(--text-primary, #111827)"
            >
              Puntos de Agenda
            </h3>
            <p class="text-sm font-secondary" style="color: var(--text-muted, #6b7280)">
              Selecciona los puntos a incluir en la junta
            </p>
          </div>

          <!-- Toggle Junta Obligatoria -->
          <div class="flex items-center gap-2">
            <label
              class="text-xs font-secondary font-medium"
              style="color: var(--text-secondary, #4b5563)"
            >
              Junta Obligatoria Anual
            </label>
            <button
              type="button"
              @click="toggleJuntaObligatoria"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              :style="{
                backgroundColor: isJuntaObligatoria
                  ? 'var(--primary-800, #5b21b6)'
                  : 'var(--gray-300, #d1d5db)',
              }"
            >
              <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="isJuntaObligatoria ? 'translate-x-6' : 'translate-x-1'"
              />
            </button>
            <!-- Tooltip Info -->
            <div class="relative group">
              <Info class="w-4 h-4 cursor-pointer" style="color: var(--text-muted, #6b7280)" />
              <!-- Tooltip -->
              <div
                v-if="isJuntaObligatoria"
                class="absolute right-0 top-8 w-64 p-3 bg-white border rounded-lg shadow-lg z-50"
                style="border-color: var(--border-default, #e5e7eb)"
              >
                <p
                  class="text-xs font-semibold mb-1 font-primary"
                  style="color: var(--text-primary, #111827)"
                >
                  A tener en cuenta
                </p>
                <p
                  class="text-xs font-secondary"
                  style="color: var(--text-secondary, #4b5563)"
                >
                  Una Junta Obligatoria Anual debe incluir al menos los siguientes puntos de
                  agenda.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Categorías con Checkboxes -->
        <div class="space-y-4">
          <div v-for="(puntos, categoria) in puntosPorCategoria" :key="categoria">
            <!-- Category Header -->
            <button
              type="button"
              @click="toggleCategory(categoria)"
              class="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center gap-2">
                <ChevronDown
                  v-if="expandedCategories.includes(categoria)"
                  class="w-4 h-4"
                  style="color: var(--text-muted, #6b7280)"
                />
                <ChevronRight
                  v-else
                  class="w-4 h-4"
                  style="color: var(--text-muted, #6b7280)"
                />
                <span
                  class="text-sm font-secondary font-semibold"
                  style="color: var(--text-primary, #111827)"
                >
                  {{ categoria }}
                </span>
              </div>
            </button>

            <!-- Puntos -->
            <div v-if="expandedCategories.includes(categoria)" class="ml-6 mt-2 space-y-3">
              <label
                v-for="punto in puntos"
                :key="punto.id"
                class="flex items-start gap-3 cursor-pointer group"
              >
                <Checkbox
                  :model-value="isPuntoSelected(punto.id)"
                  @update:model-value="(checked) => handlePuntoChange(punto.id, !!checked)"
                  class="mt-0.5"
                />
                <span
                  class="text-sm group-hover:text-primary-700 transition-colors font-secondary"
                  :style="{
                    color: isPuntoSelected(punto.id)
                      ? 'var(--primary-700, #7c3aed)'
                      : 'var(--text-secondary, #4b5563)',
                  }"
                >
                  {{ punto.title }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================================================
        COLUMNA DERECHA: PREVIEW DE AGENDA
    ================================================ -->
    <div class="w-96 min-h-0 flex flex-col">
      <div
        class="bg-white border rounded-xl p-6 flex-1 overflow-y-auto min-h-0"
        style="
          border-color: var(--border-default, #e5e7eb);
          border-radius: var(--radius-large, 0.75rem);
        "
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h4
            class="text-base font-primary font-semibold"
            style="color: var(--text-primary, #111827)"
          >
            Agenda
          </h4>
        </div>

        <!-- Alerta Junta Obligatoria -->
        <div
          v-if="isJuntaObligatoria"
          class="flex gap-2 items-start p-3 rounded-lg mb-6"
          style="background-color: #fef3c7; border: 1px solid #fde047"
        >
          <Info class="w-4 h-4 mt-0.5 shrink-0" style="color: #ca8a04" />
          <p class="text-xs font-secondary" style="color: #854d0e; line-height: 1.4">
            Una Junta Obligatoria Anual debe incluir los siguientes puntos de gestión social y
            resultados económicos.
          </p>
        </div>

        <!-- Lista de Agenda -->
        <div
          v-if="agendaOrdenada.length === 0"
          class="text-center py-12 border-2 border-dashed rounded-lg"
          style="border-color: var(--border-default, #e5e7eb)"
        >
          <p
            class="text-sm flex flex-col items-center justify-center gap-2 font-secondary"
            style="color: var(--text-muted, #6b7280)"
          >
            <span class="text-2xl">😢</span>
            <span>No hay contenidos en esta lista.</span>
          </p>
        </div>

        <div v-else class="space-y-3">
          <!-- Grupos por categoría -->
          <template v-for="(puntos, categoria) in puntosPorCategoria" :key="categoria">
            <!-- Filtrar puntos de esta categoría que estén seleccionados -->
            <template v-if="agendaOrdenada.some((p) => p.category === categoria)">
              <!-- Título de categoría -->
              <p
                class="text-xs mb-2 font-secondary font-semibold"
                style="color: var(--text-muted, #6b7280)"
              >
                {{ categoria }}
              </p>
              <!-- Items de la categoría -->
              <div class="space-y-2">
                <div
                  v-for="punto in agendaOrdenada.filter((p) => p.category === categoria)"
                  :key="punto.id"
                  class="flex items-center gap-3 text-sm p-3 rounded-lg transition-colors"
                  style="
                    background-color: var(--gray-50, #f9fafb);
                    font-family: var(--font-secondary);
                    cursor: default;
                  "
                >
                  <!-- Número global (sin icono de drag) -->
                  <span
                    class="shrink-0 font-semibold font-secondary w-6 text-center"
                    style="color: var(--primary-700, #7c3aed)"
                  >
                    {{ agendaOrdenada.findIndex((p) => p.id === punto.id) + 1 }}.
                  </span>
                  <!-- Título -->
                  <span
                    class="flex-1 font-secondary"
                    style="color: var(--text-secondary, #4b5563)"
                  >
                    {{ punto.title }}
                  </span>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
