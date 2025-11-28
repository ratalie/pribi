<script setup lang="ts">
  import Moneda from "@/assets/icons/Moneda.svg";
  import { useVModel } from "@vueuse/core";
  import { useField } from "vee-validate";
  import { computed, ref } from "vue";
  import { z } from "zod";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { useNumberFormatter } from "~/composables/useNumberFormatter";

  interface Props {
    modelValue?: boolean;
    valorNominal?: number;
    switchTabs?: "opcion-a" | "opcion-b";
    handleSaveValorNominal: (valor: number) => Promise<void>;
  }

  const props = withDefaults(defineProps<Props>(), {
    valorNominal: 0,
  });

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "update:switchTabs", value: "opcion-a" | "opcion-b"): void;
    (e: "close"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const switchTabs = useVModel(props, "switchTabs", emits, {
    passive: true,
  });

  // Valor temporal local (no emite hasta guardar)
  const valorNominalTemporal = ref(0);
  const valorNominalInput = ref("");
  const isLoading = ref(false);

  // Schema de validación con Zod
  const valorNominalSchema = z
    .number()
    .positive("El valor debe ser mayor a 0")
    .min(0.01, "El valor mínimo es S/ 0.01");

  // Integración con vee-validate
  const validateValue = (value: number) => {
    const result = valorNominalSchema.safeParse(value);
    return result.success ? true : result.error.issues[0]?.message ?? "Valor inválido";
  };

  const {
    value: valorValidado,
    errorMessage,
    meta,
    setTouched,
  } = useField("valor_nominal", validateValue, {
    initialValue: props.valorNominal,
  });

  // Usar el composable de formateo de números
  const { formatNumber, unformatNumber, padDecimals } = useNumberFormatter({
    format: "decimal",
    decimals: 2,
    decimalFactor: 100,
  });

  const formatValue = (event: Event) => {
    const target = event.target as HTMLInputElement;
    target.value = formatNumber(target.value);
    valorNominalInput.value = target.value;

    // Guardar en variable temporal (NO emite al padre aún)
    const numeroSinFormato = unformatNumber(valorNominalInput.value);
    valorNominalTemporal.value = numeroSinFormato;

    // Actualizar validación
    valorValidado.value = numeroSinFormato;
  };

  watch(
    () => valorNominalTemporal.value,
    (newValue) => {
      if (newValue === 0) {
        valorNominalInput.value = "";
      } else {
        const paddedValue = padDecimals(newValue.toString());
        valorNominalInput.value = formatNumber(paddedValue);
      }

      // Sincronizar con vee-validate
      valorValidado.value = newValue;
    },
    { immediate: true }
  );

  watch(
    () => modelValue.value,
    (isOpen) => {
      if (isOpen) {
        valorNominalTemporal.value = props.valorNominal;

        if (props.valorNominal > 0) {
          const paddedValue = padDecimals(props.valorNominal.toString());
          valorNominalInput.value = formatNumber(paddedValue);
          valorValidado.value = props.valorNominal;
        } else {
          valorNominalInput.value = "";
        }
      }
    }
  );

  const handleBlur = () => {
    setTouched(true);
  };

  const isValorIngresado = computed(() => valorValidado.value > 0);

  const handleCancel = () => {
    emits("close");
    modelValue.value = false;
    valorNominalTemporal.value = 0;
    valorNominalInput.value = "";
  };

  const handleSave = async () => {
    try {
      setTouched(true);
      isLoading.value = true;

      await props.handleSaveValorNominal(valorNominalTemporal.value);

      valorNominalTemporal.value = 0;
      valorNominalInput.value = "";
    } catch (error) {
      console.error("Error al guardar el valor nominal:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const handleInvalidSubmit = () => {
    //colocar logica de error, mostrar un toast
    console.log("Formulario inválido");
  };
</script>

<template>
  <BaseModal
    v-model="modelValue"
    size="md"
    @close="handleCancel"
    @submit="handleSave"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col items-center justify-center gap-7">
      <img :src="Moneda" alt="moneda" class="w-44" />

      <div class="w-full flex flex-col items-center justify-center font-primary">
        <p class="t-h4 font-semibold text-gray-800">Tipo de Acciones</p>
        <p class="t-h6 font-normal text-gray-500 mb-4">
          Selecciona el tipo de acciones que deseas registrar
        </p>

        <SwitchTabsText
          v-model="switchTabs"
          opcion-a="Comunes y sin derecho a voto"
          opcion-b="Clases de Acciones"
        />
      </div>

      <div class="flex flex-col items-center justify-center font-primary">
        <p class="t-h4 font-semibold text-gray-800">Valor nominal</p>
        <p class="t-h6 font-normal text-gray-500">Ingresa el valor nominal de las acciones.</p>
      </div>

      <!-- Input numérico con formato decimal -->
      <div class="flex flex-col items-center justify-center gap-2">
        <div class="flex items-center justify-center gap-2 transition-all duration-300">
          <span class="t-t1 font-secondary font-extrabold text-gray-900 shrink-0">S/</span>

          <input
            type="text"
            :value="valorNominalInput"
            placeholder="0.00"
            :class="[
              'w-[80px] focus:outline-none t-h6 font-secondary font-extrabold',
              errorMessage && meta.touched ? 'text-red-600' : 'text-gray-900',
            ]"
            @input="formatValue"
            @blur="handleBlur"
          />
        </div>

        <!-- Mensaje de error -->
        <p
          v-if="errorMessage && meta.touched"
          class="t-b2 font-secondary text-red-600 text-center"
        >
          {{ errorMessage }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          type="submit"
          variant="primary"
          label="Guardar"
          class="w-96 h-11"
          :is-disabled="!isValorIngresado"
          :is-loading="isLoading"
        />
      </div>
    </template>
  </BaseModal>
</template>
