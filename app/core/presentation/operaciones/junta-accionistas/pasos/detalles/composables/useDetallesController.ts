/**
 * Controller: Detalles de Junta
 */

import { onMounted, computed } from "vue";
import { useDetallesStore } from "../stores/detalles.store";

export function useDetallesController(juntaId: Ref<string>) {
  const store = useDetallesStore();

  onMounted(async () => {
    if (juntaId.value) {
      await store.loadDetalles(juntaId.value);
    }
  });

  const handleNext = async () => {
    if (!juntaId.value) {
      throw new Error("No hay junta ID");
    }

    await store.saveDetalles(juntaId.value);
  };

  return {
    // Estado
    tipoJunta: computed(() => store.tipoJunta),
    modoRealizacion: computed(() => store.modoRealizacion),
    fechaJunta: computed(() => store.fechaJunta),
    horaJunta: computed(() => store.horaJunta),
    lugarJunta: computed(() => store.lugarJunta),
    enlaceVirtual: computed(() => store.enlaceVirtual),
    observaciones: computed(() => store.observaciones),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    isVirtual: computed(() => store.isVirtual),
    isPresencial: computed(() => store.isPresencial),
    
    // Actions
    handleNext,
  };
}


