<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useConfigurarPermisos } from '../composables/useConfigurarPermisos';
import PermisosSimpleForm from './organisms/PermisosSimpleForm.vue';
import PermisosSummary from './organisms/PermisosSummary.vue';

interface Props {
  userId: string;
}

const props = defineProps<Props>();

const {
  config,
  societies,
  isValid,
  isLoading,
  isSaving,
  errorMessage,
  loadData,
  save,
  cancel,
} = useConfigurarPermisos(props.userId);

const showSummary = ref(false);

// Cargar datos iniciales
onMounted(async () => {
  try {
    await loadData();
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
});

const handleSave = () => {
  if (!isValid.value) {
    // Mostrar error de validación
    return;
  }
  showSummary.value = true;
};

const handleConfirmSave = async () => {
  try {
    await save(config.value);
    showSummary.value = false;
  } catch (error) {
    console.error('Error al guardar:', error);
    // El error se maneja en el composable
  }
};

const handleCancel = () => {
  showSummary.value = false;
  cancel();
};

const handleShowAdvanced = () => {
  // TODO: Implementar vista avanzada
  console.log('Mostrar vista avanzada');
};
</script>

<template>
  <div class="configurar-permisos-manager">
    <div v-if="isLoading" class="configurar-permisos-loading">
      <p
        :style="{
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-secondary)',
        }"
      >
        Cargando configuración...
      </p>
    </div>

    <div
      v-if="errorMessage"
      class="configurar-permisos-error"
      :style="{
        color: 'var(--destructive)',
        fontFamily: 'var(--font-secondary)',
      }"
    >
      <p>{{ errorMessage }}</p>
    </div>

    <div v-else class="configurar-permisos-content">
      <!-- Formulario Simple -->
      <div v-if="!showSummary" class="configurar-permisos-form">
        <PermisosSimpleForm
          v-model="config"
          :societies="societies"
          @show-advanced="handleShowAdvanced"
        />
      </div>

      <!-- Resumen -->
      <div v-else class="configurar-permisos-summary">
        <PermisosSummary
          :config="config"
          :societies="societies"
          @confirm="handleConfirmSave"
          @cancel="handleCancel"
        />
      </div>

      <!-- Acciones -->
      <div v-if="!showSummary" class="configurar-permisos-actions">
        <button
          type="button"
          class="configurar-permisos-button configurar-permisos-button-cancel"
          :style="{
            fontFamily: 'var(--font-secondary)',
          }"
          @click="handleCancel"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="configurar-permisos-button configurar-permisos-button-save"
          :style="{
            fontFamily: 'var(--font-secondary)',
          }"
          :disabled="!isValid || isSaving"
          @click="handleSave"
        >
          {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.configurar-permisos-manager {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.configurar-permisos-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.configurar-permisos-error {
  padding: 1rem;
  background: var(--destructive-50);
  border: 1px solid var(--destructive);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.configurar-permisos-error p {
  margin: 0;
  font-size: 0.875rem;
}

.configurar-permisos-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.configurar-permisos-form {
  flex: 1;
}

.configurar-permisos-summary {
  flex: 1;
}

.configurar-permisos-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-light);
}

.configurar-permisos-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.configurar-permisos-button-cancel {
  background: white;
  color: var(--text-primary);
  border: 2px solid var(--border-light);
}

.configurar-permisos-button-cancel:hover {
  background: var(--bg-muted);
  border-color: var(--text-muted);
}

.configurar-permisos-button-save {
  background: var(--primary-700);
  color: white;
}

.configurar-permisos-button-save:hover:not(:disabled) {
  background: var(--primary-800);
}

.configurar-permisos-button-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (min-width: 1280px) and (max-width: 1439px) {
  .configurar-permisos-content {
    gap: 2.25rem;
  }
  .configurar-permisos-actions {
    padding-top: 1.75rem;
  }
}

@media (min-width: 1440px) {
  .configurar-permisos-content {
    gap: 2.5rem;
  }
  .configurar-permisos-actions {
    padding-top: 2rem;
  }
}
</style>

