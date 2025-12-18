<script setup lang="ts">
  import { onMounted } from "vue";
  import ConfirmDeleteModal from "~/components/base/modal/ConfirmDeleteModal.vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useOtorgamientoPoderesController } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/composables/useOtorgamientoPoderesController";
  import { useOtorgamientoPoderesStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useOtorgamientoPoderesStore";
  import FacultadesApoderados from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/components/FacultadesApoderados.vue";
  import FacultadApoderadoModal from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/components/modals/FacultadApoderadoModal.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();
  const societyId = Number(route.params.societyId);
  const flowId = Number(route.params.flowId);

  const otorgamientoStore = useOtorgamientoPoderesStore();

  // Usar el composable
  const {
    isLoading,
    modoOperacion,
    gerenteAMostrar,
    puedeAgregarPoderes,
    apoderadosFacultades,
    isApoderadoFacultadesModalOpen,
    modeModalApoderadoFacultad,
    listaFacultadesDisponibles,
    facultadActions,
    confirmDelete,
    loadData,
    openModalFacultadApoderado,
    handleCloseModalApoderadoFacultad,
    handleSubmitApoderadoFacultad,
  } = useOtorgamientoPoderesController(societyId, flowId);

  // Cargar datos al montar
  onMounted(async () => {
    try {
      await loadData();
    } catch (error) {
      console.error("Error al cargar datos de otorgamiento de poderes", error);
    }
  });
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Otorgamiento de Poderes"
      subtitle="Define las facultades y limitaciones delegadas al gerente designado."
    />

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <p>Cargando poderes...</p>
    </div>

    <div v-else-if="!gerenteAMostrar" class="flex justify-center items-center py-10">
      <p class="text-gray-500">
        No hay gerente designado. Por favor, completa primero el nombramiento del gerente.
      </p>
    </div>

    <div v-else class="flex flex-col gap-10">
      <!-- Información del gerente -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">Gerente:</h3>
        <p v-if="gerenteAMostrar && 'persona' in gerenteAMostrar">
          {{
            gerenteAMostrar.persona.tipo === "NATURAL"
              ? `${gerenteAMostrar.persona.nombre} ${
                  gerenteAMostrar.persona.apellidoPaterno || ""
                } ${gerenteAMostrar.persona.apellidoMaterno || ""}`.trim()
              : gerenteAMostrar.persona.razonSocial ||
                gerenteAMostrar.persona.nombreComercial ||
                ""
          }}
        </p>
        <p class="text-sm text-gray-500 mt-1">
          Modo:
          {{ modoOperacion === "CREAR_NUEVO_GERENTE" ? "Nuevo Gerente" : "Extender Poderes" }}
        </p>
      </div>

      <!-- Lista de poderes -->
      <FacultadesApoderados
        v-for="apoderado in apoderadosFacultades"
        :key="apoderado.id"
        :apoderado-item="apoderado"
        :mode="EntityModeEnum.CREAR"
        :actions="facultadActions"
        @open-modal="openModalFacultadApoderado"
      />

      <!-- Modal de facultades -->
      <FacultadApoderadoModal
        v-model="isApoderadoFacultadesModalOpen"
        :mode="modeModalApoderadoFacultad"
        :lista-facultades-options="listaFacultadesDisponibles"
        @close="handleCloseModalApoderadoFacultad"
        @submit="handleSubmitApoderadoFacultad"
      />

      <!-- Modal de confirmación de eliminación -->
      <ConfirmDeleteModal
        v-model="confirmDelete.isOpen.value"
        :title="confirmDelete.title"
        :message="confirmDelete.message"
        :confirm-label="confirmDelete.confirmLabel"
        :cancel-label="confirmDelete.cancelLabel"
        :is-loading="confirmDelete.isLoading.value"
        @confirm="confirmDelete.handleConfirm"
        @cancel="confirmDelete.handleCancel"
      />
    </div>
  </SlotWrapper>
</template>
