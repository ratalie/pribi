import { computed, onActivated, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteMode } from "~/core/hexag/juntas/domain/enums/vote-mode.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { useDirectoryConfigurationStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/stores/useDirectoryConfigurationStore";
import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { useVotacionConfiguracionStore } from "../stores/useVotacionConfiguracionStore";

/**
 * Controller para la vista de Votación de Configuración de Directorio (4 campos completos)
 *
 * Orquesta:
 * - Carga de datos (asistentes, snapshot, configuración de directorio)
 * - Carga/creación de sesión de votación
 * - Generación de texto de votación con los 4 campos (cantidad, duración, fecha inicio, fecha fin)
 * - Guardado de votos
 */
export function useVotacionConfiguracionController() {
  const route = useRoute();
  const votacionStore = useVotacionConfiguracionStore();
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();
  const directoryConfigStore = useDirectoryConfigurationStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  // Estados
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Mapeo de periodo del backend al texto legible
   */
  const periodoMap: Record<string, string> = {
    ONE_YEAR: "1 año",
    TWO_YEARS: "2 años",
    THREE_YEARS: "3 años",
  };

  /**
   * Formatear fecha ISO a formato DD/MM/YYYY
   */
  function formatearFecha(fechaISO: string | null | undefined): string {
    if (!fechaISO) return "";
    try {
      const fecha = new Date(fechaISO);
      if (isNaN(fecha.getTime())) return fechaISO;
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const año = fecha.getFullYear();
      return `${dia}/${mes}/${año}`;
    } catch {
      return fechaISO;
    }
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

      // 2. Cargar configuración de directorio
      try {
        await directoryConfigStore.loadConfiguration(societyId.value, flowId.value);
      } catch (error: any) {
        // Si no existe (404), es normal - se debe configurar primero
        if (error?.statusCode !== 404 && error?.status !== 404) {
          console.error(
            "[Controller][VotacionConfiguracion] Error al cargar configuración:",
            error
          );
        }
      }

      // 3. Cargar asistentes (para obtener votantes - solo los que asistieron)
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);

      // 4. Cargar votación existente (NO crear automáticamente)
      try {
        await votacionStore.loadVotacion(societyId.value, flowId.value);
        console.log("[DEBUG][VotacionConfiguracionController] Votación cargada:", {
          hasVotacion: votacionStore.hasVotacion,
          hasItem: !!votacionStore.itemVotacion,
          itemId: votacionStore.itemVotacion?.id,
          label: votacionStore.itemVotacion?.label,
          tipoAprobacion: votacionStore.itemVotacion?.tipoAprobacion,
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
            "[DEBUG][VotacionConfiguracionController] No hay votación existente (404), se creará al guardar"
          );
        } else {
          console.error(
            "[Controller][VotacionConfiguracion] Error al cargar votación:",
            error
          );
        }
      }

      // ✅ DEBUG: Estado final después de carga
      console.log("[DEBUG][VotacionConfiguracionController] Carga de datos completada:", {
        hasVotacion: votacionStore.hasVotacion,
        hasItem: !!votacionStore.itemVotacion,
        votantesCount: votantes.value.length,
        votantes: votantes.value.map((v) => ({
          id: v.id,
          accionistaId: v.accionistaId,
          nombreCompleto: v.nombreCompleto,
        })),
      });
    } catch (error: any) {
      console.error("[Controller][VotacionConfiguracion] Error al cargar datos:", error);
      error.value = error.message || "Error al cargar datos";
      throw error;
    } finally {
      isLoading.value = false;
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
    if ("razonSocial" in person) {
      return person.razonSocial || "";
    }
    return "";
  }

  /**
   * Mapper: Calcular votantes desde snapshot + asistencias
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
   * Obtener votantes (solo asistentes) con formato para componentes
   */
  const votantes = computed(() => {
    const votantesMapeados = mapearVotantesDesdeSnapshot();
    console.log(
      "[DEBUG][VotacionConfiguracionController] Votantes mapeados desde snapshot:",
      votantesMapeados.map((v) => ({
        id: v.id,
        accionistaId: v.accionistaId,
        nombreCompleto: v.nombreCompleto,
        accionesConDerechoVoto: v.accionesConDerechoVoto,
      }))
    );
    return votantesMapeados;
  });

  /**
   * Obtener configuración de directorio
   */
  const configuracion = computed(() => {
    return directoryConfigStore.configuration;
  });

  /**
   * Obtener cantidad de directores
   */
  const cantidadDirectores = computed(() => {
    return configuracion.value?.cantidadDirectores || 0;
  });

  /**
   * Obtener duración del directorio (texto legible)
   */
  const duracionDirectorio = computed(() => {
    const periodo = configuracion.value?.periodo;
    if (!periodo) return "";
    return periodoMap[periodo] || periodo;
  });

  /**
   * Obtener fecha de inicio (formateada)
   */
  const fechaInicio = computed(() => {
    return formatearFecha(configuracion.value?.inicioMandato);
  });

  /**
   * Obtener fecha de fin (formateada)
   */
  const fechaFin = computed(() => {
    return formatearFecha(configuracion.value?.finMandato);
  });

  /**
   * Obtener texto de votación con los 4 campos
   */
  const textoVotacion = computed(() => {
    if (votacionStore.itemVotacion) {
      return votacionStore.itemVotacion.label;
    }

    // Construir texto con los 4 campos
    const cantidad = cantidadDirectores.value;
    const duracion = duracionDirectorio.value;
    const inicio = fechaInicio.value;
    const fin = fechaFin.value;

    let texto = `¿Se aprueba que el Directorio esté conformado por ${cantidad} directores`;

    if (duracion) {
      texto += `, con una duración de ${duracion}`;
    }

    if (inicio && fin) {
      texto += `, considerando las fechas de inicio ${inicio} y fin ${fin} registradas`;
    } else if (inicio) {
      texto += `, considerando la fecha de inicio ${inicio} registrada`;
    } else if (fin) {
      texto += `, considerando la fecha de fin ${fin} registrada`;
    }

    texto += "?";

    return texto;
  });

  /**
   * Obtener descripción de votación con los 4 campos
   */
  const descripcionVotacion = computed(() => {
    const cantidad = cantidadDirectores.value;
    const duracion = duracionDirectorio.value;
    const inicio = fechaInicio.value;
    const fin = fechaFin.value;

    let descripcion = `Votación para aprobar la configuración del directorio con ${cantidad} directores`;

    if (duracion) {
      descripcion += `, duración de ${duracion}`;
    }

    if (inicio && fin) {
      descripcion += `, período del ${inicio} al ${fin}`;
    } else if (inicio) {
      descripcion += `, inicio el ${inicio}`;
    } else if (fin) {
      descripcion += `, fin el ${fin}`;
    }

    return descripcion;
  });

  /**
   * Obtener voto de un accionista
   */
  const getVoto = computed(() => {
    return (accionistaId: string): VoteValue | null => {
      const voto = votacionStore.getVotoByAccionista(accionistaId);
      if (!voto) return null;
      return voto.valor as VoteValue;
    };
  });

  /**
   * Establecer voto de un accionista (SOLO actualiza estado local)
   */
  function setVoto(accionistaId: string, valor: VoteValue) {
    if (!votacionStore.sesionVotacion) {
      const sessionId = votacionStore.generateUuid();
      const itemId = votacionStore.generateUuid();
      const textoVotacionValue = textoVotacion.value;
      const descripcionValue = descripcionVotacion.value;

      votacionStore.sesionVotacion = {
        id: sessionId,
        contexto: VoteContext.CONFIGURACION_DIRECTORIO,
        modo: VoteMode.SIMPLE,
        items: [
          {
            id: itemId,
            orden: 0,
            label: textoVotacionValue,
            descripción: descripcionValue,
            tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS,
            votos: [],
          },
        ],
      };
    }

    votacionStore.setVoto(accionistaId, valor);
  }

  /**
   * Cambiar tipo de votación (unanimidad/mayoría)
   */
  async function cambiarTipo(tipo: "unanimidad" | "mayoria") {
    const tipoAprobacion =
      tipo === "unanimidad"
        ? VoteAgreementType.APROBADO_POR_TODOS
        : VoteAgreementType.SOMETIDO_A_VOTACION;

    votacionStore.setTipoAprobacion(tipoAprobacion);
  }

  /**
   * Guardar votación (crear o actualizar)
   * Se llama cuando el usuario hace click en "Siguiente"
   */
  async function guardarVotacion() {
    try {
      isLoading.value = true;
      error.value = null;

      if (!directoryConfigStore.configuration) {
        throw new Error("Debe configurar el directorio antes de realizar la votación");
      }

      const itemId = votacionStore.itemVotacion?.id || votacionStore.generateUuid();
      const label = textoVotacion.value;
      const descripcion = descripcionVotacion.value;

      // ✅ Asegurar que hay sesión en memoria
      if (!votacionStore.sesionVotacion) {
        const sessionId = votacionStore.generateUuid();
        votacionStore.sesionVotacion = {
          id: sessionId,
          contexto: VoteContext.CONFIGURACION_DIRECTORIO,
          modo: VoteMode.SIMPLE,
          items: [
            {
              id: itemId,
              orden: 0,
              label,
              descripción: descripcion,
              tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS,
              votos: [],
            },
          ],
        };
      } else {
        // Asegurar que el contexto de la sesión existente sea correcto
        if (votacionStore.sesionVotacion.contexto !== VoteContext.CONFIGURACION_DIRECTORIO) {
          votacionStore.sesionVotacion.contexto = VoteContext.CONFIGURACION_DIRECTORIO;
        }

        // Asegurar que hay item
        if (!votacionStore.itemVotacion) {
          votacionStore.sesionVotacion.items.push({
            id: itemId,
            orden: 0,
            label,
            descripción: descripcion,
            tipoAprobacion: VoteAgreementType.APROBADO_POR_TODOS,
            votos: [],
          });
        } else {
          // Actualizar label y descripción del item existente
          const item = votacionStore.itemVotacion;
          item.label = label;
          item.descripción = descripcion;
        }
      }

      const item = votacionStore.itemVotacion;
      if (!item) {
        throw new Error("No se pudo crear el item de votación");
      }

      // ✅ Preparar votos para enviar
      let votos: Array<{ id: string; accionistaId: string; valor: string | number }>;

      const tipoAprobacion = item.tipoAprobacion || VoteAgreementType.SOMETIDO_A_VOTACION;

      // ✅ Si es unanimidad, generar todos los votos a favor automáticamente
      if (tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS) {
        votos = votantes.value.map((votante) => ({
          id: votacionStore.generateUuid(),
          accionistaId: votante.accionistaId,
          valor: VoteValue.A_FAVOR,
        }));
      } else {
        // ✅ Si es mayoría, usar los votos que el usuario ingresó
        votos = item.votos.map((voto) => ({
          id: voto.id,
          accionistaId: voto.accionistaId,
          valor: voto.valor,
        }));
      }

      // Actualizar votos en el item antes de guardar
      item.votos = votos.map((v) => ({
        id: v.id,
        accionistaId: v.accionistaId,
        valor: v.valor as VoteValue | number,
      }));

      if (votacionStore.hasVotacion) {
        // Actualizar votación existente
        await votacionStore.updateItemConVotos(
          societyId.value,
          flowId.value,
          itemId,
          label,
          descripcion,
          tipoAprobacion,
          votos
        );
      } else {
        // Crear nueva votación
        await votacionStore.createVotacion(
          societyId.value,
          flowId.value,
          itemId,
          label,
          descripcion,
          tipoAprobacion
        );

        // Si hay votos y es sometida a votación, agregarlos después de crear
        if (votos.length > 0 && tipoAprobacion === VoteAgreementType.SOMETIDO_A_VOTACION) {
          for (const voto of votos) {
            await votacionStore.addVote(
              societyId.value,
              flowId.value,
              voto.accionistaId,
              voto.valor as VoteValue
            );
          }
        }
        // Para unanimidad, los votos ya están incluidos en el item antes de crear
      }
    } catch (error: any) {
      console.error("[Controller][VotacionConfiguracion] Error al guardar:", error);
      error.value = error.message || "Error al guardar votación";
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  // Cargar datos al montar
  onMounted(() => {
    loadData();
  });

  onActivated(() => {
    loadData();
  });

  return {
    // Estados
    isLoading,
    error,

    // Datos
    votantes,
    textoVotacion,
    getVoto,
    cantidadDirectores,
    duracionDirectorio,
    fechaInicio,
    fechaFin,

    // Acciones
    cambiarTipo,
    setVoto,
    guardarVotacion,
  };
}

