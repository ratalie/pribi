import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useRemocionApoderadosStore } from "../stores/useRemocionApoderadosStore";
import { useVotacionRemocionApoderadosStore } from "../votacion/stores/useVotacionRemocionApoderadosStore";

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
  const votacionStore = useVotacionRemocionApoderadosStore();

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

      // ✅ 3. Mapear TODOS los apoderados del backend (sin filtrar)
      const apoderadosAgrupados: ApoderadosTableRow[] = candidatos.map((candidato) => {
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

    // 1. Crear candidatos en backend
    await remocionStore.createCandidatos(societyId, flowId, apoderadosSeleccionados);

    console.log("[RemocionApoderados] Candidatos creados exitosamente");

    // 2. Obtener datos de los apoderados seleccionados para crear las preguntas
    const apoderadosSeleccionadosData = apoderados.value.filter((a) => a.checked);

    // 3. ✅ PRIMERO: Intentar cargar la votación existente desde el backend (GET)
    // Esto asegura que siempre tengamos el estado más reciente antes de crear/actualizar
    console.log(
      "[RemocionApoderados] Intentando cargar votación existente (GET) antes de crear/actualizar..."
    );
    try {
      await votacionStore.loadVotacion(societyId, flowId);
      console.log("[RemocionApoderados] GET ejecutado, estado:", {
        hasVotacion: votacionStore.hasVotacion,
        itemsCount: votacionStore.items.length,
        contexto: votacionStore.sesionVotacion?.contexto,
      });
    } catch (error: any) {
      // Si es 404, no existe la sesión (es normal - se creará)
      if (error.statusCode === 404 || error.status === 404) {
        console.log("[RemocionApoderados] No hay votación existente (404), se creará");
      } else {
        console.error(
          "[RemocionApoderados] Error al cargar votación antes de guardar:",
          error
        );
        // Continuar de todas formas (puede que no exista aún)
      }
    }

    // 4. Crear votaciones (una por cada apoderado seleccionado)
    console.log(
      "[RemocionApoderados] Creando votaciones para",
      apoderadosSeleccionadosData.length,
      "apoderados"
    );

    // Crear items desde los apoderados seleccionados
    const items = apoderadosSeleccionadosData.map((apoderado, index) => ({
      id: votacionStore.generateUuid(),
      orden: index,
      label: `Se aprueba la remoción del apoderado ${apoderado.nombre} de sus funciones como ${apoderado.clase_apoderado}.`,
      descripción: `Votación sobre la remoción del apoderado ${apoderado.nombre}`,
      tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION,
      votos: [], // Votos vacíos inicialmente
    }));

    // ✅ Si no hay sesión en memoria, crearla
    if (!votacionStore.sesionVotacion) {
      const sessionId = votacionStore.generateUuid();
      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.REMOCION_APODERADOS,
        modo: VoteMode.SIMPLE,
        items: items,
      };
      console.log("[RemocionApoderados] Sesión creada en memoria:", {
        sessionId,
        itemsCount: items.length,
        items: items.map((item) => ({ id: item.id, label: item.label, orden: item.orden })),
      });
    } else {
      // ✅ Si ya existe sesión, actualizar items (mantener votos existentes si los hay)
      console.log("[RemocionApoderados] Sesión existente, actualizando items...");
      votacionStore.sesionVotacion.items = items;
      // Asegurar que el contexto sea correcto
      votacionStore.sesionVotacion.contexto = VoteContext.REMOCION_APODERADOS;
    }

    // ✅ 5. Crear o actualizar la votación en el backend
    const existeEnBackend = votacionStore.hasVotacion;
    const firstItem = items[0];
    if (!firstItem) {
      throw new Error("No hay items para crear votación");
    }

    if (!existeEnBackend) {
      // Crear nueva sesión
      console.log("[RemocionApoderados] Creando nueva sesión en backend (POST)...");
      await votacionStore.createVotacion(
        societyId,
        flowId,
        firstItem.id,
        firstItem.label,
        firstItem.descripción,
        firstItem.tipoAprobacion
      );

      console.log(
        `[RemocionApoderados] Primera votación creada para apoderado: ${apoderadosSeleccionadosData[0]?.nombre}`
      );

      // ✅ Agregar items restantes solo si estamos creando una nueva sesión
      for (let i = 1; i < items.length; i++) {
        const item = items[i];
        if (!item) continue;

        await votacionStore.addVoteItemConVotos(
          societyId,
          flowId,
          item.id,
          item.label,
          item.descripción,
          item.tipoAprobacion,
          [] // Votos vacíos inicialmente
        );
      }
    } else {
      // Actualizar sesión existente
      console.log("[RemocionApoderados] Actualizando sesión existente en backend (PUT)...");
      // Actualizar todos los items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item) continue;

        await votacionStore.updateItemConVotos(
          societyId,
          flowId,
          item.id,
          item.label,
          item.descripción,
          item.tipoAprobacion,
          (item.votos || []).map((v: any) => ({
            id: v.id,
            accionistaId: v.accionistaId,
            valor: v.valor,
          }))
        );
      }
    }

    console.log(
      "[RemocionApoderados] Votaciones procesadas exitosamente:",
      apoderadosSeleccionadosData.length
    );
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
