import type { VoteSession } from "../../domain/entities/vote-session.entity";
import type { VoteItem } from "../../domain/entities/vote-item.entity";
import type { VoteEntry } from "../../domain/entities/vote-entry.entity";
import type {
  VoteSessionResponseDTO,
  VoteItemDTO,
  VoteEntryDTO,
  CreateVoteSessionRequestDTO,
} from "../../application/dtos/vote.dto";
import { VoteContext } from "../../domain/enums/vote-context.enum";
import { VoteMode } from "../../domain/enums/vote-mode.enum";
import { VoteAgreementType } from "../../domain/enums/vote-agreement-type.enum";

/**
 * Mapper: DTO ↔ Entity para Votaciones
 */
export class VoteMapper {
  /**
   * Convierte DTO de respuesta a Entity
   * 
   * ⚠️ IMPORTANTE: `tipoAprobacion` ahora está en cada item, no en la sesión
   */
  static fromResponseDto(
    dto: VoteSessionResponseDTO,
    contexto: VoteContext
  ): VoteSession {
    return {
      id: dto.id,
      contexto,
      modo: dto.modo as VoteMode,
      // ✅ tipoAprobacion ya no está aquí, está en cada item
      items: dto.items.map((item) => this.itemFromDto(item)),
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
  private static itemFromDto(dto: VoteItemDTO): VoteItem {
    return {
      id: dto.id,
      orden: dto.orden,
      label: dto.label,
      descripción: dto.descripción,
      personaId: dto.personaId,
      tipoAprobacion: dto.tipoAprobacion as VoteAgreementType | undefined, // ✅ AQUÍ, en el item
      votos: dto.votos.map((voto) => this.entryFromDto(voto)),
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
   */
  private static entryFromDto(dto: VoteEntryDTO): VoteEntry {
    return {
      id: dto.id,
      accionistaId: dto.accionistaId, // ✅ Backend ahora usa accionistaId directamente
      valor: dto.valor,
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

