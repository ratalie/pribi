# 🎯 ANÁLISIS Y PLAN: Sidebar-Juntas

**Fecha:** $(date)  
**Fuente:** MainSidebar Audit de probo-figma-ai + Documentación del proyecto  
**Objetivo:** Crear `sidebar-juntas` basado en rutas y configuración

---

## 📊 INFORMACIÓN DEL AUDIT

### MainSidebar - Especificaciones Visuales

#### Dimensiones
- **Width:** 280px (Fixed)
- **Max Width:** 300px
- **Height:** 100vh (Full screen height)

#### Tema y Colores
- **Background:** `var(--primary-800)` (Deep Blue/Purple brand color)
- **Text Color:** White (#FFFFFF)
- **Typography:**
  - Headers: `var(--font-primary)`
  - Items: `var(--font-secondary)`

#### Estados Interactivos
- **Hover:** `bg-white/5` (5% opacity white overlay)
- **Active/Selected:** `bg-white/10` (10% opacity) o `bg-white/15` para sub-items
- **Disabled:** `text-white/30` con `cursor-not-allowed`

#### Estructura
- **Header:** Logo (Shield Icon con gradient) + App Name ("PROBO")
- **Body:** Área scrolleable (`flex-1 overflow-y-auto`) con secciones de navegación
- **Footer:** Tarjeta de perfil de usuario con Dropdown Menu

---

## 🗂️ JERARQUÍA DE NAVEGACIÓN (3 NIVELES)

### Estructura del MainSidebar

```
MainSidebar
├── Header (Logo + PROBO)
├── Body (Navegación)
│   ├── Section (Nivel 1) - Colapsable
│   │   ├── Sub-Section (Nivel 2) - Colapsable
│   │   │   └── Item (Nivel 3) - Clickable
│   │   └── Item (Nivel 2) - Clickable
│   └── Item Principal (Nivel 1) - Clickable
└── Footer (User Profile)
```

### Mapeo de Items para Juntas

Según el audit, el MainSidebar tiene:

**Operaciones → Junta de Accionistas:**
- Dashboard → `junta-dashboard`
- Historial → `junta-historial`
- Crear Junta → `junta-crear`

---

## 🔄 MIGRACIÓN A NUXT 4

### Estado Actual (probo-figma-ai)
- Usa **state-based navigation** (`onViewChange: (view: MainView) => void`)
- No usa URLs/rutas
- Cambia vistas condicionalmente

### Estado Deseado (probo-frontend-v3-area-2)
- Usar **routing de Nuxt 4** (`<NuxtLink>`)
- Mapear View IDs a rutas reales
- Navegación basada en URLs

### Mapeo de Rutas

```typescript
// Mapeo de View IDs a Rutas Nuxt
const ROUTE_MAP = {
  // Juntas
  'junta-dashboard': '/operaciones/junta-accionistas/dashboard',
  'junta-historial': '/operaciones/junta-accionistas/historico',
  'junta-crear': '/operaciones/junta-accionistas/seleccion-agenda',
  
  // Otras secciones (para referencia)
  'sociedades-dashboard': '/registro-societario/sociedades/dashboard',
  'sucursales-dashboard': '/registro-societario/sucursales',
  // ...
};
```

---

## 🎨 DISEÑO DEL SIDEBAR-JUNTAS

### Opción 1: Sidebar Simple (Solo Navegación de Juntas)

```
┌─────────────────────────┐
│ 🛡️ PROBO                │
├─────────────────────────┤
│ Junta de Accionistas    │
│  ├─ Dashboard           │
│  ├─ Historial           │
│  └─ Crear Junta         │
│                         │
│ [Otros items...]        │
└─────────────────────────┘
```

### Opción 2: Sidebar Contextual (Basado en Ruta Actual)

```
┌─────────────────────────┐
│ 🛡️ PROBO                │
├─────────────────────────┤
│ Junta de Accionistas    │
│  ├─ Dashboard           │
│  ├─ Historial           │
│  └─ Crear Junta ▾       │
│     ├─ Selección Agenda │
│     ├─ Detalles         │
│     ├─ Instalación       │
│     └─ Puntos Acuerdo   │
└─────────────────────────┘
```

**Ventaja:** Muestra sub-rutas cuando estás dentro del flujo de crear junta.

---

## 📋 PLAN DE IMPLEMENTACIÓN

### Fase 1: Crear Estructura Base

#### 1.1 Componente Principal
```
app/components/sidebar-juntas/SidebarJuntas.vue
```

**Características:**
- Diseño dark theme (como MainSidebar)
- Width: 280px fixed
- Header con logo PROBO
- Body scrolleable
- Footer con perfil de usuario (opcional)

#### 1.2 Configuración de Rutas
```
app/config/sidebar-juntas.config.ts
```

**Estructura:**
```typescript
export interface SidebarJuntasItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
  children?: SidebarJuntasItem[];
}

export const sidebarJuntasConfig: SidebarJuntasItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    route: '/operaciones/junta-accionistas/dashboard',
    icon: 'LayoutDashboard'
  },
  {
    id: 'historial',
    label: 'Historial',
    route: '/operaciones/junta-accionistas/historico',
    icon: 'History'
  },
  {
    id: 'crear',
    label: 'Crear Junta',
    route: '/operaciones/junta-accionistas/seleccion-agenda',
    icon: 'Plus',
    children: [
      {
        id: 'seleccion-agenda',
        label: 'Selección de Agenda',
        route: '/operaciones/junta-accionistas/seleccion-agenda'
      },
      {
        id: 'detalles',
        label: 'Detalles',
        route: '/operaciones/junta-accionistas/detalles'
      },
      // ... más sub-rutas
    ]
  }
];
```

### Fase 2: Integración con Rutas

#### 2.1 Detección de Ruta Actual
```typescript
// En SidebarJuntas.vue
const route = useRoute();
const currentPath = computed(() => route.path);

// Determinar item activo
const isActive = (itemRoute: string) => {
  return currentPath.value.startsWith(itemRoute);
};
```

#### 2.2 Navegación con NuxtLink
```vue
<template>
  <NuxtLink 
    :to="item.route"
    :class="[
      'sidebar-item',
      { 'active': isActive(item.route) }
    ]"
  >
    {{ item.label }}
  </NuxtLink>
</template>
```

### Fase 3: Generación Dinámica desde FlowConfig

#### 3.1 Leer FlowConfig de Juntas
```typescript
import { juntaAccionistasFlowConfig } from '~/config/flows/junta-accionistas.flow';

// Convertir FlowConfig a estructura de sidebar
const sidebarItems = computed(() => {
  return buildSidebarFromFlowConfig(juntaAccionistasFlowConfig);
});
```

#### 3.2 Función de Conversión
```typescript
function buildSidebarFromFlowConfig(flowConfig: FlowConfig): SidebarJuntasItem[] {
  // Convertir items del flow a items del sidebar
  // Mantener jerarquía (nivel 0, 1, 2, 3, 4)
  // Mapear rutas correctamente
}
```

### Fase 4: Layout para Páginas de Juntas

#### 4.1 Crear Layout
```
app/layouts/sidebar-juntas-layout.vue
```

**Estructura:**
```vue
<template>
  <div class="sidebar-juntas-layout">
    <!-- Sidebar izquierdo -->
    <SidebarJuntas />
    
    <!-- Contenido principal -->
    <main class="content-area">
      <NuxtPage />
    </main>
  </div>
</template>
```

#### 4.2 Aplicar a Páginas
```typescript
// En cada página de juntas
definePageMeta({
  layout: 'sidebar-juntas-layout'
});
```

---

## 🎯 DECISIONES DE DISEÑO

### 1. ¿Sidebar Simple o Contextual?

**Recomendación:** **Sidebar Contextual**

**Razón:**
- Muestra sub-rutas cuando estás dentro del flujo
- Mejor UX para navegación compleja
- Similar al comportamiento del MainSidebar original

### 2. ¿Usar FlowConfig o Config Manual?

**Recomendación:** **Híbrido**

**Razón:**
- Leer estructura base desde FlowConfig
- Permitir override manual para items especiales (Dashboard, Historial)
- Flexibilidad para agregar items no relacionados con el flow

### 3. ¿Estilo del MainSidebar o Simplificado?

**Recomendación:** **Estilo del MainSidebar**

**Razón:**
- Consistencia visual con el diseño original
- Dark theme profesional
- Ya está especificado en el audit

---

## 📐 ESPECIFICACIONES TÉCNICAS

### Componentes Necesarios

1. **SidebarJuntas.vue** (Principal)
   - Header con logo
   - Body con navegación
   - Footer opcional

2. **SidebarJuntasItem.vue** (Item individual)
   - Maneja estados (active, hover, disabled)
   - Soporta iconos
   - Soporta children (sub-items)

3. **SidebarJuntasSection.vue** (Sección colapsable)
   - Toggle expand/collapse
   - Muestra children cuando expandido

### Estilos

```css
.sidebar-juntas {
  width: 280px;
  max-width: 300px;
  height: 100vh;
  background-color: var(--primary-800);
  color: white;
  font-family: var(--font-primary);
}

.sidebar-item {
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}

.sidebar-item.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Estructura Base
- [ ] Crear `app/components/sidebar-juntas/SidebarJuntas.vue`
- [ ] Crear `app/config/sidebar-juntas.config.ts`
- [ ] Implementar diseño dark theme
- [ ] Agregar header con logo PROBO

### Fase 2: Navegación
- [ ] Integrar con `useRoute()` para detección de ruta actual
- [ ] Implementar `<NuxtLink>` para navegación
- [ ] Agregar estados visuales (active, hover)

### Fase 3: Integración con FlowConfig
- [ ] Crear función `buildSidebarFromFlowConfig()`
- [ ] Leer `juntaAccionistasFlowConfig`
- [ ] Convertir items del flow a items del sidebar
- [ ] Mantener jerarquía de niveles

### Fase 4: Layout
- [ ] Crear `app/layouts/sidebar-juntas-layout.vue`
- [ ] Integrar SidebarJuntas en el layout
- [ ] Aplicar layout a páginas de juntas (opcional, por ahora mantener `dual-panel-layout`)

### Fase 5: Testing
- [ ] Verificar navegación entre rutas
- [ ] Verificar estados visuales (active, hover)
- [ ] Verificar responsive (si aplica)
- [ ] Verificar integración con FlowConfig

---

## 🚀 PRÓXIMOS PASOS

1. **Crear estructura base del componente**
2. **Implementar navegación básica**
3. **Integrar con FlowConfig**
4. **Crear layout**
5. **Aplicar a páginas (cuando esté listo)**

---

## 📝 NOTAS IMPORTANTES

1. **No modificar páginas aún** - Como se solicitó, las páginas mantienen `layout: "dual-panel-layout"` hasta que el nuevo sidebar esté listo
2. **Basarse en rutas** - El sidebar debe guiarse por las rutas reales del proyecto
3. **Usar FlowConfig** - Aprovechar la configuración existente de `junta-accionistas.flow.ts`
4. **Consistencia visual** - Seguir el diseño del MainSidebar del audit

---

**¿Listo para empezar la implementación?** 🚀

