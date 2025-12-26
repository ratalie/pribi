/**
 * Composable para gestionar el estado del sheet del sidebar derecho
 * 
 * Controla la apertura/cierre del sheet cuando isMobileLayout es true
 */

import { ref, watch } from "vue";
import { useJuntasResponsive } from "./useJuntasResponsive";

export function useJuntasRightSidebarSheet() {
  const { isMobileLayout } = useJuntasResponsive();
  const isSheetOpen = ref(false);

  // Cerrar el sheet automáticamente cuando se sale del modo mobile
  watch(isMobileLayout, (newValue) => {
    if (!newValue) {
      isSheetOpen.value = false;
    }
  });

  const openSheet = () => {
    if (isMobileLayout.value) {
      isSheetOpen.value = true;
    }
  };

  const closeSheet = () => {
    isSheetOpen.value = false;
  };

  const toggleSheet = () => {
    if (isMobileLayout.value) {
      isSheetOpen.value = !isSheetOpen.value;
    }
  };

  return {
    isSheetOpen,
    openSheet,
    closeSheet,
    toggleSheet,
  };
}


