<script setup lang="ts">
import { computed } from "vue";
import type { RoleName } from "~/core/hexag/panel-administrativo/domain/entities/role.entity";
import { getRoleBadgeColor } from "~/data/mockDataAdmin";

interface Props {
  email: string;
  roleName: RoleName;
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const roleColor = computed(() => getRoleBadgeColor(props.roleName));
const initial = computed(() => props.email.charAt(0).toUpperCase());

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-2xl",
};
</script>

<template>
  <div
    class="rounded-full flex items-center justify-center"
    :class="sizeClasses[size]"
    :style="{
      backgroundColor: roleColor.bg,
    }"
  >
    <span
      :style="{
        color: roleColor.text,
        fontFamily: 'var(--font-primary)',
        fontWeight: 600,
      }"
    >
      {{ initial }}
    </span>
  </div>
</template>

