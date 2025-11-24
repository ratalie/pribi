# 🔄 REFORMULACIÓN: Implementación Frontend con Sub-Módulos

**Fecha:** Enero 2025  
**Estado:** Plan de Reformulación  
**Objetivo:** Reformular frontend para usar sub-módulos en lugar de acciones

---

## 🎯 CAMBIOS NECESARIOS

### 1. Tipos TypeScript

**ANTES (Incorrecto):**
```typescript
interface ModulePermissions {
  dashboard: boolean;
  crear: boolean;
  historial: boolean;
}
```

**AHORA (Correcto):**
```typescript
interface SubModuleAccess {
  [subModule: string]: boolean; // "dashboard", "crear", "historial", "contratos", etc.
}

interface ModuleAccess {
  [module: string]: SubModuleAccess;
}
```

---

### 2. Composable de Permisos

**ANTES (Incorrecto):**
```typescript
const hasPermission = (module: string, action: "create" | "read" | "update" | "delete"): boolean => {
  // ...
}
```

**AHORA (Correcto):**
```typescript
const hasSubModuleAccess = (module: string, subModule: string): boolean => {
  // Verificar permiso: "{categoria}-{modulo}/{submodulo}"
  // Ejemplo: "registro-sociedad/crear"
}
```

---

### 3. Mapper de Permisos

**ANTES (Incorrecto):**
```typescript
// Convertía acciones a CRUD
function mapActionsToCRUD(actions: string[]): CRUD {
  // ...
}
```

**AHORA (Correcto):**
```typescript
// Mapea permisos del backend directamente (strings)
function mapBackendPermissionsToFrontend(permissions: string[]): ModuleAccess {
  // Backend devuelve: ["registro-sociedad/crear", "registro-sociedad/historial"]
  // Frontend mapea a estructura de módulos
}
```

---

### 4. Middleware de Permisos

**ANTES (Incorrecto):**
```typescript
// Verificaba acciones genéricas
if (!hasPermission("sociedades", "create")) {
  // ...
}
```

**AHORA (Correcto):**
```typescript
// Verifica sub-módulo específico
const permission = getPermissionFromRoute(route.path);
// Ejemplo: "/registros/sociedades/crear" → "registro-sociedad/crear"

if (!hasSubModuleAccess(permission)) {
  return navigateTo("/forbidden");
}
```

---

## 📋 MAPEO: Ruta → Permiso

### Función de Mapeo:

```typescript
function getPermissionFromRoute(route: string): string | null {
  const routeToPermission: Record<string, string> = {
    "/registros/sociedades/dashboard": "registro-sociedad/dashboard",
    "/registros/sociedades/agregar": "registro-sociedad/crear",
    "/registros/sociedades/historial": "registro-sociedad/historial",
    "/registros/sucursales/dashboard": "registro-sucursal/dashboard",
    "/registros/sucursales/agregar": "registro-sucursal/crear",
    "/registros/sucursales/historial": "registro-sucursal/historial",
    // ... más rutas
  };
  
  return routeToPermission[route] || null;
}
```

---

## 🛡️ GUARDS POR SUBMÓDULO

### Middleware de Permisos:

```typescript
// middleware/permissions-v3.ts
export default defineNuxtRouteMiddleware((to) => {
  const { hasSubModuleAccess } = usePermissions();
  const permission = getPermissionFromRoute(to.path);
  
  if (!permission) {
    // Ruta pública o sin permiso definido
    return;
  }
  
  if (!hasSubModuleAccess(permission)) {
    return navigateTo("/forbidden");
  }
});
```

---

## 📊 ESTRUCTURA DE PERMISOS EN STORE

### Store de Permisos:

```typescript
interface PermissionsState {
  permissions: string[]; // ["registro-sociedad/crear", "registro-sociedad/historial"]
  permissionsByModule: Record<string, string[]>; // Agrupados por módulo
}

// Función helper
function hasPermission(permission: string): boolean {
  return permissions.value.includes(permission);
}
```

---

## ✅ CHECKLIST DE REFORMULACIÓN

### Fase 1: Tipos y Estructuras (1 día)
- [ ] Actualizar `app/types/modules.ts`
- [ ] Crear tipos para sub-módulos
- [ ] Actualizar tipos de permisos

### Fase 2: Composable (1 día)
- [ ] Reformular `usePermissions.ts`
- [ ] Cambiar de acciones a sub-módulos
- [ ] Implementar `hasSubModuleAccess()`

### Fase 3: Mapper (1 día)
- [ ] Reformular `permissions.mapper.ts`
- [ ] Mapear strings directamente (no CRUD)
- [ ] Agrupar por módulo

### Fase 4: Middleware (1 día)
- [ ] Crear `middleware/permissions-v3.ts`
- [ ] Mapear rutas a permisos
- [ ] Implementar guards

### Fase 5: Testing (1 día)
- [ ] Probar con diferentes permisos
- [ ] Verificar que guards funcionen
- [ ] Probar rutas bloqueadas

---

## 🚀 PRÓXIMOS PASOS

1. **Reformular tipos** (1 día)
2. **Reformular composable** (1 día)
3. **Reformular mapper** (1 día)
4. **Implementar guards** (1 día)
5. **Testing** (1 día)

**Total: 5 días**

---

**¿Listo para reformular?** 🚀


