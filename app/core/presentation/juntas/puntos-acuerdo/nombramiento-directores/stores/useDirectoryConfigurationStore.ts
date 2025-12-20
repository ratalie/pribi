import { defineStore } from "pinia";
import type {
  DirectoryConfigurationResponseDTO,
  UpdateDirectoryConfigurationDTO,
} from "~/core/hexag/juntas/application/dtos/directory-configuration.dto";
import { GetDirectoryConfigurationUseCase } from "~/core/hexag/juntas/application/use-cases/directory-configuration/get-directory-configuration.use-case";
import { UpdateDirectoryConfigurationUseCase } from "~/core/hexag/juntas/application/use-cases/directory-configuration/update-directory-configuration.use-case";
import { DirectoryConfigurationHttpRepository } from "~/core/hexag/juntas/infrastructure/repositories/directory-configuration.http.repository";

/**
 * Store para Configuración de Directorio en Juntas
 *
 * Responsabilidades:
 * - Gestionar la configuración de directorio del snapshot
 * - Cargar configuración desde backend
 * - Actualizar configuración (PUT)
 *
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 * ⚠️ Este store actualiza el directorio del SNAPSHOT (no el directorio base)
 */
export const useDirectoryConfigurationStore = defineStore("directoryConfiguration", {
  // ✅ PERSISTENCIA: Guardar en localStorage
  persist: {
    storage: typeof window !== "undefined" ? localStorage : undefined,
    key: "probo-directory-configuration",
  },

  state: () => ({
    /** Configuración de directorio actual */
    configuration: null as DirectoryConfigurationResponseDTO | null,

    /** Estado de carga */
    status: "idle" as "idle" | "loading" | "error" | "saving",

    /** Mensaje de error */
    errorMessage: null as string | null,
  }),

  getters: {
    /**
     * Verificar si hay configuración cargada
     */
    hasConfiguration(): boolean {
      return this.configuration !== null;
    },

    /**
     * Obtener cantidad de directores actual
     */
    cantidadDirectores(): number {
      return this.configuration?.cantidadDirectores ?? 0;
    },

    /**
     * Verificar si el directorio tiene conteo personalizado
     */
    tieneConteoPersonalizado(): boolean {
      return this.configuration?.conteoPersonalizado ?? false;
    },

    /**
     * Obtener mínimo de directores (si tiene conteo personalizado)
     */
    minimoDirectores(): number | null {
      return this.configuration?.minimoDirectores ?? null;
    },

    /**
     * Obtener máximo de directores (si tiene conteo personalizado)
     */
    maximoDirectores(): number | null {
      return this.configuration?.maximoDirectores ?? null;
    },
  },

  actions: {
    /**
     * Cargar configuración de directorio del snapshot
     */
    async loadConfiguration(societyId: number, flowId: number): Promise<void> {
      this.status = "loading";
      this.errorMessage = null;

      const repository = new DirectoryConfigurationHttpRepository();
      const getUseCase = new GetDirectoryConfigurationUseCase(repository);

      try {
        console.debug("[Store][DirectoryConfiguration] loadConfiguration() start", {
          societyId,
          flowId,
        });

        const result = await getUseCase.execute(societyId, flowId);

        console.debug("[Store][DirectoryConfiguration] loadConfiguration() success", {
          result,
        });

        this.configuration = result;
        this.status = "idle";
      } catch (error: any) {
        const statusCode = error?.statusCode ?? error?.response?.status ?? null;
        const message =
          error?.data?.message ??
          error?.response?._data?.message ??
          error?.message ??
          "Error desconocido";

        console.error("[Store][DirectoryConfiguration] loadConfiguration() error", {
          societyId,
          flowId,
          statusCode,
          message,
        });

        this.status = "error";
        this.errorMessage =
          statusCode === 404
            ? "No se encontró la configuración de directorio."
            : "No pudimos obtener la configuración de directorio.";
      }
    },

    /**
     * Actualizar configuración de directorio del snapshot
     * ⚠️ IMPORTANTE: Todos los campos son opcionales - Solo se envían los campos que se necesiten actualizar
     */
    async updateConfiguration(
      societyId: number,
      flowId: number,
      dto: UpdateDirectoryConfigurationDTO
    ): Promise<void> {
      this.status = "saving";
      this.errorMessage = null;

      const repository = new DirectoryConfigurationHttpRepository();
      const updateUseCase = new UpdateDirectoryConfigurationUseCase(repository);

      try {
        console.debug("[Store][DirectoryConfiguration] updateConfiguration() start", {
          societyId,
          flowId,
          dto,
        });

        await updateUseCase.execute(societyId, flowId, dto);

        console.debug("[Store][DirectoryConfiguration] updateConfiguration() success");

        // Recargar la configuración después de actualizar para obtener datos frescos
        await this.loadConfiguration(societyId, flowId);
      } catch (error: any) {
        const statusCode = error?.statusCode ?? error?.response?.status ?? null;
        const message =
          error?.data?.message ??
          error?.response?._data?.message ??
          error?.message ??
          "Error desconocido";

        console.error("[Store][DirectoryConfiguration] updateConfiguration() error", {
          societyId,
          flowId,
          statusCode,
          message,
        });

        this.status = "error";
        this.errorMessage =
          statusCode === 404
            ? "No se encontró la configuración de directorio."
            : "No pudimos actualizar la configuración de directorio.";
        throw error;
      }
    },

    /**
     * Limpiar estado del store
     */
    reset(): void {
      this.configuration = null;
      this.status = "idle";
      this.errorMessage = null;
    },
  },
});

