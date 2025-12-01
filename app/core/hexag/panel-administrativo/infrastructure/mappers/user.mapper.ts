import type { User } from '../../domain/entities/user.entity';
import type { UserResponseDto } from '../../application/dtos/user.dto';

/**
 * Mapper para transformar DTOs a Entidades
 */
export class UserMapper {
  /**
   * Transforma DTO de respuesta a entidad User
   */
  static toEntity(dto: any): User {
    return {
      id: dto.id,
      email: dto.email,
      roleId: dto.roleId,
      studyId: dto.studyId,
      status: dto.status,
      createdAt: new Date(dto.createdAt),
      role: dto.role,
      study: dto.study,
    };
  }

  /**
   * Transforma array de DTOs a entidades
   */
  static toEntityArray(dtos: any[]): User[] {
    return dtos.map((dto) => this.toEntity(dto));
  }
}

