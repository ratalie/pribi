<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { useRouter } from "vue-router";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Building2, Pencil, Trash2 } from "lucide-vue-next";
  import { storeToRefs } from "pinia";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
  import CustomTable from "~/components/tables/CustomTable.vue";
  import HistorialLayout from "~/components/historial/HistorialLayout.vue";
  import HistorialHeader from "~/components/historial/HistorialHeader.vue";
  import { historialJuntasTableConfig } from "~/config/tables/historial-juntas.config";
  import type { TableCellRenderer, TableAction } from "~/types/tables/table-config";
  import type { JuntaResumenDTO } from "~/core/hexag/juntas/application/dtos";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Histórico Juntas - PROBO",
  });

  const router = useRouter();
  const sociedadHistorialStore = useSociedadHistorialStore();
  const juntaHistorialStore = useJuntaHistorialStore();
  const { sociedades } = storeToRefs(sociedadHistorialStore);
  const { juntas, status, errorMessage } = storeToRefs(juntaHistorialStore);

  const selectedSocietyId = ref<string | null>(null);
  const isLoadingSociedades = ref(false);

  const isLoading = computed(() => status.value === "loading");

  const formatDate = (isoString: string | null | undefined) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "—";
    const dateOnly = isoString.split("T")[0];
    const [year, month, day] = dateOnly.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatEstado = (estado: string | undefined) => {
    if (!estado) return "PENDIENTE";
    const estados: Record<string, string> = {
      BORRADOR: "PENDIENTE",
      EN_PROGRESO: "PENDIENTE",
      FINALIZADO: "FINALIZADO",
    };
    return estados[estado] ?? "PENDIENTE";
  };

  const isComplete = (estado: string | undefined) => {
    return estado === "FINALIZADO";
  };

  const getTipoJunta = (junta: JuntaResumenDTO) => {
    // Por ahora retornamos un valor por defecto
    // TODO: Obtener del backend cuando esté disponible
    return "Junta General";
  };

  const getCategoria = (junta: JuntaResumenDTO) => {
    // Por ahora retornamos un valor por defecto
    // TODO: Obtener del backend cuando esté disponible
    return "Aumento de Capital";
  };

  const getAccion = (junta: JuntaResumenDTO) => {
    // Por ahora retornamos un valor por defecto
    // TODO: Obtener del backend cuando esté disponible
    return "Aporte Dinerario";
  };

  onMounted(async () => {
    isLoadingSociedades.value = true;
    try {
      await sociedadHistorialStore.cargarHistorial();
      if (selectedSocietyId.value) {
        const societyIdNumber = parseInt(selectedSocietyId.value, 10);
        if (!Number.isNaN(societyIdNumber)) {
          await juntaHistorialStore.cargarHistorial(societyIdNumber);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      isLoadingSociedades.value = false;
    }
  });

  const handleSocietyChange = async (value: unknown) => {
    const societyId = value as string | null;
    selectedSocietyId.value = societyId;
    if (societyId) {
      const societyIdNumber = parseInt(societyId, 10);
      if (!Number.isNaN(societyIdNumber)) {
        await juntaHistorialStore.cargarHistorial(societyIdNumber);
      }
    }
  };

  const goToEdit = (junta: JuntaResumenDTO) => {
    if (!selectedSocietyId.value) return;
    const societyIdNumber = parseInt(selectedSocietyId.value, 10);
    if (!Number.isNaN(societyIdNumber)) {
      juntaHistorialStore.setSelectedSocietyId(societyIdNumber);
      router.push(
        `/operaciones/sociedades/${societyIdNumber}/junta-accionistas/${junta.id}/seleccion-agenda`
      );
    }
  };

  const handleDelete = async (junta: JuntaResumenDTO) => {
    if (!selectedSocietyId.value) return;
    const confirmed = window.confirm("¿Deseas eliminar esta junta de accionistas?");
    if (!confirmed) return;

    const societyIdNumber = parseInt(selectedSocietyId.value, 10);
    if (!Number.isNaN(societyIdNumber)) {
      await juntaHistorialStore.eliminarJunta(societyIdNumber, junta.id);
    }
  };

  // Renderizadores personalizados para las celdas
  const cellRenderers: TableCellRenderer[] = [
    {
      columnKey: "fechaCreacion",
      render: (rowData: JuntaResumenDTO) => formatDate(rowData.createdAt),
    },
    {
      columnKey: "tipo",
      render: (rowData: JuntaResumenDTO) => getTipoJunta(rowData),
    },
    {
      columnKey: "categoria",
      render: (rowData: JuntaResumenDTO) => getCategoria(rowData),
    },
    {
      columnKey: "accion",
      render: (rowData: JuntaResumenDTO) => getAccion(rowData),
    },
    {
      columnKey: "estado",
      render: (rowData: JuntaResumenDTO) => {
        const completo = isComplete(rowData.estado);
        return {
          type: "badge",
          label: completo ? "FINALIZADO" : "PENDIENTE",
          isComplete: completo,
        };
      },
    },
  ];

  // Acciones del dropdown
  const tableActions: TableAction[] = [
    {
      id: "edit",
      label: "Editar",
      icon: "Pencil",
      handler: (rowData: JuntaResumenDTO) => goToEdit(rowData),
    },
    {
      id: "delete",
      label: "Eliminar",
      icon: "Trash2",
      destructive: true,
      handler: (rowData: JuntaResumenDTO) => handleDelete(rowData),
    },
  ];

  // Datos mapeados para la tabla
  const tableData = computed(() => juntas.value);

  // Total de juntas para el footer (solo si hay sociedad seleccionada)
  const totalJuntas = computed(() => {
    if (!selectedSocietyId.value) return 0;
    return juntas.value.length;
  });
</script>

<template>
  <HistorialLayout
    :show-footer="!!selectedSocietyId"
    :total="totalJuntas"
    footer-label="Juntas"
  >
    <template #header>
      <HistorialHeader
        title="Histórico de Registros"
        description="Consulta aquí todos los registros realizados."
      />
    </template>

    <div class="space-y-6">
      <!-- Selector de Sociedades -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div class="space-y-2">
          <label class="text-sm font-medium text-layout-gray-800">Selecciona la sociedad</label>
          <Select
            v-model="selectedSocietyId"
            :disabled="isLoadingSociedades"
            @update:model-value="handleSocietyChange"
          >
            <SelectTrigger class="w-full md:w-96">
              <SelectValue placeholder="Selecciona una sociedad..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="sociedad in sociedades"
                :key="sociedad.idSociety"
                :value="sociedad.idSociety"
              >
                <div class="flex items-center gap-2">
                  <Building2 class="h-4 w-4" />
                  <span>{{ sociedad.razonSocial || "Sociedad sin nombre" }}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p v-if="isLoadingSociedades" class="text-xs text-gray-500">
            Cargando sociedades...
          </p>
          <p v-else-if="sociedades.length === 0" class="text-xs text-amber-600">
            No hay sociedades disponibles. Crea una sociedad primero.
          </p>
        </div>
      </div>

      <!-- Tabla de Juntas -->
      <div v-if="selectedSocietyId" class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <CustomTable
          :config="historialJuntasTableConfig"
          :data="tableData"
          :is-loading="isLoading"
          :cell-renderers="cellRenderers"
          :actions="tableActions"
          :get-row-id="(row) => row.id"
          empty-message="Aún no has registrado información. No te preocupes, puedes hacerlo en cualquier momento."
        >
          <!-- Renderizado personalizado del estado con badge -->
          <template #cell-estado="{ rowData }">
            <div class="flex justify-start items-center">
              <span
                :class="[
                  'py-1 px-3 rounded-full w-auto text-center text-xs font-medium',
                  isComplete(rowData.estado)
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                ]"
              >
                {{ formatEstado(rowData.estado) }}
              </span>
            </div>
          </template>
        </CustomTable>
      </div>

      <!-- Mensaje cuando no hay sociedad seleccionada -->
      <div
        v-else
        class="flex min-h-[200px] items-center justify-center rounded-lg border border-gray-200 bg-white"
      >
        <p class="text-center text-gray-500">
          Selecciona una sociedad para ver sus juntas de accionistas.
        </p>
      </div>
    </div>
  </HistorialLayout>
</template>
