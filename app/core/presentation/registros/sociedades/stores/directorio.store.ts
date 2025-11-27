import { defineStore } from "pinia";
import { ref } from "vue";

import {
  CreateDirectorioUseCase,
  GetDirectorioUseCase,
  UpdateDirectorioUseCase,
  type DirectorioDTO,
} from "~/core/hexag/registros/sociedades/pasos/directorio/application";
import type { DirectorioConfig } from "~/core/hexag/registros/sociedades/pasos/directorio/domain";
import { DirectorioHttpRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/directorio.http.repository";

type Status = "idle" | "loading" | "saving" | "error";

export const useDirectorioStore = defineStore(
  "registros-directorio",
  () => {
    const repository = new DirectorioHttpRepository();
    const getUseCase = new GetDirectorioUseCase(repository);
    const createUseCase = new CreateDirectorioUseCase(repository);
    const updateUseCase = new UpdateDirectorioUseCase(repository);

    const config = ref<DirectorioConfig | null>(null);
    const status = ref<Status>("idle");
    const errorMessage = ref<string | null>(null);

    async function load(societyProfileId: string) {
      status.value = "loading";
      errorMessage.value = null;

      try {
        console.debug("[DirectorioStore] load:start", { societyProfileId });
        const result = await getUseCase.execute(societyProfileId);
        console.debug("[DirectorioStore] load:success", { result });
        config.value = result;
        status.value = "idle";
      } catch (error: any) {
        const statusCode = error?.statusCode ?? error?.response?.status;
        if (statusCode === 404) {
          console.warn("[DirectorioStore] load:not-found", { societyProfileId });
          config.value = null;
          status.value = "idle";
          errorMessage.value = null;
          return;
        }

        console.error("[DirectorioStore] load error", error);
        status.value = "error";
        errorMessage.value = "No pudimos obtener la configuración del directorio.";
      }
    }

    async function create(societyProfileId: string, payload: DirectorioDTO) {
      status.value = "saving";
      errorMessage.value = null;

      try {
        console.debug("[DirectorioStore] create:start", { societyProfileId, payload });
        const result = await createUseCase.execute(societyProfileId, payload);
        console.debug("[DirectorioStore] create:success", { result });
        config.value = result;
        status.value = "idle";
      } catch (error) {
        console.error("[DirectorioStore] create error", error);
        status.value = "error";
        errorMessage.value = "No pudimos registrar el directorio.";
        throw error;
      }
    }

    async function update(societyProfileId: string, payload: DirectorioDTO) {
      status.value = "saving";
      errorMessage.value = null;

      try {
        console.debug("[DirectorioStore] update:start", { societyProfileId, payload });
        const result = await updateUseCase.execute(societyProfileId, payload);
        console.debug("[DirectorioStore] update:success", { result });
        config.value = result;
        status.value = "idle";
      } catch (error) {
        console.error("[DirectorioStore] update error", error);
        status.value = "error";
        errorMessage.value = "No pudimos actualizar el directorio.";
        throw error;
      }
    }

    return {
      config,
      status,
      errorMessage,
      load,
      create,
      update,
    };
  },
  {
    persist: true,
  }
);
