# 🔐 Flujo del Primer Usuario y Gestión de Usuarios

## 📋 Resumen

Este documento explica cómo funciona el flujo del primer usuario y cómo se gestionan los usuarios en el sistema.

---

## 🎯 FLUJO DEL PRIMER USUARIO

### Opción 1: Creación Manual (Recomendado para el primer usuario)

El **primer usuario** (SuperAdmin o Admin) se crea **manualmente** en la base de datos o mediante un script de seed.

#### Pasos:

1. **Crear usuario en la base de datos directamente**
   ```sql
   -- Ejemplo (ajustar según tu schema)
   INSERT INTO "UserV2" (id, email, password, "roleId", "studyId", status)
   VALUES (
     gen_random_uuid(),
     'admin@probo.com',
     '$2b$10$...', -- Hash bcrypt de la contraseña
     'uuid-role-admin',
     'uuid-study',
     true
   );
   ```

2. **O usar un script de seed/migración**
   - El backend puede tener un script que crea el primer usuario
   - Se ejecuta una sola vez al inicializar el sistema

3. **Login con el primer usuario**
   - Email: `admin@probo.com`
   - Password: La contraseña que configuraste

4. **Crear más usuarios desde el panel**
   - Una vez logueado como Admin, puedes crear más usuarios
   - Usa el endpoint: `POST /v1/access-management/users`

---

### Opción 2: SuperAdmin crea usuarios

Si ya tienes un **SuperAdmin**, este puede crear usuarios para cualquier estudio:

**Endpoint:** `POST /v1/superadmin/studies/:studyId/users`

```json
{
  "email": "nuevo@ejemplo.com",
  "password": "#Clave2025",
  "roleId": "uuid-role-admin"
}
```

---

## 🔄 FLUJO COMPLETO DE GESTIÓN DE USUARIOS

### 1. Primer Usuario (Setup Inicial)

```
┌─────────────────────────────────────┐
│  Setup Inicial del Sistema          │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Crear primer usuario manualmente   │
│  (Base de datos o script seed)      │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Login con primer usuario           │
│  (admin@probo.com)                  │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Usuario puede crear más usuarios    │
│  desde el panel administrativo      │
└─────────────────────────────────────┘
```

### 2. Crear Usuarios desde el Panel (Admin)

```
┌─────────────────────────────────────┐
│  Admin logueado                     │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Ir a /admin/panel                  │
│  (Panel Administrativo)              │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Click en "Crear Usuario"           │
│  (Botón en header)                   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Modal de creación                  │
│  - Email                            │
│  - Password (mínimo 8 caracteres)   │
│  - Rol (dropdown)                   │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  POST /v1/access-management/users   │
│  {                                  │
│    "email": "nuevo@ejemplo.com",    │
│    "password": "#Clave2025",        │
│    "roleId": "uuid-role-admin"      │
│  }                                  │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Usuario creado                     │
│  - Se asigna automáticamente al     │
│    estudio del Admin                │
│  - Se le asigna el rol seleccionado │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Configurar permisos (opcional)     │
│  - Ir a /admin/usuarios/[id]/permisos│
│  - Configurar módulos, sociedades,  │
│    acciones                          │
└─────────────────────────────────────┘
```

---

## 🔑 GESTIÓN DE CONTRASEÑAS Y CORREOS

### Contraseñas

1. **Al crear usuario:**
   - El Admin define la contraseña inicial
   - Mínimo 8 caracteres (validación del backend)
   - Se hashea con bcrypt antes de guardar

2. **Primer login:**
   - El usuario usa la contraseña que le dio el Admin
   - Puede cambiarla después (si hay funcionalidad de cambio)

3. **Recomendación:**
   - Enviar contraseña temporal por email (si hay servicio de email)
   - Forzar cambio de contraseña en primer login
   - O compartir contraseña de forma segura

### Correos

1. **Validación:**
   - El backend valida que el email sea válido
   - El backend valida que el email no esté duplicado

2. **Uso:**
   - El email es el identificador único del usuario
   - Se usa para login
   - Se puede usar para recuperación de contraseña (si está implementado)

---

## 📝 ENDPOINTS DISPONIBLES

### Para Admin (dentro de su estudio)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/v1/access-management/users` | Crear usuario en mi estudio |
| `GET` | `/v1/access-management/users` | Listar usuarios de mi estudio |
| `GET` | `/v1/access-management/users/:id` | Obtener usuario por ID |
| `PATCH` | `/v1/access-management/users/:id/role` | Actualizar rol de usuario |
| `PATCH` | `/v1/access-management/users/:id/status` | Activar/desactivar usuario |
| `DELETE` | `/v1/access-management/users/:id` | Eliminar usuario |
| `GET` | `/v1/access-management/roles` | Listar roles disponibles |

### Para SuperAdmin

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/v1/superadmin/studies/:studyId/users` | Crear usuario en estudio específico |

---

## ⚠️ IMPORTANTE: Funcionalidad Faltante en Frontend

### ❌ Crear Usuario

**Estado:** No implementado en el frontend

**Qué falta:**
- Formulario/modal para crear usuario
- Campos: email, password, rol
- Validación de email y password
- Integración con `POST /v1/access-management/users`

**Recomendación:**
- Agregar botón "Crear Usuario" en `/admin/panel`
- Modal con formulario
- Validación en tiempo real
- Feedback visual de éxito/error

### ❌ Eliminar Usuario

**Estado:** Botón existe pero no funciona

**Qué falta:**
- Integración con `DELETE /v1/access-management/users/:id`
- Modal de confirmación
- Feedback visual

### ❌ Activar/Desactivar Usuario

**Estado:** No implementado

**Qué falta:**
- Toggle switch para cambiar estado
- Integración con `PATCH /v1/access-management/users/:id/status`
- Feedback visual

---

## 🎯 RECOMENDACIONES

### Para el Primer Usuario

1. **Crear manualmente en la base de datos** (más seguro)
2. **O usar un script de seed** (más automatizado)
3. **Documentar credenciales** en lugar seguro
4. **Forzar cambio de contraseña** en primer login (si está implementado)

### Para Crear Usuarios del Equipo

1. **Admin crea usuarios** desde el panel
2. **Compartir credenciales** de forma segura (email, mensaje privado, etc.)
3. **Configurar permisos** después de crear
4. **Asignar sociedades** según necesidad

### Mejoras Futuras

1. **Sistema de invitaciones por email**
   - Enviar link de registro
   - Usuario define su propia contraseña
   - Más seguro y profesional

2. **Recuperación de contraseña**
   - "Olvidé mi contraseña"
   - Envío de link de reset
   - Cambio seguro de contraseña

3. **Autenticación de dos factores (2FA)**
   - Mayor seguridad
   - Protección adicional

---

## 📚 Referencias

- Backend Controller: `probo-api-v30/src/modules/access-management/presentation/v1/access-management.controller.ts`
- Create User DTO: `probo-api-v30/src/modules/access-management/domain/dtos/create-user.dto.ts`
- Repository: `probo-api-v30/src/modules/access-management/infrastructure/repositories/access-management.repository.impl.ts`



