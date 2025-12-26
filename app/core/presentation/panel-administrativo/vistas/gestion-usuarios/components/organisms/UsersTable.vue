<script setup lang="ts">
import { CheckCircle, XCircle } from "lucide-vue-next";
import type { User } from "~/core/hexag/panel-administrativo/domain/entities/user.entity";
import type { UsersTableProps } from "../../types/user-management.types";
import UserAvatar from "../molecules/UserAvatar.vue";
import RoleBadge from "../molecules/RoleBadge.vue";
import UserActions from "../molecules/UserActions.vue";

const props = defineProps<UsersTableProps>();
</script>

<template>
  <div
    class="bg-white rounded-xl border overflow-hidden"
    :style="{ borderColor: 'var(--border-light)' }"
  >
    <table class="w-full">
      <thead style="background-color: #f9fafb">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs uppercase"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 600,
            }"
          >
            Usuario
          </th>
          <th
            class="px-6 py-3 text-left text-xs uppercase"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 600,
            }"
          >
            Rol
          </th>
          <th
            class="px-6 py-3 text-left text-xs uppercase"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 600,
            }"
          >
            Estudio
          </th>
          <th
            class="px-6 py-3 text-left text-xs uppercase"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 600,
            }"
          >
            Estado
          </th>
          <th
            class="px-6 py-3 text-left text-xs uppercase"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 600,
            }"
          >
            Fecha
          </th>
          <th
            class="px-6 py-3 text-right text-xs uppercase"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 600,
            }"
          >
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in props.users"
          :key="user.id"
          class="border-t hover:bg-gray-50 transition-colors"
          :style="{ borderColor: 'var(--border-light)' }"
        >
          <!-- Email con avatar -->
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <UserAvatar :email="user.email" :role-name="user.role.name" />
              <span
                class="text-sm"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-secondary)',
                  fontWeight: 500,
                }"
              >
                {{ user.email }}
              </span>
            </div>
          </td>

          <!-- Badge de Rol -->
          <td class="px-6 py-4">
            <RoleBadge :role-name="user.role.name" />
          </td>

          <!-- Estudio -->
          <td
            class="px-6 py-4 text-sm"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            {{ user.study.name }}
          </td>

          <!-- Estado (activo/inactivo) -->
          <td class="px-6 py-4">
            <button
              @click="props.onToggleStatus(user)"
              class="flex items-center gap-1 transition-colors hover:opacity-80"
              :class="user.status ? 'text-green-600' : 'text-red-600'"
            >
              <CheckCircle v-if="user.status" class="w-4 h-4" />
              <XCircle v-else class="w-4 h-4" />
              <span class="text-sm" :style="{ fontFamily: 'var(--font-secondary)' }">
                {{ user.status ? "Activo" : "Inactivo" }}
              </span>
            </button>
          </td>

          <!-- Fecha de creación -->
          <td
            class="px-6 py-4 text-sm"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            {{ user.createdAt.toLocaleDateString("es-ES") }}
          </td>

          <!-- Acciones -->
          <td class="px-6 py-4">
            <UserActions
              :user="user"
              :can-delete="props.canDeleteUser(user)"
              :on-edit-permissions="props.onEditPermissions"
              :on-delete="props.onDelete"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Estado vacío -->
    <div
      v-if="props.users.length === 0"
      class="flex flex-col items-center justify-center py-12"
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




