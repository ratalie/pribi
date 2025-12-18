<script setup lang="ts">
  import { onMounted } from "vue";
  import { useRoute } from "vue-router";
  import ConfirmDeleteModal from "~/components/base/modal/ConfirmDeleteModal.vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useOtorgamientoPoderesApoderadosController } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/composables/useOtorgamientoPoderesApoderadosController";
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

  // ✅ Usar composable
  const {
    isLoading,
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
  } = useOtorgamientoPoderesApoderadosController(societyId, flowId);

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
      subtitle="Documenta las facultades delegadas, limitaciones y vigencia de cada apoderado."
    />

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <p>Cargando poderes...</p>
    </div>

    <div
      v-else-if="apoderadosFacultades.length === 0"
      class="flex justify-center items-center py-10"
    >
      <p class="text-gray-500">
        No hay apoderados seleccionados como candidatos. Por favor, selecciona apoderados en la
        vista de nombramiento.
      </p>
    </div>

    <div v-else class="flex flex-col gap-10">
      <FacultadesApoderados
        v-for="apoderado in apoderadosFacultades"
        :key="apoderado.id"
        :apoderado-item="apoderado"
        :mode="EntityModeEnum.CREAR"
        :actions="facultadActions"
        @open-modal="openModalFacultadApoderado"
      />

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
