# 📋 README: Sistema de Permisos y Roles - Probo V3

**Fecha:** Diciembre 2024  
**Estado:** ✅ IMPLEMENTADO  
**Versión:** 1.0.0

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Rutas Configurables](#rutas-configurables)
4. [Estructura de Archivos](#estructura-de-archivos)
5. [Guía de Uso](#guía-de-uso)
6. [API y Endpoints](#api-y-endpoints)
7. [Ejemplos de Código](#ejemplos-de-código)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 RESUMEN EJECUTIVO

### ¿Qué es este sistema?

Sistema completo de gestión de permisos que permite:

1. **Crear usuarios** con roles base (admin, user, lector, editor)
2. **Asignar usuarios a sociedades** con permisos específicos
3. **Gestionar accesos a rutas** de forma granular
4. **Visualizar y editar** todo desde un panel administrativo centralizado

### Conceptos Clave

- **Roles**: Permisos de usuario (qué puede hacer)

  - `lector` - Solo lectura
  - `editor` - Puede editar
  - `admin` - Administrador completo
  - `user` - Usuario normal

- **Permisos**: Acceso a rutas específicas (dónde puede ir)

  - Lista de rutas con checkboxes
  - Control granular de acceso

- **Sociedades**: Asignación de usuarios a sociedades
  - **LECTOR**: Solo puede estar asignado a UNA sociedad (selector)
  - **NO-LECTOR**: Puede estar asignado a MÚLTIPLES sociedades (checkboxes)

---

## 🏗️ ARQUITECTURA DEL SISTEMA

### Arquitectura Hexagonal

```
Domain (Entidades puras)
  ↑
Application (Casos de uso + DTOs)
  ↑
Infrastructure (Repositorios + Mappers)
  ↑
Presentation (Stores + Composables + Componentes)
```

### Flujo de Datos

```
Usuario → Componente Vue → Composable → Store → Caso de Uso → Repository → Backend
```

---

## 🗺️ RUTAS CONFIGURABLES

### Rutas Disponibles para Administrar

El sistema permite administrar acceso a las siguientes rutas organizadas por módulo:

#### 📁 REGISTROS

| Ruta                              | Descripción                    |
| --------------------------------- | ------------------------------ |
| `/registros/sociedades`           | Acceso al módulo de sociedades |
| `/registros/sociedades/dashboard` | Dashboard de sociedades        |
| `/registros/sociedades/historial` | Historial de sociedades        |
| `/registros/sociedades/crear`     | Crear nueva sociedad           |

#### 📁 OPERACIONES

| Ruta                                       | Descripción         |
| ------------------------------------------ | ------------------- |
| `/operaciones/junta-accionistas/dashboard` | Dashboard de juntas |
| `/operaciones/junta-accionistas/historial` | Historial de juntas |
| `/operaciones/junta-accionistas/crear`     | Crear nueva junta   |

#### 📁 REPOSITORIO AI

| Ruta                                      | Descripción               |
| ----------------------------------------- | ------------------------- |
| `/repositorio-ai/carpetas-personalizadas` | Carpetas personalizadas   |
| `/repositorio-ai/documentos-societarios`  | Documentos societarios    |
| `/repositorio-ai/archivos-generados`      | Archivos generados        |
| `/repositorio-ai/dashboard`               | Dashboard del repositorio |
| `/repositorio-ai/chat-ia`                 | Chat con IA               |

### Archivo de Configuración

Todas las rutas están definidas en:

```
app/config/routes/permissions-map.ts
```

**Estructura del archivo:**

```typescript
export const ROUTES_PERMISSIONS_MAP: Record<RouteModule, RoutePermissionConfig[]> = {
  REGISTROS: [
    {
      route: "/registros/sociedades",
      module: "REGISTROS",
      displayName: "Sociedades",
      description: "Acceso al módulo de sociedades",
    },
    // ... más rutas
  ],
  OPERACIONES: [
    /* ... */
  ],
  REPOSITORIO_AI: [
    /* ... */
  ],
};
```

### Agregar Nuevas Rutas

Para agregar una nueva ruta al sistema:

1. **Editar `app/config/routes/permissions-map.ts`**
2. **Agregar la ruta al módulo correspondiente:**

```typescript
REGISTROS: [
  // ... rutas existentes
  {
    route: '/registros/nueva-ruta',
    module: 'REGISTROS',
    displayName: 'Nueva Ruta',
    description: 'Descripción de la nueva ruta',
  },
],
```

3. **La ruta aparecerá automáticamente en el editor de permisos**

---

## 📂 ESTRUCTURA DE ARCHIVOS

### Domain Layer

```
app/core/hexag/panel-administrativo/domain/
├── entities/
│   ├── user.entity.ts                    # Entidad User (expandida)
│   ├── role.entity.ts                   # Entidad Role
│   ├── permission.entity.ts             # Permisos por flujo/módulo
│   ├── route-permission.entity.ts       # Permisos por ruta (NUEVO)
│   └── society-assignment.entity.ts     # Asignación de sociedades (NUEVO)
└── ports/
    └── user.repository.ts               # Contrato del repositorio (expandido)
```

### Application Layer

```
app/core/hexag/panel-administrativo/application/
├── dtos/
│   ├── user.dto.ts                      # DTOs de usuario (expandido)
│   ├── route-permission.dto.ts          # DTOs de permisos de rutas (NUEVO)
│   └── society-assignment.dto.ts        # DTOs de asignación de sociedades (NUEVO)
└── use-cases/
    ├── get-users.use-case.ts            # Obtener usuarios
    ├── get-user-permissions.use-case.ts # Obtener permisos por flujo
    ├── update-user-permissions.use-case.ts
    ├── get-user-route-permissions.use-case.ts      # NUEVO
    ├── update-user-route-permissions.use-case.ts   # NUEVO
    ├── assign-user-to-societies.use-case.ts        # NUEVO
    ├── update-user-role.use-case.ts                # NUEVO
    └── get-all-societies.use-case.ts               # NUEVO
```

### Infrastructure Layer

```
app/core/hexag/panel-administrativo/infrastructure/
├── repositories/
│   └── user-mock.repository.ts          # Repositorio Mock (expandido)
└── mappers/
    └── user.mapper.ts                   # Mapper DTO ↔ Entidad (corregido)
```

### Presentation Layer

```
app/core/presentation/panel-administrativo/
├── stores/
│   └── user-management.store.ts         # Store Pinia (Option API) (expandido)
└── composables/
    ├── useUserManagement.ts             # Controller principal
    ├── usePermissionsEditor.ts          # NUEVO - Editor de permisos
    ├── useUserRole.ts                   # NUEVO - Gestión de rol
    ├── useRoutePermissions.ts           # NUEVO - Permisos de rutas
    └── useSocietyAssignment.ts         # NUEVO - Asignación de sociedades
```

### Components

```
app/components/admin/
├── UserManagementView.vue               # Vista principal (actualizado)
├── UserAssignmentModal.vue              # Modal de asignación
└── permissions/                          # NUEVO - Componentes de permisos
    ├── PermissionsEditor.vue           # Wrapper principal (auto-gestionado)
    ├── PermissionsEditorTabs.vue       # Componente presentacional de tabs
    ├── UserRoleSelector.vue            # Selector de rol (presentacional)
    ├── RoutePermissionsList.vue         # Lista de rutas (presentacional)
    ├── SocietyAssignmentList.vue       # Lista de sociedades (presentacional)
    └── tabs/
        ├── UserRoleTab.vue             # Tab de rol (wrapper auto-gestionado)
        ├── RoutePermissionsTab.vue     # Tab de rutas (wrapper auto-gestionado)
        └── SocietyAssignmentTab.vue    # Tab de sociedades (wrapper auto-gestionado)
```

### Config

```
app/config/routes/
└── permissions-map.ts                   # NUEVO - Mapeo de rutas
```

---

## 📖 GUÍA DE USO

### Para Administradores

#### 1. Acceder al Panel Administrativo

```
/panel-administrativo
```

#### 2. Ver Usuarios

- Lista de usuarios con filtros por rol
- Búsqueda por email
- Vista de tabla o cards

#### 3. Configurar Permisos de un Usuario

1. **Click en el botón de configuración** (⚙️) del usuario
2. **Se abre el modal con 3 tabs:**

   **Tab 1: Permisos del Usuario**

   - Seleccionar rol: lector, editor, admin, user
   - Los cambios se guardan automáticamente

   **Tab 2: Rutas**

   - Ver rutas organizadas por módulo (Registros, Operaciones, Repositorio AI)
   - Marcar/desmarcar rutas con checkboxes
   - Botones "Seleccionar todas" y "Deseleccionar todas"
   - Botón "Seleccionar todas" por módulo

   **Tab 3: Sociedades**

   - **Si el usuario es LECTOR:**
     - Selector dropdown (solo puede seleccionar UNA sociedad)
   - **Si el usuario NO es LECTOR:**
     - Checkboxes (puede seleccionar MÚLTIPLES sociedades)

3. **Click en "Guardar Cambios"**

### Para Desarrolladores

#### Usar el Store

```typescript
import { useUserManagementStore } from "~/core/presentation/panel-administrativo/stores/user-management.store";

const store = useUserManagementStore();

// Cargar usuarios
await store.loadUsers();

// Seleccionar usuario
store.selectUser(user);

// Cargar permisos de rutas
await store.loadUserRoutePermissions(userId);

// Actualizar permisos de rutas
await store.updateUserRoutePermissions(userId, ["/registros/sociedades/historial"]);

// Asignar sociedades
await store.assignUserToSocieties(userId, ["society-1", "society-2"]);

// Actualizar rol
await store.updateUserRole(userId, "admin");
```

#### Usar Composables

```typescript
import { useRoutePermissions } from "~/core/presentation/panel-administrativo/composables/useRoutePermissions";

const { selectedRoutes, routesByModule, toggleRoute, selectAllRoutes, saveRoutePermissions } =
  useRoutePermissions(user);

// Toggle una ruta
toggleRoute("/registros/sociedades/historial");

// Seleccionar todas las rutas
selectAllRoutes();

// Guardar cambios
await saveRoutePermissions();
```

#### Obtener Rutas Configuradas

```typescript
import {
  getAllRoutes,
  getRoutesByModule,
  MODULE_DISPLAY_NAMES,
} from "~/config/routes/permissions-map";

// Todas las rutas
const allRoutes = getAllRoutes();

// Rutas por módulo
const registrosRoutes = getRoutesByModule("REGISTROS");

// Nombre del módulo
const moduleName = MODULE_DISPLAY_NAMES["REGISTROS"]; // "Registros"
```

---

## 🔌 API Y ENDPOINTS

### Endpoints Necesarios (Backend)

#### 1. Obtener Usuario Completo

```
GET /api/v2/users/me
Headers: { Authorization: Bearer <token> }
Response: {
  id: string;
  email: string;
  name: string;
  role: "lector" | "editor" | "admin" | "user";
  routePermissions: string[];
  assignedSocieties: string[];
}
```

#### 2. Obtener Permisos de Rutas

```
GET /api/v2/users/:userId/route-permissions
Response: {
  routePermissions: string[];
}
```

#### 3. Actualizar Permisos de Rutas

```
PUT /api/v2/users/:userId/route-permissions
Body: {
  routePermissions: string[];
}
Response: {
  routePermissions: string[];
}
```

#### 4. Obtener Sociedades Asignadas

```
GET /api/v2/users/:userId/societies
Response: {
  assignedSocieties: string[];
  societies: SocietyInfo[];
}
```

#### 5. Asignar Usuario a Sociedades

```
PUT /api/v2/users/:userId/societies
Body: {
  societyIds: string[];
}
Response: {
  assignedSocieties: string[];
}
```

#### 6. Actualizar Rol de Usuario

```
PATCH /api/v2/users/:userId/role
Body: {
  role: "lector" | "editor" | "admin" | "user";
}
Response: {
  user: User;
}
```

#### 7. Obtener Todas las Sociedades

```
GET /api/v2/societies
Response: {
  societies: SocietyInfo[];
}
```

### Estructura de Datos

#### User Entity

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  roleId: string;
  studyId: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
  study: Study;
  routePermissions: string[]; // NUEVO
  assignedSocieties: string[]; // NUEVO
}
```

#### SocietyInfo

```typescript
interface SocietyInfo {
  id: string;
  name: string;
  ruc?: string;
  status: boolean;
}
```

---

## 💻 EJEMPLOS DE CÓDIGO

### Ejemplo 1: Verificar Acceso a una Ruta

```typescript
import { useUserManagementStore } from "~/core/presentation/panel-administrativo/stores/user-management.store";

const store = useUserManagementStore();
const user = store.selectedUser;

// Verificar si el usuario tiene acceso a una ruta
const hasAccess = user?.routePermissions.includes("/registros/sociedades/historial");

if (hasAccess) {
  // Permitir acceso
} else {
  // Redirigir o mostrar error
}
```

### Ejemplo 2: Crear Componente que Verifica Permisos

```vue
<script setup lang="ts">
  import { computed } from "vue";
  import { useUserManagementStore } from "~/core/presentation/panel-administrativo/stores/user-management.store";

  const store = useUserManagementStore();
  const route = "/registros/sociedades/historial";

  const hasAccess = computed(() => {
    const user = store.selectedUser;
    return user?.routePermissions.includes(route) ?? false;
  });
</script>

<template>
  <div v-if="hasAccess">
    <!-- Contenido protegido -->
  </div>
  <div v-else>
    <p>No tienes acceso a esta sección</p>
  </div>
</template>
```

### Ejemplo 3: Middleware de Rutas (Futuro)

```typescript
// app/middleware/check-permissions.ts
import { useUserManagementStore } from "~/core/presentation/panel-administrativo/stores/user-management.store";

export default defineNuxtRouteMiddleware((to) => {
  const store = useUserManagementStore();
  const user = store.selectedUser;

  if (!user) {
    return navigateTo("/login");
  }

  const hasAccess = user.routePermissions.includes(to.path);

  if (!hasAccess) {
    return navigateTo("/unauthorized");
  }
});
```

---

## 🔧 TROUBLESHOOTING

### Problema: Las rutas no aparecen en el editor

**Solución:**

1. Verificar que `app/config/routes/permissions-map.ts` tenga las rutas definidas
2. Verificar que el módulo esté incluido en `ROUTES_PERMISSIONS_MAP`
3. Recargar la página

### Problema: Los cambios no se guardan

**Solución:**

1. Verificar que el store esté conectado correctamente
2. Verificar la consola del navegador por errores
3. Verificar que el repositorio mock esté funcionando

### Problema: Usuario LECTOR puede seleccionar múltiples sociedades

**Solución:**

1. Verificar que `useSocietyAssignment.ts` detecte correctamente si es LECTOR
2. Verificar que el componente `SocietyAssignmentList.vue` use `isLector` correctamente

### Problema: Error al cargar sociedades

**Solución:**

1. Verificar que `store.loadAllSocieties()` se llame antes de mostrar el tab
2. Verificar que el mock repository tenga sociedades definidas
3. Verificar la consola por errores de red (si usa HTTP)

---

## 📝 NOTAS IMPORTANTES

### Mock vs Real Backend

**Actualmente:** El sistema usa `UserMockRepository` con datos de prueba.

**Para conectar con backend real:**

1. Crear `UserHttpRepository` que implemente `UserRepository`
2. Reemplazar en el store:

```typescript
// Antes
const repository = new UserMockRepository();

// Después
const repository = new UserHttpRepository();
```

### Validaciones

- **LECTOR solo puede tener UNA sociedad**: Validado en `AssignUserToSocietiesUseCase`
- **Rutas deben existir en el mapeo**: Validado en `useRoutePermissions`

### Performance

- Los permisos se cargan bajo demanda (solo cuando se abre el editor)
- Las sociedades se cargan una vez y se cachean en el store
- Considerar agregar cache en localStorage para mejor performance

---

## 🚀 PRÓXIMOS PASOS

### Mejoras Sugeridas

1. **Middleware de Rutas**

   - Crear middleware que verifique permisos antes de navegar
   - Redirigir a página de "No autorizado" si no tiene acceso

2. **Cache de Permisos**

   - Guardar permisos en localStorage
   - Sincronizar con backend periódicamente

3. **Notificaciones**

   - Agregar toasts de éxito/error
   - Confirmaciones antes de guardar cambios importantes

4. **Testing**

   - Unit tests para casos de uso
   - Integration tests para componentes
   - E2E tests para flujos completos

5. **Documentación de Usuario**
   - Guía visual para administradores
   - Videos tutoriales

---

## 📞 CONTACTO Y SOPORTE

Para dudas o problemas:

1. Revisar este README
2. Revisar `ESPECIFICACION-FINAL-SISTEMA-PERMISOS.md`
3. Revisar código fuente en `app/core/hexag/panel-administrativo/`

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0.0  
**Estado:** ✅ IMPLEMENTADO Y FUNCIONAL
