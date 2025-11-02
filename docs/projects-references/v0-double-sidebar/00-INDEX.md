# v0-double-sidebar - Índice de Documentación

## Información General

- **Nombre**: v0-double-sidebar-component
- **Tipo**: Aplicación de documentación con doble sidebar
- **Framework**: Next.js 16 + React 19
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS v4 + shadcn/ui
- **Fecha de análisis**: Octubre 27, 2025

## Contenido de la Documentación

### [01-PROJECT-SUMMARY.md](./01-PROJECT-SUMMARY.md)

Resumen ejecutivo del proyecto con:

- Stack tecnológico completo
- Propósito y características principales
- Métricas del proyecto
- Puntos fuertes y áreas de mejora

### [02-ARCHITECTURE.md](./02-ARCHITECTURE.md)

Arquitectura detallada incluyendo:

- Estructura de carpetas completa
- Patrones de diseño utilizados
- Flujo de datos y estado
- Convenciones de código

### [03-COMPONENTS.md](./03-COMPONENTS.md)

Análisis de todos los componentes:

- DocsLayout (layout principal)
- MainSidebar (navegación izquierda)
- TableOfContents (navegación derecha)
- ThemeProvider (manejo de temas)
- Button (único componente shadcn/ui)

### [04-ROUTING.md](./04-ROUTING.md)

Sistema de enrutamiento completo:

- App Router de Next.js
- Route Groups
- Layouts anidados
- Mapeo de rutas (32 páginas)
- Redirecciones

### [05-STYLING.md](./05-STYLING.md)

Sistema de estilos:

- Tailwind CSS v4
- CSS Variables (OKLCH)
- Modo claro/oscuro
- Tipografías Geist
- Responsive design

### [06-NAVIGATION-CONFIG.md](./06-NAVIGATION-CONFIG.md)

Configuración de navegación:

- navigationStructure (sidebar izquierdo)
- tocByRoute (tabla de contenidos)
- Patrones de navegación
- Integración con componentes

## Quick Facts

| Aspecto                   | Detalle                 |
| ------------------------- | ----------------------- |
| **Páginas totales**       | 32 páginas .tsx         |
| **Componentes custom**    | 4 componentes           |
| **Componentes shadcn/ui** | 1 (Button)              |
| **Paquetes Radix UI**     | 27 instalados, 1 en uso |
| **Rutas principales**     | 8 secciones             |
| **Sub-rutas**             | 24 en puntos-agenda     |
| **Dependencias npm**      | 50+ paquetes            |
| **Bundle estimado**       | ~160 KB (gzipped)       |

## Uso Recomendado

Este proyecto es excelente referencia para:

1. ✅ **Layouts con doble sidebar** - Navegación izquierda + ToC derecha
2. ✅ **Aplicaciones wizard** - Flujo multi-paso guiado
3. ✅ **Sistemas de documentación** - Navegación jerárquica contextual
4. ✅ **Responsive patterns** - Mobile menu overlay
5. ✅ **Configuración shadcn/ui** - Setup completo de shadcn

## Consideraciones para Migración a Nuxt

### ✅ Fácil de migrar

- Lógica de componentes (con adaptación a Vue)
- Estilos Tailwind (100% compatible)
- Estructura de navegación (solo cambiar imports)
- Layout patterns (muy similar en Nuxt)

### ⚠️ Requiere adaptación

- App Router → Pages/Layouts de Nuxt
- React hooks → Vue Composition API
- usePathname → useRoute
- Server Components → Composables

### ❌ No compatible

- next/navigation → usar navigateTo
- next/font → usar @nuxtjs/google-fonts
- Vercel Analytics → usar Nuxt modules

## Archivos de Referencia Clave

```
v0-double-sidebar-component/
├── components/
│   ├── docs-layout.tsx          ⭐ Layout principal
│   ├── main-sidebar.tsx         ⭐ Navegación con secciones colapsables
│   └── table-of-contents.tsx    ⭐ ToC contextual
│
├── lib/
│   └── navigation-config.ts     ⭐ Configuración centralizada
│
├── app/
│   ├── layout.tsx               ⭐ Root layout
│   ├── (docs)/layout.tsx        ⭐ Docs layout wrapper
│   └── globals.css              ⭐ CSS variables y theming
│
└── components.json              ⭐ Config shadcn/ui
```

## Próximos Pasos

Al usar este proyecto como referencia:

1. Lee el resumen ejecutivo primero ([01-PROJECT-SUMMARY.md](./01-PROJECT-SUMMARY.md))
2. Entiende la arquitectura ([02-ARCHITECTURE.md](./02-ARCHITECTURE.md))
3. Estudia los componentes clave ([03-COMPONENTS.md](./03-COMPONENTS.md))
4. Consulta `docs-global/instructions/` para patrones de migración
5. Adapta el código a Vue/Nuxt según las guías

---

**Última actualización**: Octubre 30, 2025
