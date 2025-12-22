import type {
  Accion,
  Shareholder,
  SnapshotCompleteDTO,
} from "~/core/hexag/juntas/application/dtos/snapshot-complete.dto";
import { GetVoteSessionUseCase } from "~/core/hexag/juntas/application/use-cases/get-vote-session.use-case";
import {
  TipoAcuerdo,
  getTipoAcuerdo,
} from "~/core/hexag/juntas/domain/constants/agenda-classification.constants";
import type { VoteSession } from "~/core/hexag/juntas/domain/entities/vote-session.entity";
import { VoteContext } from "~/core/hexag/juntas/domain/enums/vote-context.enum";
import { VoteValue } from "~/core/hexag/juntas/domain/enums/vote-value.enum";
import { VoteHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/vote.http.repository";
import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
import { withAuthHeaders } from "~/core/shared/http/with-auth-headers";

export interface AccionAccionista {
  tipoAccion: Accion["tipo"];
  cantidad: number;
  conDerechoVoto: boolean;
}

export interface AccionistaConAcciones {
  accionista: Shareholder;
  acciones: AccionAccionista[];
}

// Tipos para Participants
export interface ParticipantPerson {
  id: string;
  tipo: string;
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

export interface ContributorPermission {
  id: string;
  module: string;
  isContributor: boolean;
}

export interface Participant {
  id: string;
  person: ParticipantPerson;
  typeShareholder: string;
  isContributor: boolean;
  contributionModule: string[];
  contributorPermissions: ContributorPermission[];
}

export interface ParticipantsResponse {
  success: boolean;
  message: string;
  data: Participant[];
  code: number;
}

// Tipos para Contributions
export interface ContributionAction {
  id: string;
  tipo: string;
}

export interface Contribution {
  id: string;
  accionistaId: string;
  accion: ContributionAction;
  tipoMoneda: string;
  monto: number;
  fechaContribucion: string;
  tasaCambio: number;
  montoConvertido: number;
  accionesPorRecibir: number;
  precioPorAccion: number;
  pagadoCompletamente: boolean;
  porcentajePagado: number;
  totalPasivo: number;
  capitalSocial: number;
  premium: number;
  reserva: number;
  comprobantePagoArchivoId?: string;
}

export interface ContributionsResponse {
  success: boolean;
  message: string;
  data: Contribution[];
  code: number;
}

// Tipo para el resultado final
export interface AporteDetalle {
  fecha: string;
  tipoAccion: string;
  monto: number;
  montoEnOtraMoneda: number | null;
  capitalSocial: number;
  prima: number;
  precioPorAccion: number;
  acciones: number;
}

export interface AportanteConAportes {
  aportante: Participant;
  aportes: AporteDetalle[];
}

export const useLoadDataFlowAD = () => {
  const route = useRoute();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => route.params.societyId as string);
  const flowId = computed(() => route.params.flowId as string);

  // Estado de carga
  const isLoadingPage = ref(false);

  // Datos almacenados de las respuestas
  const snapshotData = ref<SnapshotCompleteDTO | null>(null);
  const participantsData = ref<ParticipantsResponse | null>(null);
  const contributionsData = ref<ContributionsResponse | null>(null);
  const votesData = ref<VoteSession | null>(null);

  const loadDataFlow = async (url: string) => {
    const runtimeConfig = useRuntimeConfig();
    const apiBase = runtimeConfig.public?.apiBase as string | undefined;

    const fullUrl = `${apiBase}${url}`;
    const config = withAuthHeaders({ method: "GET" as const });

    return await $fetch(fullUrl, config);
  };

  const loadSnapshot = async () => {
    await snapshotStore.loadSnapshot(Number(societyId.value), Number(flowId.value));
    return snapshotStore.snapshot;
  };

  const getParticipants = async () => {
    const url = `/society-profile/${societyId.value}/register-assembly/${flowId.value}/cash-contribution/participants`;

    const response = await loadDataFlow(url);
    return response;
  };

  const getContributions = async () => {
    const url = `/society-profile/${societyId.value}/register-assembly/${flowId.value}/contributions`;
    const response = await loadDataFlow(url);
    return response;
  };

  const getVotes = async () => {
    const repository = new VoteHttpRepository();
    const useCase = new GetVoteSessionUseCase(repository);
    const sesionVotacion = await useCase.execute(
      Number(societyId.value),
      Number(flowId.value),
      VoteContext.APORTES_DINERARIOS
    );

    return sesionVotacion;
  };

  const _mapAccionistasConAcciones = (
    snapshot: SnapshotCompleteDTO | null
  ): AccionistaConAcciones[] => {
    if (!snapshot) return [];

    const { shareholders, shareClasses, shareAllocations } = snapshot;

    // Crear mapas para acceso rápido
    const shareClassesMap = new Map<string, Accion>();
    shareClasses.forEach((shareClass) => {
      shareClassesMap.set(shareClass.id, shareClass);
    });

    // Agrupar asignaciones por accionista
    const accionistasMap = new Map<string, AccionistaConAcciones>();

    shareholders.forEach((shareholder) => {
      accionistasMap.set(shareholder.id, {
        accionista: shareholder,
        acciones: [],
      });
    });

    // Procesar asignaciones y unir con tipos de acciones
    shareAllocations.forEach((asignacion) => {
      const accionista = accionistasMap.get(asignacion.accionistaId);
      const shareClass = shareClassesMap.get(asignacion.accionId);

      if (accionista && shareClass) {
        accionista.acciones.push({
          tipoAccion: shareClass.tipo,
          cantidad: asignacion.cantidadSuscrita,
          conDerechoVoto: shareClass.conDerechoVoto,
        });
      }
    });

    return Array.from(accionistasMap.values());
  };

  /**
   * Valida que todos los participantes con isContributor: true tengan al menos una contribución
   * y que todos los que aportaron estén en la lista de participantes
   *
   * @param participantsResponse - Respuesta de getParticipants
   * @param contributionsResponse - Respuesta de getContributions
   * @returns Objeto con isValid y arrays de errores si los hay
   */
  const validateParticipantsAndContributions = (
    participantsResponse: ParticipantsResponse | null,
    contributionsResponse: ContributionsResponse | null
  ): {
    isValid: boolean;
    errors: string[];
    participantesSinAportes: string[];
    aportantesNoEnLista: string[];
  } => {
    const errors: string[] = [];
    const participantesSinAportes: string[] = [];
    const aportantesNoEnLista: string[] = [];

    if (!participantsResponse?.data || !contributionsResponse?.data) {
      errors.push("No se pudieron obtener los datos de participantes o contribuciones");
      return {
        isValid: false,
        errors,
        participantesSinAportes,
        aportantesNoEnLista,
      };
    }

    const participants = participantsResponse.data;
    const contributions = contributionsResponse.data;

    // Obtener IDs de participantes que son contribuyentes
    const participantesContribuyentes = participants
      .filter((p) => p.isContributor)
      .map((p) => p.id);

    // Obtener IDs únicos de accionistas que tienen contribuciones
    const aportantesIds = new Set(contributions.map((c) => c.accionistaId));

    // Verificar que todos los participantes contribuyentes tengan al menos una contribución
    participantesContribuyentes.forEach((participantId) => {
      const tieneAporte = contributions.some((c) => c.accionistaId === participantId);
      if (!tieneAporte) {
        const participant = participants.find((p) => p.id === participantId);
        const nombre = participant?.person.nombre || "Desconocido";
        participantesSinAportes.push(participantId);
        errors.push(
          `El participante ${nombre} (${participantId}) está marcado como contribuyente pero no tiene aportes registrados`
        );
      }
    });

    // Verificar que todos los que aportaron estén en la lista de participantes
    aportantesIds.forEach((accionistaId) => {
      const estaEnLista = participants.some((p) => p.id === accionistaId);
      if (!estaEnLista) {
        aportantesNoEnLista.push(accionistaId);
        errors.push(
          `El accionista con ID ${accionistaId} tiene aportes registrados pero no está en la lista de participantes`
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      participantesSinAportes,
      aportantesNoEnLista,
    };
  };

  /**
   * Mapea los participantes con sus respectivos aportes
   * Solo incluye participantes que tienen isContributor: true y tienen aportes
   *
   * @param participantsResponse - Respuesta de getParticipants
   * @param contributionsResponse - Respuesta de getContributions
   * @returns Array de aportantes con sus aportes mapeados
   */
  const _mapAportantesConAportes = (
    participantsResponse: ParticipantsResponse | null,
    contributionsResponse: ContributionsResponse | null
  ): AportanteConAportes[] => {
    if (!participantsResponse?.data || !contributionsResponse?.data) {
      return [];
    }

    const participants = participantsResponse.data;
    const contributions = contributionsResponse.data;

    // Filtrar solo participantes que son contribuyentes
    const participantesContribuyentes = participants.filter((p) => p.isContributor);

    // Crear mapa de contribuciones por accionista
    const contribucionesPorAccionista = new Map<string, Contribution[]>();
    contributions.forEach((contribution) => {
      const existing = contribucionesPorAccionista.get(contribution.accionistaId) || [];
      existing.push(contribution);
      contribucionesPorAccionista.set(contribution.accionistaId, existing);
    });

    // Mapear participantes con sus aportes
    const resultado: AportanteConAportes[] = [];

    participantesContribuyentes.forEach((participant) => {
      const aportes = contribucionesPorAccionista.get(participant.id) || [];

      if (aportes.length > 0) {
        const aportesMapeados: AporteDetalle[] = aportes.map((aporte) => {
          // Convertir tipo de acción del backend (COMMON) al formato del frontend (COMUN)
          const tipoAccionMap: Record<string, string> = {
            COMMON: "COMUN",
            CLASE: "CLASE",
            PREFERENTE_NO_VOTO: "PREFERENTE_NO_VOTO",
          };
          const tipoAccion = tipoAccionMap[aporte.accion.tipo] || aporte.accion.tipo;

          // Calcular monto en otra moneda (solo si la tasa de cambio es diferente de 1)
          const montoEnOtraMoneda = aporte.tasaCambio !== 1 ? aporte.montoConvertido : null;

          return {
            fecha: aporte.fechaContribucion,
            tipoAccion,
            monto: aporte.monto,
            montoEnOtraMoneda,
            capitalSocial: aporte.capitalSocial,
            prima: aporte.premium,
            precioPorAccion: aporte.precioPorAccion,
            acciones: aporte.accionesPorRecibir,
          };
        });

        resultado.push({
          aportante: participant,
          aportes: aportesMapeados,
        });
      }
    });

    return resultado;
  };

  const capitalSocialAntes = computed((): number => {
    if (!snapshotData.value) return 0;

    const { shareAllocations, nominalValue } = snapshotData.value;

    // Sumar todas las acciones suscritas
    const totalAcciones = shareAllocations.reduce(
      (sum, asignacion) => sum + asignacion.cantidadSuscrita,
      0
    );

    // Capital social = total de acciones * valor nominal
    return totalAcciones * nominalValue;
  });

  const capitalSocialDespues = computed((): number => {
    const antes = capitalSocialAntes.value;

    if (!contributionsData.value?.data) {
      return antes;
    }

    // Sumar el capital social de todas las contribuciones
    const capitalSocialAportes = contributionsData.value.data.reduce(
      (sum, contribution) => sum + contribution.capitalSocial,
      0
    );

    return antes + capitalSocialAportes;
  });

  const nuevasAcciones = computed((): number => {
    if (!contributionsData.value?.data) return 0;

    return contributionsData.value.data.reduce(
      (sum, contribution) => sum + contribution.accionesPorRecibir,
      0
    );
  });

  const incrementoCapital = computed((): number => {
    return capitalSocialDespues.value - capitalSocialAntes.value;
  });

  const montoAlCapital = computed((): number => {
    if (!contributionsData.value?.data) return 0;

    return contributionsData.value.data.reduce(
      (sum, contribution) => sum + contribution.capitalSocial,
      0
    );
  });

  const primaEmision = computed((): number => {
    if (!contributionsData.value?.data) return 0;

    return contributionsData.value.data.reduce(
      (sum, contribution) => sum + contribution.premium,
      0
    );
  });

  const totalAportado = computed((): number => {
    return montoAlCapital.value + primaEmision.value;
  });

  const votacionAprobada = computed((): boolean => {
    if (!votesData.value?.items?.[0] || !snapshotData.value) {
      return false;
    }

    const snapshotStore = useSnapshotStore();
    const accionistasConDerechoVoto = snapshotStore.accionistasConDerechoVoto;
    const votos = votesData.value.items[0].votos || [];

    // Determinar tipo de acuerdo (aporte-dinerarios es CALIFICADO)
    const puntoId = "aporte-dinerarios";
    const tipoAcuerdo = getTipoAcuerdo(puntoId);

    // Obtener quorum mínimo requerido
    const quorums = snapshotStore.quorums;
    const quorumMinimoRequerido =
      tipoAcuerdo === TipoAcuerdo.CALIFICADO
        ? quorums?.mayoriasAcuerdosCalificado || 60
        : quorums?.mayoriasAcuerdosSimple || 50;

    // Mapa para acceder rápido a acciones por accionista
    const accionesPorAccionista = new Map<string, number>();
    accionistasConDerechoVoto.forEach((acc) => {
      accionesPorAccionista.set(acc.shareholder.id, acc.totalAcciones);
    });

    // Calcular acciones a favor
    let accionesAFavor = 0;
    votos.forEach((voto) => {
      const acciones = accionesPorAccionista.get(voto.accionistaId) || 0;
      const valorVoto = String(voto.valor).trim().toUpperCase();

      if (valorVoto === VoteValue.A_FAVOR || valorVoto === "A_FAVOR") {
        accionesAFavor += acciones;
      }
    });

    // Calcular total de acciones con derecho a voto
    const totalAccionesConDerechoVoto = accionistasConDerechoVoto.reduce(
      (sum, acc) => sum + acc.totalAcciones,
      0
    );

    // Calcular porcentaje a favor
    const porcentajeAFavor =
      totalAccionesConDerechoVoto > 0
        ? (accionesAFavor / totalAccionesConDerechoVoto) * 100
        : 0;

    // Determinar si está aprobado
    return porcentajeAFavor >= quorumMinimoRequerido;
  });

  onMounted(async () => {
    try {
      isLoadingPage.value = true;

      const [snapshot, participants, contributions, votes] = await Promise.all([
        loadSnapshot(),
        getParticipants(),
        getContributions(),
        getVotes(),
      ]);

      // Guardar respuestas en refs para uso en computed
      snapshotData.value = snapshot;
      participantsData.value = participants as ParticipantsResponse;
      contributionsData.value = contributions as ContributionsResponse;
      votesData.value = votes;

      // Validar consistencia entre participantes y contribuciones
      validateParticipantsAndContributions(participantsData.value, contributionsData.value);
    } catch (error) {
      console.error("[UseLoadDataFlowAD] Error al cargar datos:", error);
    } finally {
      isLoadingPage.value = false;
    }
  });

  return {
    capitalSocialAntes,
    capitalSocialDespues,
    nuevasAcciones,
    incrementoCapital,
    montoAlCapital,
    primaEmision,
    totalAportado,
    votacionAprobada,
  };
};
