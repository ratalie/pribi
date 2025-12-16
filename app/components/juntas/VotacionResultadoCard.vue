<template>
  <div class="flex flex-col gap-4">
    <!-- Subtitle -->
    <p v-if="subtitle" class="t-h4 text-gray-800 font-primary font-semibold mb-4 mt-10">
      {{ subtitle }}
    </p>

    <!-- Cards Container -->
    <div class="flex gap-4" :class="esUnanimidad ? '' : 'flex-row'">
      <!-- Card Principal con Resultado -->
      <div
        :class="[
          'border py-6 px-4 rounded-lg flex-1',
          aprobado
            ? 'border-primary-100 bg-primary-25 text-primary-800'
            : 'border-gray-100 bg-gray-25 text-gray-600',
        ]"
      >
        <p class="font-secondary t-t2 leading-relaxed">
          <span v-if="aprobado" class="font-semibold">Se aprobó</span>
          <span v-else class="font-semibold">No se aprobó</span>
          {{ tipo === "remocion" ? "la remoción" : "la designación" }}
          <template v-if="esUnanimidad && nombres && nombres.length > 1">
            de los
            <span class="font-semibold">{{ cargo }} propuestos</span>
          </template>
          <template v-else>
            del
            <span v-if="nombres && nombres.length > 0" class="font-semibold">
              {{ nombres.join(", ") }}
            </span>
            <span v-else>{{ cargo }}</span>
          </template>
          <template v-if="esUnanimidad">
            mediante
            <span class="font-semibold">votación por unanimidad</span>
            , con la participación del
            <span class="font-semibold">{{ porcentajeParticipacion }}%</span>
            de los accionistas con derecho a voto presentes, obteniéndose el total de
            <span class="font-semibold">votos favorables</span>
            sobre las acciones presentes.
          </template>
          <template v-else>
            mediante
            <span class="font-semibold">votación por mayoría simple</span>
            , con la participación del
            <span class="font-semibold">{{ porcentajeParticipacion }}%</span>
            de los accionistas con derecho a voto presentes, obteniéndose el
            <span class="font-semibold">{{ porcentajeAFavor }}% de votos favorables</span>
            sobre las acciones presentes.
          </template>
        </p>
      </div>

      <!-- Card de Porcentajes (solo si es mayoría) -->
      <div
        v-if="!esUnanimidad"
        class="border border-gray-100 text-primary-800 py-6 px-4 rounded-lg w-[280px] flex flex-col gap-1"
      >
        <!-- Header: Mayoría Requerida -->
        <div class="flex justify-between w-full items-center">
          <p class="text-primary-800 font-secondary t-t2 font-semibold">Mayoría Requerida</p>
          <span class="font-secondary text-sm text-gray-700">{{ mayoriaRequerida }}%</span>
        </div>

        <!-- Resultados -->
        <div class="flex flex-col gap-3 mt-2">
          <!-- A favor -->
          <div class="flex justify-between w-full items-center">
            <div class="flex items-center gap-1">
              <div class="w-3 h-3 rounded-full bg-primary-700"></div>
              <span class="font-secondary text-gray-800 font-medium t-t2">A favor</span>
            </div>
            <span class="font-secondary text-gray-700 t-t2">
              {{ porcentajeAFavor.toFixed(2) }}%
            </span>
          </div>

          <!-- En contra -->
          <div class="flex justify-between w-full items-center">
            <div class="flex items-center gap-1">
              <div class="w-3 h-3 rounded-full bg-primary-900"></div>
              <span class="font-secondary text-gray-700 font-medium t-t2">En contra</span>
            </div>
            <span class="font-secondary text-gray-700 t-t2">
              {{ porcentajeEnContra.toFixed(2) }}%
            </span>
          </div>

          <!-- Abstención -->
          <div class="flex justify-between w-full items-center">
            <div class="flex items-center gap-1">
              <div class="w-3 h-3 rounded-full bg-primary-100"></div>
              <span class="font-secondary text-gray-700 font-medium t-t2">Abstención</span>
            </div>
            <span class="font-secondary text-gray-700 t-t2">
              {{ porcentajeAbstencion.toFixed(2) }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    /** Tipo de acción: remoción o designación */
    tipo: "remocion" | "designacion";
    /** Si es votación por unanimidad */
    esUnanimidad: boolean;
    /** Si fue aprobado */
    aprobado: boolean;
    /** Porcentaje de participación (quorum) */
    porcentajeParticipacion: number;
    /** Porcentaje de votos a favor (solo para mayoría) */
    porcentajeAFavor?: number;
    /** Porcentaje de votos en contra (solo para mayoría) */
    porcentajeEnContra?: number;
    /** Porcentaje de abstenciones (solo para mayoría) */
    porcentajeAbstencion?: number;
    /** Porcentaje de mayoría requerida (solo para mayoría) */
    mayoriaRequerida?: number;
    /** Nombres de las personas (array) */
    nombres?: string[];
    /** Cargo (ej: "Gerente General", "Directores", etc.) */
    cargo?: string;
    /** Subtítulo personalizado */
    subtitle?: string;
  }

  withDefaults(defineProps<Props>(), {
    porcentajeAFavor: 0,
    porcentajeEnContra: 0,
    porcentajeAbstencion: 0,
    mayoriaRequerida: 50,
    nombres: () => [],
    cargo: "Gerente General",
    subtitle: "Resultados de la Votación",
  });
</script>
