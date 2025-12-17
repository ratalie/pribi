<template>
  <div class="flex flex-col gap-4">
    <p class="t-h5 font-semibold font-secondary text-gray-800">Emisión de Votos</p>
    <SimpleCard>
      <div class="flex flex-col gap-6">
        <!-- Pregunta -->
        <p class="font-primary text-gray-800 t-t1">
          {{ pregunta }}
        </p>

        <!-- Tabla de Votación -->
        <div class="flex flex-col">
          <!-- Headers -->
          <div class="flex border-b border-gray-100 pb-3 mb-3">
            <div class="flex-1">
              <p class="font-primary text-gray-800 t-b1 font-semibold">Accionistas</p>
            </div>
            <div class="flex-2">
              <p class="font-primary text-gray-800 t-b1 font-semibold">Votos</p>
            </div>
          </div>

          <!-- Filas de Accionistas -->
          <div
            v-for="(votante, accionistaIndex) in listaVotantes"
            :key="votante.id || accionistaIndex"
            class="flex flex-col"
          >
            <div class="flex items-center py-4">
              <!-- Columna 1: Nombre del Accionista -->
              <div class="flex-1">
                <p class="font-secondary text-gray-600 font-medium t-b1">
                  {{ votante.nombreCompleto || `Votante ${accionistaIndex + 1}` }}
                </p>
              </div>

              <!-- Columna 2: Opciones de Votación -->
              <div class="flex-2">
                <div class="flex gap-[10px] w-full">
                  <div
                    v-for="opcion in opcionesVoto"
                    :key="opcion.id"
                    @click="setVoto(accionistaIndex, opcion.id)"
                    :class="[
                      'flex flex-col items-center gap-2 rounded-xl border-2 p-3 cursor-pointer transition-all duration-200 flex-1',
                      getVotoSeleccionado(accionistaIndex) === opcion.id
                        ? 'border-primary-700 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300',
                    ]"
                  >
                    <Icon
                      :name="opcion.icono"
                      size="18"
                      :class="
                        getVotoSeleccionado(accionistaIndex) === opcion.id
                          ? 'text-primary-700'
                          : 'text-gray-600'
                      "
                    />
                    <span class="t-t2 font-secondary font-medium">
                      {{ opcion.label }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Línea separadora -->
            <div
              v-if="accionistaIndex < listaVotantes.length - 1"
              class="w-full h-px bg-gray-100"
            />
          </div>
        </div>

        <!-- Barra de Progreso -->
        <div class="flex flex-col gap-4 mt-4 w-full">
          <div class="w-full h-[10px] bg-gray-400 rounded-full overflow-hidden flex">
            <div
              v-if="getPorcentajeAFavor() > 0"
              :style="{ width: `${getPorcentajeAFavor()}%` }"
              class="bg-primary-700 h-full"
            />
            <div
              v-if="getPorcentajeEnContra() > 0"
              :style="{ width: `${getPorcentajeEnContra()}%` }"
              class="bg-primary-900 h-full"
            />
            <div
              v-if="getPorcentajeAbstencion() > 0"
              :style="{ width: `${getPorcentajeAbstencion()}%` }"
              class="bg-primary-100 h-full"
            />
          </div>

          <!-- Cards de Resumen -->
          <div class="flex w-full gap-[10px]">
            <!-- A Favor -->
            <div
              class="flex items-center gap-3 border border-gray-100 px-[20px] py-[10px] rounded-xl flex-1"
            >
              <div class="w-[13px] h-[13px] rounded-full bg-primary-700 shrink-0" />
              <div class="flex flex-col">
                <p class="font-secondary text-gray-700 t-t2 font-medium">A favor</p>
                <p class="font-primary t-h5 font-semibold">
                  {{ getPorcentajeAFavor().toFixed(1) }}%
                </p>
              </div>
            </div>

            <!-- En Contra -->
            <div
              class="flex items-center gap-3 border border-gray-100 px-[20px] py-[10px] rounded-xl flex-1"
            >
              <div class="w-[13px] h-[13px] rounded-full bg-primary-900 shrink-0" />
              <div class="flex flex-col">
                <p class="font-secondary text-gray-700 t-t2 font-medium">En contra</p>
                <p class="font-primary t-h5 font-semibold">
                  {{ getPorcentajeEnContra().toFixed(1) }}%
                </p>
              </div>
            </div>

            <!-- Abstención -->
            <div
              class="flex items-center gap-3 border border-gray-100 px-[20px] py-[10px] rounded-xl flex-1"
            >
              <div class="w-[13px] h-[13px] rounded-full bg-primary-100 shrink-0" />
              <div class="flex flex-col">
                <p class="font-secondary text-gray-700 t-t2 font-medium">Abstención</p>
                <p class="font-primary t-h5 font-semibold">
                  {{ getPorcentajeAbstencion().toFixed(1) }}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimpleCard>

    <!-- Resultados de la votación -->
    <div class="flex flex-col gap-4">
      <p class="t-h5 font-semibold font-secondary text-gray-800">Resultados de la votación</p>
      <div
        class="w-full rounded-[8px] border border-primary-100 bg-primary-25 flex justify-center items-center py-4 px-6"
      >
        <p class="font-secondary t-t2 text-primary-800 text-center">
          <template v-if="getPorcentajeAFavor() > 50">
            Se
            <span class="font-semibold">aprobó</span>
            {{ mensajeAprobacion }}
          </template>
          <template v-else>
            No se
            <span class="font-semibold">aprobó</span>
            {{ mensajeAprobacion }}
          </template>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";

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
    pregunta: string;
    preguntaIndex: number;
    votantes?: Votante[] | any;
    getVoto?: (accionistaId: string) => "A_FAVOR" | "EN_CONTRA" | "ABSTENCION" | null;
    votacionStore?: any;
    mensajeAprobacion?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    mensajeAprobacion: "la remoción del apoderado.",
  });

  const emit = defineEmits<{
    "cambiar-voto": [
      accionistaId: string,
      valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION",
      preguntaIndex: number
    ];
  }>();

  // Extraer votantes
  const listaVotantes = computed(() => {
    const v = props.votantes;
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === "object" && "value" in v) return (v as any).value || [];
    return [];
  });

  type Voto = "A_FAVOR" | "EN_CONTRA" | "ABSTENCION" | null;

  // Estado de votos: [accionistaIndex] = voto
  const votos = ref<Voto[]>(Array(listaVotantes.value.length).fill(null));

  // Cargar votos existentes del store o función getVoto
  const cargarVotosExistentes = () => {
    try {
      // Si hay función getVoto, usarla
      if (props.getVoto) {
        const getVotoFn =
          typeof props.getVoto === "function"
            ? props.getVoto
            : (props.getVoto as any)?.value || props.getVoto;

        listaVotantes.value.forEach((votante: Votante, index: number) => {
          const voto = getVotoFn(votante.accionistaId);
          votos.value[index] = voto;
        });
        return;
      }

      // Si hay store, cargar desde el store
      if (
        props.votacionStore &&
        props.votacionStore.hasVotacion &&
        props.votacionStore.sesionVotacion
      ) {
        const sesion = props.votacionStore.sesionVotacion;
        const item = sesion.items[props.preguntaIndex];
        if (item) {
          listaVotantes.value.forEach((votante: Votante, accionistaIndex: number) => {
            const voto = item.votos.find((v: any) => v.accionistaId === votante.accionistaId);
            if (voto) {
              votos.value[accionistaIndex] = voto.valor as Voto;
            }
          });
        }
      }
    } catch (error) {
      console.error("[MayoriaVotacionItem] Error al cargar votos:", error);
    }
  };

  // Cargar votos al montar
  cargarVotosExistentes();

  // Observar cambios en el store para recargar votos
  if (props.votacionStore) {
    watch(
      () => [
        props.votacionStore.hasVotacion,
        props.votacionStore.sesionVotacion?.items?.[props.preguntaIndex]?.votos,
        listaVotantes.value.length,
      ],
      () => {
        cargarVotosExistentes();
      },
      { deep: true, immediate: false }
    );
  }

  // Observar cambios en votantes
  watch(
    () => listaVotantes.value,
    () => {
      votos.value = Array(listaVotantes.value.length).fill(null);
      cargarVotosExistentes();
    },
    { deep: true, immediate: false }
  );

  const opcionesVoto = [
    {
      id: "A_FAVOR" as const,
      label: "A favor",
      icono: "fluent:checkmark-circle-12-filled",
    },
    {
      id: "EN_CONTRA" as const,
      label: "En contra",
      icono: "fluent:dismiss-circle-12-filled",
    },
    {
      id: "ABSTENCION" as const,
      label: "Abstención",
      icono: "fluent:block-16-filled",
    },
  ];

  const setVoto = (accionistaIndex: number, voto: Voto) => {
    const votante = listaVotantes.value[accionistaIndex];
    if (!votante) return;

    const currentVoto = votos.value[accionistaIndex] === voto ? null : voto;
    votos.value[accionistaIndex] = currentVoto;

    // Emitir evento para guardar en el store
    if (currentVoto) {
      emit("cambiar-voto", votante.accionistaId, currentVoto, props.preguntaIndex);
    }
  };

  const getVotoSeleccionado = (accionistaIndex: number): Voto => {
    return votos.value[accionistaIndex] || null;
  };

  // Calcular porcentajes basados en ACCIONES
  const getPorcentajeAFavor = () => {
    if (listaVotantes.value.length === 0) return 0;

    const totalAcciones = listaVotantes.value.reduce(
      (sum: number, votante: Votante) => sum + (votante.accionesConDerechoVoto || 0),
      0
    );

    if (totalAcciones === 0) return 0;

    const accionesAFavor = listaVotantes.value.reduce(
      (sum: number, votante: Votante, index: number) => {
        const voto = votos.value[index];
        if (voto === "A_FAVOR") {
          return sum + (votante.accionesConDerechoVoto || 0);
        }
        return sum;
      },
      0
    );

    return (accionesAFavor / totalAcciones) * 100;
  };

  const getPorcentajeEnContra = () => {
    if (listaVotantes.value.length === 0) return 0;

    const totalAcciones = listaVotantes.value.reduce(
      (sum: number, votante: Votante) => sum + (votante.accionesConDerechoVoto || 0),
      0
    );

    if (totalAcciones === 0) return 0;

    const accionesEnContra = listaVotantes.value.reduce(
      (sum: number, votante: Votante, index: number) => {
        const voto = votos.value[index];
        if (voto === "EN_CONTRA") {
          return sum + (votante.accionesConDerechoVoto || 0);
        }
        return sum;
      },
      0
    );

    return (accionesEnContra / totalAcciones) * 100;
  };

  const getPorcentajeAbstencion = () => {
    if (listaVotantes.value.length === 0) return 0;

    const totalAcciones = listaVotantes.value.reduce(
      (sum: number, votante: Votante) => sum + (votante.accionesConDerechoVoto || 0),
      0
    );

    if (totalAcciones === 0) return 0;

    const accionesAbstencion = listaVotantes.value.reduce(
      (sum: number, votante: Votante, index: number) => {
        const voto = votos.value[index];
        if (voto === "ABSTENCION") {
          return sum + (votante.accionesConDerechoVoto || 0);
        }
        return sum;
      },
      0
    );

    return (accionesAbstencion / totalAcciones) * 100;
  };
</script>
