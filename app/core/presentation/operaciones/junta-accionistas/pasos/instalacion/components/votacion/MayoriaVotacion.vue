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
            v-for="(accionista, accionistaIndex) in accionistas"
            :key="accionistaIndex"
            class="flex flex-col"
          >
            <div class="flex items-center py-4">
              <!-- Columna 1: Nombre del Accionista -->
              <div class="flex-[1]">
                <p class="font-secondary text-gray-600 font-medium t-b1">
                  {{ accionista }}
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
              v-if="accionistaIndex < accionistas.length - 1"
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
          la propuesta de Aumento de Capital mediante
          <span class="font-semibold">Aportes Dinerarios.</span>
        </template>
        <template v-else>
          No se
          <span class="font-semibold">aprobó</span>
          la propuesta de Aumento de Capital mediante
          <span class="font-semibold">Aportes Dinerarios.</span>
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";

  interface Props {
    preguntas?: string[];
    accionistas?: string[];
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
  });

  type Voto = "a-favor" | "en-contra" | "abstencion" | null;

  // Estado de votos: [preguntaIndex][accionistaIndex] = voto
  const votos = ref<Voto[][]>(
    Array(props.preguntas.length)
      .fill(null)
      .map(() => Array(props.accionistas.length).fill(null))
  );

  const opcionesVoto = [
    {
      id: "a-favor" as const,
      label: "A favor",
      icono: "fluent:checkmark-circle-12-filled",
    },
    {
      id: "en-contra" as const,
      label: "En contra",
      icono: "fluent:dismiss-circle-12-filled",
    },
    {
      id: "abstencion" as const,
      label: "Abstención",
      icono: "fluent:block-16-filled",
    },
  ];

  const setVoto = (accionistaIndex: number, preguntaIndex: number, voto: Voto) => {
    const currentVoto = votos.value[preguntaIndex]?.[accionistaIndex] === voto ? null : voto;
    if (votos.value[preguntaIndex]) {
      votos.value[preguntaIndex][accionistaIndex] = currentVoto;
    }
  };

  const getVotoSeleccionado = (accionistaIndex: number, preguntaIndex: number): Voto => {
    return votos.value[preguntaIndex]?.[accionistaIndex] || null;
  };

  // Calcular porcentajes por pregunta
  const getPorcentajeAFavor = (preguntaIndex: number) => {
    if (props.accionistas.length === 0) return 0;
    const votosAFavor = votos.value[preguntaIndex]?.filter((v) => v === "a-favor").length || 0;
    return (votosAFavor / props.accionistas.length) * 100;
  };

  const getPorcentajeEnContra = (preguntaIndex: number) => {
    if (props.accionistas.length === 0) return 0;
    const votosEnContra =
      votos.value[preguntaIndex]?.filter((v) => v === "en-contra").length || 0;
    return (votosEnContra / props.accionistas.length) * 100;
  };

  const getPorcentajeAbstencion = (preguntaIndex: number) => {
    if (props.accionistas.length === 0) return 0;
    const votosAbstencion =
      votos.value[preguntaIndex]?.filter((v) => v === "abstencion").length || 0;
    return (votosAbstencion / props.accionistas.length) * 100;
  };
</script>
