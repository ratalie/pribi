<script setup lang="ts">
import SearchInput from "@/components/base/inputs/text/ui/SearchInput.vue";
import SelectInput from "@/components/base/inputs/text/ui/SelectInput.vue";
import NameInput from "@/components/base/inputs/text/custom/NameInput.vue";
import SimpleTextInput from "@/components/base/inputs/text/custom/SimpleTextInput.vue";
import DateInput from "@/components/base/inputs/text/ui/DateInput.vue";
import { societyTypeOptions } from "@/constants/inputs/society-types";
import { officeOptions } from "@/constants/inputs/office-options";
import type { SelectOption } from "@/types/inputs/select";
import { useFormValidation } from "@/composables/useFormValidation";
import { ref } from "vue";

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
  fechaInscripcionRuc: "",
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
  validationMessage,
  isValid,
  handleTextValidation,
  handleSelectValidation,
  handleDateValidation,
  clearValidations,
} = useFormValidation();

// Manejador de envío
const handleSubmit = () => {
  console.log("Formulario enviado:", form.value);
  alert(`Formulario enviado:\n${JSON.stringify(form.value, null, 2)}`);
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
    fechaInscripcionRuc: "",
    actividadExterior: "",
    fechaEscrituraPublica: "",
    partidaRegistral: "",
    oficinaRegistral: "",
  };
  clearValidations();
};
</script>

<template>
  <div class="min-h-screen ">
    <!-- Formulario principal -->
    <div class="bg-white p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Datos principales</h1>
        <p class="text-gray-600 mt-2">Complete todos los datos requeridos.</p>
      </div>

      <!-- Formulario -->
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Fila 1: RUC y Tipo de Sociedad -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
            <SearchInput
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
          <div>
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
          <div>
            <NameInput
              v-model="form.razonSocial"
              name-type="full"
              label="Razón Social"
              label-id="razon-social"
              :required="true"
              @validation="handleTextValidation"
            />
          </div>
          <div>
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
          <div>
            <SimpleTextInput
              v-model="form.direccion"
              label="Dirección"
              label-id="direccion"
              placeholder="Ingrese la dirección"
              :required="true"
            />
          </div>
          <div>
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
          <div>
            <SimpleTextInput
              v-model="form.provincia"
              label="Provincia"
              label-id="provincia"
              placeholder="Ingrese la provincia"
              :required="true"
            />
          </div>
          <div>
            <SimpleTextInput
              v-model="form.departamento"
              label="Departamento"
              label-id="departamento"
              placeholder="Ingrese el departamento"
              :required="true"
            />
          </div>
        </div>

        <!-- Fila 5: Fecha de Inscripción RUC y Actividad Exterior -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
            <DateInput
              v-model="form.fechaInscripcionRuc"
              label="Fecha de Inscripción en el RUC"
              label-id="fecha-inscripcion-ruc"
              placeholder="Selecciona la fecha de inscripción"
              :required="true"
              date-format="dd/MM/yyyy"
              @validation="handleDateValidation"
            />
          </div>
          <div>
            <SimpleTextInput
              v-model="form.actividadExterior"
              label="Actividad Exterior"
              label-id="actividad-exterior"
              placeholder="Ingrese la actividad exterior"
              :required="false"
            />
          </div>
        </div>

        <!-- Fila 6: Fecha de Escritura Pública y Partida Registral -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
            <DateInput
              v-model="form.fechaEscrituraPublica"
              label="Fecha de Escritura Pública de Constitución"
              label-id="fecha-escritura-publica"
              placeholder="Selecciona la fecha de escritura"
              :required="true"
              date-format="dd/MM/yyyy"
              @validation="handleDateValidation"
            />
          </div>
          <div>
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
          <div>
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

        <!-- Estado de validación -->
        <div
          v-if="validationMessage"
          class="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Error de validación
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ validationMessage }}
              </div>
            </div>
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
