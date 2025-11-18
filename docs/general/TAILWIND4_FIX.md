# 🎨 Fix: Configuración de Tailwind 4 en Nuxt 4

## 🔴 Problema Original

Las variables CSS de Tailwind 4 no estaban siendo reconocidas. Al usar clases como `bg-background`, `text-primary`, etc., no se aplicaban los estilos.

### Causas Raíz:

1. **Sintaxis incorrecta en `@theme`**: Los selectores `.dark` y `html[data-palette="..."]` estaban DENTRO del bloque `@theme`, cuando deberían estar FUERA.
2. **Falta de configuración en Nuxt**: No se especificó la ruta del archivo CSS principal.
3. **Import inexistente**: Se importaba `tw-animate-css` que no existe en el proyecto.

---

## ✅ Solución Implementada

### 1. Reestructuración del archivo `tailwind.css`

**Arquitectura correcta para Tailwind 4:**

```css
@import "tailwindcss";

/* 1️⃣ THEME BASE - Solo valores por defecto (light mode) */
@theme {
  --color-background: #ffffff;
  --color-foreground: #1e293b;
  /* ... más variables base ... */
}

/* 2️⃣ DARK MODE via Media Query */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: oklch(0.13 0.028 261.692);
    --color-foreground: oklch(0.985 0.002 247.839);
    /* ... más variables dark ... */
  }
}

/* 3️⃣ DARK MODE via Clase (Custom Variant) */
@custom-variant dark (&:is(.dark *));

:root .dark {
  --color-background: oklch(0.13 0.028 261.692);
  --color-foreground: oklch(0.985 0.002 247.839);
  /* ... variables CSS normales ... */
}

/* 4️⃣ PALETAS PERSONALIZADAS - FUERA de @theme */
html[data-palette="oceanic"] {
  --color-primary: oklch(0.647 0.161 232.661);
  /* ... solo sobrescribe las que cambien ... */
}
```

### 2. Configuración de Nuxt (`nuxt.config.ts`)

```typescript
export default defineNuxtConfig({
  // Especificar archivo CSS principal
  css: ["~/assets/tailwind.css"],

  // Configuración del módulo Tailwind
  tailwindcss: {
    cssPath: "~/assets/tailwind.css",
    configPath: false, // No usar archivo JS, solo CSS
    exposeConfig: false,
    viewer: true,
  },
});
```

---

## 📚 Conceptos Clave de Tailwind 4

### 1. `@theme` Directive

- **Propósito**: Definir variables que generan clases de utilidad
- **Ubicación**: SOLO valores base, sin selectores anidados
- **Genera**: Automáticamente las clases de Tailwind (`bg-*`, `text-*`, etc.)

**Ejemplo:**

```css
@theme {
  --color-mint-500: oklch(0.72 0.11 178);
}
```

Esto crea automáticamente:

- `bg-mint-500`
- `text-mint-500`
- `border-mint-500`
- etc.

### 2. Namespaces de Variables

| Namespace        | Utilidades generadas               |
| ---------------- | ---------------------------------- |
| `--color-*`      | `bg-*`, `text-*`, `border-*`, etc. |
| `--font-*`       | `font-sans`, `font-mono`, etc.     |
| `--text-*`       | `text-xl`, `text-sm`, etc.         |
| `--spacing-*`    | `p-4`, `m-2`, `gap-*`, etc.        |
| `--radius-*`     | `rounded-sm`, `rounded-lg`, etc.   |
| `--shadow-*`     | `shadow-md`, `shadow-lg`, etc.     |
| `--breakpoint-*` | `sm:*`, `md:*`, `lg:*`, etc.       |
| `--animate-*`    | `animate-spin`, etc.               |

### 3. Dark Mode - Dos Enfoques

#### A) Media Query (Sistema)

```css
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: oklch(...);
  }
}
```

#### B) Clase CSS (Manual)

```css
@custom-variant dark (&:is(.dark *));

:root .dark {
  --color-background: oklch(...);
}
```

### 4. Selectores Personalizados

**❌ INCORRECTO** (dentro de `@theme`):

```css
@theme {
  html[data-palette="oceanic"] {
    --color-primary: oklch(...);
  }
}
```

**✅ CORRECTO** (fuera de `@theme`):

```css
html[data-palette="oceanic"] {
  --color-primary: oklch(...);
}
```

---

## 🎯 Cómo Usar las Variables

### En HTML (clases de utilidad):

```vue
<div class="bg-background text-foreground">
  <h1 class="text-primary">Título</h1>
</div>
```

### En CSS (valores directos):

```css
.mi-componente {
  background: var(--color-background);
  color: var(--color-foreground);
}
```

### Con Dark Mode:

```vue
<div class="bg-background dark:bg-card">
  <!-- Light: usa --color-background -->
  <!-- Dark: usa --color-card (del selector .dark) -->
</div>
```

### Con Paletas:

```vue
<!-- Aplicar paleta en el HTML -->
<html data-palette="oceanic">
  <div class="bg-primary">
    <!-- Usa el --color-primary de oceanic -->
  </div>
</html>
```

---

## 🔧 Estructura de Archivos

```
app/
├── assets/
│   └── tailwind.css          # ✅ Configuración principal Tailwind 4
├── composables/
│   ├── useTheme.ts           # Maneja light/dark/system
│   └── usePalette.ts         # Maneja oceanic/forest/sunset
└── app.vue
```

---

## ✨ Ventajas de esta Arquitectura

1. **Separación clara**: Base → Dark Mode → Paletas
2. **Sin conflictos**: Cada nivel sobrescribe solo lo necesario
3. **Performance**: Tailwind genera solo las clases usadas
4. **Type-safe**: Las variables CSS son validadas en tiempo de compilación
5. **Hot Reload**: Cambios instantáneos en desarrollo

---

## 🚀 Próximos Pasos

- [ ] Agregar más paletas de colores
- [ ] Definir variables de fuentes personalizadas
- [ ] Crear utilidades personalizadas con `@utility`
- [ ] Documentar todas las variables disponibles

---

## 📖 Referencias

- [Tailwind 4 - Theme Variables](https://tailwindcss.com/docs/theme)
- [Tailwind 4 - Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)
- [Nuxt Tailwind Module](https://tailwindcss.nuxtjs.org/)
