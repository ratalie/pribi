import { computed, ref, unref } from "vue";
import type { MaybeRef } from "vue";

import {
  CreateAccionistaUseCase,
  DeleteAccionistaUseCase,
  ListAccionistasUseCase,
  UpdateAccionistaUseCase,
  type AccionistaDTO,
} from "@hexag/registros/sociedades/pasos/accionistas/application";
import type { Accionista } from "@hexag/registros/sociedades/pasos/accionistas/domain";
import { AccionistasHttpRepository } from "@hexag/registros/sociedades/pasos/accionistas/infrastructure/repositories/accionistas.http.repository";

type UseAccionistasOptions = {
  societyId: MaybeRef<string>;
};

const repository = new AccionistasHttpRepository();
const listUseCase = new ListAccionistasUseCase(repository);
const createUseCase = new CreateAccionistaUseCase(repository);
const updateUseCase = new UpdateAccionistaUseCase(repository);
const deleteUseCase = new DeleteAccionistaUseCase(repository);

export function useAccionistas(options: MaybeRef<string> | UseAccionistasOptions) {
  const societyIdRef =
    typeof options === "object" && "societyId" in options ? options.societyId : options;

  const accionistas = ref<Accionista[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<Error | null>(null);

  const exists = computed(() => accionistas.value.length > 0);

  const resolveSocietyId = () => {
    const value = unref(societyIdRef);
    if (!value || value.length === 0) {
      throw new Error("No encontramos el identificador de la sociedad.");
    }
    return value;
  };

  const fetchAll = async () => {
    const id = resolveSocietyId();
    isLoading.value = true;
    error.value = null;
    try {
      accionistas.value = await listUseCase.execute(id);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (payload: AccionistaDTO) => {
    const id = resolveSocietyId();
    isSaving.value = true;
    error.value = null;
    try {
      const created = await createUseCase.execute(id, payload);
      accionistas.value.push(created);
      return created;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  const update = async (accionistaId: string, payload: AccionistaDTO) => {
    const id = resolveSocietyId();
    isSaving.value = true;
    error.value = null;
    try {
      const updated = await updateUseCase.execute(id, {
        ...payload,
        id: accionistaId,
      });
      const index = accionistas.value.findIndex((item) => item.id === accionistaId);
      if (index >= 0) {
        accionistas.value[index] = updated;
      } else {
        accionistas.value.push(updated);
      }
      return updated;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  const remove = async (accionistaId: string) => {
    const id = resolveSocietyId();
    isSaving.value = true;
    error.value = null;
    try {
      await deleteUseCase.execute(id, accionistaId);
      accionistas.value = accionistas.value.filter((item) => item.id !== accionistaId);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  return {
    accionistas,
    isLoading,
    isSaving,
    error,
    exists,
    fetchAll,
    create,
    update,
    remove,
  };
}



