import { ref } from "vue";
import { defineStore } from "pinia";

import {
  CreateSociedadUseCase,
  DeleteSociedadUseCase,
  ListSociedadesUseCase,
} from "~/core/hexag/registros/sociedades/application/use-cases";
import type { SociedadResumenDTO } from "~/core/hexag/registros/sociedades/application/dtos";
import { SociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories";

type Status = "idle" | "loading" | "error";

export const useSociedadHistorialStore = defineStore("registros-sociedad-historial", () => {
  const repository = new SociedadHttpRepository();

  const listUseCase = new ListSociedadesUseCase(repository);
  const createUseCase = new CreateSociedadUseCase(repository);
  const deleteUseCase = new DeleteSociedadUseCase(repository);

  const sociedades = ref<SociedadResumenDTO[]>([]);
  const status = ref<Status>("idle");
  const errorMessage = ref<string | null>(null);

  async function cargarHistorial() {
    status.value = "loading";
    errorMessage.value = null;

    try {
      sociedades.value = await listUseCase.execute();
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
    cargarHistorial,
    crearSociedad,
    eliminarSociedad,
  };
});

