<script setup lang="ts">
import { usePermissionsConfigStore } from '~/core/presentation/panel-administrativo/stores/permissions-config.store';
import RoleSelector from '~/core/presentation/shared/components/admin/RoleSelector.vue';
import ActionSelector from '~/core/presentation/shared/components/admin/ActionSelector.vue';
import type { SimpleRole, ActionsConfig } from '~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types';

interface Props {
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  'showAdvanced': [];
}>();

// Usar el store directamente en lugar de v-model
const store = usePermissionsConfigStore();

// Computed para el rol actual - solo lectura, el cambio se maneja en handleRoleChanged
const currentRole = computed(() => store.selectedRole);

// Computed para las acciones actuales
const currentActions = computed({
  get: () => {
    console.log('[PermisosSimpleForm] get currentActions - store.selectedActions:', store.selectedActions);
    return store.selectedActions;
  },
  set: (value: ActionsConfig) => {
    console.log('[PermisosSimpleForm] set currentActions - nuevo valor:', value);
    store.setActions(value);
  },
});

// Manejar cambio de rol y aplicar permisos base automáticamente
const handleRoleChanged = (role: SimpleRole, permissions: ActionsConfig) => {
  console.log('[PermisosSimpleForm] Rol cambiado:', role, 'Permisos base:', permissions);
  // Actualizar el store directamente
  store.setRole(role);
  store.setActions(permissions); // Aplicar permisos base automáticamente
};

const showAdvanced = () => {
  emit('showAdvanced');
};
</script>

<template>
  <div class="permisos-simple-form">
    <div class="permisos-form-section">
      <!-- Paso 1: Seleccionar Rol -->
      <div class="permisos-form-step">
        <h3 class="permisos-step-title">Tipo de Usuario</h3>
        <RoleSelector
          :model-value="currentRole"
          :disabled="disabled"
          @role-changed="handleRoleChanged"
        />
      </div>

      <!-- Paso 2: Configurar Permisos (para Editor y Lector) -->
      <div
        v-if="currentRole !== 'Administrador'"
        class="permisos-form-step"
      >
        <h3 class="permisos-step-title">¿Qué acciones puede realizar?</h3>
        <ActionSelector
          v-model="currentActions"
          :role="currentRole"
          :disabled="disabled"
        />
      </div>

      <!-- Mensaje para Administrador -->
      <div
        v-if="currentRole === 'Administrador'"
        class="permisos-admin-message"
        :style="{
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-secondary)',
        }"
      >
        <p class="permisos-admin-text">
          Los usuarios con rol "Administrador" tienen acceso completo al
          sistema. No se requiere configuración adicional.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.permisos-simple-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.permisos-form-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.permisos-form-step {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-light);
}

.permisos-form-step:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.permisos-step-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  font-family: var(--font-primary);
}

.permisos-admin-message {
  padding: 1.5rem;
  background: var(--bg-muted);
  border-radius: 0.75rem;
  border-left: 3px solid var(--primary-500);
}

.permisos-admin-text {
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

/* Responsive */
@media (min-width: 1280px) and (max-width: 1439px) {
  .permisos-form-section {
    gap: 2.25rem;
  }
  .permisos-form-step {
    padding-bottom: 2.25rem;
  }
}

@media (min-width: 1440px) {
  .permisos-form-section {
    gap: 2.5rem;
  }
  .permisos-form-step {
    padding-bottom: 2.5rem;
  }
}
</style>




