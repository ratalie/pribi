# 💬 MENSAJE PARA FRONTEND: Plan Completo Sistema v3

**Para:** Equipo Frontend  
**De:** Backend  
**Fecha:** Enero 2025  
**Asunto:** Plan Completo para Implementar Sistema de Permisos v3

---

## 🎯 CONTEXTO

Hemos definido un **sistema de permisos v3** basado en strings con nomenclatura consistente. Este documento explica qué necesitamos hacer para que el frontend pueda gestionar usuarios, roles y permisos desde un dashboard.

---

## 📋 LO QUE TENEMOS ACTUALMENTE

### **1. Sistema de Permisos v3 Definido**

**Nomenclatura:** `{categoria}-{modulo}/{accion}`

**Ejemplos:**
- `registro-sociedad/crear`
- `registro-sociedad/historial`
- `registro-sociedad/dashboard`
- `operacion-junta-accionistas/crear`

**Ventajas:**
- ✅ Simple y directo
- ✅ Extensible (puedes agregar `registro-sociedad/contratos` sin problema)
- ✅ Controla acceso a páginas específicas

---

### **2. Endpoints que SÍ Funcionan**

- ✅ `POST /api/v2/auth` - Login
- ✅ `GET /api/v2/society-profile/list` - Listar sociedades
- ✅ `POST /api/v2/society-profile` - Crear sociedad
- ✅ Endpoints de repositorio funcionando

---

## ❌ LO QUE FALTA

### **Endpoints Críticos (Necesarios para funcionar):**

1. **Auth:**
   - ❌ `GET /api/v2/user/me` - Obtener usuario actual + permisos
   - ❌ `POST /api/v2/auth/refresh` - Refresh token

2. **Gestión de Usuarios (Admin Panel):**
   - ❌ `GET /api/v2/admin/users` - Listar usuarios
   - ❌ `GET /api/v2/admin/users/:id` - Obtener usuario
   - ❌ `POST /api/v2/admin/users` - Crear usuario
   - ❌ `PUT /api/v2/admin/users/:id` - Actualizar usuario
   - ❌ `DELETE /api/v2/admin/users/:id` - Desactivar usuario

3. **Gestión de Permisos:**
   - ❌ `GET /api/v2/admin/permissions/v3` - Listar permisos disponibles
   - ❌ `GET /api/v2/admin/users/:id/permissions` - Obtener permisos de usuario
   - ❌ `POST /api/v2/admin/users/:id/permissions/v3` - Asignar permisos
   - ❌ `PUT /api/v2/admin/users/:id/permissions/v3` - Actualizar permisos
   - ❌ `DELETE /api/v2/admin/users/:id/permissions/v3/:permission` - Quitar permiso

4. **Roles:**
   - ❌ `GET /api/v2/admin/roles` - Listar roles disponibles

---

## 🎯 PLAN DE ACCIÓN

### **PASO 1: Backend Prepara Base de Datos (1 día)**

**Qué hace el backend:**
1. Ejecuta script de seed para crear permisos v3 en BD
2. Crea flow "V3" en `FlowV2`
3. Crea usuarios de prueba con diferentes permisos

**Resultado:**
- ✅ Permisos v3 disponibles en BD
- ✅ Usuarios de prueba listos para testing

---

### **PASO 2: Backend Crea Endpoints de Auth (1 día)**

**Qué hace el backend:**
1. Crea `GET /api/v2/user/me`
   - Obtiene usuario actual desde token
   - Carga permisos v3 del usuario
   - Devuelve estructura: `{ user, permissions: [...] }`

2. Crea `POST /api/v2/auth/refresh`
   - Valida refresh token
   - Genera nuevo access token

**Qué hace el frontend:**
1. Después de login, llama a `GET /api/v2/user/me`
2. Almacena permisos en store
3. Usa permisos para controlar acceso a páginas

**Resultado:**
- ✅ Frontend puede obtener usuario y permisos
- ✅ Frontend puede refrescar token

---

### **PASO 3: Backend Crea Endpoints de Gestión de Usuarios (2-3 días)**

**Qué hace el backend:**
1. Crea `GET /api/v2/admin/users`
   - Lista todos los usuarios
   - Paginación y filtros

2. Crea `GET /api/v2/admin/users/:id`
   - Obtiene usuario específico
   - Incluye permisos actuales

3. Crea `POST /api/v2/admin/users`
   - Crea nuevo usuario
   - Asigna rol y estudio

4. Crea `PUT /api/v2/admin/users/:id`
   - Actualiza usuario
   - Cambia rol

5. Crea `DELETE /api/v2/admin/users/:id`
   - Desactiva usuario

**Qué hace el frontend:**
1. Crea página de gestión de usuarios (`/admin/panel`)
2. Lista usuarios usando `GET /api/v2/admin/users`
3. Permite crear/editar usuarios
4. Permite desactivar usuarios

**Resultado:**
- ✅ Frontend puede listar usuarios
- ✅ Frontend puede crear/editar usuarios
- ✅ Frontend puede desactivar usuarios

---

### **PASO 4: Backend Crea Endpoints de Gestión de Permisos (2-3 días)**

**Qué hace el backend:**
1. Crea `GET /api/v2/admin/permissions/v3`
   - Lista todos los permisos v3 disponibles
   - Agrupa por categoría

2. Crea `GET /api/v2/admin/users/:id/permissions`
   - Obtiene permisos del usuario
   - Formato organizado

3. Crea `POST /api/v2/admin/users/:id/permissions/v3`
   - Asigna permisos a usuario
   - Body: `{ permissions: [...] }`

4. Crea `PUT /api/v2/admin/users/:id/permissions/v3`
   - Actualiza permisos del usuario
   - Reemplaza todos los permisos

5. Crea `DELETE /api/v2/admin/users/:id/permissions/v3/:permission`
   - Quita permiso específico

**Qué hace el frontend:**
1. Crea UI para gestionar permisos
2. Muestra permisos disponibles (usando `GET /api/v2/admin/permissions/v3`)
3. Muestra permisos del usuario (usando `GET /api/v2/admin/users/:id/permissions`)
4. Permite asignar/quitar permisos (checkboxes o similar)
5. Guarda cambios usando `POST` o `PUT`

**Resultado:**
- ✅ Frontend puede ver permisos disponibles
- ✅ Frontend puede asignar/quitar permisos
- ✅ Frontend puede gestionar permisos desde dashboard

---

### **PASO 5: Backend Crea Endpoints de Roles (1 día)**

**Qué hace el backend:**
1. Crea `GET /api/v2/admin/roles`
   - Lista todos los roles disponibles

**Qué hace el frontend:**
1. Muestra roles disponibles en dropdown
2. Permite asignar rol al crear/editar usuario

**Resultado:**
- ✅ Frontend puede ver roles disponibles
- ✅ Frontend puede asignar roles a usuarios

---

### **PASO 6: Testing con Varios Usuarios (1 día)**

**Qué hace el backend:**
1. Crea usuarios de prueba:
   - Admin (todos los permisos)
   - Usuario 1 (solo crear sociedades)
   - Usuario 2 (solo ver historial)
   - Usuario 3 (sin permisos)

**Qué hace el frontend:**
1. Prueba login con cada usuario
2. Verifica que solo vea lo permitido
3. Verifica que no pueda acceder a lo bloqueado
4. Prueba gestión desde dashboard (como admin)

**Resultado:**
- ✅ Sistema funcionando con diferentes usuarios
- ✅ Permisos funcionando correctamente
- ✅ Dashboard de gestión funcionando

---

## 📊 ESTRUCTURA DE RESPUESTAS ESPERADAS

### **1. `GET /api/v2/user/me`**

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

**Uso en frontend:**
- Almacenar en store
- Usar para controlar acceso a páginas
- Mostrar en UI

---

### **2. `GET /api/v2/admin/users`**

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

**Uso en frontend:**
- Mostrar lista de usuarios en dashboard
- Paginación
- Filtros

---

### **3. `GET /api/v2/admin/permissions/v3`**

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
      "junta-accionistas": [...],
      "directorio": [...]
    },
    "storage": {
      "almacen": [...],
      "documentos-generados": [...]
    },
    "workspace": [...],
    "chat": [...]
  }
}
```

**Uso en frontend:**
- Mostrar permisos disponibles en UI
- Agrupar por categoría
- Checkboxes para asignar permisos

---

### **4. `GET /api/v2/admin/users/:id/permissions`**

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

**Uso en frontend:**
- Mostrar permisos actuales del usuario
- Pre-seleccionar checkboxes
- Comparar con permisos disponibles

---

## 🎯 CÓMO FUNCIONA EL CONTROL DE ACCESO

### **Flujo Completo:**

```
1. Usuario hace login
   ↓
2. Frontend llama a GET /api/v2/user/me
   ↓
3. Backend devuelve usuario + permisos
   ↓
4. Frontend almacena permisos en store
   ↓
5. Usuario navega a /registros/sociedades/crear
   ↓
6. Middleware intercepta
   ↓
7. Verifica si tiene permiso "registro-sociedad/crear"
   ↓
8. Si tiene → Permite acceso
   Si no → Redirige a /forbidden
```

---

## 📋 MAPEO: Rutas Frontend ↔ Permisos

### **Tabla Completa:**

| Ruta Frontend | Permiso Requerido |
|---------------|-------------------|
| `/registros/sociedades/dashboard` | `registro-sociedad/dashboard` |
| `/registros/sociedades/agregar` | `registro-sociedad/crear` |
| `/registros/sociedades/historial` | `registro-sociedad/historial` |
| `/registros/sucursales/dashboard` | `registro-sucursal/dashboard` |
| `/registros/sucursales/agregar` | `registro-sucursal/crear` |
| `/registros/sucursales/historial` | `registro-sucursal/historial` |
| `/operaciones/junta-accionistas/dashboard` | `operacion-junta-accionistas/dashboard` |
| `/operaciones/junta-accionistas/crear` | `operacion-junta-accionistas/crear` |
| `/operaciones/junta-accionistas/historico` | `operacion-junta-accionistas/historial` |
| `/operaciones/directorio/dashboard` | `operacion-directorio/dashboard` |
| `/operaciones/directorio/crear` | `operacion-directorio/crear` |
| `/operaciones/directorio/historico` | `operacion-directorio/historial` |
| `/storage/almacen` | `storage-almacen/view` |
| `/storage/documentos-generados` | `storage-documentos-generados/view` |
| `/espacios-trabajo/dashboard` | `workspace/dashboard` |
| `/espacios-trabajo/crear` | `workspace/crear` |
| `/espacios-trabajo/espacios` | `workspace/historial` |
| `/chat-ia` | `chat/iniciar` |

---

## 🎨 UI DEL DASHBOARD DE GESTIÓN

### **Página: `/admin/panel`**

**Secciones:**

1. **Lista de Usuarios:**
   - Tabla con usuarios
   - Filtros (por rol, por estudio)
   - Paginación
   - Acciones: Ver, Editar, Desactivar

2. **Gestión de Usuario (Modal o Página):**
   - Información básica (email, nombre, rol)
   - Permisos (checkboxes organizados por categoría)
   - Botones: Guardar, Cancelar

3. **Estructura de Permisos:**
   ```
   ☑ Registro
     ☑ Sociedades
       ☑ Dashboard
       ☑ Crear
       ☐ Historial
     ☐ Sucursales
       ☐ Dashboard
       ☐ Crear
       ☐ Historial
   
   ☑ Operaciones
     ☑ Directorio
       ☑ Dashboard
       ☐ Crear
       ☐ Historial
     ☐ Junta de Accionistas
       ☐ Dashboard
       ☐ Crear
       ☐ Historial
   ```

---

## ✅ CHECKLIST PARA FRONTEND

### **Fase 1: Obtener Usuario y Permisos**
- [ ] Llamar a `GET /api/v2/user/me` después de login
- [ ] Almacenar permisos en store
- [ ] Crear composable `usePermissions()`

### **Fase 2: Middleware de Permisos**
- [ ] Crear middleware `permissions-v3.ts`
- [ ] Mapear rutas a permisos
- [ ] Verificar permisos antes de cargar página
- [ ] Redirigir a `/forbidden` si no tiene permiso

### **Fase 3: Dashboard de Gestión**
- [ ] Crear página `/admin/panel`
- [ ] Listar usuarios (`GET /api/v2/admin/users`)
- [ ] Mostrar permisos disponibles (`GET /api/v2/admin/permissions/v3`)
- [ ] Mostrar permisos del usuario (`GET /api/v2/admin/users/:id/permissions`)
- [ ] UI para asignar/quitar permisos
- [ ] Guardar cambios (`POST` o `PUT`)

### **Fase 4: Testing**
- [ ] Probar con diferentes usuarios
- [ ] Verificar que solo vean lo permitido
- [ ] Verificar que no puedan acceder a lo bloqueado
- [ ] Probar gestión desde dashboard

---

## 🚀 PRÓXIMOS PASOS

### **Backend:**
1. Ejecutar seed de permisos v3 (1 día)
2. Crear endpoints de auth (1 día)
3. Crear endpoints de gestión de usuarios (2-3 días)
4. Crear endpoints de gestión de permisos (2-3 días)
5. Crear endpoints de roles (1 día)

**Total backend: 7-10 días**

### **Frontend:**
1. Implementar obtención de permisos (1 día)
2. Implementar middleware de permisos (1 día)
3. Crear dashboard de gestión (3-4 días)
4. Testing (1 día)

**Total frontend: 6-7 días**

---

## 💬 CONCLUSIÓN

**Con estos endpoints, el frontend podrá:**
- ✅ Obtener usuario y permisos al hacer login
- ✅ Controlar acceso a páginas específicas
- ✅ Listar usuarios desde dashboard
- ✅ Crear/editar usuarios
- ✅ Asignar/quitar permisos
- ✅ Gestionar roles
- ✅ Hacer pruebas con varios usuarios

**¿Podemos coordinar una reunión para alinear esto?** 🙏

---

**Gracias por su tiempo** 🙌

