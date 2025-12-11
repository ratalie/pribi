<script setup lang="ts">
  import { Ticket, User } from "lucide-vue-next";
  import { computed, ref } from "vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import NumberInputVotos from "~/components/base/inputs/number/NumberInputVotos.vue";
  import { useDirectoresStore } from "../../composables/useDirectoresStore";

  interface Accion {
    derecho_voto: boolean;
    tipo: string;
    cantidad: number;
  }

  interface Accionista {
    nombre: string;
    acciones: Accion[];
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
          nombre: "Ana María Gómez Torres",
          acciones: [
            { derecho_voto: true, tipo: "comun", cantidad: 100 },
            { derecho_voto: false, tipo: "preferente_sin_derecho_voto", cantidad: 50 },
          ],
        },
        {
          nombre: "Carlos Rodríguez Pérez",
          acciones: [
            { derecho_voto: true, tipo: "comun", cantidad: 100 },
            { derecho_voto: false, tipo: "preferente_sin_derecho_voto", cantidad: 50 },
          ],
        },
        {
          nombre: "María Elena López",
          acciones: [
            { derecho_voto: true, tipo: "comun", cantidad: 100 },
            { derecho_voto: false, tipo: "preferente_sin_derecho_voto", cantidad: 50 },
          ],
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

    const votosTotales = getVotosTotales(accionista);
    const votosAsignadosActuales = getVotosAsignados(accionistaIndex);
    const votosAsignadosAnteriores =
      votosAsignados.value[accionistaIndex]?.[candidatoIndex] || 0;

    // Calcular nuevo total de votos asignados
    const nuevoTotal = votosAsignadosActuales - votosAsignadosAnteriores + cantidadNum;

    // Si excede el límite, ajustar
    if (nuevoTotal > votosTotales) {
      const diferencia = nuevoTotal - votosTotales;
      const cantidadAjustada = Math.max(0, cantidadNum - diferencia);
      if (votosAsignados.value[accionistaIndex]) {
        votosAsignados.value[accionistaIndex][candidatoIndex] = cantidadAjustada;
      }
    } else {
      if (votosAsignados.value[accionistaIndex]) {
        votosAsignados.value[accionistaIndex][candidatoIndex] = cantidadNum;
      }
    }
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

  // Verificar si se aprobó (más del 50% a favor)
  const seAprobo = computed(() => {
    // TODO: Implementar lógica de aprobación basada en votos asignados
    return false;
  });
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

    <!-- Resultado de la votación -->
    <div class="flex flex-col gap-4">
      <p class="t-h5 font-semibold font-secondary text-gray-800">Resultados de la votación</p>
      <div
        :class="[
          'w-full rounded-[8px] border border-primary-25 flex justify-center items-center',
          'bg-primary-25 py-4 px-6',
        ]"
      >
        <p class="font-secondary t-t2 text-primary-800">
          <template v-if="seAprobo">
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
