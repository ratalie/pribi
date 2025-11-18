# DOCS-GLOBAL

Documentación central para todos los proyectos de referencia y guías de migración.

## Estructura

```
docs/
├── instructions/              # Guías de migración y buenas prácticas
│   ├── 00-INDEX.md
│   ├── 01-NEXTJS-TO-NUXT.md
│   ├── 02-REACT-TO-VUE-PATTERNS.md
│   ├── 03-SHADCN-MIGRATION.md
│   ├── 04-VEE-VALIDATE-USAGE.md
│   ├── 05-ROUTING-MIGRATION.md
│   ├── 06-STATE-MANAGEMENT.md
│   └── 07-COMMON-PITFALLS.md
│
├── projects-references/       # Documentación de proyectos de referencia
│   └── v0-double-sidebar/
│       ├── 00-INDEX.md
│       ├── 01-PROJECT-SUMMARY.md
│       ├── 02-ARCHITECTURE.md
│       ├── 03-COMPONENTS.md
│       ├── 04-ROUTING.md
│       ├── 05-STYLING.md
│       └── 06-NAVIGATION-CONFIG.md
│
├── ARCHITECTURE.md            # Arquitectura de componentes
├── ROUTING.md                 # Sistema de enrutamiento
├── SISTEMA_COLORES.md         # Sistema de colores
├── I18N_*.md                  # Documentación de i18n
│
└── 🆕 Sistema de Sidebar Doble
    ├── DOUBLE_SIDEBAR_EXECUTIVE_SUMMARY.md
    ├── DOUBLE_SIDEBAR_PLAN.md
    ├── DOUBLE_SIDEBAR_ARCHITECTURE_DIAGRAMS.md
    └── DOUBLE_SIDEBAR_CODE_EXAMPLES.md
```

## Propósito

Esta carpeta centraliza:

1. **Instructions**: Guías paso a paso para migrar código de Next.js/React a Nuxt/Vue
2. **Project References**: Documentación resumida de proyectos simples que sirven como referencia

## Uso

Cuando necesites migrar un proyecto de Next.js a Nuxt:

1. Lee `instructions/00-INDEX.md` para overview
2. Consulta las guías específicas según lo que necesites
3. Revisa `projects-references/` para ejemplos concretos
4. Aplica los patrones aprendidos a tu proyecto Nuxt

## Fecha de creación

Octubre 30, 2025
