# 📋 Documentación de Estilos UI - Login PROBO

## 🎯 Objetivo

Documentar el estado actual de estilos, componentes y archivos del login en el proyecto Nuxt, comparándolo con el diseño de referencia en React que le gustó al jefe.

**⚠️ IMPORTANTE:** Este documento se enfoca SOLO en estilos UI, componentes y archivos. NO incluye lógica de autenticación, tokens, o funcionalidad backend.

---

## 📊 Estado Actual vs Referencia

### Proyecto Actual (Nuxt)
- **Ubicación:** `/home/yull23/nuxt/probo-frontend-v3-area-2`
- **Ruta del Login:** `app/pages/auth/login.vue`
- **Framework:** Nuxt 4 + Vue 3 + Tailwind CSS 4

### Proyecto de Referencia (React)
- **Ubicación:** `/home/yull23/nuxt/references-ai/figma-ai-user-login-draft-react-vite`
- **Framework:** React 18 + Vite + Tailwind CSS 4 + Motion
- **Diseño:** Split screen 50/50 (lg) o 60/40 (xl) con fondo animado

---

## 🏗️ Estructura de Archivos Actual

### 1. Página de Login

**Archivo:** `app/pages/auth/login.vue`

**Estructura actual:**
- Layout simple centrado
- Card con formulario básico
- Background: `bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950`
- Estilo: Dark mode con slate colors

**Componentes utilizados:**
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Input` (con estilos `bg-slate-950/60 text-white`)
- `Button`
- `Label`

**Clases Tailwind principales:**
```css
/* Container */
min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950

/* Card */
border-slate-800/60 bg-slate-900/80 backdrop-blur

/* Inputs */
bg-slate-950/60 text-white
```

---

### 2. Componentes UI Base

#### 2.1 Card Component
**Archivo:** `app/components/ui/card/Card.vue`

**Estilos actuales:**
- `bg-card text-card-foreground`
- `rounded-xl border py-6 shadow-sm`
- Flexbox con `gap-6`

#### 2.2 Input Component
**Archivo:** `app/components/ui/input/Input.vue`

**Estilos actuales:**
- `border-input`
- `rounded-md border bg-transparent`
- `focus-visible:border-ring focus-visible:ring-ring/50`
- Dark mode: `dark:bg-input/30`

#### 2.3 Button Component
**Archivo:** `app/components/ui/button/Button.vue`

**Estilos actuales:**
- Usa `buttonVariants` con variantes
- Sistema de variantes (default, destructive, outline, secondary, ghost, link)
- Sistema de tamaños (default, sm, lg, icon)

---

### 3. Archivos de Estilos Globales

#### 3.1 Tailwind CSS Principal
**Archivo:** `app/assets/tailwind.css`

**Contenido:**
- Import de Tailwind 4: `@import "tailwindcss"`
- Custom variants: `@custom-variant dark`, `@custom-variant light`, `@custom-variant purple`
- `@theme` con variables de colores, fuentes, radios, animaciones
- Variables `:root` para light mode
- Variables `html.dark` para dark mode
- Variables `html.purple` para purple mode
- Keyframes (accordion-down, accordion-up)
- Base styles y custom components

**Variables CSS principales:**
```css
/* Primary Colors */
--color-primary-25 a --color-primary-900
--color-primary-800: oklch(0.3918 0.186 280.83) /* Color principal PROBO */

/* Gray Colors */
--color-gray-25 a --color-gray-900

/* Fuentes */
--font-sans: "Public Sans"
--font-primary: "Gabarito"
--font-secondary: "Manrope"
--font-mono: "Fira Code"
```

#### 3.2 Fuentes
**Archivo:** `app/assets/styles/fonts.css`

**Contenido:**
- Variables CSS para fuentes:
  - `--font-primary: 'Gabarito', sans-serif`
  - `--font-secondary: 'Manrope', sans-serif`

#### 3.3 Variables del Sidebar
**Archivo:** `app/assets/styles/sidebar-variables.css`

**Contenido:**
- Variables específicas del sidebar (no relevantes para login)

---

## 🎨 Diseño de Referencia (React)

### Estructura del Login de Referencia

**Archivo principal:** `src/components/login/LoginView.tsx`

**Arquitectura:**
```
LoginView
├── Sección A (Izquierda - 50% lg / 60% xl)
│   ├── BackgroundPattern (fondo animado)
│   └── LeftSection
│       ├── HeaderSection (X) - Logo, título, descripción, features
│       └── VisibilitySection (Y) - Carousel de features
│
└── Sección B (Derecha - 50% lg / 40% xl)
    └── RightSection (formulario de login)
```

### Componentes de Referencia

#### 1. BackgroundPattern.tsx
**Propósito:** Fondo animado con Motion

**Elementos visuales:**
- Gradiente base: `from-[var(--primary-800)] via-[var(--primary-700)] to-[var(--primary-900)]`
- Gradiente animado overlay (radial, 10s loop)
- Formas geométricas flotantes (2 formas con blur-3xl)
- Grid pattern overlay (opacity 0.02)
- Partículas flotantes (20 elementos)

**Clases clave:**
```css
absolute inset-0
bg-gradient-to-br from-[var(--primary-800)] via-[var(--primary-700)] to-[var(--primary-900)]
blur-3xl
opacity-10, opacity-30
backdrop-blur
```

#### 2. LeftSection.tsx
**Propósito:** Contenedor izquierdo con HeaderSection y VisibilitySection

**Layout:**
- `flex flex-col h-full p-12 lg:p-16 xl:p-20`
- `relative z-10`
- Animación: `fade + slide desde izquierda (x: -50)`

#### 3. HeaderSection.tsx (X)
**Propósito:** Logo, título, descripción y lista de features

**Elementos:**
- Logo/Brand con backdrop-blur
- Título: `text-white text-5xl xl:text-6xl`
- Descripción: `text-[var(--primary-100)] text-lg xl:text-xl`
- Features list con checkmarks SVG animados

**Espaciamiento:**
- `space-y-8` entre secciones
- `space-y-5` entre título y descripción
- `space-y-4` entre items de features

#### 4. VisibilitySection.tsx (Y)
**Propósito:** Carousel interactivo con features de la app

**Elementos:**
- Container: `backdrop-blur-xl bg-white/5 border border-white/10`
- Auto-advance cada 5 segundos
- Botones de navegación (prev/next)
- Dots indicadores
- Animaciones: opacity, scale, x transitions

#### 5. RightSection.tsx (B)
**Propósito:** Formulario de login

**Layout:**
- `h-full flex items-center justify-center p-8 lg:p-16`
- Background: `bg-[var(--gray-25)]`
- Formulario con max-width: `max-w-md`

**Elementos del formulario:**
- Header: título y descripción
- Input email con icono Mail
- Input password con toggle show/hide (iconos Eye/EyeOff)
- Checkbox "Recordarme"
- Link "¿Olvidaste tu contraseña?"
- Botón submit con loading spinner

**Estilos de inputs:**
```css
bg-white
border-[var(--gray-200)]
focus:border-[var(--primary-500)]
focus:ring-[var(--primary-500)]
pl-10 (para iconos)
```

---

## 📐 Paleta de Colores PROBO

### Variables CSS de Referencia

**Primary Colors:**
```css
--primary-25:  #F9F8FF
--primary-50:  #F1EEFF
--primary-100: #C6BBFF
--primary-200: #BCAFFF
--primary-300: #A797FF
--primary-400: #8B75FF
--primary-500: #7357FF
--primary-600: #6347F4
--primary-700: #553ADE
--primary-800: #3C28A4  /* 🎯 COLOR PRINCIPAL */
--primary-900: #21194D
```

**Gray Colors:**
```css
--gray-25:  #F8F8F8
--gray-50:  #F3F3F4
--gray-100: #E2E2E4
--gray-200: #D9D8DC
--gray-300: #C6C5CA
--gray-400: #B3B1B8
--gray-500: #8D8A95
--gray-600: #676472
--gray-700: #4F4B5C
--gray-800: #2E293D
--gray-900: #110C22
```

**Border Radius:**
```css
--radius-large:  24px
--radius-medium: 16px
--radius-small:  8px
```

**Shadows:**
```css
--shadow-card:  0 2px 8px rgba(17, 12, 34, 0.04)
--shadow-hover: 0 4px 16px rgba(17, 12, 34, 0.08)
--shadow-modal: 0 8px 24px rgba(17, 12, 34, 0.12)
```

---

## 🔄 Comparación: Actual vs Referencia

### Layout

| Aspecto | Actual (Nuxt) | Referencia (React) |
|---------|---------------|-------------------|
| **Estructura** | Centrado simple | Split screen 50/50 (lg) o 60/40 (xl) |
| **Sección Izquierda** | ❌ No existe | ✅ BackgroundPattern + LeftSection |
| **Sección Derecha** | ✅ Formulario centrado | ✅ Formulario en split |
| **Mobile** | ✅ Centrado | ✅ Formulario arriba, background detrás |
| **Background** | Gradiente slate simple | ✅ BackgroundPattern animado complejo |

### Colores

| Aspecto | Actual (Nuxt) | Referencia (React) |
|---------|---------------|-------------------|
| **Background** | `slate-950/900` | ✅ `primary-800/700/900` (gradiente PROBO) |
| **Card** | `slate-900/80` | ✅ `gray-25` (light) |
| **Text** | `white` | ✅ `gray-900` (dark) en formulario |
| **Primary** | No usa colores PROBO | ✅ Usa `primary-800` como principal |
| **Inputs** | `slate-950/60` | ✅ `white` con `gray-200` border |

### Componentes

| Componente | Actual (Nuxt) | Referencia (React) |
|------------|--------------|-------------------|
| **BackgroundPattern** | ❌ No existe | ✅ Componente completo con animaciones |
| **LeftSection** | ❌ No existe | ✅ HeaderSection + VisibilitySection |
| **HeaderSection** | ❌ No existe | ✅ Logo, título, descripción, features |
| **VisibilitySection** | ❌ No existe | ✅ Carousel de features |
| **RightSection** | ✅ Básico | ✅ Completo con iconos, toggle password, etc. |

### Animaciones

| Aspecto | Actual (Nuxt) | Referencia (React) |
|---------|---------------|-------------------|
| **Motion** | ❌ No usa | ✅ Usa Motion (Framer Motion) |
| **Entrada de secciones** | ❌ No tiene | ✅ Fade + slide desde izquierda/derecha |
| **Background animado** | ❌ No tiene | ✅ Gradientes animados, formas flotantes, partículas |
| **Carousel** | ❌ No tiene | ✅ Auto-advance, transiciones suaves |
| **Loading spinner** | ✅ Básico (LoaderCircle) | ✅ Spinner con Motion rotate |

---

## 📁 Archivos Necesarios para Migración

### Archivos a Crear

1. **`app/components/login/LoginView.vue`**
   - Componente principal orquestador

2. **`app/components/login/BackgroundPattern.vue`**
   - Fondo animado con motion-v (componente `<motion.div />`)

3. **`app/components/login/LeftSection.vue`**
   - Contenedor izquierdo

4. **`app/components/login/HeaderSection.vue`**
   - Logo, título, descripción, features

5. **`app/components/login/VisibilitySection.vue`**
   - Carousel de features

6. **`app/components/login/RightSection.vue`**
   - Formulario de login completo

### Archivos a Modificar

1. **`app/pages/auth/login.vue`**
   - Reemplazar contenido actual con `<LoginView />`

2. **`app/assets/tailwind.css`**
   - Verificar que las variables PROBO estén definidas
   - Asegurar que `--primary-*` y `--gray-*` estén disponibles

### Dependencias Necesarias

**✅ Instaladas:**
- `motion-v` (v1.7.4) - Motion para Vue (animaciones)
- `lucide-vue-next` (v0.545.0) - Iconos (Mail, Lock, Eye, EyeOff, ChevronLeft, ChevronRight)

**✅ Configurado:**
- Módulo `motion-v/nuxt` agregado a `nuxt.config.ts` (auto-importa componentes)

---

## 🎨 Clases Tailwind Utilizadas en Referencia

### Layout & Spacing
```css
min-h-screen
h-full
w-full
max-w-md
max-w-2xl
flex
flex-col
items-center
justify-center
justify-between
gap-2, gap-3, gap-4
p-8, p-12, p-16, p-20
space-y-2, space-y-4, space-y-5, space-y-8
lg:w-1/2
xl:w-3/5
xl:w-2/5
```

### Colores (usando variables CSS)
```css
/* Backgrounds */
bg-[var(--gray-25)]
bg-[var(--primary-800)]
bg-white
bg-white/5
bg-white/10
bg-white/20

/* Text */
text-white
text-white/85
text-white/90
text-[var(--gray-900)]
text-[var(--gray-500)]
text-[var(--primary-100)]
text-[var(--primary-600)]

/* Borders */
border-[var(--gray-200)]
border-white/10
focus:border-[var(--primary-500)]
```

### Effects
```css
backdrop-blur-sm
backdrop-blur-md
backdrop-blur-xl
opacity-10
opacity-30
opacity-[0.02]
blur-3xl
shadow-lg
shadow-xl
rounded-lg
rounded-xl
rounded-2xl
rounded-full
transition-all
duration-300
hover:bg-white/20
hover:scale-110
```

### Positioning
```css
relative
absolute
inset-0
top-20, bottom-20
left-3, left-4, left-10
right-3, right-4, right-10
top-1/2
-translate-y-1/2
z-10
```

### Typography
```css
text-base
text-lg
text-xl
text-2xl
text-4xl
text-5xl
text-6xl
leading-tight
leading-relaxed
```

### Responsive
```css
hidden
lg:flex
lg:p-16
lg:w-1/2
xl:text-6xl
xl:w-3/5
xl:p-20
```

---

## ✅ Checklist de Migración de Estilos

### Pre-migración
- [x] ✅ `motion-v` instalado (v1.7.4)
- [x] ✅ `lucide-vue-next` instalado (v0.545.0)
- [x] ✅ Módulo `motion-v/nuxt` configurado en `nuxt.config.ts`
- [ ] Verificar que variables PROBO estén en `tailwind.css`
- [ ] Crear carpeta `app/components/login/`

### Durante migración
- [ ] Crear `BackgroundPattern.vue` con animaciones
- [ ] Crear `LeftSection.vue`
- [ ] Crear `HeaderSection.vue` con logo, título, features
- [ ] Crear `VisibilitySection.vue` con carousel
- [ ] Crear `RightSection.vue` con formulario completo
- [ ] Crear `LoginView.vue` orquestador
- [ ] Reemplazar contenido de `app/pages/auth/login.vue`
- [ ] Verificar responsive (mobile, tablet, desktop)

### Post-migración
- [ ] Verificar animaciones funcionan correctamente
- [ ] Comparar colores con referencia (usar DevTools)
- [ ] Verificar que todas las clases Tailwind se aplican
- [ ] Probar en diferentes navegadores
- [ ] Verificar performance de animaciones

---

## 📝 Notas Importantes

### 1. Variables CSS
Las variables PROBO (`--primary-*` y `--gray-*`) deben estar definidas en `:root` dentro de `tailwind.css` para que funcionen con `bg-[var(--primary-800)]` y similares.

### 2. Motion en Vue
Usar `motion-v` con el componente `<motion.div />` (auto-importado por el módulo Nuxt).

**Ejemplo:**
```vue
<template>
  <motion.div
    :initial="{ opacity: 0, x: -50 }"
    :animate="{ opacity: 1, x: 0 }"
    :transition="{ duration: 0.8 }"
  />
</template>
```

### 3. Responsive
Mantener exactamente los mismos breakpoints:
- Mobile: < 1024px (formulario arriba, background detrás)
- Desktop: ≥ 1024px (split 50/50)
- XL: ≥ 1280px (split 60/40)

### 4. Iconos
Usar `lucide-vue-next` en lugar de `lucide-react`:
- `Mail` → `<Mail />`
- `Lock` → `<Lock />`
- `Eye` → `<Eye />`
- `EyeOff` → `<EyeOff />`

---

## 🔗 Referencias

- **Documentación completa:** `docs para login probo.md`
- **Proyecto de referencia:** `/home/yull23/nuxt/references-ai/figma-ai-user-login-draft-react-vite`
- **Tailwind CSS 4:** https://tailwindcss.com/docs
- **motion-v:** https://motion.dev/docs/vue
- **Motion para Vue - Guía de inicio:** https://motion.dev/docs/vue/get-started

---

**Versión:** 1.0.0  
**Última actualización:** 2025-01-25  
**Autor:** Documentación de Estilos UI - Login PROBO

