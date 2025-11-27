<script setup lang="ts">
  import { computed } from "vue";
  import SearchInputZod from "~/components/base/inputs/text/ui/SearchInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import { tipoDocumentoOptions } from "~/constants/inputs/document-type";
  import { tipoDirectoresOptions } from "~/constants/tipo-director";
  import {
    apellidoMaternoSchema,
    apellidoPaternoSchema,
    nombreAccionistaSchema,
    numeroDocumentoSchema,
    tipoDocumentoSchema,
  } from "~/core/presentation/registros/sociedades/pasos/accionistas/schemas/modalAccionistas";
  import { TiposDirectoresEnum } from "~/core/presentation/registros/sociedades/pasos/directorio/enums/TiposDirectoresEnum";
  import {
    reemplazoAsignadoSchema,
    tipoDirectorSchema,
  } from "~/core/presentation/registros/sociedades/pasos/directorio/schemas/modal/modalDirector";
  import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
  import type { TypeOption } from "~/types/TypeOptions";

  const personaNaturalStore = usePersonaNaturalStore();

  const props = defineProps<{
    tipoDirector: TiposDirectoresEnum | "";
    reemplazoAsignado: string;
    presidenteOptions?: TypeOption[];
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

  const presidenteOptions = computed(() => props.presidenteOptions || []);
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
