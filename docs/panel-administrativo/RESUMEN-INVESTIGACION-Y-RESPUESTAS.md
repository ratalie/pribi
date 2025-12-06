# ✅ RESUMEN: Investigación Completa y Respuestas a Dudas

**Fecha:** Diciembre 2024  
**Estado:** ✅ INVESTIGACIÓN COMPLETA

---

## 🎯 RESPUESTAS A TUS DUDAS

### 1. **¿Tengo todo claro?**

**✅ SÍ, tengo claro:**

1. **Patrón de componentes:** Como `flow-layout-juntas` - componentes auto-gestionados, wrappers + presentacionales
2. **Arquitectura hexagonal:** Como `sociedades` - Domain → Application → Infrastructure → Presentation
3. **Stores:** Option API (NO Composition API)
4. **Flujo de login:** Actualmente solo devuelve token + roleName básico

**⚠️ DUDAS que necesito resolver con backend:**

1. ¿Existe endpoint para obtener usuario completo después del login?
2. ¿Cómo se estructuran los permisos en la BD?
3. ¿El token JWT contiene permisos o necesitamos endpoint separado?

---

## 🔐 FLUJO DE LOGIN - ANÁLISIS COMPLETO

### Estado Actual

```
1. Usuario hace login
   POST /api/v2/auth
   ↓
2. Backend devuelve:
   {
     token: "JWT...",
     studyName: "Example Study",
     roleName: "Administrador"
   }
   ↓
3. Frontend guarda token en auth.store
   ↓
4. Token se usa en headers de requests
```

### ⚠️ PROBLEMA IDENTIFICADO

**El login NO devuelve:**
- ❌ Permisos completos
- ❌ Sociedades asignadas
- ❌ Rutas permitidas
- ❌ Carpetas con acceso

**Código actual:**
- `useUser.ts` usa datos **MOCK** (no viene del backend)
- `usePermissions.ts` tiene modo degradado (permite todo si no hay permisos)
- No hay endpoint para obtener usuario completo

### ✅ SOLUCIÓN PROPUESTA

**Opción 1: Endpoint separado (RECOMENDADO)**
```
Después del login:
GET /api/v2/users/me
Headers: { Authorization: Bearer <token> }
Response: {
  id: string;
  email: string;
  name: string;
  globalRole: RoleName;
  societyPermissions: SocietyPermission[];
  routePermissions: RoutePermission[];
  folderPermissions: FolderPermission[];
}
```

**Opción 2: Token JWT con toda la info**
```
Decodificar token y extraer permisos
(Requiere que backend incluya permisos en el token)
```

**Opción 3: Endpoint específico de permisos**
```
GET /api/v2/users/:userId/permissions
Response: {
  societyPermissions: [...];
  routePermissions: [...];
  folderPermissions: [...];
}
```

---

## 📊 ESTRUCTURA ACTUAL IDENTIFICADA

### 1. **Panel Administrativo (Ya existe)**

```
app/core/hexag/panel-administrativo/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts ✅
│   │   ├── role.entity.ts ✅
│   │   └── permission.entity.ts ✅
│   └── ports/
│       └── user.repository.ts ✅
├── application/
│   ├── dtos/ ✅
│   └── use-cases/
│       ├── get-users.use-case.ts ✅
│       ├── get-user-permissions.use-case.ts ✅
│       └── update-user-permissions.use-case.ts ✅
└── infrastructure/
    ├── repositories/
    │   └── user-mock.repository.ts ✅
    └── mappers/ ✅

app/core/presentation/panel-administrativo/
├── stores/
│   └── user-management.store.ts ✅ (Option API)
├── composables/
│   └── useUserManagement.ts ✅
└── components/
    ├── UserManagementView.vue ✅
    ├── PermissionsEditor.vue ✅
    └── UserAssignmentModal.vue ✅
```

**✅ Lo que ya funciona:**
- Estructura hexagonal completa
- Stores con Option API
- Componentes básicos
- Casos de uso implementados

**⚠️ Lo que falta:**
- Permisos por ruta (solo tiene permisos por módulo/flujo)
- Permisos por sociedad (solo tiene permisos globales)
- Vista visual con checkboxes para rutas
- Integración con carpetas personalizadas

### 2. **Sistema de Permisos Actual**

**Archivo:** `app/composables/usePermissions.ts`

**Características:**
- ✅ Modo degradado (permite todo si no hay permisos)
- ✅ Verifica permisos por módulo
- ✅ Verifica permisos de repositorio
- ❌ NO verifica permisos por ruta específica
- ❌ NO verifica permisos por sociedad

**Archivo:** `app/core/shared/mappers/permissions.mapper.ts`

**Características:**
- ✅ Mapea permisos del backend (accessMap) a frontend
- ✅ Soporta acciones genéricas (read, write, delete)
- ✅ Soporta acciones específicas (dashboard, crear, historial)
- ❌ NO mapea permisos por ruta
- ❌ NO mapea permisos por sociedad

---

## 🏗️ ESTRUCTURA PROPUESTA (Siguiendo Patrones)

### Componentes (Como flow-layout-juntas)

```
app/components/admin/permissions/
├── PermissionsEditor.vue (Wrapper - Auto-gestionado)
│   └── Importa: usePermissionsEditor()
│
├── PermissionsEditorTabs.vue (Presentacional)
│   └── Solo UI, recibe props
│
├── tabs/
│   ├── SocietyPermissionsTab.vue (Wrapper - Auto-gestionado)
│   │   └── Importa: useSocietyPermissions()
│   │
│   ├── RoutePermissionsTab.vue (Wrapper - Auto-gestionado)
│   │   └── Importa: useRoutePermissions()
│   │
│   └── FolderPermissionsTab.vue (Wrapper - Auto-gestionado)
│       └── Importa: useFolderPermissions()
│
└── route-permissions/
    ├── RoutePermissionsEditor.vue (Wrapper - Auto-gestionado)
    │   └── Importa: useRoutePermissionsEditor()
    │
    ├── RouteGroup.vue (Presentacional)
    │   └── Solo UI, recibe props
    │
    └── RoutePermissionItem.vue (Presentacional)
        └── Solo UI, recibe props
```

### Arquitectura Hexagonal (Como sociedades)

```
app/core/hexag/panel-administrativo/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts ✅ (ya existe)
│   │   ├── role.entity.ts ✅ (ya existe)
│   │   ├── permission.entity.ts ✅ (ya existe)
│   │   ├── society-permission.entity.ts (NUEVO)
│   │   ├── route-permission.entity.ts (NUEVO)
│   │   └── folder-permission.entity.ts (NUEVO)
│   └── ports/
│       ├── user.repository.ts ✅ (ya existe)
│       └── permission.repository.ts (NUEVO - expandir)
│
├── application/
│   ├── dtos/
│   │   ├── user.dto.ts ✅ (ya existe)
│   │   ├── permission.dto.ts ✅ (ya existe)
│   │   ├── society-permission.dto.ts (NUEVO)
│   │   ├── route-permission.dto.ts (NUEVO)
│   │   └── folder-permission.dto.ts (NUEVO)
│   └── use-cases/
│       ├── get-users.use-case.ts ✅ (ya existe)
│       ├── get-user-permissions.use-case.ts ✅ (ya existe)
│       ├── update-user-permissions.use-case.ts ✅ (ya existe)
│       ├── get-user-route-permissions.use-case.ts (NUEVO)
│       ├── update-user-route-permissions.use-case.ts (NUEVO)
│       ├── assign-user-to-society.use-case.ts (NUEVO)
│       └── verify-route-access.use-case.ts (NUEVO)
│
└── infrastructure/
    ├── repositories/
    │   ├── user-mock.repository.ts ✅ (ya existe)
    │   ├── user-http.repository.ts (NUEVO)
    │   └── permission-http.repository.ts (NUEVO)
    └── mappers/
        ├── permission.mapper.ts ✅ (ya existe)
        ├── route-permission.mapper.ts (NUEVO)
        └── society-permission.mapper.ts (NUEVO)
```

---

## 🗺️ PLAN DE IMPLEMENTACIÓN

### Por Dónde Empezar

#### **Paso 1: Investigar Backend (1 día)**
1. Preguntar al equipo backend:
   - ¿Existe `GET /api/v2/users/me`?
   - ¿Cómo se estructuran permisos en BD?
   - ¿El token JWT contiene permisos?
   - ¿Cómo se manejan permisos por sociedad?
   - ¿Cómo se manejan wildcards en rutas?

#### **Paso 2: Crear Mapeo de Rutas (1 día)**
1. Crear `app/config/routes/permissions-map.ts`
2. Mapear todas las rutas de la app
3. Definir estructura de permisos por ruta

#### **Paso 3: Expandir Domain (2 días)**
1. Crear entidades nuevas:
   - `society-permission.entity.ts`
   - `route-permission.entity.ts`
   - `folder-permission.entity.ts`
2. Expandir ports:
   - Agregar métodos a `permission.repository.ts`

#### **Paso 4: Expandir Application (2 días)**
1. Crear DTOs nuevos
2. Crear casos de uso nuevos:
   - `get-user-route-permissions.use-case.ts`
   - `update-user-route-permissions.use-case.ts`
   - `assign-user-to-society.use-case.ts`
   - `verify-route-access.use-case.ts`

#### **Paso 5: Expandir Infrastructure (2 días)**
1. Crear repositorios HTTP
2. Crear mappers nuevos
3. Actualizar repositorios mock

#### **Paso 6: Crear Componentes (5-7 días)**
1. Crear wrappers (auto-gestionados)
2. Crear componentes presentacionales
3. Integrar con stores

#### **Paso 7: Integración y Testing (3-4 días)**
1. Conectar todo
2. Testing manual
3. Verificar permisos en rutas

---

## ✅ CHECKLIST FINAL

### Antes de Empezar

- [x] Entender patrón de componentes (flow-layout-juntas)
- [x] Entender arquitectura hexagonal (sociedades)
- [x] Entender stores con Option API
- [x] Entender flujo de login actual
- [ ] **Preguntar al backend sobre endpoints** ⚠️
- [ ] **Entender estructura de permisos en BD** ⚠️

### Estructura a Crear

- [ ] Mapeo de rutas (`app/config/routes/permissions-map.ts`)
- [ ] Entidades nuevas (society-permission, route-permission, folder-permission)
- [ ] DTOs nuevos
- [ ] Casos de uso nuevos
- [ ] Repositorios HTTP nuevos
- [ ] Mappers nuevos
- [ ] Componentes nuevos (siguiendo patrón flow-layout-juntas)

---

## 💡 CONCLUSIÓN

**✅ Tengo claro:**
- Patrones a seguir (flow-layout-juntas, sociedades)
- Arquitectura hexagonal completa
- Stores con Option API
- Estructura actual del proyecto

**⚠️ Necesito resolver con backend:**
- Endpoints para obtener usuario completo
- Estructura de permisos en BD
- Cómo se manejan permisos por sociedad y ruta

**🎯 Próximo paso:**
1. Comunicar con backend sobre endpoints
2. Crear mapeo de rutas
3. Empezar con Domain layer

---

**¿Estás listo para empezar?** 🚀



