<script setup lang="ts">
  import { Form } from "vee-validate";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import SwitchTabs from "~/components/base/Switch/SwitchTabs.vue";
  import Switch from "~/components/ui/switch/Switch.vue";
  import { officeOptions } from "~/constants/inputs/office-options";
  import { societyTypeOptions } from "~/constants/inputs/society-types";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import type { TypeOption } from "~/types/TypeOptions";
  import {
    actividadExteriorSchema,
    departamentoSchema,
    direccionSchema,
    distritoSchema,
    fechaEscrituraPublicaSchema,
    fechaInscripcionRucSchema,
    fechaRegistrosPublicosSchema,
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
    fechaInscripcionRuc: "",
    actividadExterior: "",
    fechaEscrituraPublica: "",
    fechaRegistrosPublicos: "",
    partidaRegistral: "",
    oficinaRegistral: "",
  });

  // Opciones tipadas
  const societyOptions: TypeOption[] = societyTypeOptions;
  const officeSelectOptions: TypeOption[] = officeOptions;

  const isLoadingRuc = ref(false);
  const isActive = ref(true);

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

  // Fecha seleccionada
</script>

<template>
  <div class="min-h-screen">
    <!-- Formulario principal -->
    <div class="bg-white p-8">
      <SimpleSwitchYesNo />

      <!-- Ejemplo 2: Con un botón -->
      <CardTitle
        title="Datos principales"
        body="Complete todos los datos requeridos."
        class="mb-8"
      >
        <template #actions>
          <BaseButton variant="primary" size="md">Guardar</BaseButton>
        </template>
      </CardTitle>

      <!-- Ejemplo 3: Con un icono (descomenta para usar) -->
      <CardTitle
        title="Datos principales"
        body="Complete todos los datos requeridos."
        class="mb-8"
      >
        <template #actions>
          <button
            class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </template>
      </CardTitle>

      <!-- Ejemplo 6: Con badge pegado al título -->
      <CardTitle
        title="Datos principales"
        body="Complete todos los datos requeridos."
        class="mb-8"
      >
        <template #switch>
          <span class="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            Nuevo
          </span>
        </template>
        <template #actions>
          <BaseButton variant="primary" size="md">Guardar</BaseButton>
        </template>
      </CardTitle>

      <!-- Ejemplo 7: Solo con switch, sin actions -->
      <CardTitle
        title="Datos principales"
        body="Active o desactive esta sección."
        class="mb-8"
      >
        <template #switch>
          <Switch v-model:checked="isActive" />
        </template>
      </CardTitle>

      <SwitchTabs opcion-a="El Directorio" opcion-b="La Junta de Accionistas">
        <template #opcion-a>
          <div>EL DIRECTORIO</div>
        </template>
        <template #opcion-b>
          <div>LA JUNTA DE ACCIONISTAS</div>
        </template>
      </SwitchTabs>

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

        <DateInputZod
          v-model="form.fechaInscripcionRuc"
          name="fecha-inscripcion-ruc"
          label="Fecha de Inscripción de RUC (Zod)"
          placeholder="Ingrese la fecha de inscripción de RUC"
          :schema="fechaInscripcionRucSchema"
        />

        <TextInputZod
          v-model="form.actividadExterior"
          name="actividad-exterior"
          label="Actividad Exterior (Zod)"
          placeholder="Ingrese la actividad exterior"
          :schema="actividadExteriorSchema"
        />

        <DateInputZod
          v-model="form.fechaEscrituraPublica"
          name="fecha-escritura-publica"
          label="Fecha de Escritura Pública (Zod)"
          placeholder="Ingrese la fecha de escritura pública"
          :schema="fechaEscrituraPublicaSchema"
        />

        <DateInputZod
          v-model="form.fechaRegistrosPublicos"
          name="fecha-registros-publicos"
          label="Fecha de Registros Públicos (Zod)"
          placeholder="Ingrese la fecha de registros públicos"
          :schema="fechaRegistrosPublicosSchema"
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
