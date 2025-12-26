# 🔧 CORRECCIÓN REQUERIDA: Migración a v2

## ⚠️ PROBLEMA DETECTADO

**El frontend está usando v1 cuando debería usar v2.**

### Archivos que usan v1 (INCORRECTO):

1. ❌ `app/core/hexag/permissions/infrastructure/repositories/permissions.http.repository.ts`
   - Usa: `/api/v1/access-management`
   - Debería usar: `/api/v2/access-management` (NO EXISTE)

2. ❌ `app/core/hexag/panel-administrativo/infrastructure/repositories/user-http.repository.ts`
   - Usa: `/api/v1/access-management`
   - Debería usar: `/api/v2/access-management` (NO EXISTE)

3. ⚠️ `app/core/hexag/panel-administrativo/infrastructure/repositories/societies-http.repository.ts`
   - Usa: `/api/v1/society-profile/list`
   - Debería verificar si existe: `/api/v2/society-profile/list`

---

## 📋 ESTADO ACTUAL DEL BACKEND

### ✅ Módulos con v2:
- `file-repository` → `v2/repository/...`
- `flows-v2` → `v2/society-profile/...`
- `society-profile` → `v2/society-profile/...` (verificar endpoints específicos)

### ❌ Módulos SIN v2:
- `access-management` → **SOLO v1** (`v1/access-management/...`)

---

## 🎯 ACCIONES REQUERIDAS

### 1. BACKEND: Crear v2 para access-management

**Endpoints a crear:**

```
POST   /v2/access-management/users
GET    /v2/access-management/users
GET    /v2/access-management/users/:id
PATCH  /v2/access-management/users/:id/role
PATCH  /v2/access-management/users/:id/status
DELETE /v2/access-management/users/:id

GET    /v2/access-management/users/:id/access
GET    /v2/access-management/users/:id/access/full
PUT    /v2/access-management/users/:id/access
GET    /v2/access-management/me/access

GET    /v2/access-management/users/:id/societies
POST   /v2/access-management/users/:id/societies

GET    /v2/access-management/roles
```

**Estructura propuesta:**
```
src/modules/access-management/
  ├── presentation/
  │   ├── v1/  (mantener)
  │   │   └── access-management.controller.ts
  │   └── v2/  (CREAR)
  │       └── access-management-v2.controller.ts
```

### 2. FRONTEND: Cambiar a v2 cuando esté disponible

**Archivos a modificar:**

1. `permissions.http.repository.ts`
   ```typescript
   // Cambiar de:
   private readonly basePath = '/api/v1/access-management';
   // A:
   private readonly basePath = '/api/v2/access-management';
   ```

2. `user-http.repository.ts`
   ```typescript
   // Cambiar de:
   private readonly basePath = '/api/v1/access-management';
   // A:
   private readonly basePath = '/api/v2/access-management';
   ```

3. `societies-http.repository.ts`
   ```typescript
   // Verificar si existe v2, si no, mantener v1
   private readonly basePath = '/api/v2/society-profile'; // o v1 si no existe
   ```

---

## 📝 PLAN DE ACCIÓN

### Fase 1: Backend (PRIORITARIO)
- [ ] Crear `v2/access-management-v2.controller.ts`
- [ ] Implementar todos los endpoints v2
- [ ] Mantener v1 para compatibilidad
- [ ] Documentar endpoints v2

### Fase 2: Frontend
- [ ] Esperar a que backend tenga v2
- [ ] Cambiar `basePath` en repositorios
- [ ] Probar todos los endpoints
- [ ] Verificar que todo funcione

---

## ⚠️ IMPORTANTE

**NO cambiar el frontend a v2 hasta que el backend tenga v2 implementado.**

**Por ahora:**
- Mantener v1 en frontend
- Documentar que falta v2 en backend
- Crear v2 en backend primero

---

**Fecha:** $(date)  
**Estado:** ⚠️ PENDIENTE CREAR V2 EN BACKEND



