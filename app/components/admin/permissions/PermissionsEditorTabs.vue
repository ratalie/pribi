<script setup lang="ts">
import { Shield } from 'lucide-vue-next';
import UserRoleTab from './tabs/UserRoleTab.vue';
import RoutePermissionsTab from './tabs/RoutePermissionsTab.vue';
import SocietyAssignmentTab from './tabs/SocietyAssignmentTab.vue';
import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';
import { getRoleBadgeColor } from '~/data/mockDataAdmin';

interface Props {
  user: User;
  activeTab: 'role' | 'routes' | 'societies';
  isLoading?: boolean;
  isSaving?: boolean;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: 'tab-change', tab: 'role' | 'routes' | 'societies'): void;
  (e: 'save'): void;
  (e: 'cancel'): void;
}>();

const roleColors = computed(() => getRoleBadgeColor(props.user.role.name));

const tabs = [
  { id: 'role', label: 'Permisos del Usuario', icon: Shield },
  { id: 'routes', label: 'Rutas', icon: Shield },
  { id: 'societies', label: 'Sociedades', icon: Shield },
] as const;

const routePermissionsTabRef = ref<InstanceType<typeof RoutePermissionsTab> | null>(null);
const societyAssignmentTabRef = ref<InstanceType<typeof SocietyAssignmentTab> | null>(null);

const handleSave = async () => {
  // Guardar cambios de cada tab si tienen cambios pendientes
  if (props.activeTab === 'routes' && routePermissionsTabRef.value) {
    await routePermissionsTabRef.value.save();
  }
  if (props.activeTab === 'societies' && societyAssignmentTabRef.value) {
    await societyAssignmentTabRef.value.save();
  }
  emits('save');
};
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Tabs Navigation -->
    <div
      class="flex border-b flex-shrink-0"
      :style="{ borderColor: 'var(--border-light)' }"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-6 py-3 text-sm font-medium transition-colors relative"
        :style="{
          color: activeTab === tab.id ? 'var(--primary-700)' : 'var(--text-muted)',
          borderBottom: activeTab === tab.id ? '2px solid var(--primary-700)' : 'none',
        }"
        @click="emits('tab-change', tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-y-auto p-6">
      <UserRoleTab
        v-if="activeTab === 'role'"
        :user="user"
        @role-updated="handleSave"
      />
      <RoutePermissionsTab
        v-if="activeTab === 'routes'"
        ref="routePermissionsTabRef"
        :user="user"
        @routes-updated="() => {}"
      />
      <SocietyAssignmentTab
        v-if="activeTab === 'societies'"
        ref="societyAssignmentTabRef"
        :user="user"
        @societies-updated="() => {}"
      />
    </div>

    <!-- Footer Actions -->
    <div
      class="px-6 py-4 border-t flex items-center justify-between flex-shrink-0"
      :style="{ borderColor: 'var(--border-light)' }"
    >
      <button
        class="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
        :style="{
          borderColor: 'var(--border-light)',
          color: 'var(--text-muted)',
        }"
        @click="emits('cancel')"
      >
        Cancelar
      </button>
      <button
        class="px-6 py-2 rounded-lg hover:shadow-md transition-all"
        :style="{
          backgroundColor: 'var(--primary-700)',
          color: '#FFFFFF',
          fontWeight: 500,
        }"
        :disabled="isLoading || isSaving"
        @click="handleSave"
      >
        {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </div>
  </div>
</template>

