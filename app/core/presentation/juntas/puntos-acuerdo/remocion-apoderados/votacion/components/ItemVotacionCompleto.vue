<template>
  <div class="flex flex-col gap-6 border-2 border-gray-200 rounded-xl p-6">
    <!-- Título del Item -->
    <div class="flex flex-col gap-2">
      <p class="t-h5 font-semibold font-secondary text-gray-800">
        Votación {{ itemIndex + 1 }}: {{ pregunta }}
      </p>
      <p class="t-b2 text-gray-600 font-secondary">
        {{ descripcion || `Votación sobre la remoción del apoderado ${itemIndex + 1}` }}
      </p>
    </div>

    <!-- Método de Votación -->
    <div class="flex flex-col gap-4">
      <p class="t-h5 text-gray-800 font-primary">Método de votación</p>
      <div class="flex gap-8">
        <div
          v-for="method in methods"
          :key="method.id"
          @click="selectedMethod = method.id as 'unanimidad' | 'mayoria'"
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
    </div>

    <!-- Emisión de Votos -->
    <div class="flex flex-col gap-4 mt-4">
      <UnanimidadVotacion
        v-if="selectedMethod === 'unanimidad'"
        :mensaje-confirmacion="mensajeUnanimidad"
      />
      <MayoriaVotacionItem
        v-if="selectedMethod === 'mayoria'"
        :pregunta="pregunta"
        :pregunta-index="itemIndex"
        :votantes="votantes"
        :get-voto="getVoto"
        :votacion-store="votacionStore"
        :mensaje-aprobacion="mensajeAprobacion"
        @cambiar-voto="
          (accionistaId, valor) => $emit('cambiar-voto', accionistaId, valor, itemIndex)
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
  import UnanimidadVotacion from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/UnanimidadVotacion.vue";
  import MayoriaVotacionItem from "./MayoriaVotacionItem.vue";

  interface Votante {
    id: string;
    accionistaId: string;
    accionista: {
      id: string;
      person: {
        tipo: string;
        nombre?: string;
        apellidoPaterno?: string;
        apellidoMaterno?: string;
        razonSocial?: string;
      };
    };
    nombreCompleto?: string;
    accionesConDerechoVoto?: number;
  }

  interface Props {
    itemIndex: number;
    pregunta: string;
    descripcion?: string;
    votantes?: Votante[] | any;
    getVoto?: (accionistaId: string) => "A_FAVOR" | "EN_CONTRA" | "ABSTENCION" | null;
    votacionStore?: any;
    mensajeAprobacion?: string;
    mensajeUnanimidad?: string;
    tipoAprobacionInicial?: VoteAgreementType;
  }

  const props = withDefaults(defineProps<Props>(), {
    descripcion: "",
    mensajeAprobacion: "la remoción del apoderado.",
    mensajeUnanimidad: "",
    tipoAprobacionInicial: VoteAgreementType.SOMETIDO_A_VOTACION,
  });

  const emit = defineEmits<{
    "cambiar-tipo": [itemIndex: number, tipo: "unanimidad" | "mayoria"];
    "cambiar-voto": [
      accionistaId: string,
      valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION",
      itemIndex: number
    ];
  }>();

  // Determinar método inicial desde el store o desde props
  const metodoInicial = computed<"unanimidad" | "mayoria">(() => {
    if (props.votacionStore && props.votacionStore.sesionVotacion) {
      const item = props.votacionStore.sesionVotacion.items[props.itemIndex];
      if (item) {
        return item.tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS
          ? ("unanimidad" as const)
          : ("mayoria" as const);
      }
    }
    return props.tipoAprobacionInicial === VoteAgreementType.APROBADO_POR_TODOS
      ? ("unanimidad" as const)
      : ("mayoria" as const);
  });

  const selectedMethod = ref<"unanimidad" | "mayoria">(metodoInicial.value);

  // Observar cambios en el store para actualizar el método seleccionado
  watch(
    () => {
      if (props.votacionStore && props.votacionStore.sesionVotacion) {
        const item = props.votacionStore.sesionVotacion.items[props.itemIndex];
        return item?.tipoAprobacion;
      }
      return null;
    },
    (tipoAprobacion) => {
      if (tipoAprobacion) {
        selectedMethod.value =
          tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS ? "unanimidad" : "mayoria";
      }
    },
    { deep: true }
  );

  // Observar cambios en selectedMethod para actualizar el store
  watch(selectedMethod, (newMethod) => {
    emit("cambiar-tipo", props.itemIndex, newMethod);
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

  // Mensaje de unanimidad específico para este item
  const mensajeUnanimidad = computed(() => {
    if (props.mensajeUnanimidad) {
      return props.mensajeUnanimidad;
    }
    return `Confirmo que todos los accionistas están de acuerdo con ${props.pregunta}`;
  });
</script>
