import type { Ref } from "vue";
import { ref } from "vue";
import type { DirectorConfig } from "~/core/hexag/registros/sociedades/pasos/directorio/domain/entities/director.entity";
import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";

interface UseDirectorioModalsOptions {
  /**
   * Lista de directores (para buscar el director a editar)
   */
  directores: Ref<DirectorConfig[]>;
}

/**
 * Composable para manejar la lógica de modales de directores
 * Gestiona el estado del modal (abierto/cerrado), el modo (crear/editar),
 * y el director a editar
 */
export function useDirectorioModals(options: UseDirectorioModalsOptions) {
  const { directores } = options;
  const personaNaturalStore = usePersonaNaturalStore();

  /**
   * Modo del modal: "create" para crear nuevo director, "edit" para editar existente
   */
  const modalMode = ref<"create" | "edit">("create");

  /**
   * Director que se está editando (null cuando se está creando)
   */
  const directorToEdit = ref<DirectorConfig | null>(null);

  /**
   * Estado de apertura/cierre del modal
   */
  const isModalOpen = ref(false);

  /**
   * Abre el modal en modo "crear"
   * Resetea el estado del modal y del store de persona natural
   */
  const openCreateModal = () => {
    modalMode.value = "create";
    directorToEdit.value = null;
    personaNaturalStore.$reset();
    isModalOpen.value = true;
  };

  /**
   * Abre el modal en modo "editar" para un director específico
   * @param id - ID del director a editar
   */
  const openEditModal = (id: string) => {
    const director = directores.value.find((item) => item.id === id);

    if (!director) {
      return;
    }

    modalMode.value = "edit";
    directorToEdit.value = { ...director };
    personaNaturalStore.$patch({
      tipoDocumento: director.persona.tipoDocumento,
      numeroDocumento: director.persona.numeroDocumento,
      nombre: director.persona.nombre,
      apellidoPaterno: director.persona.apellidoPaterno,
      apellidoMaterno: director.persona.apellidoMaterno,
    });
    isModalOpen.value = true;
  };

  /**
   * Cierra el modal y resetea su estado
   */
  const closeModal = () => {
    isModalOpen.value = false;
    modalMode.value = "create";
    directorToEdit.value = null;
    personaNaturalStore.$reset();
  };

  return {
    modalMode,
    directorToEdit,
    isModalOpen,
    openCreateModal,
    openEditModal,
    closeModal,
  };
}
