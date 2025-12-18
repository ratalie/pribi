<template>
  <SlotWrapper>
    <TitleH2
      title="Créditos"
      subtitle="Detalla los créditos, montos y condiciones que serán aportados como capital."
    />
    <div class="flex flex-col gap-10">
      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <p class="text-gray-600">Cargando capitalizaciones...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Lista de capitalizaciones -->
      <div v-else-if="capitalizaciones.length > 0" class="space-y-4">
        <div
          v-for="capitalizacion in capitalizaciones"
          :key="capitalizacion.id"
          class="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="font-semibold text-gray-900">
                Capitalización #{{ capitalizacion.id }}
              </p>
              <div class="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-600">Acreedor ID:</p>
                  <p class="font-medium">{{ capitalizacion.shareholderId }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Monto Original:</p>
                  <p class="font-medium">
                    {{ capitalizacion.currency }} {{ capitalizacion.amount.toLocaleString() }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-600">Monto a Capitalizar:</p>
                  <p class="font-medium">
                    {{ capitalizacion.currency }}
                    {{ capitalizacion.totalToCapitalize.toLocaleString() }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-600">Acciones a Recibir:</p>
                  <p class="font-medium">{{ capitalizacion.sharesToReceive }}</p>
                </div>
                <div>
                  <p class="text-gray-600">Precio por Acción:</p>
                  <p class="font-medium">
                    {{ capitalizacion.currency }} {{ capitalizacion.pricePerShare.toLocaleString() }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-600">Prima Total:</p>
                  <p class="font-medium">
                    {{ capitalizacion.currency }} {{ capitalizacion.totalPremium.toLocaleString() }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sin capitalizaciones -->
      <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p class="text-gray-600">No hay capitalizaciones registradas aún.</p>
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useCapitalizacionesController } from "~/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/creditos/composables/useCapitalizacionesController";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const { capitalizaciones, isLoading, error } = useCapitalizacionesController();
</script>
