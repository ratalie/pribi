<script setup lang="ts">
  import { ChevronDown, ChevronUp } from "lucide-vue-next";
  import { computed, ref } from "vue";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import DataTableDropDown from "~/components/base/tables/DataTableDropDown.vue";
  import Table from "~/components/ui/table/Table.vue";
  import TableBody from "~/components/ui/table/TableBody.vue";
  import TableCell from "~/components/ui/table/TableCell.vue";
  import TableHead from "~/components/ui/table/TableHead.vue";
  import TableHeader from "~/components/ui/table/TableHeader.vue";
  import TableRow from "~/components/ui/table/TableRow.vue";
  import { useRegistroAsignacionAccionesStore } from "../../stores/useRegistroAsignacionAccionesStore";
  import AsignarAccionesModal from "../modals/AsignarAccionesModal.vue";

  interface Props {
    titleMenu?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    titleMenu: "Acciones",
  });

  const asignacionAccionesStore = useRegistroAsignacionAccionesStore();

  // Obtener datos desde el store
  const data = computed(() => asignacionAccionesStore.tablaAsignaciones);

  const getQuantityShares = (
    shares: { clase: string; acciones: number; porcentaje: number }[]
  ) => {
    return shares.reduce((total, share) => total + share.acciones, 0);
  };

  const getPercentage = (
    shares: { clase: string; acciones: number; porcentaje: number }[]
  ) => {
    return shares.reduce((sum, share) => sum + share.porcentaje, 0);
  };

  const expanded = ref<string[]>([]);
  const isModalOpen = ref(false);
  const selectedAccionistaId = ref<string | null>(null);
  const selectedAccionId = ref<string | null>(null);
  const modalMode = ref<"crear" | "editar">("crear");

  function toggleRow(id: string) {
    if (expanded.value.includes(id)) {
      expanded.value = expanded.value.filter((e) => e !== id);
    } else {
      expanded.value.push(id);
    }
  }

  function openModal(accionistaId: string, accionId?: string) {
    selectedAccionistaId.value = accionistaId;
    if (accionId) {
      modalMode.value = "editar";
      selectedAccionId.value = accionId;
    } else {
      modalMode.value = "crear";
      selectedAccionId.value = null;
    }
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
    selectedAccionistaId.value = null;
    selectedAccionId.value = null;
  }

  function handleEdit(accionistaId: string, accionId: string) {
    openModal(accionistaId, accionId);
  }

  function handleDelete(accionistaId: string, accionId: string) {
    asignacionAccionesStore.removeAsignacionAccion(accionistaId, accionId);
  }

  // Obtener acciones para la fila expandida
  function getAccionIdForRow(accionistaId: string, clase: string): string | null {
    const asignacion = asignacionAccionesStore.getAsignacionByAccionistaId(accionistaId);
    if (!asignacion) return null;

    const accion = asignacion.acciones.find((a) => a.tipoAccion === clase);
    return accion?.id || null;
  }

  // Obtener acciones para el dropdown de una fila específica
  function getActionsForRow(accionistaId: string) {
    return [
      {
        label: "Editar",
        icon: "SquarePen",
        onClick: (accionId: string) => {
          if (accionId) handleEdit(accionistaId, accionId);
        },
      },
      {
        label: "Eliminar",
        icon: "Trash2",
        onClick: (accionId: string) => {
          if (accionId) handleDelete(accionistaId, accionId);
        },
      },
    ];
  }
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow class="">
        <TableHead />
        <TableHead
          class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
        >
          Accionista
        </TableHead>
        <TableHead
          class="font-primary text-center text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
        >
          Tipos de acciones
        </TableHead>
        <TableHead
          class="font-primary text-center text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16"
        >
          Acciones Suscritas
        </TableHead>
        <TableHead
          class="font-primary text-center text-gray-800 dark:text-gray-700 t-t2 font-semibold h-16 max-w-32 wrap-break-word whitespace-normal"
        >
          % Porcentaje de Participación por clase
        </TableHead>
        <TableHead class="h-16" />
      </TableRow>
    </TableHeader>
    <TableBody>
      <template v-for="row in data" :key="row.id">
        <!-- Fila principal -->
        <TableRow>
          <TableCell>
            <BaseButton variant="ghost" @click="toggleRow(row.id)">
              <component
                :is="expanded.includes(row.id) ? ChevronUp : ChevronDown"
                class="w-5 h-5"
              />
            </BaseButton>
          </TableCell>
          <TableCell
            class="font-secondary text-gray-700 dark:text-gray-900 t-t2 font-medium h-16"
          >
            {{ row.accionista }}
          </TableCell>
          <TableCell
            class="font-secondary text-gray-700 text-center dark:text-gray-900 t-t2 font-bold h-16"
          >
            {{ row.tipos }}
          </TableCell>
          <TableCell
            class="font-secondary text-gray-700 text-center dark:text-gray-900 t-t2 font-medium h-16"
          >
            {{ getQuantityShares(row.acciones) }}
          </TableCell>
          <TableCell
            class="font-secondary text-gray-700 text-center dark:text-gray-900 t-t2 font-medium h-16"
          >
            {{ getPercentage(row.acciones) }}%
          </TableCell>
          <TableCell>
            <ActionButton
              variant="secondary"
              size="sm"
              label="Asignar"
              icon="Plus"
              @click="openModal(row.id)"
            />
          </TableCell>
        </TableRow>
        <!-- Filas hijas (acciones) -->
        <template v-if="expanded.includes(row.id)">
          <TableRow v-for="accion in row.acciones" :key="accion.clase">
            <TableCell />
            <TableCell />
            <TableCell
              class="font-secondary text-gray-600 text-center dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ accion.clase }}
            </TableCell>
            <TableCell
              class="font-secondary text-gray-600 text-center dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ accion.acciones }}
            </TableCell>
            <TableCell
              class="font-secondary text-gray-600 text-center dark:text-gray-900 t-t2 font-medium h-16"
            >
              {{ accion.porcentaje }}%
            </TableCell>
            <!-- Celda de acciones -->
            <TableCell class="w-12">
              <DataTableDropDown
                :item-id="getAccionIdForRow(row.id, accion.clase) || ''"
                :title-menu="props.titleMenu"
                :actions="getActionsForRow(row.id)"
              />
            </TableCell>
          </TableRow>
        </template>
      </template>
    </TableBody>
  </Table>

  <AsignarAccionesModal
    v-model="isModalOpen"
    :mode="modalMode"
    :accionista-id="selectedAccionistaId"
    :accion-id="selectedAccionId"
    @close="closeModal"
    @submit="closeModal"
  />
</template>
