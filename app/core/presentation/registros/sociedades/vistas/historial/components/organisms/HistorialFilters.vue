<template>
  <div class="flex items-center gap-4 flex-wrap">
    <!-- Buscador -->
    <div class="flex-1 min-w-[280px]">
      <SearchBar
        :model-value="searchQuery"
        placeholder="Buscar sociedades..."
        @update:model-value="$emit('update:search-query', $event)"
      />
    </div>

    <!-- Filtro Tipo -->
    <div class="w-48">
      <Select
        :model-value="selectedTipo"
        @update:model-value="$emit('update:selected-tipo', $event)"
      >
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Todos los tipos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          <SelectItem
            v-for="tipo in tiposDisponibles"
            :key="tipo"
            :value="tipo"
          >
            {{ tipo }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Filtro Estado -->
    <div class="w-48">
      <Select
        :model-value="selectedEstado"
        @update:model-value="$emit('update:selected-estado', $event)"
      >
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Todos los estados" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="completado">Completado</SelectItem>
          <SelectItem value="pendiente">Pendiente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchBar from "~/core/presentation/shared/components/molecules/SearchBar.vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  searchQuery: string;
  selectedTipo: string;
  selectedEstado: string;
  tiposDisponibles: string[];
}

withDefaults(defineProps<Props>(), {
  searchQuery: "",
  selectedTipo: "all",
  selectedEstado: "all",
  tiposDisponibles: () => [],
});

defineEmits<{
  "update:search-query": [value: string];
  "update:selected-tipo": [value: string];
  "update:selected-estado": [value: string];
}>();
</script>

