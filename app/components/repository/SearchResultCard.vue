<script setup lang="ts">
import { FileText, Folder, Calendar, HardDrive, MapPin } from "lucide-vue-next";
import type { SearchResult } from "~/core/presentation/repositorio/composables/useBusquedaDocumentos";

interface Props {
  result: SearchResult;
  searchQuery?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [];
  preview: [];
  download: [];
}>();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatProximity = (proximity?: number) => {
  if (proximity === undefined || proximity === null) return null;
  // proximity es un valor entre 0 y 1, donde 1 es más similar
  const percentage = Math.round(proximity * 100);
  return `${percentage}%`;
};

const getFileTypeIcon = () => {
  if (props.result.node?.type === 1) return Folder;
  return FileText;
};

const getFileTypeColor = () => {
  const mimeType = props.result.node?.name?.toLowerCase() || "";
  if (mimeType.includes("pdf")) return "text-red-600";
  if (mimeType.includes("word") || mimeType.includes("doc")) return "text-blue-600";
  if (mimeType.includes("excel") || mimeType.includes("xls")) return "text-green-600";
  if (mimeType.includes("powerpoint") || mimeType.includes("ppt")) return "text-orange-600";
  return "text-gray-600";
};
</script>

<template>
  <div
    class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    @click="emit('click')"
  >
    <div class="p-4">
      <!-- Header con icono y título -->
      <div class="flex items-start gap-3 mb-3">
        <div
          class="p-2 rounded-lg flex-shrink-0"
          :class="{
            'bg-blue-100': result.node?.type === 0,
            'bg-yellow-100': result.node?.type === 1,
          }"
        >
          <component
            :is="getFileTypeIcon()"
            class="w-5 h-5"
            :class="{
              'text-blue-600': result.node?.type === 0,
              'text-yellow-600': result.node?.type === 1,
            }"
          />
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
            {{ result.title }}
          </h3>
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <MapPin class="w-3 h-3" />
            <span class="truncate">{{ result.node?.path || "Sin ruta" }}</span>
          </div>
        </div>

        <!-- Badge de proximidad (solo para búsqueda semántica) -->
        <div
          v-if="result.proximity !== undefined && result.proximity !== null"
          class="flex-shrink-0 bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded"
        >
          {{ formatProximity(result.proximity) }}
        </div>
      </div>

      <!-- Metadata -->
      <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
        <div class="flex items-center gap-1">
          <Calendar class="w-3 h-3" />
          <span>{{ formatDate(result.createdAt) }}</span>
        </div>
        <div class="flex items-center gap-1">
          <HardDrive class="w-3 h-3" />
          <span>{{ formatFileSize(result.sizeInBytes) }}</span>
        </div>
      </div>

      <!-- Acciones (aparecen en hover) -->
      <div
        class="mt-3 pt-3 border-t border-gray-100 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        @click.stop
      >
        <button
          class="flex-1 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          @click="emit('preview')"
        >
          Vista previa
        </button>
        <button
          v-if="result.node?.type === 0"
          class="flex-1 text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors"
          @click="emit('download')"
        >
          Descargar
        </button>
      </div>
    </div>
  </div>
</template>




