<script setup lang="ts">
import { Settings, Trash2 } from "lucide-vue-next";
import type { User } from "~/core/hexag/panel-administrativo/domain/entities/user.entity";

interface Props {
  user: User;
  canDelete: boolean;
  onEditPermissions: (user: User) => void;
  onDelete: (user: User) => void;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="flex items-center justify-end gap-2">
    <button
      class="p-2 hover:bg-gray-100 rounded transition-colors"
      title="Editar permisos"
      @click="props.onEditPermissions(props.user)"
    >
      <Settings class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" />
    </button>
    <button
      class="p-2 rounded transition-colors"
      :class="canDelete ? 'hover:bg-red-50' : 'opacity-50 cursor-not-allowed'"
      :title="canDelete ? 'Eliminar usuario' : 'No puedes eliminar este usuario'"
      :disabled="!canDelete"
      @click="canDelete && props.onDelete(props.user)"
    >
      <Trash2
        class="w-4 h-4"
        :style="{ color: canDelete ? '#EF4444' : '#9CA3AF' }"
      />
    </button>
  </div>
</template>




