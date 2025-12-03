import type { AsignacionAccionDTO } from "~/core/hexag/registros/sociedades/pasos/asignacion-acciones/application/dtos/asignacion-accion.dto";
import type { AsignacionAccion as DomainAsignacionAccion } from "~/core/hexag/registros/sociedades/pasos/asignacion-acciones/domain/entities/asignacion-accion.entity";
import type { AsignacionAccion } from "../types/asignacion-acciones";

/**
 * Genera un UUID v4
 */
const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback para entornos sin crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Mapper de Presentation Layer
 * Convierte entre el formato del store (Presentation) y el DTO/Entity (Application/Domain)
 */
export const AsignacionAccionPresentationMapper = {
  /**
   * Convierte una Entity de dominio a AsignacionAccion del store
   */
  domainToStore(entity: DomainAsignacionAccion, accionistaNombre: string): AsignacionAccion {
    return {
      id: entity.id,
      accionistaId: entity.accionistaId,
      accionista: accionistaNombre,
      accionId: entity.accionId,
      cantidadSuscrita: entity.cantidadAccionesSuscritas,
      porcentaje: 0, // Se calculará después
      precioPorAccion: entity.precioPorAccion,
      capitalSocial: entity.capitalSocial,
      prima: entity.prima,
      porcentajePagadoPorAccion: entity.porcentajePagadoPorAccion,
      dividendoPasivoTotal: entity.dividendoPasivoTotal,
      pagadoCompletamente: entity.pagadoCompletamente,
    };
  },

  /**
   * Convierte una lista de Entities de dominio a AsignacionAccion del store
   */
  domainListToStore(
    entities: DomainAsignacionAccion[],
    accionistaNombreMap: Map<string, string>
  ): AsignacionAccion[] {
    return entities.map((entity) =>
      this.domainToStore(
        entity,
        accionistaNombreMap.get(entity.accionistaId) || "Accionista desconocido"
      )
    );
  },

  /**
   * Convierte AsignacionAccion del store a DTO para enviar al backend
   */
  storeToDTO(store: AsignacionAccion): AsignacionAccionDTO {
    return {
      id: store.id,
      accionId: store.accionId,
      accionistaId: store.accionistaId,
      cantidadSuscrita: store.cantidadSuscrita,
      precioPorAccion: store.precioPorAccion,
      capitalSocial: store.capitalSocial ?? 0,
      prima: store.prima ?? 0,
      porcentajePagadoPorAccion: store.porcentajePagadoPorAccion,
      dividendoPasivoTotal: store.dividendoPasivoTotal,
      pagadoCompletamente: store.pagadoCompletamente,
    };
  },

  /**
   * Convierte AsignacionAccion del store a DTO con UUID generado (para crear)
   */
  storeToDTOCreate(
    store: Omit<AsignacionAccion, "id" | "accionista" | "porcentaje">
  ): AsignacionAccionDTO {
    const dto = {
      id: generateUUID(), // Generar UUID para nuevas asignaciones
      accionId: store.accionId,
      accionistaId: store.accionistaId,
      cantidadSuscrita: store.cantidadSuscrita,
      precioPorAccion: store.precioPorAccion,
      capitalSocial: store.capitalSocial ?? 0,
      prima: store.prima ?? 0,
      porcentajePagadoPorAccion: store.porcentajePagadoPorAccion,
      dividendoPasivoTotal: store.dividendoPasivoTotal,
      pagadoCompletamente: store.pagadoCompletamente,
    };

    // Log para verificar valores antes de crear DTO
    console.log("[AsignacionAccionPresentationMapper] 📋 DTO creado (storeToDTOCreate):", {
      storeCapitalSocial: store.capitalSocial,
      storePrima: store.prima,
      dtoCapitalSocial: dto.capitalSocial,
      dtoPrima: dto.prima,
      dtoCompleto: dto,
    });

    return dto;
  },
};
