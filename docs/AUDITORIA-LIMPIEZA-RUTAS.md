# 🧹 AUDITORÍA Y LIMPIEZA DE RUTAS

**Fecha:** 2025-01-XX  
**Objetivo:** Eliminar todas las rutas/páginas que NO están en el alcance del proyecto

---

## 📋 ALCANCE DEL PROYECTO (Lo que DEBE quedar)

### ✅ Registros
- `/registros/sociedades/*` ✅
- `/registros/sucursales/*` ✅

### ✅ Operaciones
- `/operaciones/junta-accionistas/*` ✅
- `/operaciones/directorio/*` ✅
- `/operaciones/gerencia-general/*` ✅ (existe en navigation)

### ✅ Storage
- `/storage/almacen` ✅
- `/storage/documentos-generados` ✅

### ✅ Features
- `/features/espacios-trabajo/*` ✅
- ❌ **NO:** `/features/chat-ia`
- ❌ **NO:** `/features/documentos-ia`
- ❌ **NO:** `/features/reporteria`

### ✅ Admin
- `/admin/panel` ❌ **FALTA CREAR**

---

## 🗑️ ARCHIVOS A ELIMINAR

### 1. Features (NO están en alcance)
- ❌ `app/pages/features/chat-ia.vue`
- ❌ `app/pages/features/documentos-ia.vue`
- ❌ `app/pages/features/reporteria.vue`

### 2. Duplicados/Obsoletos
- ❌ `app/pages/registro-societario/` (carpeta completa - duplicado de `registros/`)

### 3. Test/Debug
- ❌ `app/pages/test/` (carpeta completa)
- ❌ `app/pages/debug-theme.vue`
- ❌ `app/pages/test-tailwind.vue`
- ❌ `app/pages/viewComponents.vue`
- ❌ `app/pages/indiceSidebarsPruebas.vue`

---

## 📝 CAMBIOS EN CONFIGURACIÓN

### 1. `app/config/navigation.ts`
**Eliminar de Features:**
- `chat-ia`
- `documentos-ia`
- `reporteria`

**Solo debe quedar:**
- `espacios-trabajo` (con submenu)

### 2. `app/components/UserDropdownMenu.vue`
**Cambiar:**
- `handleOpenProfile()` debe navegar a `/admin/panel` en lugar de `/profile`

---

## ✅ ARCHIVOS A CREAR

### 1. Panel Administrativo
- ✅ `app/pages/admin/panel.vue`

---

## 📊 RESUMEN

| Categoría | Acción | Cantidad |
|-----------|--------|----------|
| **Eliminar páginas** | Features no necesarios | 3 archivos |
| **Eliminar carpetas** | Duplicados/Test | 2 carpetas |
| **Eliminar archivos** | Debug/Test | 4 archivos |
| **Actualizar config** | navigation.ts | 1 archivo |
| **Actualizar componente** | UserDropdownMenu | 1 archivo |
| **Crear página** | admin/panel | 1 archivo |

---

## 🎯 ORDEN DE EJECUCIÓN

1. ✅ Crear `/admin/panel.vue`
2. ✅ Actualizar `UserDropdownMenu.vue`
3. ✅ Eliminar páginas de Features (chat-ia, documentos-ia, reporteria)
4. ✅ Actualizar `navigation.ts` (eliminar de Features)
5. ✅ Eliminar `registro-societario/`
6. ✅ Eliminar `test/`
7. ✅ Eliminar archivos debug/test

---

**¿Proceder con la limpieza?**

