<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";
import { storeToRefs } from "pinia";

interface Props {
  modelValue: string;
  currentScope?: "dashboard" | "societarios" | "generados" | "personalizadas";
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currentScope: "dashboard",
  placeholder: "Buscar en todo el repositorio...",
});

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "search", query: string): void;
}>();

const router = useRouter();
const dashboardStore = useRepositorioDashboardStore();
const { sociedadSeleccionada } = storeToRefs(dashboardStore);

const searchValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emits("update:modelValue", value),
});

const handleSearch = () => {
  if (!searchValue.value.trim()) return;
  
  // Si hay sociedad seleccionada, navegar a la página de resultados
  if (sociedadSeleccionada.value?.id) {
    router.push({
      path: "/storage/busqueda",
      query: {
        q: searchValue.value.trim(),
      },
    });
  } else {
    // Si no hay sociedad, emitir evento para que el componente padre maneje
    emits("search", searchValue.value.trim());
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    handleSearch();
  }
};
</script>

<template>
  <div class="relative">
    <Search
      class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
      :style="{ color: 'var(--text-muted)' }"
    />
    <input
      v-model="searchValue"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-12 pr-4 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 transition-all"
      :style="{
        borderColor: 'var(--border-light)',
        fontFamily: 'var(--font-secondary)',
      }"
      @focus="
        ($event.target as HTMLInputElement).style.borderColor = 'var(--primary-700)';
      "
      @blur="
        ($event.target as HTMLInputElement).style.borderColor = 'var(--border-light)';
      "
      @keyup.enter="handleSearch"
    />
  </div>
</template>

