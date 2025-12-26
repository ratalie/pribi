<script setup lang="ts">
import {
  Shield,
  X,
  Info,
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  Edit3,
  RefreshCw,
  Trash2,
  FileText,
} from 'lucide-vue-next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
// Comentado temporalmente - no usado
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
import type { User } from '~/core/hexag/panel-administrativo/domain/entities/user.entity';
import type {
  UserFlowAccess,
  ActionType,
  FlowCode,
} from '~/core/hexag/panel-administrativo/domain/entities/permission.entity';
import {
  flowsConfig,
  actionsConfig,
  rolePermissionsConfig,
  getRoleBadgeColor,
  getActionColor,
  getUserPermissions,
} from '~/data/mockDataAdmin';

interface Props {
  isOpen: boolean;
  user: User;
  permissions: UserFlowAccess[];
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: 'close'): void;
  (e: 'save', permissions: UserFlowAccess[]): void;
}>();

// Estado local de permisos (copia editable)
const localPermissions = ref<UserFlowAccess[]>([]);
const expandedFlows = ref<FlowCode[]>([]);

// Sincronizar permisos cuando cambian
watch(
  () => props.permissions,
  (newPermissions) => {
    if (newPermissions.length > 0) {
      localPermissions.value = JSON.parse(JSON.stringify(newPermissions));
    }
  },
  { immediate: true, deep: true }
);

// Colores del rol
const roleColors = computed(() => getRoleBadgeColor(props.user.role.name));

// Acciones por defecto del rol
const roleDefaultActions = computed(
  () => rolePermissionsConfig[props.user.role.name]
);

// Toggle expansión de flujo
const toggleFlow = (flowCode: FlowCode) => {
  if (expandedFlows.value.includes(flowCode)) {
    expandedFlows.value = expandedFlows.value.filter((f) => f !== flowCode);
  } else {
    expandedFlows.value = [...expandedFlows.value, flowCode];
  }
};

// Toggle acción individual
const toggleAction = (
  flowCode: FlowCode,
  moduleCode: string,
  action: ActionType
) => {
  const flow = localPermissions.value.find((f) => f.code === flowCode);
  if (!flow) return;

  const module = flow.modules.find((m) => m.name === moduleCode);
  if (!module) return;

  if (module.actions.includes(action)) {
    module.actions = module.actions.filter((a) => a !== action);
  } else {
    module.actions = [...module.actions, action];
  }
};

// Toggle todas las acciones de un módulo
const toggleModuleAllActions = (flowCode: FlowCode, moduleCode: string) => {
  const flow = localPermissions.value.find((f) => f.code === flowCode);
  if (!flow) return;

  const module = flow.modules.find((m) => m.name === moduleCode);
  if (!module) return;

  // Si tiene todas las acciones del rol, quitar todas. Si no, agregar todas.
  const hasAllActions = roleDefaultActions.value.every((action) =>
    module.actions.includes(action)
  );
  module.actions = hasAllActions ? [] : [...roleDefaultActions.value];
};

// Restaurar permisos por defecto
const resetToDefault = () => {
  const defaultPermissions = getUserPermissions(props.user.id);
  localPermissions.value = JSON.parse(JSON.stringify(defaultPermissions));
};

// Guardar cambios
const handleSave = () => {
  emits('save', localPermissions.value);
};

// Obtener icono de acción
const getActionIcon = (action: ActionType) => {
  switch (action) {
    case 'read':
      return Eye;
    case 'write':
      return Edit3;
    case 'update':
      return RefreshCw;
    case 'delete':
      return Trash2;
    case 'file':
      return FileText;
  }
};
</script>

<template>
  <Dialog
    :open="isOpen"
    @update:open="(val) => !val && emits('close')"
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
                Editar Permisos
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
                  {{ user.email }}
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
                  {{ user.role.name }}
                </span>
              </div>
            </div>
          </div>

          <!-- Botón cerrar -->
          <button
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            @click="emits('close')"
          >
            <X
              class="w-5 h-5"
              :style="{ color: 'var(--text-muted)' }"
            />
          </button>
        </div>
      </DialogHeader>

      <!-- Banner Informativo -->
      <div
        class="mx-6 mt-4 p-4 rounded-lg flex items-start gap-3 flex-shrink-0"
        style="background-color: #EFF6FF; border-left: 4px solid #3B82F6"
      >
        <Info
          class="w-5 h-5 flex-shrink-0"
          style="color: #3B82F6"
        />
        <div>
          <p
            class="text-sm mb-1"
            style="color: #1E40AF; font-weight: 500"
          >
            Permisos por Rol: {{ user.role.name }}
          </p>
          <p
            class="text-xs"
            style="color: #1E40AF"
          >
            Este rol tiene acceso por defecto a:
            {{
              roleDefaultActions
                .map((a) => actionsConfig.find((ac) => ac.code === a)?.name)
                .join(', ')
            }}
          </p>
        </div>
      </div>

      <!-- Leyenda de Acciones -->
      <div
        class="mx-6 mt-4 p-4 bg-gray-50 rounded-lg flex-shrink-0"
        :style="{ fontFamily: 'var(--font-secondary)' }"
      >
        <p
          class="text-xs mb-3"
          :style="{
            color: 'var(--text-muted)',
            fontWeight: 600,
          }"
        >
          LEYENDA DE ACCIONES
        </p>
        <div class="flex flex-wrap gap-4">
          <div
            v-for="action in actionsConfig"
            :key="action.code"
            class="flex items-center gap-2"
          >
            <!-- Color indicator -->
            <div
              class="w-3 h-3 rounded"
              :style="{ backgroundColor: action.color }"
            />
            <span
              class="text-xs"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              {{ action.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- Contenido con Scroll -->
      <div
        class="flex-1 overflow-y-auto px-6 py-4"
        :style="{ fontFamily: 'var(--font-secondary)' }"
      >
        <div class="space-y-3">
          <div
            v-for="flow in flowsConfig"
            :key="flow.code"
            class="bg-white border rounded-xl overflow-hidden"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <!-- Flow Header - Clickeable para expandir/contraer -->
            <button
              class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              @click="toggleFlow(flow.code)"
            >
              <div class="flex items-center gap-3">
                <!-- Icono chevron -->
                <component
                  :is="expandedFlows.includes(flow.code) ? ChevronDown : ChevronRight"
                  class="w-5 h-5"
                  :style="{ color: 'var(--text-muted)' }"
                />

                <div class="text-left">
                  <!-- Nombre del flujo -->
                  <p
                    class="text-sm"
                    :style="{
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                    }"
                  >
                    {{ flow.name }}
                  </p>
                  <!-- Descripción -->
                  <p
                    class="text-xs mt-0.5"
                    :style="{
                      color: 'var(--text-muted)',
                    }"
                  >
                    {{ flow.description }}
                  </p>
                </div>
              </div>

              <!-- Badge con cantidad de módulos -->
              <span
                class="text-xs px-2 py-1 rounded bg-gray-100"
                :style="{
                  color: 'var(--text-muted)',
                }"
              >
                {{ flow.modules.length }} módulos
              </span>
            </button>

            <!-- Módulos (solo si está expandido) -->
            <div
              v-if="expandedFlows.includes(flow.code)"
              class="border-t"
              :style="{ borderColor: 'var(--border-light)' }"
            >
              <div
                v-for="module in flow.modules"
                :key="module.code"
                class="px-6 py-4 border-b"
                :style="{ borderColor: 'var(--border-light)' }"
              >
                <!-- Module Header -->
                <div class="flex items-center justify-between mb-3">
                  <div>
                    <p
                      class="text-sm"
                      :style="{
                        color: 'var(--text-primary)',
                        fontWeight: 500,
                      }"
                    >
                      {{ module.name }}
                    </p>
                    <p
                      class="text-xs mt-0.5"
                      :style="{
                        color: 'var(--text-muted)',
                      }"
                    >
                      {{ module.description }}
                    </p>
                  </div>

                  <!-- Botón "Marcar todo" / "Desmarcar todo" -->
                  <button
                    class="text-xs px-3 py-1 rounded hover:bg-gray-100 transition-colors"
                    :style="{
                      color: 'var(--primary-700)',
                      fontWeight: 500,
                    }"
                    @click="toggleModuleAllActions(flow.code, module.code)"
                  >
                    {{
                      (() => {
                        const flowPerms = localPermissions.find(
                          (p) => p.code === flow.code
                        );
                        const modulePerms = flowPerms?.modules.find(
                          (m) => m.name === module.code
                        );
                        return modulePerms &&
                          roleDefaultActions.every((action) =>
                            modulePerms.actions.includes(action)
                          )
                          ? 'Desmarcar todo'
                          : 'Marcar todo';
                      })()
                    }}
                  </button>
                </div>

                <!-- Actions Buttons -->
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="actionCode in roleDefaultActions"
                    :key="actionCode"
                    class="px-3 py-2 rounded-lg border transition-all flex items-center gap-2"
                    :style="
                      (() => {
                        const flowPerms = localPermissions.find(
                          (p) => p.code === flow.code
                        );
                        const modulePerms = flowPerms?.modules.find(
                          (m) => m.name === module.code
                        );
                        const isActive = modulePerms?.actions.includes(
                          actionCode
                        ) || false;
                        const color = getActionColor(actionCode);
                        return {
                          backgroundColor: isActive ? `${color}15` : 'white',
                          borderColor: isActive ? color : 'var(--border-light)',
                          color: isActive ? color : 'var(--text-muted)',
                        };
                      })()
                    "
                    @click="toggleAction(flow.code, module.code, actionCode)"
                  >
                    <component
                      :is="getActionIcon(actionCode)"
                      class="w-4 h-4"
                    />
                    <span
                      class="text-xs"
                      :style="{ fontWeight: 500 }"
                    >
                      {{
                        actionsConfig.find((a) => a.code === actionCode)?.name
                      }}
                    </span>
                    <Check
                      v-if="
                        (() => {
                          const flowPerms = localPermissions.find(
                            (p) => p.code === flow.code
                          );
                          const modulePerms = flowPerms?.modules.find(
                            (m) => m.name === module.code
                          );
                          return modulePerms?.actions.includes(actionCode);
                        })()
                      "
                      class="w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer con Acciones -->
      <div
        class="px-6 py-4 border-t flex items-center justify-between flex-shrink-0"
        :style="{ borderColor: 'var(--border-light)' }"
      >
        <!-- Botón restaurar -->
        <button
          class="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
          :style="{
            borderColor: 'var(--border-light)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-secondary)',
          }"
          @click="resetToDefault"
        >
          Restaurar permisos por defecto
        </button>

        <!-- Botones cancelar y guardar -->
        <div class="flex items-center gap-3">
          <button
            class="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
            :style="{
              borderColor: 'var(--border-light)',
              fontFamily: 'var(--font-secondary)',
            }"
            @click="emits('close')"
          >
            Cancelar
          </button>
          <button
            class="px-6 py-2 rounded-lg hover:shadow-md transition-all"
            :style="{
              backgroundColor: 'var(--primary-700)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-secondary)',
              fontWeight: 500,
            }"
            @click="handleSave"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

