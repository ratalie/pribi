<script setup lang="ts">
import { X, Shield } from 'lucide-vue-next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePermissionsEditor } from '~/core/presentation/panel-administrativo/composables/usePermissionsEditor';
import PermissionsEditorTabs from './PermissionsEditorTabs.vue';
import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';
import { getRoleBadgeColor } from '~/data/mockDataAdmin';

interface Props {
  isOpen: boolean;
  user: User;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'save'): void;
}>();

/**
 * Componente wrapper principal para el editor de permisos
 * Auto-gestiona toda la lógica usando el composable usePermissionsEditor
 */
const {
  activeTab,
  currentUser,
  isLoading,
  isSaving,
  setActiveTab,
  saveAllChanges,
} = usePermissionsEditor(props.user);

const roleColors = computed(() => getRoleBadgeColor(currentUser.value.role.name));

const handleSave = async () => {
  try {
    await saveAllChanges();
    emits('save');
  } catch (error) {
    console.error('Error al guardar:', error);
  }
};

const handleClose = () => {
  emits('close');
};
</script>

<template>
  <Dialog
    :open="isOpen"
    @update:open="(val) => !val && handleClose()"
  >
    <DialogContent
      class="max-w-4xl max-h-[90vh] flex flex-col p-0"
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
            <!-- Icono con color del rol -->
            <div
              class="p-3 rounded-lg"
              :style="{ backgroundColor: roleColors.bg }"
            >
              <Shield
                class="w-6 h-6"
                :style="{ color: roleColors.text }"
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
                Configurar Permisos
              </DialogTitle>

              <div class="flex items-center gap-2">
                <!-- Email del usuario -->
                <p
                  class="text-sm"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  {{ currentUser.email }}
                </p>

                <!-- Badge de rol -->
                <span
                  class="px-2 py-1 rounded-full text-xs"
                  :style="{
                    backgroundColor: roleColors.bg,
                    color: roleColors.text,
                    fontFamily: 'var(--font-secondary)',
                    fontWeight: 500,
                  }"
                >
                  {{ currentUser.role.name }}
                </span>
              </div>
            </div>
          </div>

          <!-- Botón cerrar -->
          <button
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            @click="handleClose"
          >
            <X
              class="w-5 h-5"
              :style="{ color: 'var(--text-muted)' }"
            />
          </button>
        </div>
      </DialogHeader>

      <!-- Tabs Content -->
      <PermissionsEditorTabs
        :user="currentUser"
        :active-tab="activeTab"
        :is-loading="isLoading"
        :is-saving="isSaving"
        @tab-change="setActiveTab"
        @save="handleSave"
        @cancel="handleClose"
      />
    </DialogContent>
  </Dialog>
</template>

