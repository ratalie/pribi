<script setup lang="ts">
  import NameInput from "@/components/base/inputs/text/custom/NameInput.vue";
  import RucInput from "@/components/base/inputs/text/custom/RucInput.vue";
  import SimpleTextInput from "@/components/base/inputs/text/custom/SimpleTextInput.vue";
  import SelectInput from "@/components/base/inputs/text/ui/SelectInput.vue";
  import { useFormValidation } from "@/composables/useFormValidation";
  import { officeOptions } from "@/constants/inputs/office-options";
  import { societyTypeOptions } from "@/constants/inputs/society-types";
  import type { SelectOption } from "@/types/inputs/select";
  import { Form } from "vee-validate";
  import { ref } from "vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import {
    actividadExteriorSchema,
    departamentoSchema,
    direccionSchema,
    distritoSchema,
    nombreComercialSchema,
    partidaRegistralSchema,
    provinciaSchema,
    razonSocialSchema,
    rucSchema,
    tipoSociedadSchema,
  } from "~/modules/registro-sociedades/schemas/datosSociedad";

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
  const societyOptions: SelectOption[] = societyTypeOptions;
  const officeSelectOptions: SelectOption[] = officeOptions as SelectOption[];

  // Composable de validación centralizado
  const {
    isValid,
    handleTextValidation,
    handleSelectValidation,
    handleDateValidation,
    clearValidations,
  } = useFormValidation();

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

  // Manejador para limpiar formulario
  const handleClear = () => {
    form.value = {
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
    };
    clearValidations();
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

        <TextInputZod
          v-model="form.razonSocial"
          name="razon-social"
          label="Razón Social (Zod)"
          placeholder="Ingrese la razón social"
          :schema="razonSocialSchema"
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

        <TextInputZod
          v-model="form.partidaRegistral"
          name="partida-registral"
          label="Partida Registral (Zod)"
          placeholder="Ingrese la partida registral"
          :schema="partidaRegistralSchema"
        />

        <!-- Botones -->
        <div class="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="handleClear"
          >
            Limpiar
          </button>

          <button
            type="submit"
            :disabled="!isValid"
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar Formulario
          </button>
        </div>
      </Form>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Fila 1: RUC y Tipo de Sociedad -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div class="w-full">
            <RucInput
              v-model="form.numeroRuc"
              label="Número de RUC"
              label-id="numero-ruc"
              placeholder="Ingrese el número de RUC"
              :required="true"
              :show-search-icon="true"
              icon-position="right"
              @validation="handleTextValidation"
            />
          </div>
          <div class="w-full">
            <SelectInput
              v-model="form.tipoSociedad"
              label="Tipo de Sociedad"
              :options="societyOptions"
              :required="true"
              placeholder="Elige el tipo de sociedad"
              custom-classes="h-10 mb-0"
              @validation="handleSelectValidation"
            />
          </div>
        </div>

        <!-- Fila 2: Razón Social y Nombre Comercial -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div class="w-full">
            <NameInput
              v-model="form.razonSocial"
              name-type="full"
              label="Razón Social"
              label-id="razon-social"
              :required="true"
              @validation="handleTextValidation"
            />
          </div>
          <div class="w-full">
            <NameInput
              v-model="form.nombreComercial"
              name-type="full"
              label="Nombre Comercial"
              label-id="nombre-comercial"
              :required="false"
              @validation="handleTextValidation"
            />
          </div>
        </div>

        <!-- Fila 3: Dirección y Distrito -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div class="w-full">
            <SimpleTextInput
              v-model="form.direccion"
              label="Dirección"
              label-id="direccion"
              placeholder="Ingrese la dirección"
              :required="true"
            />
          </div>
          <div class="w-full">
            <SimpleTextInput
              v-model="form.distrito"
              label="Distrito"
              label-id="distrito"
              placeholder="Ingrese el distrito"
              :required="true"
            />
          </div>
        </div>

        <!-- Fila 4: Provincia y Departamento -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div class="w-full">
            <SimpleTextInput
              v-model="form.provincia"
              label="Provincia"
              label-id="provincia"
              placeholder="Ingrese la provincia"
              :required="true"
            />
          </div>
          <div class="w-full">
            <SimpleTextInput
              v-model="form.departamento"
              label="Departamento"
              label-id="departamento"
              placeholder="Ingrese el departamento"
              :required="true"
            />
          </div>
        </div>

        <!-- Fila 5: Actividad Exterior -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div class="w-full">
            <SimpleTextInput
              v-model="form.actividadExterior"
              label="Actividad Exterior"
              label-id="actividad-exterior"
              placeholder="Ingrese la actividad exterior"
              :required="false"
            />
          </div>
        </div>

        <!-- Fila 6: Partida Registral -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div class="w-full">
            <SimpleTextInput
              v-model="form.partidaRegistral"
              label="Partida Registral"
              label-id="partida-registral"
              placeholder="Ingrese la partida registral"
              :required="true"
            />
          </div>
        </div>

        <!-- Fila 7: Oficina Registral (solo una columna) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div class="w-full">
            <SelectInput
              v-model="form.oficinaRegistral"
              label="Oficina Registral"
              :options="officeSelectOptions"
              :required="true"
              placeholder="Elige la oficina registral"
              @validation="handleSelectValidation"
            />
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="handleClear"
          >
            Limpiar
          </button>

          <button
            type="submit"
            :disabled="!isValid"
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar Formulario
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
