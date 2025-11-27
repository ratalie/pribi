import type { MaybeRef } from "vue";
import { computed, ref, unref } from "vue";

import type { DirectorDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application/dtos/director.dto";
import { CreateDirectorUseCase } from "~/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/director/create-director.use-case";
import { GetDirectorUseCase } from "~/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/director/get-director.use-case";
import { UpdateDirectorUseCase } from "~/core/hexag/registros/sociedades/pasos/directorio/application/use-cases/director/update-director.use-case";
import type { DirectorConfig } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/entities/director.entity";
import { DirectorHttpRepository } from "~/core/hexag/registros/sociedades/pasos/directorio/infrastructure/repositories/director.http.repository";

type UseDirectoresOptions = {
  societyId: MaybeRef<string>;
};

// Instanciar repositorio y casos de uso fuera del composable
const repository = new DirectorHttpRepository();
const getUseCase = new GetDirectorUseCase(repository);
const createUseCase = new CreateDirectorUseCase(repository);
const updateUseCase = new UpdateDirectorUseCase(repository);

export function useDirectores(options: MaybeRef<string> | UseDirectoresOptions) {
  const societyIdRef =
    typeof options === "object" && "societyId" in options ? options.societyId : options;

  const directores = ref<DirectorConfig[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);
  const error = ref<Error | null>(null);

  const exists = computed(() => directores.value.length > 0);

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
      const result = await getUseCase.execute(id);
      directores.value = result || [];
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const create = async (payload: DirectorDTO) => {
    const id = resolveSocietyId();
    isSaving.value = true;
    error.value = null;
    try {
      const created = await createUseCase.execute(id, payload);
      directores.value.push(created);
      return created;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  const update = async (directorId: string, payload: DirectorDTO) => {
    const id = resolveSocietyId();
    isSaving.value = true;
    error.value = null;
    try {
      const updated = await updateUseCase.execute(id, directorId, payload);
      const index = directores.value.findIndex((item) => item.id === directorId);
      if (index >= 0) {
        directores.value[index] = updated;
      } else {
        directores.value.push(updated);
      }
      return updated;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      isSaving.value = false;
    }
  };

  return {
    directores,
    isLoading,
    isSaving,
    error,
    exists,
    fetchAll,
    create,
    update,
  };
}
