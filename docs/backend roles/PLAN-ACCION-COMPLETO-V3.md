# 🎯 PLAN DE ACCIÓN COMPLETO: Sistema v3

**Fecha:** Enero 2025  
**Objetivo:** Sistema completo de permisos v3 con gestión de usuarios desde dashboard

---

## 📋 ÍNDICE

1. [Estado Actual](#1-estado-actual)
2. [Rutas que Faltan](#2-rutas-que-faltan)
3. [Plan de Acción](#3-plan-de-acción)
4. [Endpoints Necesarios](#4-endpoints-necesarios)
5. [Estructura de Respuestas](#5-estructura-de-respuestas)

---

## 1. ESTADO ACTUAL

### ✅ **Lo que SÍ tienes:**

#### **Autenticación:**
- ✅ `POST /api/v2/auth` - Login (funciona)

#### **Sociedades:**
- ✅ `GET /api/v2/society-profile/list` - Listar sociedades
- ✅ `POST /api/v2/society-profile` - Crear sociedad
- ✅ `GET /api/v2/society-profile/:id` - Obtener sociedad

#### **Repositorio:**
- ✅ `GET /api/v1/repository/society/:societyId/virtual-nodes/root` - Obtener raíz
- ✅ `POST /api/v1/repository/society/virtual-nodes/:virtualNodeId` - Crear carpeta
- ✅ `POST /api/v1/repository/society/virtual-nodes/:virtualNodeId/documents` - Subir documento
- ✅ `GET /api/v1/repository/society/virtual-nodes/:virtualNodeId` - Obtener nodo
- ✅ `POST /api/v1/repository/society/virtual-nodes/:virtualNodeId/permissions` - Dar permiso
- ✅ `GET /api/v1/repository/society/virtual-nodes/:virtualNodeId/users` - Listar usuarios

#### **Sistema de Permisos:**
- ✅ Estructura de `ModuleAccessV2` y `ActionV2` funcionando
- ✅ Guards funcionando
- ✅ Validación automática en endpoints

---

## 2. RUTAS QUE FALTAN

### 🔴 **CRÍTICAS (Necesarias para funcionar):**

#### **Autenticación:**
- ❌ `GET /api/v2/user/me` - Obtener usuario actual + permisos
- ❌ `POST /api/v2/auth/refresh` - Refresh token
- ❌ `POST /api/v2/auth/logout` - Logout (opcional)

#### **Gestión de Usuarios (Admin Panel):**
- ❌ `GET /api/v2/admin/users` - Listar todos los usuarios
- ❌ `GET /api/v2/admin/users/:id` - Obtener usuario específico
- ❌ `POST /api/v2/admin/users` - Crear usuario
- ❌ `PUT /api/v2/admin/users/:id` - Actualizar usuario
- ❌ `DELETE /api/v2/admin/users/:id` - Eliminar/desactivar usuario
- ❌ `GET /api/v2/admin/users/:id/permissions` - Obtener permisos de usuario
- ❌ `PUT /api/v2/admin/users/:id/permissions` - Actualizar permisos de usuario
- ❌ `GET /api/v2/admin/roles` - Listar roles disponibles
- ❌ `GET /api/v2/admin/permissions` - Listar todos los permisos disponibles

#### **Gestión de Permisos v3:**
- ❌ `GET /api/v2/admin/permissions/v3` - Listar permisos v3 disponibles
- ❌ `POST /api/v2/admin/users/:id/permissions/v3` - Asignar permisos v3 a usuario
- ❌ `DELETE /api/v2/admin/users/:id/permissions/v3/:permission` - Quitar permiso v3

---

### 🟡 **IMPORTANTES (Para funcionalidad completa):**

#### **Sucursales:**
- ⚠️ `GET /api/v2/sucursales/list` - Listar sucursales (verificar si existe)
- ⚠️ `POST /api/v2/sucursales` - Crear sucursal (verificar si existe)
- ⚠️ `GET /api/v2/sucursales/:id` - Obtener sucursal (verificar si existe)

#### **Juntas de Accionistas:**
- ⚠️ `GET /api/v2/juntas/list` - Listar juntas (verificar si existe)
- ⚠️ `POST /api/v2/juntas` - Crear junta (verificar si existe)
- ⚠️ `GET /api/v2/juntas/:id` - Obtener junta (verificar si existe)

#### **Directorio:**
- ⚠️ `GET /api/v2/directorio/list` - Listar directorios (verificar si existe)
- ⚠️ `POST /api/v2/directorio` - Crear directorio (verificar si existe)
- ⚠️ `GET /api/v2/directorio/:id` - Obtener directorio (verificar si existe)

#### **Espacios de Trabajo:**
- ❌ `GET /api/v2/workspaces` - Listar workspaces del usuario
- ❌ `POST /api/v2/workspaces` - Crear workspace
- ❌ `GET /api/v2/workspaces/:id` - Obtener workspace
- ❌ `PUT /api/v2/workspaces/:id` - Actualizar workspace
- ❌ `DELETE /api/v2/workspaces/:id` - Eliminar workspace
- ❌ `GET /api/v2/workspaces/:id/members` - Listar miembros
- ❌ `POST /api/v2/workspaces/:id/members` - Agregar miembro
- ❌ `DELETE /api/v2/workspaces/:id/members/:userId` - Quitar miembro
- ❌ `GET /api/v2/workspaces/:id/resources` - Listar recursos
- ❌ `POST /api/v2/workspaces/:id/resources` - Agregar recurso
- ❌ `DELETE /api/v2/workspaces/:id/resources/:resourceId` - Quitar recurso

#### **Chat IA:**
- ⚠️ `POST /api/v2/chat` - Iniciar chat (verificar si existe en otra ruta)
- ⚠️ `POST /api/v2/chat/:id/message` - Enviar mensaje (verificar si existe)

---

## 3. PLAN DE ACCIÓN

### **FASE 1: Preparar Base de Datos (1 día)**

#### **1.1. Ejecutar Seed de Permisos v3**

**Qué hacer:**
- Ejecutar script `seedPermissionsV3.ts`
- Crear todos los permisos v3 en `ActionV2`
- Crear flow "V3" en `FlowV2` (si no existe)

**Resultado:**
- ✅ Permisos v3 creados en BD
- ✅ Listos para asignar a usuarios

---

#### **1.2. Crear Usuarios de Prueba**

**Qué hacer:**
- Crear varios usuarios con diferentes roles
- Asignar diferentes permisos a cada uno
- Preparar para pruebas

**Usuarios sugeridos:**
- `admin@test.com` - Administrador (todos los permisos)
- `usuario1@test.com` - Solo puede crear sociedades
- `usuario2@test.com` - Solo puede ver historial
- `usuario3@test.com` - Sin permisos (para probar bloqueo)

---

### **FASE 2: Endpoints de Autenticación (1 día)**

#### **2.1. Crear `GET /api/v2/user/me`**

**Qué hacer:**
- Crear endpoint que devuelva usuario actual
- Incluir permisos v3 en la respuesta
- Formato: `{ user, permissions: [...] }`

**Estructura de respuesta:**
```json
{
  "success": true,
  "code": 200,
  "data": {
    "user": {
      "id": "user-123",
      "email": "usuario@test.com",
      "name": "Juan Pérez",
      "role": {
        "id": "role-1",
        "name": "Usuario"
      }
    },
    "permissions": [
      "registro-sociedad/crear",
      "registro-sociedad/historial",
      "operacion-directorio/dashboard"
    ]
  }
}
```

---

#### **2.2. Crear `POST /api/v2/auth/refresh`**

**Qué hacer:**
- Crear endpoint que valide refresh token
- Generar nuevo access token
- Actualizar en BD

---

### **FASE 3: Endpoints de Gestión de Usuarios (2-3 días)**

#### **3.1. Listar Usuarios**

**Endpoint:** `GET /api/v2/admin/users`

**Qué hacer:**
- Listar todos los usuarios (solo admin)
- Incluir paginación
- Incluir filtros (por rol, por estudio)
- Devolver información básica

---

#### **3.2. Obtener Usuario Específico**

**Endpoint:** `GET /api/v2/admin/users/:id`

**Qué hacer:**
- Obtener usuario por ID
- Incluir permisos actuales
- Incluir asignaciones a sociedades

---

#### **3.3. Crear Usuario**

**Endpoint:** `POST /api/v2/admin/users`

**Qué hacer:**
- Crear nuevo usuario
- Asignar rol
- Asignar estudio
- Generar contraseña temporal (o enviar invitación)

---

#### **3.4. Actualizar Usuario**

**Endpoint:** `PUT /api/v2/admin/users/:id`

**Qué hacer:**
- Actualizar información del usuario
- Cambiar rol
- Cambiar estudio
- Activar/desactivar usuario

---

#### **3.5. Eliminar/Desactivar Usuario**

**Endpoint:** `DELETE /api/v2/admin/users/:id`

**Qué hacer:**
- Desactivar usuario (no eliminar)
- Invalidar todos sus tokens
- Mantener historial

---

### **FASE 4: Endpoints de Gestión de Permisos (2-3 días)**

#### **4.1. Listar Permisos Disponibles**

**Endpoint:** `GET /api/v2/admin/permissions/v3`

**Qué hacer:**
- Listar todos los permisos v3 disponibles
- Agrupar por categoría
- Devolver estructura organizada

**Estructura de respuesta:**
```json
{
  "success": true,
  "data": {
    "registro": {
      "sociedad": [
        "registro-sociedad/dashboard",
        "registro-sociedad/crear",
        "registro-sociedad/historial"
      ],
      "sucursal": [
        "registro-sucursal/dashboard",
        "registro-sucursal/crear",
        "registro-sucursal/historial"
      ]
    },
    "operacion": {
      "junta-accionistas": [...],
      "directorio": [...]
    }
  }
}
```

---

#### **4.2. Obtener Permisos de Usuario**

**Endpoint:** `GET /api/v2/admin/users/:id/permissions`

**Qué hacer:**
- Obtener todos los permisos del usuario
- Incluir permisos v2 (si existen)
- Incluir permisos v3
- Formato organizado

---

#### **4.3. Asignar Permisos a Usuario**

**Endpoint:** `POST /api/v2/admin/users/:id/permissions/v3`

**Body:**
```json
{
  "permissions": [
    "registro-sociedad/crear",
    "registro-sociedad/historial",
    "operacion-directorio/dashboard"
  ]
}
```

**Qué hacer:**
- Asignar múltiples permisos a usuario
- Crear registros en `ModuleAccessV2` y `ModuleAccess_ActionV2`
- Validar que permisos existan

---

#### **4.4. Actualizar Permisos de Usuario**

**Endpoint:** `PUT /api/v2/admin/users/:id/permissions/v3`

**Body:**
```json
{
  "permissions": [
    "registro-sociedad/crear",
    "registro-sociedad/historial"
  ]
}
```

**Qué hacer:**
- Reemplazar todos los permisos del usuario
- Eliminar permisos que no están en la lista
- Agregar nuevos permisos

---

#### **4.5. Quitar Permiso Específico**

**Endpoint:** `DELETE /api/v2/admin/users/:id/permissions/v3/:permission`

**Qué hacer:**
- Quitar un permiso específico del usuario
- Eliminar registro en `ModuleAccess_ActionV2`

---

### **FASE 5: Endpoints de Roles (1 día)**

#### **5.1. Listar Roles**

**Endpoint:** `GET /api/v2/admin/roles`

**Qué hacer:**
- Listar todos los roles disponibles
- Incluir descripción
- Incluir permisos por defecto (si aplica)

---

### **FASE 6: Endpoints de Workspaces (2 semanas - Futuro)**

**Nota:** Esto es para segunda etapa, pero documentarlo ahora.

---

## 4. ENDPOINTS NECESARIOS

### 📋 **Tabla Completa de Endpoints**

| Categoría | Método | Ruta | Prioridad | Estado |
|------------|--------|------|-----------|--------|
| **Auth** | `GET` | `/api/v2/user/me` | 🔴 CRÍTICA | ❌ Falta |
| **Auth** | `POST` | `/api/v2/auth/refresh` | 🔴 CRÍTICA | ❌ Falta |
| **Auth** | `POST` | `/api/v2/auth/logout` | 🟡 Media | ❌ Falta |
| **Admin - Usuarios** | `GET` | `/api/v2/admin/users` | 🔴 CRÍTICA | ❌ Falta |
| **Admin - Usuarios** | `GET` | `/api/v2/admin/users/:id` | 🔴 CRÍTICA | ❌ Falta |
| **Admin - Usuarios** | `POST` | `/api/v2/admin/users` | 🔴 CRÍTICA | ❌ Falta |
| **Admin - Usuarios** | `PUT` | `/api/v2/admin/users/:id` | 🔴 CRÍTICA | ❌ Falta |
| **Admin - Usuarios** | `DELETE` | `/api/v2/admin/users/:id` | 🔴 CRÍTICA | ❌ Falta |
| **Admin - Permisos** | `GET` | `/api/v2/admin/permissions/v3` | 🔴 CRÍTICA | ❌ Falta |
| **Admin - Permisos** | `GET` | `/api/v2/admin/users/:id/permissions` | 🔴 CRÍTICA | ❌ Falta |
| **Admin - Permisos** | `POST` | `/api/v2/admin/users/:id/permissions/v3` | 🔴 CRÍTICA | ❌ Falta |
| **Admin - Permisos** | `PUT` | `/api/v2/admin/users/:id/permissions/v3` | 🔴 CRÍTICA | ❌ Falta |
| **Admin - Permisos** | `DELETE` | `/api/v2/admin/users/:id/permissions/v3/:permission` | 🔴 CRÍTICA | ❌ Falta |
| **Admin - Roles** | `GET` | `/api/v2/admin/roles` | 🟡 Media | ❌ Falta |
| **Sucursales** | `GET` | `/api/v2/sucursales/list` | 🟡 Media | ⚠️ Verificar |
| **Sucursales** | `POST` | `/api/v2/sucursales` | 🟡 Media | ⚠️ Verificar |
| **Juntas** | `GET` | `/api/v2/juntas/list` | 🟡 Media | ⚠️ Verificar |
| **Juntas** | `POST` | `/api/v2/juntas` | 🟡 Media | ⚠️ Verificar |
| **Directorio** | `GET` | `/api/v2/directorio/list` | 🟡 Media | ⚠️ Verificar |
| **Directorio** | `POST` | `/api/v2/directorio` | 🟡 Media | ⚠️ Verificar |
| **Workspaces** | `GET` | `/api/v2/workspaces` | 🟢 Baja | ❌ Futuro |
| **Workspaces** | `POST` | `/api/v2/workspaces` | 🟢 Baja | ❌ Futuro |
| **Chat IA** | `POST` | `/api/v2/chat` | 🟡 Media | ⚠️ Verificar |

---

## 5. ESTRUCTURA DE RESPUESTAS

### **5.1. `GET /api/v2/user/me`**

**Respuesta:**
```json
{
  "success": true,
  "code": 200,
  "data": {
    "user": {
      "id": "user-123",
      "email": "usuario@test.com",
      "name": "Juan Pérez",
      "role": {
        "id": "role-1",
        "name": "Usuario"
      },
      "study": {
        "id": "study-1",
        "name": "Estudio Principal"
      }
    },
    "permissions": [
      "registro-sociedad/crear",
      "registro-sociedad/historial",
      "operacion-directorio/dashboard"
    ]
  }
}
```

---

### **5.2. `GET /api/v2/admin/users`**

**Respuesta:**
```json
{
  "success": true,
  "code": 200,
  "data": {
    "users": [
      {
        "id": "user-123",
        "email": "usuario@test.com",
        "name": "Juan Pérez",
        "role": {
          "id": "role-1",
          "name": "Usuario"
        },
        "status": true,
        "createdAt": "2025-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50
    }
  }
}
```

---

### **5.3. `GET /api/v2/admin/users/:id/permissions`**

**Respuesta:**
```json
{
  "success": true,
  "code": 200,
  "data": {
    "userId": "user-123",
    "permissions": [
      "registro-sociedad/crear",
      "registro-sociedad/historial",
      "operacion-directorio/dashboard"
    ],
    "permissionsByCategory": {
      "registro": {
        "sociedad": ["crear", "historial"],
        "sucursal": []
      },
      "operacion": {
        "directorio": ["dashboard"]
      }
    }
  }
}
```

---

### **5.4. `GET /api/v2/admin/permissions/v3`**

**Respuesta:**
```json
{
  "success": true,
  "code": 200,
  "data": {
    "registro": {
      "sociedad": [
        "registro-sociedad/dashboard",
        "registro-sociedad/crear",
        "registro-sociedad/historial"
      ],
      "sucursal": [
        "registro-sucursal/dashboard",
        "registro-sucursal/crear",
        "registro-sucursal/historial"
      ]
    },
    "operacion": {
      "junta-accionistas": [
        "operacion-junta-accionistas/dashboard",
        "operacion-junta-accionistas/crear",
        "operacion-junta-accionistas/historial"
      ],
      "directorio": [
        "operacion-directorio/dashboard",
        "operacion-directorio/crear",
        "operacion-directorio/historial"
      ]
    },
    "storage": {
      "almacen": [
        "storage-almacen/view",
        "storage-almacen/download",
        "storage-almacen/upload",
        "storage-almacen/delete"
      ],
      "documentos-generados": [
        "storage-documentos-generados/view",
        "storage-documentos-generados/download"
      ]
    },
    "workspace": [
      "workspace/dashboard",
      "workspace/crear",
      "workspace/historial"
    ],
    "chat": [
      "chat/iniciar"
    ]
  }
}
```

---

## 6. PLAN DE IMPLEMENTACIÓN PASO A PASO

### **PASO 1: Preparar Base de Datos (1 día)**

**Qué tienes:**
- ✅ Tablas `UserV2`, `RoleV2`, `ModuleAccessV2`, `ActionV2`
- ✅ Script `seedPermissionsV3.ts` creado

**Qué hacer:**
1. Ejecutar script de seed para crear permisos v3
2. Crear flow "V3" en `FlowV2` (si no existe)
3. Crear usuarios de prueba con diferentes permisos

**Resultado:**
- ✅ Permisos v3 en BD
- ✅ Usuarios de prueba listos

---

### **PASO 2: Crear Endpoints de Auth (1 día)**

**Qué tienes:**
- ✅ `POST /api/v2/auth` (login)

**Qué hacer:**
1. Crear `GET /api/v2/user/me`
   - Obtener usuario actual desde token
   - Cargar permisos v3 del usuario
   - Devolver estructura completa

2. Crear `POST /api/v2/auth/refresh`
   - Validar refresh token
   - Generar nuevo access token

**Resultado:**
- ✅ Frontend puede obtener usuario y permisos
- ✅ Frontend puede refrescar token

---

### **PASO 3: Crear Endpoints de Gestión de Usuarios (2-3 días)**

**Qué hacer:**
1. Crear `GET /api/v2/admin/users`
   - Listar todos los usuarios
   - Paginación
   - Filtros

2. Crear `GET /api/v2/admin/users/:id`
   - Obtener usuario específico
   - Incluir permisos

3. Crear `POST /api/v2/admin/users`
   - Crear nuevo usuario
   - Asignar rol y estudio

4. Crear `PUT /api/v2/admin/users/:id`
   - Actualizar usuario
   - Cambiar rol

5. Crear `DELETE /api/v2/admin/users/:id`
   - Desactivar usuario

**Resultado:**
- ✅ Frontend puede listar usuarios
- ✅ Frontend puede crear/editar usuarios
- ✅ Frontend puede desactivar usuarios

---

### **PASO 4: Crear Endpoints de Gestión de Permisos (2-3 días)**

**Qué hacer:**
1. Crear `GET /api/v2/admin/permissions/v3`
   - Listar todos los permisos v3 disponibles
   - Agrupar por categoría

2. Crear `GET /api/v2/admin/users/:id/permissions`
   - Obtener permisos del usuario
   - Formato organizado

3. Crear `POST /api/v2/admin/users/:id/permissions/v3`
   - Asignar permisos a usuario
   - Crear registros en BD

4. Crear `PUT /api/v2/admin/users/:id/permissions/v3`
   - Actualizar permisos del usuario
   - Reemplazar todos los permisos

5. Crear `DELETE /api/v2/admin/users/:id/permissions/v3/:permission`
   - Quitar permiso específico

**Resultado:**
- ✅ Frontend puede ver permisos disponibles
- ✅ Frontend puede asignar/quitar permisos
- ✅ Frontend puede gestionar permisos desde dashboard

---

### **PASO 5: Crear Endpoints de Roles (1 día)**

**Qué hacer:**
1. Crear `GET /api/v2/admin/roles`
   - Listar todos los roles disponibles

**Resultado:**
- ✅ Frontend puede ver roles disponibles
- ✅ Frontend puede asignar roles a usuarios

---

### **PASO 6: Testing con Varios Usuarios (1 día)**

**Qué hacer:**
1. Crear usuarios de prueba:
   - Admin (todos los permisos)
   - Usuario 1 (solo crear sociedades)
   - Usuario 2 (solo ver historial)
   - Usuario 3 (sin permisos)

2. Probar acceso a páginas:
   - Login con cada usuario
   - Verificar que solo vea lo permitido
   - Verificar que no pueda acceder a lo bloqueado

3. Probar gestión desde dashboard:
   - Login como admin
   - Asignar/quitar permisos
   - Verificar que cambios se reflejen

**Resultado:**
- ✅ Sistema funcionando con diferentes usuarios
- ✅ Permisos funcionando correctamente
- ✅ Dashboard de gestión funcionando

---

## 7. ESTRUCTURA DE ARCHIVOS A CREAR

### **Backend:**

```
src/modules/
├── flows-v2/
│   └── auth/
│       └── presentation/
│           └── routes.controller.ts (AGREGAR endpoints)
│
└── admin/ (NUEVO MÓDULO)
    ├── users/
    │   ├── domain/
    │   ├── infrastructure/
    │   ├── application/
    │   └── presentation/
    │       └── users.controller.ts
    │
    └── permissions/
        ├── domain/
        ├── infrastructure/
        ├── application/
        └── presentation/
            └── permissions.controller.ts
```

---

## 8. CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Base de Datos (1 día)**
- [ ] Ejecutar `seedPermissionsV3.ts`
- [ ] Crear flow "V3" en `FlowV2`
- [ ] Crear usuarios de prueba

### **Fase 2: Auth (1 día)**
- [ ] Crear `GET /api/v2/user/me`
- [ ] Crear `POST /api/v2/auth/refresh`
- [ ] Probar con frontend

### **Fase 3: Gestión de Usuarios (2-3 días)**
- [ ] Crear `GET /api/v2/admin/users`
- [ ] Crear `GET /api/v2/admin/users/:id`
- [ ] Crear `POST /api/v2/admin/users`
- [ ] Crear `PUT /api/v2/admin/users/:id`
- [ ] Crear `DELETE /api/v2/admin/users/:id`

### **Fase 4: Gestión de Permisos (2-3 días)**
- [ ] Crear `GET /api/v2/admin/permissions/v3`
- [ ] Crear `GET /api/v2/admin/users/:id/permissions`
- [ ] Crear `POST /api/v2/admin/users/:id/permissions/v3`
- [ ] Crear `PUT /api/v2/admin/users/:id/permissions/v3`
- [ ] Crear `DELETE /api/v2/admin/users/:id/permissions/v3/:permission`

### **Fase 5: Roles (1 día)**
- [ ] Crear `GET /api/v2/admin/roles`

### **Fase 6: Testing (1 día)**
- [ ] Crear usuarios de prueba
- [ ] Probar acceso con diferentes permisos
- [ ] Probar gestión desde dashboard

---

## 9. TIEMPO TOTAL ESTIMADO

**Total: 8-10 días**

- Fase 1: 1 día
- Fase 2: 1 día
- Fase 3: 2-3 días
- Fase 4: 2-3 días
- Fase 5: 1 día
- Fase 6: 1 día

---

## 10. CONCLUSIÓN

**Con estos endpoints, el frontend podrá:**
- ✅ Obtener usuario y permisos al hacer login
- ✅ Listar usuarios desde dashboard
- ✅ Crear/editar usuarios
- ✅ Asignar/quitar permisos
- ✅ Gestionar roles
- ✅ Hacer pruebas con varios usuarios

**¿Listo para empezar?** 🚀

