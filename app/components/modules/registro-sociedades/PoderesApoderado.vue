<script setup lang="ts">
  import { ref } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";

  interface PoderRow {
    id: string;
    tipo_poder: string;
    vigencia?: string;
    reglas_firma?: string;
    descripcion?: string;
  }

  interface Props {
    apoderadoTitle: string;
    columns?: TableColumn<PoderRow>[];
    data?: PoderRow[];
    actions?: {
      label: string;
      icon?: string;
      separatorLine?: boolean;
      onClick: (id: string) => void;
    }[];
  }

  const props = withDefaults(defineProps<Props>(), {
    columns: () => [
      { key: "tipo_poder", label: "Tipo de Poder", type: "text" },
      { key: "vigencia", label: "Vigencia", type: "text" },
      { key: "reglas_firma", label: "Reglas de Firma", type: "text" },
    ],
    data: () => [],
    actions: () => [
      {
        label: "Editar",
        icon: "SquarePen",
        onClick: (id: string) => {
          console.log("Editar", id);
        },
      },
      {
        label: "Eliminar",
        icon: "Trash2",
        onClick: (id: string) => {
          console.log("Eliminar", id);
        },
      },
    ],
  });

  const emit = defineEmits<{
    (e: "add-power"): void;
  }>();

  const columnsComputed = getColumns(props.columns);

  const isExpanded = ref(false);

  const toggleTable = () => {
    isExpanded.value = !isExpanded.value;
  };

  const handleAddPower = () => {
    emit("add-power");
  };
</script>

<template>
  <div>
    <CardTitle :title="apoderadoTitle" body="">
      <template #preActions>
        <img
          src="/_nuxt/assets/icons/display-arrow.svg"
          alt="Expandir"
          class="w-3.5 h-3.5 mr-2 cursor-pointer transition-transform duration-200"
          :style="{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }"
          @click="toggleTable"
        />
      </template>
      <template #actions>
        <ActionButton
          variant="secondary"
          label="Agregar tipo de Poder"
          size="lg"
          icon="Plus"
          @click="handleAddPower"
        />
      </template>
    </CardTitle>

    <div v-show="isExpanded">
      <SimpleTable
        :columns="columnsComputed"
        :data="data"
        title-menu="Actions"
        :actions="actions"
      />
    </div>
  </div>
</template>
