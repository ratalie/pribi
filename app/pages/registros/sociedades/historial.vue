<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { Building2, Plus, TestTube, Trash2, Eye, Pencil, CheckCircle2, Clock } from "lucide-vue-next";
  import { storeToRefs } from "pinia";
  import { computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { SocietyRegisterStep } from "~/core/hexag/registros/sociedades/domain/enums/society-register-step.enum";
  import CustomTable from "~/components/tables/CustomTable.vue";
  import { historialSociedadesTableConfig } from "~/config/tables/historial-sociedades.config";
  import type { TableCellRenderer, TableAction } from "~/types/tables/table-config";
  import type { SociedadResumenDTO } from "~/core/hexag/registros/sociedades/application/dtos";

  definePageMeta({
    layout: "registros",
  });

  useHead({
    title: "Historial Sociedades - PROBO",
  });

  const historialStore = useSociedadHistorialStore();
  const router = useRouter();
  const { sociedades, status, errorMessage } = storeToRefs(historialStore);

  onMounted(() => {
    historialStore.cargarHistorial();
  });

  const isLoading = computed(() => status.value === "loading");

  const formatDate = (isoString: string | null | undefined) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "—";
    const dateOnly = isoString.split("T")[0];
    const [year, month, day] = dateOnly.split("-");
    return `${day}/${month}/${year}`;
  };

  const pasoLabels: Record<SocietyRegisterStep, string> = {
    [SocietyRegisterStep.DATOS_SOCIEDAD]: "Datos principales",
    [SocietyRegisterStep.ACCIONISTAS]: "Accionistas",
    [SocietyRegisterStep.ACCIONES]: "Acciones",
    [SocietyRegisterStep.ASIGNACION_ACCIONES]: "Asignación de acciones",
    [SocietyRegisterStep.DIRECTORIO]: "Directorio",
    [SocietyRegisterStep.REGISTRO_APODERADOS]: "Registro apoderados",
    [SocietyRegisterStep.REGIMEN_PODERES]: "Régimen de poderes",
    [SocietyRegisterStep.QUORUMS_MAYORIAS]: "Quórums y mayorías",
    [SocietyRegisterStep.ACUERDOS_SOCIETARIOS]: "Acuerdos societarios",
    [SocietyRegisterStep.RESUMEN]: "Resumen",
    [SocietyRegisterStep.FINALIZAR]: "Finalizado",
  };

  const formatPasoActual = (paso: SocietyRegisterStep | string | undefined) => {
    if (!paso) return "—";
    const normalized = paso as SocietyRegisterStep;
    return pasoLabels[normalized] ?? paso.replace(/-/g, " ");
  };

  const getEstado = (sociedad: SociedadResumenDTO) => {
    const paso = sociedad.pasoActual;
    if (paso === SocietyRegisterStep.FINALIZAR) {
      return { label: "Completado", isComplete: true };
    }
    return { label: "Pendiente", isComplete: false };
  };

  const goToPreview = (id: string) => {
    router.push(`/registros/sociedades/${id}/preview`);
  };

  const goToEdit = (id: string) => {
    router.push(`/registros/sociedades/${id}/datos-sociedad`);
  };

  const handleDelete = async (sociedad: SociedadResumenDTO) => {
    const confirmed = window.confirm("¿Deseas eliminar este registro de sociedad?");
    if (!confirmed) return;
    await historialStore.eliminarSociedad(sociedad.idSociety);
  };

  const goToTestPage = () => {
    router.push("/dev/seeds-sociedades");
  };

  const handleDeleteAll = async () => {
    if (sociedades.value.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar TODAS las ${sociedades.value.length} sociedades registradas? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    await historialStore.eliminarTodasLasSociedades();
  };

  const handleCreate = () => {
    router.push("/registros/sociedades/agregar");
  };

  // Renderizadores personalizados
  const cellRenderers: TableCellRenderer[] = [
    {
      columnKey: "razonSocial",
      render: (rowData: SociedadResumenDTO) => rowData.razonSocial || "Sociedad sin nombre",
    },
    {
      columnKey: "ruc",
      render: (rowData: SociedadResumenDTO) => rowData.ruc || "—",
    },
    {
      columnKey: "nombreComercial",
      render: (rowData: SociedadResumenDTO) => rowData.nombreComercial || "—",
    },
    {
      columnKey: "tipoSociedad",
      render: (rowData: SociedadResumenDTO) => rowData.tipoSocietario || "—",
    },
    {
      columnKey: "estado",
      render: (rowData: SociedadResumenDTO) => getEstado(rowData),
    },
  ];

  // Acciones del dropdown
  const tableActions: TableAction[] = [
    {
      id: "preview",
      label: "Previsualizar",
      icon: "Eye",
      handler: (rowData: SociedadResumenDTO) => goToPreview(rowData.idSociety),
    },
    {
      id: "edit",
      label: "Editar datos",
      icon: "Pencil",
      handler: (rowData: SociedadResumenDTO) => goToEdit(rowData.idSociety),
    },
    {
      id: "delete",
      label: "Eliminar registro",
      icon: "Trash2",
      destructive: true,
      handler: (rowData: SociedadResumenDTO) => handleDelete(rowData),
    },
  ];

  const tableData = computed(() => sociedades.value);
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
              <Building2 class="w-7 h-7 text-white" />
            </div>
            <div>
              <h1
                class="text-3xl font-bold mb-1"
                style="
                  color: var(--text-primary);
                  font-family: var(--font-primary);
                "
              >
                Registro de Sociedades
              </h1>
              <p
                class="text-base"
                style="
                  color: var(--text-muted);
                  font-family: var(--font-secondary);
                "
              >
                Gestiona aquí las sociedades: agrega, edita o elimina fácilmente
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              class="text-primary-700 border-primary-300 hover:bg-primary-50"
              @click="goToTestPage"
            >
              <TestTube class="h-4 w-4 mr-2" />
              Vista de Test
            </Button>
            <Button
              variant="primary"
              size="md"
              class="flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              @click="handleCreate"
            >
              <Plus class="w-4 h-4" />
              Crear Sociedad
            </Button>
            <Button
              v-if="sociedades.length > 0"
              variant="destructive"
              size="sm"
              class="text-white"
              :disabled="isLoading"
              @click="handleDeleteAll"
            >
              <Trash2 class="h-4 w-4 mr-2" />
              Eliminar Todas
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="max-w-[1600px] mx-auto px-8 py-10">
      <!-- Tabla -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
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
                Sociedades Registradas
              </h3>
              <p
                class="text-sm"
                style="
                  color: var(--text-muted);
                  font-family: var(--font-secondary);
                "
              >
                Total: {{ sociedades.length }} {{ sociedades.length === 1 ? "sociedad" : "sociedades" }}
              </p>
            </div>
          </div>
        </div>

        <CustomTable
          :config="historialSociedadesTableConfig"
          :data="tableData"
          :is-loading="isLoading"
          :cell-renderers="cellRenderers"
          :actions="tableActions"
          :get-row-id="(row) => row.idSociety"
          empty-message="Aún no has registrado información. No te preocupes, puedes agregarla fácilmente haciendo click en el botón 'Crear Sociedad'"
        >
          <!-- Renderizado personalizado de razón social con nombre comercial -->
          <template #cell-razonSocial="{ rowData }">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style="background-color: var(--primary-100)"
              >
                <Building2 class="w-5 h-5" style="color: var(--primary-700)" />
              </div>
              <div class="flex flex-col">
                <span
                  class="font-semibold"
                  style="
                    color: var(--text-primary);
                    font-family: var(--font-primary);
                  "
                >
                  {{ rowData.razonSocial || "Sociedad sin nombre" }}
                </span>
                <span
                  v-if="rowData.nombreComercial"
                  class="text-xs mt-0.5"
                  style="
                    color: var(--text-muted);
                    font-family: var(--font-secondary);
                  "
                >
                  {{ rowData.nombreComercial }}
                </span>
              </div>
            </div>
          </template>

          <!-- Renderizado personalizado del estado con badge -->
          <template #cell-estado="{ rowData }">
            <div class="flex justify-start items-center">
              <span
                :class="[
                  'inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-medium',
                  getEstado(rowData).isComplete
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                ]"
                style="font-family: var(--font-secondary)"
              >
                <CheckCircle2
                  v-if="getEstado(rowData).isComplete"
                  class="w-3.5 h-3.5"
                />
                <Clock
                  v-else
                  class="w-3.5 h-3.5"
                />
                {{ getEstado(rowData).label }}
              </span>
            </div>
          </template>
        </CustomTable>
      </div>
    </div>
  </div>
</template>
