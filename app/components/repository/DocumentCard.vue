<script setup lang="ts">
import { FileText, MoreVertical, Download, Eye, Trash2 } from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  id: string;
  name: string;
  type: string;
  size?: number;
  dateModified: Date;
  owner?: string;
}

interface Props {
  document: Document;
  showActions?: boolean;
}

withDefaults(defineProps<Props>(), {
  showActions: true,
});

const emits = defineEmits<{
  (e: "click" | "preview" | "download" | "delete"): void;
}>();

const formatDate = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
  if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;
  return `Hace ${Math.floor(days / 365)} años`;
};

const formatSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
</script>

<template>
  <div
    class="bg-white rounded-xl p-4 border hover:shadow-md transition-all cursor-pointer group"
    :style="{ borderColor: 'var(--border-light)' }"
    @click="emits('click')"
  >
    <div class="flex items-start justify-between gap-3">
      <!-- Icono y Info -->
      <div class="flex items-start gap-3 flex-1 min-w-0">
        <div
          class="p-2 rounded-lg flex-shrink-0"
          style="background-color: var(--bg-icon-primary)"
        >
          <FileText
            class="w-5 h-5"
            :style="{ color: 'var(--primary-700)' }"
          />
        </div>

        <div class="flex-1 min-w-0">
          <h4
            class="text-sm font-medium truncate mb-1"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            {{ document.name }}
          </h4>
          <div class="flex items-center gap-2 text-xs">
            <p :style="{ color: 'var(--text-muted)' }">
              {{ formatDate(document.dateModified) }}
            </p>
            <template v-if="formatSize(document.size)">
              <span :style="{ color: 'var(--text-muted)' }">•</span>
              <p :style="{ color: 'var(--text-muted)' }">
                {{ formatSize(document.size) }}
              </p>
            </template>
          </div>
        </div>
      </div>

      <!-- Actions Menu -->
      <div
        v-if="showActions"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
        @click.stop
      >
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button
              class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              @click.stop
            >
              <MoreVertical
                class="w-4 h-4"
                :style="{ color: 'var(--text-muted)' }"
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click.stop="emits('preview')">
              <Eye class="w-4 h-4 mr-2" />
              Vista previa
            </DropdownMenuItem>
            <DropdownMenuItem @click.stop="emits('download')">
              <Download class="w-4 h-4 mr-2" />
              Descargar
            </DropdownMenuItem>
            <DropdownMenuItem
              class="text-red-600"
              @click.stop="emits('delete')"
            >
              <Trash2 class="w-4 h-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>

