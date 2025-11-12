<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import CascadeSelectInputZod from "~/components/base/inputs/text/ui/CascadeSelectInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { accionistaTypes } from "~/constants/inputs/accionista-types";
  import { tipoAccionistaSchema } from "../../schemas/modalAccionistas";
  import { TipoAccionistaEnum } from "../../types/enums/TipoAccionistaEnum";
  import AccionistaJuridicoForm from "../forms/accionistas/AccionistaJuridicoForm.vue";
  import AccionistaNaturalForm from "../forms/accionistas/AccionistaNaturalForm.vue";
  import AccionistaSucursalForm from "../forms/accionistas/AccionistaSucursalForm.vue";
  import FideicomisosForm from "../forms/accionistas/FideicomisosForm.vue";
  import FondosInversionForm from "../forms/accionistas/FondosInversionForm.vue";
  import SucesionesIndivisasForm from "../forms/accionistas/SucesionesIndivisasForm.vue";

  interface Props {
    modelValue?: boolean;
    tipoAccionista: TipoAccionistaEnum;
    mode: "crear" | "editar";
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "update:tipoAccionista", value: TipoAccionistaEnum): void;
    (e: "close" | "submit"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const tipoAccionista = useVModel(props, "tipoAccionista", emits, {
    passive: true,
  });

  const handleSubmit = () => {
    emits("submit");
  };

  const handleCancel = () => {
    emits("close");
    modelValue.value = false;
  };

  const handleInvalidSubmit = () => {
    //colocar logica de error, mostrar un toast
    console.log("Formulario inválido");
  };
</script>

<template>
  <BaseModal
    v-model="modelValue"
    size="lg"
    @close="handleCancel"
    @submit="handleSubmit"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col gap-12">
      <CardTitle title="Tipo de Accionista" body="Selecciona una opción">
        <template #actions>
          <div class="w-[440px]">
            <CascadeSelectInputZod
              v-model="tipoAccionista"
              name="tipo_accionista"
              label="Tipo de Accionista"
              placeholder="Selecciona un tipo"
              :options="accionistaTypes"
              :schema="tipoAccionistaSchema"
            />
          </div>
        </template>
      </CardTitle>

      <AccionistaNaturalForm v-if="tipoAccionista === TipoAccionistaEnum.NATURAL" />
      <AccionistaJuridicoForm v-if="tipoAccionista === TipoAccionistaEnum.JURIDICA" />
      <AccionistaSucursalForm v-if="tipoAccionista === TipoAccionistaEnum.SUCURSAL" />
      <SucesionesIndivisasForm
        v-if="tipoAccionista === TipoAccionistaEnum.SUCESIONES_INDIVISAS"
      />
      <FideicomisosForm v-if="tipoAccionista === TipoAccionistaEnum.FIDEICOMISOS" />
      <FondosInversionForm v-if="tipoAccionista === TipoAccionistaEnum.FONDOS_INVERSION" />
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleCancel"
        />

        <ActionButton
          type="submit"
          variant="primary"
          :label="mode === 'crear' ? 'Guardar' : 'Editar'"
          size="md"
        />
      </div>
    </template>
  </BaseModal>
</template>
