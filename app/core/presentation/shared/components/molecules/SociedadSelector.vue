<template>
  <div class="space-y-4">
    <label
      class="text-base font-bold block flex items-center gap-2"
      style="
        color: var(--text-primary);
        font-family: var(--font-primary);
      "
    >
      <Building2 class="w-4 h-4" />
      {{ label }}
    </label>
    <Select
      :model-value="selectedSocietyId?.toString()"
      :disabled="disabled || isLoading"
      @update:model-value="handleChange"
    >
      <SelectTrigger :class="selectClass">
        <SelectValue :placeholder="placeholder" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          v-for="sociedad in sociedades"
          :key="sociedad.idSociety"
          :value="sociedad.idSociety?.toString() || ''"
        >
          <div class="flex items-center gap-2">
            <Building2 class="h-4 w-4" />
            <span>{{ sociedad.razonSocial || "Sociedad sin nombre" }}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
    <p
      v-if="isLoading"
      class="text-xs"
      style="
        color: var(--text-muted);
        font-family: var(--font-secondary);
      "
    >
      Cargando sociedades...
    </p>
    <p
      v-else-if="sociedades.length === 0"
      class="text-xs text-amber-600 font-medium"
      style="font-family: var(--font-secondary)"
    >
      No hay sociedades disponibles. Crea una sociedad primero.
    </p>
    <div
      v-if="selectedSociedad && showInfo"
      class="mt-4 p-4 rounded-lg bg-primary-50 border border-primary-200"
    >
      <p
        class="text-sm font-medium mb-1"
        style="
          color: var(--primary-800);
          font-family: var(--font-primary);
        "
      >
        {{ selectedSociedad.razonSocial }}
      </p>
      <p
        class="text-xs"
        style="
          color: var(--text-muted);
          font-family: var(--font-secondary);
        "
      >
        RUC: {{ selectedSociedad.ruc || "N/A" }} | Tipo: {{ selectedSociedad.tipoSocietario || "N/A" }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Building2 } from "lucide-vue-next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SociedadResumenDTO } from "~/core/hexag/registros/sociedades/application/dtos";

interface Props {
  sociedades: SociedadResumenDTO[];
  selectedSocietyId: number | string | null;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  selectClass?: string;
  showInfo?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  disabled: false,
  label: "Selecciona la sociedad",
  placeholder: "Selecciona una sociedad...",
  selectClass: "w-full h-12",
  showInfo: true,
});

const emit = defineEmits<{
  "update:selectedSocietyId": [value: number | null];
}>();

const selectedSociedad = computed(() => {
  if (!props.selectedSocietyId) return null;
  const id = typeof props.selectedSocietyId === "string" 
    ? parseInt(props.selectedSocietyId, 10) 
    : props.selectedSocietyId;
  return props.sociedades.find((s) => s.idSociety === id) || null;
});

const handleChange = (value: unknown) => {
  const societyId = value ? parseInt(value as string, 10) : null;
  emit("update:selectedSocietyId", societyId);
};
</script>




