import { getRecord, getAllRecords } from "~/core/hexag/registros/shared/mock-database";
import type { SnapshotCompleteDTO } from "../../../application/dtos/snapshot-complete.dto";
import { generateUUID } from "@tests/utils/uuid-generator";

/**
 * Construye un snapshot completo desde los datos existentes de la sociedad
 * 
 * El snapshot replica toda la información de la sociedad para usar en la junta.
 * Si no hay datos, retorna valores por defecto.
 */
export async function getSnapshotMock(
  societyId: number,
  flowId: number
): Promise<SnapshotCompleteDTO> {
  const societyIdStr = String(societyId);
  const flowIdStr = String(flowId);

  console.debug("[MSW][SnapshotState] Construyendo snapshot", {
    societyId: societyIdStr,
    flowId: flowIdStr,
  });

  // Obtener datos de la sociedad desde los stores mock
  const _datosSociedad = await getRecord<any>("datosSociedad", societyIdStr);
  const accionistas = (await getAllRecords<any>("accionistas")) ?? [];
  const acciones = (await getAllRecords<any>("acciones")) ?? [];
  const asignaciones = (await getAllRecords<any>("asignacionAcciones")) ?? [];
  const quorum = await getRecord<any>("quorumConfig", societyIdStr);
  const directorio = await getRecord<any>("directorioConfig", societyIdStr);
  const directores = (await getAllRecords<any>("directores")) ?? [];
  const apoderados = (await getAllRecords<any>("apoderadosRegistro")) ?? [];
  const clasesApoderados = (await getAllRecords<any>("apoderadosClases")) ?? [];

  // Filtrar por societyId
  const accionistasFiltrados = accionistas.filter(
    (a: any) => a.societyProfileId === societyIdStr
  );
  const accionesFiltradas = acciones.filter(
    (a: any) => a.societyProfileId === societyIdStr
  );
  const asignacionesFiltradas = asignaciones.filter(
    (a: any) => a.societyProfileId === societyIdStr
  );
  const directoresFiltrados = directores.filter(
    (d: any) => d.societyProfileId === societyIdStr
  );
  const apoderadosFiltrados = apoderados.filter(
    (a: any) => a.societyProfileId === societyIdStr
  );
  const clasesFiltradas = clasesApoderados.filter(
    (c: any) => c.societyProfileId === societyIdStr
  );

  // Construir snapshot
  const snapshot: SnapshotCompleteDTO = {
    // IDs del snapshot (generar UUIDs)
    shareholderId: generateUUID(),
    nominalValueId: generateUUID(),
    shareAllocationId: generateUUID(),
    meetingConfigId: generateUUID(),
    directoryId: directorio ? generateUUID() : undefined,
    attorneyRegistryId: clasesFiltradas.length > 0 ? generateUUID() : undefined,
    powerRegimenId: undefined, // Por ahora no implementado
    quorumId: quorum ? generateUUID() : undefined,
    specialAgreementsId: undefined, // Por ahora no implementado

    // Valor nominal (calcular desde acciones)
    nominalValue: accionesFiltradas.reduce(
      (sum: number, accion: any) => sum + (accion.cantidadSuscrita || 0),
      0
    ) * 1000, // Asumir valor nominal de 1000 por acción

    // Clases de acciones
    shareClasses: accionesFiltradas.map((accion: any) => ({
      id: accion.id,
      tipo: accion.tipo || "COMUN",
      nombre: accion.nombre || accion.nombreAccion || "Acción",
      cantidadSuscrita: accion.cantidadSuscrita || accion.accionesSuscritas || 0,
      redimible: accion.redimible || false,
      conDerechoVoto: accion.conDerechoVoto !== false,
      archivoOtrosDerechos: accion.archivoOtrosDerechos || [],
      archivoObligaciones: accion.archivoObligaciones || [],
      comentariosAdicionales: accion.comentariosAdicionales,
    })),

    // Accionistas
    shareholders: accionistasFiltrados.map((accionista: any) => ({
      id: accionista.id,
      person: accionista.persona || accionista.person,
    })),

    // Asignaciones de acciones
    shareAllocations: asignacionesFiltradas.map((asignacion: any) => ({
      id: asignacion.id,
      accionId: asignacion.accionId,
      accionistaId: asignacion.accionistaId,
      cantidadSuscrita: asignacion.cantidadSuscrita || 0,
      precioPorAccion: asignacion.precioPorAccion || 1000,
      porcentajePagadoPorAccion: asignacion.porcentajePagadoPorAccion || 100,
      totalDividendosPendientes: asignacion.totalDividendosPendientes || 0,
      pagadoCompletamente: asignacion.pagadoCompletamente !== false,
      fechaCreacion: asignacion.createdAt || new Date().toISOString(),
      fechaActualizacion: asignacion.updatedAt || new Date().toISOString(),
    })),

    // Directorio
    directory: directorio
      ? {
          cantidadDirectores: directorio.cantidadDirectores,
          conteoPersonalizado: directorio.conteoPersonalizado || false,
          minimoDirectores: directorio.minimoDirectores || null,
          maximoDirectores: directorio.maximoDirectores || null,
          inicioMandato: directorio.inicioMandato || null,
          finMandato: directorio.finMandato || null,
          quorumMinimo: directorio.quorumMinimo || 0,
          mayoria: directorio.mayoria || 0,
          presidenteDesignado: directorio.presidenteDesignado || false,
          secretarioAsignado: directorio.secretarioAsignado || false,
          reeleccionPermitida: directorio.reeleccionPermitida || false,
          presidentePreside: directorio.presidentePreside || false,
          presidenteDesempata: directorio.presidenteDesempata || false,
          periodo: directorio.periodo || "1",
          presidenteId: directorio.presidenteId || null,
        }
      : null,

    // Directores
    directors: directoresFiltrados.map((director: any) => ({
      id: director.id,
      persona: {
        id: director.persona?.id || generateUUID(),
        nombre: director.persona?.nombre || "",
        apellidoPaterno: director.persona?.apellidoPaterno || "",
        apellidoMaterno: director.persona?.apellidoMaterno || "",
        tipoDocumento: director.persona?.tipoDocumento || "DNI",
        numeroDocumento: director.persona?.numeroDocumento || "",
        paisEmision: director.persona?.paisEmision,
      },
      rolDirector: director.rolDirector || "TITULAR",
      reemplazaId: director.reemplazaId || undefined,
    })),

    // Apoderados (siempre array, nunca undefined)
    attorneys:
      apoderadosFiltrados.length > 0
        ? apoderadosFiltrados.map((apoderado: any) => ({
            id: apoderado.id,
            claseApoderadoId: apoderado.claseApoderadoId,
            persona: apoderado.persona,
            poderId: apoderado.poderId || null,
          }))
        : [],

    // Poderes (por ahora null, se implementará después)
    powers: null,

    // Quorums
    quorums: quorum
      ? {
          primeraConvocatoriaSimple: quorum.primeraConvocatoriaSimple || 50,
          primeraConvocatoriaCalificada: quorum.primeraConvocatoriaCalificada || 67,
          segundaConvocatoriaSimple: quorum.segundaConvocatoriaSimple || 40,
          segundaConvocatoriaCalificada: quorum.segundaConvocatoriaCalificada || 60,
          quorumMinimoSimple: quorum.quorumMinimoSimple || 10,
          quorumMinimoCalificado: quorum.quorumMinimoCalificado || 20,
        }
      : null,

    // Acuerdos Societarios (por ahora null)
    specialAgreements: null,

    // Configuración de junta (valores por defecto)
    meetingConfig: {
      id: generateUUID(),
      meetingType: "JUNTA_GENERAL",
      isAnnualMandatory: false,
    },

    // Información del flujo
    flowInfo: {
      flowStructureId: flowId,
      currentStep: "INIT",
      statusProgression: "BORRADOR",
    },
  };

  console.debug("[MSW][SnapshotState] Snapshot construido", {
    societyId: societyIdStr,
    flowId: flowIdStr,
    summary: {
      accionistas: snapshot.shareholders.length,
      acciones: snapshot.shareClasses.length,
      asignaciones: snapshot.shareAllocations.length,
      directores: snapshot.directors?.length || 0,
      apoderados: snapshot.attorneys?.length || 0,
      tieneDirectorio: !!snapshot.directory,
      tieneQuorums: !!snapshot.quorums,
    },
  });

  return snapshot;
}

