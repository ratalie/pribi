# ❓ PREGUNTAS PARA BACKEND: Autenticación y Permisos

**Fecha:** Enero 2025  
**Propósito:** Alinear Frontend y Backend antes de implementación

---

## 📋 ÍNDICE

1. [Autenticación](#1-autenticación)
2. [Usuario y Perfil](#2-usuario-y-perfil)
3. [Permisos y Roles](#3-permisos-y-roles)
4. [Espacios de Trabajo](#4-espacios-de-trabajo)
5. [Admin Panel](#5-admin-panel)
6. [Seguridad y Tokens](#6-seguridad-y-tokens)

---

## 1. AUTENTICACIÓN

### 1.1. Endpoint de Login

**Pregunta:** ¿Cuál es el endpoint exacto para login?

**Respuesta Esperada:**
```
POST /api/v2/auth
```

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token-here",
    "expiresIn": 3600,
    "user": {
      "id": "user-123",
      "email": "usuario@example.com",
      "name": "Juan Pérez"
    }
  }
}
```

**Preguntas Específicas:**
- [ ] ¿El token es JWT?
- [ ] ¿Cuánto tiempo dura el token? (expiresIn en segundos)
- [ ] ¿Hay refresh token? ¿Cuál es el endpoint?
- [ ] ¿Qué información viene en el payload del JWT?
- [ ] ¿Hay rate limiting en el login?

---

### 1.2. Refresh Token

**Pregunta:** ¿Cómo funciona el refresh token?

**Respuesta Esperada:**
```
POST /api/v2/auth/refresh
```

**Body:**
```json
{
  "refreshToken": "refresh-token-here"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "token": "new-jwt-token",
    "refreshToken": "new-refresh-token",
    "expiresIn": 3600
  }
}
```

**Preguntas Específicas:**
- [ ] ¿El refresh token expira? ¿Cuánto tiempo?
- [ ] ¿Se puede usar el refresh token múltiples veces?
- [ ] ¿Qué pasa si el refresh token expira?
- [ ] ¿Hay un endpoint para revocar tokens?

---

### 1.3. Logout

**Pregunta:** ¿Hay endpoint de logout o solo eliminamos el token del frontend?

**Respuesta Esperada:**
```
POST /api/v2/auth/logout
```

**Preguntas Específicas:**
- [ ] ¿El backend invalida el token al hacer logout?
- [ ] ¿Necesitamos enviar el token en el logout?
- [ ] ¿Hay logout de todos los dispositivos?

---

## 2. USUARIO Y PERFIL

### 2.1. Obtener Usuario Actual

**Pregunta:** ¿Cómo obtenemos el usuario actual después del login?

**Respuesta Esperada:**
```
GET /api/v2/user/me
Headers: Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "usuario@example.com",
      "name": "Juan Pérez",
      "avatar": "https://...",
      "title": "Administrador Legal",
      "role": {
        "id": "admin",
        "name": "Administrador"
      }
    },
    "permissions": {
      // Ver sección 3
    }
  }
}
```

**Preguntas Específicas:**
- [ ] ¿Este endpoint devuelve también los permisos?
- [ ] ¿O hay un endpoint separado para permisos?
- [ ] ¿Qué información adicional del usuario necesitamos?

---

### 2.2. Actualizar Perfil

**Pregunta:** ¿Cómo actualizamos el perfil del usuario?

**Respuesta Esperada:**
```
PUT /api/v2/user/me
```

**Preguntas Específicas:**
- [ ] ¿Qué campos se pueden actualizar?
- [ ] ¿Hay validaciones especiales?
- [ ] ¿Se puede cambiar el email?

---

## 3. PERMISOS Y ROLES

### 3.1. Estructura de Permisos

**Pregunta:** ¿Cuál es la estructura exacta de permisos que devuelve el backend?

**Respuesta Esperada (Basado en Admin Panel Figma):**
```json
{
  "systemFeatures": {
    "societies": {
      "create": true,
      "read": true,
      "update": true,
      "delete": true
    },
    "shareholders": {
      "create": false,
      "read": true,
      "update": false,
      "delete": false
    },
    "directory": {
      "create": true,
      "read": true,
      "update": true,
      "delete": false
    },
    "juntas": {
      "create": true,
      "read": true,
      "update": true,
      "delete": false
    },
    "chatAI": true,
    "userManagement": false
  },
  "repositoryAccess": {
    "fullAccess": false,
    "permissions": {
      "view": true,
      "download": false,
      "upload": true,
      "delete": false,
      "search": true
    }
  }
}
```

**Preguntas Específicas:**
- [ ] ¿Esta estructura es correcta?
- [ ] ¿Hay más módulos que no están en la lista?
- [ ] ¿Los permisos son por módulo o por recurso específico?
- [ ] ¿Hay permisos a nivel de workspace?

---

### 3.2. Roles Predefinidos

**Pregunta:** ¿Qué roles predefinidos existen?

**Respuesta Esperada:**
- `admin` - Acceso total
- `manager` - Acceso a gestión
- `user` - Usuario estándar
- `viewer` - Solo lectura
- `external` - Usuario externo

**Preguntas Específicas:**
- [ ] ¿Cuáles son los roles exactos?
- [ ] ¿Se pueden crear roles personalizados?
- [ ] ¿Los roles tienen permisos por defecto?

---

### 3.3. Verificar Permisos

**Pregunta:** ¿Hay un endpoint para verificar un permiso específico?

**Respuesta Esperada:**
```
GET /api/v2/user/permissions/check?module=societies&action=create
```

**Preguntas Específicas:**
- [ ] ¿O solo devolvemos todos los permisos en `/user/me`?
- [ ] ¿Hay caché de permisos en el backend?

---

## 4. ESPACIOS DE TRABAJO

### 4.1. Obtener Workspaces del Usuario

**Pregunta:** ¿Cómo obtenemos los workspaces a los que tiene acceso el usuario?

**Respuesta Esperada:**
```
GET /api/v2/workspaces
Headers: Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ws-123",
      "name": "Proyecto Alpha",
      "description": "...",
      "role": "owner",
      "permissions": {
        "view": true,
        "download": true,
        "upload": true,
        "delete": true
      }
    }
  ]
}
```

**Preguntas Específicas:**
- [ ] ¿Este endpoint devuelve todos los workspaces o solo los del usuario?
- [ ] ¿Incluye permisos específicos del workspace?

---

### 4.2. Crear Workspace

**Pregunta:** ¿Cómo creamos un workspace?

**Respuesta Esperada:**
```
POST /api/v2/workspaces
```

**Body:**
```json
{
  "name": "Nuevo Workspace",
  "description": "...",
  "settings": {
    "hasChatAI": true,
    "allowDownloads": true,
    "allowComments": true,
    "showFlowsPreview": true
  }
}
```

**Preguntas Específicas:**
- [ ] ¿Qué campos son obligatorios?
- [ ] ¿Hay límites de workspaces por usuario?

---

### 4.3. Agregar Recurso a Workspace

**Pregunta:** ¿Cómo agregamos un recurso (carpeta o historial) a un workspace?

**Respuesta Esperada:**
```
POST /api/v2/workspaces/:workspaceId/resources
```

**Body:**
```json
{
  "type": "sucursal-history",
  "resourceId": "sucursal-456",
  "name": "Historial - Sucursal Centro"
}
```

**Preguntas Específicas:**
- [ ] ¿Qué tipos de recursos se pueden agregar?
- [ ] ¿Hay límites de recursos por workspace?

---

### 4.4. Gestionar Miembros del Workspace

**Pregunta:** ¿Cómo agregamos/eliminamos miembros de un workspace?

**Respuesta Esperada:**
```
POST /api/v2/workspaces/:workspaceId/members
DELETE /api/v2/workspaces/:workspaceId/members/:userId
```

**Preguntas Específicas:**
- [ ] ¿Cómo asignamos roles a miembros?
- [ ] ¿Se pueden agregar usuarios externos?
- [ ] ¿Hay permisos específicos por miembro?

---

## 5. ADMIN PANEL

### 5.1. Listar Usuarios

**Pregunta:** ¿Cómo listamos todos los usuarios (solo admin)?

**Respuesta Esperada:**
```
GET /api/v2/admin/users
```

**Preguntas Específicas:**
- [ ] ¿Hay paginación?
- [ ] ¿Hay filtros (por rol, por workspace)?
- [ ] ¿Qué información devuelve cada usuario?

---

### 5.2. Gestionar Permisos de Usuario

**Pregunta:** ¿Cómo actualizamos los permisos de un usuario?

**Respuesta Esperada:**
```
PUT /api/v2/admin/users/:userId/permissions
```

**Body:**
```json
{
  "systemFeatures": {
    "societies": {
      "create": true,
      "read": true,
      "update": false,
      "delete": false
    }
  },
  "repositoryAccess": {
    "permissions": {
      "download": false
    }
  }
}
```

**Preguntas Específicas:**
- [ ] ¿Se pueden actualizar permisos parcialmente?
- [ ] ¿Hay validaciones (ej: no quitar permisos de admin a sí mismo)?

---

### 5.3. Crear/Editar Usuario

**Pregunta:** ¿Cómo creamos o editamos un usuario desde el admin panel?

**Respuesta Esperada:**
```
POST /api/v2/admin/users
PUT /api/v2/admin/users/:userId
```

**Preguntas Específicas:**
- [ ] ¿Se puede crear usuario sin contraseña (invitación)?
- [ ] ¿Qué campos son editables?

---

### 5.4. Activity Log

**Pregunta:** ¿Hay un endpoint para obtener el log de actividades?

**Respuesta Esperada:**
```
GET /api/v2/admin/activity-log
```

**Preguntas Específicas:**
- [ ] ¿Qué acciones se registran?
- [ ] ¿Hay filtros (por usuario, por fecha, por acción)?
- [ ] ¿Hay paginación?

---

## 6. SEGURIDAD Y TOKENS

### 6.1. Validación de Token

**Pregunta:** ¿Cómo validamos si un token sigue siendo válido?

**Respuesta Esperada:**
```
GET /api/v2/auth/validate
Headers: Authorization: Bearer <token>
```

**Preguntas Específicas:**
- [ ] ¿O solo verificamos la expiración en el frontend?
- [ ] ¿Hay un endpoint de "ping" para verificar conexión?

---

### 6.2. Manejo de Errores

**Pregunta:** ¿Qué códigos de error devuelve el backend?

**Respuesta Esperada:**
- `401` - No autenticado / Token inválido
- `403` - No autorizado / Sin permisos
- `404` - Recurso no encontrado
- `422` - Validación fallida
- `500` - Error del servidor

**Preguntas Específicas:**
- [ ] ¿Hay códigos de error personalizados?
- [ ] ¿Los mensajes de error son en español?
- [ ] ¿Hay estructura estándar de errores?

---

### 6.3. Rate Limiting

**Pregunta:** ¿Hay rate limiting en los endpoints?

**Preguntas Específicas:**
- [ ] ¿Qué límites hay?
- [ ] ¿Cómo se comunican los límites (headers)?
- [ ] ¿Qué pasa cuando se excede el límite?

---

## 📝 NOTAS PARA BACKEND

### Lo que Frontend Necesita

1. **Contratos Claros:** Estructura exacta de requests/responses
2. **Documentación:** Swagger/OpenAPI si es posible
3. **Ambiente de Desarrollo:** URL del backend de desarrollo
4. **Códigos de Error:** Lista completa de códigos y mensajes

### Lo que Frontend Está Haciendo

1. **MSW:** Simulando backend mientras se construye
2. **Tipos TypeScript:** Basados en las respuestas esperadas
3. **Validación:** Validando requests antes de enviar

---

## ✅ CHECKLIST DE RESPUESTAS

- [ ] Endpoint de login confirmado
- [ ] Estructura de respuesta de login confirmada
- [ ] Refresh token confirmado
- [ ] Estructura de permisos confirmada
- [ ] Endpoints de usuario confirmados
- [ ] Endpoints de workspaces confirmados
- [ ] Endpoints de admin confirmados
- [ ] Códigos de error documentados

---

**Por favor, responder estas preguntas para alinear Frontend y Backend** 🙏


