<script setup lang="ts">
  import { Form } from "vee-validate";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { officeOptions } from "~/constants/inputs/office-options";
  import { societyTypeOptions } from "~/constants/inputs/society-types";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import type { TypeOption } from "~/types/TypeOptions";
  import {
    actividadExteriorSchema,
    departamentoSchema,
    direccionSchema,
    distritoSchema,
    nombreComercialSchema,
    oficinaRegistralSchema,
    partidaRegistralSchema,
    provinciaSchema,
    razonSocialSchema,
    rucSchema,
    tipoSociedadSchema,
  } from "../../schemas/datosSociedad";

  interface Props {
    mode: EntityModeEnum;
    societyId?: string;
  }

  defineProps<Props>();

  // Datos del formulario
  const form = ref({
    numeroRuc: "",
    tipoSociedad: "",
    razonSocial: "",
    nombreComercial: "",
    direccion: "",
    distrito: "",
    provincia: "",
    departamento: "",
    actividadExterior: "",
    fechaEscrituraPublica: "",
    partidaRegistral: "",
    oficinaRegistral: "",
  });

  // Opciones tipadas
  const societyOptions: TypeOption[] = societyTypeOptions;
  const officeSelectOptions: TypeOption[] = officeOptions;

  const isLoadingRuc = ref(false);

  const handleSearchRuc = (ruc: string) => {
    isLoadingRuc.value = true;

    setTimeout(() => {
      console.log("Datos encontrados para RUC:", ruc);
      isLoadingRuc.value = false;
    }, 1500);
  };

  // Manejador de envío
  const handleSubmit = () => {
    console.log("Formulario enviado:", form.value);
  };

  const handleInvalidSubmit = (ctx: any) => {
    // ctx.errors contiene los errores de validación
    // Puedes mostrar un toast, alert, o log
    console.log("Errores en el formulario:", ctx.errors);
    // O usa tu sistema de notificaciones/toast aquí
  };
</script>

<template>
  <div class="min-h-screen">
    <!-- Formulario principal -->
    <div class="bg-white p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-700">Datos principales</h1>
        <p class="text-gray-700 mt-2">Complete todos los datos requeridos.</p>
      </div>

      <!-- Formulario -->
      <Form
        class="grid grid-cols-2 gap-14"
        @submit="handleSubmit"
        @invalid-submit="handleInvalidSubmit"
      >
        <SearchInputZod
          v-model="form.numeroRuc"
          name="numero-ruc"
          label="Número de RUC (Zod)"
          placeholder="Ingrese el número de RUC"
          :schema="rucSchema"
          :is-loading="isLoadingRuc"
          @search="handleSearchRuc"
        />

        <SelectInputZod
          v-model="form.tipoSociedad"
          :options="societyOptions"
          name="tipo-sociedad"
          label="Tipo de Sociedad (Zod)"
          placeholder="Ingrese el tipo de sociedad"
          :schema="tipoSociedadSchema"
        />

        <TextInputZod
          v-model="form.razonSocial"
          name="razon-social"
          label="Razón Social (Zod)"
          placeholder="Ingrese la razón social"
          :schema="razonSocialSchema"
        />

        <TextInputZod
          v-model="form.nombreComercial"
          name="nombre-comercial"
          label="Nombre Comercial (Zod)"
          placeholder="Ingrese el nombre comercial"
          :schema="nombreComercialSchema"
        />

        <TextInputZod
          v-model="form.direccion"
          name="direccion"
          label="Dirección (Zod)"
          placeholder="Ingrese la dirección"
          :schema="direccionSchema"
        />

        <TextInputZod
          v-model="form.distrito"
          name="distrito"
          label="Distrito (Zod)"
          placeholder="Ingrese el distrito"
          :schema="distritoSchema"
        />

        <TextInputZod
          v-model="form.provincia"
          name="provincia"
          label="Provincia (Zod)"
          placeholder="Ingrese la provincia"
          :schema="provinciaSchema"
        />

        <TextInputZod
          v-model="form.departamento"
          name="departamento"
          label="Departamento (Zod)"
          placeholder="Ingrese el departamento"
          :schema="departamentoSchema"
        />

        <TextInputZod
          v-model="form.actividadExterior"
          name="actividad-exterior"
          label="Actividad Exterior (Zod)"
          placeholder="Ingrese la actividad exterior"
          :schema="actividadExteriorSchema"
        />

        <SelectInputZod
          v-model="form.oficinaRegistral"
          :options="officeSelectOptions"
          name="oficina-registral"
          label="Oficina Registral (Zod)"
          placeholder="Ingrese la oficina registral"
          :schema="oficinaRegistralSchema"
        />

        <TextInputZod
          v-model="form.partidaRegistral"
          name="partida-registral"
          label="Partida Registral (Zod)"
          placeholder="Ingrese la partida registral"
          :schema="partidaRegistralSchema"
        />
      </Form>
    </div>
  </div>
</template>
