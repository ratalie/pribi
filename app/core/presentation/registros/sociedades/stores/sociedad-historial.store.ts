import { defineStore } from "pinia";

import {
  CreateSociedadUseCase,
  DeleteSociedadUseCase,
  ListSociedadesUseCase,
} from "~/core/hexag/registros/sociedades/application/use-cases";
import type { SociedadResumenDTO } from "~/core/hexag/registros/sociedades/application/dtos";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories";
import { SocietyRegisterStep } from "~/core/hexag/registros/sociedades/domain/enums/society-register-step.enum";

type Status = "idle" | "loading" | "error";

/**
 * Store para Historial de Sociedades
 * 
 * Maneja el estado de las sociedades registradas:
 * - Listado de sociedades
 * - Creación de nuevas sociedades
 * - Eliminación de sociedades
 * - Filtrado por paso actual
 * 
 * ⚠️ IMPORTANTE: Usa Option API de Pinia (NO Composition API)
 */
export const useSociedadHistorialStore = defineStore(
  "registros-sociedad-historial",
  {
    state: () => ({
      sociedades: [] as SociedadResumenDTO[],
      status: "idle" as Status,
      errorMessage: null as string | null,
    }),

    getters: {
      /**
       * Total de sociedades registradas
       */
      totalSociedades: (state) => state.sociedades.length,

      /**
       * Sociedades agrupadas por paso actual
       */
      sociedadesPorPaso: (state) => {
        return state.sociedades.reduce<Record<SocietyRegisterStep, SociedadResumenDTO[]>>(
          (acc, sociedad) => {
            const paso = sociedad.pasoActual ?? SocietyRegisterStep.DATOS_SOCIEDAD;
            if (!acc[paso]) {
              acc[paso] = [];
            }
            acc[paso].push(sociedad);
            return acc;
          },
          {
            [SocietyRegisterStep.DATOS_SOCIEDAD]: [],
            [SocietyRegisterStep.ACCIONISTAS]: [],
            [SocietyRegisterStep.ACCIONES]: [],
            [SocietyRegisterStep.ASIGNACION_ACCIONES]: [],
            [SocietyRegisterStep.DIRECTORIO]: [],
            [SocietyRegisterStep.REGISTRO_APODERADOS]: [],
            [SocietyRegisterStep.REGIMEN_PODERES]: [],
            [SocietyRegisterStep.QUORUMS_MAYORIAS]: [],
            [SocietyRegisterStep.ACUERDOS_SOCIETARIOS]: [],
            [SocietyRegisterStep.RESUMEN]: [],
            [SocietyRegisterStep.FINALIZAR]: [],
          }
        );
      },

      /**
       * Sociedades en progreso (no finalizadas)
       */
      sociedadesEnProgreso: (state) =>
        state.sociedades.filter((sociedad) => sociedad.pasoActual !== SocietyRegisterStep.FINALIZAR),

      /**
       * Sociedades finalizadas
       */
      sociedadesFinalizadas: (state) =>
        state.sociedades.filter((sociedad) => sociedad.pasoActual === SocietyRegisterStep.FINALIZAR),

      /**
       * Indica si está cargando
       */
      isLoading: (state) => state.status === "loading",

      /**
       * Indica si hay error
       */
      hasError: (state) => state.status === "error",
    },

    actions: {
      /**
       * Carga el historial de sociedades desde el backend
       */
      async cargarHistorial() {
        this.status = "loading";
        this.errorMessage = null;

        try {
          const repository = new SociedadHttpRepository();
          const listUseCase = new ListSociedadesUseCase(repository);
          const result = await listUseCase.execute();
          console.debug("[Store][SociedadHistorial] Sociedades obtenidas", result);
          this.sociedades = result;
          this.status = "idle";
        } catch (error) {
          const statusCode =
            (error as any)?.statusCode ?? (error as any)?.response?.status ?? null;
          const message =
            (error as any)?.data?.message ??
            (error as any)?.response?._data?.message ??
            (error as any)?.message ??
            "Error desconocido";
          console.error("[SociedadHistorialStore] Error al cargar sociedades:", {
            statusCode,
            message,
          });
          this.status = "error";
          this.errorMessage =
            statusCode === 401
              ? "Tu sesión expiró o el token no es válido. Inicia sesión nuevamente."
              : "No pudimos obtener el historial de sociedades.";
        }
      },

      /**
       * Crea una nueva sociedad
       * @returns ID de la sociedad creada o null si hubo error
       */
      async crearSociedad(): Promise<string | null> {
        try {
          const repository = new SociedadHttpRepository();
          const createUseCase = new CreateSociedadUseCase(repository);
          const id = await createUseCase.execute();
          console.debug("[Store][SociedadHistorial] Sociedad creada con id", id);
          await this.cargarHistorial();
          return id;
        } catch (error) {
          console.error("[SociedadHistorialStore] Error al crear sociedad:", error);
          this.errorMessage = "No pudimos crear una nueva sociedad.";
          return null;
        }
      },

      /**
       * Elimina una sociedad por ID
       * @param id - ID de la sociedad a eliminar
       */
      async eliminarSociedad(id: string) {
        try {
          const repository = new SociedadHttpRepository();
          const deleteUseCase = new DeleteSociedadUseCase(repository);
          await deleteUseCase.execute(id);
          console.debug("[Store][SociedadHistorial] Sociedad eliminada", id);
          await this.cargarHistorial();
        } catch (error) {
          console.error("[SociedadHistorialStore] Error al eliminar sociedad:", error);
          this.errorMessage = "No pudimos eliminar la sociedad seleccionada.";
        }
      },

      /**
       * Elimina todas las sociedades registradas
       */
      async eliminarTodasLasSociedades() {
        if (this.sociedades.length === 0) {
          return;
        }

        this.status = "loading";
        this.errorMessage = null;

        const repository = new SociedadHttpRepository();
        const deleteUseCase = new DeleteSociedadUseCase(repository);
        const errors: string[] = [];
        let eliminadas = 0;

        try {
          for (const sociedad of this.sociedades) {
            try {
              await deleteUseCase.execute(sociedad.idSociety);
              eliminadas++;
              console.debug("[Store][SociedadHistorial] Sociedad eliminada", sociedad.idSociety);
            } catch (error) {
              const errorMsg =
                (error as any)?.message ?? "Error desconocido";
              errors.push(`${sociedad.razonSocial || sociedad.idSociety}: ${errorMsg}`);
              console.error(
                "[SociedadHistorialStore] Error al eliminar sociedad:",
                sociedad.idSociety,
                error
              );
            }
          }

          // Recargar historial después de eliminar
          await this.cargarHistorial();

          if (errors.length > 0) {
            this.errorMessage = `Se eliminaron ${eliminadas} de ${this.sociedades.length} sociedades. Errores:\n${errors.join("\n")}`;
          } else {
            this.errorMessage = null;
          }
        } catch (error) {
          console.error("[SociedadHistorialStore] Error general al eliminar todas:", error);
          this.errorMessage = "Ocurrió un error al eliminar las sociedades.";
          this.status = "error";
        }
      },
    },
  },
  {
    persist: true,
  }
);

