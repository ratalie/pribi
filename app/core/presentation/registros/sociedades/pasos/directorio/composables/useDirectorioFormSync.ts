import type { Ref } from "vue";
import { watch } from "vue";
import type { DirectorioDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application";
import type { DirectorConfig } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/entities/director.entity";
import type { TypeOption } from "~/types/TypeOptions";

/**
 * Tipo para el formulario UI local
 */
export interface DirectorioFormUI {
  cantidadDirectores: string;
  cantidadPersonalizado: boolean;
  minimoDirectores: string;
  maximoDirectores: string;
  duracionDirectorio: string;
  fechaInicioDirectorio: string;
  fechaFinDirectorio: string;
  quorumMinimo: string;
  quorumMayoria: string;
  nombraPresidente: "opcion-a" | "opcion-b";
  ejerceSecretaria: "opcion-a" | "opcion-b";
  reeleccionDirectores: boolean;
  presideJuntas: boolean;
  votoDirimente: boolean;
  presidenteDirectorio: string;
}

interface UseDirectorioFormSyncOptions {
  /**
   * Formulario UI local (formato string para inputs)
   */
  form: Ref<DirectorioFormUI>;
  /**
   * DTO reactivo del directorio (formato backend)
   */
  directorioForm: DirectorioDTO;
  /**
   * Ref para sincronizar el presidente del directorio
   */
  presidenteDirectorioRef: Ref<string>;
  /**
   * Lista de directores (para validación del presidente)
   */
  directores: Ref<DirectorConfig[]>;
  /**
   * Opciones de presidente disponibles
   */
  presidenteOptions: Ref<TypeOption[]>;
}

/**
 * Composable para sincronizar el formulario UI con el DTO del directorio
 * Maneja la sincronización bidireccional entre el formulario local y el DTO
 */
export function useDirectorioFormSync(options: UseDirectorioFormSyncOptions) {
  const { form, directorioForm, presidenteDirectorioRef, directores, presidenteOptions } =
    options;

  // ==================== Sincronización DTO → UI ====================

  watch(
    () => directorioForm.cantidadDirectores,
    (val) => {
      // Si hay un valor válido (>0), usarlo; si no, usar 3 por defecto
      form.value.cantidadDirectores = val && val > 0 ? String(val) : "3";
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.conteoPersonalizado,
    (val) => {
      form.value.cantidadPersonalizado = val;
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.minimoDirectores,
    (val) => {
      form.value.minimoDirectores = val ? String(val) : "3";
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.maximoDirectores,
    (val) => {
      form.value.maximoDirectores = val ? String(val) : "3";
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.periodo,
    (val) => {
      form.value.duracionDirectorio = val || "";
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.inicioMandato,
    (val) => {
      form.value.fechaInicioDirectorio = val || "";
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.finMandato,
    (val) => {
      form.value.fechaFinDirectorio = val || "";
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.quorumMinimo,
    (val) => {
      form.value.quorumMinimo = String(val || "");
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.mayoria,
    (val) => {
      form.value.quorumMayoria = String(val || "");
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.presidenteDesignado,
    (val) => {
      form.value.nombraPresidente = val ? "opcion-a" : "opcion-b";
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.secretarioAsignado,
    (val) => {
      form.value.ejerceSecretaria = val ? "opcion-a" : "opcion-b";
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.reeleccionPermitida,
    (val) => {
      form.value.reeleccionDirectores = val;
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.presidentePreside,
    (val) => {
      form.value.presideJuntas = val;
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.presidenteDesempata,
    (val) => {
      form.value.votoDirimente = val;
    },
    { immediate: true }
  );

  watch(
    () => directorioForm.presidenteId,
    (val) => {
      console.debug("[useDirectorioFormSync] watch directorioForm.presidenteId", {
        val,
        formValue: form.value.presidenteDirectorio,
        presidenteDirectorioRefValue: presidenteDirectorioRef.value,
      });
      const presidenteId = val || "";
      form.value.presidenteDirectorio = presidenteId;
      presidenteDirectorioRef.value = presidenteId;
      console.debug("[useDirectorioFormSync] watch directorioForm.presidenteId:done", {
        formValue: form.value.presidenteDirectorio,
        presidenteDirectorioRefValue: presidenteDirectorioRef.value,
      });
    },
    { immediate: true }
  );

  // ==================== Sincronización UI → DTO ====================

  watch(
    () => form.value.cantidadDirectores,
    (val) => {
      // Si está vacío o es 0, usar 3 por defecto; si no, convertir a número
      const numValue = Number(val);
      directorioForm.cantidadDirectores = numValue && numValue > 0 ? numValue : 3;
    },
    { immediate: true }
  );

  watch(
    () => form.value.cantidadPersonalizado,
    (val) => {
      directorioForm.conteoPersonalizado = val;
      // Cuando se activa cantidadPersonalizado, asegurar valores por defecto
      if (val) {
        if (!form.value.minimoDirectores || form.value.minimoDirectores.trim() === "") {
          form.value.minimoDirectores = "3";
        }
        if (!form.value.maximoDirectores || form.value.maximoDirectores.trim() === "") {
          form.value.maximoDirectores = "3";
        }
        // Asegurar que el DTO tenga los valores
        directorioForm.minimoDirectores =
          form.value.minimoDirectores && form.value.minimoDirectores.trim() !== ""
            ? Number(form.value.minimoDirectores)
            : 3;
        directorioForm.maximoDirectores =
          form.value.maximoDirectores && form.value.maximoDirectores.trim() !== ""
            ? Number(form.value.maximoDirectores)
            : 3;
      }
    }
  );

  watch(
    () => form.value.minimoDirectores,
    (val) => {
      // Si hay un valor, convertirlo a número, si no, usar el valor por defecto 3
      // Solo establecer si cantidadPersonalizado está activo
      if (form.value.cantidadPersonalizado) {
        directorioForm.minimoDirectores = val && val.trim() !== "" ? Number(val) : 3;
      }
    }
  );

  watch(
    () => form.value.maximoDirectores,
    (val) => {
      // Si hay un valor, convertirlo a número, si no, usar el valor por defecto 3
      // Solo establecer si cantidadPersonalizado está activo
      if (form.value.cantidadPersonalizado) {
        directorioForm.maximoDirectores = val && val.trim() !== "" ? Number(val) : 3;
      }
    }
  );

  watch(
    () => form.value.duracionDirectorio,
    (val) => {
      directorioForm.periodo = val;
    }
  );

  watch(
    () => form.value.fechaInicioDirectorio,
    (val) => {
      directorioForm.inicioMandato = val;
    }
  );

  watch(
    () => form.value.fechaFinDirectorio,
    (val) => {
      directorioForm.finMandato = val;
    }
  );

  watch(
    () => form.value.quorumMinimo,
    (val) => {
      directorioForm.quorumMinimo = Number(val) || 0;
    }
  );

  watch(
    () => form.value.quorumMayoria,
    (val) => {
      directorioForm.mayoria = Number(val) || 0;
    }
  );

  watch(
    () => form.value.nombraPresidente,
    (val) => {
      directorioForm.presidenteDesignado = val === "opcion-a";
    }
  );

  watch(
    () => form.value.ejerceSecretaria,
    (val) => {
      directorioForm.secretarioAsignado = val === "opcion-a";
    }
  );

  watch(
    () => form.value.reeleccionDirectores,
    (val) => {
      directorioForm.reeleccionPermitida = val;
    }
  );

  watch(
    () => form.value.presideJuntas,
    (val) => {
      directorioForm.presidentePreside = val;
    }
  );

  watch(
    () => form.value.votoDirimente,
    (val) => {
      directorioForm.presidenteDesempata = val;
    }
  );

  watch(
    () => form.value.presidenteDirectorio,
    (val) => {
      console.debug("[useDirectorioFormSync] watch form.presidenteDirectorio", {
        val,
        directorioFormPresidenteId: directorioForm.presidenteId,
      });
      directorioForm.presidenteId = val || null;
      presidenteDirectorioRef.value = val || "";
      console.debug("[useDirectorioFormSync] watch form.presidenteDirectorio:done", {
        directorioFormPresidenteId: directorioForm.presidenteId,
        presidenteDirectorioRefValue: presidenteDirectorioRef.value,
      });
    }
  );

  // Sincronizar también desde presidenteDirectorioRef al form
  watch(
    () => presidenteDirectorioRef.value,
    (val) => {
      if (val && val !== form.value.presidenteDirectorio) {
        form.value.presidenteDirectorio = val;
      }
    }
  );

  // Watch para sincronizar cuando se carguen los directores y haya un presidenteId del backend
  watch(
    [
      () => directores.value.length,
      () => directorioForm.presidenteId,
      () => presidenteOptions.value.length,
    ],
    ([directoresCount, presidenteId, optionsCount]) => {
      console.debug("[useDirectorioFormSync] watch directores/presidenteId/options", {
        directoresCount,
        presidenteId,
        optionsCount,
        formValue: form.value.presidenteDirectorio,
        presidenteDirectorioRefValue: presidenteDirectorioRef.value,
      });

      // Si hay directores cargados, hay opciones disponibles, y hay un presidenteId del backend
      if (directoresCount > 0 && optionsCount > 0 && presidenteId) {
        // Verificar que el presidenteId existe en las opciones
        const existeEnOpciones = presidenteOptions.value.some(
          (opt) => String(opt.value) === String(presidenteId)
        );
        if (existeEnOpciones && form.value.presidenteDirectorio !== presidenteId) {
          console.debug("[useDirectorioFormSync] Sincronizando presidenteId desde backend", {
            presidenteId,
            existeEnOpciones,
          });
          form.value.presidenteDirectorio = presidenteId;
          presidenteDirectorioRef.value = presidenteId;
        }
      }
    },
    { immediate: true }
  );

  /**
   * Función para sincronizar todos los valores del DTO al formulario UI
   * Útil cuando se cargan datos desde el backend
   */
  const syncFormFromDirectorio = () => {
    console.debug("[useDirectorioFormSync] syncFormFromDirectorio", {
      directorioForm: { ...directorioForm },
    });
    form.value.cantidadDirectores =
      directorioForm.cantidadDirectores && directorioForm.cantidadDirectores > 0
        ? String(directorioForm.cantidadDirectores)
        : "3";
    form.value.cantidadPersonalizado = directorioForm.conteoPersonalizado;
    form.value.minimoDirectores = directorioForm.minimoDirectores
      ? String(directorioForm.minimoDirectores)
      : "3";
    form.value.maximoDirectores = directorioForm.maximoDirectores
      ? String(directorioForm.maximoDirectores)
      : "3";
    form.value.duracionDirectorio = directorioForm.periodo || "";
    form.value.fechaInicioDirectorio = directorioForm.inicioMandato || "";
    form.value.fechaFinDirectorio = directorioForm.finMandato || "";
    form.value.quorumMinimo = String(directorioForm.quorumMinimo || "");
    form.value.quorumMayoria = String(directorioForm.mayoria || "");
    form.value.nombraPresidente = directorioForm.presidenteDesignado ? "opcion-a" : "opcion-b";
    form.value.ejerceSecretaria = directorioForm.secretarioAsignado ? "opcion-a" : "opcion-b";
    form.value.reeleccionDirectores = directorioForm.reeleccionPermitida;
    form.value.presideJuntas = directorioForm.presidentePreside;
    form.value.votoDirimente = directorioForm.presidenteDesempata;
    const presidenteId = directorioForm.presidenteId || "";
    form.value.presidenteDirectorio = presidenteId;
    presidenteDirectorioRef.value = presidenteId;
    console.debug("[useDirectorioFormSync] syncFormFromDirectorio:done", {
      form: { ...form.value },
      presidenteDirectorioRef: presidenteDirectorioRef.value,
    });
  };

  return {
    syncFormFromDirectorio,
  };
}
