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
  import { useVotacionStore } from "~/core/presentation/juntas/stores/votacion.store";

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
    getVoto?: (accionistaId: string) => "A_FAVOR" | "EN_CONTRA" | "ABSTENCION" | null; // Función para obtener voto
    votacionStore?: any; // ✅ Store dedicado opcional (para múltiples preguntas)
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
    getVoto: undefined,
  });

  const emit = defineEmits<{
    "cambiar-voto": [
      accionistaId: string,
      valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION",
      preguntaIndex?: number
    ];
  }>();

  // ✅ Usar store dedicado si se pasa como prop, sino usar store compartido solo si no hay función getVoto (legacy)
  const votacionStore = props.votacionStore || (props.getVoto ? null : useVotacionStore());

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
          accionesConDerechoVoto: v.accionesConDerechoVoto, // ✅ Verificar que esté presente
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
    // ✅ Prioridad 1: Usar textoVotacion si está disponible
    if (props.textoVotacion) {
      const textoValue =
        typeof props.textoVotacion === "object" && "value" in props.textoVotacion
          ? (props.textoVotacion as any).value
          : props.textoVotacion;
      if (textoValue && typeof textoValue === "string" && textoValue.trim() !== "") {
        return [textoValue];
      }
    }

    // ✅ Prioridad 2: Usar preguntas pasadas como prop
    const preguntasValue = Array.isArray(props.preguntas)
      ? props.preguntas
      : typeof props.preguntas === "object" && "value" in props.preguntas
      ? (props.preguntas as any).value || []
      : [];

    if (Array.isArray(preguntasValue) && preguntasValue.length > 0) {
      return preguntasValue;
    }

    // ✅ Prioridad 3: Retornar array vacío (NO usar fallback hardcodeado)
    // Si no hay preguntas, el componente debe mostrar un estado vacío o error
    console.warn("[MayoriaVotacion] No hay preguntas disponibles. Retornando array vacío.");
    return [];
  });

  type Voto = "A_FAVOR" | "EN_CONTRA" | "ABSTENCION" | null;

  // Estado de votos: [preguntaIndex][accionistaIndex] = voto
  const votos = ref<Voto[][]>(
    Array(preguntas.value.length)
      .fill(null)
      .map(() => Array(listaVotantes.value.length).fill(null))
  );

  // Flag para evitar loops infinitos en watchers
  const isLoadingVotos = ref(false);
  // Guardar el último estado de votos para comparar (evitar recargas innecesarias)
  const ultimosVotos = ref<(Voto | null)[]>([]);

  // Cargar votos existentes del store o función getVoto
  const cargarVotosExistentes = () => {
    // Evitar recargas si ya se está cargando
    if (isLoadingVotos.value) {
      console.log("[MayoriaVotacion] Ya se está cargando, ignorando recarga...");
      return;
    }

    isLoadingVotos.value = true;
    console.log("[MayoriaVotacion] cargarVotosExistentes() ejecutado");
    if (votacionStore) {
      console.log("[MayoriaVotacion] hasVotacion:", votacionStore.hasVotacion);
      console.log("[MayoriaVotacion] sesionVotacion:", votacionStore.sesionVotacion);
    }
    console.log("[MayoriaVotacion] listaVotantes:", listaVotantes.value);
    console.log("[MayoriaVotacion] preguntas count:", preguntas.value.length);

    try {
      // ✅ Si hay función getVoto, intentar usarla primero
      // Pero si hay múltiples preguntas, usar el store directamente (más eficiente)
      if (props.getVoto && preguntas.value.length === 1) {
        console.log(
          "[MayoriaVotacion] Usando función getVoto para cargar votos (una pregunta)"
        );
        // ✅ Extraer función si es computed
        const getVotoFn =
          typeof props.getVoto === "function"
            ? props.getVoto
            : (props.getVoto as any)?.value || props.getVoto;

        // Asegurar que el array de votos existe
        if (!votos.value[0]) {
          votos.value[0] = Array(listaVotantes.value.length).fill(null);
        }

        const votosCargados: (Voto | null)[] = [];
        listaVotantes.value.forEach((votante, index) => {
          const voto = getVotoFn(votante.accionistaId);
          votosCargados.push(voto);
          console.log(`[MayoriaVotacion] Votante ${index} (${votante.accionistaId}):`, {
            voto,
          });
          if (votos.value[0]) {
            votos.value[0][index] = voto as Voto;
            if (voto) {
              console.log(`[MayoriaVotacion] Voto cargado para votante ${index}:`, voto);
            }
          }
        });
        // Actualizar último estado para evitar recargas innecesarias
        ultimosVotos.value = votosCargados;
        console.log("[MayoriaVotacion] Votos cargados:", votos.value[0]);
        return;
      }

      // ✅ Si hay múltiples preguntas, usar el store directamente (más eficiente)
      if (preguntas.value.length > 1 && votacionStore) {
        console.log(
          "[MayoriaVotacion] Múltiples preguntas detectadas, usando store directamente"
        );
        // Continuar con la lógica del store más abajo
      }

      // ✅ Legacy: usar store (solo si no hay función getVoto)
      // ⚠️ IMPORTANTE: Validar contexto antes de usar datos del store
      if (votacionStore && votacionStore.hasVotacion && votacionStore.sesionVotacion) {
        const sesion = votacionStore.sesionVotacion;

        // ✅ Validar que el número de items coincida con el número de preguntas
        // Esto evita cargar datos de otro flujo (ej: aporte dinerario tiene 1 pregunta, remoción apoderados tiene múltiples)
        if (sesion.items.length !== preguntas.value.length) {
          console.warn(
            "[MayoriaVotacion] ⚠️ Número de items no coincide con número de preguntas, no cargando votos:",
            {
              itemsCount: sesion.items.length,
              preguntasCount: preguntas.value.length,
              contexto: sesion.contexto,
            }
          );
          return;
        }

        console.log("[MayoriaVotacion] Sesión de votación encontrada (legacy):", {
          id: sesion.id,
          contexto: sesion.contexto,
          itemsCount: sesion.items.length,
          items: sesion.items.map((item: any) => ({
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
            const voto = item.votos.find((v: any) => v.accionistaId === votante.accionistaId);
            const votosPregunta = votos.value[preguntaIndex];
            if (voto && votosPregunta) {
              votosPregunta[accionistaIndex] = voto.valor as Voto;
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
    } finally {
      isLoadingVotos.value = false;
    }
  };

  // Cargar votos al montar
  cargarVotosExistentes();

  // ✅ Observar cambios en el store para recargar votos cuando se carguen del backend (solo legacy)
  if (votacionStore) {
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
  }

  // ✅ Observar cambios en votantes y recargar votos cuando cambien (para ambos casos)
  watch(
    () => listaVotantes.value,
    () => {
      console.log("[MayoriaVotacion] Votantes cambiaron, recargando votos...");
      // Reinicializar array de votos con el nuevo tamaño
      votos.value = Array(preguntas.value.length)
        .fill(null)
        .map(() => Array(listaVotantes.value.length).fill(null));
      cargarVotosExistentes();
    },
    { deep: true, immediate: false }
  );

  // ✅ Observar cambios en getVoto para recargar votos cuando se carguen del backend
  // Observamos los resultados de getVoto para cada votante
  if (props.getVoto) {
    // Extraer función si es computed
    const getVotoFn =
      typeof props.getVoto === "function"
        ? props.getVoto
        : (props.getVoto as any)?.value || props.getVoto;

    watch(
      () => {
        // Crear un array de votos actuales usando getVoto
        return listaVotantes.value.map((v) => getVotoFn(v.accionistaId));
      },
      (nuevosVotos) => {
        // Comparar con el estado anterior para evitar recargas innecesarias
        const votosCambiaron =
          JSON.stringify(nuevosVotos) !== JSON.stringify(ultimosVotos.value);

        if (votosCambiaron) {
          console.log(
            "[MayoriaVotacion] Votos cambiaron (a través de getVoto), recargando...",
            nuevosVotos
          );
          ultimosVotos.value = nuevosVotos;
          cargarVotosExistentes();
        }
      },
      { deep: true, immediate: false }
    );

    // ✅ También observar el computed directamente si es un computed
    if (props.getVoto && typeof props.getVoto === "object" && "value" in props.getVoto) {
      watch(
        () => props.getVoto,
        () => {
          console.log("[MayoriaVotacion] getVoto computed cambió, recargando votos...");
          cargarVotosExistentes();
        },
        { deep: true, immediate: false }
      );
    }
  }

  // ✅ También observar cuando cambian los votantes (por si se cargan después)
  watch(
    () => listaVotantes.value.length,
    () => {
      console.log("[MayoriaVotacion] Votantes cambiaron, recargando votos...");
      cargarVotosExistentes();
    }
  );

  // ✅ Observar cambios en preguntas para reinicializar array de votos
  watch(
    () => preguntas.value.length,
    (newLength, oldLength) => {
      if (newLength !== oldLength) {
        console.log(
          `[MayoriaVotacion] Número de preguntas cambió de ${oldLength} a ${newLength}, reinicializando votos...`
        );
        // Reinicializar array de votos con el nuevo tamaño
        votos.value = Array(newLength)
          .fill(null)
          .map(() => Array(listaVotantes.value.length).fill(null));
        // Recargar votos existentes
        cargarVotosExistentes();
      }
    },
    { immediate: false }
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

    // Asegurar que el array de votos existe para esta pregunta
    if (!votos.value[preguntaIndex]) {
      votos.value[preguntaIndex] = Array(listaVotantes.value.length).fill(null);
    }

    const votosPregunta = votos.value[preguntaIndex];
    if (!votosPregunta) return;

    const currentVoto = votosPregunta[accionistaIndex] === voto ? null : voto;
    votosPregunta[accionistaIndex] = currentVoto;

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

    console.log(`[MayoriaVotacion] getPorcentajeAFavor(${preguntaIndex}):`, {
      totalAcciones,
      votantesCount: listaVotantes.value.length,
      accionesPorVotante: listaVotantes.value.map((v, i) => ({
        nombre: v.nombreCompleto,
        acciones: v.accionesConDerechoVoto || 0,
        voto: votos.value[preguntaIndex]?.[i],
      })),
    });

    if (totalAcciones === 0) {
      console.warn(
        `[MayoriaVotacion] getPorcentajeAFavor(${preguntaIndex}): totalAcciones es 0`
      );
      return 0;
    }

    // Sumar acciones de votantes que votaron a favor
    const accionesAFavor = listaVotantes.value.reduce((sum, votante, index) => {
      const voto = votos.value[preguntaIndex]?.[index];
      if (voto === "A_FAVOR") {
        return sum + (votante.accionesConDerechoVoto || 0);
      }
      return sum;
    }, 0);

    const porcentaje = (accionesAFavor / totalAcciones) * 100;
    console.log(`[MayoriaVotacion] getPorcentajeAFavor(${preguntaIndex}) resultado:`, {
      accionesAFavor,
      totalAcciones,
      porcentaje: porcentaje.toFixed(2) + "%",
    });

    return porcentaje;
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

    const porcentaje = (accionesEnContra / totalAcciones) * 100;
    console.log(`[MayoriaVotacion] getPorcentajeEnContra(${preguntaIndex}) resultado:`, {
      accionesEnContra,
      totalAcciones,
      porcentaje: porcentaje.toFixed(2) + "%",
    });

    return porcentaje;
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

    const porcentaje = (accionesAbstencion / totalAcciones) * 100;
    console.log(`[MayoriaVotacion] getPorcentajeAbstencion(${preguntaIndex}) resultado:`, {
      accionesAbstencion,
      totalAcciones,
      porcentaje: porcentaje.toFixed(2) + "%",
    });

    return porcentaje;
  };
</script>
