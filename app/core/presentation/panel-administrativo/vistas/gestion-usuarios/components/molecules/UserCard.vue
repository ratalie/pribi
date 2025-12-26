<script setup lang="ts">
import { Settings, Trash2 } from "lucide-vue-next";
import type { User } from "~/core/hexag/panel-administrativo/domain/entities/user.entity";
import UserAvatar from "./UserAvatar.vue";
import RoleBadge from "./RoleBadge.vue";

interface Props {
  user: User;
  canDelete: boolean;
  onEditPermissions: (user: User) => void;
  onDelete: (user: User) => void;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    class="bg-white rounded-xl border p-6 hover:shadow-lg transition-all"
    :style="{ borderColor: 'var(--border-light)' }"
  >
    <!-- Avatar grande -->
    <div class="mb-4 mx-auto">
      <UserAvatar :email="props.user.email" :role-name="props.user.role.name" size="lg" />
    </div>

    <!-- Email -->
    <p
      class="text-center text-sm mb-2"
      :style="{
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-secondary)',
        fontWeight: 500,
      }"
    >
      {{ props.user.email }}
    </p>

    <!-- Badge de rol centrado -->
    <div class="flex justify-center mb-3">
      <RoleBadge :role-name="props.user.role.name" />
    </div>

    <!-- Info adicional -->
    <div
      class="text-xs text-center mb-4"
      :style="{
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-secondary)',
      }"
    >
      <p>{{ props.user.study.name }}</p>
      <p>Creado: {{ props.user.createdAt.toLocaleDateString("es-ES") }}</p>
    </div>

    <!-- Acciones -->
    <div class="flex gap-2">
      <button
        class="flex-1 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
        :style="{
          borderColor: 'var(--border-light)',
          fontFamily: 'var(--font-secondary)',
        }"
        @click="props.onEditPermissions(props.user)"
      >
        <Settings class="w-4 h-4 mx-auto" :style="{ color: 'var(--text-muted)' }" />
      </button>
      <button
        class="flex-1 py-2 rounded-lg border hover:bg-red-50 transition-colors"
        :style="{
          borderColor: 'var(--border-light)',
          fontFamily: 'var(--font-secondary)',
        }"
        :disabled="!props.canDelete"
        @click="props.canDelete && props.onDelete(props.user)"
      >
        <Trash2 class="w-4 h-4 mx-auto" style="color: #ef4444" />
      </button>
    </div>
  </div>
</template>

