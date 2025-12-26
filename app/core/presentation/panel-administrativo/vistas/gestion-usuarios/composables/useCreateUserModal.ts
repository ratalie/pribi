import { ref } from "vue";
import type { CreateUserForm, AvailableRole } from "../types/user-management.types";

/**
 * Composable para manejar el modal de crear usuario
 */
export function useCreateUserModal() {
  const isOpen = ref(false);
  const form = ref<CreateUserForm>({
    email: "",
    password: "",
    roleId: "",
  });
  const isCreating = ref(false);
  const error = ref<string | null>(null);

  const open = () => {
    form.value = { email: "", password: "", roleId: "" };
    error.value = null;
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
    form.value = { email: "", password: "", roleId: "" };
    error.value = null;
  };

  const setError = (message: string | null) => {
    error.value = message;
  };

  const setCreating = (value: boolean) => {
    isCreating.value = value;
  };

  return {
    isOpen,
    form,
    isCreating,
    error,
    open,
    close,
    setError,
    setCreating,
  };
}

