<script setup lang="ts">
import { computed } from "vue";
import CheckboxTable from "~/components/base/tables/checkbox-table/CheckboxTable.vue";
import type { TableColumn } from "~/components/base/tables/getColumns";
import { getColumns } from "~/components/base/tables/getColumns";
import type { DirectoresTableRow } from "../../composables/useRemocionDirectoresPage";

interface Props {
  directores: DirectoresTableRow[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:checked-items", value: boolean): void;
}>();

// Filtrar solo directores titulares
const directoresTitulares = computed(() => {
  return props.directores.filter((d) => d.rol_director === "TITULAR");
});

const directoresHeaders: TableColumn<DirectoresTableRow>[] = [
  { key: "rol_director", label: "Rol Director", type: "text" },
  { key: "nombre", label: "Nombre / Razón Social", type: "text" },
  { key: "tipo_documento", label: "Tipo de Documento", type: "text" },
  { key: "numero_documento", label: "Nº de Documento", type: "text" },
];

const columns = computed(() => getColumns(directoresHeaders));

function handleUpdateCheckedItems(checkedItems: boolean) {
  emit("update:checked-items", checkedItems);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <h3 class="t-h5 font-semibold font-secondary text-gray-800">Directores Titulares</h3>
      <p class="t-b2 text-gray-600 font-secondary">
        Identifica a los directores titulares cuya remoción será evaluada.
      </p>
    </div>
    <CheckboxTable
      :columns="columns"
      :data="directoresTitulares"
      @update:checked-items="handleUpdateCheckedItems"
    />
  </div>
</template>

