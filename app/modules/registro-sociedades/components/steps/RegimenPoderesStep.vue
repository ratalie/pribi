<script setup lang="ts">
  import { SquarePen, Trash2 } from "lucide-vue-next";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SecondaryCard from "~/components/base/cards/SecondaryCard.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import type { TableColumn } from "~/components/base/tables/getColumns";
  import PoderesApoderado from "~/modules/registro-sociedades/components/steps/regimen-poderes/PoderesApoderado.vue";
  // import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  interface Props {
    // mode: EntityModeEnum;
    societyId?: string;
  }

  interface PoderRow {
    id: string;
    tipo_poder: string;
    vigencia?: string;
    reglas_firma?: string;
    vacio?: string;
    descripcion?: string;
    detalles?: string;
    detalleFilas?: {
      desde: string;
      hasta: string;
      tipoFirma: string;
      firmantes: string;
    }[];
  }

  defineProps<Props>();

  // Datos de ejemplo para la tabla de poderes
  const poderesColumns: TableColumn<PoderRow>[] = [
    { key: "tipo_poder", label: "Tipo de Poder", type: "text" },
    { key: "vigencia", label: "Vigencia", type: "text" },
    { key: "reglas_firma", label: "Reglas de Firma", type: "text" },
    { key: "detalles", label: "", type: "text" },
  ];

  const poderesData = ref<PoderRow[]>([
    {
      id: "1",
      tipo_poder: "Facultades Administrativas",
      vigencia: "2025-01-01 a 2026-01-01",
      reglas_firma: "1",
      detalles: "Ver detalles",
      detalleFilas: [
        {
          desde: "S/ 40.00",
          hasta: "S/ 90.00",
          tipoFirma: "A sola firma",
          firmantes: "No requiere otra firma",
        },
      ],
    },
    {
      id: "2",
      tipo_poder: "Facultades Bancarias",
      vigencia: "2025-01-01 a 2026-01-01",
      reglas_firma: "2",
      detalles: "Ver detalles",
      detalleFilas: [
        {
          desde: "S/ 50.00",
          hasta: "S/ 500.00",
          tipoFirma: "A sola firma",
          firmantes: "No requiere otra firma",
        },
        {
          desde: "S/ 50.00",
          hasta: "Sin límite",
          tipoFirma: "A firma conjunta",
          firmantes: "1 Apoderado de Grupo A, 3 Apoderados de Grupo B",
        },
      ],
    },
  ]);

  const poderesActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (id: string) => {
        console.log("Editar poder", id);
      },
    },
    {
      label: "Ver",
      icon: "SquarePen",
      onClick: (id: string) => {
        console.log("Ver poder", id);
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (id: string) => {
        console.log("Eliminar poder", id);
      },
    },
  ];

  const handleAddPower = () => {
    console.log("Agregar nuevo poder");
    // Aquí puedes agregar lógica para abrir un modal o formulario
  };
</script>

<template>
  <div class="mb-14">
    <div class="h-full p-14 flex flex-col gap-12">
      <CardTitle
        title="Régimen General de Poderes"
        body="Complete todos los campos requeridos."
      />
      <SimpleCard>
        <CardTitle title="Tipo de Poderes" body="">
          <template #actions>
            <ActionButton
              variant="secondary"
              label="Agregar tipo de Poder"
              size="xxl"
              icon="Plus"
            />
          </template>
        </CardTitle>
        <div class="flex flex-col gap-4">
          <div class="flex gap-2 w-full">
            <SecondaryCard
              padding="p-8"
              border-radius="rounded-lg"
              border-color="border-gray-200"
              background-color="bg-white"
              width="w-full"
            >
              <p class="t-t2 font-secondary text-gray-700 font-normal">
                Facultades Administrativas
              </p>
            </SecondaryCard>
            <BaseButton
              variant="ghost"
              class="py-10! px-8! rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition-colors"
            >
              <SquarePen class="w-4 h-4 text-gray-700" />
            </BaseButton>

            <BaseButton
              variant="ghost"
              class="py-10! px-8! rounded-lg border border-gray-200 bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Trash2 class="w-4 h-4 text-white" />
            </BaseButton>
          </div>
          <div class="flex gap-2 w-full">
            <SecondaryCard
              padding="p-8"
              border-radius="rounded-lg"
              border-color="border-gray-200"
              background-color="bg-white"
              width="w-full"
            >
              <p class="t-t2 font-secondary text-gray-700 font-normal">Facultades Bancarias</p>
            </SecondaryCard>
            <BaseButton
              variant="ghost"
              class="py-10! px-8! rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition-colors"
            >
              <SquarePen class="w-4 h-4 text-gray-700" />
            </BaseButton>

            <BaseButton
              variant="ghost"
              class="py-10! px-8! rounded-lg border border-gray-200 bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Trash2 class="w-4 h-4 text-white" />
            </BaseButton>
          </div>
        </div>
      </SimpleCard>

      <!-- Poderes de los Apoderados -->
      <SimpleCard>
        <CardTitle title="Poderes de los Apoderados" body="" />

        <div class="flex flex-col gap-6">
          <PoderesApoderado
            apoderado-title="Gerente General"
            :columns="poderesColumns"
            :data="poderesData"
            :actions="poderesActions"
            @add-power="handleAddPower"
          />
        </div>
      </SimpleCard>

      <!-- Poderes de Otros Apoderados -->
      <SimpleCard>
        <CardTitle title="Poderes de los Apoderados" body="" />

        <div class="flex flex-col gap-6">
          <PoderesApoderado
            apoderado-title="Maria Fernanda Torres"
            :columns="poderesColumns"
            :data="poderesData"
            :actions="poderesActions"
            @add-power="handleAddPower"
          />
        </div>
      </SimpleCard>
    </div>
  </div>
</template>
