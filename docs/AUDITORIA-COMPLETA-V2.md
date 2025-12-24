# 🔍 AUDITORÍA COMPLETA - Migración a v2

## 📋 ESTADO ACTUAL

### ❌ PROBLEMA DETECTADO

**El backend NO tiene v2 para `access-management` todavía.**

**Evidencia:**

- ✅ Solo existe `presentation/v1/` en `access-management`
- ✅ El módulo solo registra controllers v1
- ❌ No hay archivos `*v2*` en el módulo
- ❌ No hay carpeta `presentation/v2/`

### 📊 Frontend Actual (INCORRECTO)

**Archivos que usan v1:**

1. ❌ `permissions.http.repository.ts`

   ```typescript
   private readonly basePath = '/api/v1/access-management';
   ```

2. ❌ `user-http.repository.ts`

   ```typescript
   private readonly basePath = '/api/v1/access-management';
   ```

3. ⚠️ `societies-http.repository.ts`
   ```typescript
   private readonly basePath = '/api/v1/society-profile';
   ```
   (Este podría tener v2, verificar)

---

## 🎯 ENDPOINTS QUE NECESITAMOS EN v2

### Usuarios

| Método   | Endpoint v1 Actual                       | Endpoint v2 Necesario                    | Estado       |
| -------- | ---------------------------------------- | ---------------------------------------- | ------------ |
| `GET`    | `/v1/access-management/users`            | `/v2/access-management/users`            | ❌ NO EXISTE |
| `GET`    | `/v1/access-management/users/:id`        | `/v2/access-management/users/:id`        | ❌ NO EXISTE |
| `POST`   | `/v1/access-management/users`            | `/v2/access-management/users`            | ❌ NO EXISTE |
| `PATCH`  | `/v1/access-management/users/:id/role`   | `/v2/access-management/users/:id/role`   | ❌ NO EXISTE |
| `PATCH`  | `/v1/access-management/users/:id/status` | `/v2/access-management/users/:id/status` | ❌ NO EXISTE |
| `DELETE` | `/v1/access-management/users/:id`        | `/v2/access-management/users/:id`        | ❌ NO EXISTE |

### Permisos

| Método | Endpoint v1 Actual                            | Endpoint v2 Necesario                         | Estado       |
| ------ | --------------------------------------------- | --------------------------------------------- | ------------ |
| `GET`  | `/v1/access-management/users/:id/access`      | `/v2/access-management/users/:id/access`      | ❌ NO EXISTE |
| `GET`  | `/v1/access-management/users/:id/access/full` | `/v2/access-management/users/:id/access/full` | ❌ NO EXISTE |
| `PUT`  | `/v1/access-management/users/:id/access`      | `/v2/access-management/users/:id/access`      | ❌ NO EXISTE |
| `GET`  | `/v1/access-management/me/access`             | `/v2/access-management/me/access`             | ❌ NO EXISTE |

### Sociedades

| Método | Endpoint v1 Actual                          | Endpoint v2 Necesario                       | Estado       |
| ------ | ------------------------------------------- | ------------------------------------------- | ------------ |
| `GET`  | `/v1/access-management/users/:id/societies` | `/v2/access-management/users/:id/societies` | ❌ NO EXISTE |
| `POST` | `/v1/access-management/users/:id/societies` | `/v2/access-management/users/:id/societies` | ❌ NO EXISTE |

### Roles

| Método | Endpoint v1 Actual            | Endpoint v2 Necesario         | Estado       |
| ------ | ----------------------------- | ----------------------------- | ------------ |
| `GET`  | `/v1/access-management/roles` | `/v2/access-management/roles` | ❌ NO EXISTE |

---

## 📝 ESTRUCTURA QUE DEBE CREARSE EN BACKEND

### Estructura de Carpetas

```
src/modules/access-management/
  ├── presentation/
  │   ├── v1/  (mantener para compatibilidad)
  │   │   ├── access-management.controller.ts
  │   │   └── superadmin.controller.ts
  │   └── v2/  (CREAR NUEVO)
  │       ├── access-management-v2.controller.ts
  │       └── superadmin-v2.controller.ts
  ├── domain/  (compartido, no cambiar)
  ├── infrastructure/  (compartido, no cambiar)
  └── access-management.module.ts  (actualizar para registrar v2)
```

### Controller v2 Propuesto

**Archivo:** `presentation/v2/access-management-v2.controller.ts`

```typescript
@Controller("v2/access-management")
@ApiTags("Access Management V2")
@ApiBearerAuth()
export class AccessManagementV2Controller {
  // Mismos use cases que v1
  // Misma lógica
  // Solo cambiar rutas a v2
}
```

---

## 🔧 PLAN DE ACCIÓN

### Fase 1: Backend (CRÍTICO)

#### Paso 1: Crear Controller v2

- [ ] Crear `presentation/v2/access-management-v2.controller.ts`
- [ ] Copiar estructura de v1
- [ ] Cambiar `@Controller('v1/...')` a `@Controller('v2/...')`
- [ ] Usar `AuthV2()` en lugar de `Auth()` (si aplica)
- [ ] Mantener misma lógica de use cases

#### Paso 2: Registrar en Módulo

- [ ] Actualizar `access-management.module.ts`
- [ ] Agregar `AccessManagementV2Controller` a controllers
- [ ] Mantener v1 para compatibilidad

#### Paso 3: Verificar Autenticación

- [ ] Verificar que `AuthV2()` funcione correctamente
- [ ] Verificar que `req.user` tenga estructura v2 (UUIDs en lugar de IDs numéricos)

### Fase 2: Frontend (Después de Backend)

#### Paso 1: Actualizar Repositorios

- [ ] Cambiar `basePath` en `permissions.http.repository.ts`
- [ ] Cambiar `basePath` en `user-http.repository.ts`
- [ ] Verificar `societies-http.repository.ts` (puede que ya tenga v2)

#### Paso 2: Probar Endpoints

- [ ] Probar cada endpoint v2
- [ ] Verificar respuestas
- [ ] Verificar manejo de errores

---

## ⚠️ DIFERENCIAS ESPERADAS ENTRE v1 y v2

### Autenticación

- **v1:** Usa IDs numéricos (`userId: number`, `studyId: number`)
- **v2:** Usa UUIDs (`userId: string (UUID)`, `studyId: string (UUID)`)

### Decoradores

- **v1:** `@Auth()` → `AuthRequest` con IDs numéricos
- **v2:** `@AuthV2()` → `AuthRequestV2` con UUIDs

### Estructura de Request

```typescript
// v1
req.user = {
  userId: 123,
  studyId: 456,
  role: "Administrador",
};

// v2
req.user = {
  userId: "uuid-123",
  studyId: "uuid-456",
  role: "Administrador",
};
```

---

## 📊 IMPACTO EN FRONTEND

### Archivos a Modificar

1. **`permissions.http.repository.ts`**

   ```typescript
   // Cambiar de:
   private readonly basePath = '/api/v1/access-management';
   // A:
   private readonly basePath = '/api/v2/access-management';
   ```

2. **`user-http.repository.ts`**

   ```typescript
   // Cambiar de:
   private readonly basePath = '/api/v1/access-management';
   // A:
   private readonly basePath = '/api/v2/access-management';
   ```

3. **`societies-http.repository.ts`**
   ```typescript
   // Verificar si existe v2, si no mantener v1
   // Buscar: GET /v2/society-profile/list
   ```

### Cambios en DTOs (si aplica)

Si el backend v2 cambia la estructura de respuestas:

- Actualizar mappers
- Actualizar tipos TypeScript
- Verificar compatibilidad

---

## ✅ CHECKLIST FINAL

### Backend

- [ ] Controller v2 creado
- [ ] Todos los endpoints v2 implementados
- [ ] Registrado en módulo
- [ ] Autenticación v2 funcionando
- [ ] Tests actualizados

### Frontend

- [ ] Repositorios actualizados a v2
- [ ] Todos los endpoints probados
- [ ] Manejo de errores verificado
- [ ] Tipos actualizados (si aplica)

---

## 🚨 IMPORTANTE

**NO cambiar el frontend hasta que el backend tenga v2 funcionando.**

**Orden de trabajo:**

1. ✅ Backend crea v2
2. ✅ Backend prueba v2
3. ✅ Frontend actualiza a v2
4. ✅ Frontend prueba v2

---

**Fecha:** $(date)  
**Estado:** ⚠️ PENDIENTE CREAR V2 EN BACKEND
