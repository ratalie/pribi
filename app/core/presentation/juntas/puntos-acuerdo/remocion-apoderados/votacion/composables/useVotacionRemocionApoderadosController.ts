import { computed, nextTick, onActivated, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { Shareholder } from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useVotacionStore } from "~/core/presentation/juntas/puntos-acuerdo/aporte-dinerario/votacion/stores/useVotacionStore";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useVotacionRemocionApoderadosStore } from "../stores/useVotacionRemocionApoderadosStore";
import { useRemocionApoderadosStore } from "../../stores/useRemocionApoderadosStore";

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
  const votacionStore = useVotacionStore();
  const votacionRemocionApoderadosStore = useVotacionRemocionApoderadosStore();
  const remocionStore = useRemocionApoderadosStore();
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  /**
   * Cargar todos los datos necesarios
   */
  async function loadData() {
    try {
      // 1. Cargar snapshot (ya está cargado, pero verificamos)
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
      if (remocionStore.candidatos.length === 0 && remocionStore.apoderadosSeleccionados.length > 0) {
        console.log(
          "[DEBUG][VotacionRemocionApoderadosController] Cargando candidatos desde backend..."
        );
        await remocionStore.loadApoderados(societyId.value, flowId.value);
      }

      // 4. Cargar votación existente (si existe)
      try {
        await votacionStore.loadVotacion(
          societyId.value,
          flowId.value,
          VoteContext.REMOCION_APODERADOS
        );
        console.log("[DEBUG][VotacionRemocionApoderadosController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          itemsCount: votacionStore.sesionVotacion?.items.length || 0,
          contexto: votacionStore.sesionVotacion?.contexto,
        });

        // ✅ 5. Verificar que el contexto de la sesión cargada sea correcto
        if (
          votacionStore.sesionVotacion &&
          votacionStore.sesionVotacion.contexto !== VoteContext.REMOCION_APODERADOS
        ) {
          console.error(
            "[DEBUG][VotacionRemocionApoderadosController] ⚠️ ERROR: Sesión cargada tiene contexto incorrecto:",
            {
              contextoEsperado: VoteContext.REMOCION_APODERADOS,
              contextoObtenido: votacionStore.sesionVotacion.contexto,
            }
          );
          // Limpiar la sesión incorrecta para evitar conflictos
          votacionStore.sesionVotacion = null;
        }

        // ✅ 6. Sincronizar votos con votantes actuales para cada item
        if (votacionStore.hasVotacion && votacionStore.sesionVotacion) {
          await nextTick();
          sincronizarVotosConVotantesActuales();
        }
      } catch (error: any) {
        if (error.statusCode === 404 || error.status === 404) {
          console.log(
            "[DEBUG][VotacionRemocionApoderadosController] No hay votación existente (404), se creará al guardar"
          );
        } else {
          console.error(
            "[Controller][VotacionRemocionApoderados] Error al cargar votación:",
            error
          );
        }
      }
    } catch (error: any) {
      console.error("[Controller][VotacionRemocionApoderados] Error al cargar datos:", error);
      throw error;
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
   * Obtener preguntas de votación (hardcodeadas desde el store)
   */
  const preguntas = computed(() => {
    return votacionRemocionApoderadosStore.preguntasVotacion;
  });

  /**
   * Obtener mensaje de aprobación
   */
  const mensajeAprobacion = computed(() => {
    return votacionRemocionApoderadosStore.mensajeAprobacion;
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
    votacionStore.sesionVotacion.items.forEach((item) => {
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
   */
  function getVoto(itemIndex: number, accionistaId: string): VoteValue | null {
    if (!votacionStore.sesionVotacion) return null;
    const item = votacionStore.sesionVotacion.items[itemIndex];
    if (!item) return null;

    const voto = item.votos.find((v) => v.accionistaId === accionistaId);
    if (!voto) return null;
    return voto.valor as VoteValue;
  }

  /**
   * Establecer voto de un accionista para un item específico
   */
  function setVoto(itemIndex: number, accionistaId: string, valor: VoteValue) {
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

    const item = votacionStore.sesionVotacion.items[itemIndex];
    if (!item) {
      console.error(`[Controller][VotacionRemocionApoderados] Item ${itemIndex} no existe`);
      return;
    }

    // Actualizar o agregar voto
    const votoExistente = item.votos.find((v) => v.accionistaId === accionistaId);

    if (votoExistente) {
      votoExistente.valor = valor as string | number;
    } else {
      const voteId = votacionStore.generateUuid();
      item.votos.push({
        id: voteId,
        accionistaId,
        valor: valor as string | number,
      });
    }
  }

  /**
   * Cambiar tipo de aprobación para TODOS los items
   */
  function cambiarTipoAprobacion(tipo: "unanimidad" | "mayoria") {
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
      // Actualizar tipoAprobacion en todos los items
      votacionStore.sesionVotacion.items.forEach((item) => {
        item.tipoAprobacion = tipoAprobacion;
      });
    }
  }

  /**
   * Guardar votación (para useJuntasFlowNext)
   * ⚠️ IMPORTANTE: Maneja MÚLTIPLES items (uno por apoderado)
   */
  async function guardarVotacion() {
    console.log("[DEBUG][VotacionRemocionApoderadosController] guardarVotacion() ejecutado");

    const preguntasValue = preguntas.value;

    // ✅ 1. Asegurar que hay sesión en memoria
    if (!votacionStore.sesionVotacion) {
      const sessionId = votacionStore.generateUuid();

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.REMOCION_APODERADOS,
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
      // Asegurar que el contexto sea correcto
      if (votacionStore.sesionVotacion.contexto !== VoteContext.REMOCION_APODERADOS) {
        votacionStore.sesionVotacion.contexto = VoteContext.REMOCION_APODERADOS;
      }

      // Asegurar que hay items para todas las preguntas
      while (votacionStore.sesionVotacion.items.length < preguntasValue.length) {
        const index = votacionStore.sesionVotacion.items.length;
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

    const items = votacionStore.sesionVotacion.items;

    // ✅ 2. Procesar cada item: generar votos si es unanimidad
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

    // ✅ 3. Crear o actualizar la votación en el backend
    const existeEnBackend = votacionStore.hasVotacion;

    try {
      if (!existeEnBackend) {
        // Crear nueva sesión con todos los items
        const firstItem = items[0];
        await votacionStore.createVotacion(
          societyId.value,
          flowId.value,
          firstItem?.id || "",
          firstItem?.label || "",
          firstItem?.descripción || "",
          firstItem?.tipoAprobacion || VoteAgreementType.APROBADO_POR_TODOS,
          VoteContext.REMOCION_APODERADOS
        );

        // Agregar los items restantes
        for (let i = 1; i < items.length; i++) {
          const item = items[i];
          await votacionStore.addVoteItemConVotos(
            societyId.value,
            flowId.value,
            item?.id || "",
            item?.label || "",
            item?.descripción || "",
            item?.tipoAprobacion || VoteAgreementType.APROBADO_POR_TODOS,
            item?.votos || [],
            VoteContext.REMOCION_APODERADOS
          );
        }
      } else {
        // Actualizar todos los items existentes
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          await votacionStore.updateItemConVotos(
            societyId.value,
            flowId.value,
            item?.id || "",
            item?.label || "",
            item?.descripción || "",
            item?.tipoAprobacion || VoteAgreementType.APROBADO_POR_TODOS,
            item?.votos || [],
            VoteContext.REMOCION_APODERADOS
          );
        }
      }

      console.log(
        "[DEBUG][VotacionRemocionApoderadosController] Guardado completado exitosamente"
      );

      // ✅ 4. Actualizar estados de candidatos según resultado de votación
      console.log(
        "[DEBUG][VotacionRemocionApoderadosController] Actualizando estados de candidatos..."
      );

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Obtener attorneyId desde los candidatos cargados
        const candidato = remocionStore.candidatos[i];
        if (!candidato) {
          console.warn(
            `[Controller][VotacionRemocionApoderados] No hay candidato para item ${i}`
          );
          continue;
        }
        
        const attorneyId = candidato.attorneyId;

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
            const votante = votantes.value.find(
              (vt) => vt.accionistaId === v.accionistaId
            );
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
          `[Controller][VotacionRemocionApoderados] Apoderado ${attorneyId}: ${porcentajeAFavor.toFixed(2)}% a favor → ${estado}`
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
    if (!votacionStore.hasVotacion) {
      loadData();
    }
  });

  return {
    // Estado
    votantes,
    preguntas,
    mensajeAprobacion,
    isLoading: computed(() => votacionStore.status === "loading"),
    error: computed(() => votacionStore.errorMessage),

    // Métodos
    getVoto,
    setVoto,
    cambiarTipoAprobacion,
    guardarVotacion,
    loadData,
  };
}
