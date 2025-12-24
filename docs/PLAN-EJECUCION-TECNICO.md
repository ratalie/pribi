# 🚀 PLAN DE EJECUCIÓN TÉCNICO: Sistema de Permisos Simplificado

**Plan técnico detallado por fases para implementar el sistema de permisos simplificado en el panel administrativo.**

**Fecha:** Diciembre 2024  
**Proyecto:** `probo-frontend-v30-panel-administrativo`

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Decisiones Técnicas](#decisiones-técnicas)
3. [Fase 1: Infraestructura Base](#fase-1-infraestructura-base)
4. [Fase 2: Componentes UI Simplificados](#fase-2-componentes-ui-simplificados)
5. [Fase 3: Mappers y Lógica de Transformación](#fase-3-mappers-y-lógica-de-transformación)
6. [Fase 4: Integración con Backend](#fase-4-integración-con-backend)
7. [Fase 5: Vista Avanzada (Opcional)](#fase-5-vista-avanzada-opcional)
8. [Estructura de Archivos Completa](#estructura-de-archivos-completa)
9. [Checklist de Implementación](#checklist-de-implementación)

---

## 🎯 RESUMEN EJECUTIVO

### Objetivo

Implementar un sistema de permisos simplificado que:
- Oculte la complejidad granular del backend
- Permita configuración simple en 3 pasos (Rol → Módulos → Sociedades)
- Convierta automáticamente la configuración simple a overrides del backend
- Mantenga flexibilidad para casos avanzados

### Stack Tecnológico

- **Framework:** Nuxt 4
- **UI:** Vue 3 (Composition API)
- **Estado:** Pinia (Option API para stores)
- **Estilos:** Tailwind CSS 4
- **Componentes:** shadcn-vue
- **Arquitectura:** DDD Hexagonal

### Flujo de Usuario

```
1. Crear Usuario
   ↓
2. Seleccionar Rol (Administrador/Editor/Lector)
   ↓
3. Si Editor/Lector → Configurar Módulos
   ↓
4. Si Editor/Lector → Configurar Sociedades
   ↓
5. Si Editor → Configurar Acciones
   ↓
6. Guardar → Mapper convierte a overrides del backend
```

---

## 🔧 DECISIONES TÉCNICAS

### 1. Estructura de Vistas

**Decisión:** Seguir patrón de `probo-frontend-v30-ui`

```
app/core/presentation/panel-administrativo/vistas/
├── gestion-usuarios/              # Vista principal de gestión
│   ├── components/
│   │   ├── GestionUsuariosManager.vue
│   │   ├── organisms/
│   │   │   ├── UsuariosTable.vue
│   │   │   ├── UsuariosHeader.vue
│   │   │   └── UsuariosStats.vue
│   │   └── molecules/
│   │       ├── UsuarioCard.vue
│   │       ├── UsuarioRow.vue
│   │       └── RoleBadge.vue
│   ├── composables/
│   │   └── useGestionUsuarios.ts
│   └── types/
│       └── gestion-usuarios.types.ts
│
└── configurar-permisos/           # Vista de configuración de permisos
    ├── components/
    │   ├── ConfigurarPermisosManager.vue
    │   ├── organisms/
    │   │   ├── PermisosSimpleForm.vue
    │   │   ├── PermisosAdvancedForm.vue
    │   │   └── PermisosSummary.vue
    │   └── molecules/
    │       ├── RoleSelector.vue
    │       ├── ModuleSelector.vue
    │       ├── SocietySelector.vue
    │       └── ActionSelector.vue
    ├── composables/
    │   └── useConfigurarPermisos.ts
    └── types/
        └── configurar-permisos.types.ts
```

### 2. Rutas

**Decisión:** Mantener estructura simple, agregar rutas nuevas

```
app/pages/
├── admin/
│   ├── panel.vue                    # Vista principal (ya existe)
│   ├── usuarios/
│   │   ├── index.vue               # Lista de usuarios
│   │   ├── crear.vue                # Crear usuario
│   │   └── [id]/
│   │       ├── index.vue            # Ver usuario
│   │       └── permisos.vue         # Configurar permisos
```

### 3. Stores

**Decisión:** Usar Pinia Option API (como en el proyecto)

```
app/core/presentation/panel-administrativo/stores/
├── user-management.store.ts        # Ya existe
├── permissions-config.store.ts     # NUEVO: Estado de configuración de permisos
└── societies.store.ts              # NUEVO: Estado de sociedades disponibles
```

### 4. Mappers

**Decisión:** Crear mappers que conviertan configuración simple → overrides del backend

```
app/core/hexag/permissions/application/mappers/
├── simple-config-to-overrides.mapper.ts    # Convierte UI simple → Backend
└── overrides-to-simple-config.mapper.ts    # Convierte Backend → UI simple
```

### 5. Componentes Compartidos

**Decisión:** Crear componentes reutilizables siguiendo patrones del proyecto

```
app/core/presentation/shared/components/
├── VistaHeader.vue                 # Ya existe en UI
├── ActionButton.vue                # Ya existe en UI
└── admin/                          # NUEVO: Componentes específicos del admin
    ├── RoleSelector.vue
    ├── ModuleSelector.vue
    ├── SocietySelector.vue
    └── ActionSelector.vue
```

---

## 📦 FASE 1: INFRAESTRUCTURA BASE

### Objetivo

Preparar la infraestructura necesaria: repositorios, stores base, y tipos.

### Tareas

#### 1.1 Crear UserHttpRepository

**Archivo:** `app/core/hexag/panel-administrativo/infrastructure/repositories/user-http.repository.ts`

**Responsabilidades:**
- Implementar `UserRepository` port
- Conectar con endpoints del backend
- Manejar errores y transformaciones

**Endpoints a implementar:**
- `GET /v1/access-management/users` - Listar usuarios
- `POST /v1/access-management/users` - Crear usuario
- `PUT /v1/access-management/users/:id/role` - Cambiar rol
- `PUT /v1/access-management/users/:id/status` - Activar/desactivar
- `DELETE /v1/access-management/users/:id` - Eliminar usuario
- `POST /v1/access-management/users/:id/societies` - Asignar sociedades
- `GET /v1/access-management/users/:id/societies` - Ver sociedades asignadas

**Decisiones:**
- Usar `withAuthHeaders` para autenticación
- Retornar entidades del dominio (no DTOs)
- Usar mappers para transformar DTOs → Entidades

#### 1.2 Crear SocietiesRepository

**Archivo:** `app/core/hexag/panel-administrativo/infrastructure/repositories/societies-http.repository.ts`

**Responsabilidades:**
- Obtener lista de sociedades disponibles
- Filtrar por estudio

**Endpoints:**
- `GET /v1/society-profile/study/:studyId` - Listar sociedades del estudio

#### 1.3 Crear PermissionsConfigStore

**Archivo:** `app/core/presentation/panel-administrativo/stores/permissions-config.store.ts`

**Estado:**
```typescript
{
  // Configuración simple actual
  selectedRole: 'Administrador' | 'Editor' | 'Lector',
  selectedModules: string[],  // IDs de áreas seleccionadas
  selectedSocieties: string[], // IDs de sociedades seleccionadas
  selectedActions: string[],   // Acciones seleccionadas
  
  // Modo de configuración
  mode: 'simple' | 'advanced',
  
  // Estado de carga
  isLoading: boolean,
  isSaving: boolean,
}
```

**Acciones:**
- `setRole(role)`
- `setModules(modules)`
- `setSocieties(societies)`
- `setActions(actions)`
- `reset()`
- `loadFromUser(userId)` - Cargar configuración existente

#### 1.4 Crear SocietiesStore

**Archivo:** `app/core/presentation/panel-administrativo/stores/societies.store.ts`

**Estado:**
```typescript
{
  societies: Society[],
  isLoading: boolean,
  selectedSocieties: string[], // Para el selector
}
```

**Acciones:**
- `loadSocieties(studyId)`
- `setSelectedSocieties(ids)`
- `toggleSociety(id)`
```

#### 1.5 Crear Tipos TypeScript

**Archivo:** `app/core/presentation/panel-administrativo/vistas/configurar-permisos/types/configurar-permisos.types.ts`

**Tipos:**
```typescript
export type SimpleRole = 'Administrador' | 'Editor' | 'Lector';

export interface SimplePermissionsConfig {
  role: SimpleRole;
  modules: {
    area: string;
    enabled: boolean;
    submodules?: {
      key: string;
      enabled: boolean;
    }[];
  }[];
  societies: {
    mode: 'all' | 'specific';
    ids: string[];
  };
  actions: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    file: boolean;
  };
}
```

---

## 🎨 FASE 2: COMPONENTES UI SIMPLIFICADOS

### Objetivo

Crear los componentes UI que el usuario final verá y usará.

### Tareas

#### 2.1 Crear Componentes Compartidos

**2.1.1 RoleSelector**

**Archivo:** `app/core/presentation/shared/components/admin/RoleSelector.vue`

**Props:**
```typescript
{
  modelValue: 'Administrador' | 'Editor' | 'Lector',
  disabled?: boolean,
}
```

**Emits:**
```typescript
{
  'update:modelValue': (role: SimpleRole) => void,
}
```

**UI:**
- Radio buttons o tabs
- Descripción de cada rol
- Iconos visuales

**Decisiones:**
- Usar shadcn-vue RadioGroup
- Estilos consistentes con el proyecto

**2.1.2 ModuleSelector**

**Archivo:** `app/core/presentation/shared/components/admin/ModuleSelector.vue`

**Props:**
```typescript
{
  modelValue: string[], // IDs de áreas seleccionadas
  mode: 'simple' | 'advanced',
  disabled?: boolean,
}
```

**UI Simple:**
- Checkboxes por área (REGISTROS, OPERACIONES, etc.)
- Botón "Configuración Avanzada" (opcional)

**UI Avanzada:**
- Árbol expandible: Área → Ruta → Módulo
- Checkboxes anidados

**Decisiones:**
- Usar shadcn-vue Checkbox
- Componente separado para vista avanzada

**2.1.3 SocietySelector**

**Archivo:** `app/core/presentation/shared/components/admin/SocietySelector.vue`

**Props:**
```typescript
{
  modelValue: {
    mode: 'all' | 'specific',
    ids: string[],
  },
  societies: Society[],
  disabled?: boolean,
}
```

**UI:**
- Radio: "Todas las sociedades" / "Solo estas sociedades"
- Si "Solo estas": Lista con búsqueda y checkboxes
- Botón "Agregar más"

**Decisiones:**
- Usar shadcn-vue Combobox para búsqueda
- Mostrar RUC y nombre de sociedad

**2.1.4 ActionSelector**

**Archivo:** `app/core/presentation/shared/components/admin/ActionSelector.vue`

**Props:**
```typescript
{
  modelValue: {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    file: boolean;
  },
  role: 'Administrador' | 'Editor' | 'Lector',
  disabled?: boolean,
}
```

**UI:**
- Checkboxes para cada acción
- Si rol es "Lector": Solo "Ver" habilitado (disabled)
- Iconos para cada acción

**Decisiones:**
- Usar shadcn-vue Checkbox
- Deshabilitar automáticamente si es Lector

#### 2.2 Crear Organismos (Componentes Grandes)

**2.2.1 PermisosSimpleForm**

**Archivo:** `app/core/presentation/panel-administrativo/vistas/configurar-permisos/components/organisms/PermisosSimpleForm.vue`

**Responsabilidades:**
- Orquestar los selectores simples
- Mostrar flujo paso a paso
- Validar configuración

**Estructura:**
```vue
<template>
  <div class="space-y-6">
    <!-- Paso 1: Rol -->
    <RoleSelector v-model="config.role" />
    
    <!-- Paso 2: Módulos (si no es Admin) -->
    <ModuleSelector
      v-if="config.role !== 'Administrador'"
      v-model="config.modules"
      mode="simple"
    />
    
    <!-- Paso 3: Sociedades (si no es Admin) -->
    <SocietySelector
      v-if="config.role !== 'Administrador'"
      v-model="config.societies"
      :societies="societies"
    />
    
    <!-- Paso 4: Acciones (solo Editor) -->
    <ActionSelector
      v-if="config.role === 'Editor'"
      v-model="config.actions"
      role="Editor"
    />
  </div>
</template>
```

**2.2.2 PermisosAdvancedForm**

**Archivo:** `app/core/presentation/panel-administrativo/vistas/configurar-permisos/components/organisms/PermisosAdvancedForm.vue`

**Responsabilidades:**
- Mostrar configuración granular completa
- Permitir edición manual de overrides
- Solo para casos especiales

**2.2.3 PermisosSummary**

**Archivo:** `app/core/presentation/panel-administrativo/vistas/configurar-permisos/components/organisms/PermisosSummary.vue`

**Responsabilidades:**
- Mostrar resumen de configuración antes de guardar
- Lista de permisos que se aplicarán
- Confirmación visual

#### 2.3 Crear Manager Principal

**2.3.1 ConfigurarPermisosManager**

**Archivo:** `app/core/presentation/panel-administrativo/vistas/configurar-permisos/components/ConfigurarPermisosManager.vue`

**Responsabilidades:**
- Orquestar toda la vista de configuración
- Manejar tabs (Simple/Advanced)
- Gestionar guardado

**Estructura:**
```vue
<template>
  <div class="min-h-full bg-gray-50">
    <VistaHeader
      title="Configurar Permisos"
      :description="`Usuario: ${user.email}`"
    >
      <template #right>
        <ActionButton @click="handleSave">Guardar</ActionButton>
      </template>
    </VistaHeader>
    
    <div class="vista-container">
      <Tabs v-model="activeTab">
        <Tab value="simple">
          <PermisosSimpleForm
            v-model="simpleConfig"
            :societies="societies"
          />
        </Tab>
        <Tab value="advanced">
          <PermisosAdvancedForm
            v-model="advancedConfig"
          />
        </Tab>
      </Tabs>
      
      <PermisosSummary
        v-if="showSummary"
        :config="simpleConfig"
        @confirm="handleConfirmSave"
        @cancel="showSummary = false"
      />
    </div>
  </div>
</template>
```

---

## 🔄 FASE 3: MAPERS Y LÓGICA DE TRANSFORMACIÓN

### Objetivo

Crear mappers que conviertan la configuración simple de la UI a overrides del backend.

### Tareas

#### 3.1 Crear SimpleConfigToOverridesMapper

**Archivo:** `app/core/hexag/permissions/application/mappers/simple-config-to-overrides.mapper.ts`

**Responsabilidades:**
- Convertir `SimplePermissionsConfig` → `UpsertUserOverrideDto`
- Aplicar lógica de mapeo según el rol
- Generar overrides correctos

**Lógica:**

**Si rol es "Administrador":**
```typescript
// No generar overrides, usar rol base
return null;
```

**Si rol es "Editor":**
```typescript
// 1. Si módulos limitados → Generar overrides por área
if (config.modules.some(m => !m.enabled)) {
  overrides.push({
    area: 'REGISTROS',
    status: false, // Si está deshabilitado
  });
}

// 2. Si sociedades limitadas → Asignar sociedades
if (config.societies.mode === 'specific') {
  // Asignar sociedades (se hace en otro endpoint)
}

// 3. Si acciones limitadas → Generar overrides por acción
if (!config.actions.delete) {
  // Quitar permiso delete en todos los módulos
}
```

**Si rol es "Lector":**
```typescript
// Similar a Editor, pero solo acción "view"
// Quitar todas las demás acciones
```

**Ejemplo Completo:**

```typescript
export function mapSimpleConfigToOverrides(
  config: SimplePermissionsConfig,
  userRoleId: string
): UpsertUserOverrideDto | null {
  // Si es Administrador, no hay overrides
  if (config.role === 'Administrador') {
    return null;
  }
  
  const overrides: UserOverride[] = [];
  
  // Mapear módulos deshabilitados
  config.modules.forEach(module => {
    if (!module.enabled) {
      overrides.push({
        area: module.area,
        status: false,
      });
    }
  });
  
  // Mapear acciones deshabilitadas
  if (config.role === 'Editor') {
    if (!config.actions.delete) {
      // Quitar delete en todos los módulos
      // ... lógica compleja
    }
  }
  
  return {
    overrides,
  };
}
```

#### 3.2 Crear OverridesToSimpleConfigMapper

**Archivo:** `app/core/hexag/permissions/application/mappers/overrides-to-simple-config.mapper.ts`

**Responsabilidades:**
- Convertir `UserAccessFull` (backend) → `SimplePermissionsConfig`
- Cargar configuración existente para editar

**Lógica:**
- Analizar overrides del usuario
- Determinar qué módulos están habilitados/deshabilitados
- Determinar qué acciones están permitidas
- Inferir configuración simple

#### 3.3 Crear Use Case: ApplySimplePermissions

**Archivo:** `app/core/hexag/permissions/application/use-cases/apply-simple-permissions.use-case.ts`

**Responsabilidades:**
- Orquestar la aplicación de permisos simples
- Llamar al mapper
- Llamar a los repositorios necesarios
- Manejar errores

**Flujo:**
```typescript
1. Validar configuración
2. Convertir a overrides (mapper)
3. Si hay overrides → Actualizar overrides del usuario
4. Si hay sociedades → Asignar sociedades
5. Si hay cambio de rol → Actualizar rol
6. Retornar resultado
```

---

## 🔌 FASE 4: INTEGRACIÓN CON BACKEND

### Objetivo

Conectar todos los componentes con el backend real.

### Tareas

#### 4.1 Actualizar UserManagementStore

**Archivo:** `app/core/presentation/panel-administrativo/stores/user-management.store.ts`

**Cambios:**
- Reemplazar `UserMockRepository` por `UserHttpRepository`
- Agregar métodos para crear, eliminar, activar/desactivar
- Manejar estados de carga y errores

#### 4.2 Actualizar PermissionsConfigStore

**Archivo:** `app/core/presentation/panel-administrativo/stores/permissions-config.store.ts`

**Cambios:**
- Integrar con `ApplySimplePermissionsUseCase`
- Cargar configuración existente desde backend
- Guardar configuración en backend

#### 4.3 Crear Composable: useConfigurarPermisos

**Archivo:** `app/core/presentation/panel-administrativo/vistas/configurar-permisos/composables/useConfigurarPermisos.ts`

**Responsabilidades:**
- Orquestar la lógica de la vista
- Conectar stores con componentes
- Manejar flujo de guardado

**Estructura:**
```typescript
export function useConfigurarPermisos(userId: string) {
  const permissionsStore = usePermissionsConfigStore();
  const societiesStore = useSocietiesStore();
  const applyPermissionsUseCase = new ApplySimplePermissionsUseCase(...);
  
  // Cargar datos iniciales
  const loadData = async () => {
    await Promise.all([
      permissionsStore.loadFromUser(userId),
      societiesStore.loadSocieties(),
    ]);
  };
  
  // Guardar configuración
  const save = async (config: SimplePermissionsConfig) => {
    await applyPermissionsUseCase.execute(userId, config);
  };
  
  return {
    loadData,
    save,
    // ... más métodos
  };
}
```

#### 4.4 Actualizar Rutas

**Archivo:** `app/pages/admin/usuarios/[id]/permisos.vue`

**Estructura:**
```vue
<script setup lang="ts">
const route = useRoute();
const userId = route.params.id as string;

const { loadData, save, config } = useConfigurarPermisos(userId);

onMounted(() => {
  loadData();
});
</script>

<template>
  <ConfigurarPermisosManager
    :user-id="userId"
    @save="save"
  />
</template>
```

---

## 🎯 FASE 5: VISTA AVANZADA (OPCIONAL)

### Objetivo

Implementar vista avanzada para casos especiales.

### Tareas

#### 5.1 Crear PermisosAdvancedForm

**Archivo:** `app/core/presentation/panel-administrativo/vistas/configurar-permisos/components/organisms/PermisosAdvancedForm.vue`

**Responsabilidades:**
- Mostrar árbol completo de permisos
- Permitir edición granular
- Mostrar overrides existentes

**UI:**
- Árbol expandible: Área → Ruta → Módulo → Acción
- Checkboxes en cada nivel
- Indicadores visuales de overrides

#### 5.2 Integrar con Backend

- Usar `getUserAccessFull` para cargar permisos completos
- Usar `updateUserOverrides` para guardar cambios granulares

---

## 📁 ESTRUCTURA DE ARCHIVOS COMPLETA

```
app/
├── core/
│   ├── hexag/
│   │   ├── permissions/                    # ✅ Ya existe
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   │   ├── mappers/                # ⭐ NUEVO
│   │   │   │   │   ├── simple-config-to-overrides.mapper.ts
│   │   │   │   │   └── overrides-to-simple-config.mapper.ts
│   │   │   │   └── use-cases/              # ⭐ NUEVO
│   │   │   │       └── apply-simple-permissions.use-case.ts
│   │   │   └── infrastructure/
│   │   │
│   │   └── panel-administrativo/
│   │       ├── domain/
│   │       ├── application/
│   │       └── infrastructure/
│   │           └── repositories/
│   │               ├── user-http.repository.ts        # ⭐ NUEVO
│   │               └── societies-http.repository.ts  # ⭐ NUEVO
│   │
│   └── presentation/
│       ├── panel-administrativo/
│       │   ├── stores/
│       │   │   ├── user-management.store.ts          # ⚠️ ACTUALIZAR
│       │   │   ├── permissions-config.store.ts        # ⭐ NUEVO
│       │   │   └── societies.store.ts                 # ⭐ NUEVO
│       │   │
│       │   └── vistas/
│       │       ├── gestion-usuarios/                  # ⭐ NUEVO
│       │       │   ├── components/
│       │       │   │   ├── GestionUsuariosManager.vue
│       │       │   │   ├── organisms/
│       │       │   │   │   ├── UsuariosTable.vue
│       │       │   │   │   ├── UsuariosHeader.vue
│       │       │   │   │   └── UsuariosStats.vue
│       │       │   │   └── molecules/
│       │       │   │       ├── UsuarioCard.vue
│       │       │   │       ├── UsuarioRow.vue
│       │       │   │       └── RoleBadge.vue
│       │       │   ├── composables/
│       │       │   │   └── useGestionUsuarios.ts
│       │       │   └── types/
│       │       │       └── gestion-usuarios.types.ts
│       │       │
│       │       └── configurar-permisos/                # ⭐ NUEVO
│       │           ├── components/
│       │           │   ├── ConfigurarPermisosManager.vue
│       │           │   ├── organisms/
│       │           │   │   ├── PermisosSimpleForm.vue
│       │           │   │   ├── PermisosAdvancedForm.vue
│       │           │   │   └── PermisosSummary.vue
│       │           │   └── molecules/
│       │           │       └── (componentes pequeños si es necesario)
│       │           ├── composables/
│       │           │   └── useConfigurarPermisos.ts
│       │           └── types/
│       │               └── configurar-permisos.types.ts
│       │
│       └── shared/
│           └── components/
│               └── admin/                              # ⭐ NUEVO
│                   ├── RoleSelector.vue
│                   ├── ModuleSelector.vue
│                   ├── SocietySelector.vue
│                   └── ActionSelector.vue
│
└── pages/
    └── admin/
        ├── panel.vue                                  # ⚠️ ACTUALIZAR
        └── usuarios/
            ├── index.vue                              # ⭐ NUEVO
            ├── crear.vue                               # ⭐ NUEVO
            └── [id]/
                ├── index.vue                           # ⭐ NUEVO
                └── permisos.vue                        # ⭐ NUEVO
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Infraestructura Base

- [ ] Crear `UserHttpRepository`
  - [ ] Implementar `findAll`
  - [ ] Implementar `findById`
  - [ ] Implementar `create`
  - [ ] Implementar `updateRole`
  - [ ] Implementar `updateStatus`
  - [ ] Implementar `delete`
  - [ ] Implementar `assignSocieties`
  - [ ] Implementar `getAssignedSocieties`
- [ ] Crear `SocietiesHttpRepository`
  - [ ] Implementar `getAllSocieties`
- [ ] Crear `PermissionsConfigStore`
  - [ ] Estado inicial
  - [ ] Acciones básicas
- [ ] Crear `SocietiesStore`
  - [ ] Estado inicial
  - [ ] Acciones básicas
- [ ] Crear tipos TypeScript

### Fase 2: Componentes UI

- [ ] Crear `RoleSelector`
- [ ] Crear `ModuleSelector`
  - [ ] Vista simple
  - [ ] Vista avanzada (opcional)
- [ ] Crear `SocietySelector`
- [ ] Crear `ActionSelector`
- [ ] Crear `PermisosSimpleForm`
- [ ] Crear `PermisosAdvancedForm` (opcional)
- [ ] Crear `PermisosSummary`
- [ ] Crear `ConfigurarPermisosManager`

### Fase 3: Mappers

- [ ] Crear `SimpleConfigToOverridesMapper`
  - [ ] Mapear rol Administrador
  - [ ] Mapear rol Editor
  - [ ] Mapear rol Lector
- [ ] Crear `OverridesToSimpleConfigMapper`
- [ ] Crear `ApplySimplePermissionsUseCase`

### Fase 4: Integración

- [ ] Actualizar `UserManagementStore`
- [ ] Actualizar `PermissionsConfigStore`
- [ ] Crear `useConfigurarPermisos` composable
- [ ] Crear ruta `/admin/usuarios`
- [ ] Crear ruta `/admin/usuarios/crear`
- [ ] Crear ruta `/admin/usuarios/[id]`
- [ ] Crear ruta `/admin/usuarios/[id]/permisos`
- [ ] Actualizar `panel.vue` para usar nueva estructura

### Fase 5: Vista Avanzada (Opcional)

- [ ] Implementar `PermisosAdvancedForm`
- [ ] Integrar con backend para vista avanzada
- [ ] Agregar toggle entre simple/avanzado

### Testing y Validación

- [ ] Probar creación de usuario
- [ ] Probar asignación de rol Administrador
- [ ] Probar asignación de rol Editor con limitaciones
- [ ] Probar asignación de rol Lector
- [ ] Probar limitación por módulos
- [ ] Probar limitación por sociedades
- [ ] Probar limitación por acciones
- [ ] Probar combinaciones complejas
- [ ] Validar que los mappers funcionan correctamente
- [ ] Validar integración con backend

---

## 🎯 DECISIONES FINALES

### 1. Orden de Implementación

**Recomendación:** Implementar por fases en orden:
1. Fase 1 (Infraestructura) → Base sólida
2. Fase 2 (Componentes) → UI visible
3. Fase 3 (Mappers) → Lógica de transformación
4. Fase 4 (Integración) → Conectar todo
5. Fase 5 (Avanzado) → Opcional, después

### 2. Testing

**Recomendación:** Probar cada fase antes de continuar a la siguiente.

### 3. Documentación

**Recomendación:** Documentar cada componente y mapper con JSDoc.

---

**Última actualización:** Diciembre 2024


