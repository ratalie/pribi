<script setup lang="ts">
import { mockRoles } from "~/data/mockDataAdmin";
import type { RoleName } from "~/core/hexag/panel-administrativo/domain/entities/role.entity";
import RoleStatsCard from "../molecules/RoleStatsCard.vue";

interface Props {
  selectedRole: RoleName | "all";
  userCountByRole: Record<string, number>;
  onRoleSelect: (role: RoleName | "all") => void;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <RoleStatsCard
      v-for="role in mockRoles"
      :key="role.id"
      :role="role"
      :count="props.userCountByRole[role.name] || 0"
      :is-selected="props.selectedRole === role.name"
      :on-click="() => props.onRoleSelect(props.selectedRole === role.name ? 'all' : (role.name as RoleName))"
    />
  </div>
</template>

