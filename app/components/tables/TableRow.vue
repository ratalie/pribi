<script setup lang="ts">
  import type {
    TableConfig,
    TableCellRenderer,
    TableAction,
  } from "~/types/tables/table-config";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  import { MoreVertical } from "lucide-vue-next";
  import { computed } from "vue";
  import { getIcon } from "~/utils/iconMapper";

  interface Props {
    config: TableConfig;
    rowData: any;
    cellRenderers?: TableCellRenderer[];
    actions?: TableAction[];
    rowClass?: string;
    isLast?: boolean;
    /** Color de texto de la fila: 'text-layout-gray-700' o 'text-layout-gray-800' */
    textColor?: "text-layout-gray-700" | "text-layout-gray-800";
  }

  const props = withDefaults(defineProps<Props>(), {
    textColor: "text-layout-gray-800",
  });

  const hasActions = computed(() => props.actions && props.actions.length > 0);

  const getCellContent = (column: any) => {
    // Buscar renderizador personalizado
    if (props.cellRenderers) {
      const renderer = props.cellRenderers.find((r) => r.columnKey === column.key);
      if (renderer) {
        return renderer.render(props.rowData, column);
      }
    }

    // Renderizado por defecto: buscar el valor en rowData
    return props.rowData[column.key] ?? "—";
  };

  const handleAction = async (action: TableAction) => {
    if (action.disabled) return;
    await action.handler(props.rowData);
  };
</script>

<template>
  <div
    :class="[
      props.config.gridClass,
      'items-center border-b transition-colors',
      props.isLast ? 'border-gray-300' : 'border-gray-200',
      'py-5 text-sm font-secondary pr-16 gap-2',
      props.textColor,
      props.rowClass,
      'hover:bg-[#f1eeff] cursor-pointer',
    ]"
    style="font-size: 12.8px; color: #2e293d"
  >
    <div
      v-for="column in props.config.columns"
      :key="column.id"
      :class="[
        'text-start',
        column.align === 'center' ? 'text-center' : '',
        column.align === 'right' ? 'text-end' : '',
        column.class,
        // Si es la columna de opciones y hay acciones, mostrar dropdown
        (column.key === 'options' || column.key === 'edit-remove') && hasActions
          ? 'flex justify-end'
          : '',
      ]"
    >
      <!-- Si es columna de opciones y hay acciones, mostrar dropdown -->
      <template
        v-if="(column.key === 'options' || column.key === 'edit-remove') && hasActions"
      >
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="sm"
              class="h-8 w-8 p-0 text-gray-700 hover:bg-gray-100"
            >
              <MoreVertical class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-48">
            <DropdownMenuItem
              v-for="action in props.actions"
              :key="action.id"
              :class="[
                'cursor-pointer gap-2',
                action.destructive ? 'text-red-500 hover:text-red-600' : '',
                action.disabled ? 'opacity-50 cursor-not-allowed' : '',
              ]"
              :disabled="action.disabled"
              @click="handleAction(action)"
            >
              <component
                v-if="action.icon"
                :is="getIcon(action.icon) || 'span'"
                class="h-3.5 w-3.5"
              />
              {{ action.label }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
      <!-- Renderizado normal de la celda -->
      <template v-else>
        <slot :name="`cell-${column.key}`" :rowData="rowData" :column="column">
          {{ getCellContent(column) }}
        </slot>
      </template>
    </div>
  </div>
</template>
