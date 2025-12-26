<script setup lang="ts">
import { computed } from "vue";
import { ChevronDown } from "lucide-vue-next";
import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
import ActionCheckboxes from "./ActionCheckboxes.vue";
import type {
  SubModuleConfig,
  SimpleRole,
} from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";

interface Props {
  submodule: SubModuleConfig;
  disabled?: boolean;
  role: SimpleRole;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:submodule": [submodule: SubModuleConfig];
}>();

const isExpanded = computed(() => props.submodule.enabled);

const toggleSubmodule = (enabled: boolean) => {
  const updated: SubModuleConfig = {
    ...props.submodule,
    enabled,
    // Si se deshabilita, resetear acciones a false
    actions: enabled
      ? props.submodule.actions
      : {
          view: false,
          create: false,
          update: false,
          delete: props.submodule.actions.delete !== undefined ? false : undefined,
          file: props.submodule.actions.file !== undefined ? false : undefined,
        },
  };
  emit("update:submodule", updated);
};

const updateActions = (actions: SubModuleConfig["actions"]) => {
  const updated: SubModuleConfig = {
    ...props.submodule,
    actions,
  };
  emit("update:submodule", updated);
};
</script>

<template>
  <div class="submodule-item">
    <!-- Header del sub-módulo -->
    <div
      class="submodule-header"
      :class="{
        'submodule-header-enabled': submodule.enabled,
        'submodule-header-disabled': disabled || !submodule.enabled,
      }"
      @click="!disabled && toggleSubmodule(!submodule.enabled)"
    >
      <Checkbox
        :model-value="submodule.enabled"
        :is-disabled="disabled"
        @update:model-value="(value) => toggleSubmodule(!!value)"
        @click.stop
      />

      <div class="submodule-info">
        <h4
          class="submodule-title"
          :style="{
            color: submodule.enabled
              ? 'var(--text-primary)'
              : 'var(--text-muted)',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
            fontSize: '0.875rem',
          }"
        >
          {{ submodule.displayName }}
        </h4>
        <p
          v-if="submodule.description"
          class="submodule-description"
          :style="{
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)',
            fontSize: '0.75rem',
          }"
        >
          {{ submodule.description }}
        </p>
      </div>

      <ChevronDown
        class="submodule-expand-icon"
        :class="{ 'expanded': isExpanded }"
        :style="{
          color: submodule.enabled
            ? 'var(--primary-700)'
            : 'var(--text-muted)',
        }"
      />
    </div>

    <!-- Acciones del sub-módulo (solo si está habilitado) -->
    <Transition name="expand">
      <div v-if="submodule.enabled" class="submodule-actions">
        <ActionCheckboxes
          :model-value="submodule.actions"
          :role="role"
          :disabled="disabled"
          :show-delete="submodule.actions.delete !== undefined"
          :show-file="submodule.actions.file !== undefined"
          @update:model-value="updateActions"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.submodule-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  background: var(--bg-muted);
  transition: all 0.2s;
}

.submodule-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.submodule-header:hover:not(.submodule-header-disabled) {
  background: var(--primary-50);
}

.submodule-header-enabled {
  background: var(--primary-50);
}

.submodule-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.submodule-title {
  margin: 0;
}

.submodule-description {
  margin: 0;
  line-height: 1.4;
}

.submodule-expand-icon {
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.submodule-expand-icon.expanded {
  transform: rotate(180deg);
}

.submodule-actions {
  padding-left: 2rem;
  border-left: 2px solid var(--primary-200);
}

/* Transiciones */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>


