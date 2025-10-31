<script setup lang="ts">
  import InputPercentZod from "@/components/base/inputs/text/ui/InputPercentZod.vue";
  import { ref, watch } from "vue";
  import { porcentajeSchema } from "~/modules/registro-sociedades/schemas/datosSociedad";

  interface Props {
    quorumType?: string; // También acepta quorum-type desde kebab-case
    ruler?: string;
    textBody?: string; // También acepta text-body desde kebab-case
    initialValue?: string; // También acepta initial-value desde kebab-case
    showError?: boolean; // También acepta show-error desde kebab-case
    isPreview?: boolean; // También acepta is-preview desde kebab-case
    errorLimit?: number; // También acepta error-limit desde kebab-case
    variant?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: "normal",
    ruler: "",
    textBody: "",
    errorLimit: 0,
    quorumType: "",
    initialValue: "0.00",
    showError: false,
    isPreview: false,
  });

  const emits = defineEmits(["update:numberValue"]);

  const value = ref(props.initialValue || "0.00");

  watch(value, (newValue) => {
    emits("update:numberValue", parseFloat(newValue));
  });

  watch(
    () => props.initialValue,
    (newValue) => {
      if (newValue && newValue !== value.value) {
        value.value = newValue;
      }
    }
  );
</script>
<template>
  <tr class="border-b border-button-secondary">
    <td class="font-secondary text-gray-700 text-t2 font-medium py-7 px-7">
      {{ quorumType }}
    </td>
    <td class="font-secondary text-t2 text-gray-700 font-medium py-7 px-7">
      <div class="flex flex-wrap gap-2 items-center">
        <div v-if="props.ruler" class="flex gap-2 items-center shrink-0">
          <p class="whitespace-nowrap">{{ ruler }}</p>
          <div class="relative shrink-0">
            <div
              class="px-2 flex items-center w-24 border rounded-lg"
              :class="[
                showError ? 'border-red-500' : 'border-gray-700',
                isPreview ? 'bg-layout-gray-300 pointer-events-none' : '',
              ]"
            >
              <InputPercentZod
                v-model="value"
                name="quorum-percent-input"
                :schema="porcentajeSchema"
                class="px-0 text-gray-700 text-t2 font-secondary font-semibold border-none focus:border-none outline-none focus:outline-none"
                :is-disabled="isPreview"
              />
              <span>%</span>
            </div>
            <p
              v-if="showError"
              class="absolute left-0 pt-1 text-red-500 text-xs font-semibold whitespace-nowrap"
            >
              El valor debe ser mayor que {{ errorLimit }}
            </p>
          </div>
        </div>
        <p v-if="props.ruler" class="min-w-0 truncate text-gray-700 text-t2 font-secondary font-medium">{{ textBody }}</p>
        <p v-else class="min-w-0 text-gray-700 text-t2 font-secondary font-medium">
          El número de acciones con derecho a voto que estén presentes.
        </p>
      </div>
    </td>
  </tr>
</template>
