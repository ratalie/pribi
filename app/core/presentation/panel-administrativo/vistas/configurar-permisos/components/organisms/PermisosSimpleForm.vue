<script setup lang="ts">
import RoleSelector from '~/core/presentation/shared/components/admin/RoleSelector.vue';
import ModuleSelector from '~/core/presentation/shared/components/admin/ModuleSelector.vue';
import SocietySelector from '~/core/presentation/shared/components/admin/SocietySelector.vue';
import ActionSelector from '~/core/presentation/shared/components/admin/ActionSelector.vue';
import type { SimplePermissionsConfig } from '~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types';
import type { SocietyInfo } from '~/core/hexag/panel-administrativo/domain/entities/society-assignment.entity';

interface Props {
  modelValue: SimplePermissionsConfig;
  societies: SocietyInfo[];
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  societies: () => [],
});

const emit = defineEmits<{
  'update:modelValue': [value: SimplePermissionsConfig];
  'showAdvanced': [];
}>();

const config = computed({
  get: () => props.modelValue,
  set: (value: SimplePermissionsConfig) => emit('update:modelValue', value),
});

const showAdvanced = () => {
  emit('showAdvanced');
};
</script>

<template>
  <div class="permisos-simple-form">
    <div class="permisos-form-section">
      <!-- Paso 1: Seleccionar Rol -->
      <div class="permisos-form-step">
        <RoleSelector
          v-model="config.role"
          :disabled="disabled"
        />
      </div>

      <!-- Paso 2: Configurar Módulos (si no es Administrador) -->
      <div
        v-if="config.role !== 'Administrador'"
        class="permisos-form-step"
      >
        <ModuleSelector
          v-model="config.modules"
          mode="simple"
          :disabled="disabled"
          @show-advanced="showAdvanced"
        />
      </div>

      <!-- Paso 3: Configurar Sociedades (si no es Administrador) -->
      <div
        v-if="config.role !== 'Administrador'"
        class="permisos-form-step"
      >
        <SocietySelector
          v-model="config.societies"
          :societies="societies"
          :disabled="disabled"
        />
      </div>

      <!-- Paso 4: Configurar Acciones (solo Editor) -->
      <div
        v-if="config.role === 'Editor'"
        class="permisos-form-step"
      >
        <ActionSelector
          v-model="config.actions"
          role="Editor"
          :disabled="disabled"
        />
      </div>

      <!-- Mensaje para Administrador -->
      <div
        v-if="config.role === 'Administrador'"
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
  gap: 0;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-light);
}

.permisos-form-step:last-child {
  border-bottom: none;
  padding-bottom: 0;
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


