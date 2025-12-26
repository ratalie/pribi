<script setup lang="ts">
import type { User } from "~/core/hexag/panel-administrativo/domain/entities/user.entity";
import type { UsersCardsProps } from "../../types/user-management.types";
import UserCard from "../molecules/UserCard.vue";

const props = defineProps<UsersCardsProps>();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <UserCard
      v-for="user in props.users"
      :key="user.id"
      :user="user"
      :can-delete="props.canDeleteUser(user)"
      :on-edit-permissions="props.onEditPermissions"
      :on-delete="props.onDelete"
    />

    <!-- Estado vacío -->
    <div
      v-if="props.users.length === 0"
      class="col-span-full flex flex-col items-center justify-center py-12"
    >
      <p
        class="text-lg mb-2"
        :style="{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-primary)',
          fontWeight: 600,
        }"
      >
        No se encontraron usuarios
      </p>
      <p
        class="text-sm"
        :style="{
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-secondary)',
        }"
      >
        No hay usuarios en el sistema
      </p>
    </div>
  </div>
</template>




