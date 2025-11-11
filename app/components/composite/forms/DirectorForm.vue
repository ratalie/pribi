<script setup lang="ts">
  import { computed } from "vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { tipoDocumentoOptions } from "~/constants/inputs/document-type";
  import { tipoDirectoresOptions } from "~/constants/tipo-director";
  import { useDirectoresComputed } from "~/modules/registro-sociedades/composables/useDirectoresComputed";
  import {
    apellidoMaternoSchema,
    apellidoPaternoSchema,
    nombreAccionistaSchema,
    numeroDocumentoSchema,
    tipoDocumentoSchema,
  } from "~/modules/registro-sociedades/schemas/modalAccionistas";
  import {
    reemplazoAsignadoSchema,
    tipoDirectorSchema,
  } from "~/modules/registro-sociedades/schemas/modalDirector";
  import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
  import { TiposDirectoresEnum } from "~/types/enums/TiposDirectoresEnum";

  const personaNaturalStore = usePersonaNaturalStore();

  const props = defineProps<{
    tipoDirector: TiposDirectoresEnum | "";
    reemplazoAsignado: string;
  }>();

  const emits = defineEmits<{
    (e: "update:tipoDirector", value: TiposDirectoresEnum | ""): void;
    (e: "update:reemplazoAsignado", value: string): void;
  }>();

  const tipoDirector = computed({
    get: () => props.tipoDirector,
    set: (value: TiposDirectoresEnum | "") => emits("update:tipoDirector", value),
  });

  const reemplazoAsignado = computed({
    get: () => props.reemplazoAsignado,
    set: (value: string) => emits("update:reemplazoAsignado", value),
  });

  const { presidenteOptions } = useDirectoresComputed();
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <SelectInputZod
      v-model="personaNaturalStore.tipoDocumento"
      name="tipo_documento"
      label="Tipo de documento"
      placeholder="Selecciona el tipo de documento"
      :options="tipoDocumentoOptions"
      :schema="tipoDocumentoSchema"
    />

    <SearchInputZod
      v-model="personaNaturalStore.numeroDocumento"
      name="numero_documento"
      label="Número de documento"
      placeholder="Ingrese número de documento"
      :schema="numeroDocumentoSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.nombre"
      name="nombre"
      label="Nombres"
      placeholder="Nombres"
      :schema="nombreAccionistaSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.apellidoPaterno"
      name="apellido_paterno"
      label="Apellido paterno"
      placeholder="Apellido paterno"
      :schema="apellidoPaternoSchema"
    />

    <TextInputZod
      v-model="personaNaturalStore.apellidoMaterno"
      name="apellido_materno"
      label="Apellido materno"
      placeholder="Apellido materno"
      :schema="apellidoMaternoSchema"
    />

    <SelectInputZod
      v-model="tipoDirector"
      name="tipo_director"
      label="Tipo de director"
      placeholder="Selecciona el tipo de director"
      :options="tipoDirectoresOptions"
      :schema="tipoDirectorSchema"
    />

    <SelectInputZod
      v-if="tipoDirector === TiposDirectoresEnum.ALTERNO"
      v-model="reemplazoAsignado"
      name="reemplazo_asignado"
      label="Director titular de reemplazo"
      placeholder="Selecciona el director titular"
      :options="presidenteOptions"
      :schema="reemplazoAsignadoSchema"
    />
  </div>
</template>
