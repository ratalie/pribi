<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, FileText, User, HardDrive, Monitor, Globe } from "lucide-vue-next";

interface Props {
  documentName: string;
  uploadDate: Date;
  fileSize?: number;
  uploadedBy?: string;
  canEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: true,
});

const emit = defineEmits<{
  updateName: [name: string];
}>();

const localName = ref(props.documentName);

// Sincronizar cuando cambie el prop
watch(
  () => props.documentName,
  (newName) => {
    localName.value = newName;
  }
);

const hasChanges = computed(() => {
  return localName.value !== props.documentName;
});

const handleNameChange = (newName: string) => {
  localName.value = newName;
  // NO hacer fetch automático, solo emitir el evento
  // El padre decidirá cuándo guardar
  emit("updateName", newName);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return "N/A";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Exponer hasChanges para el componente padre
defineExpose({
  hasChanges,
});
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Metadata Section -->
    <div>
      <h3 class="text-xl font-bold mb-6 text-gray-900">Metadata</h3>
      <div class="flex flex-col gap-4">
        <div class="space-y-2">
          <Label for="document-name" class="text-base font-semibold text-gray-800">
            Nombre del documento
          </Label>
          <Input
            id="document-name"
            v-model="localName"
            :disabled="!canEdit"
            placeholder="Nombre del documento"
            class="w-full"
            @update:model-value="handleNameChange"
          />
        </div>
      </div>
    </div>

    <!-- Upload Info Section -->
    <div class="pt-6 border-t border-gray-200">
      <h3 class="text-xl font-bold mb-6 text-gray-900">Datos de carga</h3>
      <div class="grid grid-cols-2 gap-4">
        <!-- Columna de títulos -->
        <div class="flex flex-col gap-4 text-sm font-semibold text-gray-700">
          <div class="flex items-center gap-2">
            <Calendar class="w-4 h-4" />
            <span>Fecha de carga</span>
          </div>
          <div class="flex items-center gap-2">
            <HardDrive class="w-4 h-4" />
            <span>Tamaño del archivo</span>
          </div>
          <div class="flex items-center gap-2">
            <User class="w-4 h-4" />
            <span>Subido por</span>
          </div>
        </div>

        <!-- Columna de valores -->
        <div class="flex flex-col gap-4 text-sm font-medium text-gray-600">
          <span>{{ formatDate(uploadDate) }}</span>
          <span>{{ formatFileSize(fileSize) }}</span>
          <span>{{ uploadedBy || "Usuario" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


