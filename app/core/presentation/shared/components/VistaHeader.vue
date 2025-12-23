<template>
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-[1600px] mx-auto px-8 py-8">
      <div class="flex items-center justify-between">
        <!-- Contenido Izquierdo: Icono + Título + Descripción -->
        <div class="flex items-center gap-4">
          <!-- Slot para contenido personalizado, o usar props estándar -->
          <slot name="left">
            <template v-if="icon || title || description">
              <div
                v-if="icon"
                class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style="
                  background: linear-gradient(135deg, var(--primary-700), var(--primary-500));
                "
              >
                <component :is="icon" class="w-7 h-7 text-white" />
              </div>
              <VistaHeaderTitle
                v-if="title || description"
                :title="title"
                :subtitle="description"
              />
            </template>
          </slot>
        </div>

        <!-- Contenido Derecho: Acciones -->
        <div class="flex items-center gap-3">
          <slot name="right"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import VistaHeaderTitle from "./VistaHeaderTitle.vue";

  interface Props {
    /** Icono a mostrar (componente de lucide-vue-next) */
    icon?: any;
    /** Título del header */
    title?: string;
    /** Descripción del header */
    description?: string;
  }

  withDefaults(defineProps<Props>(), {
    icon: undefined,
    title: undefined,
    description: undefined,
  });
</script>




