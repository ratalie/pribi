# 🔄 REFORMULACIÓN COMPLETA: Sub-Módulos (NO Acciones)

**Fecha:** Enero 2025  
**Estado:** ✅ Reformulación Correcta  
**Objetivo:** Entender que los módulos tienen SUBMÓDULOS (páginas), no acciones

---

## 🎯 CONCEPTO CORRECTO

### ❌ ANTES (Incorrecto):

**Pensábamos que eran acciones:**
- `sociedades.dashboard` → Acción
- `sociedades.crear` → Acción
- `sociedades.historial` → Acción

### ✅ AHORA (Correcto):

**Son SUBMÓDULOS (páginas/rutas):**
- `sociedades` → **Módulo**
  - `dashboard` → **Sub-módulo** (página `/registros/sociedades/dashboard`)
  - `crear` → **Sub-módulo** (página `/registros/sociedades/agregar`)
  - `historial` → **Sub-módulo** (página `/registros/sociedades/historial`)
  - `contratos` → **Sub-módulo** (página futura)
  - `firmas` → **Sub-módulo** (página futura)

---

## 📊 ESTRUCTURA CORRECTA

### Niveles de Acceso:

**Nivel 1: Acceso al Módulo**
- ¿Puede acceder al módulo "Sociedades"?

**Nivel 2: Acceso al Sub-Módulo (GUARDS)**
- ¿Puede ver "dashboard"?
- ¿Puede ver "crear"?
- ¿Puede ver "historial"?
- ¿Puede ver "contratos"?

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
- `registro-sociedad/firmas` (futuro)

### Frontend (Rutas):

**Rutas → Permisos:**
- `/registros/sociedades/dashboard` → `registro-sociedad/dashboard`
- `/registros/sociedades/agregar` → `registro-sociedad/crear`
- `/registros/sociedades/historial` → `registro-sociedad/historial`

---

## 📋 ESTRUCTURA DE SUBMÓDULOS POR MÓDULO

### 1. Sociedades (Módulo)

**Sub-módulos actuales:**
- ✅ `dashboard` - `/registros/sociedades/dashboard`
- ✅ `crear` - `/registros/sociedades/agregar`
- ✅ `historial` - `/registros/sociedades/historial`

**Sub-módulos futuros:**
- ⏳ `contratos` - `/registros/sociedades/contratos`
- ⏳ `firmas` - `/registros/sociedades/firmas`
- ⏳ `documentos` - `/registros/sociedades/documentos`

**Permisos Backend:**
- `registro-sociedad/dashboard`
- `registro-sociedad/crear`
- `registro-sociedad/historial`
- `registro-sociedad/contratos` (futuro)
- `registro-sociedad/firmas` (futuro)

---

### 2. Sucursales (Módulo)

**Sub-módulos:**
- ✅ `dashboard` - `/registros/sucursales/dashboard`
- ✅ `crear` - `/registros/sucursales/agregar`
- ✅ `historial` - `/registros/sucursales/historial`

**Permisos Backend:**
- `registro-sucursal/dashboard`
- `registro-sucursal/crear`
- `registro-sucursal/historial`

---

### 3. Junta de Accionistas (Módulo)

**Sub-módulos:**
- ✅ `dashboard` - `/operaciones/junta-accionistas/dashboard`
- ✅ `crear` - `/operaciones/junta-accionistas/crear`
- ✅ `historial` - `/operaciones/junta-accionistas/historico`

**Permisos Backend:**
- `operacion-junta-accionistas/dashboard`
- `operacion-junta-accionistas/crear`
- `operacion-junta-accionistas/historial`

---

### 4. Directorio (Módulo)

**Sub-módulos:**
- ✅ `dashboard` - `/operaciones/directorio/dashboard`
- ✅ `crear` - `/operaciones/directorio/crear`
- ✅ `historial` - `/operaciones/directorio/historico`

**Permisos Backend:**
- `operacion-directorio/dashboard`
- `operacion-directorio/crear`
- `operacion-directorio/historial`

---

## 🛡️ GUARDS POR SUBMÓDULO

### Flujo de Control de Acceso:

```
1. Usuario navega a /registros/sociedades/crear
   ↓
2. Middleware intercepta
   ↓
3. Verifica permiso: "registro-sociedad/crear"
   ↓
4. Si tiene → Permite acceso al sub-módulo
   Si no → Redirige a /forbidden
   ↓
5. Dentro del sub-módulo, verifica permisos específicos:
   - ¿Puede editar?
   - ¿Puede eliminar?
   - ¿Puede ver detalles?
```

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

## ✅ REFORMULACIÓN NECESARIA

### Archivos a Actualizar:

1. **`app/types/modules.ts`**
   - Cambiar de "acciones" a "sub-módulos"
   - Actualizar tipos

2. **`app/composables/usePermissions.ts`**
   - Cambiar de verificar "acciones" a verificar "sub-módulos"
   - `hasPermission(module, submodule)` en lugar de `hasPermission(module, action)`

3. **`app/core/shared/mappers/permissions.mapper.ts`**
   - Mapear permisos del backend (strings) directamente
   - No convertir a CRUD, usar strings tal cual

4. **Middleware de permisos**
   - Verificar permiso por ruta
   - Mapear ruta → permiso backend

---

## 🎯 CONCLUSIÓN

**Concepto correcto:**
- ✅ Módulos tienen **sub-módulos** (páginas/rutas)
- ✅ El acceso se controla por **sub-módulo** (guards)
- ✅ Dentro del sub-módulo, se controlan **permisos específicos** (editar, eliminar, etc.)

**Backend tiene esto controlado:**
- ✅ Nomenclatura clara: `{categoria}-{modulo}/{submodulo}`
- ✅ Plan completo de implementación
- ✅ Endpoints definidos

**Frontend necesita:**
- ✅ Reformular tipos y composables
- ✅ Implementar guards por sub-módulo
- ✅ Mapear rutas a permisos backend

---

**¿Listo para reformular?** 🚀


