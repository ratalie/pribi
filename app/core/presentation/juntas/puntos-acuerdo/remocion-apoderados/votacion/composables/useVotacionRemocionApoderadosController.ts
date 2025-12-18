import { computed, nextTick, onActivated, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { Shareholder } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useRemocionApoderadosStore } from "../../stores/useRemocionApoderadosStore";
import { useVotacionRemocionApoderadosStore } from "../stores/useVotacionRemocionApoderadosStore";

/**
 * Controller para la vista de Votación de Remoción de Apoderados
 *
 * Orquesta:
 * - Carga de datos (asistentes, snapshot)
 * - Filtrado de votantes (asistentes con acciones con derecho a voto)
 * - Carga/creación de sesión de votación con MÚLTIPLES items (uno por apoderado)
 * - Generación de preguntas hardcodeadas (una por apoderado)
 * - Guardado de votos para cada item
 */
export function useVotacionRemocionApoderadosController() {
  const route = useRoute();
  const votacionStore = useVotacionRemocionApoderadosStore(); // ✅ Store dedicado
  const remocionStore = useRemocionApoderadosStore();
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Estados
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Cargar todos los datos necesarios
   */
  async function loadData() {
    try {
      isLoading.value = true;
      error.value = null;

      // 1. Cargar snapshot
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // 2. Cargar asistentes (para obtener votantes)
      console.log("[DEBUG][VotacionRemocionApoderadosController] Cargando asistencias...");
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
      console.log(
        "[DEBUG][VotacionRemocionApoderadosController] Asistencias cargadas:",
        asistenciaStore.asistencias
      );

      // 3. Cargar candidatos si no están cargados
      if (remocionStore.candidatos.length === 0) {
        console.log(
          "[DEBUG][VotacionRemocionApoderadosController] Cargando candidatos desde backend..."
        );
        try {
          await remocionStore.loadApoderados(societyId.value, flowId.value);
          console.log(
            "[DEBUG][VotacionRemocionApoderadosController] Candidatos cargados:",
            remocionStore.candidatos.length
          );
        } catch (error: any) {
          console.warn(
            "[DEBUG][VotacionRemocionApoderadosController] Error al cargar candidatos:",
            error
          );
          // Continuar aunque falle (puede que no haya candidatos aún)
        }
      }

      // 4. ✅ SOLO CARGAR votación existente (NO crear automáticamente)
      // La votación se creará/actualizará cuando el usuario haga click en "Siguiente"
      try {
        await votacionStore.loadVotacion(societyId.value, flowId.value);
        console.log("[DEBUG][VotacionRemocionApoderadosController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          itemsCount: votacionStore.items.length,
          items: votacionStore.items.map((item) => ({
            id: item.id,
            label: item.label,
            orden: item.orden,
          })),
        });

        // ✅ Verificar sincronización automática del backend
        // Si hay candidatos marcados pero no hay items, el backend debería haberlos creado automáticamente
        const candidatosFiltrados = remocionStore.candidatos.filter(
          (c) => c.isCandidate === true
        );

        if (
          votacionStore.hasVotacion &&
          votacionStore.items.length === 0 &&
          candidatosFiltrados.length > 0
        ) {
          console.warn(
            "[DEBUG][VotacionRemocionApoderadosController] ⚠️ Hay candidatos marcados pero no hay items de votación. " +
              "El backend debería haber creado los items automáticamente. Recargando..."
          );

          // Recargar votación (el backend debería haber creado los items automáticamente)
          await votacionStore.loadVotacion(societyId.value, flowId.value);

          // Si aún no hay items después de recargar, hay un problema
          if (votacionStore.items.length === 0) {
            console.error(
              "[DEBUG][VotacionRemocionApoderadosController] ❌ Los items de votación no se crearon automáticamente. " +
                "Por favor, verifique que los apoderados estén correctamente marcados."
            );
            // No lanzar error aquí, solo mostrar warning en consola
            // El usuario puede continuar y el backend debería crear los items al guardar
          }
        }

        // ✅ Sincronizar votos con votantes actuales para cada item
        if (votacionStore.hasVotacion && votacionStore.sesionVotacion) {
          await nextTick();
          sincronizarVotosConVotantesActuales();
        }
      } catch (error: any) {
        // Si no existe (404), es normal - se creará al guardar
        if (error.statusCode === 404 || error.status === 404) {
          console.log(
            "[DEBUG][VotacionRemocionApoderadosController] No hay votación existente (404), se creará al guardar"
          );
        } else {
          console.error(
            "[Controller][VotacionRemocionApoderados] Error al cargar votación:",
            error
          );
          error.value = error.message || "Error al cargar votación";
        }
      }

      // ✅ DEBUG: Estado final después de carga
      console.log("[DEBUG][VotacionRemocionApoderadosController] Carga de datos completada:", {
        hasVotacion: votacionStore.hasVotacion,
        itemsCount: votacionStore.items.length,
        votantesCount: votantes.value.length,
      });
    } catch (error: any) {
      console.error("[Controller][VotacionRemocionApoderados] Error al cargar datos:", error);
      error.value = error.message || "Error al cargar datos";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Helper: Obtener nombre completo de un accionista
   */
  function getNombreCompletoShareholder(shareholder: Shareholder): string {
    const person = shareholder.person;
    if (person.tipo === "NATURAL") {
      return `${person.nombre} ${person.apellidoPaterno} ${
        person.apellidoMaterno || ""
      }`.trim();
    }
    // Para personas jurídicas y otros tipos
    if ("razonSocial" in person) {
      return person.razonSocial || "";
    }
    return ""; // Fallback
  }

  /**
   * Mapper: Calcular votantes desde snapshot + asistencias
   * ✅ FUENTE DE VERDAD: Snapshot (no confiar en accionesConDerechoVoto del backend)
   */
  function mapearVotantesDesdeSnapshot() {
    const snapshot = snapshotStore.snapshot;
    const asistencias = asistenciaStore.asistencias;

    if (!snapshot) {
      console.warn(
        "[DEBUG][VotacionRemocionApoderadosController] No hay snapshot disponible para mapear votantes"
      );
      return [];
    }

    const { shareAllocations, shareClasses, shareholders } = snapshot;

    // 1. Calcular acciones con derecho a voto por accionista desde snapshot
    const accionistasConAcciones = shareholders.map((accionista) => {
      const asignaciones = shareAllocations.filter(
        (asig) => asig.accionistaId === accionista.id
      );

      let totalAccionesConDerechoVoto = 0;

      asignaciones.forEach((asig) => {
        const shareClass = shareClasses.find((sc) => sc.id === asig.accionId);

        if (!shareClass) {
          return;
        }

        if (shareClass.conDerechoVoto) {
          totalAccionesConDerechoVoto += asig.cantidadSuscrita;
        }
      });

      return {
        accionista,
        totalAccionesConDerechoVoto,
      };
    });

    // 2. Filtrar solo los que tienen acciones con derecho a voto Y asistieron
    const votantes = accionistasConAcciones
      .filter((item) => item.totalAccionesConDerechoVoto > 0)
      .map((item) => {
        const asistencia = asistencias.find((a) => a.accionista.id === item.accionista.id);

        if (!asistencia || !asistencia.asistio) {
          return null;
        }

        return {
          id: asistencia.id,
          accionistaId: item.accionista.id,
          accionista: item.accionista,
          nombreCompleto: getNombreCompletoShareholder(item.accionista),
          tipoPersona: item.accionista.person.tipo,
          accionesConDerechoVoto: item.totalAccionesConDerechoVoto,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    return votantes;
  }

  /**
   * Obtener votantes (asistentes con acciones con derecho a voto)
   * ✅ FUENTE DE VERDAD: Snapshot (no confiar en accionesConDerechoVoto del backend)
   */
  const votantes = computed(() => {
    return mapearVotantesDesdeSnapshot();
  });

  /**
   * Obtener preguntas de votación desde la sesión de votación del backend
   * Si no hay sesión, generar desde candidatos
   * ✅ Store dedicado siempre tiene contexto correcto (no necesita validación)
   */
  const preguntas = computed(() => {
    // ✅ Prioridad 1: Usar items de la sesión de votación del backend
    const items = votacionStore.items;
    if (items.length > 0) {
      // Ordenar por orden si existe
      const itemsOrdenados = [...items].sort((a, b) => (a.orden || 0) - (b.orden || 0));
      const preguntasFromItems = itemsOrdenados.map((item) => item.label);

      console.log("[DEBUG][VotacionRemocionApoderadosController] ✅ Preguntas desde sesión:", {
        itemsCount: items.length,
        items: items.map((item) => ({
          id: item.id,
          orden: item.orden,
          label: item.label,
          votosCount: item.votos?.length || 0,
        })),
        preguntas: preguntasFromItems,
      });

      return preguntasFromItems;
    }

    // ✅ Prioridad 2: Si hay candidatos, generar preguntas desde candidatos (solo los que tienen isCandidate: true)
    const candidatosFiltrados = remocionStore.candidatos.filter((c) => c.isCandidate === true);

    if (candidatosFiltrados.length > 0) {
      // Obtener nombres de clases desde snapshot
      const snapshot = snapshotStore.snapshot;
      const clasesMap = new Map(
        snapshot?.attorneyClasses?.map((clase) => [clase.id, clase.name]) || []
      );

      const preguntasFromCandidatos = candidatosFiltrados.map((c) => {
        // Obtener nombre de la persona
        let nombre = "";
        if (c.person.type === "NATURAL" && c.person.natural) {
          const natural = c.person.natural;
          nombre = `${natural.firstName} ${natural.lastNamePaternal} ${
            natural.lastNameMaternal || ""
          }`.trim();
        } else if (c.person.type === "JURIDIC" && c.person.juridic) {
          nombre = c.person.juridic.businessName;
        }

        // Obtener nombre de la clase
        const nombreClase = clasesMap.get(c.attorneyClassId) || "Apoderado";

        return `Se aprueba la remoción del apoderado ${nombre} de sus funciones como ${nombreClase}.`;
      });

      console.log(
        "[DEBUG][VotacionRemocionApoderadosController] ✅ Preguntas desde candidatos:",
        {
          candidatosTotal: remocionStore.candidatos.length,
          candidatosFiltrados: candidatosFiltrados.length,
          preguntas: preguntasFromCandidatos,
        }
      );

      return preguntasFromCandidatos;
    }

    // ⚠️ ÚLTIMO RECURSO: Si no hay preguntas en ningún lado, retornar array vacío
    console.warn(
      "[DEBUG][VotacionRemocionApoderadosController] ⚠️ No hay preguntas disponibles. Retornando array vacío."
    );
    return [];
  });

  /**
   * Obtener mensaje de aprobación
   */
  const mensajeAprobacion = computed(() => {
    return "la remoción de los apoderados seleccionados.";
  });

  /**
   * Sincroniza votos históricos con votantes actuales para TODOS los items
   */
  function sincronizarVotosConVotantesActuales() {
    if (!votacionStore.sesionVotacion) {
      return;
    }

    const votantesActuales = votantes.value;
    const accionistasIdsActuales = new Set(votantesActuales.map((v) => v.accionistaId));

    // Sincronizar votos para cada item
    votacionStore.items.forEach((item) => {
      const votosAntes = item.votos.length;

      const votosSincronizados = item.votos.filter((voto) =>
        accionistasIdsActuales.has(voto.accionistaId)
      );

      const votosDespues = votosSincronizados.length;
      const votosEliminados = votosAntes - votosDespues;

      item.votos = votosSincronizados;

      if (votosEliminados > 0) {
        console.warn(
          `[DEBUG][VotacionRemocionApoderadosController] ⚠️ Item ${item.id}: Se eliminaron ${votosEliminados} votos de accionistas que ya no tienen derecho a voto`
        );
      }
    });
  }

  /**
   * Obtener voto de un accionista para un item específico
   *
   * @param preguntaIndex - Índice del item (pregunta)
   * @param accionistaId - ID del accionista
   * @returns Valor del voto o null si no existe
   */
  function getVoto(preguntaIndex: number, accionistaId: string): VoteValue | null {
    const voto = votacionStore.getVotoByAccionistaAndItem(accionistaId, preguntaIndex);
    return voto?.valor as VoteValue | null;
  }

  /**
   * Función adaptada para el componente MayoriaVotacion
   *
   * ⚠️ IMPORTANTE: MayoriaVotacion carga votos directamente desde el store cuando hay múltiples preguntas.
   * Esta función solo se usa para compatibilidad con el modo legacy (una sola pregunta).
   *
   * Para múltiples preguntas, MayoriaVotacion usa el store directamente y pasa preguntaIndex
   * en el evento @cambiar-voto, que se maneja en handleCambiarVoto de la vista.
   *
   * @param accionistaId - ID del accionista
   * @returns Valor del voto o null si no existe (solo para primera pregunta)
   */
  function getVotoForComponent(accionistaId: string): VoteValue | null {
    // Para remoción de apoderados, siempre usar el primer item (pregunta)
    // El componente manejará múltiples preguntas internamente usando el store
    return getVoto(0, accionistaId);
  }

  /**
   * Establecer voto de un accionista para un item específico
   */
  async function setVoto(preguntaIndex: number, accionistaId: string, valor: VoteValue) {
    // ✅ Si no hay sesión, crear en memoria con todos los items
    if (!votacionStore.sesionVotacion) {
      const sessionId = votacionStore.generateUuid();
      const preguntasValue = preguntas.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.REMOCION_APODERADOS,
        modo: VoteMode.SIMPLE,
        items: preguntasValue.map((pregunta, index) => ({
          id: votacionStore.generateUuid(),
          orden: index,
          label: pregunta,
          descripción: `Votación sobre la remoción del apoderado ${index + 1}`,
          tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION,
          votos: [],
        })),
      };
    }

    // ✅ Usar el store dedicado para agregar/actualizar voto
    await votacionStore.addOrUpdateVoteForItem(
      societyId.value,
      flowId.value,
      preguntaIndex,
      accionistaId,
      valor
    );
  }

  /**
   * Cambiar tipo de aprobación para un item específico
   */
  async function cambiarTipoAprobacionItem(itemIndex: number, tipo: "unanimidad" | "mayoria") {
    const tipoAprobacion =
      tipo === "unanimidad"
        ? VoteAgreementType.APROBADO_POR_TODOS
        : VoteAgreementType.SOMETIDO_A_VOTACION;

    // ✅ Si no hay sesión, crear en memoria con todos los items
    if (!votacionStore.sesionVotacion) {
      const sessionId = votacionStore.generateUuid();
      const preguntasValue = preguntas.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.REMOCION_APODERADOS,
        modo: VoteMode.SIMPLE,
        items: preguntasValue.map((pregunta, index) => ({
          id: votacionStore.generateUuid(),
          orden: index,
          label: pregunta,
          descripción: `Votación sobre la remoción del apoderado ${index + 1}`,
          tipoAprobacion:
            index === itemIndex ? tipoAprobacion : VoteAgreementType.SOMETIDO_A_VOTACION,
          votos: [],
        })),
      };
    } else {
      // Actualizar tipoAprobacion en el item específico usando el store
      await votacionStore.updateTipoAprobacion(
        societyId.value,
        flowId.value,
        itemIndex,
        tipoAprobacion
      );
    }
  }

  /**
   * Cambiar tipo de aprobación para TODOS los items (legacy - mantener para compatibilidad)
   */
  async function cambiarTipoAprobacion(tipo: "unanimidad" | "mayoria") {
    const tipoAprobacion =
      tipo === "unanimidad"
        ? VoteAgreementType.APROBADO_POR_TODOS
        : VoteAgreementType.SOMETIDO_A_VOTACION;

    // ✅ Si no hay sesión, crear en memoria con todos los items
    if (!votacionStore.sesionVotacion) {
      const sessionId = votacionStore.generateUuid();
      const preguntasValue = preguntas.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.REMOCION_APODERADOS,
        modo: VoteMode.SIMPLE,
        items: preguntasValue.map((pregunta, index) => ({
          id: votacionStore.generateUuid(),
          orden: index,
          label: pregunta,
          descripción: `Votación sobre la remoción del apoderado ${index + 1}`,
          tipoAprobacion,
          votos: [],
        })),
      };
    } else {
      // Actualizar tipoAprobacion en todos los items usando el store
      for (let i = 0; i < votacionStore.items.length; i++) {
        await votacionStore.updateTipoAprobacion(
          societyId.value,
          flowId.value,
          i,
          tipoAprobacion
        );
      }
    }
  }

  /**
   * Guardar votación (para useJuntasFlowNext)
   * ⚠️ IMPORTANTE: Maneja MÚLTIPLES items (uno por apoderado)
   *
   * ✅ IMPORTANTE: Primero intenta cargar la votación existente (GET) antes de crear (POST)
   */
  async function guardarVotacion() {
    console.log("[DEBUG][VotacionRemocionApoderadosController] guardarVotacion() ejecutado");

    // ✅ 1. PRIMERO: Intentar cargar la votación existente desde el backend (GET)
    // Esto asegura que siempre tengamos el estado más reciente antes de crear/actualizar
    try {
      await votacionStore.loadVotacion(societyId.value, flowId.value);
      console.log("[DEBUG][VotacionRemocionApoderadosController] GET ejecutado, estado:", {
        hasVotacion: votacionStore.hasVotacion,
        itemsCount: votacionStore.items.length,
        contexto: votacionStore.sesionVotacion?.contexto,
      });
    } catch (error: any) {
      // Si es 404, no existe la sesión (es normal - se creará)
      if (error.statusCode === 404 || error.status === 404) {
        console.log(
          "[DEBUG][VotacionRemocionApoderadosController] No hay votación existente (404), se creará"
        );
      } else {
        console.error(
          "[Controller][VotacionRemocionApoderados] Error al cargar votación antes de guardar:",
          error
        );
        // Continuar de todas formas (puede que no exista aún)
      }
    }

    const preguntasValue = preguntas.value;

    // ✅ 2. Asegurar que hay sesión en memoria con contexto correcto
    if (!votacionStore.sesionVotacion) {
      const sessionId = votacionStore.generateUuid();

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.REMOCION_APODERADOS, // ✅ Contexto explícito
        modo: VoteMode.SIMPLE,
        items: preguntasValue.map((pregunta, index) => ({
          id: votacionStore.generateUuid(),
          orden: index,
          label: pregunta,
          descripción: `Votación sobre la remoción del apoderado ${index + 1}`,
          tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS,
          votos: [],
        })),
      };
    } else {
      // ✅ Asegurar que el contexto de la sesión existente sea correcto
      if (votacionStore.sesionVotacion.contexto !== VoteContext.REMOCION_APODERADOS) {
        console.warn(
          "[DEBUG][VotacionRemocionApoderadosController] ⚠️ Contexto incorrecto en sesión existente, corrigiendo...",
          {
            contextoActual: votacionStore.sesionVotacion.contexto,
            contextoCorrecto: VoteContext.REMOCION_APODERADOS,
          }
        );
        votacionStore.sesionVotacion.contexto = VoteContext.REMOCION_APODERADOS;
      }

      // Asegurar que hay items para todas las preguntas
      while (votacionStore.items.length < preguntasValue.length) {
        const index = votacionStore.items.length;
        votacionStore.sesionVotacion.items.push({
          id: votacionStore.generateUuid(),
          orden: index,
          label: preguntasValue[index] || "",
          descripción: `Votación sobre la remoción del apoderado ${index + 1}`,
          tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS,
          votos: [],
        });
      }
    }

    const items = votacionStore.items;

    // ✅ 3. Procesar cada item: generar votos si es unanimidad
    items.forEach((item, index) => {
      const tipoAprobacion = item.tipoAprobacion || VoteAgreementType.APROBADO_POR_TODOS;

      if (tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS) {
        // Generar todos los votos a favor para unanimidad
        item.votos = votantes.value.map((votante) => ({
          id: votacionStore.generateUuid(),
          accionistaId: votante.accionistaId,
          valor: VoteValue.A_FAVOR,
        }));
      } else {
        // Sincronizar votos para mayoría
        sincronizarVotosConVotantesActuales();
        if (item.votos.length === 0) {
          console.warn(
            `[DEBUG][VotacionRemocionApoderadosController] ⚠️ Item ${index} no tiene votos para mayoría`
          );
        }
      }
    });

    // ✅ 4. Verificar que la sesión existe (el backend debería haberla creado automáticamente)
    // Si no existe, recargar una vez más por si acaso
    if (!votacionStore.hasVotacion) {
      // Verificar si hay candidatos marcados
      const candidatosFiltrados = remocionStore.candidatos.filter(
        (c) => c.isCandidate === true
      );

      if (candidatosFiltrados.length === 0) {
        throw new Error("No hay apoderados seleccionados para remoción.");
      }

      // El backend debería haber creado la sesión automáticamente
      // Intentar recargar una vez más
      console.warn(
        "[DEBUG][VotacionRemocionApoderadosController] ⚠️ Sesión no existe. Recargando..."
      );
      await votacionStore.loadVotacion(societyId.value, flowId.value);

      if (!votacionStore.hasVotacion) {
        throw new Error(
          "La sesión de votación no existe. " +
            "El backend debería haberla creado automáticamente al marcar los apoderados. " +
            "Por favor, recargue la página o contacte al administrador."
        );
      }
    }

    // ✅ 5. Actualizar solo los votos (NO crear items - el backend ya los creó automáticamente)
    try {
      // Actualizar todos los items existentes (solo votos, no crear items)
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item) continue;

        await votacionStore.updateItemConVotos(
          societyId.value,
          flowId.value,
          item.id,
          item.label,
          item.descripción,
          item.tipoAprobacion || VoteAgreementType.SOMETIDO_A_VOTACION,
          item.votos.map((v) => ({
            id: v.id,
            accionistaId: v.accionistaId,
            valor: v.valor,
          }))
        );
      }

      console.log(
        "[DEBUG][VotacionRemocionApoderadosController] Guardado completado exitosamente"
      );

      // ✅ 4. Actualizar estados de candidatos según resultado de votación
      console.log(
        "[DEBUG][VotacionRemocionApoderadosController] Actualizando estados de candidatos..."
      );

      // ✅ Filtrar solo candidatos (isCandidate: true) y mapear con items
      const candidatosFiltrados = remocionStore.candidatos.filter(
        (c) => c.isCandidate === true
      );

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item) {
          console.warn(
            `[Controller][VotacionRemocionApoderados] No hay item para índice ${i}`
          );
          continue;
        }

        // ✅ Obtener candidato por índice (solo los que tienen isCandidate: true)
        const candidato = candidatosFiltrados[i];
        if (!candidato) {
          console.warn(
            `[Controller][VotacionRemocionApoderados] No hay candidato para item ${i}`
          );
          continue;
        }

        // ✅ El id del registro de remoción ES el attorneyId que se necesita
        const attorneyId = candidato.id;

        // Calcular porcentaje a favor
        const totalAcciones = votantes.value.reduce(
          (sum, v) => sum + (v.accionesConDerechoVoto || 0),
          0
        );

        if (totalAcciones === 0) {
          console.warn(
            `[Controller][VotacionRemocionApoderados] Total acciones es 0 para item ${i}`
          );
          continue;
        }

        const accionesAFavor = item.votos
          .filter((v) => v.valor === VoteValue.A_FAVOR)
          .reduce((sum, v) => {
            const votante = votantes.value.find((vt) => vt.accionistaId === v.accionistaId);
            return sum + (votante?.accionesConDerechoVoto || 0);
          }, 0);

        const porcentajeAFavor =
          totalAcciones > 0 ? (accionesAFavor / totalAcciones) * 100 : 0;

        // Determinar estado según porcentaje
        const estado = porcentajeAFavor > 50 ? "ELEGIDO" : "NO_ELEGIDO";

        // Actualizar estado en backend
        await remocionStore.updateEstadoCandidato(
          societyId.value,
          flowId.value,
          attorneyId,
          estado
        );

        console.log(
          `[Controller][VotacionRemocionApoderados] Apoderado ${attorneyId}: ${porcentajeAFavor.toFixed(
            2
          )}% a favor → ${estado}`
        );
      }

      console.log(
        "[DEBUG][VotacionRemocionApoderadosController] Estados actualizados exitosamente"
      );
    } catch (error: any) {
      console.error(
        "[Controller][VotacionRemocionApoderados] Error al guardar votación:",
        error
      );
      throw error;
    }
  }

  // Cargar datos al montar
  onMounted(() => {
    loadData();
  });

  // Recargar al activar (si cambia de ruta y vuelve)
  onActivated(() => {
    // ✅ Siempre recargar para asegurar que los datos estén actualizados
    // Especialmente importante si se navega desde otra página
    loadData();
  });

  return {
    // Estado
    votantes,
    preguntas,
    mensajeAprobacion,
    isLoading: computed(() => votacionStore.status === "loading"),
    error: computed(() => votacionStore.errorMessage),
    votacionStore, // ✅ Exponer store dedicado para que MayoriaVotacion lo use

    // Métodos
    getVoto,
    getVotoForComponent, // ✅ Función adaptada para el componente
    setVoto,
    cambiarTipoAprobacion,
    cambiarTipoAprobacionItem, // ✅ Cambiar tipo por item específico
    guardarVotacion,
    loadData,
  };
}
