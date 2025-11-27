<template>
  <div class="flex flex-col gap-6">
    <!-- Título contextual -->
    <div v-if="context === 'punto-acuerdo'" class="flex flex-col gap-2">
      <TitleH4
        title="Aporte Dinerario"
        subtitle="Resumen del proceso de aumento de capital vía aporte dinerario."
        :variant="Titles.WITH_SUBTITLE_SPACING"
      />
    </div>
    <div v-else class="flex flex-col gap-2">
      <TitleH4
        title="Aporte Dinerario"
        subtitle="Resumen consolidado del acuerdo de aporte dinerario."
        :variant="Titles.WITH_SUBTITLE_SPACING"
      />
    </div>

    <!-- Contenido del resumen -->
    <div class="flex flex-col gap-6">
      <!-- Sección: Aportantes -->
      <section class="flex flex-col gap-4">
        <h5 class="text-lg font-semibold font-primary text-gray-900">Aportantes</h5>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p class="text-sm text-gray-600">
            {{
              context === "punto-acuerdo"
                ? "Lista de aportantes seleccionados para este acuerdo."
                : "Resumen de los aportantes que participaron en el acuerdo."
            }}
          </p>
          <!-- TODO: Aquí irá la tabla o lista de aportantes -->
          <BlankContainer />
        </div>
      </section>

      <!-- Sección: Aportes -->
      <section class="flex flex-col gap-4">
        <h5 class="text-lg font-semibold font-primary text-gray-900">Aportes Dinerarios</h5>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p class="text-sm text-gray-600">
            {{
              context === "punto-acuerdo"
                ? "Detalle de los montos aportados por cada aportante."
                : "Consolidado de los aportes realizados."
            }}
          </p>
          <!-- TODO: Aquí irá la tabla de aportes -->
          <BlankContainer />
        </div>
      </section>

      <!-- Sección: Votación -->
      <section class="flex flex-col gap-4">
        <h5 class="text-lg font-semibold font-primary text-gray-900">Votación</h5>
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p class="text-sm text-gray-600">
            {{
              context === "punto-acuerdo"
                ? "Resultado de la votación del acuerdo."
                : "Resumen de la votación realizada."
            }}
          </p>
          <!-- TODO: Aquí irá el resumen de la votación -->
          <BlankContainer />
        </div>
      </section>

      <!-- Sección: Resumen Final -->
      <section class="flex flex-col gap-4">
        <h5 class="text-lg font-semibold font-primary text-gray-900">Resumen Final</h5>
        <div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Total Aportado:</span>
              <span class="text-lg font-semibold text-primary-800">$0.00</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Número de Aportantes:</span>
              <span class="text-lg font-semibold text-primary-800">0</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Estado:</span>
              <span
                class="px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800"
              >
                {{ context === "punto-acuerdo" ? "En Proceso" : "Completado" }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Titles from "~/types/enums/Titles.enum";

  /**
   * Componente: ResumenAporteDinerario
   *
   * Componente reutilizable para mostrar el resumen del proceso de aporte dinerario.
   * Puede usarse tanto en la vista específica del punto de acuerdo como en el resumen general.
   *
   * Props:
   * - context: 'punto-acuerdo' | 'resumen-general'
   *   - 'punto-acuerdo': Vista dentro del punto de acuerdo específico
   *   - 'resumen-general': Vista en el resumen general de la junta
   */

  interface Props {
    context?: "punto-acuerdo" | "resumen-general";
  }

  withDefaults(defineProps<Props>(), {
    context: "punto-acuerdo",
  });
</script>

<style scoped>
  /* Estilos específicos del componente si son necesarios */
</style>
