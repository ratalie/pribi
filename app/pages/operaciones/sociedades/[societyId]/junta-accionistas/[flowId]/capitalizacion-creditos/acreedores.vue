<template>
  <SlotWrapper>
    <TitleH2
      title="Acreedores"
      subtitle="Identifica a los acreedores cuyos créditos serán capitalizados."
    />
    <div class="flex flex-col gap-10">
      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <p class="text-gray-600">Cargando acreedores...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Lista de acreedores -->
      <div v-else-if="acreedores.length > 0" class="space-y-4">
        <div
          v-for="acreedor in acreedores"
          :key="acreedor.id"
          class="bg-white border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold text-gray-900">
                {{ acreedor.contributor.nombre || "" }}
                {{ acreedor.contributor.apellidoPaterno || "" }}
                {{ acreedor.contributor.apellidoMaterno || "" }}
                {{ acreedor.contributor.razonSocial || "" }}
              </p>
              <p class="text-sm text-gray-600">
                {{ acreedor.contributor.tipoDocumento }}: {{ acreedor.contributor.numeroDocumento }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Tipo: {{ acreedor.contributorType }} | Contribuyente:
                {{ acreedor.isContributor ? "Sí" : "No" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sin acreedores -->
      <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p class="text-gray-600">No hay acreedores registrados aún.</p>
      </div>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useAcreedoresController } from "~/core/presentation/juntas/puntos-acuerdo/capitalizacion-creditos/acreedores/composables/useAcreedoresController";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const { acreedores, isLoading, error } = useAcreedoresController();
</script>
