<script setup lang="ts">
  import { Form } from "vee-validate";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { civilState } from "~/constants/civil-state";
  import { documentTypes } from "~/constants/inputs/document-type";
  import {
    apellidoMaternoSchema,
    apellidoPaternoSchema,
    estadoCivilSchema,
    nombreAccionistaSchema,
    numeroDocumentoSchema,
    tipoDocumentoSchema,
  } from "~/modules/registro-sociedades/schemas/modalAccionistas";

  const form = ref({
    tipo_documento: "",
    numero_documento: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    estado_civil: "",
  });

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
  <Form
    class="grid grid-cols-2 gap-12"
    @submit="handleSubmit"
    @invalid-submit="handleInvalidSubmit"
  >
    <SelectInputZod
      v-model="form.tipo_documento"
      name="tipo_documento"
      label="Tipo de documento"
      placeholder="Selecciona el tipo de documento"
      :options="documentTypes"
      :schema="tipoDocumentoSchema"
    />

    <SearchInputZod
      v-model="form.numero_documento"
      name="numero_documento"
      label="Número de documento"
      placeholder="Ingrese número de documento"
      :schema="numeroDocumentoSchema"
    />

    <TextInputZod
      v-model="form.nombre"
      name="nombre"
      label="Nombres"
      placeholder="Nombres"
      :schema="nombreAccionistaSchema"
    />

    <TextInputZod
      v-model="form.apellido_paterno"
      name="apellido_paterno"
      label="Apellido paterno"
      placeholder="Apellido paterno"
      :schema="apellidoPaternoSchema"
    />

    <TextInputZod
      v-model="form.apellido_materno"
      name="apellido_materno"
      label="Apellido materno"
      placeholder="Apellido materno"
      :schema="apellidoMaternoSchema"
    />

    <SelectInputZod
      v-model="form.estado_civil"
      name="estado_civil"
      label="Estado civil"
      placeholder="Selecciona el estado civil"
      :options="civilState"
      :schema="estadoCivilSchema"
    />

    <button type="submit">aceptar</button>
  </Form>
</template>
