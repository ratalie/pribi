import type { Ref } from "vue";
import type { DirectorioDTO } from "~/core/hexag/registros/sociedades/pasos/directorio/application";
import type { DirectorConfig } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/entities/director.entity";
import { TipoDirector } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/enums/director-tipo.enum";
import type { DirectorioFormUI } from "./useDirectorioFormSync";

interface UseDirectorioDirectoresOptions {
  /**
   * Lista de directores
   */
  directores: Ref<DirectorConfig[]>;
  /**
   * Función para eliminar un director
   */
  deleteDirector: (directorId: string) => Promise<void>;
  /**
   * DTO del directorio (para validar presidenteId)
   */
  directorioForm: DirectorioDTO;
  /**
   * Formulario UI (para sincronizar presidenteId)
   */
  form: Ref<DirectorioFormUI>;
  /**
   * Ref para sincronizar el presidente del directorio
   */
  presidenteDirectorioRef: Ref<string>;
}

/**
 * Composable para manejar la lógica de directores
 * Gestiona la eliminación de directores y la actualización de la lista
 * cuando se guarda un director
 */
export function useDirectorioDirectores(options: UseDirectorioDirectoresOptions) {
  const {
    directores,
    deleteDirector: deleteDirectorFn,
    directorioForm,
    form,
    presidenteDirectorioRef,
  } = options;

  /**
   * Elimina un director y limpia la referencia del presidente si era el director eliminado
   * @param directorId - ID del director a eliminar
   */
  const handleDeleteDirector = async (directorId: string) => {
    try {
      await deleteDirectorFn(directorId);

      // Si el director eliminado era el presidente, limpiar la referencia
      if (directorioForm.presidenteId === directorId) {
        directorioForm.presidenteId = null;
        form.value.presidenteDirectorio = "";
        presidenteDirectorioRef.value = "";
      }
    } catch (error) {
      console.error("Error al eliminar director:", error);
      throw error;
    }
  };

  /**
   * Maneja cuando se guarda un director (creado o actualizado)
   * Actualiza la lista local de directores y valida el presidenteId
   * @param savedDirector - Director guardado
   */
  const handleDirectorSaved = async (savedDirector: DirectorConfig) => {
    // Actualizar directamente el array local con el director creado/actualizado
    // para evitar un GET adicional innecesario
    const existingIndex = directores.value.findIndex((d) => d.id === savedDirector.id);
    if (existingIndex >= 0) {
      // Actualizar director existente
      directores.value[existingIndex] = savedDirector;
      console.debug(
        "[useDirectorioDirectores] handleDirectorSaved: director actualizado localmente",
        {
          directorId: savedDirector.id,
        }
      );
    } else {
      // Agregar nuevo director
      directores.value.push(savedDirector);
      console.debug(
        "[useDirectorioDirectores] handleDirectorSaved: director agregado localmente",
        {
          directorId: savedDirector.id,
          totalDirectores: directores.value.length,
        }
      );
    }

    // Verificar si el presidenteId actual sigue siendo válido
    if (directorioForm.presidenteId) {
      const existePresidente = directores.value.some(
        (d) => d.id === directorioForm.presidenteId && d.rolDirector === TipoDirector.TITULAR
      );
      if (!existePresidente) {
        console.debug(
          "[useDirectorioDirectores] handleDirectorSaved: presidenteId no encontrado, limpiando",
          {
            presidenteId: directorioForm.presidenteId,
          }
        );
        directorioForm.presidenteId = null;
        form.value.presidenteDirectorio = "";
        presidenteDirectorioRef.value = "";
      }
    }
  };

  return {
    handleDeleteDirector,
    handleDirectorSaved,
  };
}
