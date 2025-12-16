import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useRemocionApoderadosStore } from "../stores/useRemocionApoderadosStore";

export interface ApoderadosTableRow {
  id: string;
  checked: boolean;
  clase_apoderado: string;
  nombre: string;
  tipo_documento: string;
  numero_documento: string;
}

/**
 * Composable para la página de Selección de Apoderados
 *
 * Responsabilidades:
 * - Cargar apoderados desde snapshot
 * - Filtrar apoderados permitidos
 * - Gestionar selección de apoderados
 * - Crear candidatos y votaciones al hacer "Siguiente"
 */
export function useRemocionApoderadosPage() {
  const route = useRoute();
  const snapshotStore = useSnapshotStore();
  const remocionStore = useRemocionApoderadosStore();

  const apoderados = ref<ApoderadosTableRow[]>([]);

  /**
   * ✅ Cargar apoderados desde backend (GET)
   * - Hace GET al inicio
   * - Muestra TODOS los apoderados (no filtra)
   * - Marca como checked los que tienen isCandidate: true
   */
  async function loadApoderados() {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    if (!societyId || !flowId) {
      console.warn("[RemocionApoderados] No hay societyId o flowId en la ruta");
      apoderados.value = [];
      return;
    }

    try {
      // ✅ 1. GET desde backend
      console.log("[RemocionApoderados] Cargando apoderados desde backend (GET)...");
      await remocionStore.loadApoderados(societyId, flowId);

      const candidatos = remocionStore.candidatos;
      const snapshot = snapshotStore.snapshot;

      if (!snapshot || !snapshot.attorneyClasses) {
        console.warn("[RemocionApoderados] No hay snapshot o attorneyClasses disponibles");
        apoderados.value = [];
        return;
      }

      // ✅ 2. Crear mapa de clases por ID para obtener nombres
      const clasesMap = new Map(
        snapshot.attorneyClasses.map((clase) => [clase.id, clase.name])
      );

      // ✅ 3. Mapear apoderados del backend, EXCLUYENDO "Gerente General"
      const apoderadosAgrupados: ApoderadosTableRow[] = candidatos
        .filter((candidato) => {
          const nombreClase = clasesMap.get(candidato.attorneyClassId) || "";
          // ✅ EXCLUIR "Gerente General"
          return nombreClase !== "Gerente General";
        })
        .map((candidato) => {
          // Obtener nombre de la clase
          const nombreClase = clasesMap.get(candidato.attorneyClassId) || "Sin clase";

          // Obtener datos de la persona
          let nombre = "";
          let tipoDocumento = "";
          let numeroDocumento = "";

          if (candidato.person.type === "NATURAL" && candidato.person.natural) {
            const natural = candidato.person.natural;
            nombre = `${natural.firstName} ${natural.lastNamePaternal} ${
              natural.lastNameMaternal || ""
            }`.trim();
            tipoDocumento = natural.typeDocument;
            numeroDocumento = natural.documentNumber;
          } else if (candidato.person.type === "JURIDIC" && candidato.person.juridic) {
            const juridic = candidato.person.juridic;
            nombre = juridic.businessName;
            tipoDocumento = juridic.typeDocument;
            numeroDocumento = juridic.documentNumber;
          }

          return {
            id: candidato.id, // ✅ Usar id del backend (no attorneyId)
            checked: candidato.isCandidate || false, // ✅ Marcar como checked si es candidato
            clase_apoderado: nombreClase,
            nombre,
            tipo_documento: tipoDocumento,
            numero_documento: numeroDocumento,
          };
        });

      // ✅ 4. Ordenar por clase de apoderado y luego por nombre
      apoderadosAgrupados.sort((a, b) => {
        if (a.clase_apoderado !== b.clase_apoderado) {
          return a.clase_apoderado.localeCompare(b.clase_apoderado);
        }
        return a.nombre.localeCompare(b.nombre);
      });

      apoderados.value = apoderadosAgrupados;

      console.log("[RemocionApoderados] Apoderados cargados desde backend:", {
        total: apoderados.value.length,
        candidatos: apoderados.value.filter((a) => a.checked).length,
        apoderados: apoderados.value,
      });
    } catch (error: any) {
      console.error("[RemocionApoderados] Error al cargar apoderados:", error);
      apoderados.value = [];
      throw error;
    }
  }

  /**
   * ✅ FUNCIÓN ÚNICA: Actualizar estado cuando se hace check/uncheck
   * PUT se ejecuta automáticamente cuando cambia el checkbox
   */
  async function toggleApoderados(attorneyId: string, checked: boolean) {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    // ✅ PUT hace TODO: marcar (CANDIDATO) o desmarcar (DESMARCAR)
    const estado = checked ? "CANDIDATO" : "DESMARCAR";
    await remocionStore.actualizarEstado(societyId, flowId, attorneyId, estado);

    // Actualizar estado local
    const apoderado = apoderados.value.find((a) => a.id === attorneyId);
    if (apoderado) {
      apoderado.checked = checked;
    }
  }

  /**
   * Actualizar estado de checkboxes (todos a la vez)
   */
  async function updateCheckedItems(checkedItems: boolean) {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    const estado = checkedItems ? "CANDIDATO" : "DESMARCAR";

    // Actualizar todos los apoderados
    for (const apoderado of apoderados.value) {
      try {
        await remocionStore.actualizarEstado(societyId, flowId, apoderado.id, estado);
        apoderado.checked = checkedItems;
      } catch (error: any) {
        console.error(
          `[RemocionApoderados] Error al actualizar apoderado ${apoderado.id}:`,
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
    await remocionStore.loadApoderados(societyId, flowId);
    console.log("[RemocionApoderados] Selección guardada (PUT ya se ejecutó automáticamente)");
  }

  // ✅ Watcher: Ejecutar PUT automáticamente cuando cambia un checkbox individual
  const previousCheckedState = ref<Map<string, boolean>>(new Map());

  watch(
    () => apoderados.value.map((a) => ({ id: a.id, checked: a.checked })),
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
            console.error(`[RemocionApoderados] Error al actualizar apoderado ${id}:`, error);
            // Revertir el cambio si falla
            const apoderado = apoderados.value.find((a) => a.id === id);
            if (apoderado) {
              apoderado.checked = previousChecked;
            }
          });
        }
        previousCheckedState.value.set(id, checked);
      });
    },
    { deep: true }
  );

  // Cargar apoderados al montar
  onMounted(() => {
    loadApoderados().then(() => {
      // Inicializar estado anterior después de cargar
      apoderados.value.forEach((a) => {
        previousCheckedState.value.set(a.id, a.checked);
      });
    });
  });

  return {
    apoderados: computed(() => apoderados.value),
    toggleApoderados, // ✅ Función para toggle manual (opcional)
    updateCheckedItems,
    guardarSeleccion,
    loadApoderados,
  };
}
