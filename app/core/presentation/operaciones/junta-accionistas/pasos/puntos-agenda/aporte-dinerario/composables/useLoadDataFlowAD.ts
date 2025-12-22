import type {
  Accion,
  Persona,
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

// Tipo para items de la tabla antes/después
export interface ItemTablaDistribucion {
  id: string;
  nombre: string;
  esAccionista: boolean;
  numeroAcciones: number;
  porcentajeParticipacion: string;
  porcentajeAntes?: number; // Porcentaje antes del aporte (solo para comparación en "después")
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

  const mapAccionistasConAcciones = (
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
  const mapAportantesConAportes = (
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

  /**
   * Helper para obtener nombre completo de una Persona
   */
  const getNombreCompletoPersona = (persona: Persona): string => {
    if (persona.tipo === "NATURAL") {
      return `${persona.nombre} ${persona.apellidoPaterno} ${
        persona.apellidoMaterno || ""
      }`.trim();
    } else if (persona.tipo === "JURIDICA") {
      return persona.razonSocial;
    } else if (persona.tipo === "SUCURSAL") {
      return persona.nombreSucursal;
    } else if (persona.tipo === "FONDO_INVERSION") {
      return persona.razonSocial;
    } else if (persona.tipo === "FIDEICOMISO") {
      return persona.razonSocial || "";
    } else if (persona.tipo === "SUCESION_INDIVISA") {
      return persona.razonSocial;
    }
    return "";
  };

  /**
   * Helper para obtener nombre completo de Shareholder o ParticipantPerson
   */
  const getNombreCompleto = (person: Shareholder | ParticipantPerson | undefined): string => {
    if (!person) return "";

    // Para Shareholder (tiene propiedad person)
    if ("person" in person) {
      return getNombreCompletoPersona(person.person);
    }

    // Para ParticipantPerson
    if (person.tipo === "NATURAL" || person.tipo === "NATURAL_PERSON") {
      return `${person.nombre || ""} ${person.apellidoPaterno || ""} ${
        person.apellidoMaterno || ""
      }`.trim();
    } else {
      return (person as any).razonSocial || person.nombre || "";
    }
  };

  /**
   * Normaliza un documento para comparación (elimina espacios, convierte a mayúsculas)
   */
  const normalizarDocumento = (tipoDocumento: string, numeroDocumento: string): string => {
    const tipo = (tipoDocumento || "").trim().toUpperCase();
    const numero = (numeroDocumento || "").trim().toUpperCase().replace(/\s+/g, "");
    return `${tipo}|${numero}`;
  };

  /**
   * Extrae el documento (tipoDocumento + numeroDocumento) de una Persona
   * Maneja todos los tipos: NATURAL, JURIDICA, SUCURSAL, FONDO_INVERSION, FIDEICOMISO, SUCESION_INDIVISA
   */
  const getDocumentoPersona = (persona: Persona): string => {
    if (persona.tipo === "NATURAL") {
      return normalizarDocumento(persona.tipoDocumento, persona.numeroDocumento);
    } else if (persona.tipo === "JURIDICA") {
      return normalizarDocumento(persona.tipoDocumento, persona.numeroDocumento);
    } else if (persona.tipo === "SUCURSAL") {
      // Para sucursales, el documento principal es el RUC
      return normalizarDocumento("RUC", persona.ruc);
    } else if (persona.tipo === "FONDO_INVERSION") {
      // Para fondos de inversión, el documento principal es el RUC
      return normalizarDocumento("RUC", persona.ruc);
    } else if (persona.tipo === "FIDEICOMISO") {
      // Para fideicomisos, puede tener RUC o usar el número de registro
      if (persona.tieneRuc && persona.ruc) {
        return normalizarDocumento("RUC", persona.ruc);
      } else {
        // Fallback al número de registro de fideicomiso
        return normalizarDocumento("REGISTRO_FIDEICOMISO", persona.numeroRegistroFideicomiso);
      }
    } else if (persona.tipo === "SUCESION_INDIVISA") {
      // Para sucesiones indivisas, el documento principal es el RUC
      return normalizarDocumento("RUC", persona.ruc);
    }
    return "";
  };

  /**
   * Extrae el documento de un Shareholder
   */
  const getDocumentoShareholder = (shareholder: Shareholder): string => {
    return getDocumentoPersona(shareholder.person);
  };

  /**
   * Extrae el documento de un ParticipantPerson
   */
  const getDocumentoParticipantPerson = (person: ParticipantPerson): string => {
    return normalizarDocumento(person.tipoDocumento, person.numeroDocumento);
  };

  /**
   * Extrae el documento de un Participant
   */
  const getDocumentoParticipant = (participant: Participant): string => {
    return getDocumentoParticipantPerson(participant.person);
  };

  /**
   * Calcula la lista de distribución ANTES del aporte
   * Incluye solo los accionistas actuales con sus acciones
   * Usa mapAccionistasConAcciones para obtener los datos
   */
  const listaAntes = computed((): ItemTablaDistribucion[] => {
    if (!snapshotData.value) return [];

    // Usar la función existente para mapear accionistas con sus acciones
    const accionistasConAcciones = mapAccionistasConAcciones(snapshotData.value);

    // Calcular total de acciones sumando todas las acciones de todos los accionistas
    const totalAcciones = accionistasConAcciones.reduce((sum, accionista) => {
      const totalAccionesAccionista = accionista.acciones.reduce(
        (accSum, accion) => accSum + accion.cantidad,
        0
      );
      return sum + totalAccionesAccionista;
    }, 0);

    // Mapear a formato de tabla
    return accionistasConAcciones
      .map((accionistaConAcciones) => {
        // Sumar todas las acciones del accionista
        const numeroAcciones = accionistaConAcciones.acciones.reduce(
          (sum, accion) => sum + accion.cantidad,
          0
        );

        const porcentaje = totalAcciones > 0 ? (numeroAcciones / totalAcciones) * 100 : 0;

        return {
          id: accionistaConAcciones.accionista.id,
          nombre: getNombreCompleto(accionistaConAcciones.accionista),
          esAccionista: true,
          numeroAcciones,
          porcentajeParticipacion: `${porcentaje.toFixed(2)}%`,
        };
      })
      .filter((item) => item.numeroAcciones > 0) // Solo mostrar quienes tienen acciones
      .sort((a, b) => b.numeroAcciones - a.numeroAcciones); // Ordenar por número de acciones descendente
  });

  /**
   * Calcula la lista de distribución DESPUÉS del aporte
   * Usa mapAportantesConAportes para obtener los aportantes y sus aportes
   * Combina con listaAntes para sumar acciones antes + nuevas acciones
   * Compara por documento (tipoDocumento + numeroDocumento) en lugar de ID
   * Garantiza un solo item por aportante con la suma de sus valores
   */
  const listaDespues = computed((): ItemTablaDistribucion[] => {
    if (!contributionsData.value?.data || !participantsData.value || !snapshotData.value) {
      return listaAntes.value;
    }

    // Usar la función existente para mapear aportantes con sus aportes
    const aportantesConAportes = mapAportantesConAportes(
      participantsData.value,
      contributionsData.value
    );

    // Si no hay aportantes, retornar lista antes
    if (aportantesConAportes.length === 0) {
      return listaAntes.value;
    }

    // Crear mapa de listaAntes por documento (tipoDocumento + numeroDocumento) para acceso rápido
    const listaAntesPorDocumento = new Map<string, ItemTablaDistribucion>();
    listaAntes.value.forEach((item) => {
      // Obtener el shareholder del snapshot para extraer su documento
      const accionistasConAcciones = mapAccionistasConAcciones(snapshotData.value);
      const accionista = accionistasConAcciones.find((acc) => acc.accionista.id === item.id);
      if (accionista) {
        const documento = getDocumentoShareholder(accionista.accionista);
        if (documento) {
          listaAntesPorDocumento.set(documento, item);
        }
      }
    });

    // Usar un Map para garantizar un solo item por aportante (usando documento como clave)
    const itemsMap = new Map<string, ItemTablaDistribucion>();

    // Procesar cada aportante y sumar sus acciones de todos sus aportes
    aportantesConAportes.forEach((aportanteConAportes) => {
      const aportanteId = aportanteConAportes.aportante.id;
      const documentoAportante = getDocumentoParticipant(aportanteConAportes.aportante);

      // Sumar todas las acciones de todos los aportes del aportante
      const nuevasAcciones = aportanteConAportes.aportes.reduce(
        (sum, aporte) => sum + aporte.acciones,
        0
      );

      // Verificar si el aportante ya está en listaAntes (comparando por documento)
      const itemAntes = documentoAportante
        ? listaAntesPorDocumento.get(documentoAportante)
        : null;

      if (itemAntes) {
        // Si está en listaAntes, sumar acciones antes + nuevas acciones
        const numeroAccionesDespues = itemAntes.numeroAcciones + nuevasAcciones;
        // Extraer porcentaje numérico de antes para comparación
        const porcentajeAntesNum = parseFloat(
          itemAntes.porcentajeParticipacion.replace("%", "")
        );
        itemsMap.set(documentoAportante, {
          ...itemAntes,
          numeroAcciones: numeroAccionesDespues,
          porcentajeAntes: porcentajeAntesNum, // Guardar para comparación
        });
      } else {
        // Si no está en listaAntes, es un nuevo aportante (porcentajeAntes = 0)
        itemsMap.set(documentoAportante, {
          id: aportanteId,
          nombre: getNombreCompleto(aportanteConAportes.aportante.person),
          esAccionista: false,
          numeroAcciones: nuevasAcciones,
          porcentajeParticipacion: "0%", // Se calculará después
          porcentajeAntes: 0, // Nuevo aportante, no tenía participación antes
        });
      }
    });

    // Agregar accionistas que no tienen nuevos aportes (mantenerlos en la lista)
    listaAntes.value.forEach((itemAntes) => {
      // Obtener el documento del accionista
      const accionistasConAcciones = mapAccionistasConAcciones(snapshotData.value);
      const accionista = accionistasConAcciones.find(
        (acc) => acc.accionista.id === itemAntes.id
      );
      if (accionista) {
        const documento = getDocumentoShareholder(accionista.accionista);
        // Solo agregar si NO está ya en el mapa (no tiene nuevos aportes)
        if (documento && !itemsMap.has(documento)) {
          // Extraer porcentaje numérico de antes para comparación
          const porcentajeAntesNum = parseFloat(
            itemAntes.porcentajeParticipacion.replace("%", "")
          );
          itemsMap.set(documento, {
            ...itemAntes,
            porcentajeAntes: porcentajeAntesNum, // Guardar para comparación
          });
        }
      }
    });

    // Convertir Map a Array
    const items = Array.from(itemsMap.values());

    // Calcular total de acciones después
    const totalAccionesDespues = items.reduce((sum, item) => sum + item.numeroAcciones, 0);

    // Recalcular porcentajes con el nuevo total
    items.forEach((item) => {
      const porcentaje =
        totalAccionesDespues > 0 ? (item.numeroAcciones / totalAccionesDespues) * 100 : 0;
      item.porcentajeParticipacion = `${porcentaje.toFixed(2)}%`;
    });

    // Ordenar por número de acciones descendente
    return items.sort((a, b) => b.numeroAcciones - a.numeroAcciones);
  });

  const votacionAprobada = computed((): boolean => {
    if (!votesData.value?.items?.[0] || !snapshotData.value) {
      return false;
    }

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
    listaAntes,
    listaDespues,
  };
};
