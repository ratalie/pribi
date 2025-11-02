# 🏗️ Arquitectura de Componentes

Documentación completa de la arquitectura de componentes del proyecto.

## Patrón Three-Layer Component Architecture

Este proyecto implementa el patrón **"Three-Layer Component Architecture"** que combina:

- **Atomic Design Pattern**: Separación en componentes reutilizables
- **Headless Component Pattern**: Lógica pura sin estilos
- **Wrapper/Container Pattern**: Estilos sobre lógica base
- **Composite Pattern**: Lógica de negocio específica

### Estructura de Capas

```
Base Layer (Headless)     →  Lógica pura, sin estilos
    ↓
UI Layer (Wrapper)        →  Estilos + Base, reutilizable
    ↓
Custom Layer (Composite)  →  Lógica de negocio + UI específica
```

## Estructura de Componentes Generales

```
app/components/
├── base/                    # Lógica pura (headless components)
│   ├── inputs/
│   │   ├── text/
│   │   │   ├── BaseTextInput.vue      # Lógica: validación, formateo
│   │   │   ├── ui/
│   │   │   │   ├── TextInput.vue      # Wrapper con estilos
│   │   │   │   └── TextArea.vue       # Variante multilinea
│   │   │   └── custom/
│   │   │       └── ClientNameInput.vue # Lógica específica de negocio
│   │   ├── number/
│   │   ├── search/
│   │   └── select/
│   └── tables/
│       ├── data-table/
│       ├── simple-table/
│       └── tree-table/
├── ui/                      # Componentes de interfaz reutilizables
└── composite/               # Componentes específicos de flujo/negocio
```

## Estructura de Módulos de Negocio

```
app/modules/registro-sociedades/
├── components/
│   ├── steps/
│   │   ├── DatosSociedadStep.vue
│   │   ├── AccionistasStep.vue
│   │   ├── DirectorioStep.vue
│   │   └── ...(6 componentes Step adicionales)
│   ├── directorio/                #Componentes específicos del step (opcional)
│   │   ├── DirectorCard.vue
│   │   ├── DirectorTable.vue
│   │   ├── DirectorForm.vue
│   │   └── DirectorModal.vue
│   ├── accionistas/
│   │   ├── ShareholderCard.vue
│   │   ├── ShareholderList.vue
│   │   └── AccionistasModal.vue
│   └── datos-sociedad/
│       ├── CompanyInfoForm.vue
│       ├── DocumentUploader.vue
│       └── SocietyDataModal.vue
├── composables/
│   ├── useRegistroSocietario.ts     # Estado y lógica del wizard
│   ├── useValidationRules.ts        # Reglas de validación específicas
│   └── useSocietaryData.ts          # Gestión de datos de sociedad
├── utils/
│   ├── formatters.ts                # Formateo de datos societarios
│   ├── validators.ts                # Validaciones de negocio
│   └── constants.ts                 # Constantes del módulo
└── types/
    ├── society.ts                   # Interfaces de sociedad
    ├── shareholders.ts              # Tipos de accionistas
    └── wizard.ts                    # Estados del wizard
```

## Tipos y Utilidades Globales

```
├── types/
│   ├── inputs/              # Interfaces para inputs
│   ├── tables/              # Interfaces para tablas
│   └── enums/               # Enums para variants, estados
├── composables/
│   ├── inputs/              # Hooks reactivos para inputs
│   ├── tables/              # Hooks para tablas
│   ├── api/                 # Hooks para APIs
│   └── business/            # Lógica de negocio específica
├── utils/
│   ├── inputs/              # Funciones puras para inputs
│   ├── tables/              # Utilidades para tablas
│   └── formatters/          # Formateo de datos
└── constants/
    ├── inputs/              # Configuraciones de inputs
    └── tables/              # Configuraciones de tablas
```

## Ventajas de esta Arquitectura

- **Máxima reutilización**: Base se usa en múltiples contextos
- **Mantenimiento sencillo**: Cambios aislados por capa
- **Testing granular**: Cada capa se testea independientemente
- **Escalabilidad**: Fácil agregar variantes o funcionalidades
- **Consistencia**: UI layer garantiza diseño uniforme

---

[← Volver al README principal](../README.md)
