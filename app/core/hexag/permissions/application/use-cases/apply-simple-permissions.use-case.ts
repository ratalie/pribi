import type { PermissionsRepository } from "../../domain/ports/permissions.repository";
import type { UserRepository } from "~/core/hexag/panel-administrativo/domain/ports/user.repository";
import type { SimplePermissionsConfig } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";
import type { UserOverride } from "../../domain/entities/user-override.entity";
import { mapSimpleConfigToOverrides } from "../mappers/simple-config-to-overrides.mapper";
import { FlowCodeEnum } from "../../domain/enums/flow-code.enum";
import { PermissionActionEnum } from "../../domain/enums/permission-action.enum";
import { ROLE_MAPPING } from "~/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types";

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
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Ejecuta la aplicación de permisos simplificados
   */
  async execute(userId: string, config: SimplePermissionsConfig): Promise<void> {
    console.log('[ApplySimplePermissionsUseCase] INICIO - Aplicando permisos para usuario:', userId);
    console.log('[ApplySimplePermissionsUseCase] Configuración recibida:', JSON.stringify(config, null, 2));

    // 1. Actualizar rol del usuario si es necesario
    const backendRole = ROLE_MAPPING[config.role];
    console.log('[ApplySimplePermissionsUseCase] Rol a actualizar:', config.role, '->', backendRole);
    if (backendRole) {
      // Mapear rol simple a formato del repositorio
      const roleMap: Record<string, "lector" | "editor" | "admin" | "user"> = {
        Administrador: "admin",
        Editor: "editor",
        Lector: "lector",
      };

      const roleKey = roleMap[config.role] || "user";
      console.log('[ApplySimplePermissionsUseCase] Actualizando rol del usuario a:', roleKey);
      await this.userRepository.updateUserRole(userId, roleKey);
      console.log('[ApplySimplePermissionsUseCase] Rol actualizado correctamente');
    }

    // 2. Aplicar overrides de permisos (solo si no es Administrador)
    if (config.role !== "Administrador") {
      console.log('[ApplySimplePermissionsUseCase] No es Administrador, generando overrides...');
      const backendOverrides = mapSimpleConfigToOverrides(config);
      console.log('[ApplySimplePermissionsUseCase] Overrides generados:', JSON.stringify(backendOverrides, null, 2));

      if (backendOverrides && backendOverrides.length > 0) {
        console.log('[ApplySimplePermissionsUseCase] Enviando overrides al backend...');
        // Enviar directamente el formato que espera el backend (UpsertUserOverrideDto)
        // El repositorio HTTP ahora acepta este formato directamente
        const result = await this.permissionsRepository.updateUserOverrides(userId, {
          overrides: backendOverrides,
        });
        console.log('[ApplySimplePermissionsUseCase] Respuesta del backend al guardar overrides:', JSON.stringify(result, null, 2));
      } else {
        console.log('[ApplySimplePermissionsUseCase] No hay overrides para enviar');
      }
    } else {
      console.log('[ApplySimplePermissionsUseCase] Es Administrador, no se generan overrides');
    }

    // 3. Asignar sociedades si es necesario
    if (config.societies.mode === "specific" && config.societies.ids.length > 0) {
      console.log('[ApplySimplePermissionsUseCase] Asignando sociedades específicas:', config.societies.ids);
      await this.userRepository.assignUserToSocieties(userId, config.societies.ids);
    } else if (config.societies.mode === "all") {
      console.log('[ApplySimplePermissionsUseCase] Modo "todas las sociedades", no se hace nada');
      // Si es "todas", no hacer nada (el backend maneja esto por defecto)
      // O podríamos desasignar todas las sociedades específicas
    }

    console.log('[ApplySimplePermissionsUseCase] FIN - Permisos aplicados correctamente');
  }
}
