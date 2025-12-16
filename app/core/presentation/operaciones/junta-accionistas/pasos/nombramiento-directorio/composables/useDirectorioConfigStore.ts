import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * Store para compartir la configuración del directorio entre páginas
 */
export const useDirectorioConfigStore = defineStore("directorioConfig", () => {
  const cantidadDirectores = ref<string>("");
  const duracionDirectorio = ref<string>("");
  const fechaInicio = ref<string>("");
  const fechaFin = ref<string>("");

  function setCantidadDirectores(value: string) {
    cantidadDirectores.value = value;
  }

  function setDuracionDirectorio(value: string) {
    duracionDirectorio.value = value;
  }

  function setFechaInicio(value: string) {
    fechaInicio.value = value;
  }

  function setFechaFin(value: string) {
    fechaFin.value = value;
  }

  return {
    cantidadDirectores,
    duracionDirectorio,
    fechaInicio,
    fechaFin,
    setCantidadDirectores,
    setDuracionDirectorio,
    setFechaInicio,
    setFechaFin,
  };
});
