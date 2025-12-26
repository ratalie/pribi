<script setup lang="ts">
import { computed } from "vue";
import CheckboxTable from "~/components/base/tables/checkbox-table/CheckboxTable.vue";
import type { TableColumn } from "~/components/base/tables/getColumns";
import { getColumns } from "~/components/base/tables/getColumns";
import type { ApoderadosTableRow } from "../../composables/useRemocionApoderadosPage";

interface Props {
  apoderados: ApoderadosTableRow[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:checked-items", value: boolean): void;
}>();

const apoderadosHeaders: TableColumn<ApoderadosTableRow>[] = [
  { key: "clase_apoderado", label: "Clase de Apoderado", type: "text" },
  { key: "nombre", label: "Nombre / Razón Social", type: "text" },
  { key: "tipo_documento", label: "Tipo de Documento", type: "text" },
  { key: "numero_documento", label: "Nº de Documento", type: "text" },
];

const columns = computed(() => getColumns(apoderadosHeaders));

function handleUpdateCheckedItems(checkedItems: boolean) {
  emit("update:checked-items", checkedItems);
}
</script>

<template>
  <div class="flex flex-col gap-10">
    <CheckboxTable
      :columns="columns"
      :data="apoderados"
      @update:checked-items="handleUpdateCheckedItems"
    />
  </div>
</template>



