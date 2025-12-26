<script setup lang="ts">
  import { ref, computed } from "vue";
  import { FolderOpen, ChevronRight } from "lucide-vue-next";
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import SubModuleItem from "./molecules/SubModuleItem.vue";
  import type {
    ModuleConfig,
    SubModuleConfig,
    SimpleRole,
    ActionsConfig,
  } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";
  import { AVAILABLE_AREAS } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";
  import {
    getSubmodulesForArea,
    createSubmoduleConfigFromDefinition,
  } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/utils/submodule-definitions.utils";

  interface Props {
    modelValue: ModuleConfig[];
    mode?: "simple" | "advanced";
    disabled?: boolean;
    role?: SimpleRole;
    selectedGlobalActions?: ActionsConfig; // ⭐ Nuevo: acciones seleccionadas globalmente
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "simple",
    disabled: false,
    role: "Editor",
  });

  const emit = defineEmits<{
    "update:modelValue": [value: ModuleConfig[]];
    showAdvanced: [];
  }>();

  const modules = computed({
    get: () => props.modelValue,
    set: (value: ModuleConfig[]) => emit("update:modelValue", value),
  });

  const areaLabels: Record<string, string> = {
    REGISTROS: "Registros",
    OPERACIONES: "Operaciones",
    REPOSITORIO_AI: "Repositorio AI",
    SUNAT: "SUNAT",
    ARCHIVES: "Archivos",
  };

  const areaDescriptions: Record<string, string> = {
    REGISTROS: "Gestión de sociedades, accionistas y directores",
    OPERACIONES: "Juntas de accionistas y operaciones corporativas",
    REPOSITORIO_AI: "Repositorio de documentos con inteligencia artificial",
    SUNAT: "Integración con SUNAT",
    ARCHIVES: "Gestión de archivos y documentos",
  };

  const toggleModule = (area: string) => {
    if (props.disabled) return;

    const moduleIndex = modules.value.findIndex((m) => m.area === area);
    if (moduleIndex !== -1) {
      const newModules = [...modules.value];
      const currentModule = newModules[moduleIndex];
      if (!currentModule) return;

      newModules[moduleIndex] = {
        ...currentModule,
        enabled: !currentModule.enabled,
        // Asegurar que tenga sub-módulos inicializados
        submodules:
          currentModule.submodules && currentModule.submodules.length > 0
            ? currentModule.submodules
            : getSubmodulesForArea(area).map((def) =>
                createSubmoduleConfigFromDefinition(def, false)
              ),
      };
      modules.value = newModules;
    } else {
      // Agregar nuevo módulo con sub-módulos inicializados
      const definitions = getSubmodulesForArea(area);
      const submodules = definitions.map((def) =>
        createSubmoduleConfigFromDefinition(def, false)
      );
      modules.value = [
        ...modules.value,
        {
          area,
          enabled: true,
          submodules,
        },
      ];
    }
  };

  const isModuleEnabled = (area: string): boolean => {
    const module = modules.value.find((m) => m.area === area);
    return module?.enabled ?? false;
  };

  // Estado de expansión de áreas
  const expandedAreas = ref<Set<string>>(new Set());

  const toggleAreaExpansion = (area: string) => {
    if (expandedAreas.value.has(area)) {
      expandedAreas.value.delete(area);
    } else {
      expandedAreas.value.add(area);

      // Asegurar que el módulo tenga sub-módulos inicializados cuando se expande
      const moduleIndex = modules.value.findIndex((m) => m.area === area);
      if (moduleIndex !== -1) {
        const module = modules.value[moduleIndex];
        if (module && (!module.submodules || module.submodules.length === 0)) {
          const definitions = getSubmodulesForArea(area);
          const newModules = [...modules.value];
          const currentModule = newModules[moduleIndex];
          if (currentModule) {
            newModules[moduleIndex] = {
              area: currentModule.area,
              enabled: currentModule.enabled,
              submodules: definitions.map((def) =>
                createSubmoduleConfigFromDefinition(def, false)
              ),
            };
            modules.value = newModules;
          }
        }
      }
    }
  };

  const isAreaExpanded = (area: string): boolean => {
    return expandedAreas.value.has(area);
  };

  // Obtener sub-módulos para un área
  const getSubmodulesForModule = (area: string): SubModuleConfig[] => {
    const module = modules.value.find((m) => m.area === area);

    // Si el módulo no existe o no tiene sub-módulos inicializados, crearlos desde definiciones
    if (!module || !module.submodules || module.submodules.length === 0) {
      const definitions = getSubmodulesForArea(area);
      return definitions.map((def) => createSubmoduleConfigFromDefinition(def, false));
    }

    return module.submodules;
  };

  // Actualizar sub-módulo
  const updateSubmodule = (area: string, updatedSubmodule: SubModuleConfig) => {
    const moduleIndex = modules.value.findIndex((m) => m.area === area);
    if (moduleIndex === -1) return;

    const newModules = [...modules.value];
    const module = newModules[moduleIndex];
    if (!module) return;

    const submoduleIndex = module.submodules.findIndex((s) => s.key === updatedSubmodule.key);

    if (submoduleIndex === -1) {
      // Agregar nuevo sub-módulo
      module.submodules.push(updatedSubmodule);
    } else {
      // Actualizar sub-módulo existente
      module.submodules[submoduleIndex] = updatedSubmodule;
    }

    // Emitir actualización
    modules.value = newModules;
  };
</script>

<template>
  <div class="module-selector">
    <label
      class="module-selector-label"
      :style="{
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-primary)',
        fontWeight: 600,
      }"
    >
      ¿Qué módulos puede acceder?
    </label>

    <div class="module-selector-list">
      <div
        v-for="area in AVAILABLE_AREAS"
        :key="area"
        class="module-item"
        :class="{
          'module-item-enabled': isModuleEnabled(area),
          'module-item-disabled': disabled,
        }"
      >
        <div class="module-item-content">
          <Checkbox
            :model-value="isModuleEnabled(area)"
            :is-disabled="disabled"
            @update:model-value="
              (value) => {
                if (value && !isModuleEnabled(area)) {
                  toggleModule(area);
                } else if (!value && isModuleEnabled(area)) {
                  toggleModule(area);
                }
              }
            "
          />

          <div class="module-item-icon">
            <FolderOpen
              class="module-icon"
              :style="{
                color: isModuleEnabled(area) ? 'var(--primary-700)' : 'var(--text-muted)',
              }"
            />
          </div>

          <div class="module-item-text">
            <h4
              class="module-item-title"
              :style="{
                color: isModuleEnabled(area) ? 'var(--text-primary)' : 'var(--text-muted)',
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              {{ areaLabels[area] || area }}
            </h4>
            <p
              class="module-item-description"
              :style="{
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              {{ areaDescriptions[area] || "Módulo del sistema" }}
            </p>
          </div>

          <!-- Icono de expansión -->
          <ChevronRight
            v-if="isModuleEnabled(area)"
            class="module-expand-icon"
            :class="{ expanded: isAreaExpanded(area) }"
            :style="{
              color: isModuleEnabled(area) ? 'var(--primary-700)' : 'var(--text-muted)',
            }"
            @click.stop="toggleAreaExpansion(area)"
          />
        </div>

        <!-- Sub-módulos (cuando área está expandida y habilitada) -->
        <Transition name="expand">
          <div
            v-if="isAreaExpanded(area) && isModuleEnabled(area)"
            class="submodules-container"
          >
            <SubModuleItem
              v-for="submodule in getSubmodulesForModule(area)"
              :key="submodule.key"
              :submodule="submodule"
              :disabled="disabled"
              :role="role"
              :selected-global-actions="selectedGlobalActions"
              @update:submodule="updateSubmodule(area, $event)"
            />
          </div>
        </Transition>
      </div>
    </div>

    <div v-if="mode === 'simple'" class="module-selector-footer">
      <button
        type="button"
        class="module-advanced-button"
        :style="{
          color: 'var(--primary-700)',
          fontFamily: 'var(--font-secondary)',
        }"
        @click="$emit('showAdvanced')"
      >
        Configuración Avanzada
        <ChevronRight class="module-advanced-icon" />
      </button>
    </div>
  </div>
</template>

<style scoped>
  .module-selector {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .module-selector-label {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .module-selector-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .module-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 2px solid var(--border-light);
    border-radius: 0.75rem;
    background: white;
    transition: all 0.2s;
  }

  .module-item:hover:not(.module-item-disabled) {
    border-color: var(--primary-500);
  }

  .module-item-enabled {
    border-color: var(--primary-700);
    background: var(--primary-50);
  }

  .module-item-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .module-item-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }

  .module-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .module-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .module-item-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .module-item-title {
    font-size: 0.875rem;
    margin: 0;
  }

  .module-item-description {
    font-size: 0.75rem;
    margin: 0;
    line-height: 1.4;
  }

  .module-selector-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 0.5rem;
  }

  .module-advanced-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.5rem;
    transition: opacity 0.2s;
  }

  .module-advanced-button:hover {
    opacity: 0.8;
  }

  .module-advanced-icon {
    width: 1rem;
    height: 1rem;
  }

  .module-expand-icon {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.2s;
    cursor: pointer;
    flex-shrink: 0;
  }

  .module-expand-icon.expanded {
    transform: rotate(90deg);
  }

  .submodules-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 0.75rem;
    padding-left: 2rem;
    border-left: 2px solid var(--primary-200);
  }

  /* Transiciones para sub-módulos */
  .expand-enter-active,
  .expand-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .expand-enter-from,
  .expand-leave-to {
    opacity: 0;
    max-height: 0;
    margin-top: 0;
    padding-top: 0;
    padding-bottom: 0;
  }

  .expand-enter-to,
  .expand-leave-from {
    opacity: 1;
    max-height: 2000px;
  }

  /* Responsive */
  @media (min-width: 1280px) and (max-width: 1439px) {
    .module-selector-label {
      font-size: 0.9375rem;
    }
    .module-item-title {
      font-size: 0.9375rem;
    }
    .module-item-description {
      font-size: 0.8125rem;
    }
  }

  @media (min-width: 1440px) {
    .module-selector-label {
      font-size: 1rem;
    }
    .module-item-title {
      font-size: 1rem;
    }
    .module-item-description {
      font-size: 0.875rem;
    }
  }
</style>
