<script setup lang="ts">
import { Shield, Edit, Eye } from 'lucide-vue-next';
import type { SimpleRole } from '~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types';
import { getDefaultPermissionsForRole } from '~/core/presentation/panel-administrativo/vistas/configurar-permisos/utils/role-permissions.utils';
import type { ActionsConfig } from '~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types';

interface Props {
  modelValue: SimpleRole;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: SimpleRole];
  'role-changed': [role: SimpleRole, permissions: ActionsConfig];
}>();

const selectedRole = computed({
  get: () => props.modelValue,
  set: (value: SimpleRole) => {
    console.log('[RoleSelector] Cambiando rol a:', value);
    // Emitir evento con permisos base cuando cambia el rol
    const defaultPermissions = getDefaultPermissionsForRole(value);
    console.log('[RoleSelector] Permisos base para', value, ':', defaultPermissions);
    // Emitir ambos eventos: update:modelValue y role-changed
    emit('update:modelValue', value);
    emit('role-changed', value, defaultPermissions);
  },
});

// Computed para obtener permisos base del rol seleccionado
const defaultPermissions = computed(() => {
  return getDefaultPermissionsForRole(props.modelValue);
});

const roles: Array<{
  value: SimpleRole;
  label: string;
  description: string;
  icon: any;
  color: string;
}> = [
  {
    value: 'Administrador',
    label: 'Administrador',
    description: 'Acceso completo al sistema. Todas las sociedades y todas las acciones.',
    icon: Shield,
    color: 'var(--primary-700)',
  },
  {
    value: 'Editor',
    label: 'Editor',
    description: 'Puede crear y editar con limitaciones configurables.',
    icon: Edit,
    color: 'var(--primary-600)',
  },
  {
    value: 'Lector',
    label: 'Lector',
    description: 'Solo lectura. No puede modificar información.',
    icon: Eye,
    color: 'var(--text-muted)',
  },
];
</script>

<template>
  <div class="role-selector">
    <label
      class="role-selector-label"
      :style="{
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-primary)',
        fontWeight: 600,
      }"
    >
      Tipo de Usuario
    </label>

    <div class="role-selector-grid">
      <button
        v-for="role in roles"
        :key="role.value"
        type="button"
        class="role-card"
        :class="{
          'role-card-selected': selectedRole === role.value,
          'role-card-disabled': disabled,
        }"
        :disabled="disabled"
        @click="selectedRole = role.value"
      >
        <div
          class="role-card-icon"
          :style="{
            backgroundColor:
              selectedRole === role.value ? role.color : 'var(--bg-muted)',
          }"
        >
          <component
            :is="role.icon"
            class="role-icon"
            :style="{
              color:
                selectedRole === role.value
                  ? 'white'
                  : 'var(--text-muted)',
            }"
          />
        </div>

        <div class="role-card-content">
          <h3
            class="role-card-title"
            :style="{
              color:
                selectedRole === role.value
                  ? role.color
                  : 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
            }"
          >
            {{ role.label }}
          </h3>
          <p
            class="role-card-description"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            {{ role.description }}
          </p>
        </div>

        <div
          v-if="selectedRole === role.value"
          class="role-card-check"
          :style="{ color: role.color }"
        >
          <div class="role-check-circle" :style="{ backgroundColor: role.color }" />
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.role-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.role-selector-label {
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.role-selector-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.role-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--border-light);
  border-radius: 0.75rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  position: relative;
}

.role-card:hover:not(.role-card-disabled) {
  border-color: var(--primary-500);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.role-card-selected {
  border-color: var(--primary-700);
  background: var(--primary-50);
}

.role-card-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.role-card-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.role-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.role-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.role-card-title {
  font-size: 1rem;
  margin: 0;
}

.role-card-description {
  font-size: 0.75rem;
  margin: 0;
  line-height: 1.4;
}

.role-card-check {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.role-check-circle {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.role-check-circle::after {
  content: '✓';
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Responsive */
@media (min-width: 768px) {
  .role-selector-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) and (max-width: 1439px) {
  .role-selector-label {
    font-size: 0.9375rem;
  }
  .role-card-title {
    font-size: 1.0625rem;
  }
  .role-card-description {
    font-size: 0.8125rem;
  }
}

@media (min-width: 1440px) {
  .role-selector-label {
    font-size: 1rem;
  }
  .role-card-title {
    font-size: 1.125rem;
  }
  .role-card-description {
    font-size: 0.875rem;
  }
}
</style>




