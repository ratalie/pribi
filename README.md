# Probo Frontend v3

Aplicación moderna desarrollada con Nuxt 4, TypeScript, Tailwind 4 e internacionalización (i18n) para 6 idiomas.

## 🏗️ Arquitectura de Componentes

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

## 📁 Estructura de Carpetas

### Componentes

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

### Tipos y Utilidades

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

## ✅ Ventajas de esta Arquitectura

- **Máxima reutilización**: Base se usa en múltiples contextos
- **Mantenimiento sencillo**: Cambios aislados por capa
- **Testing granular**: Cada capa se testea independientemente
- **Escalabilidad**: Fácil agregar variantes o funcionalidades
- **Consistencia**: UI layer garantiza diseño uniforme

## 🎨 Sistema de Temas

La aplicación soporta 4 modos de tema:

- **Light Mode**: Tema claro
- **Dark Mode**: Tema oscuro
- **Purple Mode**: Tema morado personalizado
- **System Mode**: Sigue la preferencia del sistema

Variables CSS centralizadas en Tailwind 4 para colores, fuentes y espaciado.

## 🌍 Internacionalización

Soporte completo para 6 idiomas:

- 🇺🇸 Inglés (en)
- 🇪🇸 Español (es)

Utiliza Nuxt i18n con composables personalizados para gestión de traducciones.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
