/**
 * Composable para detectar el breakpoint responsive del layout de juntas
 * 
 * Detecta cuando el ancho de pantalla es menor a 1280px
 * para aplicar cambios en el layout (sidebar derecho como sheet, sidebar izquierdo simplificado)
 */

import { computed, onMounted, onUnmounted, ref } from "vue";

const BREAKPOINT = 1280;

export function useJuntasResponsive() {
  // Inicializar con el ancho actual si estamos en el cliente
  const windowWidth = ref<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  
  const isMobileLayout = computed(() => windowWidth.value < BREAKPOINT);

  const updateWidth = () => {
    if (typeof window !== "undefined") {
      windowWidth.value = window.innerWidth;
    }
  };

  onMounted(() => {
    if (typeof window !== "undefined") {
      updateWidth();
      window.addEventListener("resize", updateWidth);
    }
  });

  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", updateWidth);
    }
  });

  return {
    isMobileLayout,
    windowWidth,
  };
}


