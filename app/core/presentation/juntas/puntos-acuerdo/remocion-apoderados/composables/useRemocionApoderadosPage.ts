import { computed, onMounted, ref } from "vue";
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
   * Actualizar estado de checkboxes
   */
  function updateCheckedItems(checkedItems: boolean) {
    apoderados.value.forEach((apoderado) => {
      apoderado.checked = checkedItems;
    });
  }

  /**
   * Guardar selección y crear candidatos + votaciones
   */
  async function guardarSeleccion(): Promise<void> {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    // Obtener IDs de apoderados seleccionados
    const apoderadosSeleccionados = apoderados.value.filter((a) => a.checked).map((a) => a.id);

    if (apoderadosSeleccionados.length === 0) {
      throw new Error("Debe seleccionar al menos un apoderado para remover");
    }

    console.log("[RemocionApoderados] Guardando candidatos:", {
      total: apoderadosSeleccionados.length,
      ids: apoderadosSeleccionados,
      apoderados: apoderados.value
        .filter((a) => a.checked)
        .map((a) => ({ id: a.id, nombre: a.nombre, checked: a.checked })),
    });

    // ✅ SOLO crear candidatos en backend
    // La votación se creará/actualizará cuando el usuario haga clic en "Siguiente" desde la vista de votación
    await remocionStore.createCandidatos(societyId, flowId, apoderadosSeleccionados);

    console.log("[RemocionApoderados] Candidatos creados exitosamente");
  }

  // Cargar apoderados al montar
  onMounted(() => {
    loadApoderados();
  });

  return {
    apoderados: computed(() => apoderados.value),
    updateCheckedItems,
    guardarSeleccion,
    loadApoderados,
  };
}
