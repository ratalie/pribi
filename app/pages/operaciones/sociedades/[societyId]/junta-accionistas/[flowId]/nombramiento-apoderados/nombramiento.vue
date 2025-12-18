<template>
  <SlotWrapper>
    <TitleH2
      title="Designación"
      subtitle="Registra los apoderados propuestos y su información clave."
    />

    <div class="flex flex-col gap-10">
      <!-- Tabla de Apoderados -->
      <SimpleCard>
        <CardTitle title="Registro de Apoderados" body="">
          <template #actions>
            <ActionButton
              variant="secondary"
              label="Agregar apoderado"
              size="lg"
              icon="Plus"
              :disabled="claseOptions.length === 0"
              @click="openModalApoderado"
            />
          </template>
        </CardTitle>

        <NombramientoApoderadosTable
          :items="apoderados"
          :actions="apoderadoActions"
          :get-action-disabled="getActionDisabledApoderado"
        />
      </SimpleCard>

      <!-- Tabla de Otros Apoderados -->
      <SimpleCard>
        <CardTitle title="Registro de Otros Apoderados" body="">
          <template #actions>
            <ActionButton
              variant="secondary"
              label="Agregar apoderado"
              size="lg"
              icon="Plus"
              @click="openModalOtroApoderado"
            />
          </template>
        </CardTitle>

        <NombramientoOtrosApoderadosTable
          :items="otrosApoderadosComputed"
          :actions="otroApoderadoActions"
          :get-action-disabled="getActionDisabledOtroApoderado"
        />
      </SimpleCard>

      <!-- Modal para Apoderados -->
      <RegistroApoderadoModal
        v-model="isOpenModalApoderado"
        v-model:clase-apoderado-id="selectedClaseId"
        :mostrar-selector-clase="mostrarSelectorClase"
        :mode="modeModalApoderado"
        :is-saving="isLoadingApoderado"
        :clase-options="claseOptions"
        @close="handleCloseModalApoderado"
        @submit="handleSubmitApoderado"
      />

      <!-- Modal para Otros Apoderados -->
      <RegistroApoderadoModal
        v-model="isOpenModalOtroApoderado"
        v-model:clase-apoderado-id="selectedClaseIdOtros"
        :mostrar-selector-clase="false"
        :mode="modeModalOtroApoderado"
        :is-saving="isLoadingOtroApoderado"
        :clase-options="claseOptions"
        @close="handleCloseModalOtroApoderado"
        @submit="handleSubmitOtroApoderado"
      />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { useNombramientoApoderadosPage } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/composables/useNombramientoApoderadosPage";
  import { useNombramientoApoderadosStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-apoderados/stores/useNombramientoApoderadosStore";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
  import RegistroApoderadoModal from "~/core/presentation/registros/sociedades/pasos/apoderados/components/modals/RegistroApoderadoModal.vue";
  import { ClasesApoderadoEspecialesEnum } from "~/core/presentation/registros/sociedades/pasos/apoderados/types/enums/ClasesApoderadoEspecialesEnum";
  import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
  import NombramientoApoderadosTable from "./components/NombramientoApoderadosTable.vue";
  import NombramientoOtrosApoderadosTable from "./components/NombramientoOtrosApoderadosTable.vue";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Composable para datos del backend
  const {
    isLoading,
    clasesApoderadosOptions,
    apoderadosNormales,
    otrosApoderados,
    loadData,
    guardarApoderado,
    claseApoderadoSeleccionada,
    tipoPersona,
    personaNatural,
    personaJuridica,
    representanteLegal,
    limpiarFormulario,
  } = useNombramientoApoderadosPage();

  const nombramientoStore = useNombramientoApoderadosStore();
  const snapshotStore = useSnapshotStore();

  // ✅ Usar datos del composable (conectado al backend)
  const apoderados = computed(() => apoderadosNormales.value);
  const otrosApoderadosComputed = computed(() => otrosApoderados.value);
  const claseOptions = computed(() => clasesApoderadosOptions.value);

  // ========== STORE PARA EL FORMULARIO ==========
  const personaNaturalStore = usePersonaNaturalStore();

  // ========== ESTADO DEL MODAL PARA APODERADOS ==========
  const isOpenModalApoderado = ref(false);
  const modeModalApoderado = ref<"crear" | "editar">("crear");
  const isLoadingApoderado = ref(false);
  const selectedClaseId = ref("");
  const mostrarSelectorClase = ref(true);
  const editingApoderadoId = ref<string | null>(null);

  // ========== ESTADO DEL MODAL PARA OTROS APODERADOS ==========
  const isOpenModalOtroApoderado = ref(false);
  const modeModalOtroApoderado = ref<"crear" | "editar">("crear");
  const isLoadingOtroApoderado = ref(false);
  const selectedClaseIdOtros = ref("");
  const editingOtroApoderadoId = ref<string | null>(null);

  // ========== HANDLERS PARA APODERADOS ==========
  const openModalApoderado = () => {
    mostrarSelectorClase.value = true;
    selectedClaseId.value = "";
    editingApoderadoId.value = null;
    modeModalApoderado.value = "crear";
    personaNaturalStore.$reset();
    isOpenModalApoderado.value = true;
  };

  const handleCloseModalApoderado = () => {
    isOpenModalApoderado.value = false;
    modeModalApoderado.value = "crear";
    selectedClaseId.value = "";
    mostrarSelectorClase.value = true;
    editingApoderadoId.value = null;
    personaNaturalStore.$reset();
  };

  const handleSubmitApoderado = async () => {
    if (!selectedClaseId.value) {
      handleCloseModalApoderado();
      return;
    }

    // Usar el composable para guardar
    claseApoderadoSeleccionada.value = selectedClaseId.value;
    isLoadingApoderado.value = true;

    try {
      await guardarApoderado();
      handleCloseModalApoderado();
    } catch (error) {
      console.error("Error al guardar apoderado:", error);
    } finally {
      isLoadingApoderado.value = false;
    }
  };

  // ✅ Determinar si un apoderado es del snapshot (no editable/eliminable)
  const esApoderadoDelSnapshot = (apoderadoId: string): boolean => {
    const snapshot = snapshotStore.snapshot;
    if (!snapshot?.attorneys) return false;

    // Buscar el apoderado en apoderados designados
    const apoderado = nombramientoStore.apoderadosDesignados.find((a) => a.id === apoderadoId);
    if (!apoderado) return false;

    // Verificar si el personaId del apoderado está en el snapshot
    const personaId = apoderado.person.id;
    return snapshot.attorneys.some((att) => att.persona?.id === personaId);
  };

  const handleEditarApoderado = (apoderadoId: string) => {
    // ✅ No permitir editar apoderados del snapshot
    if (esApoderadoDelSnapshot(apoderadoId)) {
      console.log("⚠️ No se puede editar un apoderado del snapshot:", apoderadoId);
      return;
    }

    const apoderado = apoderados.value.find((a) => a.id === apoderadoId);
    if (!apoderado) return;

    // Separar nombre completo en partes
    const partesNombre = apoderado.nombre.split(" ");
    const nombre = partesNombre[0] || "";
    const apellidoPaterno = partesNombre[1] || "";
    const apellidoMaterno = partesNombre.slice(2).join(" ") || "";

    // Cargar datos en el store
    personaNaturalStore.setFormData({
      tipoDocumento: apoderado.tipoDocumento,
      numeroDocumento: apoderado.numeroDocumento,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      paisPasaporte: "",
      estadoCivil: null,
    });

    // Buscar la clase por nombre
    const clase = claseOptions.value.find((c) => c.label === apoderado.claseApoderadoNombre);
    selectedClaseId.value = clase?.id || "";
    mostrarSelectorClase.value = true;
    editingApoderadoId.value = apoderadoId;
    modeModalApoderado.value = "editar";
    isOpenModalApoderado.value = true;
  };

  const handleEliminarApoderado = async (apoderadoId: string) => {
    // ✅ No permitir eliminar apoderados del snapshot
    if (esApoderadoDelSnapshot(apoderadoId)) {
      console.log("⚠️ No se puede eliminar un apoderado del snapshot:", apoderadoId);
      return;
    }

    console.log("Eliminar apoderado:", apoderadoId);

    const route = useRoute();
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    try {
      await nombramientoStore.deleteApoderado(societyId, flowId, apoderadoId);
      console.log("✅ Apoderado eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar apoderado:", error);
      // TODO: Mostrar notificación de error al usuario
    }
  };

  // ✅ Función para determinar si una acción debe estar deshabilitada (apoderados normales)
  const getActionDisabledApoderado = (apoderadoId: string, actionLabel: string): boolean => {
    // Solo deshabilitar editar/eliminar si es del snapshot
    if (actionLabel === "Editar" || actionLabel === "Eliminar") {
      return esApoderadoDelSnapshot(apoderadoId);
    }
    return false;
  };

  const apoderadoActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditarApoderado,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleEliminarApoderado,
    },
  ];

  // ========== HANDLERS PARA OTROS APODERADOS ==========
  const openModalOtroApoderado = () => {
    // Para "Otros Apoderados", la clase está fija
    const claseOtros = claseOptions.value.find(
      (c) => c.label === ClasesApoderadoEspecialesEnum.OTROS_APODERADOS
    );
    selectedClaseIdOtros.value = claseOtros?.id || "";
    editingOtroApoderadoId.value = null;
    modeModalOtroApoderado.value = "crear";
    personaNaturalStore.$reset();
    isOpenModalOtroApoderado.value = true;
  };

  const handleCloseModalOtroApoderado = () => {
    isOpenModalOtroApoderado.value = false;
    modeModalOtroApoderado.value = "crear";
    selectedClaseIdOtros.value = "";
    editingOtroApoderadoId.value = null;
    personaNaturalStore.$reset();
  };

  const handleSubmitOtroApoderado = async () => {
    // Para "Otros Apoderados", usar la clase correspondiente
    const otrosClassId = nombramientoStore.getOtrosApoderadosClassId();
    if (!otrosClassId) {
      console.error("No se encontró la clase 'Otros Apoderados'");
      handleCloseModalOtroApoderado();
      return;
    }

    claseApoderadoSeleccionada.value = otrosClassId;
    isLoadingOtroApoderado.value = true;

    try {
      await guardarApoderado();
      handleCloseModalOtroApoderado();
    } catch (error) {
      console.error("Error al guardar otro apoderado:", error);
    } finally {
      isLoadingOtroApoderado.value = false;
    }
  };

  const handleEliminarOtroApoderado = async (apoderadoId: string) => {
    // ✅ No permitir eliminar apoderados del snapshot
    if (esApoderadoDelSnapshot(apoderadoId)) {
      console.log("⚠️ No se puede eliminar un apoderado del snapshot:", apoderadoId);
      return;
    }

    console.log("Eliminar otro apoderado:", apoderadoId);

    const route = useRoute();
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    try {
      await nombramientoStore.deleteApoderado(societyId, flowId, apoderadoId);
      console.log("✅ Otro apoderado eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar otro apoderado:", error);
      // TODO: Mostrar notificación de error al usuario
    }
  };

  // ✅ Función para determinar si una acción debe estar deshabilitada (otros apoderados)
  const getActionDisabledOtroApoderado = (
    apoderadoId: string,
    actionLabel: string
  ): boolean => {
    // Solo deshabilitar editar/eliminar si es del snapshot
    if (actionLabel === "Editar" || actionLabel === "Eliminar") {
      return esApoderadoDelSnapshot(apoderadoId);
    }
    return false;
  };

  const handleEditarOtroApoderado = (apoderadoId: string) => {
    // ✅ No permitir editar apoderados del snapshot
    if (esApoderadoDelSnapshot(apoderadoId)) {
      console.log("⚠️ No se puede editar un apoderado del snapshot:", apoderadoId);
      return;
    }

    const apoderado = otrosApoderados.value.find((a) => a.id === apoderadoId);
    if (!apoderado) return;

    // Separar nombre completo en partes
    const partesNombre = apoderado.nombre.split(" ");
    const nombre = partesNombre[0] || "";
    const apellidoPaterno = partesNombre[1] || "";
    const apellidoMaterno = partesNombre.slice(2).join(" ") || "";

    // Cargar datos en el store
    personaNaturalStore.setFormData({
      tipoDocumento: apoderado.tipoDocumento,
      numeroDocumento: apoderado.numeroDocumento,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      paisPasaporte: "",
      estadoCivil: null,
    });

    // Para "Otros Apoderados", la clase está fija
    const claseOtros = claseOptions.value.find(
      (c) => c.label === ClasesApoderadoEspecialesEnum.OTROS_APODERADOS
    );
    selectedClaseIdOtros.value = claseOtros?.id || "";
    editingOtroApoderadoId.value = apoderadoId;
    modeModalOtroApoderado.value = "editar";
    isOpenModalOtroApoderado.value = true;
  };

  const otroApoderadoActions = [
    {
      label: "Editar",
      icon: "SquarePen",
      onClick: handleEditarOtroApoderado,
    },
    {
      label: "Eliminar",
      icon: "Trash2",
      onClick: handleEliminarOtroApoderado,
    },
  ];

  // ========== BOTÓN SIGUIENTE ==========
  // Solo direcciona, no hace nada
  useJuntasFlowNext(async () => {
    // No hacer nada, solo permite navegar
  });

  // ========== CARGA INICIAL ==========
  onMounted(() => {
    loadData();
  });
</script>
