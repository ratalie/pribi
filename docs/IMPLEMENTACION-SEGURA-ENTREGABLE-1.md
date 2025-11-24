# 🛡️ IMPLEMENTACIÓN SEGURA: Entregable 1 (Sin Bloquear Registros)

**Fecha:** Enero 2025  
**Objetivo:** Implementar Entregable 1 sin afectar `registros/sociedades/[id]/`

---

## 🎯 GARANTÍAS

### ✅ Lo que NO se tocará:

1. **`app/pages/registros/sociedades/[id]/`** - Cero cambios
2. **Flujo de registro de sociedades** - Sigue funcionando igual
3. **Componentes existentes** - No se modifican
4. **Lógica de negocio** - Intacta

### ✅ Lo que SÍ se implementará:

1. **Mejoras en middleware de auth** - Solo mejoras, no bloqueos
2. **Validación de token** - Opcional (no bloquea si falla)
3. **Variable de entorno** - Para deshabilitar MSW de permisos
4. **Sistema de permisos en modo degradado** - Si no hay permisos, permite todo

---

## 📋 PLAN DE IMPLEMENTACIÓN

### Fase 1: Variable de Entorno (5 min)

**Objetivo:** Crear variable para deshabilitar MSW de permisos

**Archivo:** `nuxt.config.ts`

```typescript
runtimeConfig: {
  public: {
    // ... existentes
    mswRolesPermisosDisabled: process.env.MSW_ROLES_PERMISOS_DISABLED === "true",
  },
}
```

**Archivo:** `.env.example`

```env
# MSW: Deshabilitar MSW de roles y permisos
# true = No usar MSW para permisos (usar backend real o modo degradado)
# false = Usar MSW para permisos (desarrollo)
MSW_ROLES_PERMISOS_DISABLED=false
```

---

### Fase 2: Mejorar Middleware de Auth (10 min)

**Objetivo:** Mejorar redirección sin bloquear nada

**Archivo:** `middleware/auth.global.ts`

**Cambios:**
- ✅ Preservar ruta original en query param
- ✅ Redirigir a ruta original después de login
- ✅ NO agregar validación de permisos (eso va después)

**Código:**
```typescript
import { useAuthStore } from "~/core/presentation/auth/stores/auth.store";

const PUBLIC_PATHS = new Set<string>(["/auth/login", "/login"]);

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Rutas públicas
  if (PUBLIC_PATHS.has(to.path)) {
    if (authStore.isAuthenticated) {
      // Redirigir a ruta original o dashboard
      const redirect = (to.query.redirect as string) || undefined;
      const defaultPath = useRuntimeConfig().public?.defaultRedirectAfterLogin || "/registros/sociedades/dashboard";
      return navigateTo(redirect || defaultPath);
    }
    return;
  }

  // Proteger rutas privadas
  if (!authStore.isAuthenticated) {
    return navigateTo("/auth/login", {
      query: { redirect: to.fullPath },
    });
  }
});
```

---

### Fase 3: Validación de Token (Opcional, No Bloquea) (15 min)

**Objetivo:** Validar token pero NO bloquear si falla

**Archivo:** `app/core/shared/http/with-auth-headers.ts`

**Cambios:**
- ✅ Validar token expirado
- ✅ Si expirado, solo loguear warning (NO bloquear)
- ✅ Agregar flag para habilitar/deshabilitar validación

**Código:**
```typescript
import type { FetchOptions } from "ofetch";
import { useAuthStore } from "~/core/presentation/auth/stores/auth.store";

/**
 * Verificar si un token JWT está expirado
 * Retorna true si está expirado o no se puede decodificar
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convertir a ms
    return Date.now() >= exp;
  } catch {
    // Si no se puede decodificar, no es JWT válido
    // Pero NO bloqueamos, solo retornamos false
    return false;
  }
}

export function withAuthHeaders(): FetchOptions;
export function withAuthHeaders<T extends FetchOptions>(options: T): T;
export function withAuthHeaders<T extends FetchOptions>(options?: T) {
  const authStore = useAuthStore();
  const runtimeConfig = useRuntimeConfig();
  const fallbackToken = (runtimeConfig.public?.defaultAuthToken as string | undefined)?.trim();
  const token = (authStore.session?.token ?? fallbackToken)?.trim();

  // Validar token expirado (solo warning, NO bloquea)
  if (token && import.meta.dev) {
    if (isTokenExpired(token)) {
      console.warn("[withAuthHeaders] Token expirado detectado. Considera refrescar el token.");
      // NO bloqueamos aquí, solo avisamos
      // El backend rechazará el request si el token es inválido
    }
  }

  const normalized = ((options ?? {}) as FetchOptions) ?? {};
  const headers = new Headers((normalized.headers as HeadersInit | undefined) ?? undefined);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    if (import.meta.dev) {
      const preview = token.length > 12 ? `${token.slice(0, 6)}…${token.slice(-4)}` : token;
      console.debug("[withAuthHeaders] Token aplicado", {
        hasSessionToken: Boolean(authStore.session?.token),
        usingFallbackToken: !authStore.session?.token && Boolean(fallbackToken),
        preview,
      });
    }
  } else {
    console.warn(
      "[withAuthHeaders] Sin token disponible. Asegúrate de iniciar sesión o definir NUXT_PUBLIC_DEFAULT_AUTH_TOKEN."
    );
  }

  return {
    ...(normalized as Record<string, unknown>),
    headers: Object.fromEntries(headers.entries()),
  } as T extends FetchOptions ? T : FetchOptions;
}
```

---

### Fase 4: Sistema de Permisos en Modo Degradado (20 min)

**Objetivo:** Crear sistema que funcione con o sin permisos

**Archivo:** `app/composables/usePermissions.ts` (NUEVO)

**Características:**
- ✅ Si `MSW_ROLES_PERMISOS_DISABLED=true` → Modo degradado (permite todo)
- ✅ Si no hay permisos → Modo degradado (permite todo)
- ✅ Si hay permisos → Verifica normalmente

**Código:**
```typescript
import { computed } from "vue";
import { useRuntimeConfig } from "#app";
import type { UserPermissions } from "~/types/permissions";

/**
 * Composable de Permisos con Modo Degradado
 * 
 * Si MSW_ROLES_PERMISOS_DISABLED=true o no hay permisos,
 * funciona en modo degradado (permite todo)
 */
export const usePermissions = () => {
  const config = useRuntimeConfig();
  const permissionsDisabled = config.public?.mswRolesPermisosDisabled === true;
  
  // TODO: Obtener permisos del store cuando esté listo
  const permissions = ref<UserPermissions | null>(null);
  
  /**
   * Verificar si tiene permiso en modo degradado
   * Si no hay permisos o están deshabilitados, permite todo
   */
  const hasPermission = (
    module: string,
    action: "create" | "read" | "update" | "delete"
  ): boolean => {
    // Modo degradado: permite todo
    if (permissionsDisabled || !permissions.value) {
      if (import.meta.dev) {
        console.debug(`[usePermissions] Modo degradado: permitiendo ${module}.${action}`);
      }
      return true;
    }
    
    // Verificar permiso real
    const modulePerms = permissions.value.systemFeatures[module as keyof typeof permissions.value.systemFeatures];
    if (typeof modulePerms === "object" && modulePerms !== null) {
      return modulePerms[action] === true;
    }
    
    return false;
  };
  
  /**
   * Verificar si puede descargar (DLP)
   */
  const canDownload = computed(() => {
    if (permissionsDisabled || !permissions.value) {
      return true; // Modo degradado
    }
    return permissions.value.repositoryAccess.permissions.download ?? false;
  });
  
  /**
   * Verificar si puede ver un módulo
   */
  const canViewModule = (moduleId: string): boolean => {
    if (permissionsDisabled || !permissions.value) {
      return true; // Modo degradado
    }
    
    // Verificar si tiene al menos permiso de lectura
    return hasPermission(moduleId, "read");
  };
  
  return {
    hasPermission,
    canDownload,
    canViewModule,
    isDegradedMode: computed(() => permissionsDisabled || !permissions.value),
  };
};
```

---

### Fase 5: Actualizar useUser para Usar Permisos (10 min)

**Objetivo:** Integrar permisos sin romper funcionalidad existente

**Archivo:** `app/composables/useUser.ts`

**Cambios:**
- ✅ Usar `usePermissions` internamente
- ✅ Mantener compatibilidad con código existente
- ✅ Modo degradado si no hay permisos

**Código:**
```typescript
import type { User } from "~/types/user";
import { useAuthStore } from "~/core/presentation/auth/stores/auth.store";
import { usePermissions } from "./usePermissions";

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
  const { canViewModule: canViewModulePermissions, isDegradedMode } = usePermissions();

  // Verificar si el usuario puede ver un módulo específico
  const canViewModule = (moduleId: string): boolean => {
    // Si está en modo degradado, permite todo
    if (isDegradedMode.value) {
      return true;
    }
    
    if (!currentUser.value) return false;

    // Admin puede ver todo
    if (currentUser.value.role.id === "admin") return true;

    // Verificar permisos específicos por módulo
    return currentUser.value.role.permissions.some(
      (permission) =>
        permission.module === moduleId || permission.module === "*"
    ) || canViewModulePermissions(moduleId);
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role: string): boolean => {
    return currentUser.value?.role.id === role;
  };

  // Verificar si es solo lectura
  const isReadOnly = computed(() => {
    if (isDegradedMode.value) {
      return false; // Modo degradado = no es solo lectura
    }
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
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Antes de Empezar:
- [ ] Hacer backup del código actual
- [ ] Verificar que `registros/sociedades/[id]/` funciona
- [ ] Crear branch: `feat/entregable-1-seguro`

### Durante la Implementación:
- [ ] Fase 1: Variable de entorno
- [ ] Fase 2: Mejorar middleware
- [ ] Fase 3: Validación de token (opcional)
- [ ] Fase 4: Sistema de permisos degradado
- [ ] Fase 5: Actualizar useUser

### Después de Implementar:
- [ ] Probar que `registros/sociedades/[id]/` sigue funcionando
- [ ] Probar login/logout
- [ ] Probar con `MSW_ROLES_PERMISOS_DISABLED=true`
- [ ] Probar con `MSW_ROLES_PERMISOS_DISABLED=false`

---

## 🛡️ GARANTÍAS FINALES

### ✅ NO se bloqueará:

1. **Registro de sociedades** - Sigue funcionando igual
2. **Flujo `[id]`** - Cero cambios
3. **Equipo trabajando** - No se verán afectados
4. **Backend sin permisos** - Modo degradado permite todo

### ✅ SÍ se mejorará:

1. **Redirección después de login** - Mejor UX
2. **Validación de token** - Mejor seguridad (opcional)
3. **Sistema de permisos** - Listo para cuando backend esté listo
4. **Variable de entorno** - Control total sobre MSW

---

## 🚀 PRÓXIMOS PASOS

1. **AHORA:** Implementar Fase 1-5 (1 hora)
2. **DESPUÉS:** Probar que todo funciona
3. **CUANDO BACKEND ESTÉ LISTO:** Conectar permisos reales

---

**¿Listo para implementar de forma segura?** 🛡️


