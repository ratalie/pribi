# 🗺️ MAPEO COMPLETO DE RUTAS: Layout Registros

**Fecha:** $(date)  
**Objetivo:** Mapear todas las rutas accesibles desde el layout "registros"

---

## 📊 RESUMEN

### Total de Rutas Mapeadas

- **Nivel 2 (Sidebar Principal):** 6 rutas
- **Nivel 3 (Flujo de Pasos):** 30 rutas (10 pasos × 3 modos)
- **Total:** 36 rutas

---

## 🎯 RUTAS POR NIVEL

### Nivel 1: Sección Principal

**"Registros"** (Sección colapsable)

### Nivel 2: Sub-Secciones (Con Iconos)

#### A. Sociedades

- **Icono:** `Building2`
- **Rutas:**
  1. `/registros/sociedades/dashboard` - Dashboard
  2. `/registros/sociedades/agregar` - Agregar sociedad
  3. `/registros/sociedades/historial` - Historial de registros

#### B. Sucursales

- **Icono:** `MapPin`
- **Rutas:**
  1. `/registros/sucursales/dashboard` - Dashboard
  2. `/registros/sucursales/agregar` - Agregar sucursal
  3. `/registros/sucursales/historial` - Historial de registros

### Nivel 3: Items de Flujo (Sin Iconos)

**Aparecen en ProgressNavBar cuando `flowLayout: true`**

#### Flujo Completo (10 Pasos)

| #   | Slug                   | Título                     | Ruta Base                     | Modo Crear    | Modo Editar    |
| --- | ---------------------- | -------------------------- | ----------------------------- | ------------- | -------------- |
| 1   | `datos-sociedad`       | Datos principales          | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 2   | `accionistas`          | Accionistas                | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 3   | `acciones`             | Capital Social y Acciones  | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 4   | `asignacion-acciones`  | Asignación de Acciones     | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 5   | `directorio`           | Directorio                 | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 6   | `registro-apoderados`  | Registro de Apoderados     | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 7   | `regimen-poderes`      | Régimen General de Poderes | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 8   | `quorums-mayorias`     | Quorums y Mayorías         | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 9   | `acuerdos-societarios` | Acuerdos Societarios       | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 10  | `resumen`              | Resumen                    | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |

---

## 📋 RUTAS COMPLETAS (EJEMPLOS)

### Modo Crear

```
/registros/sociedades/crear/[id]/datos-sociedad
/registros/sociedades/crear/[id]/accionistas
/registros/sociedades/crear/[id]/acciones
/registros/sociedades/crear/[id]/asignacion-acciones
/registros/sociedades/crear/[id]/directorio
/registros/sociedades/crear/[id]/registro-apoderados
/registros/sociedades/crear/[id]/regimen-poderes
/registros/sociedades/crear/[id]/quorums-mayorias
/registros/sociedades/crear/[id]/acuerdos-societarios
/registros/sociedades/crear/[id]/resumen
```

### Modo Editar

```
/registros/sociedades/editar/[id]/datos-sociedad
/registros/sociedades/editar/[id]/accionistas
/registros/sociedades/editar/[id]/acciones
/registros/sociedades/editar/[id]/asignacion-acciones
/registros/sociedades/editar/[id]/directorio
/registros/sociedades/editar/[id]/registro-apoderados
/registros/sociedades/editar/[id]/regimen-poderes
/registros/sociedades/editar/[id]/quorums-mayorias
/registros/sociedades/editar/[id]/acuerdos-societarios
/registros/sociedades/editar/[id]/resumen
```

### Modo Directo (desde historial)

```
/registros/sociedades/[id]/datos-sociedad
/registros/sociedades/[id]/accionistas
/registros/sociedades/[id]/acciones
/registros/sociedades/[id]/asignacion-acciones
/registros/sociedades/[id]/directorio
/registros/sociedades/[id]/registro-apoderados
/registros/sociedades/[id]/regimen-poderes
/registros/sociedades/[id]/quorums-mayorias
/registros/sociedades/[id]/acuerdos-societarios
/registros/sociedades/[id]/resumen
```

---

## 🎯 FLUJOS DE NAVEGACIÓN

### Flujo 1: Crear Nueva Sociedad

```
1. ProboSidebar → Registros → Sociedades → "Agregar sociedad"
   → /registros/sociedades/agregar

2. Usuario hace click en "Comenzar formulario guiado"
   → Se crea sociedad con ID
   → Redirige a: /registros/sociedades/[id]/datos-sociedad

3. Layout: registros + flowLayout: true
   → Muestra ProgressNavBar con 10 pasos
   → Usuario navega por los pasos
```

### Flujo 2: Editar Sociedad Existente

```
1. ProboSidebar → Registros → Sociedades → "Historial"
   → /registros/sociedades/historial

2. Usuario hace click en menú → "Editar datos"
   → Redirige a: /registros/sociedades/[id]/datos-sociedad

3. Layout: registros + flowLayout: true
   → Muestra ProgressNavBar con 10 pasos
   → Datos precargados en formularios
```

### Flujo 3: Ver Dashboard

```
1. ProboSidebar → Registros → Sociedades → "Dashboard"
   → /registros/sociedades/dashboard

2. Layout: registros (sin flowLayout)
   → Muestra dashboard con cards y estadísticas
```

---

## 📝 NOTAS IMPORTANTES

1. **Los 10 pasos del flujo** NO aparecen en el ProboSidebar principal
2. **Aparecen en ProgressNavBar** cuando `flowLayout: true`
3. **El ProboSidebar** solo muestra: Dashboard, Agregar, Historial
4. **La navegación del flujo** se hace desde el ProgressNavBar

---

**Mapeo completo. ¿Listo para comparar con React?** 🚀
