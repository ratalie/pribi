# 📋 Plan de Trabajo: Mejoras de Navegación y UI del Sidebar

## 🎯 Objetivos

1. **Hover Expand**: Cuando está contraído, al hacer hover se expande temporalmente
2. **Estado Persistente**: Mantener estado contraído/expandido correctamente desde cualquier ruta
3. **Iconos Condicionales**: Nivel 1 sin iconos cuando está contraído
4. **Navegación Inteligente**: Click en nivel 2 expande y muestra nivel 3
5. **Botón de Contraer/Expandir**: Funciona correctamente desde cualquier ruta

---

## 📝 Cambios a Implementar

### 1. Hover Expand (Temporal)
- **Estado**: `isHoverExpanded` (ref)
- **Comportamiento**: 
  - Cuando `isCollapsed === true` y `isHoverExpanded === true` → Sidebar se expande temporalmente
  - Al salir del hover → Vuelve a contraído
  - El botón de contraer/expandir controla el estado permanente

### 2. Estado Persistente
- **Problema**: Desde rutas nivel 3 (ej: `/registros/sociedades/agregar`), al contraer se cierra todo
- **Solución**: 
  - Guardar estado en localStorage
  - Al navegar, mantener el estado guardado
  - Auto-expandir secciones/items activos cuando se expande

### 3. Iconos Condicionales
- **Regla**: Nivel 1 (secciones) NO muestran iconos cuando está contraído
- **Implementación**: 
  - Modo expandido: Icono + Texto
  - Modo contraído: Solo texto (sin icono)

### 4. Click en Nivel 2
- **Comportamiento**: 
  - Cuando está contraído y haces click en nivel 2 (ej: "Sociedades")
  - Se expande temporalmente (hover expand)
  - Muestra los items de nivel 3
  - Permite navegar a nivel 3

### 5. Botón Contraer/Expandir
- **Funcionalidad**:
  - Controla estado permanente (`isCollapsed`)
  - Funciona desde cualquier ruta
  - Mantiene estado en localStorage

---

## 🔧 Implementación Técnica

### Estados Necesarios

```typescript
// Estado permanente (controlado por botón)
const isCollapsed = ref<boolean>(false);

// Estado temporal (hover)
const isHoverExpanded = ref<boolean>(false);

// Estado efectivo (combinado)
const isEffectivelyCollapsed = computed(() => 
  isCollapsed.value && !isHoverExpanded.value
);
```

### Event Handlers

```typescript
// Hover enter
const handleMouseEnter = () => {
  if (isCollapsed.value) {
    isHoverExpanded.value = true;
  }
};

// Hover leave
const handleMouseLeave = () => {
  isHoverExpanded.value = false;
};

// Toggle permanente
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  // Guardar en localStorage
  localStorage.setItem('sidebar-collapsed', String(isCollapsed.value));
};
```

### Auto-expandir Items Activos

```typescript
// Al montar o cambiar ruta
watch(() => route.path, () => {
  if (!isCollapsed.value) {
    // Auto-expandir secciones/items que contienen la ruta activa
    expandActiveItems();
  }
});
```

---

## 📐 Estructura de Componentes

### ProboSidebar.vue

```vue
<template>
  <Sidebar
    :class="cn(
      'probo-sidebar-figma',
      isEffectivelyCollapsed ? 'w-[80px]' : 'w-[280px]'
    )"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- Contenido -->
  </Sidebar>
</template>
```

---

## ✅ Checklist de Implementación

- [ ] Agregar estado `isHoverExpanded`
- [ ] Implementar `handleMouseEnter` y `handleMouseLeave`
- [ ] Crear computed `isEffectivelyCollapsed`
- [ ] Guardar estado en localStorage
- [ ] Cargar estado desde localStorage al montar
- [ ] Remover iconos de nivel 1 cuando está contraído
- [ ] Implementar auto-expandir items activos
- [ ] Ajustar click en nivel 2 para expandir temporalmente
- [ ] Probar desde diferentes rutas (nivel 1, 2, 3)
- [ ] Documentar cambios

---

## 🧪 Casos de Prueba

1. **Desde ruta nivel 3**:
   - Estar en `/registros/sociedades/agregar`
   - Hacer click en botón contraer
   - Verificar que se mantiene contraído
   - Hacer hover → Debe expandirse temporalmente
   - Salir del hover → Debe volver a contraído

2. **Click en nivel 2**:
   - Sidebar contraído
   - Hacer click en "Sociedades" (nivel 2)
   - Debe expandirse y mostrar nivel 3
   - Debe permitir navegar a nivel 3

3. **Iconos nivel 1**:
   - Sidebar expandido → Ver iconos en nivel 1
   - Sidebar contraído → NO ver iconos en nivel 1

4. **Estado persistente**:
   - Contraer sidebar
   - Navegar a otra ruta
   - Recargar página
   - Verificar que se mantiene contraído

---

## 📚 Documentación

Una vez implementado, documentar:
- Comportamiento del hover expand
- Estados del sidebar
- Navegación desde diferentes niveles
- Persistencia del estado

