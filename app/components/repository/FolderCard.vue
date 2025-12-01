<script setup lang="ts">
  import { ArrowRight, FolderOpen } from "lucide-vue-next";

  interface Folder {
    id: string;
    name: string;
    description?: string;
    documentCount?: number;
    userCount?: number;
    lastActivity?: Date;
  }

  interface Props {
    folder: Folder;
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "click"): void;
  }>();

  const formatDate = (date?: Date) => {
    if (!date) return "Nunca";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    return `Hace ${Math.floor(days / 30)} meses`;
  };
</script>

<template>
  <div
    class="bg-white rounded-xl p-6 border hover:shadow-lg transition-all cursor-pointer group"
    :style="{ borderColor: 'var(--border-light)' }"
    @click="$emit('click')"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div
          class="p-3 rounded-lg flex-shrink-0"
          style="background-color: var(--bg-icon-purple)"
        >
          <FolderOpen class="w-7 h-7" style="color: #a855f7" />
        </div>

        <div class="flex-1 min-w-0">
          <h3
            class="text-xl mb-1 truncate"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
            }"
          >
            {{ folder.name }}
          </h3>
          <p
            v-if="folder.description"
            class="text-sm truncate"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            {{ folder.description }}
          </p>
        </div>
      </div>

      <ArrowRight
        class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        style="color: #a855f7"
      />
    </div>

    <!-- Métricas -->
    <div class="grid grid-cols-3 gap-4">
      <div class="p-3 rounded-lg" style="background-color: var(--bg-muted)">
        <p
          class="text-xs mb-1"
          :style="{
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)',
          }"
        >
          Documentos
        </p>
        <p
          class="text-2xl"
          :style="{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
          }"
        >
          {{ folder.documentCount ?? 0 }}
        </p>
      </div>

      <div class="p-3 rounded-lg" style="background-color: var(--bg-muted)">
        <p
          class="text-xs mb-1"
          :style="{
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)',
          }"
        >
          Usuarios
        </p>
        <p
          class="text-2xl"
          :style="{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
          }"
        >
          {{ folder.userCount ?? 0 }}
        </p>
      </div>

      <div class="p-3 rounded-lg" style="background-color: var(--bg-muted)">
        <p
          class="text-xs mb-1"
          :style="{
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)',
          }"
        >
          Última actividad
        </p>
        <p
          class="text-sm mt-2"
          :style="{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-secondary)',
            fontWeight: 500,
          }"
        >
          {{ formatDate(folder.lastActivity) }}
        </p>
      </div>
    </div>
  </div>
</template>
