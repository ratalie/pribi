# 🎨 PLAN: Mejora UI con Categorías y Separadores

**Fecha:** 4 de Noviembre, 2025  
**Objetivo:** Mejorar UI del sidebar con separadores visuales para categorías  
**Referencia:** Componentes de v0 (junta-stepper.tsx)  
**Estado:** 📋 PLAN PARA APROBACIÓN

---

## 🎯 Problema Actual

### Lo que Tenemos:

En la imagen actual, las categorías aparecen como:
- "Aumento de Capital" ← Sin círculo, solo texto
- "Remociones" ← Sin círculo, solo texto
- "Nombramiento" ← Sin círculo, solo texto
- "Gestión Social y Resultados Económicos" ← Sin círculo, solo texto

**Problema:** No hay separación visual clara, parecen items normales pero sin círculo.

---

## ✨ Lo que Queremos (según v0)

### Categorías como Separadores:

```
Aumento de Capital          ← Texto pequeño, gris, SIN círculo
  ✓ Aporte Dinerarios       ← Círculo pequeño (20px), azul
  ✓ Capitalización créditos ← Círculo pequeño (20px), azul

Remociones                  ← Texto pequeño, gris, SIN círculo
  ✓ Gerente General         ← Círculo pequeño (20px), azul
  ✓ Apoderados              ← Círculo pequeño (20px), azul
  ✓ Directores              ← Círculo pequeño (20px), azul
```

**Características:**
- Categorías: text-xs, font-medium, color gris (#676472)
- Items: Círculos más pequeños (w-5 h-5 = 20px)
- Separación visual clara

---

## 🎨 Análisis de Referencia v0

### Colores (de junta-stepper.tsx):

```typescript
// Colores principales
azul-primary: #3c28a4
gris-texto: #676472
gris-borde: #c6c5ca
gris-linea: #e2e2e4
texto-oscuro: #2e293d
```

---

### Tamaños de Círculos:

```typescript
// Pasos principales (nivel 0-2)
className="w-6 h-6"  // 24px

// Items de categorías (nivel 3-4)
className="w-5 h-5"  // 20px

// Punto interior (paso actual)
className="w-2 h-2"  // 8px (pasos principales)
className="w-1.5 h-1.5"  // 6px (items)
```

---

### Tipografía:

```typescript
// Pasos principales
title: text-sm font-semibold
description: text-xs

// Categorías (separadores)
category: text-xs font-medium text-[#676472]

// Items bajo categorías
item: text-sm
```

---

### Fuentes Requeridas:

```css
font-primary: Garamond (para títulos)
font-secondary: Manrope (para descripciones y texto general)
```

---

## 📋 Plan de Implementación

### Fase 1: Configurar Fuentes (30 min)

#### Tarea 1.1: Actualizar tailwind.config.ts

**Archivo:** `tailwind.config.ts`

**Agregar:**
```typescript
export default {
  theme: {
    extend: {
      fontFamily: {
        primary: ['Garamond', 'serif'],
        secondary: ['Manrope', 'sans-serif'],
      },
    },
  },
}
```

---

#### Tarea 1.2: Importar fuentes en CSS

**Archivo:** `app/assets/styles/fonts.css` (crear)

```css
/* Garamond (si no está disponible localmente, usar Google Fonts fallback) */
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap');

/* Manrope */
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap');
```

**Importar en:** `app/app.vue` o `nuxt.config.ts`

---

### Fase 2: Crear Sistema de Categorías (1 hora)

#### Tarea 2.1: Actualizar Tipo FlowItem

**Archivo:** `app/types/flow-system/flow-item.ts`

**Agregar campo para indicar si es categoría:**

```typescript
export interface FlowItemIdentity {
  id: string;
  type: FlowItemType;
  label: string;
  isCategory?: boolean;  // ← NUEVO: indica si es separador de categoría
}
```

---

#### Tarea 2.2: Actualizar FlowItems de Juntas

**Archivos a modificar:**
- `app/types/flows/junta-accionistas/nivel-2/*.items.ts`

**Ejemplo en `aumento-capital.items.ts`:**

```typescript
export const aumentoCapitalItem: FlowItem = {
  identity: {
    id: "aumento-capital",
    type: FlowItemType.SECTION,
    label: "Aumento de Capital",
    isCategory: true,  // ← NUEVO
  },
  // ... resto del item
};
```

**Aplicar a:**
- ✅ aumentoCapitalItem (isCategory: true)
- ✅ remocionesItem (isCategory: true)
- ✅ nombramientoItem (isCategory: true)
- ✅ gestionSocialItem (isCategory: true)

---

### Fase 3: Actualizar Componentes de UI (2 horas)

#### Tarea 3.1: Crear CategorySeparator.vue

**Archivo:** `app/components/dual-panel-sidebar/shared/CategorySeparator.vue`

```vue
<script setup lang="ts">
/**
 * CategorySeparator - Separador visual para categorías
 * Sin círculo, solo texto con estilo diferenciado
 */
interface Props {
  label: string;
}

defineProps<Props>();
</script>

<template>
  <div class="category-separator">
    <h4 class="category-title">{{ label }}</h4>
  </div>
</template>

<style scoped>
.category-separator {
  margin-bottom: 8px;
}

.category-title {
  font-family: var(--font-secondary);
  font-size: 12px;
  font-weight: 500;
  color: #676472;
  line-height: 1.4;
}
</style>
```

---

#### Tarea 3.2: Actualizar StepItem.vue

**Archivo:** `app/components/dual-panel-sidebar/shared/StepItem.vue`

**Cambios:**

1. **Detectar si es categoría:**
```typescript
const isCategory = computed(() => props.step.isCategory);
```

2. **Renderizar diferente si es categoría:**
```vue
<template>
  <!-- Si es categoría, mostrar separador -->
  <CategorySeparator v-if="isCategory" :label="step.title" />
  
  <!-- Si NO es categoría, mostrar item normal -->
  <div v-else class="flex items-start gap-4">
    <!-- StatusIcon + contenido -->
  </div>
</template>
```

3. **Ajustar tamaños de círculos según nivel:**
```typescript
const iconSize = computed(() => {
  // Nivel 0-2: círculos grandes (24px)
  if (props.step.level <= 2) return 'w-6 h-6';
  
  // Nivel 3-4: círculos pequeños (20px)
  return 'w-5 h-5';
});
```

---

#### Tarea 3.3: Actualizar StatusIcon.vue

**Archivo:** `app/components/dual-panel-sidebar/shared/StatusIcon.vue`

**Cambios:**

1. **Agregar prop para tamaño:**
```typescript
interface Props {
  status?: Status;
  isFinalItem?: boolean;
  showLine?: boolean;
  size?: 'large' | 'small';  // ← NUEVO
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large',
});
```

2. **Clases dinámicas según tamaño:**
```typescript
const iconClasses = computed(() => {
  const base = 'flex items-center justify-center rounded-full';
  const size = props.size === 'large' ? 'w-6 h-6' : 'w-5 h-5';
  return `${base} ${size}`;
});

const dotSize = computed(() => {
  return props.size === 'large' ? 'w-2 h-2' : 'w-1.5 h-1.5';
});

const checkSize = computed(() => {
  return props.size === 'large' ? 'w-4 h-4' : 'w-3 h-3';
});
```

---

#### Tarea 3.4: Actualizar HierarchicalItem.vue

**Archivo:** `app/components/dual-panel-sidebar/shared/HierarchicalItem.vue`

**Cambios similares:**

1. Detectar `isCategory`
2. Renderizar CategorySeparator si aplica
3. Ajustar tamaños según nivel

---

### Fase 4: Actualizar Colores y Estilos (1 hora)

#### Tarea 4.1: Actualizar Variables CSS

**Archivo:** `app/assets/styles/variables.css`

```css
:root {
  /* Colores del sistema (según v0) */
  --color-primary: #3c28a4;
  --color-text-primary: #2e293d;
  --color-text-secondary: #676472;
  --color-border: #c6c5ca;
  --color-border-light: #e2e2e4;
  
  /* Fuentes */
  --font-primary: 'Garamond', serif;
  --font-secondary: 'Manrope', sans-serif;
}
```

---

#### Tarea 4.2: Actualizar Componentes con Nuevos Colores

**Archivos a actualizar:**
- StatusIcon.vue
- StepItem.vue
- HierarchicalItem.vue
- StepWizardPanel.vue

**Cambios:**
```css
/* Reemplazar colores actuales con variables */
.completed {
  background-color: var(--color-primary);  /* #3c28a4 */
}

.text-primary {
  color: var(--color-primary);
}

.text-secondary {
  color: var(--color-text-secondary);  /* #676472 */
}

.border-color {
  border-color: var(--color-border);  /* #c6c5ca */
}
```

---

### Fase 5: Actualizar Adaptadores (30 min)

#### Tarea 5.1: Modificar flowConfigToSteps.ts

**Archivo:** `app/components/dual-panel-sidebar/adapters/flowConfigToSteps.ts`

**Agregar campo isCategory:**

```typescript
function flattenTree(items: FlowItemTree[], parentCompleted: boolean = false) {
  for (const item of items) {
    const step: NavigationStep = {
      title: item.identity.label,
      description: item.behavior.description || `Completa ${item.identity.label}`,
      status,
      route: item.navigation.route,
      isCategory: item.identity.isCategory || false,  // ← NUEVO
      level: item.hierarchy.level,  // ← NUEVO (para tamaños)
    };
    
    steps.push(step);
    // ...
  }
}
```

---

#### Tarea 5.2: Actualizar Tipo NavigationStep

**Archivo:** `app/types/navigationSteps.ts`

```typescript
export interface NavigationStep {
  title: string;
  description: string;
  status: "completed" | "current" | "empty";
  route: string;
  isCategory?: boolean;  // ← NUEVO
  level?: number;  // ← NUEVO
}
```

---

### Fase 6: Testing y Ajustes (30 min)

#### Tarea 6.1: Verificar en Juntas

- Navegar a `/operaciones/junta-accionistas/puntos-acuerdo`
- Verificar que categorías aparecen como separadores
- Verificar tamaños de círculos
- Verificar colores

#### Tarea 6.2: Verificar Fuentes

- Títulos deben usar Garamond
- Descripciones deben usar Manrope
- Verificar en DevTools

---

## 📊 Resumen de Cambios

### Archivos a Crear (2):

1. `app/assets/styles/fonts.css` - Importación de fuentes
2. `app/components/dual-panel-sidebar/shared/CategorySeparator.vue` - Componente separador

---

### Archivos a Modificar (9):

1. `tailwind.config.ts` - Configurar fuentes
2. `app/types/flow-system/flow-item.ts` - Agregar isCategory
3. `app/types/navigationSteps.ts` - Agregar isCategory y level
4. `app/components/dual-panel-sidebar/shared/StatusIcon.vue` - Tamaños dinámicos
5. `app/components/dual-panel-sidebar/shared/StepItem.vue` - Detectar categorías
6. `app/components/dual-panel-sidebar/shared/HierarchicalItem.vue` - Detectar categorías
7. `app/components/dual-panel-sidebar/adapters/flowConfigToSteps.ts` - Pasar isCategory
8. `app/types/flows/junta-accionistas/nivel-2/*.items.ts` - Marcar categorías (4 archivos)
9. `app/assets/styles/variables.css` - Actualizar colores

---

### FlowItems a Actualizar (4):

1. `aumento-capital.items.ts` → isCategory: true
2. `remociones.items.ts` → isCategory: true
3. `nombramiento.items.ts` → isCategory: true
4. `gestion-social.items.ts` → isCategory: true

---

## 🎨 Resultado Esperado

### Antes:

```
○ Aumento de Capital          ← Con círculo vacío (confuso)
  ✓ Aporte Dinerarios
  ✓ Capitalización créditos
```

---

### Después:

```
Aumento de Capital            ← Sin círculo, texto pequeño gris
  ✓ Aporte Dinerarios         ← Círculo pequeño (20px)
  ✓ Capitalización créditos   ← Círculo pequeño (20px)
```

**Mejoras:**
- ✅ Separación visual clara
- ✅ Categorías como headers, no como items
- ✅ Círculos más pequeños para items bajo categorías
- ✅ Fuentes correctas (Garamond + Manrope)
- ✅ Colores consistentes (#3c28a4)

---

## ⏱️ Tiempo Estimado

```
Fase 1: Configurar Fuentes       → 30 min
Fase 2: Sistema de Categorías    → 1 hora
Fase 3: Actualizar Componentes   → 2 horas
Fase 4: Colores y Estilos        → 1 hora
Fase 5: Adaptadores              → 30 min
Fase 6: Testing                  → 30 min

TOTAL: 5.5 horas
```

---

## 🎯 Checklist de Implementación

### Fase 1: Fuentes ⏳
- [ ] Actualizar tailwind.config.ts
- [ ] Crear fonts.css
- [ ] Importar en app
- [ ] Verificar en DevTools

### Fase 2: Categorías ⏳
- [ ] Actualizar tipo FlowItemIdentity
- [ ] Marcar 4 items como isCategory: true
- [ ] Verificar en consola

### Fase 3: Componentes ⏳
- [ ] Crear CategorySeparator.vue
- [ ] Actualizar StepItem.vue
- [ ] Actualizar StatusIcon.vue (tamaños)
- [ ] Actualizar HierarchicalItem.vue

### Fase 4: Estilos ⏳
- [ ] Actualizar variables.css
- [ ] Aplicar nuevos colores
- [ ] Verificar contraste

### Fase 5: Adaptadores ⏳
- [ ] Actualizar NavigationStep type
- [ ] Actualizar flowConfigToSteps.ts
- [ ] Testing conversión

### Fase 6: Testing ⏳
- [ ] Verificar Juntas
- [ ] Verificar fuentes
- [ ] Verificar colores
- [ ] Verificar tamaños

---

## 📝 Notas Importantes

### Sobre las Fuentes:

**Garamond:**
- Si no está instalado, usar EB Garamond de Google Fonts
- Fallback: serif

**Manrope:**
- Disponible en Google Fonts
- Fallback: sans-serif

---

### Sobre los Colores:

**Color principal:** #3c28a4 (azul violeta)
- Más oscuro que el actual primary-800
- Consistente con v0

**Grises:**
- Texto: #676472
- Bordes: #c6c5ca
- Líneas: #e2e2e4

---

## 💬 Pregunta para Aprobación

Mi Rey, este es el plan completo para mejorar la UI.

**¿Apruebas el plan?**

**¿Algún cambio o ajuste antes de implementar?**

**¿Procedo con la implementación?** 🚀

---

**Plan creado:** 4 de Noviembre, 2025  
**Tiempo estimado:** 5.5 horas  
**Archivos a crear:** 2  
**Archivos a modificar:** 13  
**Resultado:** UI profesional con separadores de categorías





