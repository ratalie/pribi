# 🏗️ ESTRUCTURA: Sistema de Autenticación y Permisos

**Documento que define dónde colocar todo el sistema de autenticación y permisos en la estructura del proyecto.**

**Fecha:** Diciembre 2024  
**Proyecto:** `probo-frontend-v30-panel-administrativo`

---

## 📋 ÍNDICE

1. [Estructura Actual](#estructura-actual)
2. [Dónde Colocar el Sistema de Auth](#dónde-colocar-el-sistema-de-auth)
3. [Dónde Colocar el Sistema de Permisos](#dónde-colocar-el-sistema-de-permisos)
4. [Endpoints del Backend Necesarios](#endpoints-del-backend-necesarios)
5. [Verificación: Vista vs Endpoints](#verificación-vista-vs-endpoints)
6. [Estructura Propuesta para Fase 1](#estructura-propuesta-para-fase-1)
7. [Plan de Implementación Fase 1](#plan-de-implementación-fase-1)

---

## 🏛️ ESTRUCTURA ACTUAL

### Sistema de Auth (Ya Implementado)

```
app/core/hexag/auth/
├── domain/
│   ├── entities/
│   │   └── auth-session.entity.ts
│   └── ports/
│       └── auth.repository.ts
├── application/
│   ├── dtos/
│   │   ├── login-credentials.dto.ts
│   │   └── auth-session.dto.ts
│   └── use-cases/
│       └── login.use-case.ts
└── infrastructure/
    ├── repositories/
    │   └── auth.http.repository.ts  ✅ Ya implementado
    └── mocks/
        ├── handlers/
        │   └── auth.handlers.ts
        └── data/
            └── auth.state.ts

app/core/presentation/auth/
├── stores/
│   └── auth.store.ts  ✅ Ya implementado (usa Composition API - revisar)
└── composables/
    └── useLoginForm.ts

middleware/
└── auth.global.ts  ✅ Ya implementado

app/core/shared/http/
└── with-auth-headers.ts  ✅ Helper para agregar token
```

### Panel Administrativo (Con Mocks)

```
app/core/hexag/panel-administrativo/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── role.entity.ts
│   │   ├── permission.entity.ts
│   │   └── society-assignment.entity.ts
│   └── ports/
│       └── user.repository.ts
├── application/
│   ├── dtos/
│   │   └── user.dto.ts
│   └── use-cases/
│       ├── get-users.use-case.ts
│       ├── get-user-permissions.use-case.ts
│       ├── update-user-permissions.use-case.ts
│       ├── get-user-route-permissions.use-case.ts
│       ├── update-user-route-permissions.use-case.ts
│       ├── assign-user-to-societies.use-case.ts
│       ├── update-user-role.use-case.ts
│       └── get-all-societies.use-case.ts
└── infrastructure/
    ├── repositories/
    │   └── user-mock.repository.ts  ⚠️ USA MOCKS
    └── mappers/
        └── user.mapper.ts

app/core/presentation/panel-administrativo/
├── stores/
│   └── user-management.store.ts
└── composables/
    ├── useUserManagement.ts
    ├── usePermissionsEditor.ts
    ├── useRoutePermissions.ts
    └── useUserRole.ts
```

---

## 🔐 DÓNDE COLOCAR EL SISTEMA DE AUTH

### ✅ Ya Está Implementado

El sistema de autenticación **ya está implementado** en:

```
app/core/hexag/auth/          # Lógica de negocio (hexagonal)
app/core/presentation/auth/    # UI y stores
middleware/auth.global.ts      # Guard de rutas
```

### 🔄 Mejoras Necesarias

#### 1. Store de Auth (Revisar)

**Ubicación actual:** `app/core/presentation/auth/stores/auth.store.ts`

**Problema:** Usa Composition API, pero el proyecto requiere Option API.

**Solución:** Convertir a Option API:

```typescript
// ❌ ACTUAL (Composition API)
export const useAuthStore = defineStore("auth", () => {
  const session = ref<AuthSessionDTO | null>(null);
  return { session, login, logout };
});

// ✅ DEBE SER (Option API)
export const useAuthStore = defineStore("auth", {
  state: () => ({
    session: null as AuthSessionDTO | null,
    status: 'idle' as Status,
  }),
  actions: {
    async login(credentials: LoginCredentialsDTO) { ... },
    logout() { ... },
  },
});
```

#### 2. Cargar Permisos Después del Login

**Ubicación:** `app/core/presentation/auth/stores/auth.store.ts`

**Agregar después del login:**

```typescript
async login(credentials: LoginCredentialsDTO) {
  // ... login actual ...
  
  // Después del login, cargar permisos
  const permissionsStore = usePermissionsStore();
  await permissionsStore.loadMyPermissions();
}
```

---

## 🔑 DÓNDE COLOCAR EL SISTEMA DE PERMISOS

### Estructura Propuesta

```
app/core/hexag/permissions/                    # ⭐ NUEVO DOMINIO
├── domain/
│   ├── entities/
│   │   ├── access-area.entity.ts              # AccessArea
│   │   ├── access-route.entity.ts              # AccessRoute
│   │   └── permission-action.entity.ts        # PermissionAction
│   └── ports/
│       └── permissions.repository.ts           # Puerto para permisos
│
├── application/
│   ├── dtos/
│   │   ├── access-area.dto.ts                  # DTOs del backend
│   │   ├── access-route.dto.ts
│   │   ├── user-override.dto.ts                # Para PUT /users/:id/access
│   │   └── study-whitelist.dto.ts              # Para PUT /studies/:id/modules
│   └── use-cases/
│       ├── get-user-access.use-case.ts         # GET /users/:id/access
│       ├── get-my-access.use-case.ts            # GET /me/access
│       ├── update-user-overrides.use-case.ts    # PUT /users/:id/access
│       ├── get-study-whitelist.use-case.ts      # GET /studies/:id/modules
│       └── update-study-whitelist.use-case.ts   # PUT /studies/:id/modules
│
└── infrastructure/
    ├── repositories/
    │   └── permissions.http.repository.ts      # ⭐ NUEVO (reemplaza mocks)
    └── mappers/
        ├── access-area.mapper.ts                # ⭐ NUEVO
        └── user-override.mapper.ts              # ⭐ NUEVO

app/core/presentation/permissions/              # ⭐ NUEVO
├── stores/
│   └── permissions.store.ts                    # ⭐ NUEVO (accessTree)
└── composables/
    ├── usePermissions.ts                       # ⭐ NUEVO (guards)
    └── useMyPermissions.ts                     # ⭐ NUEVO
```

### Integración con Panel Administrativo

El panel administrativo **usa** el dominio de permisos:

```
app/core/hexag/panel-administrativo/
└── application/
    └── use-cases/
        ├── get-user-permissions.use-case.ts     # Usa permissions.repository
        └── update-user-permissions.use-case.ts  # Usa permissions.repository
```

---

## 📡 ENDPOINTS DEL BACKEND NECESARIOS

### Para Panel Administrativo (Fase 1)

#### 1. Gestión de Usuarios

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/v1/access-management/users` | GET | Listar usuarios del estudio | ✅ Necesario |
| `/v1/access-management/users` | POST | Crear usuario | ⚠️ Opcional (Fase 2) |
| `/v1/access-management/users/:id/status` | PUT | Activar/desactivar usuario | ⚠️ Opcional (Fase 2) |
| `/v1/access-management/users/:id/role` | PUT | Cambiar rol de usuario | ✅ Necesario |
| `/v1/access-management/users/:id` | DELETE | Eliminar usuario | ⚠️ Opcional (Fase 2) |

#### 2. Permisos de Usuario

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/v1/access-management/users/:id/access` | GET | Obtener permisos efectivos (árbol V2) | ✅ **CRÍTICO** |
| `/v1/access-management/users/:id/access/full` | GET | Obtener permisos completos (con deshabilitados) | ✅ Necesario |
| `/v1/access-management/users/:id/access` | PUT | Aplicar overrides de permisos | ✅ **CRÍTICO** |
| `/v1/access-management/me/access` | GET | Obtener mis propios permisos | ✅ Necesario |

#### 3. Asignación de Sociedades

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/v1/access-management/users/:id/societies` | POST | Asignar usuario a sociedad | ✅ Necesario |
| `/v1/access-management/users/:id/societies` | GET | Listar sociedades asignadas | ✅ Necesario |

#### 4. Whitelist del Estudio (SuperAdmin - Fase 3)

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/v1/superadmin/studies/:id/modules` | PUT | Configurar whitelist | ⏳ Fase 3 |
| `/v1/superadmin/studies/:id/modules` | GET | Obtener whitelist | ⏳ Fase 3 |

#### 5. Gestión de Roles (SuperAdmin - Fase 4)

| Endpoint | Método | Descripción | Estado |
|----------|--------|-------------|--------|
| `/v1/superadmin/roles` | GET | Listar roles | ⏳ Fase 4 |
| `/v1/superadmin/roles` | POST | Crear rol | ⏳ Fase 4 |
| `/v1/superadmin/roles/:id` | PUT | Actualizar permisos de rol | ⏳ Fase 4 |

---

## ✅ VERIFICACIÓN: VISTA VS ENDPOINTS

### Vista Actual: `UserManagementView.vue`

#### Funcionalidades que Necesitan Endpoints

| Funcionalidad en Vista | Endpoint Necesario | Estado |
|------------------------|-------------------|--------|
| Listar usuarios | `GET /v1/access-management/users` | ✅ Disponible |
| Filtrar por rol | (Filtrado en frontend) | ✅ OK |
| Buscar usuario | (Filtrado en frontend) | ✅ OK |
| Ver permisos de usuario | `GET /v1/access-management/users/:id/access` | ✅ Disponible |
| Editar permisos (overrides) | `PUT /v1/access-management/users/:id/access` | ✅ Disponible |
| Asignar sociedades | `POST /v1/access-management/users/:id/societies` | ✅ Disponible |
| Ver sociedades asignadas | `GET /v1/access-management/users/:id/societies` | ✅ Disponible |
| Cambiar rol de usuario | `PUT /v1/access-management/users/:id/role` | ✅ Disponible |
| Crear usuario | `POST /v1/access-management/users` | ⚠️ No implementado en vista |
| Eliminar usuario | `DELETE /v1/access-management/users/:id` | ⚠️ No implementado en vista |

### ✅ Conclusión

**La vista actual se ajusta a los endpoints disponibles** para la Fase 1. Solo necesitamos:

1. ✅ Conectar los endpoints existentes
2. ⚠️ Agregar funcionalidades opcionales (crear/eliminar usuario) en Fase 2

---

## 🏗️ ESTRUCTURA PROPUESTA PARA FASE 1

### Archivos a Crear/Modificar

```
app/core/hexag/
├── permissions/                                # ⭐ NUEVO DOMINIO
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── access-area.entity.ts          # ⭐ NUEVO
│   │   │   ├── access-route.entity.ts         # ⭐ NUEVO
│   │   │   └── permission-action.entity.ts    # ⭐ NUEVO
│   │   └── ports/
│   │       └── permissions.repository.ts      # ⭐ NUEVO
│   │
│   ├── application/
│   │   ├── dtos/
│   │   │   ├── access-area.dto.ts             # ⭐ NUEVO
│   │   │   ├── access-route.dto.ts            # ⭐ NUEVO
│   │   │   └── user-override.dto.ts           # ⭐ NUEVO
│   │   └── use-cases/
│   │       ├── get-user-access.use-case.ts    # ⭐ NUEVO
│   │       ├── get-my-access.use-case.ts      # ⭐ NUEVO
│   │       └── update-user-overrides.use-case.ts # ⭐ NUEVO
│   │
│   └── infrastructure/
│       ├── repositories/
│       │   └── permissions.http.repository.ts # ⭐ NUEVO
│       └── mappers/
│           ├── access-area.mapper.ts          # ⭐ NUEVO
│           └── user-override.mapper.ts        # ⭐ NUEVO
│
└── panel-administrativo/
    └── infrastructure/
        └── repositories/
            ├── user-mock.repository.ts         # ⚠️ MANTENER (para desarrollo)
            └── user-http.repository.ts        # ⭐ NUEVO (reemplaza mock en producción)

app/core/presentation/
├── permissions/                                # ⭐ NUEVO
│   ├── stores/
│   │   └── permissions.store.ts             # ⭐ NUEVO
│   └── composables/
│       ├── usePermissions.ts                  # ⭐ NUEVO (guards)
│       └── useMyPermissions.ts                # ⭐ NUEVO
│
└── auth/
    └── stores/
        └── auth.store.ts                      # ⚠️ MODIFICAR (Option API + cargar permisos)

app/core/shared/http/
└── http-client.ts                              # ⭐ NUEVO (cliente HTTP centralizado)
```

### Estructura Detallada

#### 1. Dominio de Permisos (`app/core/hexag/permissions/`)

**Propósito:** Lógica de negocio para permisos (independiente del panel administrativo).

**Entidades:**

```typescript
// domain/entities/access-area.entity.ts
export interface AccessArea {
  area: 'REGISTROS' | 'OPERACIONES' | 'REPOSITORIO_AI' | 'SUNAT' | 'ARCHIVES';
  routes: AccessRoute[];
}

// domain/entities/access-route.entity.ts
export interface AccessRoute {
  key: string;
  path: string;
  displayName: string;
  description?: string;
  actions: PermissionAction[];
  modules?: {
    module: string;
    actions: PermissionAction[];
  }[];
}

// domain/entities/permission-action.entity.ts
export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'file';
```

**Puerto:**

```typescript
// domain/ports/permissions.repository.ts
export interface PermissionsRepository {
  getUserAccess(userId: string): Promise<AccessArea[]>;
  getMyAccess(): Promise<AccessArea[]>;
  updateUserOverrides(userId: string, overrides: UserOverrideDto): Promise<void>;
}
```

#### 2. Repositorio HTTP de Permisos

```typescript
// infrastructure/repositories/permissions.http.repository.ts
export class PermissionsHttpRepository implements PermissionsRepository {
  async getUserAccess(userId: string): Promise<AccessArea[]> {
    const response = await $fetch<ApiResponse<AccessArea[]>>(
      `/v1/access-management/users/${userId}/access`,
      withAuthHeaders()
    );
    return response.data;
  }

  async getMyAccess(): Promise<AccessArea[]> {
    const response = await $fetch<ApiResponse<AccessArea[]>>(
      `/v1/access-management/me/access`,
      withAuthHeaders()
    );
    return response.data;
  }

  async updateUserOverrides(
    userId: string,
    overrides: UserOverrideDto
  ): Promise<void> {
    await $fetch(
      `/v1/access-management/users/${userId}/access`,
      withAuthHeaders({
        method: 'PUT',
        body: { overrides },
      })
    );
  }
}
```

#### 3. Repositorio HTTP de Usuarios

```typescript
// infrastructure/repositories/user-http.repository.ts
export class UserHttpRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    const response = await $fetch<ApiResponse<UserDto[]>>(
      '/v1/access-management/users',
      withAuthHeaders()
    );
    return response.data.map(UserMapper.toDomain);
  }

  async getUserPermissions(userId: string): Promise<UserFlowAccess[]> {
    // Usa el repositorio de permisos
    const permissionsRepo = new PermissionsHttpRepository();
    const accessTree = await permissionsRepo.getUserAccess(userId);
    return PermissionMapper.toUserFlowAccess(accessTree);
  }

  async updateUserPermissions(
    userId: string,
    permissions: UserFlowAccess[]
  ): Promise<UserFlowAccess[]> {
    const permissionsRepo = new PermissionsHttpRepository();
    const overrides = PermissionMapper.toUserOverride(permissions);
    await permissionsRepo.updateUserOverrides(userId, overrides);
    return permissions;
  }

  // ... más métodos
}
```

#### 4. Store de Permisos

```typescript
// presentation/permissions/stores/permissions.store.ts
export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    myAccessTree: [] as AccessArea[],
    loading: false,
  }),

  actions: {
    async loadMyPermissions() {
      this.loading = true;
      const repository = new PermissionsHttpRepository();
      const useCase = new GetMyAccessUseCase(repository);
      this.myAccessTree = await useCase.execute();
      this.loading = false;
    },
  },
});
```

---

## 📋 PLAN DE IMPLEMENTACIÓN FASE 1

### Paso 1: Crear Dominio de Permisos

**Tareas:**
1. ✅ Crear `app/core/hexag/permissions/domain/entities/`
2. ✅ Crear `app/core/hexag/permissions/domain/ports/permissions.repository.ts`
3. ✅ Crear DTOs en `application/dtos/`
4. ✅ Crear casos de uso en `application/use-cases/`

**Archivos:**
- `access-area.entity.ts`
- `access-route.entity.ts`
- `permission-action.entity.ts`
- `permissions.repository.ts`
- `access-area.dto.ts`
- `access-route.dto.ts`
- `user-override.dto.ts`
- `get-user-access.use-case.ts`
- `get-my-access.use-case.ts`
- `update-user-overrides.use-case.ts`

### Paso 2: Crear Repositorio HTTP de Permisos

**Tareas:**
1. ✅ Crear `permissions.http.repository.ts`
2. ✅ Crear mappers (`access-area.mapper.ts`, `user-override.mapper.ts`)
3. ✅ Implementar métodos del puerto

**Archivos:**
- `permissions.http.repository.ts`
- `access-area.mapper.ts`
- `user-override.mapper.ts`

### Paso 3: Crear Repositorio HTTP de Usuarios

**Tareas:**
1. ✅ Crear `user-http.repository.ts`
2. ✅ Implementar todos los métodos del puerto `UserRepository`
3. ✅ Usar `PermissionsHttpRepository` para permisos

**Archivos:**
- `user-http.repository.ts`

### Paso 4: Actualizar Store de Usuarios

**Tareas:**
1. ✅ Cambiar `UserMockRepository` por `UserHttpRepository` en el store
2. ✅ Verificar que todos los métodos funcionen

**Archivos:**
- `user-management.store.ts` (modificar)

### Paso 5: Crear Store de Permisos

**Tareas:**
1. ✅ Crear `permissions.store.ts`
2. ✅ Cargar permisos después del login

**Archivos:**
- `permissions.store.ts` (nuevo)
- `auth.store.ts` (modificar para cargar permisos)

### Paso 6: Actualizar Auth Store

**Tareas:**
1. ✅ Convertir a Option API
2. ✅ Cargar permisos después del login

**Archivos:**
- `auth.store.ts` (modificar)

### Paso 7: Testing

**Tareas:**
1. ✅ Probar listar usuarios
2. ✅ Probar cargar permisos de usuario
3. ✅ Probar actualizar overrides
4. ✅ Probar asignar sociedades

---

## ✅ CHECKLIST FASE 1

### Dominio de Permisos
- [ ] Crear entidades (`AccessArea`, `AccessRoute`, `PermissionAction`)
- [ ] Crear puerto `PermissionsRepository`
- [ ] Crear DTOs
- [ ] Crear casos de uso

### Repositorios HTTP
- [ ] Crear `PermissionsHttpRepository`
- [ ] Crear `UserHttpRepository`
- [ ] Crear mappers

### Stores
- [ ] Crear `PermissionsStore`
- [ ] Actualizar `AuthStore` (Option API + cargar permisos)
- [ ] Actualizar `UserManagementStore` (usar HTTP repository)

### Testing
- [ ] Probar listar usuarios
- [ ] Probar cargar permisos
- [ ] Probar actualizar overrides
- [ ] Probar asignar sociedades

---

## 📚 REFERENCIAS

- **Documentación Backend:** `/home/yull23/workspaces/probo/docs/MAPEO-ROLES-PERMISOS-PROBO.md`
- **Endpoints Backend:** `probo-api-v30/src/modules/access-management/presentation/v1/`
- **Estructura Actual:** `app/core/hexag/panel-administrativo/`

---

**Última actualización:** Diciembre 2024












