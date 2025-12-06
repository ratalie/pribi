# 🔍 INVESTIGACIÓN COMPLETA: Sistema de Permisos - Análisis y Plan

**Fecha:** Diciembre 2024  
**Estado:** 🔍 INVESTIGACIÓN COMPLETA  
**Objetivo:** Entender todo el contexto antes de implementar

---

## 📋 ÍNDICE

1. [Análisis del Estado Actual](#análisis-del-estado-actual)
2. [Patrones Identificados](#patrones-identificados)
3. [Dudas y Preguntas](#dudas-y-preguntas)
4. [Flujo de Login y Autenticación](#flujo-de-login-y-autenticación)
5. [Plan de Investigación](#plan-de-investigación)
6. [Estructura Propuesta](#estructura-propuesta)
7. [Roadmap de Implementación](#roadmap-de-implementación)

---

## 📊 ANÁLISIS DEL ESTADO ACTUAL

### ✅ Lo que Encontré

#### 1. **Patrón de Componentes (flow-layout-juntas)**

**Estructura:**

```
app/layouts/flow-layout-juntas.vue (60 líneas)
  └── Solo orquestación visual, sin lógica

app/components/flow-layout-juntas/
  ├── FlowLayoutJuntasSidebar.vue (50 líneas) ← Auto-gestionado
  ├── FlowLayoutJuntasHeader.vue (40 líneas) ← Auto-gestionado
  ├── FlowLayoutJuntasContentWrapper.vue (106 líneas) ← Auto-gestionado
  ├── FlowLayoutJuntasFooterWrapper.vue (70 líneas) ← Auto-gestionado
  └── Componentes presentacionales (SingleWizardSidebarJuntas, etc.)
```

**Características:**

- ✅ Componentes **auto-gestionados** (no reciben props, importan composables internamente)
- ✅ Separación clara: **wrappers** (lógica) vs **presentacionales** (UI)
- ✅ Layout minimalista: solo estructura visual
- ✅ Cada componente encapsula su lógica

**Ejemplo:**

```vue
<!-- FlowLayoutJuntasSidebar.vue -->
<script setup lang="ts">
  // Auto-gestiona: importa composables internamente
  const { steps, currentStepIndex } = useJuntasNavbarRoutes();
  const { handleStepClick } = useJuntasLayoutHandlers(...);
</script>

<template>
  <!-- Solo pasa props al componente presentacional -->
  <SingleWizardSidebarJuntas :steps="steps" :on-step-click="handleStepClick" />
</template>
```

#### 2. **Arquitectura Hexagonal (sociedades)**

**Estructura:**

```
app/core/hexag/registros/sociedades/
├── domain/
│   ├── entities/          # Entidades de negocio puras
│   └── ports/             # Contratos (interfaces)
├── application/
│   ├── dtos/              # DTOs bidireccionales
│   └── use-cases/         # Casos de uso
└── infrastructure/
    ├── repositories/       # Implementaciones HTTP/Mock
    └── mappers/           # DTO ↔ Entidad

app/core/presentation/registros/sociedades/
├── stores/                # Stores Pinia (Option API)
├── composables/           # Controllers
└── components/            # Componentes Vue
```

**Características:**

- ✅ Domain NO depende de nada (puro TypeScript)
- ✅ Application depende solo de Domain
- ✅ Infrastructure implementa los ports de Domain
- ✅ Presentation usa casos de uso de Application

#### 3. **Flujo de Login Actual**

**Endpoints:**

- `POST /api/v2/auth` → Devuelve token, studyName, roleName

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "studyName": "Example Study",
    "roleName": "Administrador"
  }
}
```

**Flujo:**

1. Usuario hace login → `POST /api/v2/auth`
2. Backend devuelve token + roleName básico
3. Frontend guarda token en `auth.store` (persist: true)
4. Token se usa en headers: `Authorization: Bearer <token>`

**⚠️ PROBLEMA IDENTIFICADO:**

- El login solo devuelve `roleName` básico
- **NO devuelve permisos completos** (sociedades, rutas, carpetas)
- **NO hay endpoint para obtener usuario completo** después del login
- `useUser.ts` usa datos **mock** (no viene del backend)

---

## 🎯 PATRONES IDENTIFICADOS

### Patrón 1: Componentes Auto-Gestionados

```vue
<!-- ✅ CORRECTO (como flow-layout-juntas) -->
<script setup lang="ts">
  // Componente importa composables internamente
  const { data } = useMyComposable();
  const { handler } = useMyHandlers();
</script>

<template>
  <PresentationalComponent :data="data" :handler="handler" />
</template>
```

```vue
<!-- ❌ INCORRECTO (evitar) -->
<script setup lang="ts">
  // Props externos, lógica mezclada
</script>

<template>
  <div>
    <!-- Lógica mezclada con UI -->
  </div>
</template>
```

### Patrón 2: Arquitectura Hexagonal

```
Domain (puro)
  ↑
Application (usa Domain)
  ↑
Infrastructure (implementa Domain ports)
  ↑
Presentation (usa Application use-cases)
```

### Patrón 3: Stores con Option API

```typescript
// ✅ CORRECTO
export const useMyStore = defineStore("myStore", {
  state: () => ({
    data: [],
    loading: false,
  }),
  actions: {
    async loadData() { ... }
  },
});

// ❌ INCORRECTO (NO usar Composition API en stores)
export const useMyStore = defineStore("myStore", () => {
  const data = ref([]);
  return { data };
});
```

---

## ❓ DUDAS Y PREGUNTAS

### 1. **Flujo de Login y Obtención de Usuario**

**Duda:** ¿Cómo se obtiene la información completa del usuario después del login?

**Estado Actual:**

- Login devuelve: `token`, `studyName`, `roleName`
- **NO devuelve:** permisos completos, sociedades asignadas, rutas permitidas

**Preguntas:**

1. ¿Existe un endpoint `GET /api/v2/users/me` o similar?
2. ¿El token JWT contiene toda la info de permisos?
3. ¿Necesitamos hacer una llamada adicional después del login?
4. ¿Cómo se manejan los permisos por sociedad? ¿Vienen en el token o en un endpoint separado?

**Respuesta Necesaria del Backend:**

```typescript
// Opción 1: Endpoint separado
GET /api/v2/users/me
Response: {
  id: string;
  email: string;
  name: string;
  globalRole: RoleName;
  societyPermissions: SocietyPermission[];
  routePermissions: RoutePermission[];
  folderPermissions: FolderPermission[];
}

// Opción 2: Token JWT con toda la info
// Decodificar token y extraer permisos

// Opción 3: Endpoint específico de permisos
GET /api/v2/users/:userId/permissions
```

### 2. **Estructura de Permisos en Backend**

**Dudas:**

1. ¿Cómo está estructurada la tabla de permisos en backend?
2. ¿Los permisos por ruta se guardan por usuario o por rol?
3. ¿Los permisos por sociedad se guardan en una tabla separada?
4. ¿Cómo se manejan los wildcards (`/registros/sociedades/*`)?

### 3. **Integración con Carpetas Personalizadas**

**Dudas:**

1. ¿Los permisos de carpetas están en la misma tabla que permisos de rutas?
2. ¿Cómo se relacionan los permisos de carpeta con los permisos de ruta `/storage/carpetas-personalizadas`?

### 4. **Verificación de Permisos en Rutas**

**Dudas:**

1. ¿El backend valida permisos en cada request?
2. ¿Necesitamos middleware en frontend para verificar permisos antes de navegar?
3. ¿Cómo manejamos rutas dinámicas (`/operaciones/sociedades/:societyId/...`)?

---

## 🔐 FLUJO DE LOGIN Y AUTENTICACIÓN

### Flujo Actual (Identificado)

```
1. Usuario ingresa credenciales
   ↓
2. POST /api/v2/auth
   Body: { email, password }
   ↓
3. Backend valida y devuelve:
   {
     token: "JWT...",
     studyName: "...",
     roleName: "Administrador"
   }
   ↓
4. Frontend guarda token en auth.store
   ↓
5. Token se usa en headers de requests siguientes
   Authorization: Bearer <token>
```

### Flujo Propuesto (Necesario)

```
1. Usuario ingresa credenciales
   ↓
2. POST /api/v2/auth
   Body: { email, password }
   ↓
3. Backend valida y devuelve:
   {
     token: "JWT...",
     studyName: "...",
     roleName: "Administrador"
   }
   ↓
4. Frontend guarda token en auth.store
   ↓
5. Frontend hace GET /api/v2/users/me (o decodifica token)
   ↓
6. Backend devuelve usuario completo con permisos:
   {
     id: "...",
     email: "...",
     globalRole: "Administrador",
     societyPermissions: [...],
     routePermissions: [...],
     folderPermissions: [...]
   }
   ↓
7. Frontend guarda permisos en user.store
   ↓
8. Middleware verifica permisos antes de navegar
```

### Endpoints Necesarios (Comunicar al Backend)

```typescript
// 1. Obtener usuario completo después del login
GET /api/v2/users/me
Headers: { Authorization: Bearer <token> }
Response: {
  id: string;
  email: string;
  name: string;
  globalRole: RoleName;
  societyPermissions: SocietyPermission[];
  routePermissions: RoutePermission[];
  folderPermissions: FolderPermission[];
}

// 2. Obtener permisos específicos (si no vienen en /me)
GET /api/v2/users/:userId/permissions
GET /api/v2/users/:userId/permissions?type=society
GET /api/v2/users/:userId/permissions?type=route
GET /api/v2/users/:userId/permissions?type=folder

// 3. Actualizar permisos
PUT /api/v2/users/:userId/permissions
Body: {
  societyPermissions?: SocietyPermission[];
  routePermissions?: RoutePermission[];
}

// 4. Verificar acceso a ruta (para middleware)
GET /api/v2/users/:userId/can-access?route=/registros/sociedades/historial&societyId=123
Response: {
  allowed: boolean;
  permissions: { read: boolean; write: boolean; ... }
}
```

---

## 🔬 PLAN DE INVESTIGACIÓN

### Fase 1: Investigar Backend (1 día)

**Tareas:**

1. ✅ Revisar documentación de backend sobre autenticación
2. ❓ Preguntar al equipo backend:
   - ¿Existe endpoint para obtener usuario completo?
   - ¿Cómo se estructuran los permisos en la BD?
   - ¿El token JWT contiene permisos o necesitamos endpoint separado?
   - ¿Cómo se manejan permisos por sociedad?
   - ¿Cómo se manejan wildcards en rutas?

**Archivos a revisar:**

- `docs/backend/00-autenticacion.md` ✅ (ya revisado)
- Documentación de endpoints de usuarios (buscar)
- Documentación de permisos (buscar)

### Fase 2: Analizar Código Existente (1 día)

**Tareas:**

1. ✅ Revisar `app/composables/useUser.ts` (usa mock)
2. ✅ Revisar `app/composables/usePermissions.ts` (revisar lógica)
3. ✅ Revisar `app/core/hexag/panel-administrativo/` (estructura existente)
4. ❓ Revisar cómo se manejan permisos en otros módulos

**Archivos a revisar:**

- `app/composables/usePermissions.ts` (leer completo)
- `app/core/shared/mappers/permissions.mapper.ts` (leer completo)
- `app/core/hexag/panel-administrativo/` (explorar estructura)

### Fase 3: Diseñar Estructura (1 día)

**Tareas:**

1. Diseñar estructura hexagonal para permisos
2. Diseñar componentes siguiendo patrón flow-layout-juntas
3. Diseñar stores con Option API
4. Crear mapeo completo de rutas

**Entregables:**

- Diagrama de arquitectura
- Estructura de carpetas
- Tipos TypeScript
- Mapeo de rutas

---

## 🏗️ ESTRUCTURA PROPUESTA

### Arquitectura Hexagonal

```
app/core/hexag/panel-administrativo/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── role.entity.ts
│   │   ├── permission.entity.ts
│   │   ├── society-permission.entity.ts
│   │   ├── route-permission.entity.ts
│   │   └── folder-permission.entity.ts
│   └── ports/
│       ├── user.repository.ts
│       └── permission.repository.ts
├── application/
│   ├── dtos/
│   │   ├── user.dto.ts
│   │   ├── permission.dto.ts
│   │   └── route-permission.dto.ts
│   └── use-cases/
│       ├── get-user-permissions.use-case.ts
│       ├── update-user-permissions.use-case.ts
│       ├── assign-user-to-society.use-case.ts
│       └── verify-route-access.use-case.ts
└── infrastructure/
    ├── repositories/
    │   ├── user-http.repository.ts
    │   └── user-mock.repository.ts
    └── mappers/
        └── permission.mapper.ts

app/core/presentation/panel-administrativo/
├── stores/
│   ├── user-management.store.ts (Option API)
│   └── permissions.store.ts (Option API)
├── composables/
│   ├── useUserManagement.ts (Controller)
│   └── usePermissions.ts (Controller)
└── components/
    ├── UserManagementView.vue (Wrapper)
    ├── PermissionsEditor/
    │   ├── PermissionsEditor.vue (Wrapper)
    │   ├── PermissionsEditorTabs.vue (Presentacional)
    │   ├── SocietyPermissionsTab.vue (Wrapper)
    │   ├── RoutePermissionsTab.vue (Wrapper)
    │   └── FolderPermissionsTab.vue (Wrapper)
    └── RoutePermissionsEditor/
        ├── RoutePermissionsEditor.vue (Wrapper)
        ├── RouteGroup.vue (Presentacional)
        └── RoutePermissionItem.vue (Presentacional)
```

### Componentes Siguiendo Patrón flow-layout-juntas

```vue
<!-- PermissionsEditor.vue (Wrapper - Auto-gestionado) -->
<script setup lang="ts">
  import { usePermissionsEditor } from "./composables/usePermissionsEditor";

  // Auto-gestiona: importa composables internamente
  const { user, permissions, selectedTab, savePermissions } = usePermissionsEditor();
</script>

<template>
  <!-- Solo pasa props al componente presentacional -->
  <PermissionsEditorTabs
    :user="user"
    :permissions="permissions"
    :selected-tab="selectedTab"
    @save="savePermissions"
  />
</template>
```

```vue
<!-- RoutePermissionsTab.vue (Wrapper - Auto-gestionado) -->
<script setup lang="ts">
  import { useRoutePermissions } from "./composables/useRoutePermissions";

  // Auto-gestiona: importa composables internamente
  const { routes, selectedSociety, togglePermission } = useRoutePermissions();
</script>

<template>
  <!-- Solo pasa props al componente presentacional -->
  <RoutePermissionsEditor
    :routes="routes"
    :selected-society="selectedSociety"
    @toggle-permission="togglePermission"
  />
</template>
```

### Stores con Option API

```typescript
// user-management.store.ts
export const useUserManagementStore = defineStore("userManagement", {
  state: () => ({
    users: [] as User[],
    selectedUser: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async loadUsers() {
      this.loading = true;
      try {
        const useCase = new GetUsersUseCase(new UserHttpRepository());
        this.users = await useCase.execute();
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async updateUserPermissions(userId: string, permissions: Permission[]) {
      // ...
    },
  },
});
```

---

## 🗺️ ROADMAP DE IMPLEMENTACIÓN

### Fase 1: Investigación y Diseño (2-3 días)

**Día 1: Investigar Backend**

- [ ] Revisar documentación de backend
- [ ] Preguntar al equipo backend sobre endpoints
- [ ] Entender estructura de permisos en BD
- [ ] Documentar endpoints necesarios

**Día 2: Analizar Código Existente**

- [ ] Revisar `usePermissions.ts` completo
- [ ] Revisar `permissions.mapper.ts` completo
- [ ] Revisar estructura de `panel-administrativo`
- [ ] Identificar qué reutilizar y qué crear nuevo

**Día 3: Diseñar Estructura**

- [ ] Crear diagrama de arquitectura
- [ ] Definir estructura de carpetas
- [ ] Crear tipos TypeScript
- [ ] Crear mapeo completo de rutas

### Fase 2: Domain y Application (3-4 días)

**Día 4-5: Domain Layer**

- [ ] Crear entidades (User, Role, Permission, etc.)
- [ ] Crear ports (UserRepository, PermissionRepository)
- [ ] Crear value objects si es necesario

**Día 6-7: Application Layer**

- [ ] Crear DTOs (UserDTO, PermissionDTO, RoutePermissionDTO)
- [ ] Crear casos de uso:
  - GetUserPermissionsUseCase
  - UpdateUserPermissionsUseCase
  - AssignUserToSocietyUseCase
  - VerifyRouteAccessUseCase

### Fase 3: Infrastructure (2-3 días)

**Día 8-9: Repositories**

- [ ] Crear UserHttpRepository
- [ ] Crear UserMockRepository
- [ ] Crear PermissionHttpRepository
- [ ] Crear PermissionMockRepository

**Día 10: Mappers**

- [ ] Crear PermissionMapper (DTO ↔ Entidad)
- [ ] Crear RoutePermissionMapper

### Fase 4: Presentation (5-7 días)

**Día 11-12: Stores**

- [ ] Crear UserManagementStore (Option API)
- [ ] Crear PermissionsStore (Option API)
- [ ] Integrar con casos de uso

**Día 13-14: Composables/Controllers**

- [ ] Crear useUserManagement
- [ ] Crear usePermissions
- [ ] Crear useRoutePermissions
- [ ] Crear useSocietyPermissions

**Día 15-17: Componentes**

- [ ] Crear PermissionsEditor.vue (Wrapper)
- [ ] Crear PermissionsEditorTabs.vue (Presentacional)
- [ ] Crear SocietyPermissionsTab.vue (Wrapper)
- [ ] Crear RoutePermissionsTab.vue (Wrapper)
- [ ] Crear RoutePermissionsEditor.vue (Wrapper)
- [ ] Crear RouteGroup.vue (Presentacional)
- [ ] Crear RoutePermissionItem.vue (Presentacional)
- [ ] Crear FolderPermissionsTab.vue (Wrapper)

### Fase 5: Integración y Testing (3-4 días)

**Día 18-19: Integración**

- [ ] Conectar componentes con stores
- [ ] Conectar stores con casos de uso
- [ ] Integrar con backend (o mock)
- [ ] Crear middleware de verificación de rutas

**Día 20-21: Testing**

- [ ] Testing manual de flujos
- [ ] Verificar permisos en rutas
- [ ] Verificar permisos en carpetas
- [ ] Testing de edge cases

### Fase 6: Documentación (1-2 días)

**Día 22-23: Documentación**

- [ ] Documentar arquitectura
- [ ] Documentar componentes
- [ ] Crear guía de uso para admins
- [ ] Actualizar README

---

## ✅ CHECKLIST DE INVESTIGACIÓN

### Backend

- [ ] ¿Existe `GET /api/v2/users/me`?
- [ ] ¿Cómo se estructuran los permisos en BD?
- [ ] ¿El token JWT contiene permisos?
- [ ] ¿Cómo se manejan permisos por sociedad?
- [ ] ¿Cómo se manejan wildcards en rutas?
- [ ] ¿Existen endpoints para actualizar permisos?

### Frontend

- [ ] Revisar `usePermissions.ts` completo
- [ ] Revisar `permissions.mapper.ts` completo
- [ ] Revisar estructura de `panel-administrativo`
- [ ] Identificar qué reutilizar
- [ ] Entender flujo de login completo

### Diseño

- [ ] Crear diagrama de arquitectura
- [ ] Definir estructura de carpetas
- [ ] Crear tipos TypeScript
- [ ] Crear mapeo completo de rutas
- [ ] Diseñar componentes siguiendo patrón flow-layout-juntas

---

## 📝 PRÓXIMOS PASOS INMEDIATOS

1. **Comunicar con Backend:**

   - Preguntar sobre endpoints de usuarios y permisos
   - Entender estructura de permisos en BD
   - Confirmar cómo se manejan permisos por sociedad

2. **Revisar Código Existente:**

   - Leer `usePermissions.ts` completo
   - Leer `permissions.mapper.ts` completo
   - Explorar estructura de `panel-administrativo`

3. **Crear Estructura Base:**
   - Crear tipos TypeScript para permisos
   - Crear mapeo de rutas
   - Crear estructura de carpetas

---

**Última actualización:** Diciembre 2024  
**Estado:** 🔍 INVESTIGACIÓN COMPLETA - LISTO PARA COMENZAR IMPLEMENTACIÓN
