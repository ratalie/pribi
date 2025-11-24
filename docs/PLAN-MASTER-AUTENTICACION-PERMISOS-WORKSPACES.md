# 🎯 PLAN MASTER: Autenticación, Permisos y Espacios de Trabajo

**Fecha:** Enero 2025  
**Estado:** Documentación y Planificación (Esperando Backend y Figma)

---

## 📋 ÍNDICE

1. [Rutas Finales Consolidadas](#1-rutas-finales-consolidadas)
2. [Sistema de Autenticación](#2-sistema-de-autenticación)
3. [Sistema de Permisos](#3-sistema-de-permisos)
4. [Espacios de Trabajo (Workspaces)](#4-espacios-de-trabajo-workspaces)
5. [Plan de Implementación con Nuxt 4](#5-plan-de-implementación-con-nuxt-4)

---

## 1. RUTAS FINALES CONSOLIDADAS

### 🎯 Principio: Simplicidad

**Regla:** Cada módulo tiene **3 rutas base**:

- `dashboard` - Vista general
- `crear` - Crear nuevo registro
- `historico` - Historial de registros

### 📁 Estructura de Rutas Final

```
app/pages/
├── auth/
│   └── login.vue                    # ✅ Única ruta pública
│
├── registros/
│   ├── sociedades/
│   │   ├── dashboard.vue            # ✅ Dashboard
│   │   ├── agregar.vue              # ✅ Crear sociedad
│   │   ├── historial.vue            # ✅ Historial
│   │   └── [id]/                    # ✅ Flujo completo (NO TOCAR)
│   │       ├── datos-sociedad.vue
│   │       └── ...
│   └── sucursales/
│       ├── dashboard.vue            # ✅ Dashboard
│       ├── agregar.vue               # ✅ Crear sucursal
│       └── historial.vue             # ✅ Historial
│
├── operaciones/
│   ├── directorio/
│   │   ├── dashboard.vue            # ✅ Dashboard
│   │   ├── crear.vue                 # ✅ Crear directorio
│   │   └── historico.vue            # ✅ Historial
│   └── junta-accionistas/
│       ├── dashboard.vue            # ✅ Dashboard
│       ├── crear.vue                 # ✅ Crear junta
│       └── historico.vue             # ✅ Historial
│
├── storage/
│   ├── almacen/
│   │   └── index.vue                 # ✅ Almacén
│   └── documentos-generados/
│       └── index.vue                 # ✅ Documentos
│
├── features/
│   └── espacios-trabajo/
│       ├── dashboard.vue             # ✅ Dashboard
│       ├── espacios.vue              # ✅ Lista de espacios
│       └── crear.vue                 # ✅ Crear espacio
│
└── admin/
    └── panel.vue                     # ✅ Panel administrativo
```

### ✅ Rutas Eliminadas (No Necesarias)

- ❌ `/test/*` - Páginas de prueba
- ❌ `/viewComponents` - Vista de componentes
- ❌ `/indiceSidebarsPruebas` - Índice de sidebars
- ❌ `/operaciones/gerencia-general/*` - Eliminado
- ❌ `/features/chat-ia` - Eliminado
- ❌ `/features/documentos-ia` - Eliminado
- ❌ `/features/reporteria` - Eliminado

---

## 2. SISTEMA DE AUTENTICACIÓN

### 🔐 Estado Actual

**✅ Ya Implementado:**

- Middleware global: `middleware/auth.global.ts`
- Store de autenticación: `app/core/presentation/auth/stores/auth.store.ts`
- Composable: `app/composables/useUser.ts` (pero usa datos mock)
- Repositorio HTTP: `app/core/hexag/auth/infrastructure/repositories/auth.http.repository.ts`

### 📝 Cómo Funciona Actualmente

```typescript
// middleware/auth.global.ts
const PUBLIC_PATHS = new Set<string>(["/auth/login", "/login"]);

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Si es ruta pública y ya está autenticado, redirigir
  if (PUBLIC_PATHS.has(to.path)) {
    if (authStore.isAuthenticated) {
      return navigateTo("/registros/sociedades/dashboard");
    }
    return; // Permitir acceso
  }

  // Si no está autenticado, redirigir a login
  if (!authStore.isAuthenticated) {
    return navigateTo("/auth/login");
  }
});
```

### ⚠️ Problemas Actuales

1. **`useUser` usa datos mock** - No obtiene datos reales del backend
2. **No hay validación de token** - No verifica si el token expiró
3. **No hay refresh token** - No renueva tokens automáticamente
4. **No hay manejo de permisos desde backend** - Permisos están hardcodeados

### 🎯 Mejoras Necesarias (Cuando Backend Esté Listo)

#### 2.1. Obtener Usuario Real del Backend

```typescript
// app/composables/useUser.ts (FUTURO)
export const useUser = () => {
  const authStore = useAuthStore();
  const userStore = useUserStore(); // Nuevo store

  // Obtener usuario desde backend usando el token
  const currentUser = computed(() => userStore.user);

  // Cargar usuario al iniciar sesión
  watch(
    () => authStore.isAuthenticated,
    async (isAuth) => {
      if (isAuth && !userStore.user) {
        await userStore.fetchUser();
      }
    },
    { immediate: true }
  );

  return {
    currentUser: readonly(currentUser),
    canViewModule,
    hasRole,
    isReadOnly,
    logout,
  };
};
```

#### 2.2. Validar Token en Cada Request

```typescript
// app/core/shared/http/with-auth-headers.ts (MEJORAR)
export function withAuthHeaders<T extends FetchOptions>(options?: T) {
  const authStore = useAuthStore();
  const token = authStore.session?.token;

  // Validar que el token no haya expirado
  if (token && isTokenExpired(token)) {
    authStore.logout();
    navigateTo("/auth/login");
    throw new Error("Token expirado");
  }

  // ... resto del código
}
```

#### 2.3. Refresh Token Automático

```typescript
// app/plugins/auth.client.ts (NUEVO)
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();

  // Verificar token cada 5 minutos
  setInterval(async () => {
    if (authStore.isAuthenticated) {
      try {
        await authStore.refreshToken();
      } catch (error) {
        authStore.logout();
        navigateTo("/auth/login");
      }
    }
  }, 5 * 60 * 1000);
});
```

---

## 3. SISTEMA DE PERMISOS

### 🎯 Concepto: Privacidad = Control de Acceso

**La privacidad se traduce en:**

1. **Limitar acceso a funcionalidades** - Usuario solo ve lo que tiene permiso
2. **Limitar acceso a espacios de trabajo** - Usuarios externos/internos

### 📊 Estructura de Permisos (Desde Backend)

```typescript
// app/types/user.ts (ACTUALIZAR)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title: string;
  role: UserRole;
  permissions: Permission[]; // ← Viene del backend
  workspaces: WorkspaceAccess[]; // ← Nuevo: acceso a workspaces
}

export interface Permission {
  id: string;
  name: string;
  module: string; // "registros", "operaciones", "storage", etc.
  action: "read" | "write" | "delete" | "admin";
  resource?: string; // Opcional: "sociedades", "sucursales", etc.
}

export interface WorkspaceAccess {
  workspaceId: string;
  role: "owner" | "admin" | "member" | "viewer";
  permissions: Permission[];
}
```

### 🔒 Niveles de Permisos

#### Nivel 1: Módulo (Sección Principal)

- `registros` - Acceso a sección Registros
- `operaciones` - Acceso a sección Operaciones
- `storage` - Acceso a sección Storage
- `workspaces` - Acceso a Espacios de Trabajo

#### Nivel 2: Recurso (Sub-Sección)

- `registros.sociedades` - Acceso a Sociedades
- `registros.sucursales` - Acceso a Sucursales
- `operaciones.directorio` - Acceso a Directorio
- `operaciones.junta-accionistas` - Acceso a Juntas

#### Nivel 3: Acción

- `read` - Solo lectura
- `write` - Crear/Editar
- `delete` - Eliminar
- `admin` - Control total (CRUD completo)

### 💡 Ejemplo: Usuario con Permisos Limitados

```typescript
// Usuario "Asistente Legal"
{
  permissions: [
    { module: "registros", resource: "sociedades", action: "read" },
    { module: "storage", action: "read" },
  ],
  workspaces: [
    { workspaceId: "ws-1", role: "member" },
  ]
}

// Resultado:
// ✅ Puede ver: Registros > Sociedades (solo lectura)
// ✅ Puede ver: Storage (solo lectura)
// ❌ NO puede ver: Operaciones
// ❌ NO puede crear/editar sociedades
```

### 💡 Ejemplo: Admin

```typescript
// Usuario "Administrador"
{
  permissions: [
    { module: "*", action: "admin" }, // ← Acceso total
  ],
  workspaces: [
    { workspaceId: "*", role: "owner" }, // ← Todos los workspaces
  ]
}

// Resultado:
// ✅ Puede ver TODO
// ✅ Puede hacer CRUD en TODO
// ✅ Acceso a todos los workspaces
```

### 🔧 Implementación en Sidebar

```typescript
// app/components/ProboSidebar.vue (ACTUALIZAR)
const { canViewModule } = useUser();

// canViewModule ya verifica permisos
<template v-if="canViewModule(section.id)">
  <!-- Solo muestra secciones con permiso -->
</template>
```

### 🔧 Implementación en Páginas

```vue
<!-- app/pages/registros/sociedades/dashboard.vue -->
<script setup lang="ts">
  definePageMeta({
    layout: "registros",
    middleware: (to) => {
      const { canViewModule, hasPermission } = useUser();

      // Verificar acceso al módulo
      if (!canViewModule("registros")) {
        return navigateTo("/forbidden");
      }

      // Verificar permiso específico
      if (!hasPermission("registros.sociedades", "read")) {
        return navigateTo("/forbidden");
      }
    },
  });
</script>
```

---

## 4. ESPACIOS DE TRABAJO (WORKSPACES)

### 🎯 Concepto

**Workspace = Espacio colaborativo donde puedes:**

1. **Agregar Recursos:**

   - ✅ Carpetas (como antes)
   - ✅ Flujos completos de historial:
     - Historial de Sucursal
     - Historial de Sociedad
     - Historial de Junta de Accionistas
     - Historial de Directorio

2. **Gestionar Usuarios:**

   - Agregar usuarios externos
   - Agregar usuarios internos
   - Asignar roles

3. **Gestionar Roles y Permisos:**
   - Owner (dueño)
   - Admin (administrador)
   - Member (miembro)
   - Viewer (solo lectura)

### 📊 Estructura de Datos

```typescript
// app/types/workspace.ts (NUEVO)
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  members: WorkspaceMember[];
  resources: WorkspaceResource[];
  settings: WorkspaceSettings;
}

export interface WorkspaceMember {
  userId: string;
  user: User;
  role: "owner" | "admin" | "member" | "viewer";
  addedAt: string;
  addedBy: string;
}

export interface WorkspaceResource {
  id: string;
  type:
    | "folder"
    | "sucursal-history"
    | "sociedad-history"
    | "junta-history"
    | "directorio-history";
  name: string;
  resourceId: string; // ID del recurso original
  addedAt: string;
  addedBy: string;
  permissions: {
    canView: string[];
    canEdit: string[];
    canDelete: string[];
  };
}

export interface WorkspaceSettings {
  isPublic: boolean;
  allowExternalUsers: boolean;
  defaultRole: "member" | "viewer";
}
```

### 🗂️ Tipos de Recursos

#### 1. Carpetas (Tradicional)

```typescript
{
  type: "folder",
  resourceId: "folder-123",
  name: "Documentos Legales",
}
```

#### 2. Historial de Sucursal

```typescript
{
  type: "sucursal-history",
  resourceId: "sucursal-456",
  name: "Historial - Sucursal Centro",
}
```

#### 3. Historial de Sociedad

```typescript
{
  type: "sociedad-history",
  resourceId: "sociedad-789",
  name: "Historial - Sociedad ABC",
}
```

#### 4. Historial de Junta

```typescript
{
  type: "junta-history",
  resourceId: "junta-101",
  name: "Historial - Junta 2025",
}
```

#### 5. Historial de Directorio

```typescript
{
  type: "directorio-history",
  resourceId: "directorio-202",
  name: "Historial - Directorio 2025",
}
```

### 🏗️ Arquitectura Hexagonal (Futuro)

```
app/core/hexag/workspaces/
├── domain/
│   ├── entities/
│   │   ├── Workspace.ts
│   │   ├── WorkspaceMember.ts
│   │   └── WorkspaceResource.ts
│   └── ports/
│       ├── WorkspaceRepository.ts
│       └── WorkspaceService.ts
│
├── application/
│   ├── dtos/
│   │   ├── WorkspaceDTO.ts
│   │   ├── CreateWorkspaceDTO.ts
│   │   └── AddResourceDTO.ts
│   └── use-cases/
│       ├── CreateWorkspaceUseCase.ts
│       ├── AddResourceToWorkspaceUseCase.ts
│       ├── AddMemberToWorkspaceUseCase.ts
│       └── GetWorkspaceResourcesUseCase.ts
│
└── infrastructure/
    ├── repositories/
    │   └── WorkspaceHttpRepository.ts
    └── mappers/
        └── WorkspaceMapper.ts
```

---

## 5. PLAN DE IMPLEMENTACIÓN CON NUXT 4

### 📋 Fase 1: Consolidar Rutas (AHORA)

**Objetivo:** Limpiar y consolidar todas las rutas según estructura final.

**Tareas:**

- [x] Eliminar rutas de prueba
- [x] Eliminar rutas innecesarias
- [x] Verificar estructura de rutas final
- [ ] Documentar rutas finales en `docs/RUTAS-FINALES.md`

**Estado:** ✅ Mayormente completado

---

### 📋 Fase 2: Mejorar Autenticación (CUANDO BACKEND ESTÉ LISTO)

**Objetivo:** Conectar autenticación con backend real.

**Tareas:**

- [ ] Crear `useUserStore` para obtener usuario del backend
- [ ] Actualizar `useUser` para usar datos reales
- [ ] Implementar validación de token
- [ ] Implementar refresh token automático
- [ ] Manejar errores de autenticación

**Archivos a Modificar:**

- `app/composables/useUser.ts`
- `app/core/presentation/auth/stores/auth.store.ts` (agregar `fetchUser`)
- `app/core/shared/http/with-auth-headers.ts` (validar token)
- `app/plugins/auth.client.ts` (nuevo: refresh token)

---

### 📋 Fase 3: Sistema de Permisos (CUANDO BACKEND ESTÉ LISTO)

**Objetivo:** Implementar control de acceso basado en permisos del backend.

**Tareas:**

- [ ] Actualizar tipos `User` y `Permission`
- [ ] Crear composable `usePermissions`
- [ ] Implementar middleware de permisos
- [ ] Actualizar sidebar para filtrar por permisos
- [ ] Actualizar páginas para verificar permisos

**Archivos a Crear:**

- `app/types/permissions.ts`
- `app/composables/usePermissions.ts`
- `app/middleware/permissions.ts`

**Archivos a Modificar:**

- `app/types/user.ts`
- `app/composables/useUser.ts`
- `app/components/ProboSidebar.vue`

---

### 📋 Fase 4: Espacios de Trabajo (CUANDO FIGMA Y BACKEND ESTÉN LISTOS)

**Objetivo:** Implementar sistema completo de workspaces.

**Tareas:**

- [ ] Crear estructura hexagonal de workspaces
- [ ] Implementar casos de uso:
  - Crear workspace
  - Agregar recurso (carpeta o historial)
  - Agregar miembro
  - Gestionar permisos
- [ ] Crear páginas:
  - Dashboard de workspaces
  - Vista de workspace
  - Crear workspace
  - Agregar recurso
  - Gestionar miembros
- [ ] Integrar con historiales existentes

**Archivos a Crear:**

- `app/core/hexag/workspaces/` (estructura completa)
- `app/pages/features/espacios-trabajo/[id]/` (vista detallada)
- `app/pages/features/espacios-trabajo/[id]/recursos/` (gestionar recursos)
- `app/pages/features/espacios-trabajo/[id]/miembros/` (gestionar miembros)

---

### 📋 Fase 5: Middleware y Protección de Rutas (NUXT 4)

**Objetivo:** Usar características de Nuxt 4 para proteger rutas.

#### 5.1. Middleware Global (Ya Existe)

```typescript
// middleware/auth.global.ts (ACTUALIZAR)
export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();

  // Rutas públicas
  const PUBLIC_PATHS = ["/auth/login", "/login"];

  if (PUBLIC_PATHS.includes(to.path)) {
    if (authStore.isAuthenticated) {
      return navigateTo("/registros/sociedades/dashboard");
    }
    return;
  }

  // Proteger todas las demás rutas
  if (!authStore.isAuthenticated) {
    return navigateTo("/auth/login", {
      query: { redirect: to.fullPath },
    });
  }
});
```

#### 5.2. Middleware de Permisos (NUEVO)

```typescript
// middleware/permissions.ts (NUEVO)
export default defineNuxtRouteMiddleware((to) => {
  const { canViewModule, hasPermission } = useUser();

  // Obtener módulo de la ruta
  const module = getModuleFromRoute(to.path);

  if (!canViewModule(module)) {
    return navigateTo("/forbidden");
  }

  // Verificar permiso específico si es necesario
  const requiredPermission = to.meta.requiredPermission;
  if (
    requiredPermission &&
    !hasPermission(requiredPermission.module, requiredPermission.action)
  ) {
    return navigateTo("/forbidden");
  }
});
```

#### 5.3. Uso en Páginas

```vue
<!-- app/pages/registros/sociedades/dashboard.vue -->
<script setup lang="ts">
  definePageMeta({
    layout: "registros",
    middleware: "permissions", // ← Usa middleware de permisos
    requiredPermission: {
      module: "registros.sociedades",
      action: "read",
    },
  });
</script>
```

---

## 📝 CHECKLIST FINAL

### ✅ Completado

- [x] Documentar rutas finales
- [x] Documentar sistema de autenticación actual
- [x] Documentar sistema de permisos (concepto)
- [x] Documentar espacios de trabajo (concepto)
- [x] Crear plan de implementación

### ⏳ Pendiente (Esperando Backend/Figma)

- [ ] Implementar obtención de usuario desde backend
- [ ] Implementar validación de token
- [ ] Implementar refresh token
- [ ] Implementar sistema de permisos completo
- [ ] Implementar espacios de trabajo

---

## 🚀 PRÓXIMOS PASOS

1. **AHORA:** Consolidar rutas finales (casi listo)
2. **CUANDO BACKEND ESTÉ LISTO:**
   - Conectar autenticación real
   - Implementar permisos desde backend
3. **CUANDO FIGMA Y BACKEND ESTÉN LISTOS:**
   - Implementar espacios de trabajo completos

---

**¿Listo para continuar cuando el backend y Figma estén listos?** 🎯

