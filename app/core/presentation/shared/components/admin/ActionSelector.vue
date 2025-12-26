<script setup lang="ts">
  import { computed, watch } from "vue";
  import { Eye, Plus, Edit, Trash2, FileText } from "lucide-vue-next";
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import type {
    ActionsConfig,
    SimpleRole,
  } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";

  interface Props {
    modelValue: ActionsConfig;
    role: SimpleRole;
    disabled?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
  });

  const emit = defineEmits<{
    "update:modelValue": [value: ActionsConfig];
  }>();

  const actions = computed({
    get: () => {
      console.log("[ActionSelector] get - modelValue recibido:", props.modelValue);
      // Asegurar que siempre retornamos un objeto reactivo
      return (
        props.modelValue || {
          view: false,
          create: false,
          update: false,
          delete: false,
          file: false,
        }
      );
    },
    set: (value: ActionsConfig) => {
      console.log("[ActionSelector] set - emitiendo nuevo valor:", value);
      emit("update:modelValue", value);
    },
  });

  // Watcher para detectar cambios en modelValue
  watch(
    () => props.modelValue,
    (newValue) => {
      console.log("[ActionSelector] watch - modelValue cambió:", newValue);
    },
    { deep: true, immediate: true }
  );

  const actionConfig = [
    {
      key: "view" as keyof ActionsConfig,
      label: "Ver",
      description: "Puede ver y leer información",
      icon: Eye,
    },
    {
      key: "create" as keyof ActionsConfig,
      label: "Crear",
      description: "Puede crear nuevos registros",
      icon: Plus,
    },
    {
      key: "update" as keyof ActionsConfig,
      label: "Editar",
      description: "Puede modificar información existente",
      icon: Edit,
    },
    {
      key: "delete" as keyof ActionsConfig,
      label: "Eliminar",
      description: "Puede eliminar registros",
      icon: Trash2,
    },
    {
      key: "file" as keyof ActionsConfig,
      label: "Archivar",
      description: "Puede archivar y documentar",
      icon: FileText,
    },
  ];

  const isActionDisabled = (key: keyof ActionsConfig): boolean => {
    // Si es Lector, solo 'view' está habilitado
    if (props.role === "Lector" && key !== "view") {
      return true;
    }
    return props.disabled;
  };

  const toggleAction = (key: keyof ActionsConfig, value?: boolean) => {
    if (isActionDisabled(key)) return;

    // Si se pasa un valor, usarlo; si no, hacer toggle
    const newValue = value !== undefined ? value : !actions.value[key];

    const newActions = {
      ...actions.value,
      [key]: newValue,
    };

    // Si es Lector, asegurar que solo 'view' esté habilitado
    if (props.role === "Lector") {
      newActions.create = false;
      newActions.update = false;
      newActions.delete = false;
      newActions.file = false;
      // Si se desactiva 'view' en Lector, forzarlo a true
      if (key === "view" && !newValue) {
        newActions.view = true;
      }
    }

    actions.value = newActions;
  };
</script>

<template>
  <div class="action-selector">
    <label
      class="action-selector-label"
      :style="{
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-primary)',
        fontWeight: 600,
      }"
    >
      ¿Qué acciones puede realizar?
    </label>

    <div class="action-selector-grid">
      <div
        v-for="action in actionConfig"
        :key="action.key"
        class="action-item"
        :class="{
          'action-item-enabled': actions[action.key],
          'action-item-disabled': isActionDisabled(action.key),
        }"
      >
        <Checkbox
          :model-value="actions[action.key]"
          :is-disabled="isActionDisabled(action.key)"
          @update:model-value="(value) => toggleAction(action.key, !!value)"
        />

        <div class="action-item-icon">
          <component
            :is="action.icon"
            class="action-icon"
            :style="{
              color: actions[action.key] ? 'var(--primary-700)' : 'var(--text-muted)',
            }"
          />
        </div>

        <div class="action-item-text">
          <h4
            class="action-item-title"
            :style="{
              color: actions[action.key] ? 'var(--text-primary)' : 'var(--text-muted)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
            }"
          >
            {{ action.label }}
          </h4>
          <p
            class="action-item-description"
            :style="{
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            {{ action.description }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="role === 'Lector'"
      class="action-selector-note"
      :style="{
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-secondary)',
      }"
    >
      <p class="action-note-text">
        Los usuarios con rol "Lector" solo pueden ver información. Las demás acciones están
        deshabilitadas.
      </p>
    </div>
  </div>
</template>

<style scoped>
  .action-selector {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .action-selector-label {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .action-selector-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .action-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border: 2px solid var(--border-light);
    border-radius: 0.75rem;
    background: white;
    transition: all 0.2s;
  }

  .action-item:hover:not(.action-item-disabled) {
    border-color: var(--primary-500);
  }

  .action-item-enabled {
    border-color: var(--primary-700);
    background: var(--primary-50);
  }

  .action-item-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .action-item-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .action-item-title {
    font-size: 0.875rem;
    margin: 0;
  }

  .action-item-description {
    font-size: 0.75rem;
    margin: 0;
    line-height: 1.4;
  }

  .action-selector-note {
    padding: 0.75rem;
    background: var(--bg-muted);
    border-radius: 0.5rem;
    border-left: 3px solid var(--primary-500);
  }

  .action-note-text {
    font-size: 0.75rem;
    margin: 0;
    line-height: 1.4;
  }

  /* Responsive */
  @media (min-width: 768px) {
    .action-selector-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1280px) and (max-width: 1439px) {
    .action-selector-label {
      font-size: 0.9375rem;
    }
    .action-item-title {
      font-size: 0.9375rem;
    }
    .action-item-description {
      font-size: 0.8125rem;
    }
  }

  @media (min-width: 1440px) {
    .action-selector-label {
      font-size: 1rem;
    }
    .action-item-title {
      font-size: 1rem;
    }
    .action-item-description {
      font-size: 0.875rem;
    }
  }
</style>
