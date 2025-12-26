<script setup lang="ts">
import { computed } from "vue";
import { Shield } from "lucide-vue-next";
import { getRoleBadgeColor } from "~/data/mockDataAdmin";
import type { RoleStatsCardProps } from "../../types/user-management.types";

const props = defineProps<RoleStatsCardProps>();

const roleColor = computed(() => getRoleBadgeColor(props.role.name));
</script>

<template>
  <button
    class="p-6 rounded-xl border-2 transition-all text-left"
    :class="props.isSelected ? 'ring-4' : ''"
    :style="{
      borderColor: roleColor.border,
      backgroundColor: props.isSelected ? roleColor.lightBg : 'white',
    }"
    @click="onClick"
  >
    <!-- Icono circular con color del rol -->
    <div
      class="w-12 h-12 rounded-full flex items-center justify-center mb-3"
      :style="{ backgroundColor: roleColor.bg }"
    >
      <Shield class="w-6 h-6" :style="{ color: roleColor.text }" />
    </div>

    <!-- Nombre del rol -->
    <h3
      class="text-lg mb-2"
      :style="{
        color: roleColor.text,
        fontFamily: 'var(--font-primary)',
        fontWeight: 600,
      }"
    >
      {{ role.name }}
    </h3>

    <!-- Contador de usuarios -->
    <p
      class="text-3xl mb-1"
      :style="{
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-primary)',
        fontWeight: 700,
      }"
    >
      {{ count }}
    </p>
    <p
      class="text-sm"
      :style="{
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-secondary)',
      }"
    >
      {{ count === 1 ? "usuario" : "usuarios" }}
    </p>
  </button>
</template>

