<script setup lang="ts">
  import IconCoin from "~/assets/icons/icon-coin.svg";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import OutLineCard from "~/components/base/cards/OutLineCard.vue";
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
    accionesData,
    totalAccionesDisplay,
    totalTiposDisplay,
    capitalSocialDisplay,
    valorNominalDisplay,
    isValorNominalModalOpen,
    isAccionesModalOpen,
    accionesModalMode,
    accionSeleccionadaId,
    openValorNominalModal,
    openAccionesModal,
    closeValorNominalModal,
    closeAccionesModal,
    handleSaveValorNominal,
    accionesActions,
    valorNominalStore,
  } = useAccionesComputed(props.societyId ?? "");
</script>

<template>
  <div class="h-full w-full p-14 flex flex-col gap-12">
    <CardTitle title="Capital Social y Acciones" body="Complete todos los campos requeridos.">
      <template #actions>
        <div class="flex gap-4">
          <!-- valor nominal -->
          <BaseButton variant="pill" class="h-11" @click="openValorNominalModal">
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

    <!-- cards de resumen -->
    <div class="grid grid-cols-3 gap-6">
      <OutLineCard title="Total de acciones de la sociedad" :value="totalAccionesDisplay" />
      <OutLineCard title="Cantidad de Tipo de Acciones" :value="totalTiposDisplay" />
      <OutLineCard title="Capital Social" :value="capitalSocialDisplay" />
    </div>

    <SimpleTable
      :columns="columns"
      :data="accionesData"
      title-menu="Acciones"
      :actions="accionesActions"
    />

    <ValorNominalModal
      v-model="isValorNominalModalOpen"
      :valor-nominal="valorNominalStore.valor"
      :handle-save-valor-nominal="handleSaveValorNominal"
      @close="closeValorNominalModal"
    />

    <AccionesModal
      v-model="isAccionesModalOpen"
      :mode="accionesModalMode"
      :accion-id="accionSeleccionadaId"
      :society-id="props.societyId"
      @close="closeAccionesModal"
    />
  </div>
</template>
