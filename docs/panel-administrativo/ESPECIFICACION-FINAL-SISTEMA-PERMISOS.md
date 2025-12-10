# 📋 ESPECIFICACIÓN FINAL: Sistema de Permisos y Roles

**Fecha:** Diciembre 2024  
**Estado:** ✅ ESPECIFICACIÓN COMPLETA  
**Basado en:** Comunicación con usuario y backend

---

## 🎯 CONCEPTOS CLAVE

### 1. **Roles vs Permisos**

**Roles** = Permisos de usuario (qué puede hacer)

- `lector` - Solo lectura
- `editor` - Puede editar
- `admin` - Administrador completo
- `user` - Usuario normal

**Permisos** = Acceso a rutas específicas (dónde puede ir)

- Lista de rutas con checkboxes
- Control granular de acceso

### 2. **Flujo de Creación de Usuario**

```
1. Crear usuario con rol general (lector, editor, admin, user)
   ↓
2. Usuario creado SIN sociedades asignadas aún
   ↓
3. Cuando hay sociedades registradas:
   - Asignar usuario a una o varias sociedades
   - Configurar permisos por ruta (checkboxes)
```

---

## 🗺️ RUTAS DEL SISTEMA

### Rutas que el Admin puede Administrar

```
📁 REGISTROS
├── /registros/sociedades
├── /registros/sociedades/dashboard
├── /registros/sociedades/historial
└── /registros/sociedades/crear

📁 OPERACIONES
├── /operaciones/junta-accionistas/dashboard
├── /operaciones/junta-accionistas/historial
└── /operaciones/junta-accionistas/crear

📁 REPOSITORIO AI
├── /repositorio-ai/carpetas-personalizadas
├── /repositorio-ai/documentos-societarios
├── /repositorio-ai/archivos-generados
├── /repositorio-ai/dashboard
└── /repositorio-ai/chat-ia
```

**Nota:** El admin debe tener libertad para administrar accesos a estas rutas.

---

## 🏗️ ESTRUCTURA DEL PANEL ADMINISTRATIVO

### 3 Secciones Principales

#### **1. Permisos del Usuario** (Roles)

**Descripción:** Configurar el rol general del usuario

**Opciones:**

- `lector` - Solo lectura
- `editor` - Puede editar
- `admin` - Administrador completo
- `user` - Usuario normal

**UI:** Selector/Dropdown de roles

---

#### **2. Permisos por Sociedad: Rutas** (Checkboxes)

**Descripción:** Configurar qué rutas puede acceder el usuario

**Rutas disponibles:**

```
☑️ /registros/sociedades
☑️ /registros/sociedades/dashboard
☑️ /registros/sociedades/historial
☑️ /registros/sociedades/crear
☑️ /operaciones/junta-accionistas/dashboard
☑️ /operaciones/junta-accionistas/historial
☑️ /operaciones/junta-accionistas/crear
☑️ /repositorio-ai/carpetas-personalizadas
☑️ /repositorio-ai/documentos-societarios
☑️ /repositorio-ai/archivos-generados
☑️ /repositorio-ai/dashboard
☑️ /repositorio-ai/chat-ia
```

**UI:** Lista de checkboxes por ruta

**Nota:** Por ahora NO es granular por sociedad. Las rutas son globales.

---

#### **3. Sociedades** (Asignación)

**Descripción:** Asignar usuario a una o varias sociedades

**Comportamiento según Rol:**

**3.1. Usuario LECTOR:**

- Por defecto: **DESACTIVADO** (no puede asignar sociedades)
- Solo muestra: **Selector de sociedades** (dropdown/select)
- Puede seleccionar UNA sociedad

**3.2. Usuario NO-LECTOR (editor, admin, user):**

- Muestra: **Checkbox para asignar a varias sociedades**
- Puede seleccionar MÚLTIPLES sociedades
- Cada sociedad tiene un checkbox

**UI Ejemplo:**

```vue
<!-- Para LECTOR -->
<select>
  <option>Sociedad 1</option>
  <option>Sociedad 2</option>
</select>

<!-- Para NO-LECTOR -->
<div>
  ☑️ Sociedad ABC
  ☑️ Sociedad XYZ
  ☐ Sociedad DEF
</div>
```

---

## ⚠️ LO QUE NO SE IMPLEMENTARÁ (Por Ahora)

### NO será Granular por Sociedad

**Ejemplo de lo que NO haremos:**

```
❌ En Sociedad A: Usuario es LECTOR
❌ En Sociedad B: Usuario es EDITOR
❌ En Sociedad C: Usuario es ADMIN
```

**Lo que SÍ haremos:**

```
✅ Usuario tiene rol general: EDITOR
✅ Usuario tiene acceso a rutas: [lista de rutas]
✅ Usuario está asignado a sociedades: [Sociedad A, Sociedad B]
```

**No es combinación de valores y arrays complejos.**

---

## 🔌 ENDPOINTS BACKEND

### 1. Login

```
POST /api/v2/auth
Body: { email, password }
Response: {
  token: "JWT...",
  studyName: "...",
  roleName: "Administrador"
}
```

### 2. Obtener Usuario Completo (NUEVO)

```
GET /api/v2/users/me
Headers: { Authorization: Bearer <token> }
Response: {
  id: string;
  email: string;
  name: string;
  role: "lector" | "editor" | "admin" | "user";
  routePermissions: string[]; // Lista de rutas permitidas
  assignedSocieties: string[]; // IDs de sociedades asignadas
}
```

**Nota:** Por ahora mapear variables mock. Cuando backend esté listo, solo reformular el puerto.

---

## 📦 ESTRUCTURA DE DATOS

### Usuario Completo

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: "lector" | "editor" | "admin" | "user";
  routePermissions: string[]; // Rutas permitidas
  assignedSocieties: string[]; // IDs de sociedades asignadas
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Permisos por Ruta

```typescript
interface RoutePermission {
  route: string; // Ej: "/registros/sociedades/dashboard"
  allowed: boolean;
}
```

### Asignación de Sociedades

```typescript
interface SocietyAssignment {
  userId: string;
  societyIds: string[]; // Múltiples sociedades
}
```

---

## 🎨 UI DEL PANEL ADMINISTRATIVO

### Vista: Configurar Permisos de Usuario

```
┌─────────────────────────────────────────────────────────────┐
│  ⚙️ Configurar Permisos - user@probo.com                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [1. Permisos del Usuario] [2. Rutas] [3. Sociedades]       │
│                                                              │
│  ┌─ 1. Permisos del Usuario ───────────────────────────┐   │
│  │                                                       │   │
│  │  Rol: [Admin ▼]                                      │   │
│  │    • Lector                                           │   │
│  │    • Editor                                           │   │
│  │    • Admin                                            │   │
│  │    • User                                             │   │
│  │                                                       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─ 2. Rutas ───────────────────────────────────────────┐   │
│  │                                                       │   │
│  │  📁 Registros                                         │   │
│  │    ☑️ /registros/sociedades                           │   │
│  │    ☑️ /registros/sociedades/dashboard                │   │
│  │    ☑️ /registros/sociedades/historial                │   │
│  │    ☑️ /registros/sociedades/crear                    │   │
│  │                                                       │   │
│  │  📁 Operaciones                                       │   │
│  │    ☑️ /operaciones/junta-accionistas/dashboard       │   │
│  │    ☑️ /operaciones/junta-accionistas/historial       │   │
│  │    ☑️ /operaciones/junta-accionistas/crear           │   │
│  │                                                       │   │
│  │  📁 Repositorio AI                                    │   │
│  │    ☑️ /repositorio-ai/carpetas-personalizadas        │   │
│  │    ☑️ /repositorio-ai/documentos-societarios         │   │
│  │    ☑️ /repositorio-ai/archivos-generados              │   │
│  │    ☑️ /repositorio-ai/dashboard                       │   │
│  │    ☑️ /repositorio-ai/chat-ia                         │   │
│  │                                                       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─ 3. Sociedades ───────────────────────────────────────┐   │
│  │                                                       │   │
│  │  <!-- Si rol es LECTOR -->                           │   │
│  │  <select>                                            │   │
│  │    <option>Sociedad ABC</option>                     │   │
│  │    <option>Sociedad XYZ</option>                     │   │
│  │  </select>                                           │   │
│  │                                                       │   │
│  │  <!-- Si rol NO es LECTOR -->                        │   │
│  │  ☑️ Sociedad ABC                                      │   │
│  │  ☑️ Sociedad XYZ                                      │   │
│  │  ☐ Sociedad DEF                                      │   │
│  │                                                       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  [Cancelar]                                    [Guardar]    │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Domain y Application (2-3 días)

- [ ] Crear entidad `User` con campos correctos
- [ ] Crear entidad `RoutePermission`
- [ ] Crear entidad `SocietyAssignment`
- [ ] Crear DTOs correspondientes
- [ ] Crear casos de uso:
  - [ ] `GetUserPermissionsUseCase`
  - [ ] `UpdateUserPermissionsUseCase`
  - [ ] `AssignUserToSocietiesUseCase`

### Fase 2: Infrastructure (2 días)

- [ ] Crear `UserHttpRepository` (mock por ahora)
- [ ] Crear `UserMockRepository` (datos de prueba)
- [ ] Crear mappers (DTO ↔ Entidad)

### Fase 3: Presentation (5-7 días)

- [ ] Crear store `UserManagementStore` (Option API)
- [ ] Crear composables:
  - [ ] `useUserManagement`
  - [ ] `usePermissionsEditor`
- [ ] Crear componentes:
  - [ ] `PermissionsEditor.vue` (Wrapper)
  - [ ] `PermissionsEditorTabs.vue` (Presentacional)
  - [ ] `UserRoleSelector.vue` (Presentacional)
  - [ ] `RoutePermissionsList.vue` (Presentacional)
  - [ ] `SocietyAssignment.vue` (Presentacional - condicional según rol)

### Fase 4: Integración (2-3 días)

- [ ] Conectar componentes con stores
- [ ] Conectar stores con casos de uso
- [ ] Integrar con mock repository
- [ ] Testing manual

---

## 🎯 PRÓXIMOS PASOS

1. **Crear estructura base** siguiendo arquitectura hexagonal
2. **Crear mapeo de rutas** (`app/config/routes/permissions-map.ts`)
3. **Crear entidades** en Domain
4. **Crear casos de uso** en Application
5. **Crear componentes** siguiendo patrón flow-layout-juntas

---

**¿Todo claro?** ✅

**¿Empezamos con la implementación?** 🚀













