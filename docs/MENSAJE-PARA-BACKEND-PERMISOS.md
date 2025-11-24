# 💬 MENSAJE PARA BACKEND: Sistema de Permisos

**Para:** Equipo Backend  
**De:** Frontend  
**Fecha:** Enero 2025  
**Asunto:** Integración de Permisos - Estado Actual y Necesidades

---

## 🎯 CONTEXTO

Hemos implementado el **Entregable 1** del sistema de autenticación y permisos en el frontend. El sistema está diseñado para **NO BLOQUEAR** el trabajo actual del equipo mientras se conecta con el backend.

---

## ✅ LO QUE YA TENEMOS EN FRONTEND

### 1. Sistema de Permisos con Modo Degradado

**Características:**
- ✅ Si `MSW_ROLES_PERMISOS_DISABLED=true` → Permite todo (no bloquea)
- ✅ Si no hay permisos → Permite todo (no bloquea)
- ✅ Si hay permisos → Verifica normalmente

**Objetivo:** Que el equipo trabajando en registro de sociedades **NO se vea bloqueado**.

### 2. Mapper Backend → Frontend

**Archivo:** `app/core/shared/mappers/permissions.mapper.ts`

**Función:** `mapBackendAccessMapToUserPermissions()`

**Convierte:**
```typescript
// Backend (lo que ya tienen)
{
  code: "SOCIETY_PROFILE",
  modules: [
    { name: "SOCIETY", actions: ["read", "write"] }
  ]
}[]

// Frontend (lo que necesitamos)
{
  systemFeatures: {
    societies: { create: true, read: true, update: true, delete: false }
  }
}
```

**✅ Ya está listo para usar con su estructura actual.**

---

## 📋 LO QUE NECESITAMOS DEL BACKEND

### 1. Endpoint: Obtener Usuario Actual

**Ruta:** `GET /api/v2/user/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "code": 200,
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
    "accessMap": [
      {
        "code": "SOCIETY_PROFILE",
        "modules": [
          {
            "name": "SOCIETY",
            "actions": ["read", "write", "delete"]
          },
          {
            "name": "SHAREHOLDER",
            "actions": ["read", "write"]
          }
        ]
      }
    ]
  }
}
```

**Notas:**
- `accessMap` ya lo tienen en `request.accessMap` (según su guard)
- Solo necesitan exponerlo en un endpoint
- El frontend mapeará automáticamente usando nuestro mapper

---

### 2. Endpoint: Refresh Token (Opcional, pero recomendado)

**Ruta:** `POST /api/v2/auth/refresh`

**Body:**
```json
{
  "refreshToken": "refresh-token-here"
}
```

**Respuesta Esperada:**
```json
{
  "success": true,
  "code": 200,
  "data": {
    "token": "new-jwt-token",
    "refreshToken": "new-refresh-token",
    "expiresIn": 3600
  }
}
```

**Nota:** Si no tienen refresh token aún, podemos implementarlo después.

---

## 🔄 CÓMO FUNCIONA LA INTEGRACIÓN

### Flujo Actual (Sin Backend):

1. Usuario hace login → Token almacenado
2. Frontend usa modo degradado → Permite todo
3. Equipo sigue trabajando normalmente

### Flujo Futuro (Con Backend):

1. Usuario hace login → Token almacenado
2. Frontend llama `/api/v2/user/me` → Obtiene `accessMap`
3. Frontend mapea `accessMap` → `UserPermissions`
4. Sistema verifica permisos normalmente

---

## 🛡️ GARANTÍAS PARA EL EQUIPO

### ✅ NO se bloquearán porque:

1. **Modo degradado activo por defecto**
   - Si `MSW_ROLES_PERMISOS_DISABLED=true` → Permite todo
   - Si no hay permisos → Permite todo

2. **Variable de entorno**
   - Pueden deshabilitar permisos fácilmente
   - No afecta el trabajo actual

3. **Mapper preparado**
   - Ya funciona con su estructura actual
   - No necesitan cambiar nada en el backend

---

## 📝 PREGUNTAS ESPECÍFICAS

### 1. ¿Pueden crear el endpoint `/api/v2/user/me`?

**Lo que necesitamos:**
- Devolver `user` (datos del usuario)
- Devolver `accessMap` (ya lo tienen en `request.accessMap`)

**Tiempo estimado:** 1-2 horas

---

### 2. ¿Cómo obtienen el `accessMap` actualmente?

Según su código:
- `JWTAuthGuard` carga `accessMap` en `request.accessMap`
- Usan `mapUserModuleAccess()` para mapearlo

**¿Pueden exponer esto en un endpoint?**

---

### 3. ¿Tienen refresh token implementado?

Si no, podemos implementarlo después. No es crítico ahora.

---

## 🎯 PRÓXIMOS PASOS

### Para Backend:

1. **Crear endpoint `/api/v2/user/me`** (1-2 horas)
   - Devolver `user` + `accessMap`
   - Usar el mismo `mapUserModuleAccess()` que ya tienen

2. **Probar con frontend** (30 min)
   - Frontend mapeará automáticamente
   - Verificar que permisos funcionan

### Para Frontend:

1. **Conectar con endpoint** (cuando esté listo)
2. **Deshabilitar modo degradado** (activar permisos reales)
3. **Probar flujo completo**

---

## ✅ CONCLUSIÓN

**Estado Actual:**
- ✅ Frontend listo y funcionando
- ✅ Mapper preparado para su estructura
- ✅ Modo degradado NO bloquea al equipo
- ⏳ Solo falta endpoint `/api/v2/user/me`

**Tiempo Estimado Backend:** 1-2 horas

**¿Pueden crear el endpoint?** 🙏

---

**Gracias por su tiempo** 🙌


