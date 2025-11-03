<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import {
    apellidoMaterno,
    apellidoPaterno,
    estadoCivil,
    nombreAccionista,
    numeroDocumento,
    tipoDocumento,
  } from "~/modules/registro-sociedades/schemas/modalAccionistas";
  import CardTitle from "../../cards/CardTitle.vue";
  import TextInputZod from "../../inputs/text/ui/TextInputZod.vue";
  import BaseModal from "../BaseModal.vue";

  interface Props {
    modelValue?: boolean;
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const form = ref({
    tipo_documento: "",
    numero_documento: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    estado_civil: "",
  });
</script>

<template>
  <BaseModal v-model="modelValue" size="lg" @close="emits('close')">
    <div class="flex flex-col gap-12">
      <CardTitle title="Tipo de Accionista" />

      <div class="grid grid-cols-2 gap-12">
        <TextInputZod
          v-model="form.tipo_documento"
          name="tipo_documento"
          label="Tipo de documento"
          placeholder="DNI / RUC / CE ..."
          :schema="tipoDocumento"
        />
        <TextInputZod
          v-model="form.numero_documento"
          name="numero_documento"
          label="Número de documento"
          placeholder="Ingrese número de documento"
          :schema="numeroDocumento"
        />
        <TextInputZod
          v-model="form.nombre"
          name="nombre"
          label="Nombres"
          placeholder="Nombres"
          :schema="nombreAccionista"
        />
        <TextInputZod
          v-model="form.apellido_paterno"
          name="apellido_paterno"
          label="Apellido paterno"
          placeholder="Apellido paterno"
          :schema="apellidoPaterno"
        />
        <TextInputZod
          v-model="form.apellido_materno"
          name="apellido_materno"
          label="Apellido materno"
          placeholder="Apellido materno"
          :schema="apellidoMaterno"
        />
        <TextInputZod
          v-model="form.estado_civil"
          name="estado_civil"
          label="Estado civil"
          placeholder="Soltero / Casado / ..."
          :schema="estadoCivil"
        />
      </div>
    </div>
  </BaseModal>
</template>
