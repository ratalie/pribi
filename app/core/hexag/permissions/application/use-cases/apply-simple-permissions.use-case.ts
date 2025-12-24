import type { PermissionsRepository } from '../../domain/ports/permissions.repository';
import type { UserRepository } from '~/core/hexag/panel-administrativo/domain/ports/user.repository';
import type { SimplePermissionsConfig } from '~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types';
import type { UserOverride } from '../../domain/entities/user-override.entity';
import { mapSimpleConfigToOverrides } from '../mappers/simple-config-to-overrides.mapper';
import { FlowCodeEnum } from '../../domain/enums/flow-code.enum';
import { PermissionActionEnum } from '../../domain/enums/permission-action.enum';
import { ROLE_MAPPING } from '~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types';

/**
 * Use Case: Aplicar permisos simplificados a un usuario
 * 
 * Orquesta la aplicación de permisos simplificados:
 * 1. Convierte configuración simple a overrides del backend
 * 2. Actualiza el rol del usuario si es necesario
 * 3. Aplica overrides de permisos
 * 4. Asigna sociedades si es necesario
 */
export class ApplySimplePermissionsUseCase {
  constructor(
    private readonly permissionsRepository: PermissionsRepository,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Ejecuta la aplicación de permisos simplificados
   */
  async execute(
    userId: string,
    config: SimplePermissionsConfig,
  ): Promise<void> {
    // 1. Actualizar rol del usuario si es necesario
    const backendRole = ROLE_MAPPING[config.role];
    if (backendRole) {
      // Mapear rol simple a formato del repositorio
      const roleMap: Record<string, 'lector' | 'editor' | 'admin' | 'user'> = {
        Administrador: 'admin',
        Editor: 'editor',
        Lector: 'lector',
      };

      const roleKey = roleMap[config.role] || 'user';
      await this.userRepository.updateUserRole(userId, roleKey);
    }

    // 2. Aplicar overrides de permisos (solo si no es Administrador)
    if (config.role !== 'Administrador') {
      const backendOverrides = mapSimpleConfigToOverrides(config);

      if (backendOverrides && backendOverrides.length > 0) {
        // Enviar directamente el formato que espera el backend (UpsertUserOverrideDto)
        // El repositorio HTTP ahora acepta este formato directamente
        await this.permissionsRepository.updateUserOverrides(userId, {
          overrides: backendOverrides,
        });
      }
    }

    // 3. Asignar sociedades si es necesario
    if (config.societies.mode === 'specific' && config.societies.ids.length > 0) {
      await this.userRepository.assignUserToSocieties(
        userId,
        config.societies.ids,
      );
    } else if (config.societies.mode === 'all') {
      // Si es "todas", no hacer nada (el backend maneja esto por defecto)
      // O podríamos desasignar todas las sociedades específicas
    }
  }
}

