<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { Loader2, AlertCircle, FileText } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import CardDocumentVersion from "./CardDocumentVersion.vue";
import { useVersionesDocumento, type DocumentVersion } from "~/core/presentation/repositorio/composables/useVersionesDocumento";

interface Props {
  nodeId: number;
  documentCode?: string;
  selectedVersionCode?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  versionSelected: [versionCode: string, isCurrentVersion: boolean];
  versionRestored: [];
}>();

const {
  versions,
  sortedVersions,
  isLoading,
  error,
  cargarVersionesDesdeNodo,
  restaurarVersion,
} = useVersionesDocumento();

const selectedVersionCode = ref<string>(props.selectedVersionCode || "");

// Cargar versiones al montar o cuando cambie el nodeId
onMounted(() => {
  if (props.nodeId) {
    cargarVersionesDesdeNodo(props.nodeId);
  }
});

watch(
  () => props.nodeId,
  (newNodeId) => {
    if (newNodeId) {
      cargarVersionesDesdeNodo(newNodeId);
    }
  }
);

// Sincronizar versión seleccionada con props
watch(
  () => props.selectedVersionCode,
  (newValue) => {
    selectedVersionCode.value = newValue || "";
  },
  { immediate: true }
);

// Determinar si una versión está seleccionada
const isVersionSelected = (version: DocumentVersion) => {
  if (selectedVersionCode.value) {
    return version.id === selectedVersionCode.value;
  }
  // Si no hay versión seleccionada, la versión actual debe estar seleccionada por defecto
  return version.isCurrentVersion;
};

// Manejar selección de versión
const handleSelectVersion = (versionCode: string) => {
  selectedVersionCode.value = versionCode;
  const version = versions.value.find((v) => v.id === versionCode);
  if (version) {
    emit("versionSelected", versionCode, version.isCurrentVersion);
  }
};

// Manejar restauración de versión
const handleRestoreVersion = async (versionCode: string) => {
  if (!props.documentCode) {
    console.error("❌ [HistoryTab] No se puede restaurar: falta documentCode");
    return;
  }

  try {
    await restaurarVersion(props.documentCode, versionCode);
    
    // Recargar versiones después de restaurar
    await cargarVersionesDesdeNodo(props.nodeId);
    
    // Emitir evento para que el componente padre sepa que se restauró
    emit("versionRestored");
    
    // Seleccionar la nueva versión actual
    const currentVersion = versions.value.find((v) => v.isCurrentVersion);
    if (currentVersion) {
      selectedVersionCode.value = currentVersion.id;
      emit("versionSelected", currentVersion.id, true);
    }
  } catch (err: any) {
    console.error("❌ [HistoryTab] Error al restaurar versión:", err);
    // TODO: Mostrar toast de error cuando tengamos el sistema de toasts
  }
};
</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center gap-3 text-gray-500">
        <Loader2 class="w-6 h-6 animate-spin" />
        <span class="text-sm">Cargando historial de versiones...</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex items-center justify-center py-12">
      <div class="text-center text-gray-500 max-w-md">
        <AlertCircle class="mx-auto mb-3 w-8 h-8 text-red-500" />
        <p class="text-sm mb-3">{{ error }}</p>
        <Button
          variant="outline"
          size="sm"
          @click="cargarVersionesDesdeNodo(nodeId)"
        >
          Reintentar
        </Button>
      </div>
    </div>

    <!-- Versions list -->
    <div v-else-if="sortedVersions.length > 0" class="flex flex-col gap-3 overflow-y-auto">
      <CardDocumentVersion
        v-for="version in sortedVersions"
        :key="version.id"
        :version="version"
        :is-selected="isVersionSelected(version)"
        :can-restore="!!documentCode"
        @select="handleSelectVersion"
        @restore="handleRestoreVersion"
      />
    </div>

    <!-- Estado vacío cuando no hay versiones -->
    <div v-else class="flex items-center justify-center py-12">
      <div class="text-center text-gray-500">
        <FileText class="mx-auto mb-3 w-8 h-8 text-gray-400" />
        <p class="text-sm">No hay versiones disponibles</p>
      </div>
    </div>
  </div>
</template>

