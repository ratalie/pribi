import { defineStore } from "pinia";
import { ref } from "vue";

import {
  CreateQuorumUseCase,
  GetQuorumUseCase,
  UpdateQuorumUseCase,
  type QuorumDTO,
} from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/application";
import type { QuorumConfig } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/domain";
import { QuorumHttpRepository } from "~/core/hexag/registros/sociedades/pasos/quorum-mayorias/infrastructure/repositories/quorum.http.repository";

type Status = "idle" | "loading" | "saving" | "error";

export const useQuorumStore = defineStore(
  "registros-quorum",
  () => {
    const repository = new QuorumHttpRepository();
    const getUseCase = new GetQuorumUseCase(repository);
    const createUseCase = new CreateQuorumUseCase(repository);
    const updateUseCase = new UpdateQuorumUseCase(repository);

    const config = ref<QuorumConfig | null>(null);
    const status = ref<Status>("idle");
    const errorMessage = ref<string | null>(null);

    async function load(societyProfileId: string) {
      status.value = "loading";
      errorMessage.value = null;

      try {
        console.debug("[QuorumStore] load:start", { societyProfileId });
        const result = await getUseCase.execute(societyProfileId);
        console.debug("[QuorumStore] load:success", { result });
        config.value = result;
        status.value = "idle";
      } catch (error: any) {
        const statusCode = error?.statusCode ?? error?.response?.status;
        if (statusCode === 404) {
          console.warn("[QuorumStore] load:not-found", { societyProfileId });
          config.value = null;
          status.value = "idle";
          errorMessage.value = null;
          return;
        }

        console.error("[QuorumStore] load error", error);
        status.value = "error";
        errorMessage.value = "No pudimos obtener la configuración de quórum.";
      }
    }

    async function create(societyProfileId: string, payload: QuorumDTO) {
      status.value = "saving";
      errorMessage.value = null;

      try {
        console.debug("[QuorumStore] create:start", { societyProfileId, payload });
        const result = await createUseCase.execute(societyProfileId, payload);
        console.debug("[QuorumStore] create:success", { result });
        config.value = result;
        status.value = "idle";
      } catch (error) {
        console.error("[QuorumStore] create error", error);
        status.value = "error";
        errorMessage.value = "No pudimos registrar el quórum.";
        throw error;
      }
    }

    async function update(societyProfileId: string, payload: QuorumDTO) {
      status.value = "saving";
      errorMessage.value = null;

      try {
        console.debug("[QuorumStore] update:start", { societyProfileId, payload });
        const result = await updateUseCase.execute(societyProfileId, payload);
        console.debug("[QuorumStore] update:success", { result });
        config.value = result;
        status.value = "idle";
      } catch (error) {
        console.error("[QuorumStore] update error", error);
        status.value = "error";
        errorMessage.value = "No pudimos actualizar el quórum.";
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
