<template>
  <div>
    <!-- Campos del formulario -->
    <ConvocatoriaFormFields
      prefix="detalle"
      :modo="modo"
      :direccion="direccion"
      :fecha="fecha"
      :hora="hora"
      :meta-data-ui="metaDataUi"
      :border-inputs="true"
      @update:modo="$emit('update:modo', $event)"
      @update:direccion="$emit('update:direccion', $event)"
      @update:fecha="$emit('update:fecha', $event)"
      @update:hora="$emit('update:hora', $event)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { ModoReunion } from "~/core/hexag/juntas/domain/enums/modo-reunion.enum";
  import ConvocatoriaFormFields from "./ConvocatoriaFormFields.vue";

  interface Props {
    title: string;
    subtitle: string;
    modo: ModoReunion;
    direccion: string;
    fecha?: string;
    hora?: string;
  }

  defineProps<Props>();

  defineEmits<{
    "update:modo": [value: ModoReunion];
    "update:direccion": [value: string];
    "update:fecha": [value: string];
    "update:hora": [value: string];
  }>();

  const metaDataUi = {
    title_1: "Detalles de la Junta",
    subtitle_1: "Indica el lugar, fecha y hora de realización de la junta",
  };
</script>
