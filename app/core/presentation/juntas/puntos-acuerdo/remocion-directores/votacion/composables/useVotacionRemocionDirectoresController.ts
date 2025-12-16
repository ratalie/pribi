import { computed, nextTick, onActivated, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { Shareholder } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useRemocionDirectoresStore } from "../../stores/useRemocionDirectoresStore";
import { useVotacionRemocionDirectoresStore } from "../stores/useVotacionRemocionDirectoresStore";

/**
 * Controller para la vista de Votación de Remoción de Directores
 *
 * Orquesta:
 * - Carga de datos (asistentes, snapshot)
 * - Filtrado de votantes (asistentes con acciones con derecho a voto)
 * - Carga/creación de sesión de votación con MÚLTIPLES items (uno por director)
 * - Generación de preguntas hardcodeadas (una por director)
 * - Guardado de votos para cada item
 */
export function useVotacionRemocionDirectoresController() {
  const route = useRoute();
  const votacionStore = useVotacionRemocionDirectoresStore(); // ✅ Store dedicado
  const remocionStore = useRemocionDirectoresStore();
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
      console.log("[DEBUG][VotacionRemocionDirectoresController] Cargando asistencias...");
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
      console.log(
        "[DEBUG][VotacionRemocionDirectoresController] Asistencias cargadas:",
        asistenciaStore.asistencias
      );

      // 3. ✅ SIEMPRE recargar candidatos para asegurar que tenemos el estado más reciente
      // Esto es crítico porque los candidatos pueden haberse creado en la vista anterior
      console.log(
        "[DEBUG][VotacionRemocionDirectoresController] Recargando candidatos desde backend..."
      );
      try {
        await remocionStore.loadDirectores(societyId.value, flowId.value);
        console.log(
          "[DEBUG][VotacionRemocionDirectoresController] Candidatos cargados:",
          remocionStore.candidatos.length,
          "candidatos con isCandidate:",
          remocionStore.candidatos.filter((c) => c.isCandidate === true).length
        );
      } catch (error: any) {
        console.warn(
          "[DEBUG][VotacionRemocionDirectoresController] Error al cargar candidatos:",
          error
        );
        // Continuar aunque falle (puede que no haya candidatos aún)
      }

      // 4. ✅ SOLO CARGAR votación existente (NO crear automáticamente)
      // La votación se creará/actualizará cuando el usuario haga click en "Siguiente"
      try {
        await votacionStore.loadVotacion(societyId.value, flowId.value);
        console.log("[DEBUG][VotacionRemocionDirectoresController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          itemsCount: votacionStore.items.length,
          items: votacionStore.items.map((item) => ({
            id: item.id,
            label: item.label,
            orden: item.orden,
          })),
        });

        // ✅ Si la sesión existe pero no tiene items, crear items desde candidatos (solo los que tienen isCandidate: true)
        const candidatosFiltrados = remocionStore.candidatos.filter(
          (c) => c.isCandidate === true
        );

        console.log(
          "[DEBUG][VotacionRemocionDirectoresController] Verificando si crear items:",
          {
            hasVotacion: votacionStore.hasVotacion,
            itemsCount: votacionStore.items.length,
            candidatosFiltrados: candidatosFiltrados.length,
            candidatosTotal: remocionStore.candidatos.length,
          }
        );

        if (
          votacionStore.hasVotacion &&
          votacionStore.items.length === 0 &&
          candidatosFiltrados.length > 0
        ) {
          console.log(
            "[DEBUG][VotacionRemocionDirectoresController] Sesión sin items, creando items desde candidatos..."
          );

          // Crear items desde candidatos filtrados
          const items = candidatosFiltrados.map((candidato, index) => {
            // Obtener nombre de la persona
            let nombre = "";
            if (candidato.persona) {
              nombre = `${candidato.persona.nombre} ${candidato.persona.apellidoPaterno} ${
                candidato.persona.apellidoMaterno || ""
              }`.trim();
            }

            // Obtener rol del director
            const rolDirector = candidato.rolDirector || "Director";

            const label = `Se aprueba la remoción del director ${nombre} de sus funciones como ${rolDirector}.`;

            return {
              id: votacionStore.generateUuid(),
              orden: index,
              label,
              descripción: `Votación sobre la remoción del director ${nombre}`,
              tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION,
              votos: [],
            };
          });

          // ✅ Agregar items a la sesión en memoria
          if (votacionStore.sesionVotacion) {
            votacionStore.sesionVotacion.items = items;
          }

          // ✅ IMPORTANTE: Guardar items en el backend
          console.log(
            "[DEBUG][VotacionRemocionDirectoresController] Guardando items en backend..."
          );
          try {
            // Crear el primer item
            if (items.length > 0) {
              const firstItem = items[0];
              if (firstItem) {
                await votacionStore.createVotacion(
                  societyId.value,
                  flowId.value,
                  firstItem.id,
                  firstItem.label,
                  firstItem.descripción,
                  firstItem.tipoAprobacion
                );

                // Agregar los items restantes
                for (let i = 1; i < items.length; i++) {
                  const item = items[i];
                  if (!item) continue;

                  await votacionStore.addVoteItemConVotos(
                    societyId.value,
                    flowId.value,
                    item.id,
                    item.label,
                    item.descripción,
                    item.tipoAprobacion,
                    [] // Sin votos inicialmente
                  );
                }

                console.log(
                  "[DEBUG][VotacionRemocionDirectoresController] ✅ Items guardados en backend exitosamente"
                );
              }
            }
          } catch (error: any) {
            console.error(
              "[DEBUG][VotacionRemocionDirectoresController] ⚠️ Error al guardar items en backend:",
              error
            );
            // Continuar aunque falle (los items están en memoria)
          }

          console.log("[DEBUG][VotacionRemocionDirectoresController] Items creados:", {
            candidatosTotal: remocionStore.candidatos.length,
            candidatosFiltrados: candidatosFiltrados.length,
            itemsCreados: items.length,
          });
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
            "[DEBUG][VotacionRemocionDirectoresController] No hay votación existente (404), se creará al guardar"
          );
        } else {
          console.error(
            "[Controller][VotacionRemocionDirectores] Error al cargar votación:",
            error
          );
          error.value = error.message || "Error al cargar votación";
        }
      }

      // ✅ DEBUG: Estado final después de carga
      console.log("[DEBUG][VotacionRemocionDirectoresController] Carga de datos completada:", {
        hasVotacion: votacionStore.hasVotacion,
        itemsCount: votacionStore.items.length,
        votantesCount: votantes.value.length,
      });
    } catch (err: any) {
      console.error("[Controller][VotacionRemocionDirectores] Error al cargar datos:", err);
      error.value = err.message || "Error al cargar datos";
      throw err;
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
        "[DEBUG][VotacionRemocionDirectoresController] No hay snapshot disponible para mapear votantes"
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

      console.log("[DEBUG][VotacionRemocionDirectoresController] ✅ Preguntas desde sesión:", {
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
      const preguntasFromCandidatos = candidatosFiltrados.map((c) => {
        // Obtener nombre de la persona
        let nombre = "";
        if (c.persona) {
          nombre = `${c.persona.nombre} ${c.persona.apellidoPaterno} ${
            c.persona.apellidoMaterno || ""
          }`.trim();
        }

        // Obtener rol del director
        const rolDirector = c.rolDirector || "Director";

        return `Se aprueba la remoción del director ${nombre} de sus funciones como ${rolDirector}.`;
      });

      console.log(
        "[DEBUG][VotacionRemocionDirectoresController] ✅ Preguntas desde candidatos:",
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
      "[DEBUG][VotacionRemocionDirectoresController] ⚠️ No hay preguntas disponibles. Retornando array vacío."
    );
    return [];
  });

  /**
   * Obtener mensaje de aprobación
   */
  const mensajeAprobacion = computed(() => {
    return "la remoción de los directores seleccionados.";
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
          `[DEBUG][VotacionRemocionDirectoresController] ⚠️ Item ${item.id}: Se eliminaron ${votosEliminados} votos de accionistas que ya no tienen derecho a voto`
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
    // Para remoción de directores, siempre usar el primer item (pregunta)
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
        contexto: VoteContext.REMOCION_DIRECTORES,
        modo: VoteMode.SIMPLE,
        items: preguntasValue.map((pregunta, index) => ({
          id: votacionStore.generateUuid(),
          orden: index,
          label: pregunta,
          descripción: `Votación sobre la remoción del director ${index + 1}`,
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
        contexto: VoteContext.REMOCION_DIRECTORES,
        modo: VoteMode.SIMPLE,
        items: preguntasValue.map((pregunta, index) => ({
          id: votacionStore.generateUuid(),
          orden: index,
          label: pregunta,
          descripción: `Votación sobre la remoción del director ${index + 1}`,
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
        contexto: VoteContext.REMOCION_DIRECTORES,
        modo: VoteMode.SIMPLE,
        items: preguntasValue.map((pregunta, index) => ({
          id: votacionStore.generateUuid(),
          orden: index,
          label: pregunta,
          descripción: `Votación sobre la remoción del director ${index + 1}`,
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
   * ⚠️ IMPORTANTE: Maneja MÚLTIPLES items (uno por director)
   *
   * ✅ IMPORTANTE: Primero intenta cargar la votación existente (GET) antes de crear (POST)
   */
  async function guardarVotacion() {
    console.log("[DEBUG][VotacionRemocionDirectoresController] guardarVotacion() ejecutado");

    // ✅ 1. PRIMERO: Intentar cargar la votación existente desde el backend (GET)
    // Esto asegura que siempre tengamos el estado más reciente antes de crear/actualizar
    try {
      await votacionStore.loadVotacion(societyId.value, flowId.value);
      console.log("[DEBUG][VotacionRemocionDirectoresController] GET ejecutado, estado:", {
        hasVotacion: votacionStore.hasVotacion,
        itemsCount: votacionStore.items.length,
        contexto: votacionStore.sesionVotacion?.contexto,
      });
    } catch (error: any) {
      // Si es 404, no existe la sesión (es normal - se creará)
      if (error.statusCode === 404 || error.status === 404) {
        console.log(
          "[DEBUG][VotacionRemocionDirectoresController] No hay votación existente (404), se creará"
        );
      } else {
        console.error(
          "[Controller][VotacionRemocionDirectores] Error al cargar votación antes de guardar:",
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
        contexto: VoteContext.REMOCION_DIRECTORES, // ✅ Contexto explícito
        modo: VoteMode.SIMPLE,
        items: preguntasValue.map((pregunta, index) => ({
          id: votacionStore.generateUuid(),
          orden: index,
          label: pregunta,
          descripción: `Votación sobre la remoción del director ${index + 1}`,
          tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS,
          votos: [],
        })),
      };
    } else {
      // ✅ Asegurar que el contexto de la sesión existente sea correcto
      if (votacionStore.sesionVotacion.contexto !== VoteContext.REMOCION_DIRECTORES) {
        console.warn(
          "[DEBUG][VotacionRemocionDirectoresController] ⚠️ Contexto incorrecto en sesión existente, corrigiendo...",
          {
            contextoActual: votacionStore.sesionVotacion.contexto,
            contextoCorrecto: VoteContext.REMOCION_DIRECTORES,
          }
        );
        votacionStore.sesionVotacion.contexto = VoteContext.REMOCION_DIRECTORES;
      }

      // Asegurar que hay items para todas las preguntas
      while (votacionStore.items.length < preguntasValue.length) {
        const index = votacionStore.items.length;
        votacionStore.sesionVotacion.items.push({
          id: votacionStore.generateUuid(),
          orden: index,
          label: preguntasValue[index] || "",
          descripción: `Votación sobre la remoción del director ${index + 1}`,
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
            `[DEBUG][VotacionRemocionDirectoresController] ⚠️ Item ${index} no tiene votos para mayoría`
          );
        }
      }
    });

    // ✅ 4. Crear o actualizar la votación en el backend
    const existeEnBackend = votacionStore.hasVotacion;

    try {
      if (!existeEnBackend) {
        // Crear nueva sesión con todos los items
        const firstItem = items[0];
        if (!firstItem) {
          throw new Error("No hay items para crear votación");
        }

        await votacionStore.createVotacion(
          societyId.value,
          flowId.value,
          firstItem.id,
          firstItem.label,
          firstItem.descripción,
          firstItem.tipoAprobacion || VoteAgreementType.SOMETIDO_A_VOTACION
        );

        // Agregar los items restantes
        for (let i = 1; i < items.length; i++) {
          const item = items[i];
          if (!item) continue;

          await votacionStore.addVoteItemConVotos(
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
      } else {
        // Actualizar todos los items existentes
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
      }

      console.log(
        "[DEBUG][VotacionRemocionDirectoresController] Guardado completado exitosamente"
      );

      // ✅ 4. Actualizar estados de candidatos según resultado de votación
      console.log(
        "[DEBUG][VotacionRemocionDirectoresController] Actualizando estados de candidatos..."
      );

      // ✅ Filtrar solo candidatos (isCandidate: true) y mapear con items
      const candidatosFiltrados = remocionStore.candidatos.filter(
        (c) => c.isCandidate === true
      );

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item) {
          console.warn(
            `[Controller][VotacionRemocionDirectores] No hay item para índice ${i}`
          );
          continue;
        }

        // ✅ Obtener candidato por índice (solo los que tienen isCandidate: true)
        const candidato = candidatosFiltrados[i];
        if (!candidato) {
          console.warn(
            `[Controller][VotacionRemocionDirectores] No hay candidato para item ${i}`
          );
          continue;
        }

        // ✅ El id del backend ES el directorId que se usa en POST/PUT
        const directorId = candidato.id;

        // Calcular porcentaje a favor
        const totalAcciones = votantes.value.reduce(
          (sum, v) => sum + (v.accionesConDerechoVoto || 0),
          0
        );

        if (totalAcciones === 0) {
          console.warn(
            `[Controller][VotacionRemocionDirectores] Total acciones es 0 para item ${i}`
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

        // ✅ Actualizar estado en backend usando PUT (NO POST)
        // PUT /removal-director actualiza candidateStatus de "CANDIDATE" a "ELECTED" o "NOT_ELECTED"
        await remocionStore.updateEstadoCandidato(
          societyId.value,
          flowId.value,
          directorId,
          estado
        );

        console.log(
          `[Controller][VotacionRemocionDirectores] Director ${directorId}: ${porcentajeAFavor.toFixed(
            2
          )}% a favor → ${estado}`
        );
      }

      console.log(
        "[DEBUG][VotacionRemocionDirectoresController] Estados actualizados exitosamente"
      );
    } catch (error: any) {
      console.error(
        "[Controller][VotacionRemocionDirectores] Error al guardar votación:",
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
