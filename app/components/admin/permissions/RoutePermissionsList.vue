<script setup lang="ts">
import { Check, ChevronDown, ChevronRight } from 'lucide-vue-next';
import { MODULE_DISPLAY_NAMES, type RouteModule } from '~/config/routes/permissions-map';
import type { RoutePermissionConfig } from '~/config/routes/permissions-map';

interface Props {
  routesByModule: Record<RouteModule, RoutePermissionConfig[]>;
  selectedRoutes: string[];
  isLoading?: boolean;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  (e: 'toggle-route', route: string): void;
  (e: 'select-all-module', module: RouteModule): void;
  (e: 'select-all'): void;
  (e: 'deselect-all'): void;
}>();

const expandedModules = ref<RouteModule[]>(['REGISTROS']);

const toggleModule = (module: RouteModule) => {
  if (expandedModules.value.includes(module)) {
    expandedModules.value = expandedModules.value.filter((m) => m !== module);
  } else {
    expandedModules.value = [...expandedModules.value, module];
  }
};

const isRouteSelected = (route: string) => {
  return props.selectedRoutes.includes(route);
};

const areAllRoutesSelectedInModule = (module: RouteModule) => {
  const moduleRoutes = props.routesByModule[module] || [];
  return moduleRoutes.length > 0 && moduleRoutes.every((r) => isRouteSelected(r.route));
};
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h3
          class="text-sm font-medium mb-1"
          :style="{ color: 'var(--text-primary)' }"
        >
          Permisos por Ruta
        </h3>
        <p
          class="text-xs"
          :style="{ color: 'var(--text-muted)' }"
        >
          Selecciona las rutas a las que el usuario tendrá acceso
        </p>
      </div>
      <div class="flex gap-2">
        <button
          class="text-xs px-3 py-1 rounded hover:bg-gray-100 transition-colors"
          :style="{ color: 'var(--primary-700)' }"
          @click="emits('select-all')"
        >
          Seleccionar todas
        </button>
        <button
          class="text-xs px-3 py-1 rounded hover:bg-gray-100 transition-colors"
          :style="{ color: 'var(--text-muted)' }"
          @click="emits('deselect-all')"
        >
          Deseleccionar todas
        </button>
      </div>
    </div>

    <div class="space-y-2">
      <div
        v-for="(routes, module) in routesByModule"
        :key="module"
        class="border rounded-lg overflow-hidden"
        :style="{ borderColor: 'var(--border-light)' }"
      >
        <!-- Module Header -->
        <button
          class="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          @click="toggleModule(module as RouteModule)"
        >
          <div class="flex items-center gap-3">
            <component
              :is="expandedModules.includes(module as RouteModule) ? ChevronDown : ChevronRight"
              class="w-5 h-5"
              :style="{ color: 'var(--text-muted)' }"
            />
            <div class="text-left">
              <p
                class="text-sm font-medium"
                :style="{ color: 'var(--text-primary)' }"
              >
                {{ MODULE_DISPLAY_NAMES[module as RouteModule] }}
              </p>
              <p
                class="text-xs mt-0.5"
                :style="{ color: 'var(--text-muted)' }"
              >
                {{ routes.length }} rutas
              </p>
            </div>
          </div>

          <button
            class="text-xs px-3 py-1 rounded hover:bg-gray-100 transition-colors"
            :style="{ color: 'var(--primary-700)' }"
            @click.stop="emits('select-all-module', module as RouteModule)"
          >
            {{ areAllRoutesSelectedInModule(module as RouteModule) ? 'Deseleccionar' : 'Seleccionar todas' }}
          </button>
        </button>

        <!-- Routes List -->
        <div
          v-if="expandedModules.includes(module as RouteModule)"
          class="border-t"
          :style="{ borderColor: 'var(--border-light)' }"
        >
          <div
            v-for="routeConfig in routes"
            :key="routeConfig.route"
            class="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors flex items-center gap-3"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <button
              class="flex items-center gap-3 flex-1 text-left"
              @click="emits('toggle-route', routeConfig.route)"
            >
              <div
                class="w-5 h-5 rounded border flex items-center justify-center transition-colors"
                :style="{
                  borderColor: isRouteSelected(routeConfig.route) ? 'var(--primary-700)' : 'var(--border-light)',
                  backgroundColor: isRouteSelected(routeConfig.route) ? 'var(--primary-700)' : 'white',
                }"
              >
                <Check
                  v-if="isRouteSelected(routeConfig.route)"
                  class="w-3 h-3 text-white"
                />
              </div>
              <div class="flex-1">
                <p
                  class="text-sm"
                  :style="{ color: 'var(--text-primary)' }"
                >
                  {{ routeConfig.displayName }}
                </p>
                <p
                  class="text-xs mt-0.5"
                  :style="{ color: 'var(--text-muted)' }"
                >
                  {{ routeConfig.route }}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

