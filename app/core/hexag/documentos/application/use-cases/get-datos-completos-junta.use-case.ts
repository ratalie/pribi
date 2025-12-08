import type { JuntaRepository } from "../../../juntas/domain/ports/junta.repository";
import type { SnapshotCompleteDTO } from "../../../juntas/application/dtos/snapshot-complete.dto";
import type { AsistenciaRepository } from "../../../juntas/domain/ports/asistencia.repository";
import type { AgendaItemsRepository } from "../../../juntas/domain/ports/agenda-items.repository";
import type { MeetingDetailsRepository } from "../../../juntas/domain/ports/meeting-details.repository";
import type { MeetingDetails } from "../../../juntas/domain/entities/meeting-details.entity";
import type { Asistencia } from "../../../juntas/domain/entities/asistencia.entity";
import type { AgendaItemsDTO } from "../../../juntas/application/dtos/agenda-item.dto";
import { TipoJunta } from "../../../juntas/domain/enums/tipo-junta.enum";

/**
 * Datos completos de una junta para generar documentos
 */
export interface DatosCompletosJunta {
  // Snapshot (datos de la sociedad al momento de crear la junta)
  snapshot: SnapshotCompleteDTO;

  // Detalles de la junta
  detallesJunta: {
    tipoJunta: "GENERAL" | "UNIVERSAL";
    fecha: string;
    hora: string;
    lugar: string;
    ciudad: string;
  };

  // Asistencia
  asistencia: {
    asistentes: Array<{
      accionistaId: string;
      personaId: string;
      nombre: string;
      documento: string;
      acciones: number;
      asistio: boolean;
    }>;
    presidente: string;
    secretario: string;
    quorum: {
      porcentaje: number;
      cumple: boolean;
    };
  };

  // Puntos de agenda seleccionados
  puntosAgenda: {
    aumentoCapital: {
      aportesDinerarios: boolean;
      capitalizacionDeCreditos: boolean;
    };
    nombramiento: {
      nombramientoGerenteGeneral: boolean;
      nombramientoDirectores: boolean;
    };
    // ... otros puntos
  };

  // Datos específicos por punto (se obtienen de endpoints específicos)
  datosPorPunto: {
    aporteDinerario?: {
      aportantes: Array<{
        accionistaId: string;
        nombre: string;
        dni: string;
        aporte: number;
        accionesRecibidas: number;
      }>;
      totalAumento: number;
      capitalAntes: number;
      capitalDespues: number;
      accionesAntes: number;
      accionesDespues: number;
      valorNominal: number;
    };
    // ... otros puntos
  };

  // Votaciones por punto
  votaciones: {
    aporteDinerario?: {
      porcentajeAprobacion: number;
      accionistasAfavor: Array<{
        nombre: string;
        acciones: number;
      }>;
      accionistasContra: Array<{
        nombre: string;
        acciones: number;
      }>;
    };
    // ... otras votaciones
  };
}

/**
 * Use Case: Obtener Datos Completos de Junta
 * 
 * Obtiene TODOS los datos necesarios para generar documentos:
 * - Snapshot completo
 * - Detalles de la junta
 * - Asistencia
 * - Puntos de agenda
 * - Datos específicos por punto
 * - Votaciones
 */
export class GetDatosCompletosJuntaUseCase {
  constructor(
    private readonly juntaRepository: JuntaRepository,
    private readonly meetingDetailsRepository: MeetingDetailsRepository,
    private readonly asistenciaRepository: AsistenciaRepository,
    private readonly agendaItemsRepository: AgendaItemsRepository
  ) {}

  async execute(societyId: number, flowId: number): Promise<DatosCompletosJunta> {
    // 1. Obtener snapshot completo (datos de la sociedad)
    const snapshot = await this.juntaRepository.getSnapshot(societyId, flowId);

    // 2. Obtener detalles de la junta
    const detallesJunta: MeetingDetails | null = await this.meetingDetailsRepository.get(societyId, flowId);

    // 3. Obtener asistencia
    const asistencias: Asistencia[] = await this.asistenciaRepository.get(societyId, flowId);

    // 4. Obtener puntos de agenda seleccionados
    const puntosAgenda: AgendaItemsDTO | null = await this.agendaItemsRepository.get(societyId, flowId);

    // 5. Obtener datos específicos por punto (si existen)
    const datosPorPunto = await this.obtenerDatosPorPunto(societyId, flowId, puntosAgenda);

    // 6. Obtener votaciones por punto (si existen)
    const votaciones = await this.obtenerVotacionesPorPunto(societyId, flowId, puntosAgenda);

    // 7. Helper para obtener nombre completo de persona
    const obtenerNombreCompleto = (persona: any): string => {
      if (persona.tipo === "NATURAL") {
        return `${persona.nombre} ${persona.apellidoPaterno} ${persona.apellidoMaterno || ""}`.trim();
      }
      if (persona.tipo === "JURIDICA") {
        return persona.razonSocial || "";
      }
      return "";
    };

    // 8. Helper para formatear fecha
    const formatearFecha = (fecha: Date | string | undefined): string => {
      if (!fecha) return "";
      if (typeof fecha === "string") return fecha;
      return fecha.toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

    // 9. Helper para formatear hora
    const formatearHora = (hora: Date | string | undefined): string => {
      if (!hora) return "";
      if (typeof hora === "string") return hora;
      return hora.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    // 10. Extraer fecha, hora, lugar de detallesJunta o convocatoria
    const primeraConvocatoria = detallesJunta?.primeraConvocatoria;
    const fecha = formatearFecha(primeraConvocatoria?.fecha);
    const hora = formatearHora(primeraConvocatoria?.hora);
    const lugar = primeraConvocatoria?.direccion || "";

    // 11. Extraer presidente y secretario de asistencia o detalles
    const presidenteAsistencia = asistencias.find(a => a.asistio);
    const presidenteIndex = presidenteAsistencia ? asistencias.indexOf(presidenteAsistencia) : -1;
    const secretarioAsistencia = asistencias.find((a, index) => a.asistio && index !== presidenteIndex) || undefined;

    // 12. Calcular quorum
    const totalAcciones = asistencias.reduce((sum, a) => sum + (a.asistio ? a.accionesConDerechoVoto : 0), 0);
    const totalAccionesSociedad = snapshot.shareAllocations.reduce((sum, a) => sum + a.cantidadSuscrita, 0);
    const porcentajeQuorum = totalAccionesSociedad > 0 ? (totalAcciones / totalAccionesSociedad) * 100 : 0;
    // Usar quorumMinimoSimple como valor por defecto
    const quorumMinimo = snapshot.quorums?.quorumMinimoSimple || 50;
    const cumpleQuorum = porcentajeQuorum >= quorumMinimo;

    // 13. Convertir TipoJunta enum a string literal
    const tipoJuntaString: "GENERAL" | "UNIVERSAL" = detallesJunta?.tipoJunta === TipoJunta.UNIVERSAL 
      ? "UNIVERSAL" 
      : detallesJunta?.tipoJunta === TipoJunta.GENERAL
      ? "GENERAL"
      : "GENERAL";

    // 14. Construir objeto completo
    return {
      snapshot,
      detallesJunta: {
        tipoJunta: tipoJuntaString,
        fecha: fecha, // Ya es string por formatearFecha
        hora: hora, // Ya es string por formatearHora
        lugar,
        ciudad: lugar.split(",")[0] || "Lima", // Extraer ciudad del lugar
      },
      asistencia: {
        asistentes: asistencias.map((a) => ({
          accionistaId: a.accionista.id,
          personaId: a.accionista.person.id || "",
          nombre: obtenerNombreCompleto(a.accionista.person),
          documento: a.accionista.person.tipo === "NATURAL" 
            ? a.accionista.person.numeroDocumento 
            : a.accionista.person.tipo === "JURIDICA"
            ? a.accionista.person.numeroDocumento
            : "",
          acciones: a.accionesConDerechoVoto || 0,
          asistio: a.asistio || false,
        })),
        presidente: detallesJunta?.nombreOtroPresidente || (presidenteAsistencia ? obtenerNombreCompleto(presidenteAsistencia.accionista.person) : "") || "",
        secretario: detallesJunta?.nombreOtroSecretario || (secretarioAsistencia ? obtenerNombreCompleto(secretarioAsistencia.accionista.person) : "") || "",
        quorum: {
          porcentaje: Math.round(porcentajeQuorum),
          cumple: cumpleQuorum,
        },
      },
      puntosAgenda: puntosAgenda || {
        aumentoCapital: {
          aportesDinerarios: false,
          aporteNoDinerario: false,
          capitalizacionDeCreditos: false,
        },
        remocion: {
          remocionGerenteGeneral: false,
          remocionApoderados: false,
          remocionDirectores: false,
        },
        nombramiento: {
          nombramientoGerenteGeneral: false,
          nombramientoApoderados: false,
          nombramientoDirectores: false,
          nombramientoNuevoDirectorio: false,
        },
        gestionSocialYResultadosEconomicos: {
          pronunciamientoGestionSocialYResultados: false,
          aplicacionResultados: false,
          designacionAuditoresExternos: false,
        },
      },
      datosPorPunto,
      votaciones,
    };
  }

  /**
   * Obtiene datos específicos por cada punto de agenda
   */
  private async obtenerDatosPorPunto(
    societyId: number,
    flowId: number,
    puntosAgenda: AgendaItemsDTO | null
  ): Promise<DatosCompletosJunta["datosPorPunto"]> {
    const datos: DatosCompletosJunta["datosPorPunto"] = {};

    // Si hay aporte dinerario, obtener datos
    if (puntosAgenda?.aumentoCapital?.aportesDinerarios) {
      // TODO: Llamar a endpoint de aportes dinerarios
      // const response = await $fetch(`/api/v2/society-profile/${societyId}/register-assembly/${flowId}/contributions`);
      // datos.aporteDinerario = mapearAporteDinerario(response);
    }

    return datos;
  }

  /**
   * Obtiene votaciones por cada punto de agenda
   */
  private async obtenerVotacionesPorPunto(
    societyId: number,
    flowId: number,
    puntosAgenda: AgendaItemsDTO | null
  ): Promise<DatosCompletosJunta["votaciones"]> {
    const votaciones: DatosCompletosJunta["votaciones"] = {};

    // Si hay aporte dinerario, obtener votación
    if (puntosAgenda?.aumentoCapital?.aportesDinerarios) {
      // TODO: Llamar a endpoint de votaciones
      // const response = await $fetch(`/api/v2/society-profile/${societyId}/register-assembly/${flowId}/votes?contexto=APORTES_DINERARIOS`);
      // votaciones.aporteDinerario = mapearVotacion(response);
    }

    return votaciones;
  }
}

