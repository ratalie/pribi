import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useRemocionDirectoresStore } from "../stores/useRemocionDirectoresStore";

export interface DirectoresTableRow {
  id: string;
  checked: boolean;
  rol_director: "TITULAR" | "SUPLENTE" | "ALTERNO";
  nombre: string;
  tipo_documento: string;
  numero_documento: string;
}

/**
 * Composable para la página de Selección de Directores
 *
 * Responsabilidades:
 * - Cargar directores desde backend
 * - Separar directores por rol (Titulares / Suplentes y Alternos)
 * - Gestionar selección de directores
 * - Crear candidatos y votaciones al hacer "Siguiente"
 */
export function useRemocionDirectoresPage() {
  const route = useRoute();
  const remocionStore = useRemocionDirectoresStore();

  const directores = ref<DirectoresTableRow[]>([]);

  /**
   * ✅ Cargar directores desde backend (GET)
   * - Hace GET al inicio
   * - Muestra TODOS los directores (no filtra)
   * - Marca como checked los que tienen isCandidate: true
   */
  async function loadDirectores() {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    if (!societyId || !flowId) {
      console.warn("[RemocionDirectores] No hay societyId o flowId en la ruta");
      directores.value = [];
      return;
    }

    try {
      // ✅ 1. GET desde backend
      console.log("[RemocionDirectores] Cargando directores desde backend (GET)...");
      await remocionStore.loadDirectores(societyId, flowId);

      const candidatos = remocionStore.candidatos;

      if (!candidatos || candidatos.length === 0) {
        console.warn("[RemocionDirectores] No hay directores disponibles");
        directores.value = [];
        return;
      }

      // ✅ 2. Mapear directores del backend
      const directoresAgrupados: DirectoresTableRow[] = candidatos.map((candidato) => {
        // Obtener datos de la persona
        let nombre = "";
        let tipoDocumento = "";
        let numeroDocumento = "";

        if (candidato.persona) {
          nombre = `${candidato.persona.nombre} ${candidato.persona.apellidoPaterno} ${
            candidato.persona.apellidoMaterno || ""
          }`.trim();
          tipoDocumento = candidato.persona.tipoDocumento;
          numeroDocumento = candidato.persona.numeroDocumento;
        }

        return {
          id: candidato.id, // ✅ El id del backend ES el directorId que se usa en POST/PUT
          checked: candidato.isCandidate || false, // ✅ Marcar como checked si es candidato
          rol_director: candidato.rolDirector,
          nombre,
          tipo_documento: tipoDocumento,
          numero_documento: numeroDocumento,
        };
      });

      // ✅ 3. Ordenar por rol y luego por nombre
      directoresAgrupados.sort((a, b) => {
        // Primero ordenar por rol: TITULAR primero, luego SUPLENTE, luego ALTERNO
        const ordenRol: Record<string, number> = {
          TITULAR: 1,
          SUPLENTE: 2,
          ALTERNO: 3,
        };
        const ordenA = ordenRol[a.rol_director] || 999;
        const ordenB = ordenRol[b.rol_director] || 999;

        if (ordenA !== ordenB) {
          return ordenA - ordenB;
        }
        // Si mismo rol, ordenar por nombre
        return a.nombre.localeCompare(b.nombre);
      });

      directores.value = directoresAgrupados;

      console.log("[RemocionDirectores] Directores cargados desde backend:", {
        total: directores.value.length,
        candidatos: directores.value.filter((d) => d.checked).length,
        titulares: directores.value.filter((d) => d.rol_director === "TITULAR").length,
        suplentesAlternos: directores.value.filter(
          (d) => d.rol_director === "SUPLENTE" || d.rol_director === "ALTERNO"
        ).length,
        directores: directores.value,
      });
    } catch (error: any) {
      console.error("[RemocionDirectores] Error al cargar directores:", error);
      directores.value = [];
      throw error;
    }
  }

  /**
   * ✅ Directores Titulares (computed)
   */
  const directoresTitulares = computed(() => {
    return directores.value.filter((d) => d.rol_director === "TITULAR");
  });

  /**
   * ✅ Directores Suplentes y Alternos (computed)
   */
  const directoresSuplentesAlternos = computed(() => {
    return directores.value.filter(
      (d) => d.rol_director === "SUPLENTE" || d.rol_director === "ALTERNO"
    );
  });

  /**
   * ✅ FUNCIÓN ÚNICA: Actualizar estado cuando se hace check/uncheck
   * PUT se ejecuta automáticamente cuando cambia el checkbox
   */
  async function toggleDirectores(directorId: string, checked: boolean) {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    // ✅ PUT hace TODO: marcar (CANDIDATO) o desmarcar (DESMARCAR)
    const estado = checked ? "CANDIDATO" : "DESMARCAR";
    await remocionStore.actualizarEstado(societyId, flowId, directorId, estado);

    // Actualizar estado local
    const director = directores.value.find((d) => d.id === directorId);
    if (director) {
      director.checked = checked;
    }
  }

  /**
   * Actualizar estado de checkboxes para Titulares (todos a la vez)
   */
  async function updateCheckedItemsTitulares(checkedItems: boolean) {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    const titulares = directores.value.filter((d) => d.rol_director === "TITULAR");
    const estado = checkedItems ? "CANDIDATO" : "DESMARCAR";

    // Actualizar todos los titulares
    for (const director of titulares) {
      try {
        await remocionStore.actualizarEstado(societyId, flowId, director.id, estado);
        director.checked = checkedItems;
      } catch (error: any) {
        console.error(
          `[RemocionDirectores] Error al actualizar director ${director.id}:`,
          error
        );
      }
    }
  }

  /**
   * Actualizar estado de checkboxes para Suplentes y Alternos (todos a la vez)
   */
  async function updateCheckedItemsSuplentes(checkedItems: boolean) {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    const suplentes = directores.value.filter(
      (d) => d.rol_director === "SUPLENTE" || d.rol_director === "ALTERNO"
    );
    const estado = checkedItems ? "CANDIDATO" : "DESMARCAR";

    // Actualizar todos los suplentes/alternos
    for (const director of suplentes) {
      try {
        await remocionStore.actualizarEstado(societyId, flowId, director.id, estado);
        director.checked = checkedItems;
      } catch (error: any) {
        console.error(
          `[RemocionDirectores] Error al actualizar director ${director.id}:`,
          error
        );
      }
    }
  }

  /**
   * Guardar selección (legacy - mantener para compatibilidad)
   * Ya no es necesario porque PUT se ejecuta automáticamente en check/uncheck
   */
  async function guardarSeleccion(): Promise<void> {
    // ✅ Ya no hace nada porque PUT se ejecuta automáticamente
    // Solo recargar para asegurar que tenemos el estado más reciente
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);
    await remocionStore.loadDirectores(societyId, flowId);
    console.log("[RemocionDirectores] Selección guardada (PUT ya se ejecutó automáticamente)");
  }

  // ✅ Watcher: Ejecutar PUT automáticamente cuando cambia un checkbox individual
  const previousCheckedState = ref<Map<string, boolean>>(new Map());

  watch(
    () => directores.value.map((d) => ({ id: d.id, checked: d.checked })),
    (newState) => {
      const societyId = Number(route.params.societyId);
      const flowId = Number(route.params.flowId);

      if (!societyId || !flowId) return;

      // Comparar con el estado anterior
      newState.forEach(({ id, checked }) => {
        const previousChecked = previousCheckedState.value.get(id);
        if (previousChecked !== undefined && previousChecked !== checked) {
          // ✅ PUT automático cuando cambia el checkbox
          const estado = checked ? "CANDIDATO" : "DESMARCAR";
          remocionStore.actualizarEstado(societyId, flowId, id, estado).catch((error) => {
            console.error(`[RemocionDirectores] Error al actualizar director ${id}:`, error);
            // Revertir el cambio si falla
            const director = directores.value.find((d) => d.id === id);
            if (director) {
              director.checked = previousChecked;
            }
          });
        }
        previousCheckedState.value.set(id, checked);
      });
    },
    { deep: true }
  );

  // Cargar directores al montar
  onMounted(() => {
    loadDirectores().then(() => {
      // Inicializar estado anterior después de cargar
      directores.value.forEach((d) => {
        previousCheckedState.value.set(d.id, d.checked);
      });
    });
  });

  return {
    directores: computed(() => directores.value),
    directoresTitulares,
    directoresSuplentesAlternos,
    toggleDirectores, // ✅ Función para toggle manual (opcional)
    updateCheckedItemsTitulares,
    updateCheckedItemsSuplentes,
    guardarSeleccion,
    loadDirectores,
  };
}
