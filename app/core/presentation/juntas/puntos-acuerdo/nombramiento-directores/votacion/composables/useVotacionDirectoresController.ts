import { computed, nextTick, ref } from "vue";
import { useRoute } from "vue-router";
import type { VoteEntry } from "~/core/hexag/juntas/domain/entities/vote-entry.entity";
import type { VoteItem } from "~/core/hexag/juntas/domain/entities/vote-item.entity";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useDirectoresStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/composables/useDirectoresStore";
import { useDirectoryConfigurationStore } from "../../stores/useDirectoryConfigurationStore";
import { useNombramientoDirectoresStore } from "../../stores/useNombramientoDirectoresStore";
import { useVotacionDirectoresStore } from "../stores/useVotacionDirectoresStore";

/**
 * Controller para la vista de Votación Acumulativa de Directores
 *
 * Orquesta:
 * - Carga de datos (candidatos, accionistas, votación existente)
 * - Conversión de formatos (local → backend)
 * - Guardado de votación completa
 * - Cálculo de elegidos y marcado de estados
 */
export function useVotacionDirectoresController() {
  const route = useRoute();
  const votacionStore = useVotacionDirectoresStore();
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();
  const directoryConfigStore = useDirectoryConfigurationStore();
  const nombramientoStore = useNombramientoDirectoresStore();
  const directoresStore = useDirectoresStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Estados
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Helper: Obtener nombre completo de un accionista
   */
  function getNombreCompletoShareholder(shareholder: any): string {
    const person = shareholder.person;
    if (person.tipo === "NATURAL") {
      return `${person.nombre} ${person.apellidoPaterno} ${
        person.apellidoMaterno || ""
      }`.trim();
    }
    if ("razonSocial" in person) {
      return person.razonSocial || "";
    }
    return "";
  }

  /**
   * Mapper: Calcular votantes desde snapshot + asistencias
   * (Reutilizado de useVotacionCantidadController)
   */
  function mapearVotantesDesdeSnapshot() {
    const snapshot = snapshotStore.snapshot;
    const asistencias = asistenciaStore.asistencias;

    if (!snapshot) {
      return [];
    }

    const { shareAllocations, shareClasses, shareholders } = snapshot;

    const accionistasConAcciones = shareholders.map((accionista) => {
      const asignaciones = shareAllocations.filter(
        (asig) => asig.accionistaId === accionista.id
      );

      let totalAccionesConDerechoVoto = 0;

      asignaciones.forEach((asig) => {
        const shareClass = shareClasses.find((sc) => sc.id === asig.accionId);
        if (shareClass && shareClass.conDerechoVoto) {
          totalAccionesConDerechoVoto += asig.cantidadSuscrita;
        }
      });

      return {
        accionista,
        totalAccionesConDerechoVoto,
      };
    });

    const votantes = accionistasConAcciones
      .filter((item) => item.totalAccionesConDerechoVoto > 0)
      .map((item) => {
        const asistencia = asistencias.find((a) => a.accionista.id === item.accionista.id);
        if (!asistencia || !asistencia.asistio) {
          return null;
        }

        return {
          id: asistencia.id,
          accionistaId: item.accionista.id, // ✅ ShareholderV2.id
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

      // 2. Cargar configuración de directorio (para obtener cantidadDirectores)
      try {
        await directoryConfigStore.loadConfiguration(societyId.value, flowId.value);
      } catch (error: any) {
        // Si no existe (404), es normal - se usará snapshot
        if (error?.statusCode !== 404 && error?.status !== 404) {
          console.error(
            "[Controller][VotacionDirectores] Error al cargar configuración:",
            error
          );
        }
      }

      // 3. Cargar directores designados (para obtener candidatos)
      await nombramientoStore.loadDirectoresDesignados(societyId.value, flowId.value);

      // 3.1. Cargar candidatos de remoción (para calcular directores actuales correctamente)
      try {
        const { useRemocionDirectoresStore } = await import(
          "~/core/presentation/juntas/puntos-acuerdo/remocion-directores/stores/useRemocionDirectoresStore"
        );
        const remocionStore = useRemocionDirectoresStore();
        await remocionStore.loadDirectores(societyId.value, flowId.value);
      } catch (error: any) {
        // Si no hay remoción, no es crítico
        if (error?.statusCode !== 404 && error?.status !== 404) {
          console.warn("[Controller][VotacionDirectores] Error al cargar remociones:", error);
        }
      }

      // 4. Cargar asistentes (para obtener votantes - solo los que asistieron)
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);

      // 5. Cargar votación existente (NO crear automáticamente)
      try {
        await votacionStore.loadVotacion(societyId.value, flowId.value);
        console.log("[DEBUG][VotacionDirectoresController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          itemsCount: votacionStore.itemsVotacion.length,
          items: votacionStore.itemsVotacion.map((item) => ({
            id: item.id,
            label: item.label,
            personaId: item.personaId,
            votosCount: item.votos.length,
            modo: votacionStore.sesionVotacion?.modo,
          })),
        });

        // ✅ NO convertir aquí, se hará después de cargar todos los datos
      } catch (error: any) {
        // Si no existe (404), es normal - se creará al guardar
        if (error.statusCode === 404 || error.status === 404) {
          console.log(
            "[DEBUG][VotacionDirectoresController] No hay votación existente (404), se creará al guardar"
          );
        } else {
          console.error("[Controller][VotacionDirectores] Error al cargar votación:", error);
        }
      }

      console.log("[DEBUG][VotacionDirectoresController] Carga de datos completada:", {
        hasVotacion: votacionStore.hasVotacion,
        candidatosCount: candidatos.value.length,
        votantesCount: votantes.value.length,
        itemsCount: votacionStore.itemsVotacion.length,
      });

      // ✅ Si hay votación existente, detectar si es unanimidad o mayoría y convertir votos
      if (votacionStore.hasVotacion && votacionStore.itemsVotacion.length > 0) {
        // Esperar un tick adicional para asegurar que todo esté sincronizado
        await nextTick();

        // ✅ Detectar si es unanimidad basándose en tipoAprobacion
        // Si TODOS los items tienen tipoAprobacion: APROBADO_POR_TODOS → es unanimidad
        const esUnanimidad =
          votacionStore.itemsVotacion.length > 0 &&
          votacionStore.itemsVotacion.every(
            (item) => item.tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS
          );

        console.log("[Controller][VotacionDirectores] Detección de tipo de votación:", {
          esUnanimidad,
          itemsCount: votacionStore.itemsVotacion.length,
          items: votacionStore.itemsVotacion.map((item) => ({
            label: item.label,
            tipoAprobacion: item.tipoAprobacion,
          })),
        });

        // ✅ Actualizar método de votación en el store
        if (esUnanimidad) {
          directoresStore.setMetodoVotacion("unanimidad");
          // Si es unanimidad, extraer candidatos seleccionados (solo los que tienen items)
          const candidatosSeleccionados = votacionStore.itemsVotacion.map(
            (item) => item.label
          );
          directoresStore.setCandidatosSeleccionadosUnanimidad(candidatosSeleccionados);
          console.log(
            "[Controller][VotacionDirectores] Unanimidad detectada, candidatos:",
            candidatosSeleccionados
          );
        } else {
          // Si es mayoría acumulativa, convertir votos y establecer método
          directoresStore.setMetodoVotacion("mayoria");
          convertirVotosBackendALocal();
        }
      }
    } catch (error: any) {
      console.error("[Controller][VotacionDirectores] Error al cargar datos:", error);
      error.value = error.message || "Error al cargar datos";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Obtener candidatos (directores titulares con isCandidate: true)
   */
  const candidatos = computed(() => {
    return nombramientoStore.directoresTitularesCandidatos;
  });

  /**
   * Obtener votantes (accionistas que asistieron con sus acciones)
   */
  const votantes = computed(() => {
    return mapearVotantesDesdeSnapshot();
  });

  /**
   * Obtener cantidad de directores (prioridad a directoryConfigStore, fallback a snapshot)
   */
  const cantidadDirectores = computed(() => {
    // 1. Prioridad: Si se configuró en cantidad.vue
    if (directoryConfigStore.configuration?.cantidadDirectores) {
      return directoryConfigStore.configuration.cantidadDirectores;
    }

    // 2. Fallback: Snapshot (valor original de la sociedad)
    return snapshotStore.snapshot?.directory?.cantidadDirectores || 0;
  });

  /**
   * ✅ Calcular cupos disponibles para directores
   * Cupos = Tamaño del Directorio - Directores Actuales
   * Donde Directores Actuales = Directores del snapshot que NO fueron removidos
   */
  const cuposDisponibles = computed(() => {
    const tamañoDirectorio = cantidadDirectores.value;
    const directoresActuales = nombramientoStore.directoresDisponiblesDelSnapshot.length; // Ya filtra removidos
    const cupos = tamañoDirectorio - directoresActuales;
    return Math.max(0, cupos); // No permitir valores negativos
  });

  /**
   * Convertir votos del formato backend (VoteItem[]) al formato local (useDirectoresStore)
   * (para cargar votación existente)
   *
   * ⚠️ IMPORTANTE: Si hay votos duplicados del mismo accionista para el mismo candidato, se suman
   */
  function convertirVotosBackendALocal() {
    const items = votacionStore.itemsVotacion;
    const votantesArray = votantes.value;
    const candidatosArray = candidatos.value;

    console.log("🔍 [Controller][convertirVotosBackendALocal] ========== INICIO ==========");
    console.log("[Controller][convertirVotosBackendALocal] Iniciando conversión:", {
      itemsCount: items.length,
      votantesCount: votantesArray.length,
      candidatosCount: candidatosArray.length,
    });

    // ✅ LOG DETALLADO: Candidatos disponibles
    console.log(
      "🔍 [Controller][convertirVotosBackendALocal] Candidatos disponibles:",
      candidatosArray.map((c) => ({
        personaId: c.person?.id,
        nombreCompleto: `${c.person?.nombre || ""} ${c.person?.apellidoPaterno || ""} ${
          c.person?.apellidoMaterno || ""
        }`.trim(),
      }))
    );

    // ✅ LOG DETALLADO: Votantes disponibles
    console.log(
      "🔍 [Controller][convertirVotosBackendALocal] Votantes disponibles:",
      votantesArray.map((v, idx) => ({
        index: idx,
        accionistaId: v.accionistaId,
        nombreCompleto: v.nombreCompleto,
      }))
    );

    // ✅ LOG DETALLADO: Items del backend
    console.log(
      "🔍 [Controller][convertirVotosBackendALocal] Items del backend:",
      items.map((item) => ({
        id: item.id,
        personaId: item.personaId,
        label: item.label,
        votosCount: item.votos?.length || 0,
        votos: item.votos?.map((v) => ({ accionistaId: v.accionistaId, valor: v.valor })),
      }))
    );

    // Crear mapa de personaId → candidato (para mapear items a candidatos)
    const candidatosPorPersonaId = new Map(candidatosArray.map((c) => [c.person.id || "", c]));

    // Crear mapa de accionistaId → índice (para mapear accionistaId a índice)
    const indicePorAccionistaId = new Map(
      votantesArray.map((v, idx) => [v.accionistaId, idx])
    );

    // ✅ Map para sumar votos duplicados: clave = "candidatoNombreCompleto-accionistaIndex"
    const votosMap = new Map<string, number>();

    items.forEach((item, itemIndex) => {
      console.log(
        `🔍 [Controller][convertirVotosBackendALocal] Procesando item ${itemIndex + 1}/${
          items.length
        }:`,
        {
          itemId: item.id,
          personaId: item.personaId,
          label: item.label,
        }
      );

      if (!item.personaId) {
        console.warn("⚠️ [Controller][convertirVotosBackendALocal] Item sin personaId:", item);
        return;
      }

      const candidato = candidatosPorPersonaId.get(item.personaId);
      if (!candidato) {
        console.warn(
          "⚠️ [Controller][convertirVotosBackendALocal] Candidato NO encontrado para personaId:",
          item.personaId,
          "| Candidatos disponibles:",
          Array.from(candidatosPorPersonaId.keys())
        );
        return;
      }

      const nombreCompleto = `${candidato.person.nombre} ${candidato.person.apellidoPaterno} ${
        candidato.person.apellidoMaterno || ""
      }`.trim();

      console.log(`✅ [Controller][convertirVotosBackendALocal] Candidato encontrado:`, {
        personaId: item.personaId,
        nombreCompleto,
      });

      // ✅ Sumar todos los votos del mismo accionista para este candidato
      // (puede haber votos duplicados en el backend)
      item.votos.forEach((voto, votoIndex) => {
        const accionistaIndex = indicePorAccionistaId.get(voto.accionistaId);
        if (accionistaIndex === undefined) {
          console.warn(
            "⚠️ [Controller][convertirVotosBackendALocal] Accionista NO encontrado para accionistaId:",
            voto.accionistaId,
            "| Votantes disponibles:",
            Array.from(indicePorAccionistaId.keys())
          );
          return;
        }

        // ✅ Convertir string a número si es necesario (el backend puede devolver strings)
        const cantidad =
          typeof voto.valor === "number"
            ? voto.valor
            : typeof voto.valor === "string"
            ? Number(voto.valor) || 0
            : 0;

        // ✅ Clave única: personaId-accionistaIndex (para sumar duplicados)
        // Usar personaId en lugar de nombreCompleto es más robusto (único e inmutable)
        const clave = item.personaId
          ? `${item.personaId}-${accionistaIndex}`
          : `${nombreCompleto}-${accionistaIndex}`; // Fallback a nombreCompleto si no hay personaId
        const cantidadActual = votosMap.get(clave) || 0;
        votosMap.set(clave, cantidadActual + cantidad);

        console.log(`  📝 [Controller][convertirVotosBackendALocal] Voto ${votoIndex + 1}:`, {
          accionistaId: voto.accionistaId,
          accionistaIndex,
          cantidad,
          clave,
          cantidadAnterior: cantidadActual,
          cantidadNueva: cantidadActual + cantidad,
        });
      });
    });

    // ✅ Convertir map a array (ya sin duplicados, sumados)
    // ⚠️ IMPORTANTE: La clave tiene formato "personaId-accionistaIndex" (o "nombreCompleto-accionistaIndex" como fallback)
    const votosAsignados = Array.from(votosMap.entries())
      .map(([clave, cantidad]) => {
        // Buscar el último guion (que separa el personaId/nombreCompleto del índice)
        const lastDashIndex = clave.lastIndexOf("-");
        if (lastDashIndex === -1) {
          console.warn(
            "[Controller][convertirVotosBackendALocal] Clave inválida (sin guion):",
            clave
          );
          return null;
        }

        const identificador = clave.substring(0, lastDashIndex); // personaId o nombreCompleto
        const accionistaIndexStr = clave.substring(lastDashIndex + 1);
        const accionistaIndex = Number(accionistaIndexStr);

        if (Number.isNaN(accionistaIndex)) {
          console.warn(
            "[Controller][convertirVotosBackendALocal] Índice de accionista inválido:",
            accionistaIndexStr
          );
          return null;
        }

        // Buscar el candidato para obtener nombreCompleto
        // Si identificador es un UUID (personaId), buscar por person.id
        // Si no, es nombreCompleto (fallback)
        const esUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          identificador
        );
        const candidato = esUUID
          ? candidatosArray.find((c) => c.person.id === identificador)
          : null;
        const nombreCompleto = candidato
          ? `${candidato.person.nombre} ${candidato.person.apellidoPaterno} ${
              candidato.person.apellidoMaterno || ""
            }`.trim()
          : identificador; // Fallback: usar identificador como nombreCompleto si no es UUID

        return {
          candidatoNombreCompleto: nombreCompleto,
          candidatoPersonaId: esUUID ? identificador : undefined, // Solo incluir si es UUID válido
          accionistaIndex,
          cantidad,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    console.log("🔍 [Controller][convertirVotosBackendALocal] Votos convertidos:", {
      votosAsignadosCount: votosAsignados.length,
      votosAsignados: votosAsignados, // TODOS los votos para debug completo
      resumen: votosAsignados.map((v) => ({
        candidatoNombreCompleto: v.candidatoNombreCompleto,
        candidatoPersonaId: v.candidatoPersonaId,
        accionistaIndex: v.accionistaIndex,
        cantidad: v.cantidad,
        clave: v.candidatoPersonaId
          ? `${v.candidatoPersonaId}-${v.accionistaIndex}`
          : `${v.candidatoNombreCompleto}-${v.accionistaIndex}`,
      })),
    });

    // Actualizar useDirectoresStore con los votos cargados
    console.log("🔍 [Controller][convertirVotosBackendALocal] Guardando votos en store...");
    directoresStore.setVotosAsignados(votosAsignados);
    console.log(
      "✅ [Controller][convertirVotosBackendALocal] Votos guardados en store. Store ahora tiene:",
      directoresStore.votosAsignados.length,
      "votos"
    );
    console.log("🔍 [Controller][convertirVotosBackendALocal] ========== FIN ==========");
  }

  /**
   * Convertir votos del formato local (useDirectoresStore) al formato backend (VoteItem[])
   *
   * Formato local:
   * Array<{ candidatoNombreCompleto: string; accionistaIndex: number; cantidad: number }>
   *
   * Formato backend:
   * VoteItem[] donde cada item tiene votos: VoteEntry[]
   */
  function convertirVotosLocalABackend(
    votosAsignados: Array<{
      candidatoNombreCompleto: string;
      accionistaIndex: number;
      cantidad: number;
    }>,
    votantesArray: typeof votantes.value,
    candidatosArray: typeof candidatos.value
  ): VoteItem[] {
    // Agrupar votos por candidato
    const votosPorCandidato = new Map<string, VoteEntry[]>();

    candidatosArray.forEach((candidato) => {
      const nombreCompleto = `${candidato.person.nombre} ${candidato.person.apellidoPaterno} ${
        candidato.person.apellidoMaterno || ""
      }`.trim();

      // Buscar votos de este candidato
      const votosDelCandidato = votosAsignados.filter(
        (v) => v.candidatoNombreCompleto === nombreCompleto
      );

      // Convertir a VoteEntry[]
      const votosBackend: VoteEntry[] = votosDelCandidato
        .map((votoLocal) => {
          const votante = votantesArray[votoLocal.accionistaIndex];
          if (!votante) return null;

          return {
            id: votacionStore.generateUuid(),
            accionistaId: votante.accionistaId, // ✅ ShareholderV2.id
            valor: votoLocal.cantidad, // ✅ NÚMERO (no string)
          };
        })
        .filter((v): v is VoteEntry => v !== null);

      votosPorCandidato.set(nombreCompleto, votosBackend);
    });

    // Construir VoteItem[] (uno por cada candidato)
    const items: VoteItem[] = candidatosArray.map((candidato, index) => {
      const nombreCompleto = `${candidato.person.nombre} ${candidato.person.apellidoPaterno} ${
        candidato.person.apellidoMaterno || ""
      }`.trim();

      // Obtener personaId del candidato (necesario para mapear después)
      // El backend devuelve person.id en DesignationDirectorResponseDTO
      const personaId = candidato.person?.id || undefined;

      // ✅ Si hay votación existente, intentar usar el itemId y votos existentes
      const itemExistente = personaId ? votacionStore.getItemByPersonaId(personaId) : null;

      // ✅ Si hay item existente, usar sus votos existentes como base
      // Luego se compararán con los nuevos votos para construir operaciones
      const votosExistentes = itemExistente?.votos || [];
      const votosNuevos = votosPorCandidato.get(nombreCompleto) || [];

      // ✅ Si hay item existente, mantener los IDs de votos existentes cuando sea posible
      // Esto es importante para poder hacer updateVote en lugar de siempre addVote
      const votosFinales: VoteEntry[] = [];
      if (itemExistente && votosExistentes.length > 0) {
        // Si hay votos existentes, intentar mapear los nuevos votos a los existentes
        const votosExistentesMap = new Map(votosExistentes.map((v) => [v.accionistaId, v]));

        votosNuevos.forEach((votoNuevo) => {
          const votoExistente = votosExistentesMap.get(votoNuevo.accionistaId);
          if (votoExistente) {
            // Si existe, mantener el ID existente pero actualizar el valor
            votosFinales.push({
              id: votoExistente.id, // ✅ Mantener ID existente
              accionistaId: votoNuevo.accionistaId,
              valor: votoNuevo.valor,
            });
          } else {
            // Si no existe, usar nuevo ID
            votosFinales.push(votoNuevo);
          }
        });
      } else {
        // Si no hay item existente o no tiene votos, usar los nuevos votos directamente
        votosFinales.push(...votosNuevos);
      }

      return {
        id: itemExistente?.id || votacionStore.generateUuid(),
        orden: itemExistente?.orden ?? index,
        label: nombreCompleto,
        descripcion: itemExistente?.descripción || "Candidato a director titular",
        personaId: personaId, // ✅ PersonV2.id del candidato
        tipoAprobacion: itemExistente?.tipoAprobacion || VoteAgreementType.SOMETIDO_A_VOTACION,
        votos: votosFinales,
      };
    });

    return items;
  }

  /**
   * Calcular quiénes fueron elegidos (top N según cantidadDirectores)
   */
  function calcularElegidos(
    items: VoteItem[]
  ): Array<{ itemId: string; directorId: string; totalVotos: number }> {
    // Sumar votos por candidato (suma de todos los accionistas)
    const votosPorCandidato = items.map((item) => {
      const totalVotos = item.votos.reduce(
        (sum, voto) => sum + (typeof voto.valor === "number" ? voto.valor : 0),
        0
      );
      return {
        itemId: item.id,
        directorId: "", // Se obtendrá después
        personaId: item.personaId || "",
        totalVotos,
      };
    });

    // Ordenar por total de votos descendente
    const sorted = votosPorCandidato.sort((a, b) => b.totalVotos - a.totalVotos);

    // ✅ Seleccionar top N (donde N = cuposDisponibles, NO cantidadDirectores)
    const cantidad = cuposDisponibles.value;
    const elegidos = sorted.slice(0, cantidad);

    // Mapear personaId → directorId usando candidatos
    return elegidos.map((elegido) => {
      // Buscar candidato que tenga el mismo person.id
      const candidato = candidatos.value.find((c) => c.person.id === elegido.personaId);
      return {
        itemId: elegido.itemId,
        directorId: candidato?.id || "", // ✅ ID del DirectorFlowAction (DesignationDirectorResponseDTO.id)
        totalVotos: elegido.totalVotos,
      };
    });
  }

  /**
   * Guardar votación por unanimidad
   * Para unanimidad: todos los candidatos seleccionados se marcan como elegidos
   * Se crea votación con tipoAprobacion: APROBADO_POR_TODOS
   */
  async function guardarVotacionUnanimidad(candidatosSeleccionados: string[]) {
    try {
      isLoading.value = true;
      error.value = null;

      // 1. Crear items solo para candidatos seleccionados con tipoAprobacion: APROBADO_POR_TODOS
      const items: VoteItem[] = candidatos.value
        .filter((candidato) => {
          const nombreCompleto = `${candidato.person.nombre} ${
            candidato.person.apellidoPaterno
          } ${candidato.person.apellidoMaterno || ""}`.trim();
          return candidatosSeleccionados.includes(nombreCompleto);
        })
        .map((candidato, index) => {
          const nombreCompleto = `${candidato.person.nombre} ${
            candidato.person.apellidoPaterno
          } ${candidato.person.apellidoMaterno || ""}`.trim();
          const personaId = candidato.person?.id || undefined;

          // Si hay votación existente, intentar usar el itemId existente
          const itemExistente = personaId ? votacionStore.getItemByPersonaId(personaId) : null;

          return {
            id: itemExistente?.id || votacionStore.generateUuid(),
            orden: index,
            label: nombreCompleto,
            descripcion: "Candidato a director titular (unanimidad)",
            personaId: personaId,
            tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS,
            votos: [], // Para unanimidad, los votos se generan automáticamente en el backend
          };
        });

      // 2. Guardar votación en backend
      await votacionStore.guardarVotacion(societyId.value, flowId.value, items);

      // 3. Para unanimidad, todos los candidatos seleccionados son elegidos
      const candidatosSeleccionadosIds = new Set(
        candidatos.value
          .filter((candidato) => {
            const nombreCompleto = `${candidato.person.nombre} ${
              candidato.person.apellidoPaterno
            } ${candidato.person.apellidoMaterno || ""}`.trim();
            return candidatosSeleccionados.includes(nombreCompleto);
          })
          .map((c) => c.id)
      );

      // 4. Marcar estados (ELEGIDO para seleccionados, NO_ELEGIDO para el resto)
      for (const candidato of candidatos.value) {
        const estado = candidatosSeleccionadosIds.has(candidato.id)
          ? ("ELEGIDO" as const)
          : ("NO_ELEGIDO" as const);

        await nombramientoStore.updateEstadoDirector(
          societyId.value,
          flowId.value,
          candidato.id,
          estado
        );
      }

      console.log("[Controller][VotacionDirectores] Votación por unanimidad guardada:", {
        itemsCount: items.length,
        candidatosSeleccionadosCount: candidatosSeleccionados.length,
      });
    } catch (error: any) {
      console.error(
        "[Controller][VotacionDirectores] Error al guardar votación unanimidad:",
        error
      );
      error.value = error.message || "Error al guardar votación";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Guardar votación completa (mayoría acumulativa)
   */
  async function guardarVotacion(
    votosAsignados: Array<{
      candidatoNombreCompleto: string;
      accionistaIndex: number;
      cantidad: number;
    }>
  ) {
    try {
      isLoading.value = true;
      error.value = null;

      // 1. Convertir votos del formato local al formato backend
      const items = convertirVotosLocalABackend(
        votosAsignados,
        votantes.value,
        candidatos.value
      );

      // 2. Guardar votación en backend (create o update según corresponda)
      await votacionStore.guardarVotacion(societyId.value, flowId.value, items);

      // ✅ 2.1. Recargar votación desde el backend para sincronizar estado local
      // (esto asegura que después de guardar, el estado local tenga los datos correctos)
      await votacionStore.loadVotacion(societyId.value, flowId.value);

      // ✅ 2.2. Esperar un tick para asegurar que el store se actualice
      await nextTick();

      // 3. Calcular elegidos (usar items recargados del store si están disponibles)
      const itemsParaCalcular =
        votacionStore.itemsVotacion.length > 0 ? votacionStore.itemsVotacion : items;
      const elegidos = calcularElegidos(itemsParaCalcular);

      // 4. Marcar estados (ELEGIDO/NO_ELEGIDO)
      const elegidosIds = new Set(elegidos.map((e) => e.directorId));

      for (const candidato of candidatos.value) {
        const estado = elegidosIds.has(candidato.id)
          ? ("ELEGIDO" as const)
          : ("NO_ELEGIDO" as const);

        await nombramientoStore.updateEstadoDirector(
          societyId.value,
          flowId.value,
          candidato.id, // designationId (ID del DirectorFlowAction)
          estado
        );
      }

      console.log("[Controller][VotacionDirectores] Votación guardada exitosamente:", {
        itemsCount: items.length,
        elegidosCount: elegidos.length,
        elegidos: elegidos.map((e) => ({
          directorId: e.directorId,
          totalVotos: e.totalVotos,
        })),
      });
    } catch (error: any) {
      console.error("[Controller][VotacionDirectores] Error al guardar votación:", error);
      error.value = error.message || "Error al guardar votación";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // Estados
    isLoading,
    error,

    // Funciones
    loadData,
    guardarVotacion,
    guardarVotacionUnanimidad, // ✅ Para unanimidad

    // Computed
    candidatos,
    votantes,
    cantidadDirectores,
    cuposDisponibles, // ✅ Exponer cupos disponibles
  };
}
