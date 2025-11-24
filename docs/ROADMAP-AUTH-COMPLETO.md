# 🗺️ ROADMAP: Sistema de Autenticación Probo

**Fecha:** Enero 2025  
**Estado:** En Desarrollo  
**Estrategia:** Entregables Incrementales con MSW

---

## 📋 ÍNDICE

1. [Objetivos Generales](#1-objetivos-generales)
2. [Fase 1: Auth Básico (AHORA)](#fase-1-auth-básico-ahora)
3. [Fase 2: Permisos y Roles (MSW)](#fase-2-permisos-y-roles-msw)
4. [Fase 3: Integración Backend Real](#fase-3-integración-backend-real)
5. [Entregables Intermedios](#entregables-intermedios)
6. [Checklist de Progreso](#checklist-de-progreso)

---

## 1. OBJETIVOS GENERALES

### A. Autenticación para Rutas
- ✅ Middleware global protegiendo todas las rutas
- ✅ Redirección automática a login si no autenticado
- ✅ Rutas públicas configuradas

### B. Redirección a Login
- ✅ Redirección cuando no autenticado
- ✅ Redirección cuando ya autenticado (evitar login duplicado)
- ⏳ Preservar ruta original para redirección post-login

### C. Manejo de Token y Sesión
- ✅ Almacenamiento de token en store persistente
- ⏳ Validación de token expirado
- ⏳ Refresh token automático
- ⏳ Logout automático en token inválido

---

## FASE 1: AUTH BÁSICO (AHORA)

### ✅ Completado

- [x] Middleware global (`middleware/auth.global.ts`)
- [x] Store de autenticación (`app/core/presentation/auth/stores/auth.store.ts`)
- [x] Repositorio HTTP (`app/core/hexag/auth/infrastructure/repositories/auth.http.repository.ts`)
- [x] Caso de uso Login (`app/core/hexag/auth/application/use-cases/login.use-case.ts`)
- [x] Persistencia de sesión (Pinia persist)

### ⏳ Pendiente (Entregable 1)

#### 1.1. Mejorar Middleware de Auth

**Archivo:** `middleware/auth.global.ts`

**Tareas:**
- [ ] Preservar ruta original en query param (`?redirect=/ruta`)
- [ ] Redirigir a ruta original después de login
- [ ] Manejar rutas inválidas (404)

**Código:**
```typescript
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  
  // Rutas públicas
  if (PUBLIC_PATHS.has(to.path)) {
    if (authStore.isAuthenticated) {
      // Redirigir a ruta original o dashboard
      const redirect = to.query.redirect as string;
      return navigateTo(redirect || "/registros/sociedades/dashboard");
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

#### 1.2. Validar Token en Headers

**Archivo:** `app/core/shared/http/with-auth-headers.ts`

**Tareas:**
- [ ] Verificar que token no esté expirado
- [ ] Decodificar JWT y verificar expiración
- [ ] Logout automático si token expirado

**Código:**
```typescript
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convertir a ms
    return Date.now() >= exp;
  } catch {
    return true; // Si no se puede decodificar, considerar expirado
  }
}
```

#### 1.3. Plugin de Refresh Token

**Archivo:** `app/plugins/auth-refresh.client.ts` (NUEVO)

**Tareas:**
- [ ] Verificar token cada 5 minutos
- [ ] Refrescar token automáticamente
- [ ] Logout si refresh falla

---

## FASE 2: PERMISOS Y ROLES (MSW)

### 🎯 Estrategia: MSW First

**Por qué MSW:**
- ✅ Podemos desarrollar frontend completo sin backend
- ✅ Definimos contratos claros con backend
- ✅ Fácil migración cuando backend esté listo
- ✅ Testing completo desde el inicio

### 📦 Entregable 2: Sistema de Permisos con MSW

#### 2.1. Tipos y Interfaces

**Archivo:** `app/types/permissions.ts` (NUEVO)

```typescript
// Basado en Admin Panel de Figma
export interface UserPermissions {
  userId: string;
  systemFeatures: {
    societies: CRUD;
    shareholders: CRUD;
    directory: CRUD;
    juntas: CRUD;
    chatAI: boolean;
    userManagement: boolean;
  };
  repositoryAccess: {
    fullAccess: boolean;
    permissions: {
      view: boolean;
      download: boolean; // DLP (Data Loss Prevention)
      upload: boolean;
      delete: boolean;
      search: boolean;
    };
  };
}

export interface CRUD {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface WorkspaceFeatures {
  hasChatAI: boolean;
  allowDownloads: boolean;
  allowComments: boolean;
  showFlowsPreview: boolean;
}
```

#### 2.2. Store de Usuario con Permisos

**Archivo:** `app/core/presentation/user/stores/user.store.ts` (NUEVO)

**Tareas:**
- [ ] Obtener usuario desde API (MSW)
- [ ] Almacenar permisos
- [ ] Computed para verificar permisos

**Código:**
```typescript
export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const permissions = ref<UserPermissions | null>(null);
  const loading = ref(false);
  
  async function fetchUser() {
    loading.value = true;
    try {
      // Llamar a API (MSW interceptará)
      const response = await $fetch("/api/v2/user/me", {
        headers: withAuthHeaders().headers,
      });
      user.value = response.data.user;
      permissions.value = response.data.permissions;
    } finally {
      loading.value = false;
    }
  }
  
  const canAccessModule = (module: string) => {
    if (!permissions.value) return false;
    // Lógica de verificación
  };
  
  return {
    user,
    permissions,
    loading,
    fetchUser,
    canAccessModule,
  };
});
```

#### 2.3. MSW Handlers para Auth y User

**Archivo:** `app/core/hexag/auth/infrastructure/mocks/handlers/auth.handlers.ts` (ACTUALIZAR)

**Tareas:**
- [ ] Handler para `/api/v2/user/me` (obtener usuario actual)
- [ ] Handler para `/api/v2/user/permissions` (obtener permisos)
- [ ] Handler para refresh token

**Código:**
```typescript
export const authHandlers = [
  // Login (ya existe)
  http.post("*/api/v2/auth", async ({ request }) => {
    const body = await request.json();
    // ... lógica de login
    return HttpResponse.json({
      success: true,
      data: {
        token: "mock-jwt-token",
        user: mockUser,
      },
    });
  }),
  
  // Obtener usuario actual
  http.get("*/api/v2/user/me", () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: mockUserWithPermissions,
        permissions: mockPermissions,
      },
    });
  }),
  
  // Refresh token
  http.post("*/api/v2/auth/refresh", () => {
    return HttpResponse.json({
      success: true,
      data: {
        token: "new-mock-jwt-token",
      },
    });
  }),
];
```

#### 2.4. Composable de Permisos

**Archivo:** `app/composables/usePermissions.ts` (NUEVO)

**Tareas:**
- [ ] Verificar permisos de módulo
- [ ] Verificar permisos de acción (CRUD)
- [ ] Verificar permisos de repositorio

**Código:**
```typescript
export const usePermissions = () => {
  const userStore = useUserStore();
  
  const hasPermission = (
    module: string,
    action: "create" | "read" | "update" | "delete"
  ): boolean => {
    if (!userStore.permissions) return false;
    
    // Admin tiene todos los permisos
    if (userStore.user?.role.id === "admin") return true;
    
    // Verificar permiso específico
    const modulePerms = userStore.permissions.systemFeatures[module];
    return modulePerms?.[action] ?? false;
  };
  
  const canDownload = computed(() => {
    return userStore.permissions?.repositoryAccess.permissions.download ?? false;
  });
  
  return {
    hasPermission,
    canDownload,
    // ... más helpers
  };
};
```

#### 2.5. Middleware de Permisos

**Archivo:** `app/middleware/permissions.ts` (NUEVO)

**Tareas:**
- [ ] Verificar permisos antes de cargar página
- [ ] Redirigir a `/forbidden` si no tiene permiso

**Código:**
```typescript
export default defineNuxtRouteMiddleware((to) => {
  const { hasPermission } = usePermissions();
  const requiredPermission = to.meta.requiredPermission;
  
  if (requiredPermission) {
    if (!hasPermission(requiredPermission.module, requiredPermission.action)) {
      return navigateTo("/forbidden");
    }
  }
});
```

#### 2.6. Configuración por Defecto (Admin)

**Archivo:** `app/config/permissions.default.ts` (NUEVO)

**Tareas:**
- [ ] Definir usuario admin por defecto con todos los permisos
- [ ] Usar en MSW cuando no hay backend

**Código:**
```typescript
export const DEFAULT_ADMIN_PERMISSIONS: UserPermissions = {
  userId: "admin-1",
  systemFeatures: {
    societies: { create: true, read: true, update: true, delete: true },
    shareholders: { create: true, read: true, update: true, delete: true },
    directory: { create: true, read: true, update: true, delete: true },
    juntas: { create: true, read: true, update: true, delete: true },
    chatAI: true,
    userManagement: true,
  },
  repositoryAccess: {
    fullAccess: true,
    permissions: {
      view: true,
      download: true,
      upload: true,
      delete: true,
      search: true,
    },
  },
};
```

---

## FASE 3: INTEGRACIÓN BACKEND REAL

### ⏳ Cuando Backend Esté Listo

#### 3.1. Actualizar Repositorios

**Tareas:**
- [ ] Cambiar URLs de MSW a backend real
- [ ] Actualizar tipos según respuesta real
- [ ] Manejar errores del backend

#### 3.2. Deshabilitar MSW

**Archivo:** `nuxt.config.ts`

```typescript
runtimeConfig: {
  public: {
    mswDisabled: true, // Deshabilitar MSW en producción
  },
}
```

---

## ENTREGABLES INTERMEDIOS

### 🎯 Entregable 1: Guards y Middleware (Semana 1)

**Objetivo:** Protección completa de rutas

**Archivos:**
- ✅ `middleware/auth.global.ts` (mejorar)
- ⏳ `middleware/permissions.ts` (nuevo)
- ⏳ `app/plugins/auth-refresh.client.ts` (nuevo)

**Resultado:**
- Todas las rutas protegidas
- Redirección inteligente
- Validación de token

---

### 🎯 Entregable 2: Permisos con MSW (Semana 2)

**Objetivo:** Sistema completo de permisos funcionando con MSW

**Archivos:**
- ⏳ `app/types/permissions.ts` (nuevo)
- ⏳ `app/core/presentation/user/stores/user.store.ts` (nuevo)
- ⏳ `app/composables/usePermissions.ts` (nuevo)
- ⏳ `app/core/hexag/auth/infrastructure/mocks/handlers/auth.handlers.ts` (actualizar)
- ⏳ `app/config/permissions.default.ts` (nuevo)

**Resultado:**
- Usuario admin por defecto con todos los permisos
- Verificación de permisos en sidebar
- Verificación de permisos en páginas
- MSW simulando backend

---

### 🎯 Entregable 3: Admin Panel Básico (Semana 3)

**Objetivo:** Panel administrativo para gestionar permisos (solo UI, MSW)

**Archivos:**
- ⏳ `app/pages/admin/panel.vue` (mejorar)
- ⏳ `app/pages/admin/users.vue` (nuevo)
- ⏳ `app/pages/admin/permissions.vue` (nuevo)

**Resultado:**
- UI completa de gestión de usuarios
- UI completa de gestión de permisos
- MSW simulando CRUD de usuarios

---

## CHECKLIST DE PROGRESO

### Fase 1: Auth Básico
- [x] Middleware global
- [x] Store de autenticación
- [x] Login funcionando
- [ ] Preservar ruta original
- [ ] Validar token expirado
- [ ] Refresh token automático

### Fase 2: Permisos (MSW)
- [ ] Tipos de permisos
- [ ] Store de usuario
- [ ] MSW handlers
- [ ] Composable de permisos
- [ ] Middleware de permisos
- [ ] Configuración por defecto (admin)

### Fase 3: Backend Real
- [ ] Actualizar repositorios
- [ ] Deshabilitar MSW
- [ ] Testing con backend real

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **AHORA:** Mejorar middleware de auth (Entregable 1)
2. **SIGUIENTE:** Crear tipos de permisos (Entregable 2)
3. **DESPUÉS:** Implementar MSW handlers (Entregable 2)

---

**¿Listo para empezar con Entregable 1?** 🚀


