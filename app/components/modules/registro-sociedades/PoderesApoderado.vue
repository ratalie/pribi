<script setup lang="ts">
  import { ChevronDown, ChevronRight } from "lucide-vue-next";
  import { computed, ref } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import ExpandableTable from "~/components/base/tables/ExpandableTable.vue";
  import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";

  interface DetailRow {
    desde: string;
    hasta: string;
    tipoFirma: string;
    firmantes: string;
  }

  interface PoderRow {
    id: string;
    tipo_poder: string;
    vigencia?: string;
    reglas_firma?: string;
    descripcion?: string;
    detalles?: string;
    detalleFilas?: DetailRow[];
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
    titleMenu?: string;
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
    titleMenu: undefined,
  });

  const emit = defineEmits<{
    (e: "add-power"): void;
  }>();

  const detailFallback: DetailRow[] = [
    {
      desde: "S/ 40.00",
      hasta: "S/ 90.00",
      tipoFirma: "A sola firma",
      firmantes: "No requiere otra firma",
    },
  ];

  const handleAddPower = () => {
    emit("add-power");
  };

  const tableExpanded = ref(true);
  const toggleTableExpanded = () => {
    tableExpanded.value = !tableExpanded.value;
  };

  const mainColumns = computed(() => getColumns<PoderRow>(props.columns));
</script>

<template>
  <div>
    <CardTitle :title="apoderadoTitle" body="">
      <template #preActions>
        <ChevronDown
          class="w-4 h-4 mr-2 cursor-pointer transition-transform duration-200"
          :class="tableExpanded ? 'rotate-0' : '-rotate-90'"
          @click="toggleTableExpanded"
        />
      </template>
      <template #actions>
        <ActionButton
          variant="secondary"
          label="Agregar poder"
          size="lg"
          icon="Plus"
          @click="handleAddPower"
        />
      </template>
    </CardTitle>

    <ExpandableTable
      v-show="tableExpanded"
      :columns="mainColumns"
      :data="data"
      :actions="actions"
      :title-menu="titleMenu"
      expand-label="Ver detalles"
      detail-column-label=""
    >
      <template #detail-trigger="{ toggle, expanded }">
        <button
          type="button"
          class="flex items-center gap-1 text-gray-700 font-secondary t-t2 hover:text-gray-900 transition-colors"
          @click="toggle"
        >
          Ver detalles
          <ChevronRight
            class="w-4 h-4 transition-transform"
            :class="expanded ? 'rotate-90' : ''"
          />
        </button>
      </template>

      <template #row-details="{ row }">
        <div class="flex flex-col">
          <div
            class="grid grid-cols-4 px-6 py-3 text-gray-600 font-primary text-xs uppercase tracking-wide border-b border-gray-300"
          >
            <span>Desde</span>
            <span>Hasta</span>
            <span>Tipo de Firma</span>
            <span>Firmantes requeridos</span>
          </div>
          <div
            v-for="(detail, index) in row.detalleFilas || detailFallback"
            :key="`${row.id}-detail-${index}`"
            class="grid grid-cols-4 px-6 py-4 text-gray-700 font-secondary t-t2 border-b border-gray-100 gap-3"
          >
            <span class="font-medium">{{ detail.desde }}</span>
            <span class="font-medium">{{ detail.hasta }}</span>
            <span>{{ detail.tipoFirma }}</span>
            <span class="whitespace-normal leading-relaxed">{{ detail.firmantes }}</span>
          </div>
        </div>
      </template>
    </ExpandableTable>
  </div>
</template>
