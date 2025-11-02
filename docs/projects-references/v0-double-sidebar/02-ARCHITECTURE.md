# v0-double-sidebar - Arquitectura

## Estructura de Carpetas

```
v0-double-sidebar-component/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (fonts, analytics)
│   ├── page.tsx                      # Home (redirect)
│   ├── globals.css                   # Estilos globales + variables CSS
│   │
│   └── (docs)/                       # Route Group
│       ├── layout.tsx                # Wrapper para DocsLayout
│       ├── seleccion-junta/page.tsx
│       ├── datos-junta/page.tsx
│       ├── instalacion-junta/page.tsx
│       ├── puntos-agenda/            # 6 sub-carpetas con 24 páginas
│       ├── resumen/page.tsx
│       └── descargar/page.tsx
│
├── components/                       # Componentes React
│   ├── docs-layout.tsx              # ⭐ Layout principal
│   ├── main-sidebar.tsx             # ⭐ Navegación izquierda
│   ├── table-of-contents.tsx        # ⭐ Navegación derecha
│   ├── theme-provider.tsx           # Provider de temas
│   └── ui/                          # Componentes shadcn/ui
│       └── button.tsx               # Único componente UI
│
├── lib/                             # Utilidades
│   ├── utils.ts                     # Función cn()
│   └── navigation-config.ts         # ⭐ Config de navegación
│
├── public/                          # Assets estáticos (vacío)
├── styles/                          # Estilos extra (vacío)
│
├── components.json                  # Config shadcn/ui
├── next.config.mjs                  # Config Next.js
├── tsconfig.json                    # Config TypeScript
├── postcss.config.mjs               # Config PostCSS
└── package.json                     # Dependencias
```

## Patrones de Diseño

### 1. Compound Component Pattern

Componentes que trabajan juntos para formar una funcionalidad completa:

```tsx
<DocsLayout>
  {" "}
  {/* Orquestador */}
  <MainSidebar /> {/* Navegación izquierda */}
  <main>{children}</main>
  <TableOfContents /> {/* Navegación derecha */}
</DocsLayout>
```

### 2. Layout Pattern

Layouts anidados que agregan funcionalidad progresivamente:

```
Root Layout (app/layout.tsx)
  ├─ HTML, body, fonts
  ├─ Analytics
  └─ Global styles
      │
      └─ Docs Layout (app/(docs)/layout.tsx)
            ├─ DocsLayout wrapper
            └─ Navegación + estructura
                  │
                  └─ Page (específica)
                        └─ Contenido
```

### 3. Configuration-Driven Pattern

Toda la navegación se define en un solo archivo:

```typescript
// lib/navigation-config.ts
export const navigationStructure = [...]  // Sidebar
export const tocByRoute = {...}          // ToC
```

Beneficios:

- ✅ Único punto de cambio
- ✅ Fácil de mantener
- ✅ Type-safe
- ✅ Reutilizable

### 4. Container/Presentational Pattern

Separación de lógica y presentación:

```tsx
// Container (lógica)
function DocsLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  // ... lógica de estado

  return <DocsLayoutUI isOpen={isOpen} onToggle={...} />
}

// Presentational (UI puro)
function DocsLayoutUI({ isOpen, onToggle }) {
  return (/* JSX sin lógica */)
}
```

## Flujo de Datos

### Navegación

```
Usuario click en link
    ↓
Next.js Router actualiza
    ↓
usePathname() detecta cambio
    ↓
Componentes re-renderizan
    ↓
Active states actualizan
```

### Tabla de Contenidos

```
Router actualiza pathname
    ↓
usePathname() en TableOfContents
    ↓
Busca en tocByRoute[pathname]
    ↓
Renderiza ToC contextual
```

### Mobile Menu

```
Usuario click en botón
    ↓
setState(toggle menu)
    ↓
CSS transform slide-in
    ↓
Overlay backdrop aparece
    ↓
Click fuera → close menu
```

### Scroll a Secciones

```
Click en ToC link (#section)
    ↓
preventDefault()
    ↓
document.getElementById()
    ↓
scrollIntoView({ smooth: true })
```

## Gestión de Estado

### Local State (useState)

1. **DocsLayout** - `isMobileMenuOpen: boolean`

   - Controla visibilidad del menu mobile
   - Se cierra al navegar o click fuera

2. **MainSidebar** - `openSections: Record<string, boolean>`

   - Secciones colapsables abiertas/cerradas
   - "Puntos de Agenda" abierto por defecto

3. **TableOfContents** - `expandedItems: Record<string, boolean>`
   - Items expandidos en ToC
   - Para sub-navegación anidada

### URL State (usePathname)

- Ruta actual para active states
- Determina qué ToC mostrar
- Sincroniza navegación entre sidebars

### No hay:

- ❌ Redux/Zustand
- ❌ Context API global
- ❌ Server state management
- ❌ Form state

## Convenciones de Código

### Naming

```typescript
// Archivos
main - sidebar.tsx; // kebab-case

// Componentes
export function MainSidebar() {} // PascalCase

// Variables/funciones
const isMobileMenuOpen = false; // camelCase
const isActive = (href) => {}; // camelCase

// Constantes
export const navigationStructure = []; // camelCase

// CSS Classes
className = "flex items-center"; // Tailwind utilities
```

### Imports Order

```typescript
// 1. React/Next.js
import { useState } from "react";
import Link from "next/link";

// 2. Third-party
import { cn } from "@/lib/utils";

// 3. Local
import { MainSidebar } from "./main-sidebar";

// 4. Types
import type { NavItem } from "@/lib/navigation-config";
```

### Exports

```typescript
// Páginas
export default function Page() {}

// Componentes
export function ComponentName() {}

// Utilidades
export const utilFunction = () => {};
export function anotherUtil() {}
```

### TypeScript

```typescript
// Props inline
function Component({ children }: { children: React.ReactNode }) { }

// O con interface
interface ComponentProps {
  children: React.ReactNode
}
function Component({ children }: ComponentProps) { }

// Eventos
onClick={(e: React.MouseEvent) => { }}
```

## Jerarquía de Componentes

```
RootLayout
└─ body
   ├─ DocsLayoutWrapper
   │  └─ DocsLayout (Client Component)
   │     ├─ Mobile Menu Button
   │     │  └─ Button (shadcn/ui)
   │     │
   │     ├─ MainSidebar (fixed left)
   │     │  ├─ Header ("Junta General")
   │     │  └─ Navigation
   │     │     ├─ Simple Links
   │     │     └─ Collapsible Sections
   │     │        └─ Sub Links
   │     │
   │     ├─ Main Content (center)
   │     │  └─ {children} (páginas)
   │     │
   │     ├─ TableOfContents (fixed right)
   │     │  ├─ Header ("En esta página")
   │     │  └─ Context Links
   │     │     ├─ Route Links
   │     │     └─ Scroll Anchors
   │     │        └─ Sub-items
   │     │
   │     └─ Mobile Overlay
   │
   └─ Analytics (Vercel)
```

## Responsabilidades por Capa

### App Layer (`app/`)

- ✅ Define rutas (file-based)
- ✅ Configura layouts
- ✅ Implementa páginas
- ✅ Maneja redirects
- ❌ NO tiene lógica de negocio

### Components Layer (`components/`)

- ✅ Lógica de UI reutilizable
- ✅ Interactividad y estado local
- ✅ Composición de interfaces
- ✅ Accesibilidad
- ❌ NO accede a datos externos

### Lib Layer (`lib/`)

- ✅ Utilidades compartidas
- ✅ Configuración centralizada
- ✅ Funciones puras
- ✅ Constantes
- ❌ NO tiene side effects

### UI Layer (`components/ui/`)

- ✅ Componentes base (shadcn/ui)
- ✅ Primitivos de Radix UI
- ✅ Estilos consistentes
- ✅ Props estandarizadas
- ❌ NO tiene lógica de negocio

## Performance Patterns

### Server Components (por defecto)

```tsx
// Automáticamente Server Component
export default function Page() {
  return <div>No 'use client'</div>;
}
```

Ventajas:

- ✅ Menos JavaScript al cliente
- ✅ Mejor SEO
- ✅ Faster initial load

### Client Components (cuando necesario)

```tsx
"use client";

export function DocsLayout() {
  const [state, setState] = useState();
  // Necesita interactividad
}
```

Criterios:

- ✅ Usa useState/useEffect
- ✅ Maneja eventos (onClick, etc.)
- ✅ Usa browser APIs
- ✅ Usa hooks de terceros

### Code Splitting

```
Automático por Next.js:
├─ Por ruta (cada page.tsx)
├─ Por layout
└─ Por componente dinámico
```

### Image Optimization

```javascript
// next.config.mjs
export default {
  images: {
    unoptimized: true, // Deshabilitado
  },
};
```

Nota: No hay imágenes en el proyecto actual.

## Accesibilidad

### Semántica HTML

```tsx
<nav>{
  /* Navegación */
} <
  main >
  {
    /* Contenido principal */
  } <
  aside >
  {
    /* Sidebars */
  } <
  section >
  {
    /* Secciones de contenido */
  } <
  button >
  {
    /* Botones (no divs) */
  };
```

### ARIA

```tsx
// Radix UI proporciona ARIA automáticamente
<Button variant="outline">{/* aria-* attributes automáticos */}</Button>
```

### Keyboard Navigation

- ✅ Todos los links tabulables
- ✅ Buttons con focus-visible
- ✅ Enter/Space activa botones
- ✅ Orden lógico de tabulación

### Focus Management

```css
/* Tailwind utilities */
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

## Testing Strategy

### Actual

- ❌ No hay tests implementados
- ❌ No hay Jest/Vitest
- ❌ No hay Cypress/Playwright

### Recomendado

```
tests/
├── unit/
│   ├── lib/utils.test.ts
│   └── lib/navigation-config.test.ts
├── integration/
│   ├── components/MainSidebar.test.tsx
│   └── components/TableOfContents.test.tsx
└── e2e/
    ├── navigation.spec.ts
    └── mobile-menu.spec.ts
```

## Build & Deploy

### Desarrollo

```bash
npm run dev          # Dev server + hot reload
npm run lint         # ESLint
```

### Producción

```bash
npm run build        # Next.js build
npm start            # Production server
```

### Configuración

```javascript
// next.config.mjs
export default {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },
};
```

### Deploy

- ✅ Optimizado para Vercel
- ✅ Compatible con Netlify
- ✅ Funciona en Railway, Render
- ✅ Static export posible

---

**Última actualización**: Octubre 30, 2025
