<script setup lang="ts">
  import { ChevronDown, ChevronRight, X } from "lucide-vue-next";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import DataTableDropDown from "~/components/base/tables/DataTableDropDown.vue";
  import Table from "~/components/ui/table/Table.vue";
  import TableBody from "~/components/ui/table/TableBody.vue";
  import TableCell from "~/components/ui/table/TableCell.vue";
  import TableHead from "~/components/ui/table/TableHead.vue";
  import TableHeader from "~/components/ui/table/TableHeader.vue";
  import TableRow from "~/components/ui/table/TableRow.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import type { ApoderadoFacultadRow } from "../types/apoderadosFacultades";

  interface Props {
    apoderadoItem: ApoderadoFacultadRow;
    actions?: {
      label: string;
      icon?: string;
      onClick: (idFacultad: string, idApoderado: string) => void;
    }[];
    mode: EntityModeEnum;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    (e: "openModal", apoderadoId: string): void;
  }>();

  const isApoderadoExpanded = ref(false);
  const expandedFacultades = ref<Set<string>>(new Set());

  const toggleApoderado = () => {
    isApoderadoExpanded.value = !isApoderadoExpanded.value;
  };

  const toggleFacultad = (id: string) => {
    if (expandedFacultades.value.has(id)) {
      expandedFacultades.value.delete(id);
    } else {
      expandedFacultades.value.add(id);
    }
  };

  const optionsActions = computed(() => [
    {
      label: "Ver",
      icon: "TextAlignJustify",
      onClick: (id: string) => {
        toggleFacultad(id);
      },
    },
    ...(props.actions ?? []).map((action) => ({
      ...action,
      onClick: (idFacultad: string) => {
        action.onClick(idFacultad, props.apoderadoItem.id);
      },
    })),
  ]);
</script>

<template>
  <div>
    <div class="flex items-center h-16 border-b border-gray-200 dark:border-gray-800">
      <BaseButton variant="ghost" class="w-16 h-16" @click="toggleApoderado">
        <component
          :is="!isApoderadoExpanded ? ChevronRight : ChevronDown"
          class="w-5 h-5 transition-transform"
        />
      </BaseButton>
      <div class="flex-1 flex items-center px-8">
        <p class="t-h6 font-primary font-semibold text-gray-900 dark:text-gray-900">
          {{ apoderadoItem.nombre }}
        </p>
      </div>

      <ActionButton
        v-if="mode !== EntityModeEnum.RESUMEN"
        variant="secondary"
        label="Agregar Facultad"
        size="lg"
        icon="Plus"
        @click="() => emit('openModal', apoderadoItem.id)"
      />
    </div>

    <div v-if="isApoderadoExpanded" class="overflow-x-auto">
      <div class="min-w-max px-12">
        <Table class="shrink-0">
          <TableHeader>
            <TableRow class="h-12">
              <TableHead
                class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold"
              >
                Tipo de Facultad
              </TableHead>
              <TableHead
                class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold"
              >
                Vigencia
              </TableHead>
              <TableHead
                class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold"
              >
                Reglas Monetarias
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            <template v-for="facultad in apoderadoItem.facultades" :key="facultad.id">
              <TableRow class="h-16">
                <TableCell
                  class="font-secondary text-gray-700 dark:text-gray-900 t-t2 font-medium"
                >
                  {{ facultad.facultad }}
                </TableCell>
                <TableCell
                  class="font-secondary text-gray-700 dark:text-gray-900 t-t2 font-medium"
                >
                  {{ facultad.vigencia }}
                </TableCell>
                <TableCell
                  class="font-secondary text-gray-700 dark:text-gray-900 t-t2 font-medium"
                >
                  {{ facultad.reglas_firma }}
                </TableCell>
                <TableCell>
                  <DataTableDropDown :item-id="facultad.id" :actions="optionsActions" />
                </TableCell>
              </TableRow>

              <TableRow
                v-if="
                  expandedFacultades.has(facultad.id) &&
                  facultad.reglas_y_limites &&
                  facultad.reglas_y_limites.length > 0
                "
                class="border-x rounded-lg"
              >
                <TableCell :colspan="4" class="bg-gray-50 dark:bg-gray-800 py-1">
                  <div class="w-full flex items-center">
                    <div class="flex-1 text-center">
                      <p
                        class="font-primary text-primary-800 dark:text-primary-500 t-t1 font-semibold"
                      >
                        Detalles de la Facultad
                      </p>
                    </div>
                    <BaseButton
                      variant="ghost"
                      class="w-4 h-4"
                      @click="toggleFacultad(facultad.id)"
                    >
                      <component :is="X" class="w-4 h-4" />
                    </BaseButton>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow
                v-if="
                  expandedFacultades.has(facultad.id) &&
                  facultad.reglas_y_limites &&
                  facultad.reglas_y_limites.length > 0
                "
              >
                <TableCell :colspan="4" class="py-0 border-x border-b rounded-b-lg">
                  <Table>
                    <TableHeader class="border-b">
                      <TableRow class="h-8">
                        <TableHead
                          class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold"
                        >
                          ID
                        </TableHead>
                        <TableHead
                          class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold"
                        >
                          Desde
                        </TableHead>
                        <TableHead
                          class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold"
                        >
                          Hasta
                        </TableHead>
                        <TableHead
                          class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold"
                        >
                          Tipo de Firma
                        </TableHead>
                        <TableHead
                          class="font-primary text-gray-800 dark:text-gray-700 t-t2 font-semibold"
                        >
                          Firmantes
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      <TableRow v-for="reglas in facultad.reglas_y_limites" :key="reglas.id">
                        <TableCell
                          class="font-secondary text-gray-700 dark:text-gray-900 t-t2 font-medium"
                        >
                          {{ reglas.table_id }}
                        </TableCell>
                        <TableCell
                          class="font-secondary text-gray-700 dark:text-gray-900 t-t2 font-medium"
                        >
                          {{ reglas.desde }}
                        </TableCell>
                        <TableCell
                          class="font-secondary text-gray-700 dark:text-gray-900 t-t2 font-medium"
                        >
                          {{ reglas.hasta }}
                        </TableCell>
                        <TableCell
                          class="font-secondary text-gray-700 dark:text-gray-900 t-t2 font-medium"
                        >
                          {{ reglas.tipo_firma }}
                        </TableCell>
                        <TableCell
                          class="flex flex-col gap-1 font-secondary text-gray-700 dark:text-gray-900 t-t2 font-medium"
                        >
                          <template v-if="reglas.firmantes && reglas.firmantes.length > 0">
                            <span v-for="firmante in reglas.firmantes" :key="firmante.id">
                              {{ firmante.cantidad }} {{ firmante.grupo }}
                            </span>
                          </template>
                          <span v-else>-</span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            </template>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
