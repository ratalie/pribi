import type { AccionResponseDTO } from "../../application/dtos/accion-response.dto";
import type { AccionDTO } from "../../application/dtos/accion.dto";
import type { FileMetadataDTO } from "../../application/dtos/file-metadata.dto";
import type { AccionPayload } from "../../domain/entities/accion-payload.entity";
import type { Accion } from "../../domain/entities/accion.entity";
import type { FileMetadata } from "../../domain/entities/file-metadata.entity";
import { TipoAccionEnum } from "../../domain/enums/tipo-accion.enum";

/**
 * Mapper para transformar entre DTO y Entidad de acciones.
 */
export class AccionesMapper {
  /**
   * Convierte FileMetadataDTO a FileMetadata (Entity).
   * @param dto DTO de metadata de archivo
   * @returns Entity de metadata de archivo
   */
  private static fileMetadataDTOToEntity(dto: FileMetadataDTO): FileMetadata {
    return {
      fileId: dto.fileId,
      mimeType: dto.mimeType,
      originalName: dto.originalName,
      size: dto.size,
    };
  }

  /**
   * Convierte lista de DTOs de respuesta GET a lista de Entidades de dominio.
   * @param dtos Lista de DTOs de respuesta del backend
   * @returns Lista de entidades de dominio
   */
  static deListaRespuestaADominio(dtos: AccionResponseDTO[]): Accion[] {
    return dtos.map((dto) => ({
      id: dto.id,
      tipo: dto.tipo,
      nombreAccion: dto.nombre || "Acción sin nombre",
      accionesSuscritas: dto.cantidadSuscrita,
      derechoVoto: dto.conDerechoVoto,
      redimibles: dto.redimible,
      otrosDerechosEspeciales: Boolean(dto.archivoOtrosDerechos?.length),
      metadataDerechosEspeciales: dto.archivoOtrosDerechos
        ? dto.archivoOtrosDerechos.map(this.fileMetadataDTOToEntity)
        : [],
      obligacionesAdicionales: Boolean(dto.archivoObligaciones?.length),
      metadataObligaciones: dto.archivoObligaciones
        ? dto.archivoObligaciones.map(this.fileMetadataDTOToEntity)
        : [],
      comentariosAdicionales: Boolean(dto.comentariosAdicionales),
      comentariosAdicionalesTexto: dto.comentariosAdicionales || "",
    }));
  }

  /**
   * Convierte Entidad de dominio a Payload de dominio.
   * @param accion Entidad de dominio
   * @returns Payload de dominio
   */
  static deEntityAPayload(accion: Accion): AccionPayload {
    return {
      id: accion.id,
      tipo: accion.tipo,
      nombreAccion: accion.nombreAccion,
      accionesSuscritas: accion.accionesSuscritas,
      derechoVoto: accion.derechoVoto,
      redimible: accion.redimibles,
      otrosDerechosEspeciales: accion.otrosDerechosEspeciales,
      archivosOtrosDerechos:
        accion.otrosDerechosEspeciales && accion.metadataDerechosEspeciales.length > 0
          ? accion.metadataDerechosEspeciales.map((file) => file.fileId)
          : undefined,
      obligacionesAdicionales: accion.obligacionesAdicionales,
      archivosObligaciones:
        accion.obligacionesAdicionales && accion.metadataObligaciones.length > 0
          ? accion.metadataObligaciones.map((file) => file.fileId)
          : undefined,
      comentariosAdicionales: accion.comentariosAdicionales,
      comentariosAdicionalesTexto:
        accion.comentariosAdicionales && accion.comentariosAdicionalesTexto
          ? accion.comentariosAdicionalesTexto
          : undefined,
    };
  }

  /**
   * Convierte Payload de dominio a DTO para enviar al backend (POST/PUT).
   * @param payload Payload de dominio
   * @returns DTO para enviar al backend
   */
  static dePayloadABackend(payload: AccionPayload): AccionDTO {
    return {
      id: payload.id,
      tipo: payload.tipo,
      nombre: payload.tipo === TipoAccionEnum.CLASES ? payload.nombreAccion : undefined,
      cantidadSuscrita: payload.accionesSuscritas,
      redimible: payload.redimible,
      conDerechoVoto: payload.derechoVoto,
      archivoOtrosDerechos: payload.archivosOtrosDerechos?.length
        ? payload.archivosOtrosDerechos
        : undefined,
      archivoObligaciones: payload.archivosObligaciones?.length
        ? payload.archivosObligaciones
        : undefined,
      comentariosAdicionales: payload.comentariosAdicionalesTexto || undefined,
    };
  }
}
