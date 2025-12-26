import { defineStore } from "pinia";
import type {
  SimplePermissionsConfig,
  SimpleRole,
  ModuleConfig,
  SocietiesConfig,
  ActionsConfig,
} from "../vistas/configurar-permisos/types/configurar-permisos.types";
import { AVAILABLE_AREAS } from "../vistas/configurar-permisos/types/configurar-permisos.types";
import { getDefaultPermissionsForRole } from "../vistas/configurar-permisos/utils/role-permissions.utils";

/**
 * Store para la configuración de permisos simplificada
 */
export const usePermissionsConfigStore = defineStore("permissions-config", {
  state: () => ({
    // Configuración simple actual
    selectedRole: "Editor" as SimpleRole,
    selectedModules: [] as ModuleConfig[],
    selectedSocieties: {
      mode: "all" as "all" | "specific",
      ids: [] as string[],
    } as SocietiesConfig,
    selectedActions: {
      view: true,
      create: true,
      update: true,
      delete: false,
      file: true,
    } as ActionsConfig,

    // Modo de configuración
    mode: "simple" as "simple" | "advanced",

    // Estado de carga
    isLoading: false,
    isSaving: false,

    // ID del usuario que se está configurando
    currentUserId: null as string | null,
  }),

  getters: {
    /**
     * Obtiene la configuración completa
     */
    config(state): SimplePermissionsConfig {
      return {
        role: state.selectedRole,
        modules: state.selectedModules,
        societies: state.selectedSocieties,
        actions: state.selectedActions,
      };
    },

    /**
     * Verifica si la configuración es válida
     */
    isValid(state): boolean {
      // Si es Administrador, no necesita validación adicional
      if (state.selectedRole === "Administrador") {
        return true;
      }

      // Si es Editor o Lector, debe tener al menos un módulo habilitado
      if (state.selectedModules.length === 0) {
        return false;
      }

      // Si el modo es 'specific', debe tener al menos una sociedad seleccionada
      if (
        state.selectedSocieties.mode === "specific" &&
        state.selectedSocieties.ids.length === 0
      ) {
        return false;
      }

      // Si es Lector, solo debe tener 'view' habilitado
      if (state.selectedRole === "Lector") {
        return (
          state.selectedActions.view === true &&
          state.selectedActions.create === false &&
          state.selectedActions.update === false &&
          state.selectedActions.delete === false
        );
      }

      return true;
    },
  },

  actions: {
    /**
     * Aplica los permisos base por defecto para un rol
     * Este método se llama automáticamente cuando cambia el rol
     */
    applyRoleDefaults(role: SimpleRole) {
      const defaultPermissions = getDefaultPermissionsForRole(role);
      this.selectedActions = { ...defaultPermissions };
    },

    /**
     * Establece el rol seleccionado
     */
    setRole(role: SimpleRole) {
      this.selectedRole = role;

      // Aplicar permisos base automáticamente según el rol
      this.applyRoleDefaults(role);

      // Si es Administrador o Administrador Superior, no necesitamos módulos específicos
      if (role === "Administrador" || role === "Administrador Superior") {
        // Mantener el rol y permisos, pero resetear módulos y sociedades
        this.selectedModules = [];
        this.selectedSocieties = {
          mode: "all",
          ids: [],
        };
        return;
      }

      // Inicializar módulos si no hay ninguno
      if (this.selectedModules.length === 0) {
        this.initializeModules();
      }
    },

    /**
     * Inicializa los módulos con todas las áreas habilitadas
     */
    initializeModules() {
      this.selectedModules = AVAILABLE_AREAS.map((area) => ({
        area,
        enabled: true,
        submodules: [],
      }));
    },

    /**
     * Establece los módulos seleccionados
     */
    setModules(modules: ModuleConfig[]) {
      this.selectedModules = modules;
    },

    /**
     * Toggle de un módulo
     */
    toggleModule(area: string) {
      const module = this.selectedModules.find((m) => m.area === area);
      if (module) {
        module.enabled = !module.enabled;
      } else {
        // Si no existe, agregarlo
        this.selectedModules.push({
          area,
          enabled: true,
          submodules: [],
        });
      }
    },

    /**
     * Establece las sociedades seleccionadas
     */
    setSocieties(societies: SocietiesConfig) {
      this.selectedSocieties = societies;
    },

    /**
     * Establece el modo de sociedades
     */
    setSocietiesMode(mode: "all" | "specific") {
      this.selectedSocieties.mode = mode;
      if (mode === "all") {
        this.selectedSocieties.ids = [];
      }
    },

    /**
     * Agrega una sociedad a la lista
     */
    addSociety(societyId: string) {
      if (!this.selectedSocieties.ids.includes(societyId)) {
        this.selectedSocieties.ids.push(societyId);
      }
    },

    /**
     * Remueve una sociedad de la lista
     */
    removeSociety(societyId: string) {
      this.selectedSocieties.ids = this.selectedSocieties.ids.filter((id) => id !== societyId);
    },

    /**
     * Establece las acciones seleccionadas
     */
    setActions(actions: ActionsConfig) {
      console.log("[PermissionsConfigStore] setActions llamado con:", actions);
      console.log("[PermissionsConfigStore] Rol actual:", this.selectedRole);

      // Si es Lector, solo permitir 'view'
      if (this.selectedRole === "Lector") {
        console.log("[PermissionsConfigStore] Es Lector, forzando solo view");
        this.selectedActions = {
          view: actions.view,
          create: false,
          update: false,
          delete: false,
          file: false,
        };
        return;
      }

      // Crear nueva referencia para asegurar reactividad
      this.selectedActions = { ...actions };
      console.log("[PermissionsConfigStore] Acciones actualizadas:", this.selectedActions);
    },

    /**
     * Toggle de una acción
     */
    toggleAction(action: keyof ActionsConfig) {
      // Si es Lector, solo permitir 'view'
      if (this.selectedRole === "Lector" && action !== "view") {
        return;
      }

      this.selectedActions[action] = !this.selectedActions[action];
    },

    /**
     * Establece el modo de configuración
     */
    setMode(mode: "simple" | "advanced") {
      this.mode = mode;
    },

    /**
     * Establece el ID del usuario actual
     */
    setCurrentUserId(userId: string | null) {
      this.currentUserId = userId;
    },

    /**
     * Carga la configuración desde un usuario existente
     */
    async loadFromUser(userId: string) {
      this.isLoading = true;
      this.currentUserId = userId;

      try {
        // Cargar permisos completos del usuario desde el backend
        const { PermissionsHttpRepository } = await import(
          "~/core/hexag/permissions/infrastructure/repositories/permissions.http.repository"
        );
        const { mapOverridesToSimpleConfig } = await import(
          "~/core/hexag/permissions/application/mappers/overrides-to-simple-config.mapper"
        );
        const { UserHttpRepository } = await import(
          "~/core/hexag/panel-administrativo/infrastructure/repositories/user-http.repository"
        );

        const permissionsRepository = new PermissionsHttpRepository();
        const userRepository = new UserHttpRepository();

        console.log("[PermissionsConfigStore] Cargando datos del usuario:", userId);

        // Obtener información del usuario primero (para validar que existe)
        const user = await userRepository.findById(userId);
        if (!user) {
          throw new Error("Usuario no encontrado");
        }
        console.log("[PermissionsConfigStore] Usuario encontrado:", user.email);

        // Obtener permisos completos del usuario
        const accessAreas = await permissionsRepository.getUserAccessFull(userId);
        console.log(
          "[PermissionsConfigStore] Permisos cargados del backend:",
          accessAreas.length,
          "áreas"
        );
        console.log(
          "[PermissionsConfigStore] Datos completos del backend:",
          JSON.stringify(accessAreas, null, 2)
        );

        // Convertir permisos del backend a configuración simple
        const config = mapOverridesToSimpleConfig(
          accessAreas,
          user.role.name as
            | "Administrador"
            | "AdministradorEstudio"
            | "Usuario"
            | "Lector"
            | "Externo"
        );
        console.log(
          "[PermissionsConfigStore] Configuración mapeada:",
          JSON.stringify(config, null, 2)
        );

        // Aplicar configuración al store
        console.log("[PermissionsConfigStore] Aplicando configuración al store...");
        console.log("[PermissionsConfigStore] Rol a asignar:", config.role);
        console.log("[PermissionsConfigStore] Módulos a asignar:", config.modules);
        console.log("[PermissionsConfigStore] Acciones a asignar:", config.actions);

        this.selectedRole = config.role;
        this.selectedModules = [...config.modules]; // Crear nueva referencia para reactividad
        this.selectedActions = { ...config.actions }; // Crear nueva referencia para reactividad

        console.log("[PermissionsConfigStore] Store actualizado:");
        console.log("[PermissionsConfigStore] - selectedRole:", this.selectedRole);
        console.log("[PermissionsConfigStore] - selectedActions:", this.selectedActions);

        // Cargar sociedades asignadas
        const assignedSocieties = await userRepository.getUserAssignedSocieties(userId);
        console.log(
          "[PermissionsConfigStore] Sociedades asignadas:",
          assignedSocieties.length
        );
        if (assignedSocieties.length > 0) {
          this.selectedSocieties = {
            mode: "specific",
            ids: assignedSocieties,
          };
        } else {
          this.selectedSocieties = {
            mode: "all",
            ids: [],
          };
        }
      } catch (error: any) {
        console.error(
          "[PermissionsConfigStore] Error al cargar configuración del usuario:",
          error
        );
        console.error("[PermissionsConfigStore] Error details:", {
          message: error?.message,
          stack: error?.stack,
          userId,
        });
        // En caso de error, inicializar con valores por defecto
        this.initializeModules();
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Resetea la configuración
     */
    reset() {
      this.selectedRole = "Editor";
      this.selectedModules = [];
      this.selectedSocieties = {
        mode: "all",
        ids: [],
      };
      this.selectedActions = {
        view: true,
        create: true,
        update: true,
        delete: false,
        file: true,
      };
      this.currentUserId = null;
    },
  },
});
