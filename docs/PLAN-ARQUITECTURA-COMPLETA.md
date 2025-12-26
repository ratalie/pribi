# 🏗️ PLAN COMPLETO: Arquitectura DDD Hexagonal - Sistema de Permisos y Panel Administrativo

**Plan detallado de arquitectura DDD hexagonal, componentes y presentación para el sistema de permisos y panel administrativo.**

**Fecha:** Diciembre 2024  
**Proyecto:** `probo-frontend-v30-panel-administrativo`

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura Hexagonal - Dominio Permisos](#arquitectura-hexagonal---dominio-permisos)
3. [Arquitectura Hexagonal - Dominio Panel Administrativo](#arquitectura-hexagonal---dominio-panel-administrativo)
4. [Capa de Presentación](#capa-de-presentación)
5. [Componentes Compartidos](#componentes-compartidos)
6. [Plan de Implementación Paso a Paso](#plan-de-implementación-paso-a-paso)
7. [Checklist Completo](#checklist-completo)

---

## 🎯 RESUMEN EJECUTIVO

### Objetivo

Crear una arquitectura completa y bien estructurada para el sistema de permisos y panel administrativo, siguiendo:

1. **Arquitectura Hexagonal (DDD)**: Dominio desacoplado del framework
2. **Patrones del Proyecto UI**: Misma estructura de componentes y estilos
3. **Separación de Responsabilidades**: Domain → Application → Infrastructure → Presentation
4. **Preparado para Backend**: Todo listo para conectar endpoints reales

### Estructura General

```
app/core/
├── hexag/                              # Capa de Dominio (Hexagonal)
│   ├── permissions/                    # ⭐ NUEVO: Dominio de Permisos
│   │   ├── domain/                     # Entidades, Value Objects, Puertos
│   │   ├── application/                # DTOs, Use Cases
│   │   └── infrastructure/             # Repositorios HTTP/MSW, Mappers
│   │
│   └── panel-administrativo/           # Dominio de Panel Administrativo
│       ├── domain/                     # Entidades, Puertos
│       ├── application/                # Use Cases
│       └── infrastructure/             # Repositorios HTTP/MSW
│
└── presentation/                       # Capa de Presentación
    ├── permissions/                    # ⭐ NUEVO: Stores y Composables de Permisos
    │   ├── stores/
    │   └── composables/
    │
    ├── panel-administrativo/           # UI del Panel Administrativo
    │   ├── vistas/
    │   │   └── panel-administrativo/   # ⭐ REORGANIZAR: Seguir patrón UI
    │   │       ├── components/
    │   │       │   ├── PanelAdministrativoManager.vue
    │   │       │   ├── organisms/
    │   │       │   └── molecules/
    │   │       ├── composables/
    │   │       └── types/
    │   ├── stores/
    │   └── composables/
    │
    └── shared/                         # ⭐ NUEVO: Componentes Compartidos
        └── components/
            ├── VistaHeader.vue
            ├── VistaHeaderTitle.vue
            └── molecules/
                └── ActionButton.vue
```

---

## 🏛️ ARQUITECTURA HEXAGONAL - DOMINIO PERMISOS

### Estructura Completa

```
app/core/hexag/permissions/
├── domain/                             # CAPA 1: Lógica de Negocio Pura
│   ├── entities/
│   │   ├── access-area.entity.ts       # Área de acceso (REGISTROS, OPERACIONES, etc.)
│   │   ├── access-route.entity.ts      # Ruta de acceso (society, crear, dashboard)
│   │   ├── permission-action.entity.ts  # Acción de permiso (view, create, update, delete, file)
│   │   └── user-override.entity.ts     # Override de usuario
│   │
│   ├── value-objects/
│   │   ├── flow-code.vo.ts             # Value Object para códigos de flujo
│   │   └── module-name.vo.ts           # Value Object para nombres de módulos
│   │
│   ├── ports/
│   │   └── permissions.repository.ts   # Puerto (contrato) del repositorio
│   │
│   ├── enums/
│   │   ├── access-area.enum.ts         # Enum de áreas (REGISTROS, OPERACIONES, etc.)
│   │   ├── permission-action.enum.ts    # Enum de acciones
│   │   └── flow-code.enum.ts           # Enum de códigos de flujo
│   │
│   └── constants/
│       └── routes.constants.ts         # Constantes de rutas del sistema
│
├── application/                        # CAPA 2: Casos de Uso
│   ├── dtos/
│   │   ├── access-area.dto.ts          # DTO de área de acceso (request/response)
│   │   ├── access-route.dto.ts         # DTO de ruta de acceso
│   │   ├── user-override.dto.ts        # DTO para overrides de usuario
│   │   └── study-whitelist.dto.ts      # DTO para whitelist del estudio
│   │
│   ├── use-cases/
│   │   ├── get-user-access.use-case.ts # Obtener permisos de un usuario
│   │   ├── get-my-access.use-case.ts   # Obtener mis propios permisos
│   │   ├── update-user-overrides.use-case.ts # Actualizar overrides de usuario
│   │   ├── get-study-whitelist.use-case.ts   # Obtener whitelist del estudio
│   │   └── update-study-whitelist.use-case.ts # Actualizar whitelist
│   │
│   └── validators/
│       └── permissions.validator.ts    # Validadores de negocio
│
└── infrastructure/                     # CAPA 3: Adaptadores
    ├── repositories/
    │   ├── permissions.http.repository.ts    # Repositorio HTTP (backend real)
    │   └── permissions.msw.repository.ts     # Repositorio MSW (mocks)
    │
    ├── mappers/
    │   ├── access-area.mapper.ts       # Mapper: DTO ↔ Entity
    │   ├── access-route.mapper.ts       # Mapper: DTO ↔ Entity
    │   └── user-override.mapper.ts     # Mapper: DTO ↔ Entity
    │
    └── mocks/
        ├── handlers/
        │   └── permissions.handlers.ts # Handlers MSW
        └── data/
            └── permissions.state.ts    # Estado en memoria para mocks
```

### Domain Layer - Entidades

#### 1. AccessArea Entity

```typescript
// domain/entities/access-area.entity.ts

import type { AccessRoute } from './access-route.entity';
import type { AccessAreaEnum } from '../enums/access-area.enum';

/**
 * Área de acceso del sistema
 * 
 * Representa una sección principal de la aplicación (REGISTROS, OPERACIONES, etc.)
 * que contiene múltiples rutas.
 */
export interface AccessArea {
  /** Código del área (REGISTROS, OPERACIONES, REPOSITORIO_AI, etc.) */
  area: AccessAreaEnum;
  
  /** Nombre legible del área */
  displayName: string;
  
  /** Descripción del área */
  description?: string;
  
  /** Rutas disponibles en esta área */
  routes: AccessRoute[];
}
```

#### 2. AccessRoute Entity

```typescript
// domain/entities/access-route.entity.ts

import type { PermissionAction } from './permission-action.entity';

/**
 * Ruta de acceso del sistema
 * 
 * Representa una página/pantalla específica con sus permisos.
 */
export interface AccessRoute {
  /** Clave única de la ruta (ej: "society", "crear", "dashboard") */
  key: string;
  
  /** Ruta real de la aplicación (ej: "/registros/sociedades/dashboard") */
  path: string;
  
  /** Nombre legible de la ruta */
  displayName: string;
  
  /** Descripción de la ruta */
  description?: string;
  
  /** Acciones permitidas en esta ruta */
  actions: PermissionAction[];
  
  /** Módulos específicos dentro de esta ruta (opcional) */
  modules?: {
    /** Nombre del módulo */
    module: string;
    
    /** Nombre legible del módulo */
    displayName: string;
    
    /** Acciones permitidas en este módulo */
    actions: PermissionAction[];
  }[];
}
```

#### 3. PermissionAction Entity

```typescript
// domain/entities/permission-action.entity.ts

import type { PermissionActionEnum } from '../enums/permission-action.enum';

/**
 * Acción de permiso
 * 
 * Representa una acción específica que puede realizar un usuario.
 */
export interface PermissionAction {
  /** Tipo de acción (view, create, update, delete, file) */
  action: PermissionActionEnum;
  
  /** Si la acción está habilitada */
  enabled: boolean;
  
  /** Si la acción está deshabilitada explícitamente (override negativo) */
  disabled?: boolean;
}
```

#### 4. UserOverride Entity

```typescript
// domain/entities/user-override.entity.ts

/**
 * Override de permisos de usuario
 * 
 * Permite agregar o quitar permisos específicos a un usuario.
 */
export interface UserOverride {
  /** ID del usuario */
  userId: string;
  
  /** Código del flujo */
  flowCode: string;
  
  /** Nombre del módulo */
  module: string;
  
  /** Acciones a agregar o quitar */
  actions: {
    /** Tipo de acción */
    action: string;
    
    /** Si es override negativo (quitar permiso) */
    isOverride: boolean;
  }[];
}
```

### Domain Layer - Puertos

```typescript
// domain/ports/permissions.repository.ts

import type { AccessArea } from '../entities/access-area.entity';
import type { UserOverride } from '../entities/user-override.entity';

/**
 * Puerto (contrato) para el repositorio de permisos
 * 
 * Define qué necesita el dominio sin especificar cómo se implementa.
 */
export interface PermissionsRepository {
  /**
   * Obtiene el árbol de permisos de un usuario
   * 
   * @param userId ID del usuario
   * @returns Árbol de permisos (áreas → rutas → módulos → acciones)
   */
  getUserAccess(userId: string): Promise<AccessArea[]>;
  
  /**
   * Obtiene mis propios permisos (usuario autenticado)
   * 
   * @returns Árbol de permisos del usuario actual
   */
  getMyAccess(): Promise<AccessArea[]>;
  
  /**
   * Actualiza los overrides de permisos de un usuario
   * 
   * @param userId ID del usuario
   * @param overrides Overrides a aplicar
   */
  updateUserOverrides(userId: string, overrides: UserOverride[]): Promise<void>;
  
  /**
   * Obtiene la whitelist de módulos del estudio
   * 
   * @param studyId ID del estudio
   * @returns Lista de módulos habilitados
   */
  getStudyWhitelist(studyId: string): Promise<string[]>;
  
  /**
   * Actualiza la whitelist de módulos del estudio
   * 
   * @param studyId ID del estudio
   * @param modules Lista de módulos a habilitar
   */
  updateStudyWhitelist(studyId: string, modules: string[]): Promise<void>;
}
```

### Application Layer - DTOs

```typescript
// application/dtos/access-area.dto.ts

/**
 * DTO de área de acceso (request/response)
 */
export interface AccessAreaDto {
  area: string;
  displayName: string;
  description?: string;
  routes: AccessRouteDto[];
}

// application/dtos/access-route.dto.ts
export interface AccessRouteDto {
  key: string;
  path: string;
  displayName: string;
  description?: string;
  actions: PermissionActionDto[];
  modules?: {
    module: string;
    displayName: string;
    actions: PermissionActionDto[];
  }[];
}

// application/dtos/user-override.dto.ts
export interface UserOverrideDto {
  userId: string;
  flowCode: string;
  module: string;
  actions: {
    action: string;
    isOverride: boolean;
  }[];
}
```

### Application Layer - Use Cases

```typescript
// application/use-cases/get-user-access.use-case.ts

import type { PermissionsRepository } from '../../domain/ports/permissions.repository';
import type { AccessArea } from '../../domain/entities/access-area.entity';

export class GetUserAccessUseCase {
  constructor(private repository: PermissionsRepository) {}
  
  async execute(userId: string): Promise<AccessArea[]> {
    return await this.repository.getUserAccess(userId);
  }
}

// application/use-cases/get-my-access.use-case.ts
export class GetMyAccessUseCase {
  constructor(private repository: PermissionsRepository) {}
  
  async execute(): Promise<AccessArea[]> {
    return await this.repository.getMyAccess();
  }
}

// application/use-cases/update-user-overrides.use-case.ts
import type { UserOverride } from '../../domain/entities/user-override.entity';

export class UpdateUserOverridesUseCase {
  constructor(private repository: PermissionsRepository) {}
  
  async execute(userId: string, overrides: UserOverride[]): Promise<void> {
    await this.repository.updateUserOverrides(userId, overrides);
  }
}
```

### Infrastructure Layer - Repositorio HTTP

```typescript
// infrastructure/repositories/permissions.http.repository.ts

import type { PermissionsRepository } from '../../domain/ports/permissions.repository';
import type { AccessArea } from '../../domain/entities/access-area.entity';
import type { UserOverride } from '../../domain/entities/user-override.entity';
import { withAuthHeaders } from '~/core/shared/http/with-auth-headers';
import { AccessAreaMapper } from '../mappers/access-area.mapper';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export class PermissionsHttpRepository implements PermissionsRepository {
  private readonly baseUrl = '/v1/access-management';
  
  async getUserAccess(userId: string): Promise<AccessArea[]> {
    const response = await $fetch<ApiResponse<AccessAreaDto[]>>(
      `${this.baseUrl}/users/${userId}/access`,
      withAuthHeaders()
    );
    
    return response.data.map(AccessAreaMapper.toDomain);
  }
  
  async getMyAccess(): Promise<AccessArea[]> {
    const response = await $fetch<ApiResponse<AccessAreaDto[]>>(
      `${this.baseUrl}/me/access`,
      withAuthHeaders()
    );
    
    return response.data.map(AccessAreaMapper.toDomain);
  }
  
  async updateUserOverrides(userId: string, overrides: UserOverride[]): Promise<void> {
    const dto = overrides.map(UserOverrideMapper.toDto);
    
    await $fetch(
      `${this.baseUrl}/users/${userId}/access`,
      withAuthHeaders({
        method: 'PUT',
        body: { overrides: dto },
      })
    );
  }
  
  // ... más métodos
}
```

---

## 🏛️ ARQUITECTURA HEXAGONAL - DOMINIO PANEL ADMINISTRATIVO

### Estructura Actual (Mejorar)

```
app/core/hexag/panel-administrativo/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts              # ✅ Ya existe
│   │   ├── role.entity.ts              # ✅ Ya existe
│   │   ├── permission.entity.ts        # ✅ Ya existe
│   │   └── society-assignment.entity.ts # ✅ Ya existe
│   │
│   └── ports/
│       └── user.repository.ts          # ✅ Ya existe
│
├── application/
│   ├── dtos/
│   │   └── user.dto.ts                 # ✅ Ya existe
│   │
│   └── use-cases/
│       ├── get-users.use-case.ts       # ✅ Ya existe
│       ├── get-user-permissions.use-case.ts # ✅ Ya existe
│       ├── update-user-permissions.use-case.ts # ✅ Ya existe
│       ├── get-user-route-permissions.use-case.ts # ✅ Ya existe
│       ├── update-user-route-permissions.use-case.ts # ✅ Ya existe
│       ├── assign-user-to-societies.use-case.ts # ✅ Ya existe
│       ├── update-user-role.use-case.ts # ✅ Ya existe
│       └── get-all-societies.use-case.ts # ✅ Ya existe
│
└── infrastructure/
    ├── repositories/
    │   ├── user-mock.repository.ts     # ✅ Ya existe (mantener para dev)
    │   └── user-http.repository.ts     # ⭐ CREAR: Repositorio HTTP
    │
    └── mappers/
        └── user.mapper.ts              # ✅ Ya existe
```

### Mejoras Necesarias

1. **Crear `UserHttpRepository`**: Implementar repositorio HTTP que use `PermissionsHttpRepository` para permisos
2. **Actualizar Use Cases**: Asegurar que usen el repositorio correcto (HTTP o Mock según configuración)
3. **Agregar DTOs faltantes**: Para sociedades, roles, etc.

---

## 🎨 CAPA DE PRESENTACIÓN

### Estructura Completa

```
app/core/presentation/
├── permissions/                        # ⭐ NUEVO: Permisos
│   ├── stores/
│   │   └── permissions.store.ts       # Store para accessTree del usuario actual
│   │
│   └── composables/
│       ├── usePermissions.ts           # Guards y helpers de permisos
│       └── useMyPermissions.ts         # Obtener mis permisos
│
├── panel-administrativo/
│   ├── vistas/
│   │   └── panel-administrativo/       # ⭐ REORGANIZAR: Seguir patrón UI
│   │       ├── components/
│   │       │   ├── PanelAdministrativoManager.vue # Manager principal
│   │       │   ├── organisms/
│   │       │   │   ├── UserManagementTable.vue
│   │       │   │   ├── UserManagementHeader.vue
│   │       │   │   └── PermissionsEditorPanel.vue
│   │       │   └── molecules/
│   │       │       ├── UserCard.vue
│   │       │       ├── RoleBadge.vue
│   │       │       ├── PermissionToggle.vue
│   │       │       └── ActionButton.vue
│   │       │
│   │       ├── composables/
│   │       │   └── usePanelAdministrativo.ts # Controller de la vista
│   │       │
│   │       └── types/
│   │           └── panel-administrativo.types.ts
│   │
│   ├── stores/
│   │   └── user-management.store.ts    # ✅ Ya existe (actualizar)
│   │
│   └── composables/
│       ├── useUserManagement.ts        # ✅ Ya existe (actualizar)
│       ├── usePermissionsEditor.ts     # ✅ Ya existe (actualizar)
│       ├── useRoutePermissions.ts      # ✅ Ya existe (actualizar)
│       └── useUserRole.ts              # ✅ Ya existe (actualizar)
│
└── shared/                              # ⭐ NUEVO: Componentes Compartidos
    └── components/
        ├── VistaHeader.vue              # Header reutilizable
        ├── VistaHeaderTitle.vue         # Título del header
        └── molecules/
            └── ActionButton.vue         # Botón con icono
```

### Store de Permisos

```typescript
// presentation/permissions/stores/permissions.store.ts

import { defineStore } from 'pinia';
import { GetMyAccessUseCase } from '~/core/hexag/permissions/application/use-cases/get-my-access.use-case';
import { PermissionsHttpRepository } from '~/core/hexag/permissions/infrastructure/repositories/permissions.http.repository';
import type { AccessArea } from '~/core/hexag/permissions/domain/entities/access-area.entity';

export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    myAccessTree: [] as AccessArea[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    hasAccess: (state) => (area: string, route: string, action: string): boolean => {
      // Lógica para verificar acceso
      const areaData = state.myAccessTree.find(a => a.area === area);
      if (!areaData) return false;
      
      const routeData = areaData.routes.find(r => r.key === route);
      if (!routeData) return false;
      
      return routeData.actions.some(a => a.action === action && a.enabled);
    },
  },

  actions: {
    async loadMyPermissions() {
      this.loading = true;
      this.error = null;
      
      try {
        const repository = new PermissionsHttpRepository();
        const useCase = new GetMyAccessUseCase(repository);
        this.myAccessTree = await useCase.execute();
      } catch (error: any) {
        this.error = error.message || 'Error al cargar permisos';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
```

### Composable de Permisos

```typescript
// presentation/permissions/composables/usePermissions.ts

import { computed } from 'vue';
import { usePermissionsStore } from '../stores/permissions.store';

/**
 * Composable para verificar permisos
 * 
 * Usa el store de permisos para verificar acceso a áreas, rutas y acciones.
 */
export function usePermissions() {
  const store = usePermissionsStore();
  
  /**
   * Verifica si el usuario tiene acceso a una acción específica
   */
  const hasAccess = (area: string, route: string, action: string): boolean => {
    return store.hasAccess(area, route, action);
  };
  
  /**
   * Verifica si el usuario puede ver una ruta
   */
  const canViewRoute = (area: string, route: string): boolean => {
    return hasAccess(area, route, 'view');
  };
  
  /**
   * Verifica si el usuario puede crear en una ruta
   */
  const canCreate = (area: string, route: string): boolean => {
    return hasAccess(area, route, 'create');
  };
  
  return {
    hasAccess,
    canViewRoute,
    canCreate,
    // ... más helpers
  };
}
```

### Vista: Panel Administrativo Manager

```vue
<!-- presentation/panel-administrativo/vistas/panel-administrativo/components/PanelAdministrativoManager.vue -->

<template>
  <div class="min-h-full bg-gray-50">
    <!-- Header -->
    <VistaHeader
      :icon="Shield"
      title="Panel Administrativo"
      description="Gestiona usuarios, roles y permisos del sistema"
    >
      <template #right>
        <div class="panel-actions">
          <ActionButton
            variant="primary"
            size="md"
            label="Crear Usuario"
            :icon="UserPlus"
            @click="handleCreateUser"
          />
        </div>
      </template>
    </VistaHeader>

    <!-- Contenido Principal -->
    <div class="vista-container">
      <UserManagementTable
        :users="users"
        :is-loading="isLoading"
        @edit-permissions="handleEditPermissions"
        @assign-societies="handleAssignSocieties"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Shield, UserPlus } from 'lucide-vue-next';
import { usePanelAdministrativo } from '../composables/usePanelAdministrativo';
import VistaHeader from '~/core/presentation/shared/components/VistaHeader.vue';
import ActionButton from '../components/molecules/ActionButton.vue';
import UserManagementTable from '../components/organisms/UserManagementTable.vue';

const {
  users,
  isLoading,
  handleCreateUser,
  handleEditPermissions,
  handleAssignSocieties,
} = usePanelAdministrativo();
</script>

<style scoped>
  .vista-container {
    max-width: 1600px;
    margin: 0 auto;
    padding: 1.5rem 1rem;
  }

  @media (min-width: 1280px) and (max-width: 1439px) {
    .vista-container {
      padding: 2rem 1.5rem;
    }
  }

  @media (min-width: 1440px) {
    .vista-container {
      padding: 2.5rem 2rem;
    }
  }
</style>
```

---

## 🧩 COMPONENTES COMPARTIDOS

### VistaHeader

```vue
<!-- presentation/shared/components/VistaHeader.vue -->

<template>
  <div class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-[1600px] mx-auto px-8 py-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <slot name="left">
            <template v-if="icon || title || description">
              <div
                v-if="icon"
                class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style="background: linear-gradient(135deg, var(--primary-700), var(--primary-500));"
              >
                <component :is="icon" class="w-7 h-7 text-white" />
              </div>
              <VistaHeaderTitle
                v-if="title || description"
                :title="title"
                :subtitle="description"
              />
            </template>
          </slot>
        </div>
        <div class="flex items-center gap-3">
          <slot name="right"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VistaHeaderTitle from './VistaHeaderTitle.vue';

interface Props {
  icon?: any;
  title?: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {
  icon: undefined,
  title: undefined,
  description: undefined,
});
</script>
```

---

## 📋 PLAN DE IMPLEMENTACIÓN PASO A PASO

### Fase 1: Dominio de Permisos (Hexagonal)

#### Paso 1.1: Domain Layer
- [ ] Crear `app/core/hexag/permissions/domain/`
- [ ] Crear entidades (`AccessArea`, `AccessRoute`, `PermissionAction`, `UserOverride`)
- [ ] Crear enums (`AccessAreaEnum`, `PermissionActionEnum`, `FlowCodeEnum`)
- [ ] Crear value objects (`FlowCode`, `ModuleName`)
- [ ] Crear puerto `PermissionsRepository`
- [ ] Crear constantes (`routes.constants.ts`)

#### Paso 1.2: Application Layer
- [ ] Crear `app/core/hexag/permissions/application/`
- [ ] Crear DTOs (`AccessAreaDto`, `AccessRouteDto`, `UserOverrideDto`, `StudyWhitelistDto`)
- [ ] Crear use cases (`GetUserAccessUseCase`, `GetMyAccessUseCase`, `UpdateUserOverridesUseCase`)
- [ ] Crear validadores (`permissions.validator.ts`)

#### Paso 1.3: Infrastructure Layer
- [ ] Crear `app/core/hexag/permissions/infrastructure/`
- [ ] Crear `PermissionsHttpRepository` (implementa puerto)
- [ ] Crear `PermissionsMswRepository` (para desarrollo)
- [ ] Crear mappers (`AccessAreaMapper`, `AccessRouteMapper`, `UserOverrideMapper`)
- [ ] Crear mocks (handlers MSW y estado en memoria)

### Fase 2: Repositorio HTTP de Usuarios

#### Paso 2.1: Crear UserHttpRepository
- [ ] Crear `app/core/hexag/panel-administrativo/infrastructure/repositories/user-http.repository.ts`
- [ ] Implementar todos los métodos del puerto `UserRepository`
- [ ] Usar `PermissionsHttpRepository` para métodos de permisos
- [ ] Usar `withAuthHeaders` para autenticación

#### Paso 2.2: Actualizar Use Cases
- [ ] Actualizar use cases para usar repositorio HTTP (con fallback a Mock si está en dev)

### Fase 3: Componentes Compartidos

#### Paso 3.1: Crear Componentes Base
- [ ] Crear `VistaHeader.vue`
- [ ] Crear `VistaHeaderTitle.vue`
- [ ] Crear `ActionButton.vue` (molecule)

### Fase 4: Reorganizar Panel Administrativo

#### Paso 4.1: Crear Estructura de Vistas
- [ ] Crear `app/core/presentation/panel-administrativo/vistas/panel-administrativo/`
- [ ] Crear `components/PanelAdministrativoManager.vue`
- [ ] Crear `components/organisms/` (tablas, headers)
- [ ] Crear `components/molecules/` (cards, badges, toggles)
- [ ] Crear `composables/usePanelAdministrativo.ts`
- [ ] Crear `types/panel-administrativo.types.ts`

#### Paso 4.2: Migrar Componentes Existentes
- [ ] Mover `UserManagementView.vue` → `PanelAdministrativoManager.vue`
- [ ] Refactorizar componentes siguiendo patrón organisms/molecules
- [ ] Actualizar estilos con media queries responsivas
- [ ] Usar `VistaHeader` en lugar de header custom

### Fase 5: Store y Composables de Permisos

#### Paso 5.1: Crear Store de Permisos
- [ ] Crear `app/core/presentation/permissions/stores/permissions.store.ts`
- [ ] Implementar estado y getters
- [ ] Implementar acción `loadMyPermissions`

#### Paso 5.2: Crear Composables
- [ ] Crear `usePermissions.ts` (guards y helpers)
- [ ] Crear `useMyPermissions.ts` (obtener permisos del usuario actual)

#### Paso 5.3: Integrar con Auth
- [ ] Actualizar `auth.store.ts` para cargar permisos después del login
- [ ] Convertir `auth.store.ts` a Option API (si no lo está)

### Fase 6: Actualizar Stores Existentes

#### Paso 6.1: Actualizar UserManagementStore
- [ ] Cambiar `UserMockRepository` por `UserHttpRepository` (con fallback)
- [ ] Actualizar métodos para usar repositorios HTTP

#### Paso 6.2: Actualizar Composables
- [ ] Actualizar `useUserManagement.ts`
- [ ] Actualizar `usePermissionsEditor.ts`
- [ ] Actualizar `useRoutePermissions.ts`

---

## ✅ CHECKLIST COMPLETO

### Dominio de Permisos (Hexagonal)

#### Domain Layer
- [ ] `access-area.entity.ts`
- [ ] `access-route.entity.ts`
- [ ] `permission-action.entity.ts`
- [ ] `user-override.entity.ts`
- [ ] `flow-code.vo.ts`
- [ ] `module-name.vo.ts`
- [ ] `permissions.repository.ts` (puerto)
- [ ] `access-area.enum.ts`
- [ ] `permission-action.enum.ts`
- [ ] `flow-code.enum.ts`
- [ ] `routes.constants.ts`

#### Application Layer
- [ ] `access-area.dto.ts`
- [ ] `access-route.dto.ts`
- [ ] `user-override.dto.ts`
- [ ] `study-whitelist.dto.ts`
- [ ] `get-user-access.use-case.ts`
- [ ] `get-my-access.use-case.ts`
- [ ] `update-user-overrides.use-case.ts`
- [ ] `get-study-whitelist.use-case.ts`
- [ ] `update-study-whitelist.use-case.ts`
- [ ] `permissions.validator.ts`

#### Infrastructure Layer
- [ ] `permissions.http.repository.ts`
- [ ] `permissions.msw.repository.ts`
- [ ] `access-area.mapper.ts`
- [ ] `access-route.mapper.ts`
- [ ] `user-override.mapper.ts`
- [ ] `permissions.handlers.ts` (MSW)
- [ ] `permissions.state.ts` (MSW)

### Panel Administrativo

#### Repositorio HTTP
- [ ] `user-http.repository.ts`

#### Componentes Compartidos
- [ ] `VistaHeader.vue`
- [ ] `VistaHeaderTitle.vue`
- [ ] `ActionButton.vue`

#### Vista Panel Administrativo
- [ ] `PanelAdministrativoManager.vue`
- [ ] `UserManagementTable.vue` (organism)
- [ ] `UserManagementHeader.vue` (organism)
- [ ] `PermissionsEditorPanel.vue` (organism)
- [ ] `UserCard.vue` (molecule)
- [ ] `RoleBadge.vue` (molecule)
- [ ] `PermissionToggle.vue` (molecule)
- [ ] `usePanelAdministrativo.ts` (composable)
- [ ] `panel-administrativo.types.ts`

### Stores y Composables

#### Permisos
- [ ] `permissions.store.ts`
- [ ] `usePermissions.ts`
- [ ] `useMyPermissions.ts`

#### Auth
- [ ] Actualizar `auth.store.ts` (Option API + cargar permisos)

#### Panel Administrativo
- [ ] Actualizar `user-management.store.ts`
- [ ] Actualizar `useUserManagement.ts`
- [ ] Actualizar `usePermissionsEditor.ts`
- [ ] Actualizar `useRoutePermissions.ts`

---

## 📚 REFERENCIAS

- **Documentación Backend:** `/home/yull23/workspaces/probo/docs/MAPEO-ROLES-PERMISOS-PROBO.md`
- **Patrones UI:** `/home/yull23/workspaces/probo/probo-frontend-v30-panel-administrativo/docs/PATRONES-UI-PROYECTO.md`
- **Estructura Auth:** `/home/yull23/workspaces/probo/probo-frontend-v30-panel-administrativo/docs/ESTRUCTURA-AUTH-PERMISOS.md`
- **Ejemplo Hexagonal:** `app/core/hexag/registros/` y `app/core/hexag/juntas/`

---

**Última actualización:** Diciembre 2024








