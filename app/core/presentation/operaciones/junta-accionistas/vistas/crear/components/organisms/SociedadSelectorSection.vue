<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
    <SociedadSelector
      :sociedades="sociedades"
      :selected-society-id="selectedSocietyId"
      :is-loading="isLoadingSociedades"
      :disabled="isSubmitting"
      label="Selecciona la sociedad para la junta"
      select-class="w-full h-12 text-base"
      @update:selected-society-id="handleChange"
    />

    <!-- Información de la sociedad seleccionada -->
    <div
      v-if="selectedSociedad"
      class="mt-6 rounded-xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-primary-100/30 p-5 shadow-sm"
    >
      <h4
        class="mb-3 text-sm font-bold flex items-center gap-2"
        style="
          color: var(--primary-800);
          font-family: var(--font-primary);
        "
      >
        <CheckCircle2 class="w-4 h-4" />
        Sociedad seleccionada:
      </h4>
      <div
        class="space-y-2 text-sm"
        style="
          color: var(--text-secondary);
          font-family: var(--font-secondary);
        "
      >
        <p>
          <strong>Razón Social:</strong> {{ selectedSociedad.razonSocial }}
        </p>
        <p v-if="selectedSociedad.ruc">
          <strong>RUC:</strong> {{ selectedSociedad.ruc }}
        </p>
        <p v-if="selectedSociedad.tipoSocietario">
          <strong>Tipo:</strong> {{ selectedSociedad.tipoSocietario }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { CheckCircle2 } from "lucide-vue-next";
import type { SociedadResumenDTO } from "~/core/hexag/registros/sociedades/application/dtos";
import SociedadSelector from "~/core/presentation/shared/components/molecules/SociedadSelector.vue";

interface Props {
  sociedades: SociedadResumenDTO[];
  selectedSocietyId: number | string | null;
  selectedSociedad: SociedadResumenDTO | null;
  isLoadingSociedades: boolean;
  isSubmitting: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:selectedSocietyId": [value: number | null];
}>();

// Logs para debuggear
onMounted(() => {
  console.log("🔍 [SociedadSelectorSection] onMounted:", {
    sociedades: props.sociedades,
    sociedadesLength: props.sociedades?.length || 0,
    selectedSocietyId: props.selectedSocietyId,
    selectedSociedad: props.selectedSociedad,
    isLoadingSociedades: props.isLoadingSociedades,
  });
});

watch(
  () => props.sociedades,
  (newVal) => {
    console.log("👀 [SociedadSelectorSection] sociedades changed:", {
      newVal,
      length: newVal?.length || 0,
      isArray: Array.isArray(newVal),
    });
  },
  { immediate: true, deep: true }
);

const handleChange = (value: number | null) => {
  console.log("🔄 [SociedadSelectorSection] handleChange:", value);
  emit("update:selectedSocietyId", value);
};
</script>




