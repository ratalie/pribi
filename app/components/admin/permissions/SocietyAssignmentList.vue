<script setup lang="ts">
import { Check } from 'lucide-vue-next';
import type { SocietyInfo } from '~/core/hexag/panel-administrativo/domain/entities/society-assignment.entity';

interface Props {
  availableSocieties: SocietyInfo[];
  selectedSocieties: string[];
  isLector: boolean;
  isLoading?: boolean;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: 'toggle-society', societyId: string): void;
  (e: 'select-society', societyId: string): void;
}>();

const isSocietySelected = (societyId: string) => {
  return props.selectedSocieties.includes(societyId);
};

// Para LECTOR: selector dropdown
const selectedSocietyId = computed(() => {
  return props.selectedSocieties[0] || '';
});

const handleSelectChange = (societyId: string) => {
  emits('select-society', societyId);
};
</script>

<template>
  <div class="space-y-4">
    <div>
      <h3
        class="text-sm font-medium mb-1"
        :style="{ color: 'var(--text-primary)' }"
      >
        Asignación de Sociedades
      </h3>
      <p
        class="text-xs mb-2"
        :style="{ color: 'var(--text-muted)' }"
      >
        <span v-if="isLector">
          Los usuarios con rol LECTOR solo pueden estar asignados a una sociedad.
        </span>
        <span v-else>
          Selecciona las sociedades a las que el usuario tendrá acceso.
        </span>
      </p>
    </div>

    <!-- Para LECTOR: Selector dropdown -->
    <div v-if="isLector">
      <select
        :value="selectedSocietyId"
        @change="handleSelectChange(($event.target as HTMLSelectElement).value)"
        :disabled="isLoading"
        class="w-full px-4 py-3 rounded-lg border appearance-none cursor-pointer transition-colors"
        :style="{
          borderColor: 'var(--border-light)',
          backgroundColor: 'white',
          color: 'var(--text-primary)',
        }"
      >
        <option value="">
          Selecciona una sociedad
        </option>
        <option
          v-for="society in availableSocieties"
          :key="society.id"
          :value="society.id"
        >
          {{ society.name }} {{ society.ruc ? `(${society.ruc})` : '' }}
        </option>
      </select>
    </div>

    <!-- Para NO-LECTOR: Checkboxes -->
    <div v-else>
      <div
        v-if="availableSocieties.length === 0"
        class="p-4 text-center rounded-lg"
        :style="{ backgroundColor: 'var(--bg-muted)' }"
      >
        <p
          class="text-sm"
          :style="{ color: 'var(--text-muted)' }"
        >
          No hay sociedades disponibles
        </p>
      </div>
      <div
        v-else
        class="space-y-2"
      >
        <div
          v-for="society in availableSocieties"
          :key="society.id"
          class="px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer"
          :style="{ borderColor: 'var(--border-light)' }"
          @click="emits('toggle-society', society.id)"
        >
          <div
            class="w-5 h-5 rounded border flex items-center justify-center transition-colors"
            :style="{
              borderColor: isSocietySelected(society.id) ? 'var(--primary-700)' : 'var(--border-light)',
              backgroundColor: isSocietySelected(society.id) ? 'var(--primary-700)' : 'white',
            }"
          >
            <Check
              v-if="isSocietySelected(society.id)"
              class="w-3 h-3 text-white"
            />
          </div>
          <div class="flex-1">
            <p
              class="text-sm font-medium"
              :style="{ color: 'var(--text-primary)' }"
            >
              {{ society.name }}
            </p>
            <p
              v-if="society.ruc"
              class="text-xs mt-0.5"
              :style="{ color: 'var(--text-muted)' }"
            >
              RUC: {{ society.ruc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

