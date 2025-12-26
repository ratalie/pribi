<script setup lang="ts">
  import IconCoin from "~/assets/icons/icon-coin.svg";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import OutLineCard from "~/components/base/cards/OutLineCard.vue";
  import ConfirmDeleteModal from "~/components/base/modal/ConfirmDeleteModal.vue";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import AccionesModal from "./components/modals/AccionesModal.vue";
  import ValorNominalModal from "./components/modals/ValorNominalModal.vue";
  import { useAccionesComputed } from "./composable/useAccionesComputed";

  interface Props {
    mode: EntityModeEnum;
    societyId?: string;
  }

  const props = defineProps<Props>();

  const IconCoinValue = computed(() => {
    return IconCoin;
  });

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
    isConfirmChangeTypeModalOpen,
    handleConfirmChangeType,
    handleCancelChangeType,
    handleSwitchTabsChange,
  } = useAccionesComputed(props.societyId ?? "");
</script>

<template>
  <div
    :class="[
      'h-full w-full flex flex-col gap-12',
      mode !== EntityModeEnum.RESUMEN
        ? ' py-8 px-10 2xl:py-14 2xl:px-14 '
        : 'border border-gray-100 rounded-xl py-12 px-10',
    ]"
  >
    <CardTitle
      title="Capital Social y Acciones"
      :body="mode !== EntityModeEnum.RESUMEN ? 'Complete todos los campos requeridos.' : ''"
    >
      <template v-if="mode !== EntityModeEnum.RESUMEN" #actions>
        <div class="flex gap-4">
          <!-- valor nominal -->
          <BaseButton
            v-if="valorNominalStore.valor === 0"
            variant="pill"
            class="h-11"
            @click="openValorNominalModal"
          >
            <img :src="IconCoinValue" alt="Valor Nominal" />
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
      <!-- Card: Tipo de Acciones (Clickeable) -->
      <div
        :class="[
          'flex justify-between items-center px-6 py-3.5 border-2 bg-gray-25 rounded-lg transition-all',
          mode !== EntityModeEnum.RESUMEN
            ? 'cursor-pointer hover:border-primary-500 hover:bg-primary-50 hover:shadow-sm'
            : 'cursor-default',
        ]"
        @click="mode !== EntityModeEnum.RESUMEN ? openValorNominalModal() : null"
      >
        <p class="font-primary font-semibold t-h6 text-gray-800">Tipo de acciones</p>
        <div class="flex items-center gap-2">
          <p class="font-secondary font-medium t-t1 text-gray-800">
            {{
              switchTabs === "opcion-a" ? "Comunes y sin derecho a voto" : "Clases de Acciones"
            }}
          </p>
          <svg
            v-if="mode !== EntityModeEnum.RESUMEN"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
      </div>

      <!-- Card: Valor Nominal (Clickeable) -->
      <div
        :class="[
          'flex justify-between items-center px-6 py-3.5 border-2 bg-gray-25 rounded-lg transition-all',
          mode !== EntityModeEnum.RESUMEN
            ? 'cursor-pointer hover:border-primary-500 hover:bg-primary-50 hover:shadow-sm'
            : 'cursor-default',
        ]"
        @click="mode !== EntityModeEnum.RESUMEN ? openValorNominalModal() : null"
      >
        <div class="flex items-center gap-2">
          <img :src="IconCoinValue" alt="Valor Nominal" />
          <p class="font-primary font-semibold t-h6 text-gray-800">Valor Nominal:</p>
        </div>
        <div class="flex items-center gap-2">
          <p class="font-secondary font-medium t-t1 text-gray-800">
            {{ valorNominalDisplay }}
          </p>
          <svg
            v-if="mode !== EntityModeEnum.RESUMEN"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
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
      :actions="mode !== EntityModeEnum.RESUMEN ? accionesActions : undefined"
    />

    <ValorNominalModal
      v-model="isValorNominalModalOpen"
      v-model:switch-tabs="switchTabs"
      :valor-nominal="valorNominalStore.valor"
      :tipo-acciones-sociedad="
        valorNominalStore.tipoAccionesSociedad === 'COMUNES_SIN_DERECHO_VOTO'
          ? 'opcion-a'
          : valorNominalStore.tipoAccionesSociedad === 'CON_CLASES'
          ? 'opcion-b'
          : null
      "
      :handle-save-valor-nominal="handleSaveValorNominal"
      :on-switch-tabs-change="handleSwitchTabsChange"
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

    <!-- Modal de confirmación de cambio de tipo de acciones -->
    <ConfirmDeleteModal
      v-model="isConfirmChangeTypeModalOpen"
      title="Cambiar tipo de acciones"
      message="Al cambiar el tipo de acciones, se eliminarán todas las acciones existentes de la sociedad. Esta acción no se puede deshacer. ¿Deseas continuar?"
      confirm-label="Sí, cambiar tipo"
      cancel-label="Cancelar"
      :is-loading="isLoading"
      @confirm="handleConfirmChangeType"
      @cancel="handleCancelChangeType"
    />
  </div>
</template>
