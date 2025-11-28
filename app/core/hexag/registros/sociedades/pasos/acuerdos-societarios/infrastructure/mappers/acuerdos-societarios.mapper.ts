import type {
  AcuerdoSocietarioDataDTO,
  ArchivoMetadataDTO,
} from "../../application/dtos/acuerdo-societario-response.dto";
import type { AcuerdoSocietarioDTO } from "../../application/dtos/acuerdo-societario.dto";
import type {
  AcuerdoSocietario,
  ArchivoMetadata,
} from "../../domain/entities/acuerdo-societario.entity";

/**
 * Mapper para transformar entre DTO y Entidad de acuerdos societarios.
 */
export class AcuerdosSocietariosMapper {
  /**
   * Convierte metadata de archivo DTO a entidad de dominio.
   */
  private static deMetadataArchivoADominio(
    dto: ArchivoMetadataDTO[] | null
  ): ArchivoMetadata | null {
    if (!dto) return null;
    return {
      id: dto[0]?.fileId ?? "",
      nombre: dto[0]?.originalName ?? "",
      size: dto[0]?.size ?? 0,
    };
  }

  /**
   * Convierte DTO de respuesta GET a Entidad de dominio.
   * Incluye metadata completa de archivos (estatutos, accionistas, terceros).
   */
  static deRespuestaADominio(dto: AcuerdoSocietarioDataDTO): AcuerdoSocietario {
    return {
      derechoPreferencia: dto.derechoPreferencia,
      archivoEstatutos: this.deMetadataArchivoADominio(
        dto.archivoEstatutos ? dto.archivoEstatutos.versions : null
      ),
      archivoAccionistas: this.deMetadataArchivoADominio(
        dto.archivoAccionistas ? dto.archivoAccionistas.versions : null
      ),
      archivoTerceros: this.deMetadataArchivoADominio(
        dto.archivoTerceros ? dto.archivoTerceros.versions : null
      ),
    };
  }

  /**
   * Convierte DTO a payload para backend (POST/PUT).
   * Solo incluye campos definidos (no undefined), filtrando valores vacíos.
   */
  static aPayloadParaBackend(dto: AcuerdoSocietarioDTO): AcuerdoSocietarioDTO {
    const payload: AcuerdoSocietarioDTO = {};

    if (dto.derechoPreferencia !== undefined) {
      payload.derechoPreferencia = dto.derechoPreferencia;
    }
    if (dto.archivoEstatutos !== undefined) {
      payload.archivoEstatutos = dto.archivoEstatutos ?? null;
    }
    if (dto.archivoAccionistas !== undefined) {
      payload.archivoAccionistas = dto.archivoAccionistas ?? null;
    }
    if (dto.archivoTerceros !== undefined) {
      payload.archivoTerceros = dto.archivoTerceros ?? null;
    }

    return payload;
  }
}
