import type {
  CreateVoteSessionRequestDTO,
  VoteEntryDTO,
  VoteItemDTO,
  VoteSessionResponseDTO,
} from "../../application/dtos/vote.dto";
import type { VoteEntry } from "../../domain/entities/vote-entry.entity";
import type { VoteItem } from "../../domain/entities/vote-item.entity";
import type { VoteSession } from "../../domain/entities/vote-session.entity";
import { VoteAgreementType } from "../../domain/enums/vote-agreement-type.enum";
import { VoteContext } from "../../domain/enums/vote-context.enum";
import { VoteMode } from "../../domain/enums/vote-mode.enum";

/**
 * Mapper: DTO ↔ Entity para Votaciones
 */
export class VoteMapper {
  /**
   * Convierte DTO de respuesta a Entity
   *
   * ⚠️ IMPORTANTE: `tipoAprobacion` ahora está en cada item, no en la sesión
   */
  static fromResponseDto(dto: VoteSessionResponseDTO, contexto: VoteContext): VoteSession {
    const modo = dto.modo as VoteMode;
    return {
      id: dto.id,
      contexto,
      modo,
      // ✅ tipoAprobacion ya no está aquí, está en cada item
      items: dto.items.map((item) => this.itemFromDto(item, modo)),
    };
  }

  /**
   * Convierte Entity a DTO de request (crear)
   *
   * ⚠️ IMPORTANTE: `tipoAprobacion` ahora está en cada item, no en la sesión
   * ⚠️ IMPORTANTE: Si es unanimidad, NO enviar votos vacío (o según backend)
   */
  static toCreateRequestDto(entity: VoteSession): CreateVoteSessionRequestDTO {
    return {
      id: entity.id,
      contexto: entity.contexto,
      modo: entity.modo,
      // ✅ tipoAprobacion ya no está aquí, está en cada item
      items: entity.items.map((item) => {
        const itemDto: any = {
          id: item.id,
          orden: item.orden,
          label: item.label,
          descripción: item.descripción,
          personaId: item.personaId,
          tipoAprobacion: item.tipoAprobacion, // ✅ AQUÍ, en el item
        };

        // ✅ Enviar votos si hay votos (tanto para unanimidad como para mayoría)
        // Si es unanimidad, se generan todos los votos a favor automáticamente
        // Si es mayoría, se envían los votos que el usuario haya seleccionado
        // ⚠️ IMPORTANTE: Cuando se usa accion: "add" en el item, los votos usan VoteEntrySchema
        // (sin accion, sin itemId, con accionistaId y valor)
        if (item.votos.length > 0) {
          itemDto.votos = item.votos.map((voto) => ({
            id: voto.id,
            accionistaId: voto.accionistaId, // ✅ Backend ahora espera accionistaId (no personaId)
            valor: voto.valor,
          }));
        }
        // Si no hay votos, no enviamos el campo votos (puede ser que aún no se hayan generado)

        return itemDto;
      }),
    };
  }

  /**
   * Convierte Item DTO a Entity
   *
   * ⚠️ IMPORTANTE: `tipoAprobacion` ahora está en el item
   */
  private static itemFromDto(dto: VoteItemDTO, modo?: string): VoteItem {
    // ⚠️ Backend puede devolver "descripcion" (sin tilde) o "descripción" (con tilde)
    const descripcion = dto.descripción || dto.descripcion;

    return {
      id: dto.id,
      orden: dto.orden,
      label: dto.label,
      descripción: descripcion,
      personaId: dto.personaId,
      tipoAprobacion: dto.tipoAprobacion as VoteAgreementType | undefined, // ✅ AQUÍ, en el item
      votos: dto.votos.map((voto) => this.entryFromDto(voto, modo)),
    };
  }

  /**
   * Convierte Item Entity a DTO (ya no se usa, se hace inline en toCreateRequestDto)
   *
   * ⚠️ IMPORTANTE: `tipoAprobacion` ahora está en el item
   */
  private static itemToDto(entity: VoteItem): VoteItemDTO {
    return {
      id: entity.id,
      orden: entity.orden,
      label: entity.label,
      descripción: entity.descripción,
      personaId: entity.personaId,
      tipoAprobacion: entity.tipoAprobacion, // ✅ AQUÍ, en el item
      votos: entity.votos.map((voto) => this.entryToDto(voto)),
    };
  }

  /**
   * Convierte Entry DTO a Entity
   *
   * ⚠️ IMPORTANTE: El backend ahora devuelve `accionistaId` (ID del accionista ShareholderV2.id)
   * ⚠️ IMPORTANTE: Si el modo es CUMULATIVO, el valor debe ser número (puede venir como string desde el backend)
   */
  private static entryFromDto(dto: VoteEntryDTO, modo?: string): VoteEntry {
    // Si el modo es CUMULATIVO y el valor es string, convertirlo a número
    let valor = dto.valor;
    if (modo === "CUMULATIVO" && typeof dto.valor === "string") {
      valor = Number(dto.valor) || 0;
    }

    return {
      id: dto.id,
      accionistaId: dto.accionistaId, // ✅ Backend ahora usa accionistaId directamente
      valor,
    };
  }

  /**
   * Convierte Entry Entity a DTO (para crear)
   *
   * ⚠️ IMPORTANTE: El backend ahora espera `accionistaId` directamente
   */
  private static entryToDto(entity: VoteEntry): VoteEntryDTO {
    return {
      id: entity.id,
      accionistaId: entity.accionistaId, // ✅ Backend ahora espera accionistaId directamente
      valor: entity.valor,
    };
  }
}
