# 📋 INVESTIGACIÓN COMPLETA - PROBO UI SIDEBAR Y FUNCIONALIDADES

## 🎯 Resumen Ejecutivo

**PROBO** es una aplicación **Next.js 15** desarrollada para gestión legal corporativa que presenta una arquitectura moderna y escalable con las siguientes características principales:

- ✅ **Sidebar colapsible** con navegación jerárquica
- ✅ **Sistema de temas** (Light, Dark, Custom)
- ✅ **Internacionalización** completa (5 idiomas)
- ✅ **Sistema de permisos** por roles de usuario
- ✅ **Modal de configuración** avanzado
- ✅ **Componentes UI** basados en Radix UI + Tailwind CSS

---

## 🏗️ ARQUITECTURA DEL PROYECTO

### 📦 Tecnologías y Dependencias Principales

```json
{
  "frameworks": ["Next.js 15.2.4", "React 18+", "TypeScript"],
  "ui": ["@radix-ui/*", "tailwindcss", "lucide-react", "class-variance-authority"],
  "estado": ["React Context API"],
  "fuentes": ["Geist Sans", "Geist Mono"],
  "herramientas": ["pnpm", "Vercel Analytics"]
}
```

### 🗂️ Estructura de Carpetas

```
├── app/                          # App Router de Next.js
│   ├── globals.css              # Estilos globales y variables CSS
│   ├── layout.tsx               # Layout principal con providers
│   ├── page.tsx                 # Página de inicio
│   ├── configuracion/           # Rutas de configuración
│   ├── features/                # Funcionalidades principales
│   ├── operaciones/             # Operaciones corporativas
│   └── registro-societario/     # Registro de sociedades
│
├── components/                   # Componentes reutilizables
│   ├── probo-sidebar.tsx        # Sidebar principal ⭐
│   ├── app-layout.tsx           # Layout de la aplicación
│   ├── configuration-modal.tsx   # Modal de configuración ⭐
│   ├── language-select.tsx      # Selector de idiomas ⭐
│   ├── theme-selector.tsx       # Selector de temas ⭐
│   ├── user-dropdown-menu.tsx   # Menú desplegable del usuario
│   ├── config-sections/         # Secciones del modal de config
│   └── ui/                      # Componentes base de UI
│
├── lib/                         # Lógica de negocio y utilidades
│   ├── contexts/               # Context providers React
│   │   ├── language-context.tsx # Gestión de idiomas ⭐
│   │   ├── theme-context.tsx    # Gestión de temas ⭐
│   │   └── user-context.tsx     # Gestión de usuarios y permisos
│   ├── domain/                 # Configuración del dominio
│   │   ├── navigation/         # Configuración de navegación
│   │   └── auth/              # Tipos y datos de autenticación
│   └── infrastructure/        # Mapeo de infraestructura
```

---

## 🎨 COMPONENTES UI PRINCIPALES

### 1. 🗂️ ProboSidebar - Componente Principal

**Archivo**: `components/probo-sidebar.tsx`

**Características**:
- ✅ **Colapsible** con animaciones suaves
- ✅ **Navegación jerárquica** con submenús expandibles
- ✅ **Indicador de ruta activa** inteligente
- ✅ **Sistema de permisos** integrado
- ✅ **Perfil de usuario** en la parte inferior
- ✅ **Scrollbar personalizada** para navegación larga

**Funcionalidades**:
```typescript
// Estados principales
const [isCollapsed, setIsCollapsed] = useState(false);
const [expandedSections, setExpandedSections] = useState({
  "Registro Societario": true,
  "Operaciones de Órgano de Control": true,
  Storage: true,
  Features: true,
});
const [expandedItems, setExpandedItems] = useState({});

// Funciones clave
- toggleSection() - Expandir/colapsar secciones
- toggleItem() - Expandir/colapsar elementos
- isActive() - Detectar ruta activa
- canViewModule() - Verificar permisos por rol
```

**Estructura Visual**:
```
┌─────────────────────────────┐
│ 🏢 PROBO                   │ ← Header con logo
├─────────────────────────────┤
│ 📁 Registro Societario      │ ← Secciones expandibles
│   └─ Registro de Sociedades │
│   └─ Registro de Sucursales │
├─────────────────────────────┤
│ ⚙️ Operaciones Control      │
│   └─ 👥 Junta Accionistas   │ ← Submenús anidados
│      └─ Dashboard          │
│      └─ Accionistas        │
│      └─ Histórico          │
├─────────────────────────────┤
│ 👤 [Usuario] [Menú ⋮]      │ ← Perfil + Menú desplegable
└─────────────────────────────┘
```

### 2. ⚙️ ConfigurationModal - Modal Avanzado

**Archivo**: `components/configuration-modal.tsx`

**Características**:
- ✅ **Layout de dos columnas**: Navegación + Contenido
- ✅ **Secciones organizadas**: Administración, Preferencias, Integraciones
- ✅ **Navegación interna** con estado persistente
- ✅ **Scroll personalizado** para contenido largo

**Secciones Disponibles**:
```typescript
const configurationSections = [
  {
    id: "administracion",
    title: "Administración", 
    items: [
      { id: "dashboard", title: "Dashboard" },
      { id: "facturacion", title: "Facturación" },
      { id: "usuarios", title: "Usuarios" },
      { id: "general", title: "General" }
    ]
  },
  { id: "preferencias", title: "Preferencias" }, // ← Temas + Idiomas
  { id: "perfil", title: "Perfil" },
  {
    id: "integraciones",
    title: "Integraciones",
    items: [
      { id: "gmail", title: "Gmail" },
      { id: "google-drive", title: "Google Drive" }
    ]
  }
];
```

### 3. 🌐 LanguageSelect - Selector de Idiomas

**Archivo**: `components/language-select.tsx`

**Idiomas Soportados**:
```typescript
const languages = [
  { code: "es", name: "Español", nativeName: "Español", flag: "🇪🇸" },
  { code: "en", name: "Inglés", nativeName: "English", flag: "🇺🇸" },
  { code: "fr", name: "Francés", nativeName: "Français", flag: "🇫🇷" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "zh", name: "Chino", nativeName: "中文", flag: "🇨🇳" }
];
```

**Variantes Disponibles**:
- ✅ **`default`**: Versión completa con nombres nativos
- ✅ **`compact`**: Versión compacta solo con bandera y dropdown

### 4. 🎨 ThemeSelector - Selector de Temas

**Archivo**: `components/theme-selector.tsx`

**Temas Disponibles**:
```typescript
const themes = [
  {
    id: "light",
    name: "Claro", 
    icon: Sun,
    description: "Tema claro para uso diurno"
  },
  {
    id: "dark", 
    name: "Oscuro",
    icon: Moon,
    description: "Tema oscuro para uso nocturno"
  },
  {
    id: "custom",
    name: "Personalizado",
    icon: Palette,
    description: "Colores personalizables"
  }
];
```

**Colores Personalizables**:
```typescript
interface CustomColors {
  primary: string;    // Color primario
  secondary: string;  // Color secundario
  accent: string;     // Color de acento
  background: string; // Fondo
  foreground: string; // Texto principal
}
```

---

## 🌍 SISTEMA DE INTERNACIONALIZACIÓN

### 📝 Implementación

**Archivo Principal**: `lib/contexts/language-context.tsx`

**Características**:
- ✅ **Context API** para gestión global del idioma
- ✅ **Persistencia** en localStorage
- ✅ **Traducciones completas** para toda la UI
- ✅ **Hook personalizado** `useLanguage()`

### 🗣️ Idiomas Soportados

| Idioma | Código | Bandera | Nombre Nativo |
|--------|--------|---------|---------------|
| Español | `es` | 🇪🇸 | Español |
| Inglés | `en` | 🇺🇸 | English |
| Francés | `fr` | 🇫🇷 | Français |
| Hindi | `hi` | 🇮🇳 | हिंदी |
| Chino | `zh` | 🇨🇳 | 中文 |

### 📚 Estructura de Traducciones

```typescript
const translations = {
  es: {
    // Secciones del sidebar
    "registro-societario": "Registro Societario",
    "operaciones-organo": "Operaciones de Órgano de Control", 
    
    // Elementos de navegación
    "registro-sociedades": "Registro de Sociedades",
    "junta-accionistas": "Junta de Accionistas",
    
    // Configuración
    "config-title": "Configuración",
    "language-settings": "Idioma",
    "theme-settings": "Tema",
    
    // Acciones
    "save-changes": "Guardar Cambios",
    "cerrar-sesion": "Cerrar sesión"
  },
  en: { /* traducciones en inglés */ },
  fr: { /* traducciones en francés */ },
  hi: { /* traducciones en hindi */ },
  zh: { /* traducciones en chino */ }
};
```

### 🔧 Uso del Hook

```typescript
// En cualquier componente
const { language, setLanguage, t } = useLanguage();

// Cambiar idioma
setLanguage("en");

// Usar traducciones
<h1>{t("config-title")}</h1>
```

---

## 🎨 SISTEMA DE TEMAS

### 🎯 Implementación

**Archivo Principal**: `lib/contexts/theme-context.tsx`

**Características**:
- ✅ **3 temas predefinidos**: Light, Dark, Custom
- ✅ **Variables CSS** con CSS Custom Properties
- ✅ **Persistencia** en localStorage
- ✅ **Tema personalizado** con selector de colores

### 🌈 Variables CSS (globals.css)

**Tema Claro (`:root`)**:
```css
:root {
  --background: oklch(1 0 0);           /* Fondo blanco */
  --foreground: oklch(0.145 0 0);       /* Texto negro */
  --primary: oklch(0.205 0 0);          /* Primario oscuro */
  --sidebar: oklch(0.985 0 0);          /* Sidebar claro */
  /* ... más variables */
}
```

**Tema Oscuro (`.dark`)**:
```css
.dark {
  --background: oklch(0.145 0 0);       /* Fondo oscuro */
  --foreground: oklch(0.985 0 0);       /* Texto claro */
  --primary: oklch(0.985 0 0);          /* Primario claro */
  --sidebar: oklch(0.205 0 0);          /* Sidebar oscuro */
  /* ... más variables */
}
```

**Tema Personalizado (`.custom`)**:
```css
.custom {
  --primary: var(--custom-primary, oklch(0.55 0.25 280));
  --background: var(--custom-background, oklch(0.18 0.02 280));
  --accent: var(--custom-accent, oklch(0.45 0.2 280));
  /* Usa variables personalizables */
}
```

### 🎨 Personalización de Colores

El tema personalizado permite modificar:
- **Color Primario**: Botones y elementos principales
- **Color Secundario**: Elementos secundarios
- **Color de Acento**: Highlights y detalles
- **Fondo**: Color de fondo principal
- **Texto**: Color del texto principal

---

## 🗺️ NAVEGACIÓN Y RUTAS

### 📋 Configuración de Navegación

**Archivo**: `lib/domain/navigation/navigation-config.ts`

**Estructura Jerárquica**:
```typescript
export const navigationSections = [
  {
    id: "registro-societario",
    title: "Registro Societario",
    translationKey: "registro-societario",
    items: [
      {
        id: "registro-sociedades",
        href: "/registro-societario/sociedades",
        icon: "Building2"
      },
      {
        id: "registro-sucursales", 
        href: "/registro-societario/sucursales",
        icon: "Building2"
      }
    ]
  },
  {
    id: "operaciones-organo-control",
    title: "Operaciones de Órgano de Control",
    items: [
      {
        id: "junta-accionistas",
        hasSubmenu: true,
        submenuItems: [
          { 
            id: "junta-dashboard",
            href: "/operaciones/junta-accionistas/dashboard",
            icon: "LayoutDashboard"
          },
          {
            id: "junta-accionistas-main",
            href: "/operaciones/junta-accionistas/accionistas", 
            icon: "Users"
          },
          {
            id: "junta-historico",
            href: "/operaciones/junta-accionistas/historico",
            icon: "History"
          }
        ]
      }
    ]
  }
];
```

### 🗂️ Mapeo de Rutas

| Sección | Ruta Base | Subrutas |
|---------|-----------|----------|
| **Registro Societario** | `/registro-societario/` | `/sociedades`, `/sucursales` |
| **Junta Accionistas** | `/operaciones/junta-accionistas/` | `/dashboard`, `/accionistas`, `/historico` |
| **Directorio** | `/operaciones/directorio/` | `/dashboard`, `/directores`, `/historico` |
| **Gerencia General** | `/operaciones/gerencia-general/` | `/dashboard`, `/gerentes`, `/historico` |
| **Storage** | `/storage/` | `/almacen`, `/documentos-generados` |
| **Features** | `/features/` | `/chat-ia`, `/documentos-ia`, `/reporteria`, `/plan-servicio` |
| **Configuración** | `/configuracion/` | `/perfil`, `/preferencias` |

### 🔐 Sistema de Permisos por Rol

**Archivo**: `lib/contexts/user-context.tsx`

**Roles Disponibles**:
```typescript
type UserRole = "admin" | "register" | "lector";
```

**Lógica de Permisos**:
```typescript
const canViewModule = (moduleId: string): boolean => {
  // ADMIN: Ve todo excepto módulos específicamente ocultos
  if (currentUser.role === "admin") {
    return !currentUser.customPermissions?.hiddenModules?.includes(moduleId);
  }
  
  // REGISTER: Ve todo excepto "plan-servicio"  
  if (currentUser.role === "register") {
    if (moduleId === "plan-servicio") return false;
    return !currentUser.customPermissions?.hiddenModules?.includes(moduleId);
  }
  
  // LECTOR: No ve "registro-societario"
  if (currentUser.role === "lector") {
    if (moduleId === "registro-societario") return false;
    return !currentUser.customPermissions?.hiddenModules?.includes(moduleId);
  }
  
  return true;
};
```

**Permisos Personalizados**:
```typescript
interface CustomPermissions {
  hiddenModules?: string[];      // Módulos ocultos
  readOnlyModules?: string[];    // Módulos de solo lectura
}
```

---

## 🔧 FUNCIONALIDADES AVANZADAS

### 1. 📱 Responsividad

- ✅ **Sidebar colapsible** en dispositivos pequeños
- ✅ **Grid adaptativo** para configuraciones
- ✅ **Botones responsive** con variantes de tamaño
- ✅ **Menús desplegables** optimizados para móvil

### 2. ♿ Accesibilidad

- ✅ **ARIA labels** en todos los controles
- ✅ **Navegación por teclado** completa
- ✅ **Focus management** en modales
- ✅ **Screen reader friendly** con textos descriptivos

### 3. 🎯 UX/UI Optimizada

- ✅ **Animaciones suaves** con CSS transitions
- ✅ **Estados de hover** consistentes
- ✅ **Indicadores visuales** para estados activos
- ✅ **Scrollbars personalizadas** para mejor estética

### 4. ⚡ Performance

- ✅ **Lazy loading** de componentes
- ✅ **Context optimization** con múltiples providers
- ✅ **Memoization** en componentes críticos
- ✅ **Bundle optimization** con Next.js

---

## 🛠️ COMPONENTES UI BASE (Radix UI)

### 📦 Componentes Utilizados

| Componente | Archivo | Propósito |
|------------|---------|-----------|
| **Button** | `ui/button.tsx` | Botones con múltiples variantes |
| **Avatar** | `ui/avatar.tsx` | Fotos de perfil con fallback |
| **Card** | `ui/card.tsx` | Contenedores de contenido |
| **Collapsible** | `ui/collapsible.tsx` | Secciones expandibles |
| **DropdownMenu** | `ui/dropdown-menu.tsx` | Menús desplegables |
| **Input** | `ui/input.tsx` | Campos de entrada |
| **Label** | `ui/label.tsx` | Etiquetas de formularios |
| **Switch** | `ui/switch.tsx` | Interruptores on/off |
| **CustomScrollArea** | `ui/custom-scroll-area.tsx` | Scroll personalizado |

### 🎨 Variantes de Botones

```typescript
const buttonVariants = cva({
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-white hover:bg-destructive/90',
      outline: 'border bg-background hover:bg-accent',
      secondary: 'bg-secondary text-secondary-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline'
    },
    size: {
      default: 'h-9 px-4 py-2',
      sm: 'h-8 px-3',
      lg: 'h-10 px-6',
      icon: 'size-9'
    }
  }
});
```

---

## 📊 ICONOGRAFÍA

### 🎨 Lucide React Icons

**Archivo**: `lib/infrastructure/navigation/icon-mapper.tsx`

**Iconos Utilizados**:
```typescript
export const iconMap = {
  // Navegación principal
  Building2,    // Sociedades/Sucursales
  Users,        // Junta de Accionistas
  Briefcase,    // Directorio/Gerencia
  Database,     // Almacén
  FileText,     // Documentos
  
  // Features
  Sparkles,     // Chat IA
  Bot,          // Documentos IA
  Diamond,      // Plan de Servicio
  BarChart3,    // Reportería
  
  // Sistema
  Settings,     // Configuración
  HelpCircle,   // Ayuda
  LogOut,       // Cerrar Sesión
  LayoutDashboard, // Dashboard
  History,      // Histórico
  
  // Temas
  Palette,      // Personalización
  Globe,        // Idiomas
  ChevronDown,  // Expansión
  ChevronRight, // Navegación
  Menu,         // Menú hamburguesa
  X             // Cerrar
};
```

---

## 🚀 FLUJO DE DATOS

### 🔄 Context Providers Jerarquía

```
RootLayout
├── ThemeProvider        ← Gestión de temas
│   ├── LanguageProvider ← Gestión de idiomas  
│   │   ├── UserProvider ← Gestión de usuarios/permisos
│   │   │   └── AppLayout ← Layout principal
│   │   │       ├── ProboSidebar ← Sidebar navegación
│   │   │       └── children ← Contenido de páginas
```

### 📡 Estado Global

**Temas** (`ThemeContext`):
```typescript
{
  theme: "light" | "dark" | "custom",
  setTheme: (theme) => void,
  customColors: CustomColors,
  setCustomColors: (colors) => void
}
```

**Idiomas** (`LanguageContext`):
```typescript
{
  language: "es" | "en" | "fr" | "hi" | "zh",
  setLanguage: (lang) => void,
  t: (key: string) => string
}
```

**Usuarios** (`UserContext`):
```typescript
{
  currentUser: User,
  setCurrentUser: (user) => void,
  users: User[],
  canViewModule: (moduleId) => boolean,
  isReadOnly: (moduleId) => boolean
}
```

---

## 📈 CONCLUSIONES Y RECOMENDACIONES

### ✅ Fortalezas del Proyecto

1. **🏗️ Arquitectura Sólida**: Clean Architecture con separación clara de responsabilidades
2. **🎨 UI/UX Excelente**: Componentes modernos, accesibles y responsivos
3. **🌍 I18n Completa**: Soporte robusto para múltiples idiomas
4. **🎨 Temas Avanzados**: Sistema flexible con personalización
5. **🔐 Permisos Granulares**: Control de acceso por roles y módulos
6. **⚡ Performance Optimizada**: Next.js 15 con mejores prácticas

### 🔧 Tecnologías Clave Implementadas

- **Next.js 15** con App Router
- **TypeScript** para type safety
- **Radix UI** para componentes accesibles
- **Tailwind CSS** con CSS Variables
- **Context API** para gestión de estado
- **Lucide React** para iconografía
- **Class Variance Authority** para variantes de componentes

### 📋 Funcionalidades Principales

1. **Sidebar Inteligente**: Navegación jerárquica con permisos
2. **Modal de Configuración**: Administración completa de ajustes
3. **Sistema de Temas**: 3 temas + personalización de colores
4. **Internacionalización**: 5 idiomas con traducciones completas
5. **Gestión de Usuarios**: Roles y permisos granulares
6. **Componentes UI**: Librería completa basada en Radix UI

Este proyecto representa un excelente ejemplo de aplicación empresarial moderna con todas las mejores prácticas de desarrollo frontend implementadas.

---

<div align="center">

**📊 Desarrollado con Next.js 15 + TypeScript + Radix UI + Tailwind CSS**

*Sistema de Gestión Legal Corporativa - PROBO UI*

</div>