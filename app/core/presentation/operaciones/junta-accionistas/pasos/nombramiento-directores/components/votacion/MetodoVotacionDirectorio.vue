<script setup lang="ts">
  import { computed } from "vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import MayoriaVotacionDirectorio from "./MayoriaVotacionDirectorio.vue";
  import UnanimidadVotacionDirectorio from "./UnanimidadVotacionDirectorio.vue";

  interface Props {
    modelValue?: string;
    candidatosSeleccionados?: string[];
    title?: string;
    subtitle?: string;
    titleColor?: string;
    preguntas?: string[];
    accionistas?: string[];
    mensajeAprobacion?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: "unanimidad",
    candidatosSeleccionados: () => [],
    title: "Votación para la designación de directores",
    subtitle: "Votación para aprobar la designación de los directores propuestos.",
    titleColor: "text-primary-800",
    preguntas: () => [],
    accionistas: () => [],
    mensajeAprobacion: "la designación de los directores propuestos.",
  });

  const emit = defineEmits<{
    "update:modelValue": [value: string];
    "update:candidatosSeleccionados": [candidatos: string[]];
    "cambiar-tipo": [tipo: "unanimidad" | "mayoria"];
    "cambiar-voto": [accionistaId: string, valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"];
  }>();

  const selectedMethod = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit("update:modelValue", value);
      emit("cambiar-tipo", value as "unanimidad" | "mayoria");
    },
  });

  const candidatosSeleccionados = computed({
    get: () => props.candidatosSeleccionados || [],
    set: (value) => emit("update:candidatosSeleccionados", value),
  });

  const methods = [
    {
      id: "unanimidad",
      title: "Votación por unanimidad",
      subtitle: "Todos los accionistas votan en conjunto",
      icon: "ph:handshake",
    },
    {
      id: "mayoria",
      title: "Votación por mayoría",
      subtitle: "Se requiere mayoría de votos",
      icon: "ph:scales",
    },
  ];
</script>

<template>
  <SlotWrapper>
    <TitleH2 :title="props.title" :subtitle="props.subtitle" :title-color="props.titleColor" />

    <p class="t-h5 text-gray-800 font-primary">Método de votación</p>
    <div class="flex gap-8">
      <div
        v-for="method in methods"
        :key="method.id"
        @click="selectedMethod = method.id"
        :class="[
          'relative w-full rounded-xl border-2 p-6 cursor-pointer transition-all duration-200',
          'flex items-center gap-4',
          selectedMethod === method.id
            ? 'border-primary-700 shadow-md bg-primary-25'
            : 'border-gray-200 hover:border-primary-300 bg-white',
        ]"
      >
        <!-- Icono -->
        <div
          :class="[
            'shrink-0 flex items-center',
            selectedMethod === method.id ? 'text-primary-700' : 'text-gray-600',
          ]"
        >
          <Icon :name="method.icon" size="32" />
        </div>

        <!-- Contenido de texto -->
        <div class="flex-1 flex flex-col gap-1">
          <div class="flex items-center justify-between gap-4">
            <h3
              :class="[
                't-2 font-semibold font-secondary',
                selectedMethod === method.id ? 'text-gray-900' : 'text-gray-800',
              ]"
            >
              {{ method.title }}
            </h3>
            <!-- Checkmark circular -->
            <div
              :class="[
                'shrink-0 w-4 h-4 rounded-full flex items-center justify-center',
                selectedMethod === method.id
                  ? 'bg-primary-700'
                  : 'bg-white border-2 border-gray-400',
              ]"
            >
              <svg
                v-if="selectedMethod === method.id"
                class="w-2.5 h-2.5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <p
            :class="[
              't-b2 font-secondary',
              selectedMethod === method.id ? 'text-gray-600' : 'text-gray-500',
            ]"
          >
            {{ method.subtitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- Contenido condicional según el método seleccionado -->
    <div class="mt-10">
      <UnanimidadVotacionDirectorio
        v-if="selectedMethod === 'unanimidad'"
        v-model:candidatos-seleccionados="candidatosSeleccionados"
      />
      <MayoriaVotacionDirectorio
        v-if="selectedMethod === 'mayoria'"
        :preguntas="props.preguntas"
        :accionistas="props.accionistas"
        :mensaje-aprobacion="props.mensajeAprobacion"
        @cambiar-voto="
          (accionistaId: string, valor: 'A_FAVOR' | 'EN_CONTRA' | 'ABSTENCION') =>
            emit('cambiar-voto', accionistaId, valor)
        "
      />
    </div>
  </SlotWrapper>
</template>
