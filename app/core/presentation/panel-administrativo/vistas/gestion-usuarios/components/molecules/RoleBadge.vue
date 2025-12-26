<script setup lang="ts">
import { computed } from "vue";
import type { RoleName } from "~/core/hexag/panel-administrativo/domain/entities/role.entity";
import { getRoleBadgeColor } from "~/data/mockDataAdmin";

interface Props {
  roleName: RoleName;
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
});

const roleColor = computed(() => getRoleBadgeColor(props.roleName));

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-2 text-sm",
};
</script>

<template>
  <span
    class="rounded-full font-medium"
    :class="sizeClasses[size]"
    :style="{
      backgroundColor: roleColor.bg,
      color: roleColor.text,
      fontFamily: 'var(--font-secondary)',
      fontWeight: 500,
    }"
  >
    {{ roleName }}
  </span>
</template>

