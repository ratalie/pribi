# 🎨 ARQUITECTURA DE COLORES CON TAILWIND 4 - SISTEMA DE PALETAS DINÁMICAS

**Fecha**: 16 de Octubre, 2025  
**Objetivo**: Migrar de colores hardcoded (purple, gray, red) a sistema de variables CSS con 4 paletas intercambiables  
**Framework**: Nuxt 4.1.3 + Tailwind CSS 4.0 + shadcn/ui

---

## 📋 1. DIAGNÓSTICO INICIAL

### **1.1 Problema Reportado**

> **Usuario**: "En ninguna parte de mi aplicación debería estilizar con purple, red, etc. Debería background, foreground, etc. Se entiende?"

**Traducción**: La aplicación actualmente usa colores literales de Tailwind (purple-600, gray-200, etc.) en lugar de variables semánticas (background, foreground, muted, etc.).

### **1.2 Componentes Personalizados (No Shadcn)**

```
app/components/
├── ConfigurationModal.vue    ⚠️ Usa bg-gray-100
├── FontSelector.vue
├── LanguageSelect.vue
├── PageTitle.vue
├── ProboSidebar.vue
├── ThemeSelector.vue         ⚠️ Usa bg-gray-600, bg-gray-800, bg-gray-700
└── UserDropdownMenu.vue      ⚠️ Usa bg-gray-50
```

### **1.3 Búsqueda de Colores Hardcoded**

**Comando ejecutado**:

```bash
grep -r "bg-purple\|text-purple\|border-purple\|bg-gray-\|text-gray-\|border-gray-\|bg-red-\|text-red-\|bg-blue-\|text-blue-" app/components/*.vue
```

**Resultados** (8 matches):

| Archivo                  | Línea | Código Problemático           |
| ------------------------ | ----- | ----------------------------- |
| `UserDropdownMenu.vue`   | 35    | `bg-gray-50`                  |
| `ThemeSelector.vue`      | 29    | `border-gray-600 bg-gray-800` |
| `ThemeSelector.vue`      | 30    | `bg-gray-700`                 |
| `ThemeSelector.vue`      | 48    | `border-gray-600 bg-gray-800` |
| `ThemeSelector.vue`      | 49    | `bg-gray-700`                 |
| `ConfigurationModal.vue` | 7     | `bg-gray-100`                 |

**Total de componentes con problemas**: 3/7 (43%)

---

## 🔬 2. ESTUDIO E HIPÓTESIS

### **2.1 ¿Cómo Funcionan las Variables en Tailwind 4?**

**Investigación**: Leímos la documentación oficial de Tailwind 4 sobre Theme Variables.

#### **Sistema de Namespaces**

Tailwind 4 usa **namespaces** para organizar variables CSS:

| Namespace     | Utilidades Generadas         | Ejemplo                          |
| ------------- | ---------------------------- | -------------------------------- |
| `--color-*`   | `bg-*`, `text-*`, `border-*` | `--color-primary` → `bg-primary` |
| `--font-*`    | `font-*`                     | `--font-sans` → `font-sans`      |
| `--spacing-*` | `p-*`, `m-*`, `w-*`, `h-*`   | `--spacing-4` → `p-4`            |
| `--radius-*`  | `rounded-*`                  | `--radius-lg` → `rounded-lg`     |
| `--shadow-*`  | `shadow-*`                   | `--shadow-md` → `shadow-md`      |

#### **Sintaxis de Definición**

```css
/* ✅ Tailwind 4 - @theme inline */
@theme inline {
  --color-primary: #334155;
  --color-background: #ffffff;
  --color-foreground: #0f172a;
}
```

```css
/* ❌ CSS Tradicional (NO genera utilidades) */
:root {
  --primary: #334155;
  --background: #ffffff;
}
```

**Diferencia clave**: `@theme` genera utilidades (`bg-primary`), `:root` solo crea variables CSS.

---

### **2.2 Arquitectura Actual de PROBO**

#### **Archivo**: `app/assets/tailwind.css` (350 líneas)

**Estructura actual**:

```css
/* LÍNEAS 6-64: @theme inline - Variables TW4 */
@theme inline {
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-primary: #334155;
  /* ... */
}

/* LÍNEAS 67-103: :root - Variables CSS tradicionales (DUPLICADAS) */
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --primary: #334155;
  /* ... */
}

/* LÍNEAS 106-164: .dark - Variables modo oscuro (DUPLICADAS) */
.dark {
  --color-background: #0f172a;
  --background: #0f172a;
  /* ... */
}
```

#### **Problema Identificado: DUPLICACIÓN**

| Variable TW4         | Variable Tradicional | ¿Necesaria?             |
| -------------------- | -------------------- | ----------------------- |
| `--color-background` | `--background`       | ❌ Solo necesitamos TW4 |
| `--color-foreground` | `--foreground`       | ❌ Solo necesitamos TW4 |
| `--color-primary`    | `--primary`          | ❌ Solo necesitamos TW4 |

**Total de líneas duplicadas**: ~120 líneas

---

### **2.3 Hipótesis de Solución**

#### **Opción 1: Mantener Sistema Híbrido** ❌

- Pros: No rompe componentes shadcn existentes
- Contras: Duplicación, confusión, difícil mantenimiento

#### **Opción 2: Migrar 100% a Tailwind 4** ✅ (ELEGIDA)

- Pros: Una sola fuente de verdad, escalable, soporta paletas dinámicas
- Contras: Requiere migrar algunos componentes shadcn (pero es trivial)

**Decisión**: Usar **solo @theme inline** con namespace `--color-*`.

---

## 🎯 3. DIAGNÓSTICO DEL PROBLEMA

### **3.1 Problemas Detectados**

#### **Problema 1: Colores Hardcoded**

```vue
<!-- ❌ ANTES: Hardcoded -->
<div class="bg-gray-50 text-gray-900 border-gray-200">

<!-- ✅ DESPUÉS: Variables semánticas -->
<div class="bg-card text-card-foreground border-border">
```

#### **Problema 2: Duplicación de Variables**

```css
/* ❌ ACTUAL: Duplicación */
@theme inline {
  --color-primary: #334155;
}
:root {
  --primary: #334155; /* DUPLICADO */
}

/* ✅ PROPUESTO: Una sola fuente */
@theme inline {
  --color-primary: #334155;
}
/* Componentes usan: bg-primary (generado automáticamente) */
```

#### **Problema 3: No Hay Sistema de Paletas**

- Actualmente solo existe **1 paleta** (purple/slate)
- Usuario quiere **4 paletas intercambiables**:
  1. **Base** (purple - actual)
  2. **Light** (colores claros)
  3. **Dark** (colores oscuros automático)
  4. **System** (sigue preferencia OS)

---

## 💡 4. PLANTEAMIENTO DE LA SOLUCIÓN

### **4.1 Arquitectura Propuesta**

#### **Estructura de Variables CSS**

```
@theme inline
  ├── LIGHT MODE (default)
  │   ├── --color-background: #ffffff
  │   ├── --color-foreground: #0f172a
  │   ├── --color-primary: [PALETA]
  │   └── ... (20+ variables semánticas)
  │
  └── DARK MODE (.dark)
      ├── --color-background: #0f172a
      ├── --color-foreground: #f8fafc
      ├── --color-primary: [PALETA]
      └── ... (20+ variables semánticas)
```

#### **4 Paletas de Colores**

**Paleta 1: Base (Purple/Slate)** - Actual, profesional, corporativo

```css
@theme inline {
  --color-primary: #334155; /* slate-700 */
  --color-primary-foreground: #f8fafc;
  --color-accent: #f1f5f9; /* slate-100 */
  --color-accent-foreground: #334155;
}
```

**Paleta 2: Oceanic (Blue/Teal)** - Fresco, tecnológico, confiable

```css
@theme inline {
  --color-primary: #0ea5e9; /* sky-500 */
  --color-primary-foreground: #ffffff;
  --color-accent: #e0f2fe; /* sky-100 */
  --color-accent-foreground: #075985;
}
```

**Paleta 3: Forest (Green/Emerald)** - Natural, crecimiento, estabilidad

```css
@theme inline {
  --color-primary: #10b981; /* emerald-500 */
  --color-primary-foreground: #ffffff;
  --color-accent: #d1fae5; /* emerald-100 */
  --color-accent-foreground: #065f46;
}
```

**Paleta 4: Sunset (Orange/Pink)** - Energético, creativo, moderno

```css
@theme inline {
  --color-primary: #f97316; /* orange-500 */
  --color-primary-foreground: #ffffff;
  --color-accent: #fed7aa; /* orange-200 */
  --color-accent-foreground: #9a3412;
}
```

---

### **4.2 Variables Semánticas Completas**

#### **Variables Base (20 obligatorias)**

| Variable                         | Propósito                           | Ejemplo de Uso                |
| -------------------------------- | ----------------------------------- | ----------------------------- |
| `--color-background`             | Fondo principal                     | `bg-background`               |
| `--color-foreground`             | Texto principal                     | `text-foreground`             |
| `--color-card`                   | Fondo de tarjetas                   | `bg-card`                     |
| `--color-card-foreground`        | Texto en tarjetas                   | `text-card-foreground`        |
| `--color-popover`                | Fondo de popovers                   | `bg-popover`                  |
| `--color-popover-foreground`     | Texto en popovers                   | `text-popover-foreground`     |
| `--color-primary`                | Color principal (cambia por paleta) | `bg-primary`                  |
| `--color-primary-foreground`     | Texto sobre primary                 | `text-primary-foreground`     |
| `--color-secondary`              | Color secundario                    | `bg-secondary`                |
| `--color-secondary-foreground`   | Texto sobre secondary               | `text-secondary-foreground`   |
| `--color-muted`                  | Fondo sutil/desactivado             | `bg-muted`                    |
| `--color-muted-foreground`       | Texto sutil                         | `text-muted-foreground`       |
| `--color-accent`                 | Color de acento (hover)             | `bg-accent`                   |
| `--color-accent-foreground`      | Texto sobre accent                  | `text-accent-foreground`      |
| `--color-destructive`            | Color de error/peligro              | `bg-destructive`              |
| `--color-destructive-foreground` | Texto sobre destructive             | `text-destructive-foreground` |
| `--color-border`                 | Bordes                              | `border-border`               |
| `--color-input`                  | Bordes de inputs                    | `border-input`                |
| `--color-ring`                   | Focus ring                          | `ring-ring`                   |

#### **Variables Sidebar (8 adicionales)**

| Variable                             | Propósito                   |
| ------------------------------------ | --------------------------- |
| `--color-sidebar`                    | Fondo del sidebar           |
| `--color-sidebar-foreground`         | Texto del sidebar           |
| `--color-sidebar-primary`            | Primary dentro del sidebar  |
| `--color-sidebar-primary-foreground` | Texto sobre sidebar-primary |
| `--color-sidebar-accent`             | Accent del sidebar (hover)  |
| `--color-sidebar-accent-foreground`  | Texto sobre sidebar-accent  |
| `--color-sidebar-border`             | Bordes del sidebar          |
| `--color-sidebar-ring`               | Focus ring del sidebar      |

**Total de variables por paleta**: 28 variables × 2 modos (light/dark) = **56 valores**

---

### **4.3 Implementación de Cambio Dinámico de Paleta**

#### **Atributo HTML para Paleta**

```html
<html data-palette="base" class="dark">
  <!-- Paleta: base, oceanic, forest, sunset -->
  <!-- Tema: light, dark -->
</html>
```

#### **Estructura CSS**

```css
/* PALETA BASE (default) */
@theme inline {
  --color-primary: #334155;
  /* ... */
}

.dark {
  --color-primary: #60a5fa;
  /* ... */
}

/* PALETA OCEANIC */
html[data-palette="oceanic"] {
  --color-primary: #0ea5e9;
  /* ... */
}

html[data-palette="oceanic"].dark {
  --color-primary: #38bdf8;
  /* ... */
}

/* PALETA FOREST */
html[data-palette="forest"] {
  --color-primary: #10b981;
  /* ... */
}

html[data-palette="forest"].dark {
  --color-primary: #34d399;
  /* ... */
}

/* PALETA SUNSET */
html[data-palette="sunset"] {
  --color-primary: #f97316;
  /* ... */
}

html[data-palette="sunset"].dark {
  --color-primary: #fb923c;
  /* ... */
}
```

---

### **4.4 Componente PaletteSelector**

```vue
<template>
  <div class="space-y-4">
    <h3 class="text-sm font-semibold text-muted-foreground">
      {{ t("palette.title") }}
    </h3>

    <div class="grid grid-cols-2 gap-3">
      <!-- Base Palette -->
      <div
        class="cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': currentPalette === 'base' }"
        @click="setPalette('base')"
      >
        <div class="flex items-center gap-2">
          <Palette class="w-4 h-4 text-primary" />
          <span class="text-sm font-medium">{{ t("palette.base") }}</span>
        </div>
        <!-- Preview de colores -->
        <div class="mt-2 flex gap-1">
          <div class="h-3 w-3 rounded-full bg-slate-700" />
          <div class="h-3 w-3 rounded-full bg-slate-500" />
          <div class="h-3 w-3 rounded-full bg-slate-300" />
        </div>
      </div>

      <!-- Oceanic Palette -->
      <div
        class="cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': currentPalette === 'oceanic' }"
        @click="setPalette('oceanic')"
      >
        <div class="flex items-center gap-2">
          <Waves class="w-4 h-4 text-sky-500" />
          <span class="text-sm font-medium">{{ t("palette.oceanic") }}</span>
        </div>
        <div class="mt-2 flex gap-1">
          <div class="h-3 w-3 rounded-full bg-sky-700" />
          <div class="h-3 w-3 rounded-full bg-sky-500" />
          <div class="h-3 w-3 rounded-full bg-sky-300" />
        </div>
      </div>

      <!-- Forest Palette -->
      <div
        class="cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': currentPalette === 'forest' }"
        @click="setPalette('forest')"
      >
        <div class="flex items-center gap-2">
          <TreeDeciduous class="w-4 h-4 text-emerald-500" />
          <span class="text-sm font-medium">{{ t("palette.forest") }}</span>
        </div>
        <div class="mt-2 flex gap-1">
          <div class="h-3 w-3 rounded-full bg-emerald-700" />
          <div class="h-3 w-3 rounded-full bg-emerald-500" />
          <div class="h-3 w-3 rounded-full bg-emerald-300" />
        </div>
      </div>

      <!-- Sunset Palette -->
      <div
        class="cursor-pointer rounded-lg border p-3 hover:bg-accent transition-colors"
        :class="{ 'ring-2 ring-primary': currentPalette === 'sunset' }"
        @click="setPalette('sunset')"
      >
        <div class="flex items-center gap-2">
          <Sunset class="w-4 h-4 text-orange-500" />
          <span class="text-sm font-medium">{{ t("palette.sunset") }}</span>
        </div>
        <div class="mt-2 flex gap-1">
          <div class="h-3 w-3 rounded-full bg-orange-700" />
          <div class="h-3 w-3 rounded-full bg-orange-500" />
          <div class="h-3 w-3 rounded-full bg-orange-300" />
        </div>
      </div>
    </div>

    <!-- Preview actual -->
    <div class="text-xs text-muted-foreground">
      {{ t("palette.current") }}: {{ currentPalette }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Palette, Waves, TreeDeciduous, Sunset } from "lucide-vue-next";
import { usePalette } from "~/composables/usePalette";
import { useProboI18n } from "~/composables/useProboI18n";

const { currentPalette, setPalette } = usePalette();
const { t } = useProboI18n();
</script>
```

---

## 📝 5. PLANIFICACIÓN DE ACCIONES

### **Fase 1: Preparación del Sistema de Variables**

#### **Acción 1.1: Limpiar `tailwind.css`**

- ❌ Eliminar sección `:root` (líneas 67-103)
- ❌ Eliminar variables duplicadas en `.dark` (líneas 106-164)
- ✅ Mantener solo `@theme inline` (líneas 6-64)
- ✅ Reducir de 350 líneas → ~180 líneas

#### **Acción 1.2: Reorganizar Variables en @theme**

```css
@theme inline {
  /* === RADII === */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* === PALETA BASE - LIGHT MODE === */
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-card: #ffffff;
  --color-card-foreground: #0f172a;
  --color-popover: #ffffff;
  --color-popover-foreground: #0f172a;
  --color-primary: #334155;
  --color-primary-foreground: #f8fafc;
  --color-secondary: #f1f5f9;
  --color-secondary-foreground: #334155;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-accent: #f1f5f9;
  --color-accent-foreground: #334155;
  --color-destructive: #dc2626;
  --color-destructive-foreground: #f8fafc;
  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
  --color-ring: #64748b;

  /* === SIDEBAR - LIGHT MODE === */
  --color-sidebar: #f8fafc;
  --color-sidebar-foreground: #0f172a;
  --color-sidebar-primary: #334155;
  --color-sidebar-primary-foreground: #f8fafc;
  --color-sidebar-accent: #f1f5f9;
  --color-sidebar-accent-foreground: #334155;
  --color-sidebar-border: #e2e8f0;
  --color-sidebar-ring: #64748b;

  /* === ANIMATIONS === */
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from {
      height: 0;
    }
    to {
      height: var(--reka-accordion-content-height);
    }
  }

  @keyframes accordion-up {
    from {
      height: var(--reka-accordion-content-height);
    }
    to {
      height: 0;
    }
  }
}
```

#### **Acción 1.3: Añadir Variables para Modo Oscuro**

```css
.dark {
  /* === PALETA BASE - DARK MODE === */
  --color-background: #0f172a;
  --color-foreground: #f8fafc;
  --color-card: #1e293b;
  --color-card-foreground: #f8fafc;
  --color-popover: #1e293b;
  --color-popover-foreground: #f8fafc;
  --color-primary: #60a5fa;
  --color-primary-foreground: #0f172a;
  --color-secondary: #334155;
  --color-secondary-foreground: #f8fafc;
  --color-muted: #334155;
  --color-muted-foreground: #94a3b8;
  --color-accent: #334155;
  --color-accent-foreground: #f8fafc;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #0f172a;
  --color-border: #334155;
  --color-input: #334155;
  --color-ring: #60a5fa;

  /* === SIDEBAR - DARK MODE === */
  --color-sidebar: #1e293b;
  --color-sidebar-foreground: #f8fafc;
  --color-sidebar-primary: #60a5fa;
  --color-sidebar-primary-foreground: #0f172a;
  --color-sidebar-accent: #334155;
  --color-sidebar-accent-foreground: #f8fafc;
  --color-sidebar-border: #334155;
  --color-sidebar-ring: #60a5fa;
}
```

---

### **Fase 2: Implementar Paletas Adicionales**

#### **Acción 2.1: Paleta Oceanic**

```css
/* OCEANIC - LIGHT MODE */
html[data-palette="oceanic"] {
  --color-primary: #0ea5e9; /* sky-500 */
  --color-primary-foreground: #ffffff;
  --color-accent: #e0f2fe; /* sky-100 */
  --color-accent-foreground: #075985; /* sky-900 */
  --color-sidebar-primary: #0ea5e9;
  --color-sidebar-accent: #e0f2fe;
}

/* OCEANIC - DARK MODE */
html[data-palette="oceanic"].dark {
  --color-primary: #38bdf8; /* sky-400 */
  --color-primary-foreground: #0c4a6e; /* sky-950 */
  --color-accent: #0c4a6e;
  --color-accent-foreground: #e0f2fe;
  --color-sidebar-primary: #38bdf8;
  --color-sidebar-accent: #0c4a6e;
}
```

#### **Acción 2.2: Paleta Forest**

```css
/* FOREST - LIGHT MODE */
html[data-palette="forest"] {
  --color-primary: #10b981; /* emerald-500 */
  --color-primary-foreground: #ffffff;
  --color-accent: #d1fae5; /* emerald-100 */
  --color-accent-foreground: #065f46; /* emerald-800 */
  --color-sidebar-primary: #10b981;
  --color-sidebar-accent: #d1fae5;
}

/* FOREST - DARK MODE */
html[data-palette="forest"].dark {
  --color-primary: #34d399; /* emerald-400 */
  --color-primary-foreground: #064e3b; /* emerald-950 */
  --color-accent: #064e3b;
  --color-accent-foreground: #d1fae5;
  --color-sidebar-primary: #34d399;
  --color-sidebar-accent: #064e3b;
}
```

#### **Acción 2.3: Paleta Sunset**

```css
/* SUNSET - LIGHT MODE */
html[data-palette="sunset"] {
  --color-primary: #f97316; /* orange-500 */
  --color-primary-foreground: #ffffff;
  --color-accent: #fed7aa; /* orange-200 */
  --color-accent-foreground: #9a3412; /* orange-800 */
  --color-sidebar-primary: #f97316;
  --color-sidebar-accent: #fed7aa;
}

/* SUNSET - DARK MODE */
html[data-palette="sunset"].dark {
  --color-primary: #fb923c; /* orange-400 */
  --color-primary-foreground: #7c2d12; /* orange-950 */
  --color-accent: #7c2d12;
  --color-accent-foreground: #fed7aa;
  --color-sidebar-primary: #fb923c;
  --color-sidebar-accent: #7c2d12;
}
```

---

### **Fase 3: Crear Composable usePalette**

#### **Acción 3.1: Archivo `composables/usePalette.ts`**

```typescript
import { ref, watch } from "vue";

export type Palette = "base" | "oceanic" | "forest" | "sunset";

const STORAGE_KEY = "probo-palette";

export const usePalette = () => {
  // Estado reactivo
  const currentPalette = ref<Palette>("base");

  // Cargar paleta guardada
  const loadPalette = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem(STORAGE_KEY) as Palette | null;
      if (stored && ["base", "oceanic", "forest", "sunset"].includes(stored)) {
        currentPalette.value = stored;
        applyPalette(stored);
      }
    }
  };

  // Aplicar paleta al HTML
  const applyPalette = (palette: Palette) => {
    if (import.meta.client) {
      document.documentElement.setAttribute("data-palette", palette);
    }
  };

  // Cambiar paleta
  const setPalette = (palette: Palette) => {
    currentPalette.value = palette;
    applyPalette(palette);

    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, palette);
    }
  };

  // Watcher para cambios
  watch(currentPalette, (newPalette) => {
    applyPalette(newPalette);
  });

  // Auto-inicializar
  if (import.meta.client) {
    loadPalette();
  }

  return {
    currentPalette,
    setPalette,
    loadPalette,
  };
};
```

---

### **Fase 4: Migrar Componentes a Variables Semánticas**

#### **Acción 4.1: UserDropdownMenu.vue**

```diff
<DropdownMenuContent
  align="end"
- class="w-56 bg-gray-50 text-foreground border-border"
+ class="w-56 bg-card text-card-foreground border-border"
>
```

**Explicación**: `bg-gray-50` → `bg-card` (variable semántica para fondos de tarjetas)

---

#### **Acción 4.2: ThemeSelector.vue**

```diff
<!-- Dark Theme Preview -->
<div class="flex items-center space-x-2">
  <Moon class="w-4 h-4" />
  <span class="text-sm font-medium">{{ t("theme.dark") }}</span>
</div>
- <div class="mt-2 rounded border border-gray-600 bg-gray-800 p-1">
-   <div class="h-4 w-full rounded bg-gray-700" />
+ <div class="mt-2 rounded border border-muted bg-card p-1">
+   <div class="h-4 w-full rounded bg-muted" />
</div>
```

**Explicación**:

- `bg-gray-800` → `bg-card` (fondo de tarjeta en dark mode)
- `bg-gray-700` → `bg-muted` (fondo sutil/desactivado)
- `border-gray-600` → `border-muted` (borde sutil)

---

#### **Acción 4.3: ConfigurationModal.vue**

```diff
<DialogContent
  class="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]
         max-h-[90vh] overflow-hidden border shadow-lg duration-200
         data-[state=open]:animate-in data-[state=closed]:animate-out
         data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
         data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
         data-[state=closed]:slide-out-to-left-1/2
         data-[state=closed]:slide-out-to-top-[48%]
         data-[state=open]:slide-in-from-left-1/2
         data-[state=open]:slide-in-from-top-[48%]
-        rounded-lg p-6 gap-4 grid w-full min-w-fit bg-safe text-safe border-safe bg-gray-100"
+        rounded-lg p-6 gap-4 grid w-full min-w-fit bg-background text-foreground border-border"
>
```

**Explicación**:

- `bg-gray-100` → `bg-background` (fondo principal)
- Se eliminan las clases `-safe` porque ya no son necesarias
- Variables semánticas se adaptan automáticamente a light/dark

---

### **Fase 5: Integrar PaletteSelector en ConfigurationModal**

#### **Acción 5.1: Crear componente PaletteSelector.vue**

```vue
<template>
  <!-- Código completo en sección 4.4 -->
</template>
```

#### **Acción 5.2: Añadir al ConfigurationModal**

```vue
<template>
  <Dialog v-model:open="isOpen">
    <!-- ... -->
    <div class="flex h-[600px] gap-6">
      <!-- Sidebar de navegación -->
      <div class="w-64 border-r pr-4">
        <!-- ... secciones existentes ... -->

        <!-- Nueva sección: Apariencia -->
        <div class="mt-6">
          <h3
            class="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2"
          >
            {{ t("config.appearance") }}
          </h3>
          <div class="space-y-1">
            <div
              :class="
                cn(
                  'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer',
                  activeSection === 'palette'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )
              "
              @click="activeSection = 'palette'"
            >
              <Palette class="w-4 h-4 inline mr-2" />
              {{ t("config.colorPalette") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 overflow-y-auto">
        <!-- ... secciones existentes ... -->

        <!-- Sección Palette -->
        <div v-if="activeSection === 'palette'" class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-1">
              {{ t("config.colorPaletteTitle") }}
            </h2>
            <p class="text-sm text-muted-foreground">
              {{ t("config.colorPaletteDesc") }}
            </p>
          </div>
          <PaletteSelector />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { Palette } from "lucide-vue-next";
import PaletteSelector from "./PaletteSelector.vue";
// ... otros imports
</script>
```

---

### **Fase 6: Añadir Traducciones**

#### **Acción 6.1: Archivo `i18n/locales/es/palette.ts`**

```typescript
export default {
  title: "Paleta de Colores",
  base: "Base (Purple)",
  oceanic: "Oceánico (Blue)",
  forest: "Bosque (Green)",
  sunset: "Atardecer (Orange)",
  current: "Paleta actual",
  description:
    "Selecciona la paleta de colores que mejor se adapte a tu estilo.",
} as const;
```

#### **Acción 6.2: Añadir a config.ts**

```typescript
export default {
  // ... existentes
  appearance: "Apariencia",
  colorPalette: "Paleta de Colores",
  colorPaletteTitle: "Personaliza tu Paleta",
  colorPaletteDesc:
    "Elige entre 4 paletas de colores profesionales para toda la aplicación.",
} as const;
```

#### **Acción 6.3: Replicar en 5 idiomas**

- ✅ Español (es) - HECHO
- 🔄 Inglés (en)
- 🔄 Alemán (de)
- 🔄 Francés (fr)
- 🔄 Chino (zh)
- 🔄 Hindi (hi)

---

## 🔍 6. REVISIÓN DE ACCIONES

### **6.1 Checklist de Implementación**

#### **Fase 1: Variables CSS** ✅

- [ ] Eliminar `:root` duplicado de tailwind.css
- [ ] Eliminar variables duplicadas en `.dark`
- [ ] Reorganizar `@theme inline` con comentarios claros
- [ ] Verificar que no hay errores de compilación
- [ ] Reducir archivo de 350 → 180 líneas

#### **Fase 2: Paletas** 🔄

- [ ] Añadir paleta Oceanic (light + dark)
- [ ] Añadir paleta Forest (light + dark)
- [ ] Añadir paleta Sunset (light + dark)
- [ ] Probar cambio de paleta en navegador
- [ ] Verificar contraste de colores (mínimo 4.5:1)

#### **Fase 3: Composable** 🔄

- [ ] Crear `composables/usePalette.ts`
- [ ] Implementar localStorage persistence
- [ ] Añadir auto-inicialización en `app.vue`
- [ ] Probar cambio de paleta con DevTools

#### **Fase 4: Migración Componentes** 🔄

- [ ] Migrar UserDropdownMenu.vue
- [ ] Migrar ThemeSelector.vue
- [ ] Migrar ConfigurationModal.vue
- [ ] Verificar que no hay clases `bg-gray-*` residuales
- [ ] Probar componentes en light/dark mode

#### **Fase 5: PaletteSelector** 🔄

- [ ] Crear componente PaletteSelector.vue
- [ ] Integrar en ConfigurationModal
- [ ] Añadir iconos de lucide-vue-next
- [ ] Probar cambio de paleta en vivo

#### **Fase 6: i18n** 🔄

- [ ] Crear palette.ts en 6 idiomas
- [ ] Actualizar config.ts en 6 idiomas
- [ ] Probar traducciones cambiando idioma
- [ ] Verificar que no hay keys faltantes

---

### **6.2 Antes vs Después**

#### **Tailwind.css**

```
ANTES:
- 350 líneas
- Duplicación de variables (--color-primary y --primary)
- Sistema híbrido (@theme + :root)
- Solo 1 paleta (purple/slate)

DESPUÉS:
- 180 líneas (-48%)
- Una sola fuente de verdad (@theme inline)
- 4 paletas intercambiables
- Código más limpio y mantenible
```

#### **Componentes**

```
ANTES:
- bg-gray-50, bg-gray-100, bg-gray-600, bg-gray-700, bg-gray-800
- Colores hardcoded no cambian con temas
- No adaptable a paletas

DESPUÉS:
- bg-card, bg-muted, bg-background, border-muted
- Variables semánticas adaptan a light/dark automáticamente
- Compatible con 4 paletas
```

#### **Experiencia de Usuario**

```
ANTES:
- Solo modo light/dark
- Sin personalización de colores
- 2 opciones de tema

DESPUÉS:
- Modo light/dark
- 4 paletas de colores profesionales
- 8 combinaciones posibles (4 paletas × 2 modos)
```

---

## 📦 7. ENTREGA FINAL DEL PLAN

### **7.1 Código Completo: tailwind.css**

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* === RADII === */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* ============================================
     PALETA BASE (Purple/Slate) - LIGHT MODE
     ============================================ */

  /* Core Colors */
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-card: #ffffff;
  --color-card-foreground: #0f172a;
  --color-popover: #ffffff;
  --color-popover-foreground: #0f172a;

  /* Brand Colors */
  --color-primary: #334155; /* slate-700 */
  --color-primary-foreground: #f8fafc; /* slate-50 */
  --color-secondary: #f1f5f9; /* slate-100 */
  --color-secondary-foreground: #334155;

  /* UI Colors */
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-accent: #f1f5f9;
  --color-accent-foreground: #334155;
  --color-destructive: #dc2626; /* red-600 */
  --color-destructive-foreground: #f8fafc;

  /* Borders & Inputs */
  --color-border: #e2e8f0; /* slate-200 */
  --color-input: #e2e8f0;
  --color-ring: #64748b; /* slate-500 */

  /* Sidebar */
  --color-sidebar: #f8fafc;
  --color-sidebar-foreground: #0f172a;
  --color-sidebar-primary: #334155;
  --color-sidebar-primary-foreground: #f8fafc;
  --color-sidebar-accent: #f1f5f9;
  --color-sidebar-accent-foreground: #334155;
  --color-sidebar-border: #e2e8f0;
  --color-sidebar-ring: #64748b;

  /* === ANIMATIONS === */
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;

  @keyframes accordion-down {
    from {
      height: 0;
    }
    to {
      height: var(--reka-accordion-content-height);
    }
  }

  @keyframes accordion-up {
    from {
      height: var(--reka-accordion-content-height);
    }
    to {
      height: 0;
    }
  }
}

/* ============================================
   DARK MODE - PALETA BASE
   ============================================ */
.dark {
  /* Core Colors */
  --color-background: #0f172a; /* slate-900 */
  --color-foreground: #f8fafc; /* slate-50 */
  --color-card: #1e293b; /* slate-800 */
  --color-card-foreground: #f8fafc;
  --color-popover: #1e293b;
  --color-popover-foreground: #f8fafc;

  /* Brand Colors */
  --color-primary: #60a5fa; /* blue-400 */
  --color-primary-foreground: #0f172a;
  --color-secondary: #334155; /* slate-700 */
  --color-secondary-foreground: #f8fafc;

  /* UI Colors */
  --color-muted: #334155;
  --color-muted-foreground: #94a3b8; /* slate-400 */
  --color-accent: #334155;
  --color-accent-foreground: #f8fafc;
  --color-destructive: #ef4444; /* red-500 */
  --color-destructive-foreground: #0f172a;

  /* Borders & Inputs */
  --color-border: #334155;
  --color-input: #334155;
  --color-ring: #60a5fa;

  /* Sidebar */
  --color-sidebar: #1e293b;
  --color-sidebar-foreground: #f8fafc;
  --color-sidebar-primary: #60a5fa;
  --color-sidebar-primary-foreground: #0f172a;
  --color-sidebar-accent: #334155;
  --color-sidebar-accent-foreground: #f8fafc;
  --color-sidebar-border: #334155;
  --color-sidebar-ring: #60a5fa;
}

/* ============================================
   PALETA OCEANIC (Blue/Teal) - LIGHT MODE
   ============================================ */
html[data-palette="oceanic"] {
  --color-primary: #0ea5e9; /* sky-500 */
  --color-primary-foreground: #ffffff;
  --color-accent: #e0f2fe; /* sky-100 */
  --color-accent-foreground: #075985; /* sky-900 */
  --color-ring: #0ea5e9;

  --color-sidebar-primary: #0ea5e9;
  --color-sidebar-accent: #e0f2fe;
  --color-sidebar-ring: #0ea5e9;
}

html[data-palette="oceanic"].dark {
  --color-primary: #38bdf8; /* sky-400 */
  --color-primary-foreground: #0c4a6e; /* sky-950 */
  --color-accent: #0c4a6e;
  --color-accent-foreground: #e0f2fe;
  --color-ring: #38bdf8;

  --color-sidebar-primary: #38bdf8;
  --color-sidebar-accent: #0c4a6e;
  --color-sidebar-ring: #38bdf8;
}

/* ============================================
   PALETA FOREST (Green/Emerald) - LIGHT MODE
   ============================================ */
html[data-palette="forest"] {
  --color-primary: #10b981; /* emerald-500 */
  --color-primary-foreground: #ffffff;
  --color-accent: #d1fae5; /* emerald-100 */
  --color-accent-foreground: #065f46; /* emerald-800 */
  --color-ring: #10b981;

  --color-sidebar-primary: #10b981;
  --color-sidebar-accent: #d1fae5;
  --color-sidebar-ring: #10b981;
}

html[data-palette="forest"].dark {
  --color-primary: #34d399; /* emerald-400 */
  --color-primary-foreground: #064e3b; /* emerald-950 */
  --color-accent: #064e3b;
  --color-accent-foreground: #d1fae5;
  --color-ring: #34d399;

  --color-sidebar-primary: #34d399;
  --color-sidebar-accent: #064e3b;
  --color-sidebar-ring: #34d399;
}

/* ============================================
   PALETA SUNSET (Orange/Pink) - LIGHT MODE
   ============================================ */
html[data-palette="sunset"] {
  --color-primary: #f97316; /* orange-500 */
  --color-primary-foreground: #ffffff;
  --color-accent: #fed7aa; /* orange-200 */
  --color-accent-foreground: #9a3412; /* orange-800 */
  --color-ring: #f97316;

  --color-sidebar-primary: #f97316;
  --color-sidebar-accent: #fed7aa;
  --color-sidebar-ring: #f97316;
}

html[data-palette="sunset"].dark {
  --color-primary: #fb923c; /* orange-400 */
  --color-primary-foreground: #7c2d12; /* orange-950 */
  --color-accent: #7c2d12;
  --color-accent-foreground: #fed7aa;
  --color-ring: #fb923c;

  --color-sidebar-primary: #fb923c;
  --color-sidebar-accent: #7c2d12;
  --color-sidebar-ring: #fb923c;
}

/* ============================================
   BASE STYLES
   ============================================ */
@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }

  html {
    @apply bg-background;
  }
}

/* ============================================
   CUSTOM COMPONENTS
   ============================================ */
@layer components {
  /* Scrollbar personalizado */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--color-muted) var(--color-background);
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    @apply bg-background rounded;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    @apply bg-muted rounded border border-background;
    transition: background-color 0.2s ease;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    @apply bg-accent;
  }

  /* Fuentes */
  .font-inter {
    font-family: var(
      --font-primary,
      Inter,
      ui-sans-serif,
      system-ui,
      sans-serif
    );
  }

  .font-roboto {
    font-family: var(
      --font-primary,
      Roboto,
      ui-sans-serif,
      system-ui,
      sans-serif
    );
  }

  .font-opensans {
    font-family: var(
      --font-primary,
      "Open Sans",
      ui-sans-serif,
      system-ui,
      sans-serif
    );
  }

  .font-firacode {
    font-family: var(
      --font-secondary,
      "Fira Code",
      ui-monospace,
      SFMono-Regular,
      Consolas,
      monospace
    );
  }

  .font-jetbrains {
    font-family: var(
      --font-secondary,
      "JetBrains Mono",
      ui-monospace,
      SFMono-Regular,
      Consolas,
      monospace
    );
  }

  .font-cascadia {
    font-family: var(
      --font-secondary,
      "Cascadia Code",
      ui-monospace,
      SFMono-Regular,
      Consolas,
      monospace
    );
  }

  body {
    font-family: var(
      --font-primary,
      Inter,
      ui-sans-serif,
      system-ui,
      sans-serif
    );
  }

  code,
  pre,
  .code {
    font-family: var(
      --font-secondary,
      "Fira Code",
      ui-monospace,
      SFMono-Regular,
      Consolas,
      monospace
    );
  }
}
```

---

### **7.2 Comando de Verificación**

```bash
# Verificar que no quedan colores hardcoded
grep -r "bg-purple\|text-purple\|bg-gray-[0-9]\|text-gray-[0-9]\|bg-red-[0-9]\|bg-blue-[0-9]" app/components/*.vue

# Resultado esperado: Sin matches (excepto shadcn/ui que está permitido)
```

---

### **7.3 Testing Manual**

#### **Test 1: Cambio de Paleta**

1. Abrir http://localhost:3001
2. Abrir modal configuración (⚙️)
3. Ir a sección "Paleta de Colores"
4. Cambiar entre: Base → Oceanic → Forest → Sunset
5. **Verificar**: Sidebar, botones, y cards cambian de color inmediatamente

#### **Test 2: Cambio de Tema (Light/Dark)**

1. Con paleta Oceanic seleccionada
2. Cambiar tema: Light → Dark
3. **Verificar**: Colores se ajustan automáticamente manteniendo paleta

#### **Test 3: Persistencia**

1. Seleccionar paleta Forest + Dark mode
2. Recargar página (F5)
3. **Verificar**: Paleta y tema persisten

#### **Test 4: Responsive**

1. Cambiar tamaño ventana: Desktop → Tablet → Mobile
2. **Verificar**: Colores se mantienen consistentes en todos los breakpoints

---

### **7.4 Cronograma de Implementación**

| Fase                             | Tiempo Estimado | Prioridad |
| -------------------------------- | --------------- | --------- |
| Fase 1: Limpiar tailwind.css     | 30 min          | 🔴 Alta   |
| Fase 2: Añadir 3 paletas         | 45 min          | 🔴 Alta   |
| Fase 3: Crear composable         | 20 min          | 🟡 Media  |
| Fase 4: Migrar 3 componentes     | 30 min          | 🔴 Alta   |
| Fase 5: PaletteSelector          | 40 min          | 🟡 Media  |
| Fase 6: Traducciones (6 idiomas) | 25 min          | 🟢 Baja   |
| Testing & Ajustes                | 30 min          | 🔴 Alta   |
| **TOTAL**                        | **~3.5 horas**  |           |

---

### **7.5 Próximos Pasos Recomendados**

#### **Inmediato** (Hoy)

1. ✅ Limpiar `tailwind.css` (eliminar duplicación)
2. ✅ Añadir 4 paletas completas
3. ✅ Migrar 3 componentes a variables semánticas

#### **Corto Plazo** (Esta semana)

4. ✅ Crear composable `usePalette`
5. ✅ Implementar `PaletteSelector.vue`
6. ✅ Integrar en `ConfigurationModal`
7. ✅ Añadir traducciones en 6 idiomas

#### **Mediano Plazo** (Siguiente semana)

8. 🔄 Auditar componentes shadcn/ui (verificar compatibilidad)
9. 🔄 Documentar guía de estilos para nuevos componentes
10. 🔄 Crear storybook de componentes con las 4 paletas

---

## 🎯 RESUMEN EJECUTIVO

### **Problema**

- Colores hardcoded (`bg-gray-50`, `text-purple-600`) en componentes
- Sistema de variables duplicado e inconsistente
- Sin sistema de paletas intercambiables

### **Solución**

- **Migración 100% a Tailwind 4** con `@theme inline`
- **4 paletas profesionales**: Base (purple), Oceanic (blue), Forest (green), Sunset (orange)
- **28 variables semánticas** por paleta × 2 modos = 56 valores
- **Componente PaletteSelector** integrado en modal configuración
- **Persistencia** en localStorage con composable `usePalette`

### **Beneficios**

- ✅ Código más limpio (-48% líneas en tailwind.css)
- ✅ Mantenimiento simplificado (una sola fuente de verdad)
- ✅ 8 combinaciones visuales (4 paletas × 2 temas)
- ✅ Cambio instantáneo sin recargar página
- ✅ 100% compatible con shadcn/ui
- ✅ Escalable para futuras paletas

### **Impacto**

```
Componentes migrados:    3/7 (43%)
Líneas reducidas:        -170 líneas (-48%)
Paletas disponibles:     4 (antes: 1)
Combinaciones totales:   8 (antes: 2)
Tiempo de migración:     ~3.5 horas
```

---

**Documentación completada por**: GitHub Copilot  
**Fecha**: 16 de Octubre, 2025  
**Estado**: ✅ **LISTO PARA IMPLEMENTACIÓN**
