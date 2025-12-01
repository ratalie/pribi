<script setup lang="ts">
import {
  Building2,
  Search,
  Check,
  Users,
} from 'lucide-vue-next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockUsers, mockRoles, getRoleBadgeColor } from '~/data/mockDataAdmin';
import { sociedadesMock } from '~/core/hexag/repositorio/infrastructure/mocks/data/repositorio.state';
import type { RoleName } from '~/core/hexag/panel-administrativo/domain/entities/role.entity';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'assign', userIds: string[], societyId: string): void;
}>();

// Estados locales
const selectedSociety = ref<string>('');
const searchQuery = ref('');
const selectedRole = ref<RoleName | 'all'>('all');
const selectedUsers = ref<string[]>([]);

// Usuarios disponibles filtrados
const availableUsers = computed(() => {
  return mockUsers.filter((user) => {
    const matchesRole =
      selectedRole.value === 'all' || user.role.name === selectedRole.value;
    const matchesSearch =
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesRole && matchesSearch && user.status;
  });
});

// Toggle selección de usuario
const toggleUser = (userId: string) => {
  if (selectedUsers.value.includes(userId)) {
    selectedUsers.value = selectedUsers.value.filter((id) => id !== userId);
  } else {
    selectedUsers.value = [...selectedUsers.value, userId];
  }
};

// Asignar usuarios a sociedad
const handleAssign = () => {
  if (!selectedSociety.value || selectedUsers.value.length === 0) {
    alert('Selecciona una sociedad y al menos un usuario');
    return;
  }

  emits('assign', selectedUsers.value, selectedSociety.value);
  // Limpiar estado
  selectedSociety.value = '';
  selectedUsers.value = [];
  searchQuery.value = '';
  selectedRole.value = 'all';
  emits('close');
};

// Reset al cerrar
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      selectedSociety.value = '';
      selectedUsers.value = [];
      searchQuery.value = '';
      selectedRole.value = 'all';
    }
  }
);
</script>

<template>
  <Dialog
    :open="isOpen"
    @update:open="(val) => !val && emits('close')"
  >
    <DialogContent
      class="max-w-2xl max-h-[90vh] flex flex-col p-0"
      :style="{
        fontFamily: 'var(--font-secondary)',
      }"
    >
      <!-- Header -->
      <DialogHeader
        class="px-6 py-4 border-b flex-shrink-0"
        :style="{ borderColor: 'var(--border-light)' }"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="p-3 rounded-lg"
              style="background-color: #EEF2FF"
            >
              <Users
                class="w-6 h-6"
                :style="{ color: 'var(--primary-700)' }"
              />
            </div>
            <div>
              <DialogTitle
                class="text-xl mb-1"
                :style="{
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-primary)',
                  fontWeight: 600,
                }"
              >
                Asignar Usuarios a Sociedad
              </DialogTitle>
              <p
                class="text-sm"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                Selecciona la sociedad y los usuarios a asignar
              </p>
            </div>
          </div>
        </div>
      </DialogHeader>

      <!-- Contenido con Scroll -->
      <div
        class="flex-1 overflow-y-auto px-6 py-4 space-y-6"
        :style="{ fontFamily: 'var(--font-secondary)' }"
      >
        <!-- Selector de Sociedad -->
        <div>
          <label
            class="block text-sm mb-2"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 600,
            }"
          >
            Sociedad *
          </label>
          <div class="relative">
            <Building2
              class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              :style="{ color: 'var(--text-muted)' }"
            />
            <select
              v-model="selectedSociety"
              class="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
              :style="{
                borderColor: 'var(--border-light)',
                fontFamily: 'var(--font-secondary)',
              }"
              @focus="
                ($event.target as HTMLSelectElement).style.borderColor =
                  'var(--primary-700)';
              "
              @blur="
                ($event.target as HTMLSelectElement).style.borderColor =
                  'var(--border-light)';
              "
            >
              <option value="">Seleccionar sociedad...</option>
              <option
                v-for="sociedad in sociedadesMock.filter((s) => s.activa)"
                :key="sociedad.id"
                :value="sociedad.id"
              >
                {{ sociedad.nombre }} - {{ sociedad.rut }}
              </option>
            </select>
          </div>
        </div>

        <!-- Filtros de Búsqueda -->
        <div class="flex gap-3">
          <!-- Búsqueda por email -->
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

          <!-- Filtro por rol -->
          <select
            v-model="selectedRole"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
            :style="{
              borderColor: 'var(--border-light)',
              fontFamily: 'var(--font-secondary)',
            }"
            @focus="
              ($event.target as HTMLSelectElement).style.borderColor =
                'var(--primary-700)';
            "
            @blur="
              ($event.target as HTMLSelectElement).style.borderColor =
                'var(--border-light)';
            "
          >
            <option value="all">Todos los roles</option>
            <option
              v-for="role in mockRoles"
              :key="role.id"
              :value="role.name"
            >
              {{ role.name }}
            </option>
          </select>
        </div>

        <!-- Lista de Usuarios Seleccionables -->
        <div class="space-y-2">
          <div
            v-if="availableUsers.length === 0"
            class="py-12 text-center"
          >
            <p
              class="text-sm"
              :style="{ color: 'var(--text-muted)' }"
            >
              No se encontraron usuarios
            </p>
          </div>

          <button
            v-for="user in availableUsers"
            :key="user.id"
            class="w-full p-4 border rounded-lg flex items-center justify-between hover:shadow-sm transition-all"
            :class="selectedUsers.includes(user.id) ? 'ring-2' : ''"
            :style="{
              borderColor: selectedUsers.includes(user.id)
                ? 'var(--primary-700)'
                : 'var(--border-light)',
              backgroundColor: selectedUsers.includes(user.id)
                ? '#F5F3FF'
                : 'white',
            }"
            @click="toggleUser(user.id)"
          >
            <div class="flex items-center gap-3">
              <!-- Avatar con inicial -->
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

              <div class="text-left">
                <!-- Email -->
                <p
                  class="text-sm"
                  :style="{
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500,
                  }"
                >
                  {{ user.email }}
                </p>

                <!-- Badge de rol + estudio -->
                <div class="flex items-center gap-2 mt-1">
                  <span
                    class="px-2 py-0.5 rounded text-xs"
                    :style="{
                      backgroundColor: getRoleBadgeColor(user.role.name).bg,
                      color: getRoleBadgeColor(user.role.name).text,
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 500,
                    }"
                  >
                    {{ user.role.name }}
                  </span>
                  <span
                    class="text-xs"
                    :style="{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-secondary)',
                    }"
                  >
                    {{ user.study.name }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Check indicator -->
            <div
              v-if="selectedUsers.includes(user.id)"
              class="w-6 h-6 rounded-full flex items-center justify-center"
              style="background-color: var(--primary-700)"
            >
              <Check
                class="w-4 h-4"
                style="color: white"
              />
            </div>
          </button>
        </div>

        <!-- Info de Selección -->
        <div
          v-if="selectedUsers.length > 0"
          class="p-3 rounded-lg"
          style="background-color: #EEF2FF"
        >
          <p
            class="text-sm"
            :style="{
              color: 'var(--primary-700)',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 500,
            }"
          >
            {{ selectedUsers.length }}
            {{ selectedUsers.length === 1 ? 'usuario seleccionado' : 'usuarios seleccionados' }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div
        class="px-6 py-4 border-t flex items-center justify-end gap-3 flex-shrink-0"
        :style="{ borderColor: 'var(--border-light)' }"
      >
        <button
          class="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
          :style="{
            borderColor: 'var(--border-light)',
            fontFamily: 'var(--font-secondary)',
          }"
          @click="emits('close')"
        >
          Cancelar
        </button>
        <button
          class="px-6 py-2 rounded-lg hover:shadow-md transition-all"
          :style="{
            backgroundColor: 'var(--primary-700)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-secondary)',
            fontWeight: 500,
          }"
          :disabled="!selectedSociety || selectedUsers.length === 0"
          @click="handleAssign"
        >
          Asignar{{ selectedUsers.length > 0 ? ` (${selectedUsers.length})` : '' }}
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>

