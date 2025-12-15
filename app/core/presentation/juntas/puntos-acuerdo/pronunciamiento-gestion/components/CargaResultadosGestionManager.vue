<script setup lang="ts">
  import { computed, ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import FileUploadMultipleWithMetadata from "~/components/base/inputs/FileUploadMultipleWithMetadata.vue";
  import BaseInput from "~/components/base/inputs/text/BaseInput.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import { usePronunciamientoStore } from "~/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/stores/usePronunciamientoStore";
  import { usePronunciamientoController } from "~/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/composables/usePronunciamientoController";
  import type { FileMetadata } from "~/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/stores/usePronunciamientoStore";

  const route = useRoute();
  const pronunciamientoStore = usePronunciamientoStore();
  const { cargarDatos, guardarDatos, isLoading, error } = usePronunciamientoController();

  // Cargar datos al montar el componente
  onMounted(() => {
    cargarDatos();
  });

  // Obtener societyId de la ruta
  const societyId = computed(() => {
    const param = route.params.societyId;
    if (typeof param === "string") return param;
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return param[0];
    }
    return "";
  });

  // Estado del modal
  const isModalOpen = ref(false);
  const nombreEstadoFinanciero = ref("");

  // Función para abrir el modal
  const agregarEstadoFinanciero = () => {
    isModalOpen.value = true;
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    isModalOpen.value = false;
    nombreEstadoFinanciero.value = "";
  };

  // Función para crear el nuevo estado financiero
  const crearEstadoFinanciero = () => {
    if (!nombreEstadoFinanciero.value.trim()) {
      return;
    }

    pronunciamientoStore.addEstadoFinanciero(nombreEstadoFinanciero.value);
    cerrarModal();
  };

  // Handlers para archivos de memoria anual
  const handleMemoriaAnualFileUploaded = (metadata: FileMetadata) => {
    pronunciamientoStore.addArchivoMemoriaAnual(metadata);
  };

  const handleMemoriaAnualFileRemoved = (fileId: string) => {
    pronunciamientoStore.removeArchivoMemoriaAnual(fileId);
  };

  // Handlers para archivos de estados financieros
  // Usar funciones inline directamente en el template
  const handleEstadoFinancieroFileUploaded = (estadoId: number | string, metadata: FileMetadata) => {
    console.log("📤 [CargaResultados] Archivo subido para estado:", estadoId, metadata);
    console.log("📤 [CargaResultados] Estado ANTES de agregar:", {
      estadoId,
      archivosAntes: pronunciamientoStore.estadosFinancieros.find((e) => e.id === estadoId)?.archivos.length || 0,
    });
    pronunciamientoStore.addArchivoEstadoFinanciero(estadoId, metadata);
    console.log("📤 [CargaResultados] Estado DESPUÉS de agregar:", {
      estadoId,
      archivosDespues: pronunciamientoStore.estadosFinancieros.find((e) => e.id === estadoId)?.archivos.length || 0,
      archivos: pronunciamientoStore.estadosFinancieros.find((e) => e.id === estadoId)?.archivos,
    });
  };

  const handleEstadoFinancieroFileRemoved = (estadoId: number | string, fileId: string) => {
    console.log("🗑️ [CargaResultados] Archivo eliminado para estado:", estadoId, fileId);
    pronunciamientoStore.removeArchivoEstadoFinanciero(estadoId, fileId);
  };
</script>

<template>
  <div class="flex flex-col gap-10">
    <!-- Memoria Anual -->
    <div class="flex flex-col gap-4">
      <p class="t-h5 text-gray-800 font-primary">Memoria Anual</p>
      <SimpleCardDropDown variant="sm">
        <template #title>
          <div class="flex justify-between gap-2 items-center">
            <span
              :class="[
                't-t1 text-gray-600 font-medium font-secondary',
                pronunciamientoStore.memoriaAnual.enabled ? 'text-gray-800 font-semibold' : 'text-gray-500',
              ]"
            >
              Suba los documentos que acredite la memoria anual
            </span>
            <SimpleSwitchYesNo
              :model-value="pronunciamientoStore.memoriaAnual.enabled"
              @update:model-value="pronunciamientoStore.toggleMemoriaAnual()"
            />
          </div>
        </template>
        <template v-if="pronunciamientoStore.memoriaAnual.enabled" #content>
          <FileUploadMultipleWithMetadata
            v-if="societyId"
            :society-id="societyId"
            :files-metadata="pronunciamientoStore.memoriaAnual.archivos"
            click-message="Haz click o arrastra tus documentos"
            :max-files="10"
            :max-size-m-b="5"
            format-description=".pdf, .docx, .xlsx, max 5mb"
            custom-icon="heroicons:arrow-up-tray"
            @file-uploaded="handleMemoriaAnualFileUploaded"
            @file-removed="handleMemoriaAnualFileRemoved"
          />
          <p v-else class="text-sm text-gray-500 p-4">
            Se requiere societyId para subir archivos
          </p>
        </template>
      </SimpleCardDropDown>
    </div>

    <!-- Estados Financieros -->
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <p class="t-h5 text-gray-800 font-primary">Estados Financieros</p>
        <ActionButton
          label="Agregar otro estado financiero"
          variant="secondary"
          icon="Plus"
          icon-position="left"
          class="py-[16px] px-[24px]"
          @click="agregarEstadoFinanciero"
        />
      </div>

      <SimpleCard>
        <div class="flex flex-col gap-6">
          <div
            v-for="estado in pronunciamientoStore.estadosFinancieros"
            :key="estado.id"
            class="flex flex-col gap-4"
          >
            <div class="flex items-center justify-between">
              <p class="t-h6 text-gray-800 font-secondary font-bold">{{ estado.nombre }}</p>
              <ActionButton
                v-if="!estado.isDefault"
                variant="ghost"
                icon="Trash2"
                icon-position="left"
                size="sm"
                class="text-red-600 hover:text-red-700"
                @click="pronunciamientoStore.deleteEstadoFinanciero(estado.id)"
              >
                Eliminar
              </ActionButton>
            </div>
            <SimpleCardDropDown variant="sm">
              <template #title>
                <div class="flex justify-between gap-2 items-center">
                  <span
                    :class="[
                      't-t1 text-gray-600 font-medium font-secondary',
                      estado.enabled ? 'text-gray-800 font-semibold' : 'text-gray-500',
                    ]"
                  >
                    Suba los documentos que acredite el {{ estado.nombre.toLowerCase() }}
                    <span v-if="estado.enabled && estado.archivos.length > 0" class="ml-2 text-primary-600">
                      ({{ estado.archivos.length }} archivo{{ estado.archivos.length !== 1 ? 's' : '' }})
                    </span>
                  </span>
                  <SimpleSwitchYesNo
                    :model-value="estado.enabled"
                    @update:model-value="pronunciamientoStore.toggleEstadoFinanciero(estado.id)"
                  />
                </div>
              </template>
              <template v-if="estado.enabled" #content>
                <FileUploadMultipleWithMetadata
                  v-if="societyId"
                  :key="`estado-${estado.id}-${estado.archivos.length}`"
                  :society-id="societyId"
                  :files-metadata="estado.archivos"
                  click-message="Haz click o arrastra tus documentos"
                  :max-files="10"
                  :max-size-m-b="5"
                  format-description=".pdf, .docx, .xlsx, max 5mb"
                  custom-icon="heroicons:arrow-up-tray"
                  @file-uploaded="(metadata) => handleEstadoFinancieroFileUploaded(estado.id, metadata)"
                  @file-removed="(fileId) => handleEstadoFinancieroFileRemoved(estado.id, fileId)"
                />
                <p v-else class="text-sm text-gray-500 p-4">
                  Se requiere societyId para subir archivos
                </p>
              </template>
            </SimpleCardDropDown>
          </div>
        </div>
      </SimpleCard>
    </div>

    <!-- Modal para agregar estado financiero -->
    <BaseModal
      v-model="isModalOpen"
      size="xs"
      @close="cerrarModal"
      @submit="crearEstadoFinanciero"
    >
      <div class="flex flex-col gap-6">
        <CardTitle
          title="Agregar Estado Financiero"
          body="Ingresa el nombre del estado financiero."
        />

        <div class="flex flex-col gap-2">
          <p class="t-t2 text-gray-800 font-secondary">Estado Financiero</p>
          <BaseInput
            id="estado-financiero-input"
            v-model="nombreEstadoFinanciero"
            placeholder="Estado de Flujo Efectivo"
            size="md"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-center gap-3 w-full">
          <ActionButton
            variant="primary_outline"
            label="Cancelar"
            size="md"
            @click="cerrarModal"
          />
          <ActionButton
            type="submit"
            variant="primary"
            label="Crear"
            size="md"
            :is-disabled="!nombreEstadoFinanciero.trim()"
          />
        </div>
      </template>
    </BaseModal>
  </div>
</template>
