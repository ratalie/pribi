import { computed, onActivated, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";
import { useAportesManagerStore } from "../../aportes/stores/useAportesManagerStore";
import { useVotacionAportesStore } from "../stores/useVotacionAportesStore";
import { useVotacionStore } from "../stores/useVotacionStore";

/**
 * Controller para la vista de Votación de Aporte Dinerario
 *
 * Orquesta:
 * - Carga de datos (asistentes, aportes, snapshot)
 * - Carga/creación de sesión de votación
 * - Generación de texto de votación
 * - Guardado de votos
 */
export function useVotacionController() {
  const route = useRoute();
  const votacionStore = useVotacionStore();
  const votacionAportesStore = useVotacionAportesStore();
  const asistenciaStore = useAsistenciaStore();
  const aportesStore = useAportesManagerStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Estado para participantes (aportantes)
  const participantes = ref<any[]>([]);
  const contribuciones = ref<any[]>([]);

  /**
   * Cargar participantes (aportantes) desde el backend
   */
  async function loadParticipantes() {
    try {
      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}/api/v2/society-profile/${societyId.value}/register-assembly/${flowId.value}/participants`;

      console.log("[DEBUG][VotacionController] Cargando participantes desde:", url);

      const response = await $fetch<{
        success: boolean;
        message: string;
        data: any[];
      }>(url, {
        ...withAuthHeaders(),
        method: "GET",
      });

      if (response.success && Array.isArray(response.data)) {
        participantes.value = response.data;
        console.log(
          "[DEBUG][VotacionController] Participantes cargados:",
          participantes.value.length
        );
      }
    } catch (error: any) {
      console.error("[Controller][Votacion] Error al cargar participantes:", error);
      // No lanzar error, solo loguear
    }
  }

  /**
   * Cargar contribuciones (aportes) desde el backend
   */
  async function loadContribuciones() {
    try {
      const baseUrl = resolveBaseUrl();
      const url = `${baseUrl}/api/v2/society-profile/${societyId.value}/register-assembly/${flowId.value}/contributions`;

      console.log("[DEBUG][VotacionController] Cargando contribuciones desde:", url);

      const response = await $fetch<{
        success: boolean;
        message: string;
        data: any[];
      }>(url, {
        ...withAuthHeaders(),
        method: "GET",
      });

      if (response.success && Array.isArray(response.data)) {
        contribuciones.value = response.data;
        console.log(
          "[DEBUG][VotacionController] Contribuciones cargadas:",
          contribuciones.value.length
        );
      }
    } catch (error: any) {
      console.error("[Controller][Votacion] Error al cargar contribuciones:", error);
      // No lanzar error, solo loguear
    }
  }

  /**
   * Resolver URL base (helper)
   */
  function resolveBaseUrl(): string {
    const config = useRuntimeConfig();
    const apiBase = (config.public?.apiBase as string | undefined) || "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const candidates = [apiBase, origin, "http://localhost:3000"];

    for (const base of candidates) {
      if (!base) continue;
      try {
        return new URL(base, origin || "http://localhost:3000").origin;
      } catch {
        continue;
      }
    }
    return "";
  }

  /**
   * Cargar todos los datos necesarios
   */
  async function loadData() {
    try {
      // 1. Cargar snapshot (para capital actual)
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // 2. Cargar asistentes (para obtener votantes - solo los que asistieron)
      console.log("[DEBUG][VotacionController] Cargando asistentes...");
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
      console.log(
        "[DEBUG][VotacionController] Asistentes cargados:",
        asistenciaStore.asistencias
      );
      console.log(
        "[DEBUG][VotacionController] Asistentes que asistieron:",
        asistenciaStore.asistencias.filter((a) => a.asistio)
      );

      // 3. Cargar participantes (aportantes) - para mostrar en la vista
      // Los participantes son los que pueden aportar (isContributor: true)
      console.log("[DEBUG][VotacionController] Cargando participantes...");
      await loadParticipantes();

      // 4. Cargar aportes (contribuciones) - para calcular capital después
      await aportesStore.loadAportes(String(societyId.value), String(flowId.value));

      // Cargar contribuciones para mostrar en la vista
      await loadContribuciones();

      // 5. Actualizar datos calculados
      votacionAportesStore.actualizarDatos();

      // 6. ✅ SOLO CARGAR votación existente (NO crear automáticamente)
      // La votación se creará/actualizará cuando el usuario haga click en "Siguiente"
      try {
        await votacionStore.loadVotacion(
          societyId.value,
          flowId.value,
          VoteContext.APORTES_DINERARIOS
        );
        console.log("[DEBUG][VotacionController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          hasItem: !!votacionStore.itemVotacion,
          itemId: votacionStore.itemVotacion?.id,
          votosCount: votacionStore.itemVotacion?.votos.length || 0,
          votos: votacionStore.itemVotacion?.votos.map((v) => ({
            id: v.id,
            accionistaId: v.accionistaId,
            valor: v.valor,
          })),
        });
      } catch (error: any) {
        // Si no existe (404), es normal - se creará al guardar
        if (error.statusCode === 404 || error.status === 404) {
          console.log(
            "[DEBUG][VotacionController] No hay votación existente (404), se creará al guardar"
          );
        } else {
          console.error("[Controller][Votacion] Error al cargar votación:", error);
        }
      }

      // ✅ DEBUG: Estado final después de carga
      console.log("[DEBUG][VotacionController] Carga de datos completada:", {
        hasVotacion: votacionStore.hasVotacion,
        hasItem: !!votacionStore.itemVotacion,
        votantesCount: votantes.value.length,
        participantesCount: participantes.value.length,
        contribucionesCount: contribuciones.value.length,
      });
    } catch (error: any) {
      console.error("[Controller][Votacion] Error al cargar datos:", error);
      throw error;
    }
  }

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
        "[DEBUG][VotacionController] No hay snapshot disponible para mapear votantes"
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
          accionesConDerechoVoto: item.totalAccionesConDerechoVoto, // ✅ AGREGADO
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    return votantes;
  }

  /**
   * Obtener votantes (solo asistentes) con formato para componentes
   * ✅ FUENTE DE VERDAD: Snapshot (calcula accionesConDerechoVoto desde snapshot)
   */
  const votantes = computed(() => {
    const votantesMapeados = mapearVotantesDesdeSnapshot();
    console.log(
      "[DEBUG][VotacionController] Votantes mapeados desde snapshot:",
      votantesMapeados
    );
    votantesMapeados.forEach((v, i) => {
      console.log(`[DEBUG][VotacionController] Votante ${i}:`, {
        id: v.id,
        accionistaId: v.accionistaId,
        nombreCompleto: v.nombreCompleto,
        accionesConDerechoVoto: v.accionesConDerechoVoto, // ✅ Verificar que esté presente
      });
    });
    return votantesMapeados;
  });

  /**
   * Obtener texto de votación
   */
  const textoVotacion = computed(() => {
    if (votacionStore.itemVotacion) {
      return votacionStore.itemVotacion.label;
    }
    return votacionAportesStore.textoVotacion;
  });

  /**
   * Obtener voto de un accionista
   */
  function getVoto(accionistaId: string): VoteValue | null {
    const voto = votacionStore.getVotoByAccionista(accionistaId);
    if (!voto) return null;
    return voto.valor as VoteValue;
  }

  /**
   * Establecer voto de un accionista (SOLO actualiza estado local, NO guarda, NO hace fetch)
   * ⚠️ IMPORTANTE: Si no hay sesión/item, se crea en memoria (se guardará al hacer "Siguiente")
   */
  function setVoto(accionistaId: string, valor: VoteValue) {
    // ✅ Si no hay sesión, crear en memoria (NO guardar todavía)
    if (!votacionStore.sesionVotacion) {
      console.log(
        "[DEBUG][VotacionController] Creando sesión en memoria al votar (no guardada todavía)"
      );
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = votacionAportesStore.textoVotacion;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.APORTES_DINERARIOS,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción: "Votación sobre la aprobación de los aportes dinerarios propuestos",
            tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION, // Por defecto mayoría al votar
            votos: [],
          },
        ],
      };
    }

    // ✅ Si hay sesión pero no hay item, crear item en memoria
    if (!votacionStore.itemVotacion) {
      console.log(
        "[DEBUG][VotacionController] Creando item en memoria al votar (no guardado todavía)"
      );
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = votacionAportesStore.textoVotacion;

      votacionStore.sesionVotacion.items.push({
        id: itemId,
        orden: 0,
        label: textoVotacionValue,
        descripción: "Votación sobre la aprobación de los aportes dinerarios propuestos",
        tipoAprobacion: VoteAgreementType.SOMETIDO_A_VOTACION, // Por defecto mayoría al votar
        votos: [],
      });
    }

    const item = votacionStore.itemVotacion;
    if (!item) {
      console.error("[Controller][Votacion] No se pudo crear item");
      return;
    }

    // ✅ Actualizar o agregar voto en memoria (NO guardar todavía)
    const votoExistente = item.votos.find((v) => v.accionistaId === accionistaId);

    if (votoExistente) {
      // Actualizar voto existente en estado local
      votoExistente.valor = valor as string | number;
      console.log("[DEBUG][VotacionController] Voto actualizado en memoria:", {
        accionistaId,
        valor,
      });
    } else {
      // Agregar nuevo voto en estado local
      const voteId = votacionStore.generateUuid();
      item.votos.push({
        id: voteId,
        accionistaId,
        valor: valor as string | number,
      });
      console.log("[DEBUG][VotacionController] Voto agregado en memoria:", {
        accionistaId,
        valor,
        voteId,
      });
    }
  }

  /**
   * Cambiar tipo de aprobación (SOLO actualiza estado local, NO guarda, NO hace fetch)
   * ⚠️ IMPORTANTE: tipoAprobacion ahora está en el item, no en la sesión
   * ⚠️ IMPORTANTE: Si no hay sesión/item, se crea en memoria (se guardará al hacer "Siguiente")
   */
  function cambiarTipoAprobacion(tipo: "unanimidad" | "mayoria") {
    console.log("[DEBUG][VotacionController] cambiarTipoAprobacion llamado:", {
      tipo,
      hasVotacion: votacionStore.hasVotacion,
      hasSesion: !!votacionStore.sesionVotacion,
      hasItem: !!votacionStore.itemVotacion,
    });

    const tipoAprobacion =
      tipo === "unanimidad"
        ? VoteAgreementType.APROBADO_POR_TODOS
        : VoteAgreementType.SOMETIDO_A_VOTACION;

    // ✅ Si no hay sesión, crear en memoria (NO guardar todavía)
    if (!votacionStore.sesionVotacion) {
      console.log(
        "[DEBUG][VotacionController] Creando sesión en memoria (no guardada todavía)"
      );
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = votacionAportesStore.textoVotacion;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.APORTES_DINERARIOS,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción: "Votación sobre la aprobación de los aportes dinerarios propuestos",
            tipoAprobacion,
            votos: [],
          },
        ],
      };
    } else {
      // ✅ Si hay sesión pero no hay item, crear item en memoria
      if (!votacionStore.itemVotacion) {
        console.log(
          "[DEBUG][VotacionController] Creando item en memoria (no guardado todavía)"
        );
        const itemId = votacionStore.generateUuid();
        const textoVotacionValue = votacionAportesStore.textoVotacion;

        votacionStore.sesionVotacion.items.push({
          id: itemId,
          orden: 0,
          label: textoVotacionValue,
          descripción: "Votación sobre la aprobación de los aportes dinerarios propuestos",
          tipoAprobacion,
          votos: [],
        });
      } else {
        // ✅ Actualizar tipoAprobacion en el item existente (solo en memoria)
        const item = votacionStore.itemVotacion;
        item.tipoAprobacion = tipoAprobacion;
        console.log("[DEBUG][VotacionController] Tipo de aprobación actualizado en memoria:", {
          tipo,
          tipoAprobacion,
          itemId: item.id,
        });
      }
    }
  }

  /**
   * Guardar votación (para useJuntasFlowNext)
   * ⚠️ IMPORTANTE: Esta función se ejecuta SOLO cuando el usuario hace click en "Siguiente"
   *
   * Lógica:
   * 1. Si no hay sesión/item en memoria, crearlos con datos actuales
   * 2. Si es unanimidad: generar todos los votos a favor automáticamente
   * 3. Si es sometida a votos: usar los votos que el usuario haya seleccionado
   * 4. Crear o actualizar la votación en el backend
   */
  async function guardarVotacion() {
    console.log(
      "[DEBUG][VotacionController] guardarVotacion() ejecutado - Iniciando guardado..."
    );

    // ✅ 1. Asegurar que hay sesión/item en memoria (crear si no existe)
    if (!votacionStore.sesionVotacion) {
      console.log("[DEBUG][VotacionController] No hay sesión en memoria, creando...");
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = votacionAportesStore.textoVotacion;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.APORTES_DINERARIOS,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción: "Votación sobre la aprobación de los aportes dinerarios propuestos",
            tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS, // Por defecto unanimidad
            votos: [],
          },
        ],
      };
    }

    const item = votacionStore.itemVotacion;
    if (!item) {
      console.log("[DEBUG][VotacionController] No hay item en memoria, creando...");
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = votacionAportesStore.textoVotacion;

      votacionStore.sesionVotacion.items.push({
        id: itemId,
        orden: 0,
        label: textoVotacionValue,
        descripción: "Votación sobre la aprobación de los aportes dinerarios propuestos",
        tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS, // Por defecto unanimidad
        votos: [],
      });
    }

    const finalItem = votacionStore.itemVotacion!;
    const tipoAprobacion = finalItem.tipoAprobacion || VoteAgreementType.APROBADO_POR_TODOS;

    console.log("[DEBUG][VotacionController] Estado antes de guardar:", {
      tipoAprobacion,
      votosActuales: finalItem.votos.length,
      votantesDisponibles: votantes.value.length,
    });

    try {
      // ✅ 2. Si es unanimidad, generar todos los votos a favor automáticamente
      if (tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS) {
        console.log(
          "[DEBUG][VotacionController] Es unanimidad - generando todos los votos a favor"
        );

        // Limpiar votos existentes y generar nuevos para todos los votantes
        finalItem.votos = votantes.value.map((votante) => ({
          id: votacionStore.generateUuid(),
          accionistaId: votante.accionistaId,
          valor: VoteValue.A_FAVOR,
        }));

        console.log(
          "[DEBUG][VotacionController] Votos generados para unanimidad:",
          finalItem.votos.length
        );
      } else {
        // ✅ 3. Si es sometida a votos, validar que haya votos
        if (finalItem.votos.length === 0) {
          throw new Error("Debe registrar al menos un voto para votación por mayoría");
        }
        console.log(
          "[DEBUG][VotacionController] Es sometida a votos - usando votos del usuario:",
          finalItem.votos.length
        );
      }

      // ✅ 4. Actualizar la sesión en memoria con los votos generados/seleccionados
      // Asegurar que el item tenga los datos correctos
      const itemEnSesion = votacionStore.sesionVotacion!.items[0];
      if (itemEnSesion) {
        itemEnSesion.id = finalItem.id;
        itemEnSesion.label = finalItem.label;
        itemEnSesion.descripción = finalItem.descripción;
        itemEnSesion.tipoAprobacion = finalItem.tipoAprobacion;
        itemEnSesion.votos = finalItem.votos; // ✅ Actualizar con votos generados/seleccionados
      }

      // ✅ 5. Crear o actualizar la votación en el backend
      // ⚠️ IMPORTANTE: Enviar TODO en un solo request (item + votos)
      const existeEnBackend = votacionStore.hasVotacion;
      const itemExisteEnBackend = existeEnBackend && !!votacionStore.itemVotacion;

      console.log("[DEBUG][VotacionController] Estado antes de guardar:", {
        existeEnBackend,
        itemExisteEnBackend,
        sessionId: votacionStore.sesionVotacion!.id,
        itemId: finalItem.id,
        tipoAprobacion,
        votosCount: finalItem.votos.length,
      });

      if (!existeEnBackend) {
        // ✅ Crear nueva votación con POST (incluyendo item + votos en un solo request)
        console.log(
          "[DEBUG][VotacionController] Creando nueva votación en backend (POST con todo)..."
        );
        console.log("[DEBUG][VotacionController] Datos a crear:", {
          sessionId: votacionStore.sesionVotacion!.id,
          itemId: finalItem.id,
          tipoAprobacion,
          votosCount: finalItem.votos.length,
        });

        // ✅ Asegurar que la sesión en memoria tenga los votos antes de crear
        votacionStore.sesionVotacion!.items[0] = finalItem;

        await votacionStore.createVotacion(
          societyId.value,
          flowId.value,
          finalItem.id,
          finalItem.label,
          finalItem.descripción,
          tipoAprobacion,
          VoteContext.APORTES_DINERARIOS
        );

        console.log("[DEBUG][VotacionController] Votación creada exitosamente");
      } else if (!itemExisteEnBackend) {
        // ✅ Sesión existe pero item no existe: usar PUT con accion: "add" (incluyendo votos)
        console.log(
          "[DEBUG][VotacionController] Agregando item a sesión existente (PUT con accion: 'add' incluyendo votos)..."
        );

        await votacionStore.addVoteItemConVotos(
          societyId.value,
          flowId.value,
          finalItem.id,
          finalItem.label,
          finalItem.descripción,
          tipoAprobacion,
          finalItem.votos,
          VoteContext.APORTES_DINERARIOS
        );

        console.log("[DEBUG][VotacionController] Item agregado exitosamente");
      } else {
        // ✅ Sesión e item existen: usar PUT con accion: "add" para reemplazar todo (incluyendo votos)
        // ⚠️ IMPORTANTE: Enviar todo en un solo request
        console.log(
          "[DEBUG][VotacionController] Actualizando item existente (PUT con accion: 'add' incluyendo votos)..."
        );

        await votacionStore.updateItemConVotos(
          societyId.value,
          flowId.value,
          finalItem.id,
          finalItem.label,
          finalItem.descripción,
          tipoAprobacion,
          finalItem.votos,
          VoteContext.APORTES_DINERARIOS
        );

        console.log("[DEBUG][VotacionController] Item actualizado exitosamente");
      }

      console.log("[DEBUG][VotacionController] Guardado completado exitosamente");
    } catch (error: any) {
      console.error("[Controller][Votacion] Error al guardar votación:", error);
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
    textoVotacion,
    participantes: computed(() => participantes.value), // ✅ Participantes (aportantes)
    contribuciones: computed(() => contribuciones.value), // ✅ Contribuciones (aportes)
    isLoading: computed(() => votacionStore.status === "loading"),
    error: computed(() => votacionStore.errorMessage),
    esUnanimidad: computed(() => votacionStore.esUnanimidad),
    esSometidaAVotacion: computed(() => votacionStore.esSometidaAVotacion),

    // Datos calculados
    capitalAntes: computed(() => votacionAportesStore.capitalAntes),
    accionesAntes: computed(() => votacionAportesStore.accionesAntes),
    capitalDespues: computed(() => votacionAportesStore.capitalDespues),
    accionesDespues: computed(() => votacionAportesStore.accionesDespues),

    // Métodos
    getVoto,
    setVoto,
    cambiarTipoAprobacion,
    guardarVotacion,
    loadData,
  };
}
