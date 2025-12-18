<script setup lang="ts">
  import { ref, watch } from "vue";
  import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { TipoFirmasUIEnum } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";
  import { useOtorgamientoPoderesStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-gerente/stores/useOtorgamientoPoderesStore";
  import FacultadesApoderados from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/components/FacultadesApoderados.vue";
  import FacultadApoderadoModal from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/components/modals/FacultadApoderadoModal.vue";
  import { useApoderadoFacultadStore } from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/stores/modal/useApoderadoFacultadStore";
  import type { ApoderadoFacultadRow } from "~/core/presentation/registros/sociedades/pasos/regimen-poderes/types/apoderadosFacultades";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // Estado local de ejemplo para los poderes del gerente
  const apoderadosFacultades = ref<ApoderadoFacultadRow[]>([
    {
      id: "gerente-1",
      nombre: "Gerente General de Ejemplo",
      facultades: [
        {
          id: "fac-1",
          facultad: "Facultad general de representación",
          vigencia: "Indefinida",
          reglas_firma: 1,
          reglas_y_limites: [
            {
              id: "regla-1",
              table_id: 1,
              desde: "0",
              hasta: "10000",
              tipo_firma: TipoFirmasUIEnum.SOLA_FIRMA,
              firmantes: [
                {
                  id: "firm-1",
                  cantidad: 1,
                  grupo: "Gerente General",
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  // Estado del modal
  const isApoderadoFacultadesModalOpen = ref(false);
  const modeModalApoderadoFacultad = ref<"crear" | "editar">("crear");
  const listaFacultadesOptions = ref<BaseSelectOption[]>([
    { id: "fac-rep", label: "Facultad general de representación", value: "fac-rep" },
    { id: "fac-banc", label: "Facultad bancaria", value: "fac-banc" },
  ]);

  const apoderadoSeleccionadoId = ref<string | null>(null);
  const facultadSeleccionadaId = ref<string | null>(null);
  const apoderadoFacultadStore = useApoderadoFacultadStore();
  const otorgamientoStore = useOtorgamientoPoderesStore();

  // Sincronizar con el store cuando cambie apoderadosFacultades
  watch(
    () => apoderadosFacultades.value,
    (newValue) => {
      otorgamientoStore.setApoderadosFacultades(newValue);
    },
    { deep: true, immediate: true }
  );

  const openModalFacultadApoderado = (idApoderado: string) => {
    // Resetear estado del modal para creación
    apoderadoFacultadStore.$reset();
    apoderadoFacultadStore.tipoFacultad = "";

    apoderadoSeleccionadoId.value = idApoderado;
    facultadSeleccionadaId.value = null;
    modeModalApoderadoFacultad.value = "crear";
    isApoderadoFacultadesModalOpen.value = true;
  };

  const handleCloseModalApoderadoFacultad = () => {
    apoderadoFacultadStore.$reset();
    isApoderadoFacultadesModalOpen.value = false;
    apoderadoSeleccionadoId.value = null;
    facultadSeleccionadaId.value = null;
    modeModalApoderadoFacultad.value = "crear";
  };

  const handleSubmitApoderadoFacultad = () => {
    if (!apoderadoSeleccionadoId.value) {
      handleCloseModalApoderadoFacultad();
      return;
    }

    const apoderado = apoderadosFacultades.value.find(
      (a) => a.id === apoderadoSeleccionadoId.value
    );

    if (!apoderado) {
      handleCloseModalApoderadoFacultad();
      return;
    }

    if (modeModalApoderadoFacultad.value === "crear") {
      const opcion = listaFacultadesOptions.value[0];
      if (!opcion) {
        handleCloseModalApoderadoFacultad();
        return;
      }
      const nuevaFacultadId = `fac-${Math.random().toString(36).slice(2)}`;

      apoderado.facultades.push({
        id: nuevaFacultadId,
        facultad: opcion.label,
        vigencia: "Indefinida",
        reglas_firma: 1,
        reglas_y_limites: [
          {
            id: `${nuevaFacultadId}-regla-1`,
            table_id: 1,
            desde: "0",
            hasta: "10000",
            tipo_firma: TipoFirmasUIEnum.SOLA_FIRMA,
            firmantes: [
              {
                id: "firm-1",
                cantidad: 1,
                grupo: "Gerente General",
              },
            ],
          },
        ],
      });
    } else if (modeModalApoderadoFacultad.value === "editar" && facultadSeleccionadaId.value) {
      const opcion = listaFacultadesOptions.value[0];
      if (!opcion) {
        handleCloseModalApoderadoFacultad();
        return;
      }
      const facultad = apoderado.facultades.find((f) => f.id === facultadSeleccionadaId.value);
      if (facultad) {
        facultad.facultad = opcion.label;
      }
    }

    handleCloseModalApoderadoFacultad();
  };

  const facultadActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: (idFacultad: string, idApoderado: string) => {
        const apoderado = apoderadosFacultades.value.find((a) => a.id === idApoderado);
        if (!apoderado) return;

        const facultad = apoderado.facultades.find((f) => f.id === idFacultad);
        if (!facultad) return;

        // Buscar la opción correspondiente a la facultad actual para precargar el select
        const opcion = listaFacultadesOptions.value.find(
          (opt) => opt.label === facultad.facultad
        );

        apoderadoFacultadStore.$reset();
        apoderadoFacultadStore.tipoFacultad = opcion ? (opcion.value as string) : "";

        apoderadoSeleccionadoId.value = idApoderado;
        facultadSeleccionadaId.value = idFacultad;
        modeModalApoderadoFacultad.value = "editar";
        isApoderadoFacultadesModalOpen.value = true;
      },
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: (idFacultad: string, idApoderado: string) => {
        const apoderado = apoderadosFacultades.value.find((a) => a.id === idApoderado);
        if (!apoderado) return;
        apoderado.facultades = apoderado.facultades.filter((f) => f.id !== idFacultad);
      },
    },
  ];
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Otorgamiento de Poderes"
      subtitle="Define las facultades y limitaciones delegadas al gerente designado."
    />

    <div class="flex flex-col gap-10">
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
        :lista-facultades-options="listaFacultadesOptions"
        @close="handleCloseModalApoderadoFacultad"
        @submit="handleSubmitApoderadoFacultad"
      />
    </div>
  </SlotWrapper>
</template>
