import { computed, ref, unref } from "vue";
import type { MaybeRef } from "vue";

import {
  CreateDatosSociedadUseCase,
  GetDatosSociedadUseCase,
  UpdateDatosSociedadUseCase,
  type DatosSociedadDTO,
} from "@hexag/registros/sociedades/pasos/datos-sociedad/application";
import type { SociedadDatosGenerales } from "@hexag/registros/sociedades/pasos/datos-sociedad/domain";
import { DatosSociedadHttpRepository } from "@hexag/registros/sociedades/pasos/datos-sociedad/infrastructure";

type SaveResult = "created" | "updated";

interface UseDatosSociedadOptions {
  societyId: MaybeRef<string>;
}

const repository = new DatosSociedadHttpRepository();
const getUseCase = new GetDatosSociedadUseCase(repository);
const createUseCase = new CreateDatosSociedadUseCase(repository);
const updateUseCase = new UpdateDatosSociedadUseCase(repository);

export function useDatosSociedad(options: UseDatosSociedadOptions | MaybeRef<string>) {
  const societyIdRef =
    typeof options === "object" && "societyId" in options ? options.societyId : options;

  const datos = ref<SociedadDatosGenerales | null>(null);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<Error | null>(null);

  const exists = computed(() => datos.value !== null);

  const resolveSocietyId = () => {
    const value = unref(societyIdRef);
    if (!value) {
      throw new Error("El identificador de la sociedad es obligatorio.");
    }
    return value;
  };

  const fetch = async () => {
    const id = resolveSocietyId();
    isLoading.value = true;
    error.value = null;

    try {
      datos.value = await getUseCase.execute(id);
      return datos.value;
    } catch (err: any) {
      const statusCode = err?.statusCode ?? err?.response?.status;
      if (statusCode === 404) {
        datos.value = null;
        error.value = null;
        return null;
      }

      datos.value = null;
      error.value = err as Error;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const save = async (payload: DatosSociedadDTO): Promise<SaveResult> => {
    const id = resolveSocietyId();
    isSaving.value = true;
    error.value = null;

    try {
      if (exists.value) {
        datos.value = await updateUseCase.execute(id, payload);
        return "updated";
      }

      datos.value = await createUseCase.execute(id, payload);
      return "created";
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  return {
    datos,
    isLoading,
    isSaving,
    error,
    exists,
    fetch,
    save,
  };
}

