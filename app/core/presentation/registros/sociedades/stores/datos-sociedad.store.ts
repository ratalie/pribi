import { ref } from "vue";
import { defineStore } from "pinia";

import {
  CreateDatosSociedadUseCase,
  GetDatosSociedadUseCase,
  UpdateDatosSociedadUseCase,
  type DatosSociedadDTO,
} from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/application";
import type { SociedadDatosGenerales } from "~/core/hexag/registros/sociedades/pasos/datos-sociedad/domain";
import { DatosSociedadHttpRepository } from "~/core/hexag/registros/sociedades/infrastructure/repositories";

type Status = "idle" | "loading" | "saving" | "error";

export const useDatosSociedadStore = defineStore("registros-datos-sociedad", () => {
  const repository = new DatosSociedadHttpRepository();
  const getUseCase = new GetDatosSociedadUseCase(repository);
  const createUseCase = new CreateDatosSociedadUseCase(repository);
  const updateUseCase = new UpdateDatosSociedadUseCase(repository);

  const datos = ref<SociedadDatosGenerales | null>(null);
  const status = ref<Status>("idle");
  const errorMessage = ref<string | null>(null);
  const origin = ref<"internal" | "external" | null>(null);

  async function load(idSociety: string, source: "internal" | "external" = "internal") {
    status.value = "loading";
    errorMessage.value = null;
    origin.value = source;

    try {
      datos.value = await getUseCase.execute(idSociety);
      status.value = "idle";
    } catch (error) {
      console.error("[DatosSociedadStore] load error", error);
      status.value = "error";
      errorMessage.value = "No pudimos cargar los datos generales de la sociedad.";
    }
  }

  async function create(idSociety: string, payload: DatosSociedadDTO) {
    status.value = "saving";
    errorMessage.value = null;

    try {
      datos.value = await createUseCase.execute(idSociety, payload);
      status.value = "idle";
    } catch (error) {
      console.error("[DatosSociedadStore] create error", error);
      status.value = "error";
      errorMessage.value = "No pudimos registrar los datos generales.";
      throw error;
    }
  }

  async function update(idSociety: string, payload: DatosSociedadDTO) {
    status.value = "saving";
    errorMessage.value = null;

    try {
      datos.value = await updateUseCase.execute(idSociety, payload);
      status.value = "idle";
    } catch (error) {
      console.error("[DatosSociedadStore] update error", error);
      status.value = "error";
      errorMessage.value = "No pudimos actualizar los datos generales.";
      throw error;
    }
  }

  return {
    datos,
    status,
    errorMessage,
    origin,
    load,
    create,
    update,
  };
});

