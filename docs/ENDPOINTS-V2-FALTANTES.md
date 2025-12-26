# ⚠️ ENDPOINTS V2 FALTANTES - Access Management

## 📋 Situación Actual

**PROBLEMA:** El módulo `access-management` del backend **SOLO tiene v1**, no existe v2.

**Otros módulos que SÍ tienen v2:**

- ✅ `file-repository` → `v2/repository/...`
- ✅ `flows-v2` → `v2/society-profile/...`
- ✅ `society-profile` → `v2/society-profile/...`

**Módulo que NO tiene v2:**

- ❌ `access-management` → Solo `v1/access-management/...`

---

## 🔍 ENDPOINTS ACTUALES (v1)

### Usuarios

| Método   | Endpoint v1                              | ¿Existe v2? |
| -------- | ---------------------------------------- | ----------- |
| `GET`    | `/v1/access-management/users`            | ❌ NO       |
| `GET`    | `/v1/access-management/users/:id`        | ❌ NO       |
| `POST`   | `/v1/access-management/users`            | ❌ NO       |
| `PATCH`  | `/v1/access-management/users/:id/role`   | ❌ NO       |
| `PATCH`  | `/v1/access-management/users/:id/status` | ❌ NO       |
| `DELETE` | `/v1/access-management/users/:id`        | ❌ NO       |

### Permisos

| Método | Endpoint v1                                   | ¿Existe v2? |
| ------ | --------------------------------------------- | ----------- |
| `GET`  | `/v1/access-management/users/:id/access`      | ❌ NO       |
| `GET`  | `/v1/access-management/users/:id/access/full` | ❌ NO       |
| `PUT`  | `/v1/access-management/users/:id/access`      | ❌ NO       |
| `GET`  | `/v1/access-management/me/access`             | ❌ NO       |

### Sociedades

| Método | Endpoint v1                                 | ¿Existe v2? |
| ------ | ------------------------------------------- | ----------- |
| `GET`  | `/v1/access-management/users/:id/societies` | ❌ NO       |
| `POST` | `/v1/access-management/users/:id/societies` | ❌ NO       |

### Roles

| Método | Endpoint v1                   | ¿Existe v2? |
| ------ | ----------------------------- | ----------- |
| `GET`  | `/v1/access-management/roles` | ❌ NO       |

### SuperAdmin

| Método | Endpoint v1                             | ¿Existe v2? |
| ------ | --------------------------------------- | ----------- |
| `POST` | `/v1/superadmin/studies/:studyId/users` | ❌ NO       |
| `PUT`  | `/v1/superadmin/studies/:id/modules`    | ❌ NO       |

---

## 🎯 OPCIONES

### Opción 1: Crear v2 en el Backend (RECOMENDADO)

**Ventajas:**

- ✅ Consistencia con otros módulos
- ✅ Mejor arquitectura
- ✅ Preparado para el futuro

**Desventajas:**

- ⚠️ Requiere trabajo en backend
- ⚠️ Tiempo de desarrollo

**Endpoints a crear:**

```
v2/access-management/users
v2/access-management/users/:id
v2/access-management/users/:id/access
v2/access-management/users/:id/access/full
v2/access-management/users/:id/societies
v2/access-management/roles
v2/access-management/me/access
```

### Opción 2: Usar v1 Temporalmente

**Ventajas:**

- ✅ Funciona inmediatamente
- ✅ No requiere cambios en backend

**Desventajas:**

- ❌ Inconsistente con otros módulos
- ❌ No sigue el estándar v2

---

## 📝 RECOMENDACIÓN

**Crear v2 en el backend** para mantener consistencia con el resto del sistema.

**Estructura propuesta:**

```
src/modules/access-management/
  ├── presentation/
  │   ├── v1/  (mantener para compatibilidad)
  │   │   └── access-management.controller.ts
  │   └── v2/  (NUEVO)
  │       └── access-management-v2.controller.ts
```

---

## 🔧 ACCIÓN REQUERIDA

**DECISIÓN NECESARIA:**

1. ¿Crear v2 en el backend? → Requiere trabajo en backend
2. ¿Usar v1 temporalmente? → Frontend puede usar v1 mientras se crea v2

**Por favor, indica qué prefieres:**

- [ ] Crear v2 en backend (recomendado)
- [ ] Usar v1 temporalmente

---

**Fecha:** $(date)  
**Estado:** ⚠️ PENDIENTE DECISIÓN


