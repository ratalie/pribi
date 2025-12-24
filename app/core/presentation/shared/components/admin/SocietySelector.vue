<script setup lang="ts">
import { Search, Plus, X } from 'lucide-vue-next';
import Checkbox from '~/components/ui/checkbox/Checkbox.vue';
import type { SocietyInfo } from '~/core/hexag/panel-administrativo/domain/entities/society-assignment.entity';
import type { SocietiesConfig } from '~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types';

interface Props {
  modelValue: SocietiesConfig;
  societies: SocietyInfo[];
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  societies: () => [],
});

const emit = defineEmits<{
  'update:modelValue': [value: SocietiesConfig];
}>();

const config = computed({
  get: () => props.modelValue,
  set: (value: SocietiesConfig) => emit('update:modelValue', value),
});

const searchQuery = ref('');
const showSearch = ref(false);

const filteredSocieties = computed(() => {
  if (!searchQuery.value) {
    return props.societies;
  }
  const query = searchQuery.value.toLowerCase();
  return props.societies.filter(
    (society) =>
      society.name.toLowerCase().includes(query) ||
      society.ruc?.toLowerCase().includes(query),
  );
});

const selectedSocietiesList = computed(() => {
  return props.societies.filter((s) => config.value.ids.includes(s.id));
});

const toggleMode = (mode: 'all' | 'specific') => {
  if (props.disabled) return;
  config.value = {
    ...config.value,
    mode,
    ids: mode === 'all' ? [] : config.value.ids,
  };
};

const toggleSociety = (societyId: string) => {
  if (props.disabled || config.value.mode === 'all') return;

  const index = config.value.ids.indexOf(societyId);
  if (index === -1) {
    config.value = {
      ...config.value,
      ids: [...config.value.ids, societyId],
    };
  } else {
    config.value = {
      ...config.value,
      ids: config.value.ids.filter((id) => id !== societyId),
    };
  }
};

const isSocietySelected = (societyId: string): boolean => {
  return config.value.ids.includes(societyId);
};

const removeSociety = (societyId: string) => {
  if (props.disabled) return;
  config.value = {
    ...config.value,
    ids: config.value.ids.filter((id) => id !== societyId),
  };
};

const openSearch = () => {
  showSearch.value = true;
  searchQuery.value = '';
};
</script>

<template>
  <div class="society-selector">
    <label
      class="society-selector-label"
      :style="{
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-primary)',
        fontWeight: 600,
      }"
    >
      ¿Qué sociedades puede ver?
    </label>

    <div class="society-selector-options">
      <button
        type="button"
        class="society-option"
        :class="{
          'society-option-selected': config.mode === 'all',
          'society-option-disabled': disabled,
        }"
        :disabled="disabled"
        @click="toggleMode('all')"
      >
        <div
          class="society-option-radio"
          :class="{ 'society-option-radio-selected': config.mode === 'all' }"
        />
        <span
          class="society-option-label"
          :style="{
            color:
              config.mode === 'all'
                ? 'var(--text-primary)'
                : 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)',
          }"
        >
          Todas las sociedades
        </span>
      </button>

      <button
        type="button"
        class="society-option"
        :class="{
          'society-option-selected': config.mode === 'specific',
          'society-option-disabled': disabled,
        }"
        :disabled="disabled"
        @click="toggleMode('specific')"
      >
        <div
          class="society-option-radio"
          :class="{ 'society-option-radio-selected': config.mode === 'specific' }"
        />
        <span
          class="society-option-label"
          :style="{
            color:
              config.mode === 'specific'
                ? 'var(--text-primary)'
                : 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)',
          }"
        >
          Solo estas sociedades
        </span>
      </button>
    </div>

    <div v-if="config.mode === 'specific'" class="society-selector-specific">
      <!-- Sociedades seleccionadas -->
      <div v-if="selectedSocietiesList.length > 0" class="society-selected-list">
        <div
          v-for="society in selectedSocietiesList"
          :key="society.id"
          class="society-selected-item"
        >
          <div class="society-selected-info">
            <span
              class="society-selected-name"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
                fontWeight: 500,
              }"
            >
              {{ society.name }}
            </span>
            <span
              v-if="society.ruc"
              class="society-selected-ruc"
              :style="{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              RUC: {{ society.ruc }}
            </span>
          </div>
          <button
            type="button"
            class="society-selected-remove"
            :disabled="disabled"
            @click="removeSociety(society.id)"
          >
            <X class="society-remove-icon" />
          </button>
        </div>
      </div>

      <!-- Búsqueda y selección -->
      <div class="society-search-section">
        <button
          type="button"
          class="society-search-button"
          :style="{
            color: 'var(--primary-700)',
            fontFamily: 'var(--font-secondary)',
          }"
          :disabled="disabled"
          @click="openSearch"
        >
          <Plus class="society-search-icon" />
          <span>Agregar sociedades</span>
        </button>

        <div v-if="showSearch" class="society-search-modal">
          <div class="society-search-header">
            <div class="society-search-input-wrapper">
              <Search class="society-search-input-icon" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por nombre o RUC..."
                class="society-search-input"
                :style="{
                  fontFamily: 'var(--font-secondary)',
                }"
              />
            </div>
            <button
              type="button"
              class="society-search-close"
              @click="showSearch = false"
            >
              <X class="society-close-icon" />
            </button>
          </div>

          <div class="society-search-results">
            <div
              v-for="society in filteredSocieties"
              :key="society.id"
              class="society-search-item"
              :class="{
                'society-search-item-selected': isSocietySelected(society.id),
              }"
            >
              <Checkbox
                :checked="isSocietySelected(society.id)"
                :disabled="disabled"
                @update:checked="toggleSociety(society.id)"
              />
              <div class="society-search-item-info">
                <span
                  class="society-search-item-name"
                  :style="{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500,
                  }"
                >
                  {{ society.name }}
                </span>
                <span
                  v-if="society.ruc"
                  class="society-search-item-ruc"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  RUC: {{ society.ruc }}
                </span>
              </div>
            </div>

            <div
              v-if="filteredSocieties.length === 0"
              class="society-search-empty"
              :style="{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              No se encontraron sociedades
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.society-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.society-selector-label {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.society-selector-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.society-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 2px solid var(--border-light);
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.society-option:hover:not(.society-option-disabled) {
  border-color: var(--primary-500);
}

.society-option-selected {
  border-color: var(--primary-700);
  background: var(--primary-50);
}

.society-option-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.society-option-radio {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-light);
  border-radius: 50%;
  transition: all 0.2s;
}

.society-option-radio-selected {
  border-color: var(--primary-700);
  background: var(--primary-700);
  position: relative;
}

.society-option-radio-selected::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  background: white;
  border-radius: 50%;
}

.society-option-label {
  font-size: 0.875rem;
}

.society-selector-specific {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 0.5rem;
}

.society-selected-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.society-selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  background: var(--bg-muted);
}

.society-selected-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.society-selected-name {
  font-size: 0.875rem;
}

.society-selected-ruc {
  font-size: 0.75rem;
}

.society-selected-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-muted);
  transition: color 0.2s;
}

.society-selected-remove:hover:not(:disabled) {
  color: var(--destructive);
}

.society-remove-icon {
  width: 1rem;
  height: 1rem;
}

.society-search-section {
  position: relative;
}

.society-search-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px dashed var(--border-light);
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.society-search-button:hover:not(:disabled) {
  border-color: var(--primary-500);
  background: var(--primary-50);
}

.society-search-icon {
  width: 1rem;
  height: 1rem;
}

.society-search-modal {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 2px solid var(--border-light);
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 20rem;
  display: flex;
  flex-direction: column;
}

.society-search-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-light);
}

.society-search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.society-search-input-icon {
  position: absolute;
  left: 0.75rem;
  width: 1rem;
  height: 1rem;
  color: var(--text-muted);
}

.society-search-input {
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
}

.society-search-input:focus {
  border-color: var(--primary-700);
}

.society-search-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-muted);
}

.society-close-icon {
  width: 1rem;
  height: 1rem;
}

.society-search-results {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.society-search-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.society-search-item:hover {
  background: var(--bg-muted);
}

.society-search-item-selected {
  background: var(--primary-50);
}

.society-search-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.society-search-item-name {
  font-size: 0.875rem;
}

.society-search-item-ruc {
  font-size: 0.75rem;
}

.society-search-empty {
  padding: 2rem;
  text-align: center;
  font-size: 0.875rem;
}

/* Responsive */
@media (min-width: 1280px) and (max-width: 1439px) {
  .society-selector-label {
    font-size: 0.9375rem;
  }
}

@media (min-width: 1440px) {
  .society-selector-label {
    font-size: 1rem;
  }
}
</style>


