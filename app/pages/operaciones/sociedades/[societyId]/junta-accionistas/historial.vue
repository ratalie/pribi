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
  import { Crown, Building2, Pencil, Trash2, CheckCircle2, Clock, Plus } from "lucide-vue-next";
  import { Button } from "@/components/ui/button";
  import { storeToRefs } from "pinia";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { useJuntaHistorialStore } from "~/core/presentation/juntas/stores/junta-historial.store";
  import CustomTable from "~/components/tables/CustomTable.vue";
  import { historialJuntasTableConfig } from "~/config/tables/historial-juntas.config";
  import type { TableCellRenderer, TableAction } from "~/types/tables/table-config";
  import type { JuntaResumenDTO } from "~/core/hexag/juntas/application/dtos";

  definePageMeta({
    layout: "default",
  });

  useHead({
    title: "Historial Juntas - PROBO",
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
    return "Junta General";
  };

  const getCategoria = (junta: JuntaResumenDTO) => {
    return "Aumento de Capital";
  };

  const getAccion = (junta: JuntaResumenDTO) => {
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

  const handleCreate = () => {
    if (selectedSocietyId.value) {
      const societyIdNumber = parseInt(selectedSocietyId.value, 10);
      if (!Number.isNaN(societyIdNumber)) {
        router.push(`/operaciones/sociedades/${societyIdNumber}/junta-accionistas/crear`);
      }
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

  const selectedSociedad = computed(() => {
    if (!selectedSocietyId.value) return null;
    return sociedades.value.find(
      (s) => s.idSociety === selectedSocietyId.value
    );
  });
</script>

<template>
  <div class="min-h-full bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-[1600px] mx-auto px-8 py-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div
              class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style="background: linear-gradient(135deg, var(--primary-700), var(--primary-500))"
            >
              <Crown class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1
                class="text-3xl font-bold mb-1"
                style="
                  color: var(--text-primary);
                  font-family: var(--font-primary);
                "
              >
                Historial de Juntas
              </h1>
              <p
                class="text-base"
                style="
                  color: var(--text-muted);
                  font-family: var(--font-secondary);
                "
              >
                Consulta aquí todos los registros realizados
              </p>
            </div>
          </div>
          <Button
            v-if="selectedSocietyId"
            variant="primary"
            size="md"
            class="flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            @click="handleCreate"
          >
            <Plus class="w-4 h-4" />
            Crear Junta
          </Button>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-[1600px] mx-auto px-8 py-10">
      <div class="space-y-6">
        <!-- Selector de Sociedades -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <label
            class="text-base font-bold block mb-3"
            style="
              color: var(--text-primary);
              font-family: var(--font-primary);
            "
          >
            Selecciona la sociedad
          </label>
          <Select
            :model-value="selectedSocietyId"
            :disabled="isLoadingSociedades"
            @update:model-value="handleSocietyChange"
          >
            <SelectTrigger class="w-full md:w-96 h-12">
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
          <p
            v-if="isLoadingSociedades"
            class="text-xs mt-2"
            style="
              color: var(--text-muted);
              font-family: var(--font-secondary);
            "
          >
            Cargando sociedades...
          </p>
          <p
            v-else-if="sociedades.length === 0"
            class="text-xs text-amber-600 font-medium mt-2"
            style="font-family: var(--font-secondary)"
          >
            No hay sociedades disponibles. Crea una sociedad primero.
          </p>
          <div
            v-if="selectedSociedad"
            class="mt-4 p-4 rounded-lg bg-primary-50 border border-primary-200"
          >
            <p
              class="text-sm font-medium mb-1"
              style="
                color: var(--primary-800);
                font-family: var(--font-primary);
              "
            >
              {{ selectedSociedad.razonSocial }}
            </p>
            <p
              class="text-xs"
              style="
                color: var(--text-muted);
                font-family: var(--font-secondary);
              "
            >
              RUC: {{ selectedSociedad.ruc || "N/A" }} | Tipo: {{ selectedSociedad.tipoSocietario || "N/A" }}
            </p>
          </div>
        </div>

        <!-- Tabla de Juntas -->
        <div v-if="selectedSocietyId" class="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h3
                  class="text-lg font-semibold mb-1"
                  style="
                    color: var(--text-primary);
                    font-family: var(--font-primary);
                  "
                >
                  Juntas de Accionistas
                </h3>
                <p
                  class="text-sm"
                  style="
                    color: var(--text-muted);
                    font-family: var(--font-secondary);
                  "
                >
                  Total: {{ juntas.length }} {{ juntas.length === 1 ? "junta" : "juntas" }}
                </p>
              </div>
            </div>
          </div>

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
                    'inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium',
                    isComplete(rowData.estado)
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                  ]"
                  style="font-family: var(--font-secondary)"
                >
                  <CheckCircle2
                    v-if="isComplete(rowData.estado)"
                    class="w-3.5 h-3.5"
                  />
                  <Clock
                    v-else
                    class="w-3.5 h-3.5"
                  />
                  {{ formatEstado(rowData.estado) }}
                </span>
              </div>
            </template>
          </CustomTable>
        </div>

        <!-- Mensaje cuando no hay sociedad seleccionada -->
        <div
          v-else
          class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center"
        >
          <Crown class="w-16 h-16 mx-auto mb-4" style="color: var(--text-muted)" />
          <h3
            class="text-xl font-semibold mb-2"
            style="
              color: var(--text-primary);
              font-family: var(--font-primary);
            "
          >
            Selecciona una sociedad
          </h3>
          <p
            class="text-sm"
            style="
              color: var(--text-muted);
              font-family: var(--font-secondary);
            "
          >
            Elige una sociedad del selector para ver sus juntas de accionistas
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
