<script setup lang="ts">
  import { Button } from "@/components/ui/button";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

  import type { ApoderadoRow } from "../types";

  interface Props {
    items: ApoderadoRow[];
    isLoading?: boolean;
    readonly?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    isLoading: false,
    readonly: false,
  });

  const emit = defineEmits<{
    (e: "edit", id: string): void;
    (e: "remove", id: string): void;
  }>();

  const handleEdit = (id: string) => emit("edit", id);
  const handleRemove = (id: string) => emit("remove", id);
</script>

<template>
  <div class="overflow-hidden bg-white">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Apoderado</TableHead>
          <TableHead>Clase</TableHead>
          <TableHead>Documento</TableHead>
          <TableHead v-if="!readonly" class="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="isLoading">
          <TableCell :colspan="readonly ? 3 : 4" class="py-6 text-center text-slate-500">
            Cargando apoderados…
          </TableCell>
        </TableRow>
        <TableRow v-else-if="items.length === 0">
          <TableCell :colspan="readonly ? 3 : 4" class="py-6 text-center text-slate-500">
            Aún no registras apoderados.
          </TableCell>
        </TableRow>
        <TableRow
          v-for="item in items"
          :key="item.id"
          :class="[{ 'opacity-70': item.isPlaceholder, 'bg-slate-50': item.isPlaceholder }]"
        >
          <TableCell class="font-medium text-slate-900">
            {{ item.nombre }}
          </TableCell>
          <TableCell class="text-slate-600">{{ item.clase }}</TableCell>
          <TableCell class="text-slate-600">{{ item.documento }}</TableCell>
          <TableCell v-if="!readonly" class="text-right">
            <div class="flex justify-end gap-2">
              <Button variant="ghost" size="sm" @click="handleEdit(item.id)">
                {{ item.isPlaceholder ? "Completar" : "Editar" }}
              </Button>
              <Button
                v-if="!item.isPlaceholder"
                variant="ghost"
                size="sm"
                class="text-red-600"
                @click="handleRemove(item.id)"
              >
                Eliminar
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
