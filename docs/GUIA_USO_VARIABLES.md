# 🎨 Guía de Uso: Variables de Tailwind 4

## Cómo usar las variables CSS en tus componentes

---

## 1. Colores de Background

```vue
<template>
  <!-- Fondo principal de la app -->
  <div class="bg-background">
    <!-- Cards y contenedores -->
    <div class="bg-card">...</div>

    <!-- Áreas con énfasis -->
    <div class="bg-primary">...</div>

    <!-- Áreas secundarias -->
    <div class="bg-secondary">...</div>

    <!-- Elementos sutiles -->
    <div class="bg-muted">...</div>

    <!-- Hover states -->
    <div class="hover:bg-accent">...</div>
  </div>
</template>
```

---

## 2. Colores de Texto

```vue
<template>
  <!-- Texto principal -->
  <p class="text-foreground">Texto normal</p>

  <!-- Texto de énfasis -->
  <h1 class="text-primary">Título importante</h1>

  <!-- Texto secundario -->
  <span class="text-muted-foreground">Texto auxiliar</span>

  <!-- Texto en fondos de color -->
  <div class="bg-primary">
    <p class="text-primary-foreground">Texto en fondo primary</p>
  </div>

  <!-- Texto destructivo (errores) -->
  <p class="text-destructive">Error: Campo requerido</p>
</template>
```

---

## 3. Borders y Rings

```vue
<template>
  <!-- Bordes normales -->
  <div class="border border-border">...</div>

  <!-- Inputs -->
  <input class="border border-input focus:border-primary" />

  <!-- Focus rings -->
  <button class="focus:ring-2 focus:ring-ring focus:ring-offset-2">
    Botón con focus ring
  </button>

  <!-- Bordes con diferentes colores -->
  <div class="border-2 border-primary">...</div>
</template>
```

---

## 4. Cards y Popovers

```vue
<template>
  <!-- Card básico -->
  <div class="bg-card text-card-foreground border border-border rounded-lg p-4">
    <h3>Título de la card</h3>
    <p>Contenido de la card</p>
  </div>

  <!-- Popover/Dropdown -->
  <div class="bg-popover text-popover-foreground shadow-lg rounded-md p-2">
    <div class="hover:bg-accent hover:text-accent-foreground rounded px-2 py-1">
      Opción 1
    </div>
    <div class="hover:bg-accent hover:text-accent-foreground rounded px-2 py-1">
      Opción 2
    </div>
  </div>
</template>
```

---

## 5. Dark Mode

```vue
<template>
  <!-- Automático con media query -->
  <div class="bg-background text-foreground">
    <!-- Cambia automáticamente según preferencia del sistema -->
  </div>

  <!-- Manual con clase .dark -->
  <div class="bg-background dark:bg-card">
    <!-- Light: usa bg-background -->
    <!-- Dark: usa bg-card -->
  </div>

  <!-- Texto que se adapta -->
  <p class="text-foreground dark:text-muted-foreground">Texto adaptable</p>
</template>

<script setup lang="ts">
import { useTheme } from "~/composables/useTheme";

const { setTheme } = useTheme();

// Cambiar manualmente
function toggleDark() {
  setTheme("dark");
}
</script>
```

---

## 6. Paletas de Colores

```vue
<template>
  <!-- El color primary cambiará según la paleta activa -->
  <button class="bg-primary text-primary-foreground">
    Botón con color de paleta
  </button>

  <!-- Accent también cambia -->
  <div class="bg-accent text-accent-foreground">Área con accent</div>
</template>

<script setup lang="ts">
import { usePalette } from "~/composables/usePalette";

const { setPalette } = usePalette();

// Cambiar paleta
function changePalette(palette: "base" | "oceanic" | "forest" | "sunset") {
  setPalette(palette);
}
</script>
```

---

## 7. Componentes Completos

### Button Component

```vue
<template>
  <button
    :class="[
      'px-4 py-2 rounded-md font-medium transition-colors',
      variant === 'primary' &&
        'bg-primary text-primary-foreground hover:bg-primary/90',
      variant === 'secondary' &&
        'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      variant === 'destructive' &&
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      variant === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
      variant === 'outline' &&
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "outline";
}>();
</script>
```

### Card Component

```vue
<template>
  <div
    class="bg-card text-card-foreground rounded-lg border border-border shadow-sm"
  >
    <div v-if="$slots.header" class="p-6 border-b border-border">
      <slot name="header" />
    </div>

    <div class="p-6">
      <slot />
    </div>

    <div v-if="$slots.footer" class="p-6 border-t border-border bg-muted/50">
      <slot name="footer" />
    </div>
  </div>
</template>
```

### Input Component

```vue
<template>
  <input
    :class="[
      'w-full px-3 py-2 rounded-md',
      'border border-input',
      'bg-background text-foreground',
      'placeholder:text-muted-foreground',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      error && 'border-destructive focus:ring-destructive',
    ]"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
defineProps<{
  error?: boolean;
}>();
</script>
```

---

## 8. Usando Variables CSS Directamente

```vue
<template>
  <!-- En estilos inline -->
  <div
    :style="{
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-primary-foreground)',
    }"
  >
    Usando variables directamente
  </div>
</template>

<style scoped>
/* En CSS/SCSS */
.mi-componente {
  background: var(--color-background);
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.mi-componente:hover {
  background: var(--color-accent);
  color: var(--color-accent-foreground);
}
</style>
```

---

## 9. Composables Disponibles

### useTheme()

```typescript
import { useTheme } from "~/composables/useTheme";

const {
  currentTheme, // 'light' | 'dark' | 'system'
  effectiveTheme, // 'light' | 'dark' (el tema real aplicado)
  setTheme, // (theme: Theme) => void
} = useTheme();

// Cambiar tema
setTheme("dark");
setTheme("light");
setTheme("system");
```

### usePalette()

```typescript
import { usePalette } from "~/composables/usePalette";

const {
  currentPalette, // 'base' | 'oceanic' | 'forest' | 'sunset'
  setPalette, // (palette: Palette) => void
} = usePalette();

// Cambiar paleta
setPalette("oceanic");
setPalette("forest");
setPalette("sunset");
setPalette("base");
```

---

## 10. Mejores Prácticas

### ✅ DO (Hacer)

```vue
<!-- Usar clases de utilidad -->
<div class="bg-background text-foreground">...</div>

<!-- Combinar con dark mode -->
<div class="bg-card dark:bg-background">...</div>

<!-- Usar foreground colors para texto en backgrounds de color -->
<div class="bg-primary text-primary-foreground">...</div>

<!-- Transiciones suaves -->
<div class="bg-background transition-colors">...</div>
```

### ❌ DON'T (No hacer)

```vue
<!-- No usar colores hardcoded -->
<div class="bg-blue-500">...</div>
❌
<div class="bg-primary">...</div>
✅

<!-- No mezclar sistemas de colores -->
<div class="bg-primary text-blue-500">...</div>
❌
<div class="bg-primary text-primary-foreground">...</div>
✅

<!-- No olvidar foreground colors -->
<div class="bg-primary">Texto</div>
❌
<div class="bg-primary text-primary-foreground">Texto</div>
✅
```

---

## 11. Paletas Disponibles

| Paleta      | Colores       | Uso Recomendado                       |
| ----------- | ------------- | ------------------------------------- |
| **base**    | Purple/Slate  | Profesional, corporativo, por defecto |
| **oceanic** | Blue/Sky      | Tecnológico, fresco, moderno          |
| **forest**  | Green/Emerald | Natural, estable, eco-friendly        |
| **sunset**  | Orange        | Energético, creativo, dinámico        |

---

## 12. Debugging

Para ver las variables activas en DevTools:

```javascript
// En la consola del navegador
getComputedStyle(document.documentElement).getPropertyValue("--color-primary");
getComputedStyle(document.documentElement).getPropertyValue(
  "--color-background"
);

// Ver todas las variables
Array.from(document.styleSheets)
  .flatMap((sheet) => Array.from(sheet.cssRules))
  .filter((rule) => rule.cssText?.includes("--color-"));
```

---

## 📚 Referencias

- Ver más ejemplos en: `/test-tailwind`
- Documentación: `docs/TAILWIND4_FIX.md`
- Variables definidas en: `app/assets/tailwind.css`
