# 🔧 SOLUCIÓN: Problema de Login con usuario101@gmail.com

## ❌ PROBLEMA

El usuario `usuario101@gmail.com` no puede hacer login.

**Causa:** El endpoint de login verifica que el usuario tenga `status: true`. Si el usuario fue eliminado (soft delete), su `status` queda en `false` y no puede iniciar sesión.

**Código del backend:**

```typescript
// probo-api-v30/src/modules/auth/infrastructure/datasource/auth.datasource.impl.ts
if (!user || !user.status) {
  throw new UnauthorizedException("Credenciales inválidas");
}
```

---

## ✅ SOLUCIONES

### Opción 1: Reactivar el Usuario desde la Base de Datos

**Si el usuario existe pero está desactivado:**

```sql
-- Conectar a la base de datos y ejecutar:
UPDATE "UserV2"
SET "status" = true
WHERE "email" = 'usuario101@gmail.com';
```

---

### Opción 2: Reactivar desde el Panel Administrativo

1. **Iniciar sesión con otro usuario administrador**
2. **Ir a:** `http://localhost:3002/admin/panel`
3. **Buscar el usuario** `usuario101@gmail.com`
4. **Activar el toggle de estado** (si está desactivado)

---

### Opción 3: Crear el Usuario Nuevamente

**Si el usuario no existe en la base de datos:**

1. **Iniciar sesión con otro usuario administrador**
2. **Ir a:** `http://localhost:3002/admin/panel`
3. **Hacer clic en "Crear Usuario"**
4. **Completar el formulario:**
   - Email: `usuario101@gmail.com`
   - Contraseña: `#Admin2025-probo!`
   - Rol: Seleccionar "SuperAdministrador" o "Administrador"

---

### Opción 4: Script SQL para Verificar y Reactivar

```sql
-- 1. Verificar si el usuario existe y su estado
SELECT id, email, "status", "roleId", "studyId", "createdAt", "updatedAt"
FROM "UserV2"
WHERE email = 'usuario101@gmail.com';

-- 2. Si existe pero está desactivado, reactivarlo:
UPDATE "UserV2"
SET "status" = true,
    "updatedAt" = NOW()
WHERE email = 'usuario101@gmail.com';

-- 3. Verificar que se reactivó:
SELECT id, email, "status"
FROM "UserV2"
WHERE email = 'usuario101@gmail.com';
```

---

## 🔍 VERIFICACIÓN

### Verificar el Estado del Usuario

**Opción A: Desde el Backend (API)**

```bash
# Obtener todos los usuarios (requiere autenticación)
curl -X GET "http://localhost:3000/api/v2/access-management/users" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Buscar usuario101@gmail.com en la respuesta
```

**Opción B: Desde la Base de Datos**

```sql
SELECT
  id,
  email,
  "status",
  "roleId",
  "studyId",
  "createdAt",
  "updatedAt"
FROM "UserV2"
WHERE email = 'usuario101@gmail.com';
```

---

## 📝 NOTAS IMPORTANTES

1. **El método `deleteUser()` hace SOFT DELETE:**

   - No elimina el usuario de la base de datos
   - Solo cambia `status: false`
   - El usuario no puede hacer login si `status: false`

2. **El login verifica `status: true`:**

   - Si `status: false`, el login falla con "Credenciales inválidas"
   - Esto es por seguridad

3. **Para reactivar un usuario:**
   - Usar `updateUserStatus(userId, true)` desde el panel
   - O ejecutar SQL directamente en la base de datos

---

## 🚨 PREVENCIÓN

Para evitar que esto vuelva a pasar:

1. **No eliminar usuarios de prueba importantes:**

   - Marcar como "no eliminables" en el código
   - O usar un flag `canDelete: false`

2. **Agregar confirmación antes de eliminar:**

   - Ya está implementado en el frontend
   - Verificar que el usuario no sea crítico antes de eliminar

3. **Mantener backup de usuarios importantes:**
   - Guardar IDs de usuarios críticos
   - Tener script de restauración

---

**Fecha:** $(date)  
**Estado:** ✅ **SOLUCIÓN DISPONIBLE**
