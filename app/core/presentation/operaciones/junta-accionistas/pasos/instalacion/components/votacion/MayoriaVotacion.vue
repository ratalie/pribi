<template>
  <div class="flex flex-col gap-4">
    <p class="t-h5 font-semibold font-secondary text-gray-800">Emisión de Votos</p>
    <SimpleCard>
      <div
        v-for="(pregunta, preguntaIndex) in preguntas"
        :key="preguntaIndex"
        class="flex flex-col gap-6"
      >
        <!-- Pregunta -->
        <p class="font-primary text-gray-800 t-t1">
          {{ pregunta }}
        </p>

        <!-- Tabla de Votación -->
        <div class="flex flex-col">
          <!-- Headers -->
          <div class="flex border-b border-gray-100 pb-3 mb-3">
            <div class="flex-[1]">
              <p class="font-primary text-gray-800 t-b1 font-semibold">Accionistas</p>
            </div>
            <div class="flex-[2]">
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
              <div class="flex-[1]">
                <p class="font-secondary text-gray-600 font-medium t-b1">
                  {{ votante.nombreCompleto || `Votante ${accionistaIndex + 1}` }}
                </p>
              </div>

              <!-- Columna 2: Opciones de Votación -->
              <div class="flex-[2]">
                <div class="flex gap-[10px] w-full">
                  <div
                    v-for="opcion in opcionesVoto"
                    :key="opcion.id"
                    @click="setVoto(accionistaIndex, preguntaIndex, opcion.id)"
                    :class="[
                      'flex flex-col items-center gap-2 rounded-xl border-2 p-3 cursor-pointer transition-all duration-200 flex-1',
                      getVotoSeleccionado(accionistaIndex, preguntaIndex) === opcion.id
                        ? 'border-primary-700 bg-primary-50 text-primary-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-primary-300',
                    ]"
                  >
                    <Icon
                      :name="opcion.icono"
                      size="18"
                      :class="
                        getVotoSeleccionado(accionistaIndex, preguntaIndex) === opcion.id
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
              v-if="getPorcentajeAFavor(preguntaIndex) > 0"
              :style="{ width: `${getPorcentajeAFavor(preguntaIndex)}%` }"
              class="bg-primary-700 h-full"
            />
            <div
              v-if="getPorcentajeEnContra(preguntaIndex) > 0"
              :style="{ width: `${getPorcentajeEnContra(preguntaIndex)}%` }"
              class="bg-primary-900 h-full"
            />
            <div
              v-if="getPorcentajeAbstencion(preguntaIndex) > 0"
              :style="{ width: `${getPorcentajeAbstencion(preguntaIndex)}%` }"
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
                  {{ getPorcentajeAFavor(preguntaIndex).toFixed(1) }}%
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
                  {{ getPorcentajeEnContra(preguntaIndex).toFixed(1) }}%
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
                  {{ getPorcentajeAbstencion(preguntaIndex).toFixed(1) }}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimpleCard>
    <p class="t-h5 font-semibold font-secondary text-gray-800">Resultados de la votación</p>

    <!-- Resultado de la votación -->
    <div
      class="w-full rounded-[8px] border border-primary-100 bg-primary-25 flex justify-center items-center py-4 px-6"
    >
      <p class="font-secondary t-t2 text-primary-800 text-center">
        <template v-if="getPorcentajeAFavor(0) > 50">
          Se
          <span class="font-semibold">aprobó</span>
          {{ props.mensajeAprobacion }}
        </template>
        <template v-else>
          No se
          <span class="font-semibold">aprobó</span>
          {{ props.mensajeAprobacion }}
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from "vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import { useVotacionStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore";

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
    accionesConDerechoVoto?: number; // ✅ Acciones con derecho a voto del accionista
  }

  interface Props {
    preguntas?: string[];
    accionistas?: string[];
    mensajeAprobacion?: string;
    votantes?: Votante[] | any; // Aceptar también ComputedRef
    textoVotacion?: string | any; // Aceptar también ComputedRef
  }

  const props = withDefaults(defineProps<Props>(), {
    preguntas: () => [
      "¿Se aprueba el aumento de capital vía Aportes Dinerarios por S/ 2,000, mediante la emisión de 2,000 acciones nuevas de valor nominal S/ 1. El capital social se incrementa de S/ 1,000 a S/ 3,000, y el número de acciones de 1,000 a 3,000.?",
    ],
    accionistas: () => [
      "Olenka Sanchez Aguilar",
      "Melanie Sanchez Aguilar",
      "Braulio Sanchez Aguilar",
    ],
    mensajeAprobacion: "la propuesta de Aumento de Capital mediante Aportes Dinerarios.",
    votantes: () => [],
    textoVotacion: "",
  });

  const emit = defineEmits<{
    "cambiar-voto": [
      accionistaId: string,
      valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION",
      preguntaIndex?: number
    ];
  }>();

  const votacionStore = useVotacionStore();

  // Usar votantes si están disponibles, sino usar accionistas (legacy)
  const listaVotantes = computed(() => {
    console.log("[MayoriaVotacion] Props recibidos (raw):", {
      votantes: props.votantes,
      tipoVotantes: typeof props.votantes,
      esArray: Array.isArray(props.votantes),
      tieneValue:
        props.votantes && typeof props.votantes === "object" && "value" in props.votantes,
      accionistas: props.accionistas,
    });

    // ✅ Extraer valor si es ComputedRef
    let votantesValue = props.votantes;
    if (votantesValue && typeof votantesValue === "object" && "value" in votantesValue) {
      votantesValue = (votantesValue as any).value;
      console.log("[MayoriaVotacion] Votantes extraídos del computed:", votantesValue);
    }

    if (votantesValue && Array.isArray(votantesValue) && votantesValue.length > 0) {
      console.log("[MayoriaVotacion] Usando votantes:", votantesValue);
      console.log("[MayoriaVotacion] Cantidad de votantes:", votantesValue.length);
      votantesValue.forEach((v, i) => {
        console.log(`[MayoriaVotacion] Votante ${i}:`, {
          id: v.id,
          accionistaId: v.accionistaId,
          nombreCompleto: v.nombreCompleto,
        });
      });
      return votantesValue;
    }

    // Legacy: convertir array de strings a formato Votante
    if (
      props.accionistas &&
      Array.isArray(props.accionistas) &&
      props.accionistas.length > 0
    ) {
      console.log("[MayoriaVotacion] Usando accionistas legacy:", props.accionistas);
      return props.accionistas.map((nombre, index) => ({
        id: `legacy-${index}`,
        accionistaId: `legacy-${index}`,
        accionista: { id: `legacy-${index}`, person: { tipo: "NATURAL" } },
        nombreCompleto: nombre,
      }));
    }

    console.warn("[MayoriaVotacion] No hay votantes ni accionistas");
    console.warn("[MayoriaVotacion] votantesValue:", votantesValue);
    console.warn("[MayoriaVotacion] props.accionistas:", props.accionistas);
    return [];
  });

  // Usar texto dinámico si está disponible
  const preguntas = computed(() => {
    if (props.textoVotacion) {
      return [props.textoVotacion];
    }
    return props.preguntas.length > 0
      ? props.preguntas
      : [
          "¿Se aprueba el aumento de capital vía Aportes Dinerarios por S/ 2,000, mediante la emisión de 2,000 acciones nuevas de valor nominal S/ 1. El capital social se incrementa de S/ 1,000 a S/ 3,000, y el número de acciones de 1,000 a 3,000.?",
        ];
  });

  type Voto = "A_FAVOR" | "EN_CONTRA" | "ABSTENCION" | null;

  // Estado de votos: [preguntaIndex][accionistaIndex] = voto
  const votos = ref<Voto[][]>(
    Array(preguntas.value.length)
      .fill(null)
      .map(() => Array(listaVotantes.value.length).fill(null))
  );

  // Cargar votos existentes del store
  const cargarVotosExistentes = () => {
    console.log("[MayoriaVotacion] cargarVotosExistentes() ejecutado");
    console.log("[MayoriaVotacion] hasVotacion:", votacionStore.hasVotacion);
    console.log("[MayoriaVotacion] sesionVotacion:", votacionStore.sesionVotacion);
    console.log("[MayoriaVotacion] listaVotantes:", listaVotantes.value);
    console.log("[MayoriaVotacion] preguntas count:", preguntas.value.length);

    if (votacionStore.hasVotacion && votacionStore.sesionVotacion) {
      const sesion = votacionStore.sesionVotacion;
      console.log("[MayoriaVotacion] Sesión de votación encontrada:", {
        id: sesion.id,
        itemsCount: sesion.items.length,
        items: sesion.items.map((item) => ({
          id: item.id,
          label: item.label,
          votosCount: item.votos.length,
        })),
      });

      // ✅ Cargar votos para cada pregunta (item)
      preguntas.value.forEach((pregunta, preguntaIndex) => {
        const item = sesion.items[preguntaIndex];
        if (!item) {
          console.warn(`[MayoriaVotacion] No hay item para pregunta ${preguntaIndex}`);
          return;
        }

        console.log(
          `[MayoriaVotacion] Cargando votos para pregunta ${preguntaIndex} (item ${item.id}):`,
          {
            votosCount: item.votos.length,
            votos: item.votos,
          }
        );

        listaVotantes.value.forEach((votante, accionistaIndex) => {
          const voto = item.votos.find((v) => v.accionistaId === votante.accionistaId);
          if (voto && votos.value[preguntaIndex]) {
            votos.value[preguntaIndex][accionistaIndex] = voto.valor as Voto;
            console.log(
              `[MayoriaVotacion] Voto cargado para pregunta ${preguntaIndex}, votante ${accionistaIndex}:`,
              voto.valor
            );
          }
        });
      });

      console.log("[MayoriaVotacion] Votos cargados para todas las preguntas:", votos.value);
    } else {
      console.log("[MayoriaVotacion] No hay votación o sesión de votación");
    }
  };

  // Cargar votos al montar
  cargarVotosExistentes();

  // ✅ Observar cambios en el store para recargar votos cuando se carguen del backend
  watch(
    () => [
      votacionStore.hasVotacion,
      votacionStore.sesionVotacion?.items,
      listaVotantes.value.length,
    ],
    () => {
      console.log("[MayoriaVotacion] Store cambió, recargando votos...");
      cargarVotosExistentes();
    },
    { deep: true, immediate: false }
  );

  // ✅ También observar cuando cambian los votantes (por si se cargan después)
  watch(
    () => listaVotantes.value.length,
    () => {
      console.log("[MayoriaVotacion] Votantes cambiaron, recargando votos...");
      cargarVotosExistentes();
    }
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

  const setVoto = async (accionistaIndex: number, preguntaIndex: number, voto: Voto) => {
    const votante = listaVotantes.value[accionistaIndex];
    if (!votante) return;

    const currentVoto = votos.value[preguntaIndex]?.[accionistaIndex] === voto ? null : voto;
    if (votos.value[preguntaIndex]) {
      votos.value[preguntaIndex][accionistaIndex] = currentVoto;
    }

    // Emitir evento para guardar en el store (incluir índice de pregunta)
    if (currentVoto) {
      emit("cambiar-voto", votante.accionistaId, currentVoto, preguntaIndex);
    }
  };

  const getVotoSeleccionado = (accionistaIndex: number, preguntaIndex: number): Voto => {
    return votos.value[preguntaIndex]?.[accionistaIndex] || null;
  };

  // Calcular porcentajes por pregunta basados en ACCIONES, no en número de votantes
  const getPorcentajeAFavor = (preguntaIndex: number) => {
    if (listaVotantes.value.length === 0) return 0;

    // Calcular total de acciones con derecho a voto de todos los votantes
    const totalAcciones = listaVotantes.value.reduce(
      (sum, votante) => sum + (votante.accionesConDerechoVoto || 0),
      0
    );

    if (totalAcciones === 0) return 0;

    // Sumar acciones de votantes que votaron a favor
    const accionesAFavor = listaVotantes.value.reduce((sum, votante, index) => {
      const voto = votos.value[preguntaIndex]?.[index];
      if (voto === "A_FAVOR") {
        return sum + (votante.accionesConDerechoVoto || 0);
      }
      return sum;
    }, 0);

    return (accionesAFavor / totalAcciones) * 100;
  };

  const getPorcentajeEnContra = (preguntaIndex: number) => {
    if (listaVotantes.value.length === 0) return 0;

    // Calcular total de acciones con derecho a voto de todos los votantes
    const totalAcciones = listaVotantes.value.reduce(
      (sum, votante) => sum + (votante.accionesConDerechoVoto || 0),
      0
    );

    if (totalAcciones === 0) return 0;

    // Sumar acciones de votantes que votaron en contra
    const accionesEnContra = listaVotantes.value.reduce((sum, votante, index) => {
      const voto = votos.value[preguntaIndex]?.[index];
      if (voto === "EN_CONTRA") {
        return sum + (votante.accionesConDerechoVoto || 0);
      }
      return sum;
    }, 0);

    return (accionesEnContra / totalAcciones) * 100;
  };

  const getPorcentajeAbstencion = (preguntaIndex: number) => {
    if (listaVotantes.value.length === 0) return 0;

    // Calcular total de acciones con derecho a voto de todos los votantes
    const totalAcciones = listaVotantes.value.reduce(
      (sum, votante) => sum + (votante.accionesConDerechoVoto || 0),
      0
    );

    if (totalAcciones === 0) return 0;

    // Sumar acciones de votantes que se abstuvieron
    const accionesAbstencion = listaVotantes.value.reduce((sum, votante, index) => {
      const voto = votos.value[preguntaIndex]?.[index];
      if (voto === "ABSTENCION") {
        return sum + (votante.accionesConDerechoVoto || 0);
      }
      return sum;
    }, 0);

    return (accionesAbstencion / totalAcciones) * 100;
  };
</script>
