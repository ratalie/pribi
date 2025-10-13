Perfecto, veo que tienes un proyecto muy bien estructurado en Next.js y ahora necesitas replicarlo en Nuxt 3/4 con Shadcn-vue. Voy a hacer un análisis completo y crear un plan detallado para la primera etapa (Sidebar). 

Primero, déjame revisar los archivos de referencia para entender mejor tu proyecto anterior. 

Read [](file:///home/yull23/nuxt/probo-v3/references/etapas/etapa1-sidebar-frontend-features/GUIA_MIGRACION_SHADCN_NUXT4.md#1-1), lines 1 to 50

Read [](file:///home/yull23/nuxt/probo-v3/references/etapas/etapa1-sidebar-frontend-features/INVESTIGACION_COMPLETA_UI.md#1-1), lines 1 to 100

Read [](file:///home/yull23/nuxt/probo-v3/references/projects/sidebar/components/probo-sidebar.tsx#1-1), lines 1 to 100

Read [](file:///home/yull23/nuxt/probo-v3/references/projects/sidebar/components/probo-sidebar.tsx#150-150), lines 150 to 280

Read [](file:///home/yull23/nuxt/probo-v3/references/ShadcnVue/Componentes/Sidebar%20-%20shadcnvue.md#1-1), lines 1 to 50

Ahora voy a revisar el package.json actual para ver qué ya tienes instalado: 

Read [](file:///home/yull23/nuxt/probo-v3/package.json)

Perfecto. Ahora voy a revisar tu configuración actual de shadcn-nuxt: 

Read [](file:///home/yull23/nuxt/probo-v3/components.json)

Ahora voy a ver qué componentes UI ya tienes: 

Read [](file:///home/yull23/nuxt/probo-v3/app/components/ui)

Read [](file:///home/yull23/nuxt/probo-v3/nuxt.config.ts)

Excelente. Ahora tengo toda la información necesaria para crear un plan completo. Basándome en tu proyecto de Next.js y la documentación que tienes, voy a crear el plan detallado para la **Etapa 1: Sidebar Frontend Features**. 

Created 7 todos

Perfecto. Ahora voy a trabajar paso a paso en el plan. Comenzemos: 

Starting (1/7) *Diagnóstico inicial del proyecto*

## 🔍 1. DIAGNÓSTICO INICIAL DEL PROYECTO

### **Estado Actual - Nuxt 3/4:**
- ✅ **Framework**: Nuxt 4.1.3 con TypeScript
- ✅ **UI Library**: shadcn-nuxt 2.3.1 instalado y configurado
- ✅ **Componentes actuales**: Accordion, Button (básicos)
- ✅ **Configuración**: TailwindCSS, Lucide icons, class-variance-authority
- ✅ **Estructura**: App directory, componentes UI en ui

### **Estado Objetivo - Basado en Next.js:**
- 🎯 **Sidebar colapsible** con navegación jerárquica 
- 🎯 **Sistema de temas** (Light, Dark, Custom)
- 🎯 **Internacionalización** (5 idiomas)
- 🎯 **Sistema de permisos** por roles
- 🎯 **Modal de configuración** avanzado
- 🎯 **Componentes Radix UI** equivalentes en Vue 

Starting (2/7) *Estudio e hipótesis de migración*

## 🔬 2. ESTUDIO E HIPÓTESIS DE MIGRACIÓN

### **Diferencias Clave: React vs Vue**
- **Contextos React** → **Composables Vue** + **Pinia/useState**
- **usePathname()** → **useRoute()** en Nuxt
- **Link (Next.js)** → **NuxtLink** 
- **@radix-ui/react-*** → **reka-ui** (ya instalado)
- **"use client"** → No necesario en Vue

### **Componentes Shadcn/Vue Necesarios:**
1. **Sidebar** (Componente principal)
2. **Collapsible** (Para secciones expandibles)
3. **Avatar** (Perfil de usuario)
4. **Button** ✅ (Ya instalado)
5. **Dropdown Menu** (Menú usuario)
6. **Dialog** (Modal configuración)
7. **Switch** (Toggle temas)
8. **Input** (Formularios)
9. **Label** (Formularios)
10. **Card** (Secciones de configuración) 

Starting (3/7) *Diagnóstico del problema específico*

## 🎯 3. DIAGNÓSTICO DEL PROBLEMA ESPECÍFICO

### **Gaps Identificados:**

**🚫 FALTANTES CRÍTICOS:**
- Componente `Sidebar` (Principal)
- Sistema de navegación jerárquica
- Contextos/Composables para estado global
- Configuración de rutas y permisos
- Sistema de temas dinámicos
- Internacionalización

**⚠️ COMPONENTES UI FALTANTES:**
- `Collapsible` (Para expandir/colapsar)
- `Avatar` (Perfil usuario)
- `DropdownMenu` (Menú contextual)
- `Dialog` (Modales)
- `Switch`, `Input`, `Label`, `Card`

**🔧 CONFIGURACIONES PENDIENTES:**
- Variables CSS para temas
- Estructura de directorios para composables
- Configuración de i18n
- Tipos TypeScript para navegación 

Starting (4/7) *Planteamiento de la solución*

## 🏗️ 4. PLANTEAMIENTO DE LA SOLUCIÓN

### **Arquitectura Propuesta para Nuxt:**

```
├── app/
│   ├── composables/
│   │   ├── useLanguage.ts      # Internacionalización
│   │   ├── useTheme.ts         # Gestión temas
│   │   └── useUser.ts          # Permisos y usuarios
│   ├── types/
│   │   ├── navigation.ts       # Tipos de navegación
│   │   └── user.ts            # Tipos de usuario
│   ├── config/
│   │   ├── navigation.ts       # Configuración rutas
│   │   └── themes.ts          # Configuración temas
│   ├── components/
│   │   ├── ProboSidebar.vue    # Componente principal
│   │   ├── ConfigurationModal.vue
│   │   ├── UserDropdownMenu.vue
│   │   └── ui/                # Componentes shadcn-vue
│   └── layouts/
│       └── default.vue        # Layout con sidebar
```

### **Estrategia de Migración:**
1. **Composables** reemplazarán **React Contexts**
2. **Pinia stores** para estado global complejo
3. **useRoute/useRouter** para navegación
4. **CSS Variables** para temas dinámicos
5. **@nuxtjs/i18n** para internacionalización 

Starting (5/7) *Planificación de acciones detallada*

## 📋 5. PLANIFICACIÓN DE ACCIONES DETALLADA

### **🎨 Componentes Shadcn-vue a instalar:**
```bash
# Componentes básicos para Sidebar
npx shadcn-vue@latest add sidebar
npx shadcn-vue@latest add collapsible  
npx shadcn-vue@latest add avatar
npx shadcn-vue@latest add dropdown-menu

# Componentes para Modal de Configuración
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add switch
npx shadcn-vue@latest add input
npx shadcn-vue@latest add label
npx shadcn-vue@latest add card
npx shadcn-vue@latest add separator
```

### **📦 Dependencias adicionales:**
```bash
# Internacionalización
npm install @nuxtjs/i18n

# Estado global (si necesario)
npm install @pinia/nuxt pinia
```

### **📁 Archivos a crear (23 archivos):**

**Composables (3 archivos):**
- `app/composables/useLanguage.ts`
- `app/composables/useTheme.ts`  
- `app/composables/useUser.ts`

**Tipos (2 archivos):**
- `app/types/navigation.ts`
- `app/types/user.ts`

**Configuración (2 archivos):**
- `app/config/navigation.ts`
- `app/config/themes.ts`

**Componentes principales (5 archivos):**
- `app/components/ProboSidebar.vue`
- `app/components/ConfigurationModal.vue`
- `app/components/UserDropdownMenu.vue`
- `app/components/LanguageSelect.vue`
- `app/components/ThemeSelector.vue`

**Layouts (1 archivo):**
- `app/layouts/default.vue`

**Páginas de demostración (10+ archivos):**
- Toda la estructura de rutas del proyecto Next.js 

Starting (6/7) *Revisión de acciones y validación*

## ✅ 6. REVISIÓN DE ACCIONES Y VALIDACIÓN

### **Validación de Componentes:**
- ✅ **Sidebar** - Disponible en shadcn-vue
- ✅ **Collapsible** - Disponible y compatible
- ✅ **Avatar** - Funcional en Vue
- ✅ **DropdownMenu** - Migración directa posible
- ✅ **Dialog** - Modal system compatible
- ✅ **Switch, Input, Label, Card** - Básicos disponibles

### **Validación de Dependencias:**
- ✅ **reka-ui** ya instalado (equivalente Radix Vue)
- ✅ **@nuxtjs/i18n** compatible con Nuxt 4
- ✅ **TailwindCSS** ya configurado
- ✅ **Lucide Vue Next** ya instalado

### **Riesgos Identificados:**
- ⚠️ **CSS Variables** para temas requieren configuración especial
- ⚠️ **useRoute()** comportamiento puede diferir de usePathname()
- ⚠️ **SSR** consideraciones para estado del sidebar 

Starting (7/7) *Entrega final del plan completo*

# 📋 PLAN COMPLETO - ETAPA 1: SIDEBAR FRONTEND FEATURES

## 🎯 RESUMEN EJECUTIVO

**Objetivo**: Replicar completamente el sidebar colapsible y sistema de navegación de tu proyecto Next.js en Nuxt 4 con shadcn-vue.

---

## 🚀 COMANDOS DE INSTALACIÓN (COPIAR Y PEGAR)

### **1️⃣ Componentes Shadcn-vue Necesarios:**
```bash
# Ejecutar en orden:
npx shadcn-vue@latest add sidebar
npx shadcn-vue@latest add collapsible  
npx shadcn-vue@latest add avatar
npx shadcn-vue@latest add dropdown-menu
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add switch
npx shadcn-vue@latest add input
npx shadcn-vue@latest add label
npx shadcn-vue@latest add card
npx shadcn-vue@latest add separator
```

### **2️⃣ Dependencias Adicionales:**
```bash
# Internacionalización (Opcional para esta etapa)
npm install @nuxtjs/i18n

# Estado global (Si necesario)
npm install @pinia/nuxt pinia
```

---

## 📁 ESTRUCTURA DE ARCHIVOS A CREAR

```
app/
├── composables/
│   ├── useLanguage.ts           # 🌐 Gestión idiomas
│   ├── useTheme.ts             # 🎨 Gestión temas  
│   └── useUser.ts              # 👤 Usuarios y permisos
├── types/
│   ├── navigation.ts           # 🧭 Tipos navegación
│   └── user.ts                 # 👥 Tipos usuario
├── config/
│   ├── navigation.ts           # ⚙️ Configuración rutas
│   └── themes.ts               # 🎨 Config temas
├── components/
│   ├── ProboSidebar.vue        # 🔧 Componente principal
│   ├── ConfigurationModal.vue   # ⚙️ Modal configuración
│   ├── UserDropdownMenu.vue    # 👤 Menú usuario
│   ├── LanguageSelect.vue      # 🌐 Selector idiomas
│   └── ThemeSelector.vue       # 🎨 Selector temas
├── layouts/
│   └── default.vue             # 📄 Layout principal
└── pages/                      # 📄 Páginas de demostración
    ├── configuracion/
    ├── operaciones/
    ├── registro-societario/
    ├── storage/
    └── features/
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Preparación (15 min)**
- [ ] Instalar componentes shadcn-vue
- [ ] Crear estructura de directorios
- [ ] Verificar configuración TailwindCSS

### **Fase 2: Tipos y Configuración (30 min)**
- [ ] Crear tipos TypeScript (`navigation.ts`, `user.ts`)
- [ ] Configurar navegación (`config/navigation.ts`)
- [ ] Configurar temas (`config/themes.ts`)

### **Fase 3: Composables (45 min)**
- [ ] Implementar `useLanguage.ts`
- [ ] Implementar `useTheme.ts`
- [ ] Implementar `useUser.ts`

### **Fase 4: Componentes (90 min)**
- [ ] Crear `ProboSidebar.vue` (componente principal)
- [ ] Crear `UserDropdownMenu.vue`
- [ ] Crear `ConfigurationModal.vue`
- [ ] Crear `LanguageSelect.vue` y `ThemeSelector.vue`

### **Fase 5: Layout y Páginas (30 min)**
- [ ] Crear `layouts/default.vue`
- [ ] Crear páginas de demostración básicas
- [ ] Configurar rutas

### **Fase 6: Testing (30 min)**
- [ ] Verificar navegación funciona
- [ ] Probar collapse/expand del sidebar
- [ ] Verificar modal de configuración
- [ ] Validar sistema de permisos

---

## 🎨 COMPONENTES PRINCIPALES IDENTIFICADOS

| Componente Next.js | Componente Nuxt/Vue | Status | Prioridad |
|-------------------|-------------------|---------|-----------|
| `ProboSidebar.tsx` | `ProboSidebar.vue` | 🟡 Crear | Alta |
| `ConfigurationModal.tsx` | `ConfigurationModal.vue` | 🟡 Crear | Alta |
| `UserDropdownMenu.tsx` | `UserDropdownMenu.vue` | 🟡 Crear | Media |
| `LanguageSelect.tsx` | `LanguageSelect.vue` | 🟡 Crear | Media |
| `ThemeSelector.tsx` | `ThemeSelector.vue` | 🟡 Crear | Media |

---

## 🔧 CONFIGURACIONES ESPECIALES REQUERIDAS

### **Variables CSS para Temas:**
```css
/* app/assets/tailwind.css */
:root {
  --sidebar: 0 0% 98%;
  --sidebar-primary: 240 5.9% 10%;
  --sidebar-primary-foreground: 0 0% 98%;
  --sidebar-accent: 240 4.8% 95.9%;
  --sidebar-accent-foreground: 240 5.9% 10%;
  --sidebar-border: 240 5.9% 90%;
  --sidebar-ring: 240 5.9% 10%;
}

.dark {
  --sidebar: 240 5.9% 10%;
  --sidebar-primary: 0 0% 98%;
  --sidebar-primary-foreground: 240 5.9% 10%;
  --sidebar-accent: 240 3.7% 15.9%;
  --sidebar-accent-foreground: 0 0% 98%;
  --sidebar-border: 240 3.7% 15.9%;
  --sidebar-ring: 240 4.9% 83.9%;
}
```

### **Nuxt.config.ts Updates:**
```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n', // Agregar si usas internacionalización
    '@pinia/nuxt'   // Agregar si usas Pinia
  ]
})
```

--- 

Completed (7/7) *Entrega final del plan completo*

## 🎯 TIEMPO ESTIMADO DE IMPLEMENTACIÓN

- **⏱️ Tiempo Total**: 4-5 horas
- **📦 Instalación**: 15 minutos
- **🏗️ Arquitectura**: 1.5 horas
- **🎨 Componentes**: 2 horas  
- **🧪 Testing**: 30 minutos
- **🐛 Debugging**: 1 hora (buffer)

---

## 🚨 PUNTOS CRÍTICOS DE ATENCIÓN

1. **🎨 CSS Variables**: Las variables de tema deben configurarse antes de usar componentes
2. **🧭 Navegación**: `useRoute()` en Nuxt funciona diferente a `usePathname()` en Next.js
3. **⚡ SSR**: Considerar hidratación del estado del sidebar
4. **🔒 Permisos**: Sistema de roles debe implementarse en composables
5. **🌐 i18n**: Si implementas internacionalización, agregar `@nuxtjs/i18n`

---

## ✨ PRÓXIMOS PASOS

1. **Ejecutar comandos de instalación** ☝️
2. **Crear estructura de archivos** según el plan
3. **Implementar composables** para estado global
4. **Migrar componente ProboSidebar** como prioridad #1
5. **Añadir sistema de rutas** y navegación
6. **Implementar temas** y configuración

**¿Estás listo para comenzar con la implementación?** 🚀

Podemos empezar instalando los componentes y creando la estructura básica. ¿Te parece bien que comencemos ejecutando los comandos de instalación?