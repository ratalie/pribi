# 🔍 Auditoría: Lógica de Contraer/Expandir del Sidebar

## 🎯 Problema Identificado

### Síntoma
Cuando el sidebar está contraído y se hace hover:
1. El sidebar se expande horizontalmente (correcto)
2. **PERO** el header/logo y el contenido principal se desplazan incorrectamente
3. Parece que se está agregando espacio adicional, empujando todo hacia la derecha

### Causa Raíz
El sidebar está usando `width` dinámico que afecta el layout del flexbox. Cuando cambia de `80px` a `280px` en hover expand, está **empujando** el contenido principal en lugar de **superponerse**.

---

## 📋 Plan de Auditoría

### 1. Revisar Estructura del Layout

**Archivo**: `app/layouts/default.vue`

**Problema Actual**:
```vue
<div class="flex h-screen">
  <ProboSidebar /> <!-- Width dinámico: 80px o 280px -->
  <div :class="isCollapsed ? 'ml-[80px]' : 'ml-[280px]'">
    <!-- Contenido -->
  </div>
</div>
```

**Issue**: 
- El sidebar está en el flujo normal del flexbox
- Cuando cambia de ancho, empuja el contenido
- El margen del contenido solo considera `isCollapsed`, no `isHoverExpanded`

### 2. Revisar Estados del Sidebar

**Archivo**: `app/components/ProboSidebar.vue`

**Estados Actuales**:
- `isCollapsed`: Estado permanente (controlado por botón)
- `isHoverExpanded`: Estado temporal (hover)
- `isEffectivelyCollapsed`: Combinación de ambos

**Problema**:
- El sidebar cambia su `width` basado en `isEffectivelyCollapsed`
- Pero el layout principal solo considera `isCollapsed`
- **Desincronización**: Sidebar puede estar en 280px (hover) pero contenido piensa que está en 80px

### 3. Solución Propuesta

#### Opción A: Sidebar Fixed (Recomendada)
- Sidebar usa `position: fixed` cuando está en hover expand
- Se superpone sobre el contenido
- No empuja el layout

#### Opción B: Sincronizar Estados
- El layout principal también considera `isHoverExpanded`
- Ajusta el margen dinámicamente
- Más complejo pero mantiene el flujo normal

---

## ✅ Implementación: Opción A (Fixed)

### Cambios Necesarios

1. **Sidebar**: Usar `position: fixed` cuando está en hover expand
2. **Layout**: Mantener margen basado solo en `isCollapsed` (estado permanente)
3. **Z-index**: Asegurar que el sidebar esté por encima del contenido

### Código

```vue
<!-- Sidebar -->
<Sidebar
  :class="cn(
    'probo-sidebar-figma h-screen flex flex-col overflow-hidden border-r transition-all duration-300 ease-in-out',
    isEffectivelyCollapsed ? 'w-[80px]' : 'w-[280px]',
    // Fixed cuando está en hover expand
    isHoverExpanded && props.isCollapsed ? 'fixed left-0 top-0 z-50' : 'relative'
  )"
>
```

```vue
<!-- Layout -->
<div 
  :class="isCollapsed ? 'ml-[80px]' : 'ml-[280px]'"
  <!-- Margen solo basado en estado permanente -->
>
```

---

## 🧪 Casos de Prueba

### Caso 1: Sidebar Contraído
- ✅ Ancho: 80px
- ✅ Contenido: `ml-[80px]`
- ✅ No hay desplazamiento

### Caso 2: Hover sobre Sidebar Contraído
- ✅ Sidebar: `fixed`, ancho 280px, `z-50`
- ✅ Contenido: Mantiene `ml-[80px]` (no cambia)
- ✅ Sidebar se superpone sobre contenido
- ✅ No hay desplazamiento del contenido

### Caso 3: Sidebar Expandido
- ✅ Ancho: 280px
- ✅ Contenido: `ml-[280px]`
- ✅ No hay desplazamiento

---

## 📝 Checklist de Corrección

- [ ] Cambiar sidebar a `position: fixed` cuando está en hover expand
- [ ] Asegurar `z-index` correcto
- [ ] Verificar que el contenido no se desplace durante hover
- [ ] Probar transiciones suaves
- [ ] Verificar que el header/logo no se mueva
- [ ] Probar desde diferentes rutas

