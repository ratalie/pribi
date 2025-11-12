<script setup lang="ts">
  import { computed, ref } from "vue";
  import IconCoin from "~/assets/icons/icon-coin.svg";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import OutLineCard from "~/components/base/cards/OutLineCard.vue";
  import AccionesModal from "~/components/base/modal/composite/AccionesModal.vue";
  import ValorNominalModal from "~/components/base/modal/composite/ValorNominalModal.vue";
  import { getColumns, type TableColumn } from "~/components/base/tables/getColumns";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import { useAccionesComunesStore } from "~/stores/useAccionesComunesStore";
  import { useClasesAccionesStore } from "~/stores/useClasesAccionesStore";
  import { useValorNominalStore } from "~/stores/useValorNominalStore";
  import type { EntityModeEnum } from "~/types/enums/EntityModeEnum";
  import {
    useRegistroAccionesStore,
    type AccionTableRow,
  } from "../../stores/useRegistroAccionesStore";

  interface Props {
    mode: EntityModeEnum;
    societyId?: string;
  }

  defineProps<Props>();

  const valorNominalStore = useValorNominalStore();
  const registroAccionesStore = useRegistroAccionesStore();
  const accionesComunesStore = useAccionesComunesStore();
  const clasesAccionesStore = useClasesAccionesStore();

  const societyHeaders: TableColumn<AccionTableRow>[] = [
    { key: "tipo_acciones", label: "Tipo de Acciones", type: "text" },
    { key: "acciones_suscritas", label: "Acciones Suscritas", type: "text" },
    { key: "participacion", label: "Participación", type: "text" },
    { key: "derecho_voto", label: "Derecho a Voto", type: "icons", icons: ["Check", "X"] },
    { key: "redimibles", label: "Redimibles", type: "icons", icons: ["Check", "X"] },
    {
      key: "derechos_especiales",
      label: "Derechos Especiales",
      type: "icons",
      icons: ["FileCheck", "X"],
    },
    {
      key: "obligaciones_adicionales",
      label: "Obligaciones Adicionales",
      type: "icons",
      icons: ["FileCheck", "X"],
    },
  ];

  const columns = getColumns(societyHeaders);
  const currencyFormatter = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const accionesData = computed(() => registroAccionesStore.tablaAcciones);
  const totalAcciones = computed(() => registroAccionesStore.totalAcciones);
  const totalTipos = computed(() => registroAccionesStore.totalTipos);
  const capitalSocial = computed(() => valorNominalStore.valor * totalAcciones.value);

  const totalAccionesDisplay = computed(() => totalAcciones.value.toLocaleString("es-PE"));
  const totalTiposDisplay = computed(() => totalTipos.value.toString());
  const capitalSocialDisplay = computed(() =>
    currencyFormatter.format(capitalSocial.value || 0)
  );
  const valorNominalDisplay = computed(() =>
    currencyFormatter.format(valorNominalStore.valor || 0)
  );

  const isValorNominalModalOpen = ref(false);
  const isAccionesModalOpen = ref(false);
  const accionesModalMode = ref<"crear" | "editar">("crear");
  const accionSeleccionadaId = ref<string | null>(null);

  const resetAccionForms = () => {
    accionesComunesStore.$reset();
    clasesAccionesStore.$reset();
  };

  const openValorNominalModal = () => {
    isValorNominalModalOpen.value = true;
  };

  const openAccionesModal = () => {
    resetAccionForms();
    accionesModalMode.value = "crear";
    accionSeleccionadaId.value = null;
    isAccionesModalOpen.value = true;
  };

  const handleEditAccion = (id: string) => {
    const accion = registroAccionesStore.getAccionById(id);

    if (!accion) {
      return;
    }

    resetAccionForms();
    accionesModalMode.value = "editar";
    accionSeleccionadaId.value = id;
    isAccionesModalOpen.value = true;
  };

  const handleDeleteAccion = (id: string) => {
    registroAccionesStore.removeAccion(id);
  };

  const actions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditAccion,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleDeleteAccion,
    },
  ];
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
      :actions="actions"
    />

    <ValorNominalModal
      v-model="isValorNominalModalOpen"
      v-model:valor-nominal="valorNominalStore.valor"
      @close="isValorNominalModalOpen = false"
      @update:valor-nominal="valorNominalStore.setValor($event)"
    />

    <AccionesModal
      v-model="isAccionesModalOpen"
      :mode="accionesModalMode"
      :accion-id="accionSeleccionadaId"
      @close="isAccionesModalOpen = false"
    />
  </div>
</template>
