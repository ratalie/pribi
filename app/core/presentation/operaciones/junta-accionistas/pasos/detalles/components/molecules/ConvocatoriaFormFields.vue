<template>
  <div class="flex flex-col gap-5">
    <!-- Modalidad (Presencial/Virtual) -->
    <div class="grid grid-cols-2 gap-4">
      <TitleH4 :title="metaDataUi?.title_1 || ''" :subtitle="metaDataUi?.subtitle_1 || ''" />

      <div class="flex flex-col gap-2">
        <label class="t-t2 font-secondary font-bold text-gray-800">Modalidad</label>
        <LabeledCardSwitch v-model="modoValue" :options="modalidadOptions" :columns="2" />
      </div>
    </div>

    <!-- Dirección o Link (según modalidad) -->
    <div
      :class="[
        'flex flex-col gap-5',
        borderInputs ? 'p-6 bg-white rounded-lg border border-gray-200' : '',
      ]"
    >
      <div class="flex flex-col gap-2">
        <TextInputZod
          v-model="direccionValue"
          :name="`${prefix}-direccion`"
          :label="modoValue === ModoReunion.IN_PERSON ? 'Dirección' : 'Link de la reunión'"
          :placeholder="
            modoValue === ModoReunion.IN_PERSON ? 'Ingrese la dirección' : 'Ingrese el link'
          "
          :schema="direccionSchema"
        />
      </div>

      <!-- Fecha y Hora -->
      <div class="grid grid-cols-2 gap-4">
        <DateInputZod
          v-model="fechaValue"
          :name="`${prefix}-fecha`"
          label="Fecha"
          placeholder="dd/mm/aaaa"
          :schema="fechaSchema"
        />
        <TimeInputZod
          v-model="horaValue"
          :name="`${prefix}-hora`"
          label="Hora"
          placeholder="--:--"
          :schema="horaSchema"
        />
      </div>

      <!-- Banner de información (opcional) -->
      <ConvocatoriaInfoBanner v-if="showInfoBanner && infoBannerText" :text="infoBannerText" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import LabeledCardSwitch from "~/components/base/Switch/LabeledCardSwitch.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
  import TextInputZod from "~/components/base/inputs/text/ui/TextInputZod.vue";
  import TimeInputZod from "~/components/base/inputs/text/ui/TimeInputZod.vue";
  import { ModoReunion } from "~/core/hexag/juntas/domain/enums/modo-reunion.enum";
  import { useConvocatoriaValidation } from "../../composables/useConvocatoriaValidation";
  import ConvocatoriaInfoBanner from "../atoms/ConvocatoriaInfoBanner.vue";

  interface Props {
    prefix: string; // 'primera' o 'segunda' o 'detalle'
    modo: ModoReunion;
    direccion: string;
    fecha?: string;
    hora?: string;
    metaDataUi?: { title_1: string; subtitle_1: string };
    borderInputs?: boolean;
    showInfoBanner?: boolean;
    infoBannerText?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    borderInputs: false,
    showInfoBanner: false,
    infoBannerText: "",
  });

  const emit = defineEmits<{
    "update:modo": [value: ModoReunion];
    "update:direccion": [value: string];
    "update:fecha": [value: string];
    "update:hora": [value: string];
  }>();

  const { direccionSchema, fechaSchema, horaSchema } = useConvocatoriaValidation();

  const modalidadOptions = [
    {
      label: "Presencial",
      value: ModoReunion.IN_PERSON,
    },
    {
      label: "Virtual",
      value: ModoReunion.VIRTUAL,
    },
  ];

  // Computed properties para v-model bidireccional
  const modoValue = computed({
    get: () => props.modo,
    set: (value) => emit("update:modo", value as ModoReunion),
  });

  const direccionValue = computed({
    get: () => props.direccion,
    set: (value) => emit("update:direccion", value),
  });

  const fechaValue = computed({
    get: () => props.fecha || "",
    set: (value) => emit("update:fecha", value),
  });

  const horaValue = computed({
    get: () => props.hora || "",
    set: (value) => emit("update:hora", value),
  });
</script>
