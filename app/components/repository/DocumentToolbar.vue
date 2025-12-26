<template>
  <div
    class="flex items-center justify-between bg-layout-gray-750 border-b border-layout-gray-700 px-6 py-3 w-full max-w-full"
  >
    <div class="flex items-center justify-center flex-1">
      <div class="flex items-center gap-2">
        <!-- Botón Página Anterior -->
        <button
          class="p-1 rounded transition-colors text-white hover:bg-layout-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="$emit('previous-page')"
          :disabled="currentPage <= 1"
          title="Página anterior"
        >
          <Icon icon="heroicons:chevron-left" width="16" height="16" />
        </button>

        <!-- Paginación -->
        <input
          v-model="currentPageInput"
          type="number"
          min="1"
          :max="totalPages"
          class="w-12 h-6 bg-black text-white text-center text-sm rounded border-none focus:outline-none focus:ring-1 focus:ring-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          @blur="handlePageChange"
          @keyup.enter="handlePageChange"
        />
        <span class="text-sm text-white font-medium">/ {{ totalPages }}</span>

        <!-- Botón Página Siguiente -->
        <button
          class="p-1 rounded transition-colors text-white hover:bg-layout-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="$emit('next-page')"
          :disabled="currentPage >= totalPages"
          title="Página siguiente"
        >
          <Icon icon="heroicons:chevron-right" width="16" height="16" />
        </button>

        <!-- Separador -->
        <div class="w-px h-6 bg-layout-gray-600 mx-3"></div>

        <!-- Zoom -->
        <button
          class="p-1 rounded transition-colors text-white hover:bg-layout-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="$emit('zoom-out')"
          :disabled="zoom <= 50"
        >
          <Icon icon="heroicons:minus" width="16" height="16" />
        </button>
        <input
          v-model="zoomInput"
          type="number"
          min="50"
          max="200"
          class="w-16 h-6 bg-black text-white text-center text-sm rounded border-none focus:outline-none focus:ring-1 focus:ring-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          @blur="handleZoomChange"
          @keyup.enter="handleZoomChange"
        />
        <span class="text-sm text-white font-medium">%</span>
        <button
          class="p-1 rounded transition-colors text-white hover:bg-layout-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="$emit('zoom-in')"
          :disabled="zoom >= 200"
        >
          <Icon icon="heroicons:plus" width="16" height="16" />
        </button>

        <!-- Separador -->
        <div class="w-px h-6 bg-layout-gray-600 mx-3"></div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <button
        class="p-2 rounded-lg transition-colors text-white hover:bg-layout-primary-400 bg-layout-primary-500"
        @click="$emit('toggle-sidebar')"
        v-if="!showSidebar"
      >
        <Icon icon="heroicons:chevron-left" width="20" height="20" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from "@iconify/vue";
  import { ref, watch } from "vue";

  interface Props {
    currentPage: number;
    totalPages: number;
    zoom: number;
    showSidebar: boolean;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    "toggle-sidebar": [];
    "zoom-in": [];
    "zoom-out": [];
    "previous-page": [];
    "next-page": [];
    "page-change": [page: number];
    "zoom-change": [zoom: number];
  }>();

  // Inputs editables
  const currentPageInput = ref(props.currentPage.toString());
  const zoomInput = ref(props.zoom.toString());

  // Sincronizar inputs con props
  watch(
    () => props.currentPage,
    (newPage) => {
      currentPageInput.value = newPage.toString();
    }
  );

  watch(
    () => props.zoom,
    (newZoom) => {
      zoomInput.value = newZoom.toString();
    }
  );

  // Manejar cambio de página
  function handlePageChange() {
    const page = parseInt(currentPageInput.value);
    if (page >= 1 && page <= props.totalPages) {
      emit("page-change", page);
    } else {
      // Restaurar valor válido si es inválido
      currentPageInput.value = props.currentPage.toString();
    }
  }

  // Manejar cambio de zoom
  function handleZoomChange() {
    const zoom = parseInt(zoomInput.value);
    if (zoom >= 50 && zoom <= 200) {
      emit("zoom-change", zoom);
    } else {
      // Restaurar valor válido si es inválido
      zoomInput.value = props.zoom.toString();
    }
  }
</script>

