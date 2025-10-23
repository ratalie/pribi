<script setup lang="ts">
import NameInput from "@/components/base/inputs/text/custom/NameInput.vue";
import SearchInput from "@/components/base/inputs/text/ui/SearchInput.vue";
import RucInput from "@/components/base/inputs/text/custom/RucInput.vue";
import type { TextInputValidation } from "@/types/inputs/text";
import SelectInput from "@/components/base/inputs/text/ui/SelectInput.vue";
import { societyTypeOptions } from "@/constants/inputs/society-types";
import type { SelectOption, SelectValidation } from "@/types/inputs/select";
import { ref } from "vue";

// Datos del formulario
const form = ref({
  nombreCompleto: "",
  nombre: "",
  apellido: "",
  busqueda: "",
  ruc: "",
  tipoSociedad: "",
});

// Opciones tipadas
const options: SelectOption[] = societyTypeOptions;

// Estado de validación
const validationMessage = ref("");
const isValid = ref(false);

// Manejador de validación para inputs de texto
const handleTextValidation = (validation: TextInputValidation) => {
  console.log("Validación de texto:", validation);

  if (!validation.isValid) {
    validationMessage.value = validation.errorMessage || "";
    isValid.value = false;
  } else {
    validationMessage.value = "";
    isValid.value = true;
  }
};

// Manejador de validación para selects
const handleSelectValidation = (validation: SelectValidation) => {
  console.log("Validación de select:", validation);

  if (!validation.isValid) {
    validationMessage.value = validation.errorMessage || "";
    isValid.value = false;
  } else {
    validationMessage.value = "";
    isValid.value = true;
  }
};

// Manejador para cambios en el input de búsqueda
const handleSearchInput = (value: string) => {
  console.log("datos-sociedad.vue - Valor de búsqueda cambiado:", value);
  console.log("datos-sociedad.vue - Form completo:", form.value);
};

// Manejador de envío
const handleSubmit = () => {
  console.log("Formulario enviado:", form.value);
  alert(`Formulario enviado:\n${JSON.stringify(form.value, null, 2)}`);
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Formulario de Prueba</h1>
        <p class="text-gray-600 mt-2">
          Probando el componente NameInput con diferentes estilos
        </p>
      </div>

      <!-- Formulario -->
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <!-- Card principal -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">
            Datos Personales
          </h2>

          <div class="space-y-6">
            <!-- Input de nombre completo -->
            <div>
              <!-- <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label> -->
              <NameInput
                v-model="form.nombreCompleto"
                name-type="full"
                label="Nombre Completo"
                label-id="nombre-completo"
                :required="true"
                :show-character-count="true"
                custom-classes="h-12 text-lg font-medium"
                :auto-capitalize="true"
                @validation="handleTextValidation"
              />
            </div>

            <!-- Input de búsqueda -->
            <div>
              <SearchInput
                v-model="form.busqueda"
                label="Buscar en la base de datos"
                label-id="busqueda"
                placeholder="Ingrese el número"
                :show-search-icon="true"
                icon-position="right"
                :required="false"
                @validation="handleTextValidation"
                @input="handleSearchInput"
              />
            </div>

            <!-- Input de RUC -->
            <div>
              <RucInput
                v-model="form.ruc"
                label="RUC de la empresa"
                label-id="ruc-empresa"
                :required="true"
                :show-character-count="true"
                custom-classes="h-12 text-lg font-medium"
                @validation="handleTextValidation"
              />
            </div>

            <!-- Input de nombre -->
            <div>
              <SelectInput
                v-model="form.tipoSociedad"
                label="Tipo de Sociedad"
                :options="options"
                :required="true"
                placeholder="Agregar Nuevo"
                custom-classes="rounded-lg"
                @validation="handleSelectValidation"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <NameInput
                v-model="form.nombre"
                name-type="first"
                custom-classes="h-10 text-base"
                @validation="handleTextValidation"
              />
            </div>

            <!-- Input de apellido -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <NameInput
                v-model="form.apellido"
                name-type="last"
                custom-classes="h-10 text-base"
                @validation="handleTextValidation"
              />
            </div>
          </div>
        </div>

        <!-- Card de estilos diferentes -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">
            Diferentes Estilos
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Estilo pequeño -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Estilo Pequeño
              </label>
              <NameInput
                v-model="form.nombre"
                name-type="first"
                custom-classes="h-8 text-sm"
                placeholder="Input pequeño"
              />
            </div>

            <!-- Estilo grande -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Estilo Grande
              </label>
              <NameInput
                v-model="form.apellido"
                name-type="last"
                custom-classes="h-14 text-xl font-bold"
                placeholder="Input grande"
              />
            </div>

            <!-- Con borde personalizado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Borde Personalizado
              </label>
              <NameInput
                v-model="form.nombreCompleto"
                name-type="full"
                custom-classes="h-10 border-2 border-blue-300 focus:border-blue-500"
                placeholder="Borde azul"
              />
            </div>

            <!-- Con fondo personalizado -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Fondo Personalizado
              </label>
              <NameInput
                v-model="form.nombre"
                name-type="first"
                custom-classes="h-10 bg-gray-100 focus:bg-white"
                placeholder="Fondo gris"
              />
            </div>
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

        <!-- Valores actuales (para debug) -->
        <div class="bg-gray-100 rounded-lg p-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">
            Valores Actuales:
          </h3>
          <div class="text-sm text-gray-600 space-y-1">
            <p><strong>Nombre completo:</strong> "{{ form.nombreCompleto }}"</p>
            <p><strong>Búsqueda:</strong> "{{ form.busqueda }}"</p>
            <p><strong>RUC:</strong> "{{ form.ruc }}"</p>
            <p><strong>Tipo de Sociedad:</strong> "{{ form.tipoSociedad }}"</p>
            <p><strong>Nombre:</strong> "{{ form.nombre }}"</p>
            <p><strong>Apellido:</strong> "{{ form.apellido }}"</p>
            <p><strong>Válido:</strong> {{ isValid ? "Sí" : "No" }}</p>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            @click="
              form = {
                nombreCompleto: '',
                nombre: '',
                apellido: '',
                busqueda: '',
                ruc: '',
                tipoSociedad: '',
              }
            "
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
