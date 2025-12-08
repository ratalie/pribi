# 🎯 PLAN COMPLETO: SISTEMA DE PERMISOS Y ROLES - PROBO V3

**Fecha:** Diciembre 2024  
**Estado:** 📋 PLANIFICACIÓN  
**Objetivo:** Definir la arquitectura completa del sistema de permisos y roles

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Análisis del Estado Actual](#análisis-del-estado-actual)
3. [Mapeo Completo de Rutas](#mapeo-completo-de-rutas)
4. [Arquitectura del Sistema de Permisos](#arquitectura-del-sistema-de-permisos)
5. [Estructura de Datos](#estructura-de-datos)
6. [Flujos de Usuario](#flujos-de-usuario)
7. [Vista de Panel Administrativo](#vista-de-panel-administrativo)
8. [Integración con Carpetas Personalizadas](#integración-con-carpetas-personalizadas)
9. [Guía de Implementación Backend](#guía-de-implementación-backend)
10. [Próximos Pasos](#próximos-pasos)

---

## 🎯 RESUMEN EJECUTIVO

### ¿Qué Necesitamos Construir?

Un sistema completo de gestión de permisos que permita:

1. **Crear usuarios** con roles base (admin, user, lector)
2. **Asignar usuarios a sociedades** con permisos específicos por sociedad
3. **Gestionar accesos a rutas** de forma granular (leer, escribir, crear, etc.)
4. **Gestionar accesos a carpetas personalizadas** del repositorio
5. **Visualizar y editar** todo desde un panel administrativo centralizado

### Conceptos Clave

- **Roles Globales**: Admin, User, Lector (definen permisos base)
- **Permisos por Sociedad**: Cada usuario puede tener diferentes permisos en diferentes sociedades
- **Permisos por Ruta**: Control granular de acceso a cada ruta de la aplicación
- **Permisos por Carpeta**: Control de acceso a carpetas personalizadas del repositorio

---

## 📊 ANÁLISIS DEL ESTADO ACTUAL

### ✅ Lo que Ya Tenemos

1. **Panel Administrativo Básico** (`UserManagementView.vue`)
   - Vista de usuarios con tabla/cards
   - Editor de permisos (`PermissionsEditor.vue`)
   - Asignación de usuarios a sociedades (`UserAssignmentModal.vue`)
   - Sistema de roles (Admin, User, Lector, Externo)

2. **Sistema de Carpetas Personalizadas**
   - Gestión de accesos por carpeta
   - Permisos granulares (read, write, delete, download, comment)

3. **Arquitectura Hexagonal**
   - Domain, Application, Infrastructure listos
   - Stores con Option API
   - Controllers/composables

### ⚠️ Lo que Falta

1. **Mapeo completo de rutas** a permisos
2. **Sistema de permisos por ruta** (no solo por módulo/flujo)
3. **Vista visual** para gestionar permisos por ruta con checkboxes
4. **Integración** entre permisos de rutas y permisos de carpetas
5. **Sistema de permisos por sociedad** (actualmente solo por usuario global)

---

## 🗺️ MAPEO COMPLETO DE RUTAS

### Estructura de Rutas de la Aplicación

#### 1️⃣ REGISTROS - SOCIEDADES

```
/registros/sociedades/
├── historial                    # Listado de sociedades
├── dashboard                     # Dashboard de sociedades
├── crear                         # Crear nueva sociedad
├── datos-principales            # Paso 1: Datos principales
├── accionistas                  # Paso 2: Accionistas
├── acciones                     # Paso 3: Acciones
├── asignacion-acciones         # Paso 4: Asignación
├── directorio                  # Paso 5: Directorio
├── apoderados                  # Paso 6: Apoderados
├── estatutos                   # Paso 7: Estatutos
└── quorum                      # Paso 8: Quorum
```

**Rutas principales para permisos:**
- `/registros/sociedades/historial` → Ver sociedades
- `/registros/sociedades/dashboard` → Dashboard de sociedades
- `/registros/sociedades/crear` → Crear sociedad
- `/registros/sociedades/*` → Acceso a pasos del flujo

#### 2️⃣ OPERACIONES - JUNTAS DE ACCIONISTAS

```
/operaciones/sociedades/[societyId]/junta-accionistas/
├── dashboard                    # Dashboard de juntas
├── crear                        # Crear nueva junta
├── historial                    # Historial de juntas
├── historico                    # Histórico completo
├── accionistas                  # Gestión de accionistas
└── [flowId]/                    # Flujo de junta específica
    ├── seleccion-agenda
    ├── instalacion-junta
    ├── puntos-acuerdo
    ├── nombramiento-directorio/
    ├── nombramiento-directores/
    ├── remocion-directores/
    ├── nombramiento-gerente/
    ├── remocion-gerente/
    ├── nombramiento-auditores/
    ├── nombramiento-apoderados/
    ├── reparto-dividendos/
    ├── pronunciamiento-gestion/
    └── resumen/
```

**Rutas principales para permisos:**
- `/operaciones/sociedades/[societyId]/junta-accionistas/dashboard` → Dashboard
- `/operaciones/sociedades/[societyId]/junta-accionistas/historial` → Ver juntas
- `/operaciones/sociedades/[societyId]/junta-accionistas/crear` → Crear junta
- `/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/*` → Acceso a flujo

#### 3️⃣ REPOSITORIO - STORAGE

```
/storage/
├── dashboard                    # Dashboard del repositorio
├── almacen                      # Almacén de documentos
├── documentos-generados         # Documentos generados
├── carpetas-personalizadas      # Carpetas personalizadas
│   └── [id]                     # Detalle de carpeta
└── chat-ia                      # Chat con IA (si aplica)
```

**Rutas principales para permisos:**
- `/storage/dashboard` → Dashboard repositorio
- `/storage/almacen` → Almacén de documentos
- `/storage/documentos-generados` → Documentos generados
- `/storage/carpetas-personalizadas` → Carpetas personalizadas
- `/storage/carpetas-personalizadas/[id]` → Acceso a carpeta específica

#### 4️⃣ FUTURO - SUCURSALES Y DIRECTORIO

```
/registros/sociedades/[societyId]/sucursales/
├── dashboard
├── historial
└── crear

/operaciones/sociedades/[societyId]/directorio/
├── dashboard
├── historial
└── crear
```

---

## 🏗️ ARQUITECTURA DEL SISTEMA DE PERMISOS

### Niveles de Permisos

```
1. ROL GLOBAL (Admin, User, Lector)
   ↓
2. PERMISOS POR SOCIEDAD (específicos por sociedad)
   ↓
3. PERMISOS POR RUTA (acceso a rutas específicas)
   ↓
4. PERMISOS POR CARPETA (acceso a carpetas personalizadas)
```

### Estructura de Permisos

#### 1. Permisos Base (Roles)

```typescript
interface Role {
  id: string;
  name: 'Administrador' | 'Usuario' | 'Lector' | 'Externo';
  defaultPermissions: {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
    file: boolean;
  };
}
```

**Permisos por defecto:**

| Rol | Read | Write | Update | Delete | File |
|-----|------|-------|--------|--------|------|
| **Administrador** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Usuario** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Lector** | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Externo** | ✅ | ❌ | ❌ | ❌ | ❌ |

#### 2. Permisos por Sociedad

```typescript
interface SocietyPermission {
  userId: string;
  societyId: string;
  role: RoleName; // Puede ser diferente al rol global
  routePermissions: RoutePermission[];
  customPermissions?: {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
    file: boolean;
  };
}
```

#### 3. Permisos por Ruta

```typescript
interface RoutePermission {
  route: string; // Ej: "/registros/sociedades/historial"
  routePattern: string; // Ej: "/registros/sociedades/*" para wildcards
  permissions: {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
    file: boolean;
  };
}
```

**Ejemplo de mapeo de rutas:**

```typescript
const ROUTE_PERMISSIONS_MAP = {
  // Registros - Sociedades
  '/registros/sociedades/historial': {
    module: 'SOCIEDADES',
    action: 'read',
    requires: ['read']
  },
  '/registros/sociedades/dashboard': {
    module: 'SOCIEDADES',
    action: 'read',
    requires: ['read']
  },
  '/registros/sociedades/crear': {
    module: 'SOCIEDADES',
    action: 'write',
    requires: ['write']
  },
  '/registros/sociedades/*': {
    module: 'SOCIEDADES',
    action: 'read',
    requires: ['read']
  },
  
  // Operaciones - Juntas
  '/operaciones/sociedades/:societyId/junta-accionistas/dashboard': {
    module: 'JUNTA_ACCIONISTAS',
    action: 'read',
    requires: ['read']
  },
  '/operaciones/sociedades/:societyId/junta-accionistas/historial': {
    module: 'JUNTA_ACCIONISTAS',
    action: 'read',
    requires: ['read']
  },
  '/operaciones/sociedades/:societyId/junta-accionistas/crear': {
    module: 'JUNTA_ACCIONISTAS',
    action: 'write',
    requires: ['write']
  },
  '/operaciones/sociedades/:societyId/junta-accionistas/:flowId/*': {
    module: 'JUNTA_ACCIONISTAS',
    action: 'read',
    requires: ['read']
  },
  
  // Repositorio
  '/storage/dashboard': {
    module: 'REPOSITORIO',
    action: 'read',
    requires: ['read']
  },
  '/storage/almacen': {
    module: 'REPOSITORIO',
    action: 'read',
    requires: ['read']
  },
  '/storage/documentos-generados': {
    module: 'REPOSITORIO',
    action: 'read',
    requires: ['read']
  },
  '/storage/carpetas-personalizadas': {
    module: 'REPOSITORIO',
    action: 'read',
    requires: ['read']
  },
  '/storage/carpetas-personalizadas/:id': {
    module: 'REPOSITORIO',
    action: 'read',
    requires: ['read']
  }
};
```

#### 4. Permisos por Carpeta Personalizada

```typescript
interface FolderPermission {
  userId: string;
  folderId: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    download: boolean;
    comment: boolean;
  };
}
```

---

## 📦 ESTRUCTURA DE DATOS

### Usuario Completo

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  globalRole: RoleName; // Rol base (admin, user, lector)
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Permisos por sociedad
  societyPermissions: SocietyPermission[];
  
  // Permisos por carpeta personalizada
  folderPermissions: FolderPermission[];
}
```

### Permisos por Sociedad

```typescript
interface SocietyPermission {
  id: string;
  userId: string;
  societyId: string;
  societyName: string; // Para mostrar en UI
  
  // Rol específico para esta sociedad (puede diferir del global)
  role: RoleName;
  
  // Permisos personalizados (opcional, si no usa los del rol)
  customPermissions?: {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
    file: boolean;
  };
  
  // Permisos por ruta específicos para esta sociedad
  routePermissions: RoutePermission[];
  
  createdAt: Date;
  updatedAt: Date;
}
```

### Permisos por Ruta

```typescript
interface RoutePermission {
  id: string;
  userId: string;
  societyId?: string; // Opcional, si es permiso global no tiene societyId
  route: string; // Ruta exacta o patrón
  routePattern: string; // Patrón para matching (ej: "/registros/sociedades/*")
  
  permissions: {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
    file: boolean;
  };
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 👤 FLUJOS DE USUARIO

### Flujo 1: Crear Usuario y Asignar Rol Global

```
1. Admin va a Panel Administrativo → Usuarios
2. Click en "Crear Usuario"
3. Ingresa email y nombre
4. Selecciona Rol Global:
   - Administrador (todos los permisos)
   - Usuario (permisos normales, sin delete)
   - Lector (solo lectura)
4. Usuario creado SIN permisos específicos aún
5. Usuario aparece en lista con rol asignado
```

### Flujo 2: Asignar Usuario a Sociedad con Permisos

```
1. Admin selecciona usuario de la lista
2. Click en "Asignar a Sociedad"
3. Modal se abre con:
   - Selector de sociedad (dropdown)
   - Selector de rol para esta sociedad (puede ser diferente al global)
   - Checkboxes de permisos base (read, write, update, delete, file)
4. Admin selecciona sociedad y permisos
5. Click en "Guardar"
6. Usuario ahora tiene acceso a esa sociedad con esos permisos
```

### Flujo 3: Configurar Permisos por Ruta (Granular)

```
1. Admin selecciona usuario
2. Click en "Configurar Permisos" (icono de engranaje)
3. Se abre modal con tabs:
   - Tab 1: "Permisos por Sociedad"
   - Tab 2: "Permisos por Ruta"
   - Tab 3: "Permisos por Carpeta"
   
4. En Tab "Permisos por Ruta":
   - Selector de sociedad (si aplica)
   - Lista expandible de rutas organizadas por módulo:
   
   📁 Registros
   ├── 📄 Sociedades
   │   ├── ☑️ /registros/sociedades/historial (read, write)
   │   ├── ☑️ /registros/sociedades/dashboard (read)
   │   ├── ☑️ /registros/sociedades/crear (write)
   │   └── ☑️ /registros/sociedades/* (read)
   
   📁 Operaciones
   ├── 📄 Juntas de Accionistas
   │   ├── ☑️ /operaciones/sociedades/:societyId/junta-accionistas/dashboard (read)
   │   ├── ☑️ /operaciones/sociedades/:societyId/junta-accionistas/historial (read)
   │   ├── ☑️ /operaciones/sociedades/:societyId/junta-accionistas/crear (write)
   │   └── ☑️ /operaciones/sociedades/:societyId/junta-accionistas/:flowId/* (read)
   
   📁 Repositorio
   ├── ☑️ /storage/dashboard (read)
   ├── ☑️ /storage/almacen (read)
   ├── ☑️ /storage/documentos-generados (read)
   └── ☑️ /storage/carpetas-personalizadas (read, write)
   
5. Cada ruta tiene checkboxes para cada permiso:
   ☑️ Read  ☑️ Write  ☐ Update  ☐ Delete  ☑️ File
   
6. Admin marca/desmarca permisos
7. Click en "Guardar Cambios"
8. Permisos se guardan en backend
```

### Flujo 4: Configurar Acceso a Carpeta Personalizada

```
1. Usuario va a Repositorio → Carpetas Personalizadas
2. Hover sobre carpeta → Aparece botón de 3 puntos
3. Click en "Administrar Accesos"
4. Modal se abre con:
   - Lista de usuarios con acceso actual
   - Búsqueda para agregar nuevos usuarios
   - Para cada usuario, checkboxes de permisos:
     ☑️ Ver  ☑️ Editar  ☐ Eliminar  ☑️ Descargar  ☑️ Comentar
5. Usuario modifica permisos
6. Click en "Guardar"
7. Permisos se guardan (esto ya está implementado)
```

---

## 🎨 VISTA DE PANEL ADMINISTRATIVO

### Estructura Visual Propuesta

```
┌─────────────────────────────────────────────────────────────┐
│  👥 Gestión de Usuarios                                      │
│  Administra usuarios, roles y permisos granulares           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [📊 Estadísticas por Rol]                                  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                       │
│  │Admin │ │User  │ │Lector│ │Extern│                       │
│  │  5   │ │ 12   │ │  3   │ │  2   │                       │
│  └──────┘ └──────┘ └──────┘ └──────┘                       │
│                                                              │
│  [🔍 Búsqueda] [📋 Vista] [➕ Crear Usuario]                │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Email        │ Rol  │ Sociedades │ Estado │ Acciones │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ user@probo   │ User │ 3          │ Activo │ ⚙️ 🗑️    │  │
│  │ admin@probo  │ Admin│ Todas      │ Activo │ ⚙️ 🗑️    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Modal: Configurar Permisos (Expandido)

```
┌─────────────────────────────────────────────────────────────┐
│  ⚙️ Configurar Permisos - user@probo.com                    │
│  Rol Global: Usuario                                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [Permisos por Sociedad] [Permisos por Ruta] [Carpetas]     │
│                                                              │
│  ┌─ Permisos por Ruta ──────────────────────────────────┐   │
│  │                                                       │   │
│  │ Sociedad: [Sociedad ABC ▼]                          │   │
│  │                                                       │   │
│  │ 📁 REGISTROS                                          │   │
│  │   └─ 📄 Sociedades                                    │   │
│  │       ├─ ☑️ /registros/sociedades/historial          │   │
│  │       │     [☑️ Read] [☑️ Write] [☐ Update] [☐ Del]   │   │
│  │       ├─ ☑️ /registros/sociedades/dashboard         │   │
│  │       │     [☑️ Read] [☐ Write] [☐ Update] [☐ Del]   │   │
│  │       ├─ ☑️ /registros/sociedades/crear              │   │
│  │       │     [☐ Read] [☑️ Write] [☐ Update] [☐ Del]   │   │
│  │       └─ ☑️ /registros/sociedades/*                 │   │
│  │             [☑️ Read] [☐ Write] [☐ Update] [☐ Del]   │   │
│  │                                                       │   │
│  │ 📁 OPERACIONES                                        │   │
│  │   └─ 📄 Juntas de Accionistas                        │   │
│  │       ├─ ☑️ /operaciones/.../dashboard               │   │
│  │       ├─ ☑️ /operaciones/.../historial               │   │
│  │       ├─ ☑️ /operaciones/.../crear                  │   │
│  │       └─ ☑️ /operaciones/.../:flowId/*              │   │
│  │                                                       │   │
│  │ 📁 REPOSITORIO                                        │   │
│  │   ├─ ☑️ /storage/dashboard                           │   │
│  │   ├─ ☑️ /storage/almacen                            │   │
│  │   ├─ ☑️ /storage/documentos-generados                │   │
│  │   └─ ☑️ /storage/carpetas-personalizadas             │   │
│  │                                                       │   │
│  │ [Aplicar Permisos del Rol] [Restaurar por Defecto]   │   │
│  │                                                       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  [Cancelar]                                    [Guardar]    │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Necesarios

1. **RoutePermissionsEditor.vue** (NUEVO)
   - Lista expandible de rutas por módulo
   - Checkboxes por permiso (read, write, update, delete, file)
   - Selector de sociedad
   - Botones de acciones rápidas (aplicar rol, restaurar)

2. **SocietyPermissionsTab.vue** (MEJORAR)
   - Lista de sociedades asignadas
   - Permisos por sociedad
   - Asignar/desasignar sociedades

3. **FolderPermissionsTab.vue** (NUEVO)
   - Lista de carpetas con acceso
   - Permisos por carpeta
   - Enlace a gestión de carpetas

---

## 🔗 INTEGRACIÓN CON CARPETAS PERSONALIZADAS

### Relación entre Sistemas

```
Panel Administrativo (Permisos Globales)
    ↓
Permisos por Ruta (/storage/carpetas-personalizadas)
    ↓
Carpetas Personalizadas (Permisos Específicos por Carpeta)
```

### Flujo de Permisos

1. **Usuario tiene acceso a `/storage/carpetas-personalizadas`** (desde Panel Admin)
   - Puede ver la lista de carpetas
   - Puede crear carpetas (si tiene permiso `write`)

2. **Usuario tiene acceso a carpeta específica** (desde gestión de carpeta)
   - Puede ver contenido de la carpeta
   - Puede editar/eliminar según permisos de la carpeta

3. **Permisos de carpeta** son independientes pero respetan permisos globales
   - Si no tiene acceso a `/storage/carpetas-personalizadas`, no puede ver ninguna carpeta
   - Si tiene acceso pero no tiene permisos en una carpeta específica, no puede ver esa carpeta

---

## 🔧 GUÍA DE IMPLEMENTACIÓN BACKEND

### Endpoints Necesarios

#### 1. Usuarios

```typescript
// Crear usuario
POST /api/v1/users
Body: {
  email: string;
  name: string;
  globalRole: RoleName;
}

// Listar usuarios
GET /api/v1/users?role=admin&status=active

// Obtener usuario con permisos
GET /api/v1/users/:userId/permissions

// Actualizar rol global
PATCH /api/v1/users/:userId/role
Body: {
  role: RoleName;
}
```

#### 2. Permisos por Sociedad

```typescript
// Asignar usuario a sociedad
POST /api/v1/societies/:societyId/users/:userId
Body: {
  role: RoleName;
  customPermissions?: {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
    file: boolean;
  };
}

// Desasignar usuario de sociedad
DELETE /api/v1/societies/:societyId/users/:userId

// Obtener permisos de usuario en sociedad
GET /api/v1/societies/:societyId/users/:userId/permissions

// Actualizar permisos en sociedad
PATCH /api/v1/societies/:societyId/users/:userId/permissions
Body: {
  role?: RoleName;
  customPermissions?: {...};
}
```

#### 3. Permisos por Ruta

```typescript
// Obtener permisos de rutas de usuario
GET /api/v1/users/:userId/route-permissions?societyId=123

// Actualizar permisos de rutas
PUT /api/v1/users/:userId/route-permissions
Body: {
  societyId?: string; // Opcional, si es global no se envía
  routePermissions: {
    route: string;
    permissions: {
      read: boolean;
      write: boolean;
      update: boolean;
      delete: boolean;
      file: boolean;
    };
  }[];
}

// Verificar acceso a ruta (para middleware)
GET /api/v1/users/:userId/can-access?route=/registros/sociedades/historial&societyId=123
Response: {
  allowed: boolean;
  permissions: {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
    file: boolean;
  };
}
```

#### 4. Permisos por Carpeta (Ya existe, solo documentar)

```typescript
// Obtener permisos de carpeta
GET /api/v1/folders/:folderId/permissions

// Actualizar permisos de carpeta
PUT /api/v1/folders/:folderId/permissions
Body: {
  userId: string;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
    download: boolean;
    comment: boolean;
  };
}
```

### Estructura de Base de Datos (Sugerencia)

```sql
-- Usuarios
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  name VARCHAR,
  global_role VARCHAR, -- 'Administrador', 'Usuario', 'Lector', 'Externo'
  status BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Permisos por Sociedad
society_permissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  society_id UUID REFERENCES societies(id),
  role VARCHAR,
  custom_read BOOLEAN,
  custom_write BOOLEAN,
  custom_update BOOLEAN,
  custom_delete BOOLEAN,
  custom_file BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, society_id)
);

-- Permisos por Ruta
route_permissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  society_id UUID REFERENCES societies(id), -- NULL si es global
  route VARCHAR, -- Ruta exacta o patrón
  route_pattern VARCHAR, -- Patrón para matching
  permission_read BOOLEAN,
  permission_write BOOLEAN,
  permission_update BOOLEAN,
  permission_delete BOOLEAN,
  permission_file BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Permisos por Carpeta (ya existe probablemente)
folder_permissions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  folder_id UUID REFERENCES folders(id),
  permission_read BOOLEAN,
  permission_write BOOLEAN,
  permission_delete BOOLEAN,
  permission_download BOOLEAN,
  permission_comment BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id, folder_id)
);
```

---

## 📋 PRÓXIMOS PASOS

### Fase 1: Mapeo y Estructura (1-2 días)

1. ✅ Crear archivo de mapeo de rutas (`app/config/routes/permissions-map.ts`)
2. ✅ Definir tipos TypeScript para permisos por ruta
3. ✅ Actualizar entidades del dominio

### Fase 2: Backend (Backend se encarga)

1. Implementar endpoints de permisos por ruta
2. Implementar middleware de verificación de acceso
3. Actualizar base de datos

### Fase 3: Frontend - Componentes (3-5 días)

1. Crear `RoutePermissionsEditor.vue`
2. Actualizar `PermissionsEditor.vue` para incluir tabs
3. Crear `SocietyPermissionsTab.vue`
4. Crear `FolderPermissionsTab.vue`
5. Actualizar store de usuarios

### Fase 4: Integración (2-3 días)

1. Conectar componentes con backend
2. Implementar verificación de permisos en rutas
3. Testing manual

### Fase 5: Testing y Documentación (1-2 días)

1. Testing completo de flujos
2. Documentación de usuario
3. Guía de uso para admins

---

## 💡 CONSIDERACIONES IMPORTANTES

### 1. Jerarquía de Permisos

```
Rol Global (base)
  ↓
Permisos por Sociedad (sobrescribe para esa sociedad)
  ↓
Permisos por Ruta (sobrescribe para esa ruta específica)
  ↓
Permisos por Carpeta (sobrescribe para esa carpeta específica)
```

### 2. Wildcards y Patrones

- `/registros/sociedades/*` → Aplica a todas las rutas bajo sociedades
- `/operaciones/sociedades/:societyId/junta-accionistas/:flowId/*` → Aplica a todas las rutas del flujo

### 3. Permisos por Defecto

- Si un usuario tiene rol "Usuario" pero no tiene permisos específicos por ruta, usa los permisos del rol
- Si tiene permisos específicos por ruta, esos sobrescriben los del rol

### 4. Performance

- Cachear permisos en frontend (localStorage/sessionStorage)
- Backend debe cachear permisos de usuario
- Verificar permisos solo al cambiar de ruta, no en cada render

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Frontend

- [ ] Crear `app/config/routes/permissions-map.ts` con mapeo completo
- [ ] Actualizar tipos en `app/types/permissions.ts`
- [ ] Crear `RoutePermissionsEditor.vue`
- [ ] Actualizar `PermissionsEditor.vue` con tabs
- [ ] Crear `SocietyPermissionsTab.vue`
- [ ] Crear `FolderPermissionsTab.vue`
- [ ] Actualizar store de usuarios
- [ ] Implementar middleware de verificación de rutas
- [ ] Actualizar navegación para ocultar rutas sin acceso

### Backend (Comunicar al equipo backend)

- [ ] Endpoints de permisos por ruta
- [ ] Middleware de verificación de acceso
- [ ] Actualizar base de datos
- [ ] Cache de permisos

### Testing

- [ ] Crear usuario con diferentes roles
- [ ] Asignar permisos por sociedad
- [ ] Configurar permisos por ruta
- [ ] Verificar acceso a rutas
- [ ] Verificar acceso a carpetas
- [ ] Testing de wildcards

---

**Última actualización:** Diciembre 2024  
**Estado:** 📋 PLANIFICACIÓN COMPLETA - LISTO PARA IMPLEMENTACIÓN

