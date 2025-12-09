<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import { TestTube, Trash2, Eye, Pencil } from "lucide-vue-next";
  import { storeToRefs } from "pinia";
  import { computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
  import { SocietyRegisterStep } from "~/core/hexag/registros/sociedades/domain/enums/society-register-step.enum";
  import CustomTable from "~/components/tables/CustomTable.vue";
  import HistorialLayout from "~/components/historial/HistorialLayout.vue";
  import HistorialHeader from "~/components/historial/HistorialHeader.vue";
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
  <HistorialLayout
    :show-footer="true"
    :total="sociedades.length"
    footer-label="Sociedades"
  >
    <template #header>
      <HistorialHeader
        title="Registro de Sociedades"
        description="Gestiona aquí las sociedades: agrega, edita o elimina fácilmente"
        :show-actions="true"
      >
        <template #actions>
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
        </template>
      </HistorialHeader>
    </template>

    <!-- Tabla -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CustomTable
        :config="historialSociedadesTableConfig"
        :data="tableData"
        :is-loading="isLoading"
        :cell-renderers="cellRenderers"
        :actions="tableActions"
        :get-row-id="(row) => row.idSociety"
        empty-message="Aún no has registrado información. No te preocupes, puedes agregarla fácilmente haciendo click en el botón 'Agregar'"
      >
        <!-- Renderizado personalizado de razón social con nombre comercial -->
        <template #cell-razonSocial="{ rowData }">
          <div class="flex flex-col">
            <span class="font-medium text-layout-gray-800">
              {{ rowData.razonSocial || "Sociedad sin nombre" }}
            </span>
            <span v-if="rowData.nombreComercial" class="text-xs text-gray-600">
              Nombre comercial: {{ rowData.nombreComercial }}
            </span>
          </div>
        </template>

        <!-- Renderizado personalizado del estado con badge -->
        <template #cell-estado="{ rowData }">
          <div class="flex justify-start items-center">
            <span
              :class="[
                'py-1 px-3 rounded-full w-auto text-center text-xs font-medium',
                getEstado(rowData).isComplete
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200',
              ]"
            >
              {{ getEstado(rowData).label }}
            </span>
          </div>
        </template>
      </CustomTable>
    </div>
  </HistorialLayout>
</template>
