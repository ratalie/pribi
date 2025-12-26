import { ref } from "vue";
import type { UserToDelete } from "../types/user-management.types";

/**
 * Composable para manejar el modal de eliminar usuario
 */
export function useDeleteUserModal() {
  const userToDelete = ref<UserToDelete | null>(null);
  const isDeleting = ref(false);

  const open = (user: { id: string; email: string }) => {
    userToDelete.value = user;
  };

  const close = () => {
    userToDelete.value = null;
  };

  const setDeleting = (value: boolean) => {
    isDeleting.value = value;
  };

  return {
    userToDelete,
    isDeleting,
    open,
    close,
    setDeleting,
  };
}




