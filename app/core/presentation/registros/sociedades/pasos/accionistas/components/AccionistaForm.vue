<script setup lang="ts">
  import { Form } from "vee-validate";
  import { computed, reactive, watch } from "vue";
  import { z } from "zod";

  import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import {
    DOCUMENT_TYPES,
    personaOptions,
    type AccionistaFormValues,
    type PersonaTipoForm,
  } from "../types";

  interface Props {
    initialValues?: Partial<AccionistaFormValues>;
    mode?: "create" | "edit";
  }

  const props = withDefaults(defineProps<Props>(), {
    initialValues: undefined,
    mode: "create",
  });

  const emit = defineEmits<{
    (e: "submit", values: AccionistaFormValues): void;
  }>();

  interface FormState {
    personaType: PersonaTipoForm;
    participacionPorcentual: number | null;
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    paisEmision: string;
    razonSocial: string;
    nombreComercial: string;
    direccion: string;
    pais: string;
  }

  const defaultState: FormState = {
    personaType: "NATURAL",
    tipoDocumento: "DNI",
    numeroDocumento: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    participacionPorcentual: null,
    paisEmision: "",
    razonSocial: "",
    nombreComercial: "",
    direccion: "",
    pais: "",
  };

  const form = reactive<FormState>({ ...defaultState });

  const applyInitialValues = (value?: Partial<AccionistaFormValues>) => {
    Object.assign(form, defaultState);
    if (!value) return;

    form.participacionPorcentual =
      value.participacionPorcentual === undefined ? null : value.participacionPorcentual;

    if (value.personaType === "JURIDICA") {
      const juridica = value as Extract<AccionistaFormValues, { personaType: "JURIDICA" }>;
      form.personaType = "JURIDICA";
      form.tipoDocumento = juridica.tipoDocumento ?? "RUC";
      form.numeroDocumento = juridica.numeroDocumento ?? "";
      form.razonSocial = juridica.razonSocial ?? "";
      form.nombreComercial = juridica.nombreComercial ?? "";
      form.direccion = juridica.direccion ?? "";
      form.pais = juridica.pais ?? "";
      return;
    }

    const natural = value as Extract<AccionistaFormValues, { personaType: "NATURAL" }> | undefined;
    form.personaType = "NATURAL";
    form.tipoDocumento = natural?.tipoDocumento ?? "DNI";
    form.numeroDocumento = natural?.numeroDocumento ?? "";
    form.nombre = natural?.nombre ?? "";
    form.apellidoPaterno = natural?.apellidoPaterno ?? "";
    form.apellidoMaterno = natural?.apellidoMaterno ?? "";
    form.paisEmision = natural?.paisEmision ?? "";
  };

  applyInitialValues(props.initialValues);

  watch(
    () => props.initialValues,
    (value) => applyInitialValues(value),
    { deep: true }
  );

  const isNatural = computed(() => form.personaType === "NATURAL");
  const isJuridica = computed(() => form.personaType === "JURIDICA");

  const required = (message: string) => z.string().min(1, message);
  const docSchema = required("Este campo es obligatorio");

  const participacionModel = computed({
    get: () => form.participacionPorcentual ?? 0,
    set: (value: number) => {
      form.participacionPorcentual = Number.isNaN(value) ? null : value;
    },
  });

  const handlePersonaTypeChange = (value: string) => {
    const next = value as PersonaTipoForm;
    if (next === form.personaType) return;

    form.personaType = next;

    if (next === "NATURAL") {
      Object.assign(form, {
        tipoDocumento: "DNI",
        numeroDocumento: "",
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        paisEmision: "",
      });
      return;
    }

    Object.assign(form, {
      tipoDocumento: "RUC",
      numeroDocumento: "",
      razonSocial: "",
      nombreComercial: "",
      direccion: "",
      pais: "",
    });
  };

  const buildValues = (): AccionistaFormValues => {
    if (form.personaType === "NATURAL") {
      return {
        personaType: "NATURAL",
        tipoDocumento: form.tipoDocumento,
        numeroDocumento: form.numeroDocumento,
        nombre: form.nombre,
        apellidoPaterno: form.apellidoPaterno,
        apellidoMaterno: form.apellidoMaterno || undefined,
        paisEmision: form.paisEmision || undefined,
        participacionPorcentual: form.participacionPorcentual,
      };
    }

    return {
      personaType: "JURIDICA",
      tipoDocumento: form.tipoDocumento,
      numeroDocumento: form.numeroDocumento,
      razonSocial: form.razonSocial,
      nombreComercial: form.nombreComercial || undefined,
      direccion: form.direccion || undefined,
      pais: form.pais || undefined,
      participacionPorcentual: form.participacionPorcentual,
    };
  };

  const handleSubmit = () => {
    emit("submit", buildValues());
  };
</script>

<template>
  <Form id="accionistas-form" class="space-y-8" @submit="handleSubmit">
    <section class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <SelectInputZod
        :model-value="form.personaType"
        name="persona-type"
        label="Tipo de accionista"
        placeholder="Selecciona una opción"
        :options="personaOptions"
        :schema="required('Selecciona un tipo')"
        @update:model-value="handlePersonaTypeChange"
      />

      <NumberInputZod
        v-model="participacionModel"
        name="participacion"
        label="Participación porcentual"
        placeholder="0"
        :schema="z
          .number()
          .min(0, 'Debe ser mayor o igual a 0')
          .max(100, 'Debe ser menor o igual a 100')"
        format="decimal"
        :decimals="2"
        :decimal-factor="1"
      />
    </section>

    <section v-if="isNatural" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <SelectInputZod
        v-model="form.tipoDocumento"
        name="natural-tipo-documento"
        label="Tipo de documento"
        placeholder="Selecciona una opción"
        :options="DOCUMENT_TYPES"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.numeroDocumento"
        name="natural-numero-documento"
        label="Número de documento"
        placeholder="Ingresa el número"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.nombre"
        name="natural-nombre"
        label="Nombres"
        placeholder="Ingresa los nombres"
        :schema="required('Ingresa los nombres')"
      />
      <TextInputZod
        v-model="form.apellidoPaterno"
        name="natural-apellido-paterno"
        label="Apellido paterno"
        placeholder="Ingresa el apellido paterno"
        :schema="required('Ingresa el apellido paterno')"
      />
      <TextInputZod
        v-model="form.apellidoMaterno"
        name="natural-apellido-materno"
        label="Apellido materno"
        placeholder="Opcional"
        :schema="z.string().optional()"
      />
      <TextInputZod
        v-model="form.paisEmision"
        name="natural-pais-emision"
        label="País de emisión"
        placeholder="Opcional"
        :schema="z.string().optional()"
      />
    </section>

    <section v-if="isJuridica" class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <SelectInputZod
        v-model="form.tipoDocumento"
        name="juridica-tipo-documento"
        label="Tipo de documento"
        placeholder="Selecciona una opción"
        :options="DOCUMENT_TYPES"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.numeroDocumento"
        name="juridica-numero-documento"
        label="Número de documento"
        placeholder="Ingresa el número"
        :schema="docSchema"
      />
      <TextInputZod
        v-model="form.razonSocial"
        name="juridica-razon-social"
        label="Razón social"
        placeholder="RAZÓN SOCIAL SAC"
        :schema="required('Ingresa la razón social')"
      />
      <TextInputZod
        v-model="form.nombreComercial"
        name="juridica-nombre-comercial"
        label="Nombre comercial"
        placeholder="Opcional"
        :schema="z.string().optional()"
      />
      <TextInputZod
        v-model="form.direccion"
        name="juridica-direccion"
        label="Dirección"
        placeholder="Opcional"
        :schema="z.string().optional()"
      />
      <TextInputZod
        v-model="form.pais"
        name="juridica-pais"
        label="País"
        placeholder="Opcional"
        :schema="z.string().optional()"
      />
    </section>

    <div class="flex justify-end">
      <button type="submit" class="hidden">Guardar</button>
    </div>
  </Form>
</template>

