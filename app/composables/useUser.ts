import type { User } from "~/types/user";
import { useAuthStore } from "~/core/presentation/auth/stores/auth.store";

// Mock user data - en producción vendría de una API
const mockUser: User = {
  id: "1",
  name: "Juan Carlos Pérez",
  email: "juan.perez@probo.com",
  avatar: "/avatars/juan.jpg",
  title: "Administrador Legal",
  role: {
    id: "admin",
    name: "Administrador",
    permissions: [
      { id: "1", name: "view_all", module: "*", action: "read" },
      { id: "2", name: "manage_users", module: "users", action: "write" },
      { id: "3", name: "manage_settings", module: "settings", action: "write" },
    ],
  },
};

export const useUser = () => {
  const currentUser = ref<User>(mockUser);

  // Verificar si el usuario puede ver un módulo específico
  const canViewModule = (moduleId: string): boolean => {
    if (!currentUser.value) return false;

    // Admin puede ver todo
    if (currentUser.value.role.id === "admin") return true;

    // Verificar permisos específicos por módulo
    return currentUser.value.role.permissions.some(
      (permission) =>
        permission.module === moduleId || permission.module === "*"
    );
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role: string): boolean => {
    return currentUser.value?.role.id === role;
  };

  // Verificar si es solo lectura
  const isReadOnly = computed(() => {
    return currentUser.value?.role.id === "viewer";
  });

  const logout = async () => {
    const authStore = useAuthStore();
    authStore.logout();
    await navigateTo("/auth/login");
  };

  return {
    currentUser: readonly(currentUser),
    canViewModule,
    hasRole,
    isReadOnly,
    logout,
  };
};
