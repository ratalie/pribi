<script setup lang="ts">
import {
  Shield,
  Search,
  Settings,
  Trash2,
  Grid3x3,
  List,
  UserPlus,
  CheckCircle,
  XCircle,
} from 'lucide-vue-next';
import { useUserManagement } from '~/core/presentation/panel-administrativo/composables/useUserManagement';
import { mockRoles, getRoleBadgeColor } from '~/data/mockDataAdmin';
import type { RoleName } from '~/core/hexag/panel-administrativo/domain/entities/role.entity';
import PermissionsEditor from './PermissionsEditor.vue';
import UserAssignmentModal from './UserAssignmentModal.vue';

const {
  store,
  filteredUsers,
  userCountByRole,
  selectedRole,
  searchQuery,
  viewMode,
  showPermissionsEditor,
  showAssignmentModal,
  openPermissionsEditor,
  closePermissionsEditor,
  isLoading,
} = useUserManagement();
</script>

<template>
  <div
    class="h-full overflow-y-auto"
    style="background-color: var(--bg-muted)"
  >
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Header -->
      <div class="mb-6">
        <h1
          class="text-3xl mb-2"
          :style="{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
          }"
        >
          Gestión de Usuarios
        </h1>
        <p
          class="text-sm"
          :style="{
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)',
          }"
        >
          Administra usuarios, roles y permisos granulares del sistema
        </p>
      </div>

      <!-- Estadísticas por Rol (Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <button
          v-for="role in mockRoles"
          :key="role.id"
          class="p-6 rounded-xl border-2 transition-all text-left"
          :class="selectedRole === role.name ? 'ring-4' : ''"
          :style="{
            borderColor: getRoleBadgeColor(role.name).border,
            backgroundColor:
              selectedRole === role.name
                ? getRoleBadgeColor(role.name).lightBg
                : 'white',
          }"
          @click="selectedRole = selectedRole === role.name ? 'all' : (role.name as RoleName)"
        >
          <!-- Icono circular con color del rol -->
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center mb-3"
            :style="{ backgroundColor: getRoleBadgeColor(role.name).bg }"
          >
            <Shield
              class="w-6 h-6"
              :style="{ color: getRoleBadgeColor(role.name).text }"
            />
          </div>

          <!-- Nombre del rol -->
          <h3
            class="text-lg mb-2"
            :style="{
              color: getRoleBadgeColor(role.name).text,
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
            {{ userCountByRole[role.name] || 0 }}
          </p>
          <p
            class="text-sm"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            {{ (userCountByRole[role.name] || 0) === 1 ? 'usuario' : 'usuarios' }}
          </p>
        </button>
      </div>

      <!-- Barra de Acciones -->
      <div
        class="bg-white rounded-xl border p-4 mb-6"
        :style="{ borderColor: 'var(--border-light)' }"
      >
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Búsqueda -->
          <div class="flex-1 relative">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              :style="{ color: 'var(--text-muted)' }"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar usuario por email..."
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              :style="{
                borderColor: 'var(--border-light)',
                fontFamily: 'var(--font-secondary)',
              }"
              @focus="
                ($event.target as HTMLInputElement).style.borderColor =
                  'var(--primary-700)';
              "
              @blur="
                ($event.target as HTMLInputElement).style.borderColor =
                  'var(--border-light)';
              "
            />
          </div>

          <!-- Toggle Vista -->
          <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
            <button
              class="p-2 rounded transition-colors"
              :class="viewMode === 'table' ? 'bg-white shadow-sm' : ''"
              @click="viewMode = 'table'"
            >
              <List
                class="w-4 h-4"
                :style="{
                  color:
                    viewMode === 'table'
                      ? 'var(--primary-700)'
                      : 'var(--text-muted)',
                }"
              />
            </button>
            <button
              class="p-2 rounded transition-colors"
              :class="viewMode === 'cards' ? 'bg-white shadow-sm' : ''"
              @click="viewMode = 'cards'"
            >
              <Grid3x3
                class="w-4 h-4"
                :style="{
                  color:
                    viewMode === 'cards'
                      ? 'var(--primary-700)'
                      : 'var(--text-muted)',
                }"
              />
            </button>
          </div>

          <!-- Botón Asignar -->
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
            style="
              background-color: var(--primary-700);
              color: white;
              font-family: var(--font-secondary);
              font-weight: 500;
            "
            @click="showAssignmentModal = true"
          >
            <UserPlus class="w-4 h-4" />
            <span>Asignar Usuarios a Sociedad</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex items-center justify-center py-12"
      >
        <p
          class="text-sm"
          :style="{ color: 'var(--text-muted)' }"
        >
          Cargando usuarios...
        </p>
      </div>

      <!-- Tabla de Usuarios -->
      <div
        v-else-if="viewMode === 'table'"
        class="bg-white rounded-xl border overflow-hidden"
        :style="{ borderColor: 'var(--border-light)' }"
      >
        <table class="w-full">
          <thead style="background-color: #F9FAFB">
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
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-t hover:bg-gray-50 transition-colors"
              :style="{ borderColor: 'var(--border-light)' }"
            >
              <!-- Email con avatar -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full flex items-center justify-center"
                    :style="{
                      backgroundColor: getRoleBadgeColor(user.role.name).bg,
                    }"
                  >
                    <span
                      class="text-sm"
                      :style="{
                        color: getRoleBadgeColor(user.role.name).text,
                        fontFamily: 'var(--font-primary)',
                        fontWeight: 600,
                      }"
                    >
                      {{ user.email.charAt(0).toUpperCase() }}
                    </span>
                  </div>
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
                <span
                  class="px-3 py-1 rounded-full text-xs"
                  :style="{
                    backgroundColor: getRoleBadgeColor(user.role.name).bg,
                    color: getRoleBadgeColor(user.role.name).text,
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500,
                  }"
                >
                  {{ user.role.name }}
                </span>
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
                <span
                  v-if="user.status"
                  class="flex items-center gap-1 text-green-600"
                >
                  <CheckCircle class="w-4 h-4" />
                  <span
                    class="text-sm"
                    :style="{ fontFamily: 'var(--font-secondary)' }"
                  >
                    Activo
                  </span>
                </span>
                <span
                  v-else
                  class="flex items-center gap-1 text-red-600"
                >
                  <XCircle class="w-4 h-4" />
                  <span
                    class="text-sm"
                    :style="{ fontFamily: 'var(--font-secondary)' }"
                  >
                    Inactivo
                  </span>
                </span>
              </td>

              <!-- Fecha de creación -->
              <td
                class="px-6 py-4 text-sm"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                {{ user.createdAt.toLocaleDateString('es-ES') }}
              </td>

              <!-- Acciones -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="p-2 hover:bg-gray-100 rounded transition-colors"
                    title="Editar permisos"
                    @click="openPermissionsEditor(user)"
                  >
                    <Settings
                      class="w-4 h-4"
                      :style="{ color: 'var(--text-muted)' }"
                    />
                  </button>
                  <button
                    class="p-2 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar usuario"
                  >
                    <Trash2
                      class="w-4 h-4"
                      style="color: #EF4444"
                    />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Estado vacío -->
        <div
          v-if="filteredUsers.length === 0"
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
            {{
              searchQuery
                ? 'Intenta con otro término de búsqueda'
                : 'No hay usuarios en el sistema'
            }}
          </p>
        </div>
      </div>

      <!-- Vista de Cards (alternativa) -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="bg-white rounded-xl border p-6 hover:shadow-lg transition-all"
          :style="{ borderColor: 'var(--border-light)' }"
        >
          <!-- Avatar grande -->
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
            :style="{
              backgroundColor: getRoleBadgeColor(user.role.name).bg,
            }"
          >
            <span
              class="text-2xl"
              :style="{
                color: getRoleBadgeColor(user.role.name).text,
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              {{ user.email.charAt(0).toUpperCase() }}
            </span>
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
            {{ user.email }}
          </p>

          <!-- Badge de rol centrado -->
          <div class="flex justify-center mb-3">
            <span
              class="px-3 py-1 rounded-full text-xs"
              :style="{
                backgroundColor: getRoleBadgeColor(user.role.name).bg,
                color: getRoleBadgeColor(user.role.name).text,
                fontFamily: 'var(--font-secondary)',
                fontWeight: 500,
              }"
            >
              {{ user.role.name }}
            </span>
          </div>

          <!-- Info adicional -->
          <div
            class="text-xs text-center mb-4"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            <p>{{ user.study.name }}</p>
            <p>Creado: {{ user.createdAt.toLocaleDateString('es-ES') }}</p>
          </div>

          <!-- Acciones -->
          <div class="flex gap-2">
            <button
              class="flex-1 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
              :style="{
                borderColor: 'var(--border-light)',
                fontFamily: 'var(--font-secondary)',
              }"
              @click="openPermissionsEditor(user)"
            >
              <Settings
                class="w-4 h-4 mx-auto"
                :style="{ color: 'var(--text-muted)' }"
              />
            </button>
            <button
              class="flex-1 py-2 rounded-lg border hover:bg-red-50 transition-colors"
              :style="{
                borderColor: 'var(--border-light)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              <Trash2
                class="w-4 h-4 mx-auto"
                style="color: #EF4444"
              />
            </button>
          </div>
        </div>

        <!-- Estado vacío -->
        <div
          v-if="filteredUsers.length === 0"
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
            {{
              searchQuery
                ? 'Intenta con otro término de búsqueda'
                : 'No hay usuarios en el sistema'
            }}
          </p>
        </div>
      </div>

      <!-- Modal de Permisos -->
      <PermissionsEditor
        v-if="showPermissionsEditor && store.selectedUser"
        :is-open="showPermissionsEditor"
        :user="store.selectedUser"
        :permissions="store.userPermissions"
        @close="closePermissionsEditor"
        @save="(perms) => store.updateUserPermissions(store.selectedUser!.id, perms).then(() => closePermissionsEditor())"
      />

      <!-- Modal de Asignación -->
      <UserAssignmentModal
        v-if="showAssignmentModal"
        :is-open="showAssignmentModal"
        @close="showAssignmentModal = false"
      />
    </div>
  </div>
</template>

