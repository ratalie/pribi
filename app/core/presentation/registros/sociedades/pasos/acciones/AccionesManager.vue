<script setup lang="ts">
  import IconCoin from "~/assets/icons/icon-coin.svg";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import OutLineCard from "~/components/base/cards/OutLineCard.vue";
  import ConfirmDeleteModal from "~/components/base/modal/ConfirmDeleteModal.vue";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import AccionesModal from "./components/modals/AccionesModal.vue";
  import ValorNominalModal from "./components/modals/ValorNominalModal.vue";
  import { useAccionesComputed } from "./composable/useAccionesComputed";

  interface Props {
    mode: EntityModeEnum;
    societyId?: string;
  }

  const props = defineProps<Props>();

  const {
    columns,
    registroAccionesStore,
    capitalSocialDisplay,
    valorNominalDisplay,
    isValorNominalModalOpen,
    isAccionesModalOpen,
    accionesModalMode,
    accionSeleccionadaId,
    switchTabs,
    isLoading,
    openValorNominalModal,
    openAccionesModal,
    closeValorNominalModal,
    closeAccionesModal,
    handleSaveValorNominal,
    handleAccionesModalSubmit,
    accionesActions,
    valorNominalStore,
    confirmDelete,
  } = useAccionesComputed(props.societyId ?? "");
</script>

<template>
  <div class="h-full w-full p-14 flex flex-col gap-12">
    <CardTitle title="Capital Social y Acciones" body="Complete todos los campos requeridos.">
      <template #actions>
        <div class="flex gap-4">
          <!-- valor nominal -->
          <BaseButton
            v-if="valorNominalStore.valor === 0"
            variant="pill"
            class="h-11"
            @click="openValorNominalModal"
          >
            <img :src="IconCoin" alt="Valor Nominal" />
            <p class="font-bold">
              Valor Nominal:
              <span class="font-bold">{{ valorNominalDisplay }}</span>
            </p>
          </BaseButton>

          <!-- agregar -->
          <ActionButton
            variant="secondary"
            label="Agregar"
            size="md"
            icon="Plus"
            :is-disabled="valorNominalStore.valor <= 0"
            @click="openAccionesModal"
          />
        </div>
      </template>
    </CardTitle>

    <!-- datos del tipo de acciones y el valor nominal -->
    <div class="grid grid-cols-2 gap-8">
      <div
        class="flex justify-between items-center px-6 py-3.5 border-2 bg-gray-25 rounded-lg"
      >
        <p class="font-primary font-semibold t-h6 text-gray-800">Tipo de acciones</p>
        <p class="font-secondary font-medium t-t1 text-gray-800">
          {{
            switchTabs === "opcion-a" ? "Comunes y sin derecho a voto" : "Clases de Acciones"
          }}
        </p>
      </div>

      <div
        class="flex justify-between items-center px-6 py-3.5 border-2 bg-gray-25 rounded-lg"
      >
        <div class="flex items-center gap-2">
          <img :src="IconCoin" alt="Valor Nominal" />
          <p class="font-primary font-semibold t-h6 text-gray-800">Valor Nominal:</p>
        </div>
        <p class="font-secondary font-medium t-t1 text-gray-800">{{ valorNominalDisplay }}</p>
      </div>
    </div>

    <!-- cards de resumen -->
    <div class="grid grid-cols-3 gap-6">
      <OutLineCard
        title="Total de acciones de la sociedad"
        :value="registroAccionesStore.totalAcciones.toLocaleString('es-PE')"
      />
      <OutLineCard
        title="Cantidad de Tipo de Acciones"
        :value="registroAccionesStore.totalTipos.toString()"
      />
      <OutLineCard title="Capital Social" :value="capitalSocialDisplay" />
    </div>

    <SimpleTable
      :columns="columns"
      :data="registroAccionesStore.tablaAcciones"
      title-menu="Acciones"
      :actions="accionesActions"
    />

    <ValorNominalModal
      v-model="isValorNominalModalOpen"
      v-model:switch-tabs="switchTabs"
      :valor-nominal="valorNominalStore.valor"
      :handle-save-valor-nominal="handleSaveValorNominal"
      @close="closeValorNominalModal"
    />

    <AccionesModal
      v-model="isAccionesModalOpen"
      :mode="accionesModalMode"
      :accion-id="accionSeleccionadaId"
      :society-id="props.societyId"
      :valor-nominal-display="valorNominalDisplay"
      :is-loading="isLoading"
      :switch-tabs="switchTabs"
      @close="closeAccionesModal"
      @submit="handleAccionesModalSubmit"
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
</template>
