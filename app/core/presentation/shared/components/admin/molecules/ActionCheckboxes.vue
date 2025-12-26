<script setup lang="ts">
  import { computed } from "vue";
  import { Eye, Plus, Edit, Trash2, FileText } from "lucide-vue-next";
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import type {
    SubModuleActions,
    SimpleRole,
    ActionsConfig,
  } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";
  import { ROLE_DEFAULT_PERMISSIONS } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/utils/role-permissions.utils";

  interface Props {
    modelValue: SubModuleActions;
    role: SimpleRole;
    disabled?: boolean;
    showDelete?: boolean;
    showFile?: boolean;
    selectedGlobalActions?: ActionsConfig; // ⭐ Nuevo: acciones seleccionadas globalmente
  }

  const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    showDelete: false,
    showFile: false,
    selectedGlobalActions: undefined,
  });

  const emit = defineEmits<{
    "update:modelValue": [value: SubModuleActions];
  }>();

  const actions = computed({
    get: () => props.modelValue,
    set: (value: SubModuleActions) => emit("update:modelValue", value),
  });

  // Obtener permisos permitidos según el rol
  const allowedActions = computed(() => {
    const rolePermissions = ROLE_DEFAULT_PERMISSIONS[props.role];
    const allowed: Array<keyof SubModuleActions> = [];

    // Solo incluir acciones que el rol permite por defecto
    if (rolePermissions.view) allowed.push("view");
    if (rolePermissions.create) allowed.push("create");
    if (rolePermissions.update) allowed.push("update");
    if (rolePermissions.delete && props.showDelete) allowed.push("delete");
    if (rolePermissions.file && props.showFile) allowed.push("file");

    return allowed;
  });

  // Configuración de todas las acciones posibles
  const allActionsConfig = [
    {
      key: "view" as keyof SubModuleActions,
      label: "Ver",
      icon: Eye,
    },
    {
      key: "create" as keyof SubModuleActions,
      label: "Crear",
      icon: Plus,
    },
    {
      key: "update" as keyof SubModuleActions,
      label: "Editar",
      icon: Edit,
    },
    {
      key: "delete" as keyof SubModuleActions,
      label: "Eliminar",
      icon: Trash2,
    },
    {
      key: "file" as keyof SubModuleActions,
      label: "Archivar",
      icon: FileText,
    },
  ];

  // Filtrar acciones según el rol, props y acciones globales seleccionadas
  const actionConfig = computed(() => {
    return allActionsConfig.filter((action) => {
      // 1. Solo mostrar acciones permitidas por el rol
      if (!allowedActions.value.includes(action.key)) {
        return false;
      }

      // 2. Si hay acciones globales seleccionadas, filtrar por ellas
      // "view" siempre debe estar disponible
      if (props.selectedGlobalActions && action.key !== "view") {
        // Verificar si la acción está seleccionada globalmente
        const globalActionValue = props.selectedGlobalActions[action.key];
        if (globalActionValue === false || globalActionValue === undefined) {
          return false; // No mostrar si no está seleccionada globalmente
        }
      }

      // 3. Filtrar delete y file según props
      if (action.key === "delete" && !props.showDelete) {
        return false;
      }
      if (action.key === "file" && !props.showFile) {
        return false;
      }

      return true;
    });
  });

  const isActionDisabled = (key: keyof SubModuleActions): boolean => {
    if (props.disabled) return true;

    // Si es Lector o Externo, solo 'view' está habilitado
    if ((props.role === "Lector" || props.role === "Externo") && key !== "view") {
      return true;
    }

    return false;
  };

  const toggleAction = (key: keyof SubModuleActions, value?: boolean) => {
    if (isActionDisabled(key)) return;

    // Si se pasa un valor, usarlo; si no, hacer toggle
    const newValue = value !== undefined ? value : !actions.value[key];

    const newActions = {
      ...actions.value,
      [key]: newValue,
    };

    // Si es Lector o Externo, asegurar que solo 'view' esté habilitado
    if (props.role === "Lector" || props.role === "Externo") {
      if (key !== "view" && newValue) {
        // No permitir activar otras acciones
        return;
      }
      // Si se desactiva 'view' en Lector/Externo, forzarlo a true
      if (key === "view" && !newValue) {
        newActions.view = true;
      } else {
        // Asegurar que otras acciones estén desactivadas
        if (newActions.create !== undefined) newActions.create = false;
        if (newActions.update !== undefined) newActions.update = false;
        if (newActions.delete !== undefined) newActions.delete = false;
        if (newActions.file !== undefined) newActions.file = false;
      }
    }

    actions.value = newActions;
  };
</script>

<template>
  <div class="action-checkboxes">
    <div class="action-checkboxes-grid">
      <div
        v-for="action in actionConfig"
        :key="action.key"
        class="action-checkbox-item"
        :class="{
          'action-checkbox-item-enabled': actions[action.key],
          'action-checkbox-item-disabled': isActionDisabled(action.key),
        }"
      >
        <Checkbox
          :model-value="actions[action.key]"
          :is-disabled="isActionDisabled(action.key)"
          @update:model-value="(value) => toggleAction(action.key, !!value)"
        />

        <component
          :is="action.icon"
          class="action-checkbox-icon"
          :style="{
            color: actions[action.key] ? 'var(--primary-700)' : 'var(--text-muted)',
          }"
        />

        <span
          class="action-checkbox-label"
          :style="{
            color: actions[action.key] ? 'var(--text-primary)' : 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)',
            fontSize: '0.75rem',
          }"
        >
          {{ action.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .action-checkboxes {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-checkboxes-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-light);
    border-radius: 0.5rem;
    background: white;
    transition: all 0.2s;
    cursor: pointer;
  }

  .action-checkbox-item:hover:not(.action-checkbox-item-disabled) {
    border-color: var(--primary-500);
    background: var(--primary-50);
  }

  .action-checkbox-item-enabled {
    border-color: var(--primary-700);
    background: var(--primary-50);
  }

  .action-checkbox-item-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .action-checkbox-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }

  .action-checkbox-label {
    font-weight: 500;
    user-select: none;
  }
</style>
