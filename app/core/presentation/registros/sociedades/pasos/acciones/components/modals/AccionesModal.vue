<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import IconCoin from "~/assets/icons/icon-coin.svg";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import AccionesComunesForm from "../forms/AccionesComunesForm.vue";
  import ClasesAccionesForm from "../forms/ClasesAccionesForm.vue";

  interface Props {
    modelValue?: boolean;
    mode?: "crear" | "editar";
    accionId?: string | null;
    societyId?: string;
    valorNominalDisplay?: string;
    isLoading?: boolean;
    switchTabs?: "opcion-a" | "opcion-b";
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "crear",
    accionId: null,
    societyId: "",
    valorNominalDisplay: "S/ 0.00",
    isLoading: false,
    switchTabs: "opcion-a",
  });

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "submit" | "close" | "invalidSubmit"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const IconCoinValue = computed(() => {
    return IconCoin;
  });

  const handleClose = () => {
    emits("close");
    modelValue.value = false;
  };

  const handleSubmit = () => {
    emits("submit");
  };

  const handleInvalidSubmit = () => {
    emits("invalidSubmit");
  };
</script>

<template>
  <BaseModal
    v-model="modelValue"
    size="lg"
    @close="handleClose"
    @submit="handleSubmit"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col gap-12">
      <CardTitle :title="props.mode === 'editar' ? 'Editar Acción' : 'Agregar Acción'">
        <template #actions>
          <!-- valor nominal -->
          <BaseButton type="button" variant="pill" class="h-11">
            <img :src="IconCoinValue" alt="Valor Nominal" />
            <p class="font-bold">
              Valor Nominal:
              <span class="font-bold">{{ props.valorNominalDisplay }}</span>
            </p>
          </BaseButton>
        </template>
      </CardTitle>

      <AccionesComunesForm
        v-if="props.switchTabs === 'opcion-a'"
        :society-id="props.societyId"
      />

      <ClasesAccionesForm
        v-if="props.switchTabs === 'opcion-b'"
        :society-id="props.societyId"
      />
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleClose"
        />

        <ActionButton
          type="submit"
          variant="primary"
          :label="props.mode === 'editar' ? 'Editar' : 'Guardar'"
          size="md"
          :is-loading="props.isLoading"
        />
      </div>
    </template>
  </BaseModal>
</template>
