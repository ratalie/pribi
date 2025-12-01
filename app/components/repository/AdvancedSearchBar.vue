<script setup lang="ts">
import {
  Search,
  SlidersHorizontal,
  Filter,
  X,
  Calendar,
  FileText,
  Tag,
  Building2,
  Globe,
  Lock,
  Check,
} from "lucide-vue-next";
import type { SearchScope, AdvancedFilters } from "./types";

interface Props {
  modelValue: string;
  currentScope?: SearchScope;
  filters?: AdvancedFilters;
  placeholder?: string;
  showScopeInPlaceholder?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currentScope: "dashboard",
  placeholder: "Buscar en todo el repositorio...",
  showScopeInPlaceholder: false,
  filters: () => ({ scope: "dashboard" }),
});

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "update:filters", filters: AdvancedFilters): void;
}>();

const searchValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emits("update:modelValue", value),
});

const showFilters = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);

// Estado local de filtros
const localFilters = ref<AdvancedFilters>({
  ...props.filters,
  scope: props.currentScope,
});

// Sincronizar filtros externos
watch(
  () => props.filters,
  (newFilters) => {
    if (newFilters) {
      localFilters.value = { ...newFilters };
    }
  },
  { deep: true }
);

// Click fuera para cerrar
const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node) &&
    buttonRef.value &&
    !buttonRef.value.contains(event.target as Node)
  ) {
    showFilters.value = false;
  }
};

watch(showFilters, (isOpen) => {
  if (isOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

// Contador de filtros activos
const activeFiltersCount = computed(() => {
  let count = 0;
  if (localFilters.value.fileTypes && localFilters.value.fileTypes.length > 0)
    count += localFilters.value.fileTypes.length;
  if (
    localFilters.value.categories &&
    localFilters.value.categories.length > 0
  )
    count += localFilters.value.categories.length;
  if (localFilters.value.status && localFilters.value.status.length > 0)
    count += localFilters.value.status.length;
  if (localFilters.value.dateModified) count += 1;
  if (
    localFilters.value.privacy &&
    localFilters.value.privacy !== "all"
  )
    count += 1;
  return count;
});

// Opciones de filtros
const fileTypeOptions = [
  { id: "pdf", label: "PDF", color: "#DC2626" },
  { id: "docx", label: "Word", color: "#2563EB" },
  { id: "xlsx", label: "Excel", color: "#16A34A" },
  { id: "pptx", label: "PowerPoint", color: "#EA580C" },
  { id: "img", label: "Imágenes", color: "#8B5CF6" },
];

const categoryOptions = [
  { id: "acciones", label: "Acciones" },
  { id: "acuerdos", label: "Acuerdos" },
  { id: "actas", label: "Actas" },
  { id: "poderes", label: "Poderes" },
  { id: "registros", label: "Registros" },
  { id: "juntas", label: "Juntas" },
];

const statusOptions = [
  { id: "PENDIENTE", label: "Pendiente", color: "#F59E0B" },
  { id: "EN_PROCESO", label: "En Proceso", color: "#3B82F6" },
  { id: "FINALIZADO", label: "Finalizado", color: "#10B981" },
];

const dateModifiedOptions = [
  { id: "today", label: "Hoy" },
  { id: "week", label: "Esta semana" },
  { id: "month", label: "Este mes" },
  { id: "year", label: "Este año" },
  { id: "custom", label: "Personalizado" },
];

const scopeOptions: { id: SearchScope; label: string }[] = [
  { id: "all", label: "Todo" },
  { id: "societarios", label: "Societarios" },
  { id: "generados", label: "Generados" },
  { id: "personalizadas", label: "Personalizadas" },
  { id: "historial", label: "Historial" },
];

// Funciones helper
const updateFilter = <K extends keyof AdvancedFilters>(
  key: K,
  value: AdvancedFilters[K]
) => {
  localFilters.value = { ...localFilters.value, [key]: value };
  emits("update:filters", { ...localFilters.value });
};

const toggleArrayFilter = <K extends keyof AdvancedFilters>(
  key: K,
  value: string
) => {
  const currentArray =
    (localFilters.value[key] as string[] | undefined) || [];
  const newArray = currentArray.includes(value)
    ? currentArray.filter((item) => item !== value)
    : [...currentArray, value];
  updateFilter(key, newArray as AdvancedFilters[K]);
};

const clearFilters = () => {
  const clearedFilters: AdvancedFilters = { scope: props.currentScope };
  localFilters.value = clearedFilters;
  emits("update:filters", clearedFilters);
};

// Placeholder dinámico
const computedPlaceholder = computed(() => {
  if (props.showScopeInPlaceholder) {
    const scopeLabel =
      scopeOptions.find((s) => s.id === props.currentScope)?.label ||
      "repositorio";
    return `Buscar en ${scopeLabel.toLowerCase()}...`;
  }
  return props.placeholder;
});
</script>

<template>
  <div class="relative">
    <!-- Input de búsqueda -->
    <div class="relative">
      <Search
        class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
        :style="{ color: 'var(--text-muted)' }"
      />
      <input
        v-model="searchValue"
        type="text"
        :placeholder="computedPlaceholder"
        class="w-full pl-12 pr-24 py-3 bg-white rounded-xl border focus:outline-none focus:ring-2 transition-all"
        :style="{
          borderColor: 'var(--border-light)',
          fontFamily: 'var(--font-secondary)',
        }"
        @focus="
          ($event.target as HTMLInputElement).style.borderColor =
            'var(--primary-700)';
          ($event.target as HTMLInputElement).style.ringColor =
            'var(--primary-700)';
        "
        @blur="
          ($event.target as HTMLInputElement).style.borderColor =
            'var(--border-light)';
        "
      />

      <!-- Botones de acción -->
      <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        <!-- Contador de filtros activos -->
        <div
          v-if="activeFiltersCount > 0"
          class="flex items-center gap-1 px-2 py-1 rounded-md"
          style="background-color: #F3F4F6; color: var(--primary-700)"
        >
          <Filter class="w-3 h-3" />
          <span class="text-xs font-medium">{{ activeFiltersCount }}</span>
        </div>

        <!-- Botón de filtros -->
        <button
          ref="buttonRef"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          :style="{
            color: showFilters ? 'var(--primary-700)' : 'var(--text-muted)',
          }"
          @click="showFilters = !showFilters"
        >
          <SlidersHorizontal class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Panel de filtros flotante -->
    <Transition name="fade">
      <div
        v-if="showFilters"
        ref="dropdownRef"
        class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border shadow-2xl z-[9999] overflow-hidden"
        :style="{
          borderColor: 'var(--border-light)',
          maxHeight: '80vh',
          overflowY: 'auto',
        }"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between px-6 py-4 border-b"
          :style="{ borderColor: 'var(--border-light)' }"
        >
          <div class="flex items-center gap-2">
            <SlidersHorizontal
              class="w-5 h-5"
              :style="{ color: 'var(--primary-700)' }"
            />
            <h3
              class="text-lg"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              Filtros Avanzados
            </h3>
          </div>
          <button
            class="text-sm hover:underline"
            :style="{
              color: 'var(--primary-700)',
              fontFamily: 'var(--font-secondary)',
            }"
            @click="clearFilters"
          >
            Limpiar todo
          </button>
        </div>

        <!-- Contenido de filtros -->
        <div class="px-6 py-4 space-y-6">
          <!-- Buscar en (Scope) -->
          <div>
            <label
              class="block text-sm mb-3"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 500,
              }"
            >
              <Search class="w-4 h-4 inline mr-2" />
              Buscar en
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in scopeOptions"
                :key="option.id"
                class="px-4 py-2 rounded-lg border transition-all text-sm"
                :style="{
                  backgroundColor:
                    localFilters.scope === option.id
                      ? 'var(--primary-700)'
                      : '#FFFFFF',
                  color:
                    localFilters.scope === option.id
                      ? '#FFFFFF'
                      : 'var(--text-primary)',
                  borderColor:
                    localFilters.scope === option.id
                      ? 'var(--primary-700)'
                      : 'var(--border-light)',
                  fontFamily: 'var(--font-secondary)',
                }"
                @click="updateFilter('scope', option.id)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Tipo de archivo -->
          <div>
            <label
              class="block text-sm mb-3"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 500,
              }"
            >
              <FileText class="w-4 h-4 inline mr-2" />
              Tipo de archivo
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in fileTypeOptions"
                :key="option.id"
                class="px-4 py-2 rounded-lg border transition-all text-sm flex items-center gap-2"
                :style="{
                  backgroundColor: localFilters.fileTypes?.includes(option.id)
                    ? `${option.color}15`
                    : '#FFFFFF',
                  borderColor: localFilters.fileTypes?.includes(option.id)
                    ? option.color
                    : 'var(--border-light)',
                  color: localFilters.fileTypes?.includes(option.id)
                    ? option.color
                    : 'var(--text-primary)',
                  fontFamily: 'var(--font-secondary)',
                }"
                @click="toggleArrayFilter('fileTypes', option.id)"
              >
                <Check
                  v-if="localFilters.fileTypes?.includes(option.id)"
                  class="w-4 h-4"
                />
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Categorías -->
          <div>
            <label
              class="block text-sm mb-3"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 500,
              }"
            >
              <Tag class="w-4 h-4 inline mr-2" />
              Categorías
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in categoryOptions"
                :key="option.id"
                class="px-4 py-2 rounded-lg border transition-all text-sm flex items-center gap-2"
                :style="{
                  backgroundColor: localFilters.categories?.includes(option.id)
                    ? 'var(--primary-700)'
                    : '#FFFFFF',
                  borderColor: localFilters.categories?.includes(option.id)
                    ? 'var(--primary-700)'
                    : 'var(--border-light)',
                  color: localFilters.categories?.includes(option.id)
                    ? '#FFFFFF'
                    : 'var(--text-primary)',
                  fontFamily: 'var(--font-secondary)',
                }"
                @click="toggleArrayFilter('categories', option.id)"
              >
                <Check
                  v-if="localFilters.categories?.includes(option.id)"
                  class="w-4 h-4"
                />
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Fecha de modificación -->
          <div>
            <label
              class="block text-sm mb-3"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 500,
              }"
            >
              <Calendar class="w-4 h-4 inline mr-2" />
              Fecha de modificación
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in dateModifiedOptions"
                :key="option.id"
                class="px-4 py-2 rounded-lg border transition-all text-sm"
                :style="{
                  backgroundColor:
                    localFilters.dateModified === option.id
                      ? 'var(--primary-700)'
                      : '#FFFFFF',
                  borderColor:
                    localFilters.dateModified === option.id
                      ? 'var(--primary-700)'
                      : 'var(--border-light)',
                  color:
                    localFilters.dateModified === option.id
                      ? '#FFFFFF'
                      : 'var(--text-primary)',
                  fontFamily: 'var(--font-secondary)',
                }"
                @click="
                  updateFilter(
                    'dateModified',
                    localFilters.dateModified === option.id
                      ? undefined
                      : (option.id as any)
                  )
                "
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Estado (solo para historial) -->
          <div v-if="currentScope === 'historial'">
            <label
              class="block text-sm mb-3"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 500,
              }"
            >
              <Tag class="w-4 h-4 inline mr-2" />
              Estado
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in statusOptions"
                :key="option.id"
                class="px-4 py-2 rounded-lg border transition-all text-sm flex items-center gap-2"
                :style="{
                  backgroundColor: localFilters.status?.includes(option.id)
                    ? `${option.color}15`
                    : '#FFFFFF',
                  borderColor: localFilters.status?.includes(option.id)
                    ? option.color
                    : 'var(--border-light)',
                  color: localFilters.status?.includes(option.id)
                    ? option.color
                    : 'var(--text-primary)',
                  fontFamily: 'var(--font-secondary)',
                }"
                @click="toggleArrayFilter('status', option.id)"
              >
                <Check
                  v-if="localFilters.status?.includes(option.id)"
                  class="w-4 h-4"
                />
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Privacidad (solo para carpetas personalizadas) -->
          <div v-if="currentScope === 'personalizadas'">
            <label
              class="block text-sm mb-3"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 500,
              }"
            >
              <Globe class="w-4 h-4 inline mr-2" />
              Privacidad
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                class="px-4 py-2 rounded-lg border transition-all text-sm flex items-center gap-2"
                :style="{
                  backgroundColor:
                    localFilters.privacy === 'all' || !localFilters.privacy
                      ? 'var(--primary-700)'
                      : '#FFFFFF',
                  borderColor:
                    localFilters.privacy === 'all' || !localFilters.privacy
                      ? 'var(--primary-700)'
                      : 'var(--border-light)',
                  color:
                    localFilters.privacy === 'all' || !localFilters.privacy
                      ? '#FFFFFF'
                      : 'var(--text-primary)',
                  fontFamily: 'var(--font-secondary)',
                }"
                @click="updateFilter('privacy', 'all')"
              >
                Todas
              </button>
              <button
                class="px-4 py-2 rounded-lg border transition-all text-sm flex items-center gap-2"
                :style="{
                  backgroundColor: localFilters.privacy === 'public'
                    ? '#10B98115'
                    : '#FFFFFF',
                  borderColor: localFilters.privacy === 'public'
                    ? '#10B981'
                    : 'var(--border-light)',
                  color: localFilters.privacy === 'public'
                    ? '#10B981'
                    : 'var(--text-primary)',
                  fontFamily: 'var(--font-secondary)',
                }"
                @click="updateFilter('privacy', 'public')"
              >
                <Globe class="w-4 h-4" />
                Públicas
              </button>
              <button
                class="px-4 py-2 rounded-lg border transition-all text-sm flex items-center gap-2"
                :style="{
                  backgroundColor: localFilters.privacy === 'private'
                    ? '#F59E0B15'
                    : '#FFFFFF',
                  borderColor: localFilters.privacy === 'private'
                    ? '#F59E0B'
                    : 'var(--border-light)',
                  color: localFilters.privacy === 'private'
                    ? '#F59E0B'
                    : 'var(--text-primary)',
                  fontFamily: 'var(--font-secondary)',
                }"
                @click="updateFilter('privacy', 'private')"
              >
                <Lock class="w-4 h-4" />
                Privadas
              </button>
            </div>
          </div>
        </div>

        <!-- Footer con resumen de filtros activos -->
        <div
          v-if="activeFiltersCount > 0"
          class="px-6 py-4 border-t bg-gray-50"
          :style="{ borderColor: 'var(--border-light)' }"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 flex-wrap">
              <span
                class="text-sm"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                Filtros activos:
              </span>
              <template
                v-for="type in localFilters.fileTypes"
                :key="`file-${type}`"
              >
                <span
                  class="px-2 py-1 rounded-md text-xs"
                  :style="{
                    backgroundColor: '#F3F4F6',
                    color: 'var(--primary-700)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  {{
                    fileTypeOptions.find((o) => o.id === type)?.label || type
                  }}
                </span>
              </template>
              <template
                v-for="cat in localFilters.categories"
                :key="`cat-${cat}`"
              >
                <span
                  class="px-2 py-1 rounded-md text-xs"
                  :style="{
                    backgroundColor: '#F3F4F6',
                    color: 'var(--primary-700)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  {{
                    categoryOptions.find((o) => o.id === cat)?.label || cat
                  }}
                </span>
              </template>
              <template
                v-for="status in localFilters.status"
                :key="`status-${status}`"
              >
                <span
                  class="px-2 py-1 rounded-md text-xs"
                  :style="{
                    backgroundColor: '#F3F4F6',
                    color: 'var(--primary-700)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  {{
                    statusOptions.find((o) => o.id === status)?.label || status
                  }}
                </span>
              </template>
              <span
                v-if="localFilters.dateModified"
                class="px-2 py-1 rounded-md text-xs"
                :style="{
                  backgroundColor: '#F3F4F6',
                  color: 'var(--primary-700)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                {{
                  dateModifiedOptions.find(
                    (o) => o.id === localFilters.dateModified
                  )?.label || localFilters.dateModified
                }}
              </span>
            </div>
            <button
              class="px-4 py-2 rounded-lg transition-all text-sm"
              :style="{
                backgroundColor: 'var(--primary-700)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 500,
              }"
              @click="showFilters = false"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

