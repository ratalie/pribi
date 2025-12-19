<script setup lang="ts">
  import { Ticket, User, UserCircle, X } from "lucide-vue-next";
  import { computed, nextTick, onMounted, ref, watch } from "vue";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import NumberInputVotos from "~/components/base/inputs/number/NumberInputVotos.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { useDirectoresStore } from "../../composables/useDirectoresStore";

  interface Accion {
    derecho_voto: boolean;
    tipo: string;
    cantidad: number;
  }

  interface Accionista {
    nombre: string;
    acciones: Accion[];
    presidente?: boolean;
  }

  interface Props {
    preguntas?: string[];
    accionistas?: string[] | Accionista[];
    mensajeAprobacion?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    preguntas: () => [],
    accionistas: () => [],
    mensajeAprobacion: "la designación de los directores propuestos.",
  });

  // const emits = defineEmits<{
  //   (
  //     e: "cambiar-voto",
  //     accionistaId: string,
  //     valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
  //   ): void;
  // }>();

  const directoresStore = useDirectoresStore();

  // Estado del modal de empate
  const isModalEmpateOpen = ref(false);
  const candidatosSeleccionadosEmpate = ref<string[]>([]);

  // Candidatos (directores titulares)
  const candidatos = computed(() => directoresStore.directoresTitularesCandidatos);

  // Cantidad disponible
  const directoresDisponibles = computed(() => directoresStore.cantidadDisponibles);

  // Normalizar accionistas a formato Accionista
  const accionistasNormalizados = computed((): Accionista[] => {
    if (!props.accionistas || props.accionistas.length === 0) {
      // Valores por defecto para testing
      return [
        {
          nombre: "Olenka Sanchez Aguilar",
          acciones: [
            { derecho_voto: true, tipo: "comun", cantidad: 100 },
            { derecho_voto: false, tipo: "preferente_sin_derecho_voto", cantidad: 50 },
          ],
          presidente: true,
        },
        {
          nombre: "Ana María Gómez Torres",
          acciones: [
            { derecho_voto: true, tipo: "comun", cantidad: 100 },
            { derecho_voto: false, tipo: "preferente_sin_derecho_voto", cantidad: 50 },
          ],
          presidente: false,
        },
        {
          nombre: "Carlos Rodríguez Pérez",
          acciones: [
            { derecho_voto: true, tipo: "comun", cantidad: 100 },
            { derecho_voto: false, tipo: "preferente_sin_derecho_voto", cantidad: 50 },
          ],
          presidente: false,
        },
        {
          nombre: "María Elena López",
          acciones: [
            { derecho_voto: true, tipo: "comun", cantidad: 100 },
            { derecho_voto: false, tipo: "preferente_sin_derecho_voto", cantidad: 50 },
          ],
          presidente: false,
        },
      ];
    }

    // Si son strings, convertirlos a formato Accionista
    if (typeof props.accionistas[0] === "string") {
      return (props.accionistas as string[]).map((nombre) => ({
        nombre,
        acciones: [
          { derecho_voto: true, tipo: "comun", cantidad: 100 },
          { derecho_voto: false, tipo: "preferente_sin_derecho_voto", cantidad: 50 },
        ],
        presidente: nombre.toLowerCase().includes("olenka"),
      }));
    }

    return props.accionistas as Accionista[];
  });

  // Calcular votos totales por accionista (suma de acciones con derecho_voto: true)
  const getVotosTotales = (accionista: Accionista): number => {
    return accionista.acciones
      .filter((accion) => accion.derecho_voto === true)
      .reduce((sum, accion) => sum + accion.cantidad, 0);
  };

  // Estado de votos asignados: [accionistaIndex][candidatoIndex] = cantidad
  const votosAsignados = ref<number[][]>(
    Array(accionistasNormalizados.value.length)
      .fill(null)
      .map(() => Array(candidatos.value.length).fill(0))
  );

  // ✅ Cargar votos desde el store cuando se monta o cuando cambian
  const cargarVotosDesdeStore = () => {
    const votosDelStore = directoresStore.votosAsignados;

    console.log("[MayoriaVotacionDirectorio] cargarVotosDesdeStore llamado:", {
      votosDelStoreCount: votosDelStore?.length || 0,
      candidatosCount: candidatos.value.length,
      accionistasCount: accionistasNormalizados.value.length,
      votosDelStore: votosDelStore?.slice(0, 3), // Primeros 3 para debug
      candidatos: candidatos.value.map((c) => c.nombreCompleto).slice(0, 3), // Primeros 3 nombres
    });

    if (!votosDelStore || votosDelStore.length === 0) {
      // Si no hay votos en el store, inicializar con ceros
      votosAsignados.value = Array(accionistasNormalizados.value.length)
        .fill(null)
        .map(() => Array(candidatos.value.length).fill(0));
      console.log(
        "[MayoriaVotacionDirectorio] No hay votos en store, inicializando con ceros"
      );
      return;
    }

    // Crear mapa temporal para facilitar el acceso
    // ✅ Usar personaId como clave principal (más robusto), fallback a nombreCompleto
    const votosMap = new Map<string, number>();
    votosDelStore.forEach((voto) => {
      const clave = voto.candidatoPersonaId
        ? `${voto.candidatoPersonaId}-${voto.accionistaIndex}`
        : `${voto.candidatoNombreCompleto}-${voto.accionistaIndex}`;
      votosMap.set(clave, voto.cantidad);
    });

    // Convertir votos del store al formato del componente [accionistaIndex][candidatoIndex]
    const nuevosVotos: number[][] = Array(accionistasNormalizados.value.length)
      .fill(null)
      .map(() => Array(candidatos.value.length).fill(0));

    // ✅ Debug: Log de claves esperadas vs encontradas
    const clavesEncontradas: string[] = [];
    const clavesEsperadas: string[] = [];

    candidatos.value.forEach((candidato, candidatoIndex) => {
      accionistasNormalizados.value.forEach((_, accionistaIndex) => {
        // ✅ Usar personaId como clave principal, fallback a nombreCompleto
        const claveEsperada = candidato.personaId
          ? `${candidato.personaId}-${accionistaIndex}`
          : `${candidato.nombreCompleto}-${accionistaIndex}`;
        clavesEsperadas.push(claveEsperada);

        const cantidad = votosMap.get(claveEsperada) || 0;
        if (cantidad > 0) {
          clavesEncontradas.push(claveEsperada);
        }

        if (nuevosVotos[accionistaIndex]) {
          nuevosVotos[accionistaIndex][candidatoIndex] = cantidad;
        }
      });
    });

    console.log("[MayoriaVotacionDirectorio] Mapeo de votos:", {
      clavesEnStore: Array.from(votosMap.keys()),
      clavesEsperadas: clavesEsperadas.slice(0, 6), // Primeras 6
      clavesEncontradas,
      matchCount: clavesEncontradas.length,
      totalEsperadas: clavesEsperadas.length,
    });

    votosAsignados.value = nuevosVotos;
    console.log("[MayoriaVotacionDirectorio] Votos cargados desde store:", {
      votosDelStoreCount: votosDelStore.length,
      nuevosVotos: nuevosVotos.map((v, idx) => ({
        accionistaIndex: idx,
        total: v.reduce((sum, cant) => sum + cant, 0),
        votos: v,
      })),
    });
  };

  // ✅ Cargar votos cuando se monta o cuando cambian los datos
  watch(
    [() => directoresStore.votosAsignados.length, candidatos, accionistasNormalizados],
    () => {
      if (candidatos.value.length > 0 && accionistasNormalizados.value.length > 0) {
        cargarVotosDesdeStore();
      }
    },
    { immediate: true, deep: true }
  );

  // También cargar cuando se monta el componente
  onMounted(() => {
    if (candidatos.value.length > 0 && accionistasNormalizados.value.length > 0) {
      cargarVotosDesdeStore();
    }
  });

  // Calcular votos asignados totales por accionista
  const getVotosAsignados = (accionistaIndex: number): number => {
    return votosAsignados.value[accionistaIndex]?.reduce((sum, voto) => sum + voto, 0) || 0;
  };

  // Actualizar votos asignados
  const actualizarVotosAsignados = (
    accionistaIndex: number,
    candidatoIndex: number,
    cantidad: string
  ) => {
    const cantidadNum = parseInt(cantidad, 10) || 0;
    const accionista = accionistasNormalizados.value[accionistaIndex];
    if (!accionista) return;

    const candidato = candidatos.value[candidatoIndex];
    if (!candidato) return;

    const votosTotales = getVotosTotales(accionista);
    const votosAsignadosActuales = getVotosAsignados(accionistaIndex);
    const votosAsignadosAnteriores =
      votosAsignados.value[accionistaIndex]?.[candidatoIndex] || 0;

    // Calcular nuevo total de votos asignados
    const nuevoTotal = votosAsignadosActuales - votosAsignadosAnteriores + cantidadNum;

    // Si excede el límite, ajustar
    let cantidadFinal = cantidadNum;
    if (nuevoTotal > votosTotales) {
      const diferencia = nuevoTotal - votosTotales;
      cantidadFinal = Math.max(0, cantidadNum - diferencia);
    }

    // Actualizar estado local
    if (votosAsignados.value[accionistaIndex]) {
      votosAsignados.value[accionistaIndex][candidatoIndex] = cantidadFinal;
    }

    // Guardar en el store
    directoresStore.agregarVotoAsignado({
      candidatoNombreCompleto: candidato.nombreCompleto,
      accionistaIndex,
      cantidad: cantidadFinal,
    });

    // Verificar si es el último voto del último accionista
    // Usar nextTick para asegurar que el estado se haya actualizado
    nextTick(() => {
      // Verificar si todos los votos están completos
      const todosCompletos = accionistasNormalizados.value.every((acc, idx) => {
        const total = getVotosTotales(acc);
        const asignados = getVotosAsignados(idx);
        return total > 0 && asignados === total;
      });

      if (todosCompletos) {
        console.log(
          "✅ [MayoriaVotacionDirectorio] Todos los votos completos, verificando empate..."
        );
        // Verificar si hay empate
        const hayEmpate = directoresStore.verificarEmpate();
        if (hayEmpate) {
          console.log("⚠️ [MayoriaVotacionDirectorio] HAY EMPATE - Mostrando modal");
          directoresStore.setHayEmpate(true);
          // Mostrar el modal inmediatamente
          isModalEmpateOpen.value = true;
        } else {
          directoresStore.setHayEmpate(false);
        }
      }
    });
  };

  // Obtener max para un input específico
  const getMaxVotos = (accionistaIndex: number, candidatoIndex: number): number => {
    const accionista = accionistasNormalizados.value[accionistaIndex];
    if (!accionista) return 0;

    const votosTotales = getVotosTotales(accionista);
    const votosAsignadosActuales = getVotosAsignados(accionistaIndex);
    const votosAsignadosAnteriores =
      votosAsignados.value[accionistaIndex]?.[candidatoIndex] || 0;
    const disponibles = votosTotales - votosAsignadosActuales + votosAsignadosAnteriores;
    return disponibles;
  };

  // Candidatos en empate (para el modal)
  const candidatosEnEmpate = computed(() => {
    const candidatos = directoresStore.directoresTitularesCandidatos;
    const votosPorCandidato = directoresStore.votosPorCandidato;
    const plazasDisponibles = directoresStore.cantidadDisponibles;

    // Crear array de candidatos con votos
    const candidatosConVotos = candidatos.map((candidato) => ({
      nombreCompleto: candidato.nombreCompleto,
      votos_asignados: votosPorCandidato.get(candidato.nombreCompleto) || 0,
    }));

    // Ordenar por votos
    const sorted = [...candidatosConVotos].sort(
      (a, b) => b.votos_asignados - a.votos_asignados
    );

    if (sorted.length <= 1) return [];

    const primerVoto = sorted[0]?.votos_asignados;
    const todosIguales = sorted.every((c) => c.votos_asignados === primerVoto);

    // Si todos tienen los mismos votos
    if (todosIguales && sorted.length > plazasDisponibles) {
      return sorted;
    }

    // Si hay empate en el límite de plazas disponibles
    const votoEnLimite = sorted[plazasDisponibles - 1]?.votos_asignados;
    if (
      votoEnLimite !== undefined &&
      votoEnLimite === sorted[plazasDisponibles]?.votos_asignados
    ) {
      // Retornar todos los candidatos que tienen el mismo voto que el límite
      return sorted.filter((c) => c.votos_asignados === votoEnLimite);
    }

    return [];
  });

  // Función para confirmar sorteo
  const confirmarSorteo = () => {
    console.log("Candidatos seleccionados:", candidatosSeleccionadosEmpate.value);
    isModalEmpateOpen.value = false;
    directoresStore.setHayEmpate(false);
  };

  // Verificar si un candidato está deshabilitado
  const isCandidatoDeshabilitado = (candidatoNombre: string) => {
    const yaSeleccionado = candidatosSeleccionadosEmpate.value.includes(candidatoNombre);
    const limiteAlcanzado =
      candidatosSeleccionadosEmpate.value.length >= directoresStore.cantidadDisponibles;
    return !yaSeleccionado && limiteAlcanzado;
  };

  // Manejar cambio de checkbox
  const handleCheckboxChange = (candidatoNombre: string, checked: boolean) => {
    if (checked) {
      // Solo agregar si no se ha alcanzado el límite
      if (candidatosSeleccionadosEmpate.value.length < directoresStore.cantidadDisponibles) {
        candidatosSeleccionadosEmpate.value.push(candidatoNombre);
      }
    } else {
      // Remover el candidato
      const index = candidatosSeleccionadosEmpate.value.indexOf(candidatoNombre);
      if (index > -1) {
        candidatosSeleccionadosEmpate.value.splice(index, 1);
      }
    }
  };
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Título y etiqueta de plazas disponibles -->
    <div class="flex items-center justify-between">
      <p class="t-h5 font-semibold font-secondary text-gray-800">Asignación de Votos</p>
      <div
        class="flex items-center gap-2 py-2.5 px-1.25 bg-primary-50 rounded-full text-primary-700"
      >
        <User class="w-5 h-5" />
        <span class="font-secondary text-sm font-medium">
          {{ directoresDisponibles }} plazas disponible{{
            directoresDisponibles !== 1 ? "s" : ""
          }}
        </span>
      </div>
    </div>

    <!-- Sección por accionista -->
    <SimpleCard
      v-for="(accionista, accionistaIndex) in accionistasNormalizados"
      :key="accionistaIndex"
      class="flex flex-col gap-4"
    >
      <!-- Header del accionista -->
      <div class="flex w-full justify-between items-center">
        <p class="font-primary text-gray-800 t-t1">Accionista: {{ accionista.nombre }}</p>
        <div
          class="flex items-center gap-2 py-1 px-1.25 bg-gray-100 rounded-full text-gray-600"
        >
          <Ticket class="w-5 h-5" />
          <span class="font-secondary text-sm font-medium">
            {{ getVotosAsignados(accionistaIndex) }}/{{ getVotosTotales(accionista) }}
          </span>
        </div>
      </div>

      <!-- Tabla de asignación de votos -->
      <div class="border border-gray-200 rounded-xl overflow-hidden">
        <div class="grid" style="grid-template-columns: 2fr 2fr 1fr">
          <!-- Headers -->
          <div class="p-4 bg-gray-50 border-b border-gray-200">
            <p class="font-primary font-semibold text-gray-800 t-b1">Candidato</p>
          </div>
          <div class="p-4 bg-gray-50 border-b border-gray-200">
            <p class="font-primary font-semibold text-gray-800 t-b1">Tipo de Director</p>
          </div>
          <div class="p-4 bg-gray-50 border-b border-gray-200">
            <p class="font-primary font-semibold text-gray-800 t-b1">Votos Asignados</p>
          </div>

          <!-- Filas de candidatos -->
          <template
            v-for="(candidato, candidatoIndex) in candidatos"
            :key="candidato.nombreCompleto"
          >
            <div class="p-4 border-b border-gray-100 flex items-center">
              <p class="font-secondary text-gray-800 t-b1">{{ candidato.nombreCompleto }}</p>
            </div>
            <div class="p-4 border-b border-gray-100 flex items-center">
              <p class="font-secondary text-gray-800 t-b1">Director Titular</p>
            </div>
            <div class="p-4 border-b border-gray-100 flex items-center">
              <NumberInputVotos
                :id="`votos-${accionistaIndex}-${candidatoIndex}`"
                :model-value="votosAsignados[accionistaIndex]?.[candidatoIndex] || 0"
                :min="0"
                :max="getMaxVotos(accionistaIndex, candidatoIndex)"
                @update:model-value="
                  (value) => actualizarVotosAsignados(accionistaIndex, candidatoIndex, value)
                "
              />
            </div>
          </template>
        </div>
      </div>
    </SimpleCard>

    <!-- Modal de Empate -->
    <BaseModal v-model="isModalEmpateOpen" size="sm">
      <div class="flex flex-col gap-[30px]">
        <!-- Header con icono y X -->
        <div class="flex items-center justify-between">
          <div class="relative w-[60px] h-[60px]">
            <!-- Div rotado de fondo (cuadrado morado sólido) -->
            <div
              class="w-[60px] h-[60px] rounded-xl bg-primary-700 absolute"
              style="transform: rotate(-50deg) translate(4px, 4px)"
            ></div>
            <!-- Cuadrado frontal con degradado -->
            <div
              class="relative w-[60px] h-[60px] rounded-xl flex items-center justify-center bg-gradient-to-br from-white via-primary-50 to-primary-100 shadow-sm"
            >
              <UserCircle class="w-[32px] h-[32px] text-primary-700" />
            </div>
          </div>
          <button
            @click="isModalEmpateOpen = false"
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Subtítulo -->
        <div class="flex flex-col gap-2">
          <p class="t-t3 text-gray-600 font-normal">
            <span class="font-semibold">Empate: se requiere sorteo</span>
          </p>
          <p class="t-t3 text-gray-600 font-normal">
            Se ha producido un empate entre varios postulantes y hay más candidatos que cargos
            disponibles. Para continuar,
            <span class="font-bold">los accionistas deben realizar un sorteo</span>
            y seleccionar manualmente quiénes ocuparán los cargos disponibles.
          </p>
        </div>

        <!-- Tag informativo -->
        <div class="w-full rounded-xl bg-primary-50 text-primary-400 p-4">
          <p class="t-t2 font-secondary">
            Se requiere intervención manual para resolver el empate mediante sorteo.
          </p>
        </div>

        <!-- Checklist de candidatos -->
        <div class="flex flex-col gap-3">
          <p class="t-h5 text-gray-800 font-primary font-semibold">Candidatos en empate:</p>
          <div class="flex flex-col gap-2">
            <label
              v-for="candidato in candidatosEnEmpate"
              :key="candidato.nombreCompleto"
              :class="[
                'flex items-center gap-2',
                isCandidatoDeshabilitado(candidato.nombreCompleto)
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer',
              ]"
            >
              <input
                type="checkbox"
                :checked="candidatosSeleccionadosEmpate.includes(candidato.nombreCompleto)"
                :disabled="isCandidatoDeshabilitado(candidato.nombreCompleto)"
                @change="
                  handleCheckboxChange(
                    candidato.nombreCompleto,
                    ($event.target as HTMLInputElement).checked
                  )
                "
                class="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span class="t-b1 text-gray-800 font-secondary">
                {{ candidato.nombreCompleto }}
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Botones en el footer del modal -->
      <template #footer>
        <div class="flex justify-center gap-3 w-full">
          <BaseButton variant="outline" size="md" @click="isModalEmpateOpen = false">
            Cancelar
          </BaseButton>
          <BaseButton variant="primary" size="md" @click="confirmarSorteo">
            Confirmar
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>
