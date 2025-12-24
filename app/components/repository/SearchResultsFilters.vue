<script setup lang="ts">
import { ref } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, FileText, Filter } from "lucide-vue-next";

interface Props {
  searchType: "semantic" | "match";
  modelValue: {
    mimeType?: string;
    order?: "name" | "createdAt";
    sort?: "asc" | "desc";
    updatedFrom?: string;
    updatedTo?: string;
  };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: Props["modelValue"]];
}>();

const localFilters = ref<Props["modelValue"]>({ ...props.modelValue });

const updateFilter = (key: keyof Props["modelValue"], value: any) => {
  localFilters.value = {
    ...localFilters.value,
    [key]: value,
  };
  emit("update:modelValue", localFilters.value);
};

const clearFilters = () => {
  localFilters.value = {};
  emit("update:modelValue", {});
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Filter class="w-4 h-4 text-gray-600" />
        <span class="text-sm font-semibold text-gray-900">Filtros de búsqueda</span>
      </div>
      <Button variant="ghost" size="sm" @click="clearFilters">
        Limpiar
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Tipo de archivo (MIME Type) -->
      <div class="space-y-2">
        <Label for="mimeType" class="text-xs">Tipo de archivo</Label>
        <Select
          :model-value="localFilters.mimeType"
          @update:model-value="(val) => updateFilter('mimeType', val)"
        >
          <SelectTrigger id="mimeType">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="application/pdf">PDF</SelectItem>
            <SelectItem value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
              Word
            </SelectItem>
            <SelectItem value="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
              Excel
            </SelectItem>
            <SelectItem value="application/vnd.openxmlformats-officedocument.presentationml.presentation">
              PowerPoint
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Ordenar por -->
      <div class="space-y-2">
        <Label for="order" class="text-xs">Ordenar por</Label>
        <Select
          :model-value="localFilters.order || 'createdAt'"
          @update:model-value="(val) => updateFilter('order', val)"
        >
          <SelectTrigger id="order">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nombre</SelectItem>
            <SelectItem value="createdAt">Fecha de creación</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Dirección de orden -->
      <div class="space-y-2">
        <Label for="sort" class="text-xs">Dirección</Label>
        <Select
          :model-value="localFilters.sort || 'desc'"
          @update:model-value="(val) => updateFilter('sort', val)"
        >
          <SelectTrigger id="sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascendente</SelectItem>
            <SelectItem value="desc">Descendente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <!-- Rango de fechas (solo para búsqueda por coincidencia) -->
      <div v-if="searchType === 'match'" class="space-y-2">
        <Label for="dateRange" class="text-xs">Rango de fechas</Label>
        <div class="flex gap-2">
          <Input
            id="updatedFrom"
            type="date"
            :value="localFilters.updatedFrom"
            @update:model-value="(val) => updateFilter('updatedFrom', val)"
            placeholder="Desde"
            class="text-xs"
          />
          <Input
            id="updatedTo"
            type="date"
            :value="localFilters.updatedTo"
            @update:model-value="(val) => updateFilter('updatedTo', val)"
            placeholder="Hasta"
            class="text-xs"
          />
        </div>
      </div>
    </div>
  </div>
</template>


