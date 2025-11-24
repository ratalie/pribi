# 📚 Documentación: Implementación de Navegación y UI del Sidebar

## ✅ Cambios Implementados

### 1. Hover Expand (Temporal)

**Funcionalidad**: Cuando el sidebar está contraído, al hacer hover se expande temporalmente para mostrar más información.

**Implementación**:
- Estado `isHoverExpanded` (ref) controla la expansión temporal
- Computed `isEffectivelyCollapsed` combina estado permanente + hover
- Handlers `handleMouseEnter` y `handleMouseLeave` gestionan el hover

**Comportamiento**:
- Sidebar contraído + hover → Se expande temporalmente
- Al salir del hover → Vuelve a contraído
- El botón de contraer/expandir controla el estado permanente

### 2. Estado Persistente

**Funcionalidad**: El estado del sidebar (contraído/expandido) se guarda en localStorage y persiste entre navegaciones.

**Implementación**:
- `loadSidebarState()` carga el estado desde localStorage al montar
- `toggleSidebar()` guarda el estado en localStorage al cambiar
- Funciona desde cualquier ruta (nivel 1, 2, 3)

**Comportamiento**:
- Al contraer → Se guarda en localStorage
- Al navegar → Se mantiene el estado guardado
- Al recargar → Se restaura el estado guardado

### 3. Auto-expandir Items Activos

**Funcionalidad**: Cuando el sidebar se expande, automáticamente expande las secciones e items que contienen la ruta activa.

**Implementación**:
- Función `expandActiveItems()` detecta rutas activas
- Se ejecuta al montar y cuando cambia la ruta
- Solo funciona cuando el sidebar está expandido

**Comportamiento**:
- Estar en `/registros/sociedades/agregar`
- Expandir sidebar → Se expande "Registros" y "Sociedades" automáticamente

### 4. Iconos Condicionales

**Funcionalidad**: Los items de nivel 1 (secciones) NO muestran iconos cuando el sidebar está contraído.

**Implementación**:
- Condición: `!props.isCollapsed` para mostrar iconos en nivel 1
- Modo expandido: Icono + Texto
- Modo contraído: Solo texto (sin icono)

**Comportamiento**:
- Sidebar expandido → Ver iconos en nivel 1
- Sidebar contraído → NO ver iconos en nivel 1 (solo texto)

### 5. Click en Nivel 2

**Funcionalidad**: Cuando está contraído y haces click en un item de nivel 2, se expande temporalmente y muestra los items de nivel 3.

**Implementación**:
- Click en nivel 2 con submenu → Activa `isHoverExpanded` y expande el item
- Permite navegar a nivel 3
- Al hacer click en nivel 3 → Cierra el hover expand

**Comportamiento**:
- Sidebar contraído
- Click en "Sociedades" (nivel 2)
- Se expande temporalmente y muestra: Dashboard, Agregar, Historial
- Puedes navegar a cualquiera de estos

### 6. Botón Contraer/Expandir

**Funcionalidad**: Controla el estado permanente del sidebar.

**Implementación**:
- Controla `isCollapsed` (estado permanente)
- Guarda en localStorage
- Funciona desde cualquier ruta

**Comportamiento**:
- Click en botón → Cambia estado permanente
- Se guarda en localStorage
- Persiste entre navegaciones

---

## 🎨 Estructura de Estados

```typescript
// Estado permanente (controlado por botón)
isCollapsed: boolean

// Estado temporal (hover)
isHoverExpanded: boolean

// Estado efectivo (combinado)
isEffectivelyCollapsed = isCollapsed && !isHoverExpanded
```

---

## 🔄 Flujo de Navegación

### Desde Ruta Nivel 3 (ej: `/registros/sociedades/agregar`)

1. **Sidebar contraído**:
   - Muestra solo nivel 1 y 2 (sin iconos en nivel 1)
   - Al hacer hover → Se expande temporalmente
   - Muestra estructura completa

2. **Click en botón expandir**:
   - Cambia estado permanente
   - Auto-expande "Registros" y "Sociedades"
   - Muestra todos los niveles

3. **Click en nivel 2**:
   - Si está contraído → Activa hover expand y muestra nivel 3
   - Si está expandido → Expande/contrae normalmente

---

## 📐 Anchos del Sidebar

- **Expandido**: `280px`
- **Contraído**: `80px`
- **Hover Expand**: `280px` (temporal)

---

## 🧪 Casos de Prueba

### ✅ Caso 1: Desde ruta nivel 3
1. Navegar a `/registros/sociedades/agregar`
2. Sidebar expandido
3. Click en botón contraer
4. ✅ Sidebar se contrae
5. Hover sobre sidebar
6. ✅ Se expande temporalmente
7. Salir del hover
8. ✅ Vuelve a contraído

### ✅ Caso 2: Click en nivel 2
1. Sidebar contraído
2. Click en "Sociedades" (nivel 2)
3. ✅ Se expande temporalmente
4. ✅ Muestra nivel 3 (Dashboard, Agregar, Historial)
5. Click en "Agregar"
6. ✅ Navega y cierra hover expand

### ✅ Caso 3: Iconos nivel 1
1. Sidebar expandido
2. ✅ Ver iconos en nivel 1
3. Contraer sidebar
4. ✅ NO ver iconos en nivel 1 (solo texto)

### ✅ Caso 4: Estado persistente
1. Contraer sidebar
2. Navegar a otra ruta
3. ✅ Se mantiene contraído
4. Recargar página
5. ✅ Se mantiene contraído

---

## 🐛 Problemas Conocidos y Soluciones

### Problema: Dashboard de juntas desaparece
**Causa**: La página usa `layout: "dual-panel-layout"` que puede tener problemas de renderizado.

**Solución**: Revisar el layout `dual-panel-layout.vue` y asegurar que renderiza correctamente.

---

## 📝 Notas Técnicas

1. **Hover Expand**: Solo funciona cuando `isCollapsed === true`
2. **Auto-expandir**: Solo funciona cuando `isCollapsed === false`
3. **Iconos nivel 1**: Se ocultan cuando `isCollapsed === true` (incluso en hover expand)
4. **Persistencia**: Se guarda en `localStorage` con key `probo-sidebar-collapsed`

---

## 🔮 Mejoras Futuras

1. Agregar animación más suave para hover expand
2. Permitir configurar si se quiere hover expand o no
3. Agregar atajo de teclado para contraer/expandir
4. Mejorar detección de rutas activas para auto-expandir

