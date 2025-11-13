import { computed, ref } from "vue";
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

export const useSociedadHistorialStore = defineStore(
  "registros-sociedad-historial",
  () => {
    const repository = new SociedadHttpRepository();

    const listUseCase = new ListSociedadesUseCase(repository);
    const createUseCase = new CreateSociedadUseCase(repository);
    const deleteUseCase = new DeleteSociedadUseCase(repository);

    const sociedades = ref<SociedadResumenDTO[]>([]);
    const status = ref<Status>("idle");
    const errorMessage = ref<string | null>(null);

    const totalSociedades = computed(() => sociedades.value.length);

    const sociedadesPorPaso = computed(() => {
      return sociedades.value.reduce<Record<SocietyRegisterStep, SociedadResumenDTO[]>>(
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
    });

    const sociedadesEnProgreso = computed(() =>
      sociedades.value.filter((sociedad) => sociedad.pasoActual !== SocietyRegisterStep.FINALIZAR)
    );

    const sociedadesFinalizadas = computed(() =>
      sociedades.value.filter((sociedad) => sociedad.pasoActual === SocietyRegisterStep.FINALIZAR)
    );

    async function cargarHistorial() {
      status.value = "loading";
      errorMessage.value = null;

      try {
        const result = await listUseCase.execute();
        console.debug("[Store][SociedadHistorial] Sociedades obtenidas", result);
        sociedades.value = result;
        status.value = "idle";
      } catch (error) {
        console.error("[SociedadHistorialStore] Error al cargar sociedades:", error);
        status.value = "error";
        errorMessage.value = "No pudimos obtener el historial de sociedades.";
      }
    }

    async function crearSociedad(): Promise<string | null> {
      try {
        const id = await createUseCase.execute();
        console.debug("[Store][SociedadHistorial] Sociedad creada con id", id);
        await cargarHistorial();
        return id;
      } catch (error) {
        console.error("[SociedadHistorialStore] Error al crear sociedad:", error);
        errorMessage.value = "No pudimos crear una nueva sociedad.";
        return null;
      }
    }

    async function eliminarSociedad(id: string) {
      try {
        await deleteUseCase.execute(id);
        console.debug("[Store][SociedadHistorial] Sociedad eliminada", id);
        await cargarHistorial();
      } catch (error) {
        console.error("[SociedadHistorialStore] Error al eliminar sociedad:", error);
        errorMessage.value = "No pudimos eliminar la sociedad seleccionada.";
      }
    }

    return {
      sociedades,
      status,
      errorMessage,
      totalSociedades,
      sociedadesPorPaso,
      sociedadesEnProgreso,
      sociedadesFinalizadas,
      cargarHistorial,
      crearSociedad,
      eliminarSociedad,
    };
  },
  {
    persist: true,
  }
);

