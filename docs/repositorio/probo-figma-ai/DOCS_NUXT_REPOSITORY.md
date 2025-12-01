# 📚 DOCUMENTACIÓN COMPLETA - MÓDULO REPOSITORIO PROBO
## Guía Completa para Migración a Nuxt 4

---

## 📋 ÍNDICE DE DOCUMENTACIÓN

Esta es la documentación MAESTRA del módulo Repositorio. Los archivos de documentación están organizados así:

1. **DOCS_NUXT_REPOSITORY.md** (este archivo) - Índice y Overview General
2. **DOCS_NUXT_COMPONENTS.md** - Estructura de Componentes Detallada
3. **DOCS_NUXT_STYLES.md** - Guía Completa de Estilos y Design System
4. **DOCS_NUXT_ANIMATIONS.md** - Todas las Animaciones y Transiciones
5. **DOCS_NUXT_DATA.md** - Estructuras de Datos y Mock Data
6. **DOCS_NUXT_INTERACTIONS.md** - Interacciones y Funcionalidades

---

## 🎯 OBJETIVO DEL MÓDULO

El **Módulo Repositorio** es un sistema completo de gestión documental para PROBO que incluye:

- **Dashboard principal** con métricas y gráficos
- **Documentos Societarios** (estilo Google Drive)
- **Documentos Generados** (estructura jerárquica fija)
- **Carpetas Personalizadas** (espacios de trabajo con IA)
- **Selector de Sociedad** para multi-tenancy
- **Búsqueda global** integrada en todas las vistas

---

## 🗂️ ESTRUCTURA DE ARCHIVOS REACT (ORIGEN)

```
/components/repository/
├── RepositoryLayout.tsx          # Layout principal con sidebar
├── RepositoryDashboard.tsx       # Vista Dashboard (principal)
├── DocumentosSocietarios.tsx     # Vista Google Drive
├── DocumentosGenerados.tsx       # Vista jerárquica
├── CarpetasPersonalizadas.tsx    # Vista espacios personalizados
├── CarpetaDetailView.tsx         # Detalle de carpeta personalizada
├── GlobalSearchBar.tsx           # Buscador global
└── PreviewModal.tsx              # Modal para preview de documentos

/data/
└── mockDataRepository.ts         # Todo el mock data y tipos

/styles/
└── globals.css                   # Variables CSS y tipografías
```

---

## 🎨 PALETA DE COLORES PROBO (OFICIAL)

### Colores Principales
```css
--primary-800: #3C28A4    /* Morado principal PROBO */
--primary-700: #3C28A4    /* Morado para iconos y accents */
--primary-600: #4F46E5    /* Variante más clara */

/* Colores de Texto */
--text-primary: #1F2937   /* Texto principal (gris oscuro) */
--text-muted: #6B7280     /* Texto secundario (gris medio) */

/* Backgrounds */
--bg-muted: #F9FAFB       /* Background general de páginas */

/* Borders */
--border-light: #E5E7EB   /* Borders sutiles */

/* Estados */
--success: #10B981        /* Verde - éxito */
--warning: #F59E0B        /* Amarillo - advertencia */
--error: #DC2626          /* Rojo - error */
--info: #3B82F6           /* Azul - información */
```

### Colores Secundarios para UI
```css
/* Backgrounds de iconos y cards */
#EEF2FF   /* Morado muy claro - iconos primary */
#DBEAFE   /* Azul muy claro - iconos info */
#FEF3C7   /* Amarillo muy claro - iconos warning */
#F3E8FF   /* Púrpura muy claro - iconos purple */
#D1FAE5   /* Verde muy claro - iconos success */
#FEE2E2   /* Rojo muy claro - iconos error */
#F9FAFB   /* Gris muy claro - backgrounds neutros */
```

---

## 🔤 TIPOGRAFÍAS

### Fuentes
```css
--font-primary: 'Gabarito', sans-serif;    /* Headings y títulos */
--font-secondary: 'Manrope', sans-serif;   /* Body text y párrafos */
```

### Importación (en head de Nuxt)
```html
<link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Uso
```css
/* Títulos - SIEMPRE Gabarito */
h1, h2, h3, .heading {
  font-family: var(--font-primary);
  font-weight: 600; /* o 700 para extra bold */
}

/* Body text - SIEMPRE Manrope */
p, span, button, input {
  font-family: var(--font-secondary);
  font-weight: 400; /* o 500 para medium */
}
```

**⚠️ IMPORTANTE:** NO usar clases de Tailwind para font-size, font-weight o line-height a menos que se especifique. Las tipografías están pre-configuradas en globals.css.

---

## 📐 LAYOUT PRINCIPAL

### Estructura HTML
```
<div> (contenedor principal con sidebar)
  ├── <aside> (Sidebar izquierdo - 280px fijo)
  │   ├── Logo PROBO
  │   ├── Navegación (4 tabs)
  │   └── Footer con usuario
  │
  └── <main> (Contenido - flex-1)
      └── <component> (vista actual)
```

### Medidas
- **Sidebar width:** `280px` (fijo)
- **Main content:** `flex-1` (resto del espacio)
- **Max-width content:** `1600px` (centrado con mx-auto)
- **Padding horizontal:** `px-8` (32px)
- **Padding vertical:** `py-6` (24px)

---

## 🧭 SISTEMA DE NAVEGACIÓN

### Vistas del Módulo
```typescript
type RepositoryView = 
  | 'dashboard'           // Dashboard principal
  | 'societarios'         // Documentos Societarios
  | 'generados'           // Documentos Generados
  | 'personalizadas'      // Carpetas Personalizadas
  | 'carpeta-detail';     // Detalle de carpeta (con ID)
```

### Tabs del Sidebar
```typescript
const tabs = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard' // lucide-react
  },
  {
    id: 'societarios',
    label: 'Documentos Societarios',
    icon: 'FileText'
  },
  {
    id: 'generados',
    label: 'Documentos Generados',
    icon: 'Folder'
  },
  {
    id: 'personalizadas',
    label: 'Carpetas Personalizadas',
    icon: 'FolderOpen'
  }
];
```

### Estado de Navegación
```typescript
// Estado actual
const [currentView, setCurrentView] = useState<RepositoryView>('dashboard');
const [selectedCarpetaId, setSelectedCarpetaId] = useState<string | null>(null);

// Función de navegación
function handleNavigate(view: RepositoryView, carpetaId?: string) {
  setCurrentView(view);
  if (carpetaId) {
    setSelectedCarpetaId(carpetaId);
  }
}
```

---

## 🎭 ICONOS (Lucide React)

Todos los iconos vienen de **lucide-react**. En Nuxt 4 usar el equivalente de Nuxt o importar lucide-vue-next.

### Iconos Usados por Vista

#### Dashboard
- `LayoutDashboard` - Tab de dashboard
- `Building2` - Selector de sociedad
- `ChevronDown` - Dropdown chevron
- `Check` - Checkmark de selección
- `FileText` - Documentos
- `Folder` / `FolderOpen` - Carpetas
- `TrendingUp` - Métricas con tendencia
- `HardDrive` - Almacenamiento
- `Users` - Usuarios/actividad
- `Clock` - Tiempo/reciente
- `Download` / `Upload` - Acciones
- `Eye` - Vistas
- `ArrowRight` - Navegación en cards
- `Link` - Enlaces (como LinkIcon)

#### Documentos Societarios
- `Plus` - Crear nuevo
- `MoreVertical` - Menú de opciones
- `Trash2` - Eliminar
- `Eye` - Vista previa
- `Filter` - Filtros
- `Grid` / `List` - Toggle de vista

#### Documentos Generados
- `ChevronRight` / `ChevronDown` - Expandir/colapsar
- `FileText` - Archivos

#### Carpetas Personalizadas
- `MessageSquare` - Chat IA
- `Settings` - Configuración
- `Share2` - Compartir

---

## 📊 COMPONENTES DE GRÁFICOS

Usa **Recharts** para todos los gráficos:

```bash
npm install recharts
```

### Gráficos Usados
1. **BarChart** - Documentos por mes
2. **LineChart** - Actividad semanal
3. **PieChart** - Documentos por tipo

**⚠️ NOTA:** En Nuxt, importar como:
```typescript
import { BarChart, Bar, XAxis, YAxis, ... } from 'recharts';
```

---

## 🎯 SELECTOR DE SOCIEDAD

### Ubicación
Arriba de todo en el Dashboard, antes del buscador.

### Componente
Usa **Dropdown Menu** de shadcn/ui (o equivalente en Nuxt).

### Estructura
```
Label: "Gestionando repositorio de"
↓
[Botón con sociedad actual + chevron]
↓
Dropdown con lista:
  - Sociedades activas (con check en la seleccionada)
  - Separator
  - Sociedades inactivas (con opacity 60%)
```

### Estilos del Botón
```css
- Background: white
- Border: var(--border-light)
- Border-radius: 12px
- Padding: 12px 16px
- Hover: shadow-md
- Icono fondo: #EEF2FF
- Icono color: var(--primary-700)
```

---

## 🔍 BUSCADOR GLOBAL

### Características
- Input con icono de lupa (Search)
- Placeholder dinámico según la vista
- Border morado en focus: `var(--primary-700)`
- Border-radius: `12px`
- Padding: `12px 16px`

### Placeholders por Vista
```typescript
{
  dashboard: "Buscar en todo el repositorio...",
  societarios: "Buscar en documentos societarios...",
  generados: "Buscar en documentos generados...",
  personalizadas: "Buscar en carpetas personalizadas..."
}
```

---

## 📦 RESUMEN DE COMPONENTES

### 1. RepositoryLayout
- **Propósito:** Layout maestro con sidebar + contenido
- **Props:** Ninguna (maneja estado interno)
- **Archivos relacionados:** Todos los demás componentes de repository

### 2. RepositoryDashboard
- **Propósito:** Vista principal con métricas y gráficos
- **Props:** `{ onNavigate, searchQuery, onSearchChange }`
- **Secciones:** 
  - Selector de sociedad
  - Buscador
  - Carpetas del Sistema (2 cards)
  - Carpetas Personalizadas (1 card con 4 métricas)
  - Estadísticas Generales (4 mini cards)
  - Análisis y Gráficos (3 gráficos + 2 listas)

### 3. DocumentosSocietarios
- **Propósito:** Vista estilo Google Drive
- **Características:** Grid/List view, preview modal, acciones

### 4. DocumentosGenerados
- **Propósito:** Vista jerárquica con expandibles
- **Características:** Estructura fija de 3 niveles

### 5. CarpetasPersonalizadas
- **Propósito:** Lista de espacios personalizados
- **Características:** Cards con métricas + acceso a detalle

### 6. CarpetaDetailView
- **Propósito:** Detalle de carpeta con tabs
- **Tabs:** Documentos Enlazados, Chat IA, Permisos

---

## ⚡ SIGUIENTE PASO

Lee los archivos de documentación detallada en este orden:

1. ✅ **DOCS_NUXT_REPOSITORY.md** (este archivo) - Overview
2. 📦 **DOCS_NUXT_COMPONENTS.md** - Componentes detallados
3. 🎨 **DOCS_NUXT_STYLES.md** - Estilos y design system
4. ✨ **DOCS_NUXT_ANIMATIONS.md** - Animaciones y transiciones
5. 💾 **DOCS_NUXT_DATA.md** - Estructuras de datos
6. 🖱️ **DOCS_NUXT_INTERACTIONS.md** - Interacciones y funcionalidades

---

## 🚀 STACK TECNOLÓGICO

### React (Original)
- React 18
- TypeScript
- Tailwind CSS v4
- Lucide React (iconos)
- Recharts (gráficos)
- Shadcn/ui (componentes base)

### Nuxt 4 (Destino)
- Nuxt 4
- Vue 3 Composition API
- TypeScript
- Tailwind CSS v4
- Lucide Vue Next (iconos)
- Recharts o Vue equivalente
- Shadcn Vue (o equivalente)

---

## 📝 NOTAS IMPORTANTES PARA LA MIGRACIÓN

1. **NO usar clases de Tailwind** para font-size, font-weight, line-height
2. **Todos los colores** deben usar variables CSS definidas en globals.css
3. **Todas las fuentes** deben usar var(--font-primary) o var(--font-secondary)
4. **Todos los borders** deben ser: `border` + `style={{ borderColor: 'var(--border-light)' }}`
5. **Todos los border-radius** en cards grandes: `rounded-xl` (12px)
6. **Todos los paddings** en cards: `p-6` (24px)
7. **Todos los gaps** en grids: `gap-4` (16px) o `gap-6` (24px)
8. **Todas las sombras** en hover: `hover:shadow-md` o `hover:shadow-lg`
9. **Todas las transiciones:** `transition-all` o `transition-colors`
10. **Iconos siempre** con tamaño explícito: `w-6 h-6`, `w-5 h-5`, etc.

---

## ✅ CHECKLIST DE MIGRACIÓN

- [ ] Configurar variables CSS en globals.css
- [ ] Importar fuentes Gabarito y Manrope
- [ ] Configurar Tailwind v4
- [ ] Instalar lucide-vue-next
- [ ] Instalar recharts (o equivalente Vue)
- [ ] Crear estructura de carpetas /components/repository/
- [ ] Crear archivo de mock data
- [ ] Crear RepositoryLayout
- [ ] Crear RepositoryDashboard
- [ ] Crear DocumentosSocietarios
- [ ] Crear DocumentosGenerados
- [ ] Crear CarpetasPersonalizadas
- [ ] Crear CarpetaDetailView
- [ ] Crear GlobalSearchBar
- [ ] Crear PreviewModal
- [ ] Probar navegación entre vistas
- [ ] Probar selector de sociedad
- [ ] Probar búsqueda global
- [ ] Verificar todas las animaciones
- [ ] Verificar todos los colores
- [ ] Verificar todas las tipografías
- [ ] Verificar responsividad
- [ ] Hacer testing completo

---

**Documentación creada por:** Sistema Figma Make → Nuxt 4 Migration
**Fecha:** Diciembre 2024
**Versión:** 1.0.0

