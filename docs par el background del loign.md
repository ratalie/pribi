# 🎨 Guía Completa: Background Animado PROBO

## 📑 Índice

1. [Concepto y Diseño](#concepto-y-diseño)
2. [Arquitectura de Capas](#arquitectura-de-capas)
3. [Implementación Paso a Paso](#implementación-paso-a-paso)
4. [Desglose de Animaciones](#desglose-de-animaciones)
5. [Optimización y Performance](#optimización-y-performance)
6. [Migración a Nuxt/Vue](#migración-a-nuxtvue)
7. [Troubleshooting](#troubleshooting)
8. [Variaciones y Personalización](#variaciones-y-personalización)

---

## 🎯 Concepto y Diseño

### Objetivo Visual

Crear un fondo **dinámico, moderno y profesional** con:

- Gradientes de la paleta PROBO (morados/púrpuras)
- Movimiento sutil pero constante
- Sensación de profundidad (parallax)
- Ambiente tecnológico/corporativo
- Sin distraer del contenido principal

### Inspiración Técnica

- **Glassmorphism:** Capas translúcidas con blur
- **Ambient backgrounds:** Gradientes suaves en movimiento
- **Particle systems:** Elementos flotantes minimalistas
- **Geometric abstraction:** Formas simples con animación

### Paleta de Colores Utilizada

```css
Base:
--primary-800: #3C28A4  /* Fondo principal */
--primary-700: #553ADE  /* Gradiente medio */
--primary-900: #21194D  /* Gradiente oscuro */

Acentos:
--primary-500: #7357FF  /* Gradiente animado 1 */
--primary-400: #8B75FF  /* Gradiente animado 2 */
--primary-600: #6347F4  /* Gradiente animado 3 */
--primary-300: #A797FF  /* Forma geométrica 2 */

Detalles:
--primary-25: #F9F8FF   /* Grid pattern */
white: #FFFFFF           /* Partículas */
```

---

## 🏗️ Arquitectura de Capas

El background está compuesto por **7 capas superpuestas** (z-index ascendente):

```
┌─────────────────────────────────────┐
│ Layer 7: Partículas (20x)          │ opacity: 0.1-0.5
├─────────────────────────────────────┤
│ Layer 6: Grid Pattern              │ opacity: 0.02
├─────────────────────────────────────┤
│ Layer 5: Forma Geométrica 2        │ opacity: 0.1, blur: 3xl
├─────────────────────────────────────┤
│ Layer 4: Forma Geométrica 1        │ opacity: 0.1, blur: 3xl
├─────────────────────────────────────┤
│ Layer 3: Gradiente Animado         │ opacity: 0.3
├─────────────────────────────────────┤
│ Layer 2: Gradiente Base            │ opacity: 1
├─────────────────────────────────────┤
│ Layer 1: Container                 │ (absolute inset-0)
└─────────────────────────────────────┘
```

### Jerarquía Visual

1. **Base sólida:** Gradiente estático (identidad visual)
2. **Movimiento principal:** Gradiente animado (vida)
3. **Profundidad:** Formas geométricas flotantes (dimensión)
4. **Textura:** Grid pattern (profesionalismo)
5. **Magia:** Partículas flotantes (detalle premium)

---

## 🔨 Implementación Paso a Paso

### PASO 1: Container Base

```tsx
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {/* Todo el contenido aquí */}
</div>
```

**Explicación:**

- `absolute inset-0` → Cubre todo el parent (100% ancho/alto)
- `overflow-hidden` → Oculta elementos que salen del viewport
- `pointer-events-none` → El fondo no interfiere con clics/interacción

**CSS equivalente:**

```css
.background-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
}
```

---

### PASO 2: Layer Base - Gradiente Estático

```tsx
<div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-800)] via-[var(--primary-700)] to-[var(--primary-900)]" />
```

**Desglose:**

| Propiedad           | Valor   | Función                           |
| ------------------- | ------- | --------------------------------- |
| `bg-gradient-to-br` | -       | Gradiente diagonal (bottom-right) |
| `from-[...]`        | #3C28A4 | Color inicio (top-left)           |
| `via-[...]`         | #553ADE | Color medio (center)              |
| `to-[...]`          | #21194D | Color final (bottom-right)        |

**Visualización:**

```
┌─────────────────────┐
│ #3C28A4 (primary-800)
│     ╲
│       ╲ #553ADE (primary-700)
│         ╲
│           ╲
│             ╲ #21194D (primary-900)
└─────────────────────┘
```

**CSS vanilla:**

```css
background: linear-gradient(
  135deg,
  /* to bottom-right = 135deg */ var(--primary-800) 0%,
  var(--primary-700) 50%,
  var(--primary-900) 100%
);
```

---

### PASO 3: Layer Gradiente Animado

```tsx
<motion.div
  className="absolute inset-0 opacity-30"
  animate={{
    background: [
      "radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)",
      "radial-gradient(circle at 80% 50%, var(--primary-400) 0%, transparent 50%)",
      "radial-gradient(circle at 50% 80%, var(--primary-600) 0%, transparent 50%)",
      "radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)",
    ],
  }}
  transition={{
    duration: 10,
    repeat: Infinity,
    ease: "linear",
  }}
/>
```

**Desglose detallado:**

#### Estructura de radial-gradient

```
radial-gradient(
  circle at [X%] [Y%],
  [COLOR] [START%],
  transparent [END%]
)
```

- `circle` → Forma circular (vs ellipse)
- `at 20% 50%` → Centro del círculo en coordenadas (x, y)
- `var(--primary-500) 0%` → Color en el centro
- `transparent 50%` → Se desvanece al 50% del radio

#### Secuencia de animación (4 keyframes):

```
Estado 1 (0s):   Círculo en posición 20%, 50% (izquierda-centro)
      ↓
Estado 2 (3.3s): Círculo en posición 80%, 50% (derecha-centro)
      ↓
Estado 3 (6.6s): Círculo en posición 50%, 80% (centro-abajo)
      ↓
Estado 4 (10s):  Círculo vuelve a 20%, 50% (loop perfecto)
```

**Visualización temporal:**

```
0s ──────→ 3.3s ──────→ 6.6s ──────→ 10s (repeat)
  izq-centro    der-centro    centro-abajo    izq-centro
```

#### Parámetros de transición:

| Parámetro  | Valor    | Efecto                                      |
| ---------- | -------- | ------------------------------------------- |
| `duration` | 10s      | Ciclo completo tarda 10 segundos            |
| `repeat`   | Infinity | Loop infinito                               |
| `ease`     | linear   | Velocidad constante (no acelera/desacelera) |

**Opacidad: 0.3** → Sutil, no domina el gradiente base

---

### PASO 4: Forma Geométrica 1 (Superior Izquierda)

```tsx
<motion.div
  className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[var(--primary-400)] opacity-10 blur-3xl"
  animate={{
    scale: [1, 1.2, 1],
    x: [0, 30, 0],
    y: [0, -20, 0],
  }}
  transition={{
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut",
  }}
/>
```

**Desglose visual:**

#### Posicionamiento:

```css
position: absolute;
top: 5rem; /* top-20 = 80px */
left: 2.5rem; /* left-10 = 40px */
width: 16rem; /* w-64 = 256px */
height: 16rem; /* h-64 = 256px */
```

#### Estilo:

```css
border-radius: 9999px; /* rounded-full = círculo perfecto */
background: var(--primary-400); /* #8B75FF */
opacity: 0.1; /* Muy sutil */
filter: blur(48px); /* blur-3xl = diffuse glow effect */
```

#### Animación (3 propiedades simultáneas):

**1. Scale (tamaño):**

```
1.0 → 1.2 → 1.0 (20% más grande en el pico)
```

**2. X (horizontal):**

```
0px → 30px → 0px (se mueve a la derecha y vuelve)
```

**3. Y (vertical):**

```
0px → -20px → 0px (sube ligeramente y baja)
```

**Diagrama de movimiento:**

```
Inicio (1.0x)      Pico (1.2x)       Fin (1.0x)
    ●                  ◉                 ●
    │                 ↗ ↖                │
    │               ↗     ↖              │
    │             ↗         ↖            │
    └──────────→──────────────→──────────┘
    0s            4s            8s (repeat)
```

**Duración:** 8 segundos (más lento que gradiente animado)  
**Easing:** `easeInOut` → Aceleración suave al inicio/fin

---

### PASO 5: Forma Geométrica 2 (Inferior Derecha)

```tsx
<motion.div
  className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[var(--primary-300)] opacity-10 blur-3xl"
  animate={{
    scale: [1, 1.3, 1],
    x: [0, -40, 0],
    y: [0, 30, 0],
  }}
  transition={{
    duration: 10,
    repeat: Infinity,
    ease: "easeInOut",
    delay: 1,
  }}
/>
```

**Diferencias con Forma 1:**

| Aspecto    | Forma 1               | Forma 2                               |
| ---------- | --------------------- | ------------------------------------- |
| Posición   | Top-left (20, 10)     | Bottom-right (20, 10)                 |
| Tamaño     | 256px (w-64)          | 384px (w-96) - **50% más grande**     |
| Color      | primary-400 (#8B75FF) | primary-300 (#A797FF) - **más claro** |
| Scale      | 1 → 1.2               | 1 → 1.3 - **crece más**               |
| X movement | +30px (derecha)       | -40px (izquierda)                     |
| Y movement | -20px (arriba)        | +30px (abajo)                         |
| Duration   | 8s                    | 10s - **más lento**                   |
| Delay      | 0s                    | 1s - **desfasado**                    |

**Diagrama de movimiento:**

```
Inicio (1.0x)      Pico (1.3x)       Fin (1.0x)
    ●                  ◉                 ●
    │                ↙   ↘               │
    │              ↙       ↘             │
    │            ↙           ↘           │
    └──────────→──────────────→──────────┘
    1s (delay)    6s            11s (repeat)
```

**Propósito del delay:**  
Evitar sincronización → Movimientos más orgánicos/naturales

---

### PASO 6: Grid Pattern Overlay

```tsx
<div
  className="absolute inset-0 opacity-[0.02]"
  style={{
    backgroundImage: `
      linear-gradient(var(--primary-25) 1px, transparent 1px),
      linear-gradient(90deg, var(--primary-25) 1px, transparent 1px)
    `,
    backgroundSize: "50px 50px",
  }}
/>
```

**Técnica: CSS Grid Pattern**

#### Cómo funciona:

1. **Primer gradiente (vertical):**

```css
linear-gradient(
  var(--primary-25) 1px,  /* Línea de 1px */
  transparent 1px         /* Resto transparente */
)
```

→ Crea líneas horizontales

2. **Segundo gradiente (horizontal):**

```css
linear-gradient(
  90deg,                  /* Rotado 90° */
  var(--primary-25) 1px,
  transparent 1px
)
```

→ Crea líneas verticales

3. **Background-size:**

```css
background-size: 50px 50px;
```

→ Repite cada 50px = grid de 50x50px

**Visualización:**

```
┌────┬────┬────┬────┬────┐
│    │    │    │    │    │
├────┼────┼────┼────┼────┤
│    │    │    │    │    │
├────┼────┼────┼────┼────┤
│    │    │    │    │    │
├────┼────┼────┼────┼────┤
│    │    │    │    │    │
└────┴────┴────┴────┴────┘
```

**Opacidad 0.02:** Casi imperceptible, pero añade textura sutil

**Alternativa con Tailwind puro:**

```tsx
<div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

// globals.css
.bg-grid-pattern {
  background-image:
    linear-gradient(var(--primary-25) 1px, transparent 1px),
    linear-gradient(90deg, var(--primary-25) 1px, transparent 1px);
  background-size: 50px 50px;
}
```

---

### PASO 7: Partículas Flotantes (Sistema de 20 partículas)

```tsx
{
  [...Array(20)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-1 h-1 bg-white rounded-full opacity-30"
      initial={{
        x: Math.random() * window.innerWidth * 0.5,
        y: Math.random() * window.innerHeight,
      }}
      animate={{
        y: [null, Math.random() * window.innerHeight],
        x: [null, Math.random() * window.innerWidth * 0.5],
        opacity: [0.1, 0.5, 0.1],
      }}
      transition={{
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        ease: "linear",
        delay: Math.random() * 5,
      }}
    />
  ));
}
```

**Desglose técnico:**

#### Generación:

```javascript
[...Array(20)]  // Crea array de 20 elementos
.map((_, i) => ...)  // Itera cada uno
```

#### Estilo base:

```css
.particle {
  position: absolute;
  width: 0.25rem; /* w-1 = 4px */
  height: 0.25rem; /* h-1 = 4px */
  background: white;
  border-radius: 9999px; /* círculo perfecto */
  opacity: 0.3; /* semi-transparente */
}
```

#### Posición inicial (random):

**X (horizontal):**

```javascript
Math.random() * window.innerWidth * 0.5;
// Ejemplo con viewport 1920px:
// → Random entre 0 y 960px (mitad izquierda)
```

**Y (vertical):**

```javascript
Math.random() * window.innerHeight;
// Ejemplo con viewport 1080px:
// → Random entre 0 y 1080px (cualquier altura)
```

**¿Por qué X solo hasta 0.5?**  
→ Solo en la mitad izquierda (donde está el background visible)

#### Animación (cada partícula única):

**1. Movimiento Y (vertical):**

```javascript
y: [null, Math.random() * window.innerHeight];
// null = mantén posición inicial
// → Se mueve a nueva posición Y random
```

**2. Movimiento X (horizontal):**

```javascript
x: [null, Math.random() * window.innerWidth * 0.5];
// → Se mueve a nueva posición X random
```

**3. Opacity (pulsación):**

```javascript
opacity: [0.1, 0.5, 0.1];
// Fade in → Bright → Fade out
```

#### Parámetros de timing (randomizados):

**Duration:**

```javascript
Math.random() * 10 + 10;
// → Entre 10s y 20s
// Ejemplo: 0.7 * 10 + 10 = 17s
```

**Delay:**

```javascript
Math.random() * 5;
// → Entre 0s y 5s
// Evita que todas empiecen juntas
```

**Resultado:** Cada partícula tiene:

- Posición inicial única
- Posición final única
- Duración única (10-20s)
- Delay inicial único (0-5s)
- Movimiento independiente

**Diagrama conceptual:**

```
Partícula 1: ● ────→ ○ (15s, delay 2s)
Partícula 2:   ● ──→ ○ (12s, delay 0s)
Partícula 3:     ● ────────→ ○ (19s, delay 4s)
...
Partícula 20:  ● ──────→ ○ (11s, delay 3s)
```

---

## 🎬 Desglose de Animaciones

### Timeline Completo (primeros 10 segundos)

```
Tiempo:  0s    1s    2s    3s    4s    5s    6s    7s    8s    9s    10s
         │─────│─────│─────│─────│─────│─────│─────│─────│─────│─────│

Gradiente animado:
         [20%,50%] ────→ [80%,50%] ────→ [50%,80%] ────→ [20%,50%]

Forma 1:
         [1.0x, 0,0] ──→ [1.2x, 30,-20] ──→ [1.0x, 0,0] (repeat)

Forma 2:
         delay ─→ [1.0x, 0,0] ──→ [1.3x, -40,30] ──→ [1.0x, 0,0]

Partículas (ejemplo):
P1:      delay ──→ [moving + pulsing] ──────────────────→
P2:      [moving + pulsing] ────────────────────────────→
P3:      delay ────→ [moving + pulsing] ────────────────→
...
```

### Sincronización y Ritmo

| Elemento          | Duration | Delay | Repeat | Easing    |
| ----------------- | -------- | ----- | ------ | --------- |
| Gradiente animado | 10s      | 0s    | ∞      | linear    |
| Forma 1           | 8s       | 0s    | ∞      | easeInOut |
| Forma 2           | 10s      | 1s    | ∞      | easeInOut |
| Partícula 1       | 10-20s   | 0-5s  | ∞      | linear    |
| Partícula 2       | 10-20s   | 0-5s  | ∞      | linear    |
| ...               | ...      | ...   | ...    | ...       |
| Partícula 20      | 10-20s   | 0-5s  | ∞      | linear    |

**Estrategia de timing:**

- Duraciones diferentes → No se sincronizan
- Delays aleatorios → Evita patterns predecibles
- Mix de easings → Movimientos variados (orgánicos)

---

## ⚡ Optimización y Performance

### GPU Acceleration

**Propiedades animadas (GPU-friendly):**
✅ `transform` (scale, translateX, translateY)  
✅ `opacity`  
✅ `filter` (blur)

**Propiedades evitadas (CPU-heavy):**
❌ `width`/`height`  
❌ `top`/`left`  
❌ `margin`/`padding`  
❌ `background-color` (sin gradientes)

### Will-change (si necesario)

```css
.animated-element {
  will-change: transform, opacity;
}
```

⚠️ **Nota:** Motion/Framer Motion ya optimiza esto automáticamente

### Reduce Motion (Accesibilidad)

```tsx
import { useReducedMotion } from "motion/react";

export function BackgroundPattern() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <StaticBackground />; // Versión sin animaciones
  }

  return <AnimatedBackground />;
}
```

### Performance Metrics

**Objetivo:**

- FPS: > 30 (mínimo), > 60 (ideal)
- CPU: < 5% en reposo
- Memory: Sin leaks (intervals limpiados)

**Testing:**

```javascript
// Chrome DevTools → Performance
// Grabar 10s → Analizar:
// - Frame rate
// - CPU usage
// - Memory allocation
```

### Optimizaciones Aplicadas

1. **Partículas limitadas:** 20 (no 100+)
2. **Blur solo en formas grandes:** No en partículas
3. **Opacidades bajas:** Menos compositing
4. **No animaciones en hover:** Solo loops infinitos
5. **Pointer-events: none:** Evita hit-testing

---

## 🔄 Migración a Nuxt/Vue

### Estructura Vue SFC

```vue
<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <!-- Gradiente base -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-[var(--primary-800)] via-[var(--primary-700)] to-[var(--primary-900)]"
    />

    <!-- Gradiente animado -->
    <div ref="animatedGradient" class="absolute inset-0 opacity-30" />

    <!-- Forma 1 -->
    <div
      ref="shape1"
      class="absolute top-20 left-10 w-64 h-64 rounded-full bg-[var(--primary-400)] opacity-10 blur-3xl"
    />

    <!-- Forma 2 -->
    <div
      ref="shape2"
      class="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[var(--primary-300)] opacity-10 blur-3xl"
    />

    <!-- Grid pattern -->
    <div class="absolute inset-0 opacity-[0.02]" :style="gridStyle" />

    <!-- Partículas -->
    <div
      v-for="i in 20"
      :key="i"
      :ref="(el) => (particles[i] = el)"
      class="absolute w-1 h-1 bg-white rounded-full opacity-30"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";
  import { useMotion } from "@vueuse/motion";

  // Refs
  const animatedGradient = ref<HTMLElement>();
  const shape1 = ref<HTMLElement>();
  const shape2 = ref<HTMLElement>();
  const particles = ref<HTMLElement[]>([]);

  // Grid style
  const gridStyle = {
    backgroundImage: `
    linear-gradient(var(--primary-25) 1px, transparent 1px),
    linear-gradient(90deg, var(--primary-25) 1px, transparent 1px)
  `,
    backgroundSize: "50px 50px",
  };

  onMounted(() => {
    // Animación gradiente
    if (animatedGradient.value) {
      useMotion(animatedGradient.value, {
        initial: {
          background:
            "radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)",
        },
        enter: {
          background: [
            "radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, var(--primary-400) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, var(--primary-600) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)",
          ],
          transition: {
            duration: 10000,
            repeat: Infinity,
            ease: "linear",
          },
        },
      });
    }

    // Animación forma 1
    if (shape1.value) {
      useMotion(shape1.value, {
        initial: { scale: 1, x: 0, y: 0 },
        enter: {
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
          transition: {
            duration: 8000,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
      });
    }

    // Animación forma 2
    if (shape2.value) {
      useMotion(shape2.value, {
        initial: { scale: 1, x: 0, y: 0 },
        enter: {
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 30, 0],
          transition: {
            duration: 10000,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1000,
          },
        },
      });
    }

    // Animación partículas
    particles.value.forEach((particle, i) => {
      if (!particle) return;

      const initialX = Math.random() * window.innerWidth * 0.5;
      const initialY = Math.random() * window.innerHeight;
      const targetX = Math.random() * window.innerWidth * 0.5;
      const targetY = Math.random() * window.innerHeight;

      particle.style.left = `${initialX}px`;
      particle.style.top = `${initialY}px`;

      useMotion(particle, {
        initial: { x: 0, y: 0, opacity: 0.3 },
        enter: {
          x: [0, targetX - initialX],
          y: [0, targetY - initialY],
          opacity: [0.1, 0.5, 0.1],
          transition: {
            duration: Math.random() * 10000 + 10000,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5000,
          },
        },
      });
    });
  });
</script>
```

### Composable Reutilizable

```typescript
// composables/useBackgroundAnimation.ts
export const useBackgroundAnimation = () => {
  const animateGradient = (element: HTMLElement) => {
    return useMotion(element, {
      initial: {
        background:
          "radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)",
      },
      enter: {
        background: [
          "radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)",
          "radial-gradient(circle at 80% 50%, var(--primary-400) 0%, transparent 50%)",
          "radial-gradient(circle at 50% 80%, var(--primary-600) 0%, transparent 50%)",
          "radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)",
        ],
        transition: {
          duration: 10000,
          repeat: Infinity,
          ease: "linear",
        },
      },
    });
  };

  const animateShape = (
    element: HTMLElement,
    config: {
      scale: number[];
      x: number[];
      y: number[];
      duration: number;
      delay?: number;
    }
  ) => {
    return useMotion(element, {
      initial: { scale: 1, x: 0, y: 0 },
      enter: {
        scale: config.scale,
        x: config.x,
        y: config.y,
        transition: {
          duration: config.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: config.delay || 0,
        },
      },
    });
  };

  const animateParticle = (element: HTMLElement) => {
    const initialX = Math.random() * window.innerWidth * 0.5;
    const initialY = Math.random() * window.innerHeight;
    const targetX = Math.random() * window.innerWidth * 0.5;
    const targetY = Math.random() * window.innerHeight;

    element.style.left = `${initialX}px`;
    element.style.top = `${initialY}px`;

    return useMotion(element, {
      initial: { x: 0, y: 0, opacity: 0.3 },
      enter: {
        x: [0, targetX - initialX],
        y: [0, targetY - initialY],
        opacity: [0.1, 0.5, 0.1],
        transition: {
          duration: Math.random() * 10000 + 10000,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 5000,
        },
      },
    });
  };

  return {
    animateGradient,
    animateShape,
    animateParticle,
  };
};
```

### Alternativa con GSAP (si prefieres GSAP sobre Motion)

```typescript
import { gsap } from "gsap";

onMounted(() => {
  // Gradiente animado
  const gradients = [
    "radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)",
    "radial-gradient(circle at 80% 50%, var(--primary-400) 0%, transparent 50%)",
    "radial-gradient(circle at 50% 80%, var(--primary-600) 0%, transparent 50%)",
    "radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%)",
  ];

  let currentIndex = 0;
  gsap.to(animatedGradient.value, {
    duration: 10,
    repeat: -1,
    ease: "linear",
    onUpdate: function () {
      const progress = this.progress();
      const index = Math.floor(progress * 3);
      if (index !== currentIndex) {
        currentIndex = index;
        animatedGradient.value.style.background = gradients[index];
      }
    },
  });

  // Forma 1
  gsap.to(shape1.value, {
    scale: 1.2,
    x: 30,
    y: -20,
    duration: 4,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
  });

  // Forma 2
  gsap.to(shape2.value, {
    scale: 1.3,
    x: -40,
    y: 30,
    duration: 5,
    delay: 1,
    ease: "power1.inOut",
    yoyo: true,
    repeat: -1,
  });
});
```

---

## 🐛 Troubleshooting

### Problema 1: Animaciones no se ven

**Síntomas:**

- Background estático
- Sin movimiento

**Soluciones:**

1. **Verificar Motion instalado:**

```bash
npm install motion
# o
npm install framer-motion  # alternativa
```

2. **Verificar imports:**

```tsx
import { motion } from "motion/react";
// NO: import { motion } from "motion"
```

3. **Verificar z-index:**

```tsx
// Parent debe tener position: relative
<div className="relative">
  <BackgroundPattern />
</div>
```

---

### Problema 2: Performance bajo (FPS < 30)

**Síntomas:**

- Animaciones con lag
- CPU alto

**Soluciones:**

1. **Reducir partículas:**

```tsx
// De 20 a 10
{[...Array(10)].map((_, i) => ...)}
```

2. **Aumentar duración:**

```tsx
// Animaciones más lentas = menos cálculos
duration: 15; // en vez de 10
```

3. **Deshabilitar blur:**

```tsx
// Quitar blur-3xl temporalmente
className = "... opacity-10"; // sin blur-3xl
```

4. **Usar will-change:**

```css
.animated-shape {
  will-change: transform, opacity;
}
```

---

### Problema 3: Partículas fuera del viewport

**Síntomas:**

- Partículas no visibles
- Aparecen fuera de pantalla

**Soluciones:**

1. **Verificar window disponible:**

```tsx
onMounted(() => {
  // Asegurarse de que window existe (SSR)
  if (typeof window === "undefined") return;

  // Código de partículas aquí
});
```

2. **Usar clientWidth en vez de innerWidth:**

```tsx
const container = ref<HTMLElement>();

// Usar dimensiones del container
const width = container.value?.clientWidth || 0;
const height = container.value?.clientHeight || 0;
```

3. **Límites seguros:**

```tsx
initial={{
  x: Math.min(Math.random() * window.innerWidth * 0.5, 800),
  y: Math.min(Math.random() * window.innerHeight, 600)
}}
```

---

### Problema 4: Background no cubre todo

**Síntomas:**

- Espacios en blanco
- No ocupa full screen

**Soluciones:**

1. **Parent debe tener altura:**

```tsx
// Parent
<div className="relative min-h-screen">
  <BackgroundPattern />
</div>
```

2. **Verificar inset-0:**

```tsx
// Debe tener absolute + inset-0
<div className="absolute inset-0 ...">
```

3. **Verificar overflow:**

```tsx
// Parent NO debe tener overflow-hidden si necesitas scroll
<div className="relative">
  {" "}
  {/* Sin overflow-hidden */}
  <BackgroundPattern />
</div>
```

---

### Problema 5: Gradiente animado no funciona

**Síntomas:**

- Solo primer gradiente visible
- No transiciona

**Soluciones:**

1. **Verificar array de valores:**

```tsx
// DEBE ser array, no objeto
animate={{
  background: [  // Array de strings
    "...",
    "...",
    "...",
    "..."
  ]
}}
```

2. **Verificar variables CSS:**

```css
/* Deben estar definidas en :root */
:root {
  --primary-500: #7357ff;
  --primary-400: #8b75ff;
  --primary-600: #6347f4;
}
```

3. **Alternativa con keyframes CSS:**

```css
@keyframes gradientShift {
  0%,
  100% {
    background: radial-gradient(circle at 20% 50%, var(--primary-500) 0%, transparent 50%);
  }
  33% {
    background: radial-gradient(circle at 80% 50%, var(--primary-400) 0%, transparent 50%);
  }
  66% {
    background: radial-gradient(circle at 50% 80%, var(--primary-600) 0%, transparent 50%);
  }
}

.animated-gradient {
  animation: gradientShift 10s linear infinite;
}
```

---

### Problema 6: Blur no funciona en Safari

**Síntomas:**

- Blur no se ve en Safari
- Funciona en Chrome

**Soluciones:**

1. **Verificar prefijos:**

```css
.blur-element {
  -webkit-backdrop-filter: blur(48px);
  backdrop-filter: blur(48px);
}
```

2. **Fallback sin blur:**

```tsx
<div className="bg-[var(--primary-400)] opacity-20 blur-3xl sm:blur-3xl" />
// Tailwind compila con prefijos automáticos
```

3. **Detectar soporte:**

```tsx
const supportsBackdropFilter = CSS.supports("backdrop-filter", "blur(1px)");

{
  supportsBackdropFilter ? (
    <div className="backdrop-blur-xl" />
  ) : (
    <div className="bg-black/10" /> // Fallback
  );
}
```

---

## 🎨 Variaciones y Personalización

### Variación 1: Colores Diferentes

**Tema Azul:**

```tsx
// Cambiar variables
--primary-800: #1E3A8A  // blue-900
--primary-700: #2563EB  // blue-600
--primary-900: #1E293B  // slate-800
--primary-500: #3B82F6  // blue-500
--primary-400: #60A5FA  // blue-400
```

**Tema Verde:**

```tsx
--primary-800: #065F46  // emerald-900
--primary-700: #059669  // emerald-600
--primary-900: #064E3B  // emerald-900
--primary-500: #10B981  // emerald-500
--primary-400: #34D399  // emerald-400
```

---

### Variación 2: Más/Menos Partículas

**Menos partículas (performance):**

```tsx
{[...Array(10)].map((_, i) => ...)}  // 10 en vez de 20
```

**Más partículas (efecto intenso):**

```tsx
{[...Array(40)].map((_, i) => ...)}  // 40 partículas
```

**Partículas más grandes:**

```tsx
className = "absolute w-2 h-2 bg-white rounded-full opacity-40";
// w-2 h-2 en vez de w-1 h-1
```

---

### Variación 3: Velocidad de Animaciones

**Más rápido (energético):**

```tsx
// Gradiente
duration: 5; // en vez de 10

// Formas
duration: 4; // en vez de 8/10

// Partículas
duration: Math.random() * 5 + 5; // 5-10s en vez de 10-20s
```

**Más lento (zen/relajante):**

```tsx
// Gradiente
duration: 20;

// Formas
duration: 15;

// Partículas
duration: Math.random() * 15 + 15; // 15-30s
```

---

### Variación 4: Formas Diferentes

**Cuadrados en vez de círculos:**

```tsx
className = "... rounded-2xl"; // en vez de rounded-full
```

**Formas triangulares (CSS clip-path):**

```tsx
<div
  className="..."
  style={{
    clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
  }}
/>
```

**Formas hexagonales:**

```tsx
style={{
  clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
}}
```

---

### Variación 5: Sin Partículas (minimalista)

```tsx
export function BackgroundPatternMinimal() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Solo gradiente base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-800)] via-[var(--primary-700)] to-[var(--primary-900)]" />

      {/* Gradiente animado */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{ ... }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ ... }} />
    </div>
  )
}
```

---

### Variación 6: Interactivo (sigue cursor)

```tsx
import { useMotionValue, useSpring } from "motion/react";

export function BackgroundPatternInteractive() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  };

  return (
    <div className="absolute inset-0 overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Base layers */}
      ...
      {/* Forma que sigue cursor */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-[var(--primary-300)] opacity-20 blur-3xl pointer-events-none"
        style={{
          left: springX,
          top: springY,
          x: "-50%",
          y: "-50%",
        }}
      />
    </div>
  );
}
```

---

### Variación 7: Con Imagen de Fondo

```tsx
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {/* Imagen base */}
  <div
    className="absolute inset-0 opacity-10"
    style={{
      backgroundImage: "url(/pattern.svg)",
      backgroundSize: "cover",
    }}
  />
  {/* Gradiente overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-800)]/90 via-[var(--primary-700)]/80 to-[var(--primary-900)]/90" />
  {/* Resto de layers */}
  ...
</div>
```

---

## 📚 Recursos y Referencias

### Documentación Oficial

- **Motion (Framer Motion):** https://motion.dev/docs
- **@vueuse/motion:** https://motion.vueuse.org/
- **GSAP:** https://greensock.com/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs

### Tutoriales Relacionados

- CSS Gradient Generator: https://cssgradient.io/
- Radial Gradient Generator: https://www.css-gradient.com/
- Easing Functions: https://easings.net/
- Motion Timing: https://cubic-bezier.com/

### Inspiración Visual

- Awwwards: https://www.awwwards.com/ (buscar "animated backgrounds")
- Dribbble: https://dribbble.com/tags/animated-background
- CodePen: https://codepen.io/tag/animated-background

---

## ✅ Checklist Final

Antes de considerar el background completo:

- [ ] Gradiente base renderiza correctamente
- [ ] Gradiente animado transiciona suavemente
- [ ] Forma 1 se mueve y escala
- [ ] Forma 2 se mueve y escala (desfasada)
- [ ] Grid pattern visible (muy sutil)
- [ ] Partículas flotando aleatoriamente
- [ ] Performance > 30 FPS
- [ ] No memory leaks (intervals limpiados)
- [ ] Funciona en Chrome, Firefox, Safari
- [ ] Responsive en mobile y desktop
- [ ] Respeta prefers-reduced-motion
- [ ] No interfiere con interacción (pointer-events: none)

---

## 🎓 Conceptos Clave Aprendidos

1. **Layering:** Superposición de capas para profundidad
2. **Opacity:** Control de visibilidad sin quitar elementos
3. **Blur:** Efecto glassmorphism con backdrop-filter
4. **Radial gradients:** Círculos de color con fade
5. **Motion API:** Animaciones declarativas con React/Vue
6. **Randomización:** Movimientos orgánicos no predecibles
7. **GPU acceleration:** transform + opacity para performance
8. **Easing functions:** Control de velocidad (linear, easeInOut)
9. **Keyframe arrays:** Secuencias de valores para animación
10. **Composition:** Combinar elementos simples → resultado complejo

---

**Versión:** 2.0.0  
**Última actualización:** 2025-01-25  
**Autor:** PROBO Design Team  
**Licencia:** Uso interno PROBO

---

## 💡 Tips Finales

1. **Menos es más:** No sobrecargues con animaciones
2. **Performance primero:** Siempre testea en dispositivos medios
3. **Accesibilidad:** Respeta `prefers-reduced-motion`
4. **Coherencia:** Mantén el timing similar entre elementos
5. **Testea navegadores:** Safari puede comportarse diferente
6. **Documenta cambios:** Si modificas, actualiza la documentación
7. **Versiona:** Guarda versiones antes de cambios grandes

---

🎉 **¡Felicidades! Ahora dominas la creación de backgrounds animados profesionales.**
