# 📊 RESUMEN EJECUTIVO: Sub-Módulos y Permisos

**Fecha:** Enero 2025  
**Estado:** ✅ Reformulación Completa  
**Objetivo:** Clarificar que los módulos tienen SUBMÓDULOS, no acciones

---

## 🎯 CONCEPTO CORRECTO

### ❌ Lo que pensábamos (INCORRECTO):

**Pensábamos que eran acciones:**
- `sociedades.dashboard` → Acción
- `sociedades.crear` → Acción
- `sociedades.historial` → Acción

### ✅ Lo que realmente es (CORRECTO):

**Son SUBMÓDULOS (páginas/rutas):**
- `sociedades` → **Módulo**
  - `dashboard` → **Sub-módulo** (página)
  - `crear` → **Sub-módulo** (página)
  - `historial` → **Sub-módulo** (página)
  - `contratos` → **Sub-módulo** (página futura)
  - `firmas` → **Sub-módulo** (página futura)

---

## 📋 ESTRUCTURA DE ACCESO

### Niveles:

**Nivel 1: Acceso al Módulo**
- ¿Puede acceder al módulo "Sociedades"?

**Nivel 2: Acceso al Sub-Módulo (GUARDS)**
- ¿Puede ver "dashboard"?
- ¿Puede ver "crear"?
- ¿Puede ver "historial"?

**Nivel 3: Permisos dentro del Sub-Módulo**
- Si tiene acceso a "crear", ¿puede editar?
- Si tiene acceso a "historial", ¿puede eliminar?

---

## 🔄 MAPEO: Backend ↔ Frontend

### Backend (Según documentos):

**Nomenclatura:** `{categoria}-{modulo}/{submodulo}`

**Ejemplos:**
- `registro-sociedad/dashboard`
- `registro-sociedad/crear`
- `registro-sociedad/historial`
- `registro-sociedad/contratos` (futuro)

### Frontend (Rutas):

**Rutas → Permisos:**
- `/registros/sociedades/dashboard` → `registro-sociedad/dashboard`
- `/registros/sociedades/agregar` → `registro-sociedad/crear`
- `/registros/sociedades/historial` → `registro-sociedad/historial`

---

## 📊 POSICIÓN DEL BACKEND

### ✅ Lo que tiene controlado:

1. **Sistema de Permisos v3 definido**
   - Nomenclatura clara: `{categoria}-{modulo}/{submodulo}`
   - Extensible y simple

2. **Plan completo de implementación**
   - Documentos creados
   - Endpoints definidos
   - Tiempo estimado: 7-10 días

3. **Estructura de BD lista**
   - Tablas creadas
   - Script de seed listo

### ⚠️ Lo que falta (pero está planificado):

- Endpoints de auth (1 día)
- Endpoints de gestión de usuarios (2-3 días)
- Endpoints de gestión de permisos (2-3 días)

**Conclusión:** ✅ **Backend lo tiene controlado, solo falta implementar**

---

## 🚀 REFORMULACIÓN NECESARIA EN FRONTEND

### Cambios principales:

1. **Tipos TypeScript**
   - Cambiar de "acciones" a "sub-módulos"
   - Estructura: `ModuleAccess[module][subModule]`

2. **Composable de Permisos**
   - `hasSubModuleAccess(module, subModule)` en lugar de `hasPermission(module, action)`

3. **Mapper de Permisos**
   - Mapear strings directamente (no CRUD)
   - Backend devuelve: `["registro-sociedad/crear"]`
   - Frontend mapea a estructura de módulos

4. **Middleware de Permisos**
   - Mapear ruta → permiso backend
   - Verificar permiso antes de cargar página

---

## 📝 TABLA COMPLETA: Rutas ↔ Permisos

| Ruta Frontend | Sub-Módulo | Permiso Backend |
|---------------|------------|-----------------|
| `/registros/sociedades/dashboard` | `dashboard` | `registro-sociedad/dashboard` |
| `/registros/sociedades/agregar` | `crear` | `registro-sociedad/crear` |
| `/registros/sociedades/historial` | `historial` | `registro-sociedad/historial` |
| `/registros/sucursales/dashboard` | `dashboard` | `registro-sucursal/dashboard` |
| `/registros/sucursales/agregar` | `crear` | `registro-sucursal/crear` |
| `/registros/sucursales/historial` | `historial` | `registro-sucursal/historial` |
| `/operaciones/junta-accionistas/dashboard` | `dashboard` | `operacion-junta-accionistas/dashboard` |
| `/operaciones/junta-accionistas/crear` | `crear` | `operacion-junta-accionistas/crear` |
| `/operaciones/junta-accionistas/historico` | `historial` | `operacion-junta-accionistas/historial` |
| `/operaciones/directorio/dashboard` | `dashboard` | `operacion-directorio/dashboard` |
| `/operaciones/directorio/crear` | `crear` | `operacion-directorio/crear` |
| `/operaciones/directorio/historico` | `historial` | `operacion-directorio/historial` |
| `/storage/almacen` | `almacen` | `storage-almacen/view` |
| `/storage/documentos-generados` | `documentos` | `storage-documentos-generados/view` |
| `/espacios-trabajo/dashboard` | `dashboard` | `workspace/dashboard` |
| `/espacios-trabajo/crear` | `crear` | `workspace/crear` |
| `/espacios-trabajo/espacios` | `historial` | `workspace/historial` |
| `/chat-ia` | `iniciar` | `chat/iniciar` |

---

## ✅ CHECKLIST DE REFORMULACIÓN

### Fase 1: Tipos (1 día)
- [ ] Actualizar `app/types/modules.ts`
- [ ] Crear tipos para sub-módulos

### Fase 2: Composable (1 día)
- [ ] Reformular `usePermissions.ts`
- [ ] Implementar `hasSubModuleAccess()`

### Fase 3: Mapper (1 día)
- [ ] Reformular `permissions.mapper.ts`
- [ ] Mapear strings directamente

### Fase 4: Middleware (1 día)
- [ ] Crear `middleware/permissions-v3.ts`
- [ ] Mapear rutas a permisos

### Fase 5: Testing (1 día)
- [ ] Probar con diferentes permisos
- [ ] Verificar guards

**Total: 5 días**

---

## 💬 CONCLUSIÓN

**Concepto correcto:**
- ✅ Módulos tienen **sub-módulos** (páginas/rutas)
- ✅ El acceso se controla por **sub-módulo** (guards)
- ✅ Dentro del sub-módulo, se controlan **permisos específicos**

**Backend:**
- ✅ Lo tiene controlado
- ✅ Plan completo
- ⏳ Falta implementar (7-10 días)

**Frontend:**
- ✅ Necesita reformular (5 días)
- ✅ Implementar guards
- ✅ Esperar endpoints del backend

**Ambos deben:**
- ✅ Coordinar implementación
- ✅ Probar juntos

---

**✅ Todo claro y documentado** 🚀


