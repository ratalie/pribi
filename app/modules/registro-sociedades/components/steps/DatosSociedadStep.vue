<script setup lang="ts">
  import { Form } from "vee-validate";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
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
  <!-- Formulario principal -->
  <div class="bg-white p-14">
    <CardTitle
      title="Datos principales"
      body="Complete todos los datos requeridos."
      class="mb-8"
    />
    <!-- Formulario -->
    <Form
      class="grid grid-cols-2 gap-14"
      @submit="handleSubmit"
      @invalid-submit="handleInvalidSubmit"
    >
      <SearchInputZod
        v-model="form.numeroRuc"
        name="numero-ruc"
        label="Número de RUC"
        placeholder="Ingrese el número de RUC"
        :schema="rucSchema"
        :is-loading="isLoadingRuc"
        @search="handleSearchRuc"
      />

      <SelectInputZod
        v-model="form.tipoSociedad"
        :options="societyOptions"
        name="tipo-sociedad"
        label="Tipo de Sociedad"
        placeholder="Ingrese el tipo de sociedad"
        :schema="tipoSociedadSchema"
      />

      <TextInputZod
        v-model="form.razonSocial"
        name="razon-social"
        label="Razón Social"
        placeholder="Ingrese la razón social"
        :schema="razonSocialSchema"
      />

      <TextInputZod
        v-model="form.nombreComercial"
        name="nombre-comercial"
        label="Nombre Comercial"
        placeholder="Ingrese el nombre comercial"
        :schema="nombreComercialSchema"
      />

      <TextInputZod
        v-model="form.direccion"
        name="direccion"
        label="Dirección"
        placeholder="Ingrese la dirección"
        :schema="direccionSchema"
      />

      <TextInputZod
        v-model="form.distrito"
        name="distrito"
        label="Distrito"
        placeholder="Ingrese el distrito"
        :schema="distritoSchema"
      />

      <TextInputZod
        v-model="form.provincia"
        name="provincia"
        label="Provincia"
        placeholder="Ingrese la provincia"
        :schema="provinciaSchema"
      />

      <TextInputZod
        v-model="form.departamento"
        name="departamento"
        label="Departamento"
        placeholder="Ingrese el departamento"
        :schema="departamentoSchema"
      />

      <DateInputZod
        v-model="form.fechaInscripcionRuc"
        name="fecha-inscripcion-ruc"
        label="Fecha de Inscripción de RUC"
        placeholder="Ingrese la fecha de inscripción de RUC"
        :schema="fechaInscripcionRucSchema"
      />

      <TextInputZod
        v-model="form.actividadExterior"
        name="actividad-exterior"
        label="Actividad Exterior"
        placeholder="Ingrese la actividad exterior"
        :schema="actividadExteriorSchema"
      />

      <DateInputZod
        v-model="form.fechaEscrituraPublica"
        name="fecha-escritura-publica"
        label="Fecha de Escritura Pública"
        placeholder="Ingrese la fecha de escritura pública"
        :schema="fechaEscrituraPublicaSchema"
      />

      <DateInputZod
        v-model="form.fechaRegistrosPublicos"
        name="fecha-registros-publicos"
        label="Fecha de Registros Públicos"
        placeholder="Ingrese la fecha de registros públicos"
        :schema="fechaRegistrosPublicosSchema"
      />

      <SelectInputZod
        v-model="form.oficinaRegistral"
        :options="officeSelectOptions"
        name="oficina-registral"
        label="Oficina Registral"
        placeholder="Ingrese la oficina registral"
        :schema="oficinaRegistralSchema"
      />

      <TextInputZod
        v-model="form.partidaRegistral"
        name="partida-registral"
        label="Partida Registral"
        placeholder="Ingrese la partida registral"
        :schema="partidaRegistralSchema"
      />
    </Form>
  </div>
</template>
