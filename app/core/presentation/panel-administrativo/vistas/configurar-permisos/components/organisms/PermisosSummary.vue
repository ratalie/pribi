<script setup lang="ts">
import { Check, X } from 'lucide-vue-next';
import type { SimplePermissionsConfig } from '~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types';
import type { SocietyInfo } from '~/core/hexag/panel-administrativo/domain/entities/society-assignment.entity';

interface Props {
  config: SimplePermissionsConfig;
  societies: SocietyInfo[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const roleLabels: Record<string, string> = {
  Administrador: 'Administrador',
  Editor: 'Editor',
  Lector: 'Lector',
};

const areaLabels: Record<string, string> = {
  REGISTROS: 'Registros',
  OPERACIONES: 'Operaciones',
  REPOSITORIO_AI: 'Repositorio AI',
  SUNAT: 'SUNAT',
  ARCHIVES: 'Archivos',
};

const actionLabels: Record<string, string> = {
  view: 'Ver',
  create: 'Crear',
  update: 'Editar',
  delete: 'Eliminar',
  file: 'Archivar',
};

const enabledModules = computed(() => {
  return props.config.modules.filter((m) => m.enabled);
});

const selectedSocietiesList = computed(() => {
  if (props.config.societies.mode === 'all') {
    return [];
  }
  return props.societies.filter((s) =>
    props.config.societies.ids.includes(s.id),
  );
});

const enabledActions = computed(() => {
  return Object.entries(props.config.actions)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => key);
});
</script>

<template>
  <div class="permisos-summary">
    <div class="permisos-summary-header">
      <h3
        class="permisos-summary-title"
        :style="{
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-primary)',
          fontWeight: 600,
        }"
      >
        Resumen de Configuración
      </h3>
      <p
        class="permisos-summary-subtitle"
        :style="{
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-secondary)',
        }"
      >
        Revisa la configuración antes de guardar
      </p>
    </div>

    <div class="permisos-summary-content">
      <!-- Rol -->
      <div class="permisos-summary-section">
        <h4
          class="permisos-summary-section-title"
          :style="{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
          }"
        >
          Rol
        </h4>
        <p
          class="permisos-summary-section-value"
          :style="{
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)',
          }"
        >
          {{ roleLabels[config.role] || config.role }}
        </p>
      </div>

      <!-- Módulos (si no es Administrador) -->
      <div
        v-if="config.role !== 'Administrador'"
        class="permisos-summary-section"
      >
        <h4
          class="permisos-summary-section-title"
          :style="{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
          }"
        >
          Módulos Habilitados
        </h4>
        <div class="permisos-summary-list">
          <div
            v-for="module in enabledModules"
            :key="module.area"
            class="permisos-summary-item"
          >
            <Check
              class="permisos-summary-check"
              :style="{ color: 'var(--primary-700)' }"
            />
            <span
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              {{ areaLabels[module.area] || module.area }}
            </span>
          </div>
          <div
            v-if="enabledModules.length === 0"
            class="permisos-summary-empty"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            No hay módulos habilitados
          </div>
        </div>
      </div>

      <!-- Sociedades (si no es Administrador) -->
      <div
        v-if="config.role !== 'Administrador'"
        class="permisos-summary-section"
      >
        <h4
          class="permisos-summary-section-title"
          :style="{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
          }"
        >
          Sociedades
        </h4>
        <div class="permisos-summary-list">
          <div
            v-if="config.societies.mode === 'all'"
            class="permisos-summary-item"
          >
            <Check
              class="permisos-summary-check"
              :style="{ color: 'var(--primary-700)' }"
            />
            <span
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              Todas las sociedades
            </span>
          </div>
          <div
            v-else
            v-for="society in selectedSocietiesList"
            :key="society.id"
            class="permisos-summary-item"
          >
            <Check
              class="permisos-summary-check"
              :style="{ color: 'var(--primary-700)' }"
            />
            <span
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              {{ society.name }}
              <span
                v-if="society.ruc"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                (RUC: {{ society.ruc }})
              </span>
            </span>
          </div>
          <div
            v-if="config.societies.mode === 'specific' && selectedSocietiesList.length === 0"
            class="permisos-summary-empty"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            No hay sociedades seleccionadas
          </div>
        </div>
      </div>

      <!-- Acciones (solo Editor) -->
      <div
        v-if="config.role === 'Editor'"
        class="permisos-summary-section"
      >
        <h4
          class="permisos-summary-section-title"
          :style="{
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
          }"
        >
          Acciones Permitidas
        </h4>
        <div class="permisos-summary-list">
          <div
            v-for="action in enabledActions"
            :key="action"
            class="permisos-summary-item"
          >
            <Check
              class="permisos-summary-check"
              :style="{ color: 'var(--primary-700)' }"
            />
            <span
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              {{ actionLabels[action] || action }}
            </span>
          </div>
          <div
            v-if="enabledActions.length === 0"
            class="permisos-summary-empty"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            No hay acciones habilitadas
          </div>
        </div>
      </div>
    </div>

    <div class="permisos-summary-actions">
      <button
        type="button"
        class="permisos-summary-button permisos-summary-button-cancel"
        :style="{
          fontFamily: 'var(--font-secondary)',
        }"
        @click="emit('cancel')"
      >
        <X class="permisos-summary-button-icon" />
        Cancelar
      </button>
      <button
        type="button"
        class="permisos-summary-button permisos-summary-button-confirm"
        :style="{
          fontFamily: 'var(--font-secondary)',
        }"
        @click="emit('confirm')"
      >
        <Check class="permisos-summary-button-icon" />
        Confirmar y Guardar
      </button>
    </div>
  </div>
</template>

<style scoped>
.permisos-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid var(--border-light);
  border-radius: 0.75rem;
}

.permisos-summary-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.permisos-summary-title {
  font-size: 1.125rem;
  margin: 0;
}

.permisos-summary-subtitle {
  font-size: 0.875rem;
  margin: 0;
}

.permisos-summary-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.permisos-summary-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.permisos-summary-section-title {
  font-size: 0.875rem;
  margin: 0;
}

.permisos-summary-section-value {
  font-size: 0.875rem;
  margin: 0;
}

.permisos-summary-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.permisos-summary-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.permisos-summary-check {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.permisos-summary-empty {
  font-size: 0.875rem;
  font-style: italic;
  padding: 0.5rem 0;
}

.permisos-summary-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
}

.permisos-summary-button {
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

.permisos-summary-button-icon {
  width: 1rem;
  height: 1rem;
}

.permisos-summary-button-cancel {
  background: white;
  color: var(--text-primary);
  border: 2px solid var(--border-light);
}

.permisos-summary-button-cancel:hover {
  background: var(--bg-muted);
  border-color: var(--text-muted);
}

.permisos-summary-button-confirm {
  background: var(--primary-700);
  color: white;
}

.permisos-summary-button-confirm:hover {
  background: var(--primary-800);
}

/* Responsive */
@media (min-width: 1280px) and (max-width: 1439px) {
  .permisos-summary {
    padding: 1.75rem;
  }
  .permisos-summary-title {
    font-size: 1.1875rem;
  }
}

@media (min-width: 1440px) {
  .permisos-summary {
    padding: 2rem;
  }
  .permisos-summary-title {
    font-size: 1.25rem;
  }
}
</style>


