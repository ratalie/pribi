# 🔄 COMPARACIÓN: React (probo-figma-ai) vs Nuxt (probo-frontend-v3-area-2)

**Fecha:** $(date)  
**Objetivo:** Comparar la estructura del MainSidebar de React con el sistema actual de Nuxt

---

## 📊 ESTRUCTURA JERÁRQUICA

### React (probo-figma-ai)

```
MainSidebar (Layout Global)
├─ Header: Logo + "PROBO"
├─ Body:
│   ├─ NavSection "Registro Societario" (Nivel 1 - Con Icono)
│   │   ├─ NavSubSection "Sociedades" (Nivel 2 - Con Icono)
│   │   │   ├─ NavSubItem "Dashboard" (Nivel 3 - Sin Icono)
│   │   │   ├─ NavSubItem "Historial" (Nivel 3 - Sin Icono)
│   │   │   └─ NavSubItem "Crear Sociedad" (Nivel 3 - Sin Icono)
│   │   └─ NavSubSection "Sucursales" (Nivel 2 - Con Icono)
│   │       ├─ NavSubItem "Dashboard" (Nivel 3 - Sin Icono)
│   │       ├─ NavSubItem "Historial" (Nivel 3 - Sin Icono)
│   │       └─ NavSubItem "Crear Sucursal" (Nivel 3 - Sin Icono)
│   └─ NavSection "Operaciones" (Nivel 1 - Con Icono)
│       └─ NavSubSection "Junta de Accionistas" (Nivel 2 - Con Icono)
│           ├─ NavSubItem "Dashboard" (Nivel 3 - Sin Icono)
│           ├─ NavSubItem "Historial" (Nivel 3 - Sin Icono)
│           └─ NavSubItem "Crear Junta" (Nivel 3 - Sin Icono)
└─ Footer: User Profile
```

### Nuxt (Actual)

```
ProboSidebar (Sidebar Principal)
├─ Secciones desde navigation.ts
│   ├─ "Registros" (Nivel 1 - Con Icono)
│   │   ├─ "Sociedades" (Nivel 2 - Con Icono)
│   │   │   ├─ "Dashboard" (Nivel 3 - Sin Icono)
│   │   │   ├─ "Agregar sociedad" (Nivel 3 - Sin Icono)
│   │   │   └─ "Historial" (Nivel 3 - Sin Icono)
│   │   └─ "Sucursales" (Nivel 2 - Con Icono)
│   │       ├─ "Dashboard" (Nivel 3 - Sin Icono)
│   │       ├─ "Agregar sucursal" (Nivel 3 - Sin Icono)
│   │       └─ "Historial" (Nivel 3 - Sin Icono)
│   └─ "Operaciones" (Nivel 1 - Con Icono)
│       └─ "Junta de Accionistas" (Nivel 2 - Con Icono)
│           ├─ "Dashboard" (Nivel 3 - Sin Icono)
│           ├─ "Historial" (Nivel 3 - Sin Icono)
│           └─ "Crear Junta" (Nivel 3 - Sin Icono)
└─ (Footer opcional)
```

---

## 🎯 SIMILITUDES

### ✅ Estructura Idéntica

1. **3 Niveles:**

   - Nivel 1: Sección (con icono)
   - Nivel 2: Sub-Sección (con icono)
   - Nivel 3: Item (sin icono)

2. **Iconos:**

   - ✅ Nivel 1 y 2: Tienen iconos
   - ✅ Nivel 3: Sin iconos

3. **Colapsable:**

   - ✅ Secciones y Sub-Secciones son colapsables
   - ✅ Items no son colapsables

4. **Navegación:**
   - ✅ Misma estructura de items
   - ✅ Mismos labels (Dashboard, Historial, Crear)

---

## ⚠️ DIFERENCIAS CLAVE

### 1. Sistema de Navegación

#### React (State-Based)

```typescript
// MainSidebar.tsx
interface MainSidebarProps {
  currentView: MainView;
  onViewChange: (view: MainView) => void; // ← State-based
}

// Uso
<NavSubItem
  label="Dashboard"
  onClick={() => onViewChange("sociedades-dashboard")} // ← Cambia estado
  active={currentView === "sociedades-dashboard"}
/>;
```

**Características:**

- ❌ No usa URLs/rutas
- ✅ Cambia vistas condicionalmente
- ✅ Estado centralizado en componente padre

#### Nuxt (Routing-Based)

```typescript
// navigation.ts
{
  id: "sociedades-dashboard",
  label: "Dashboard",
  href: "/registros/sociedades/dashboard",  // ← URL real
}

// Uso en ProboSidebar
<NuxtLink :to="item.href">
  {{ item.label }}
</NuxtLink>
```

**Características:**

- ✅ Usa URLs/rutas reales
- ✅ Navegación basada en router de Nuxt
- ✅ URLs compartibles y bookmarkeables

---

### 2. Layout Global vs Layout Específico

#### React

```
App.tsx
└─ MainSidebar (siempre visible)
   └─ AppContent (cambia según currentView)
```

**Características:**

- ✅ MainSidebar es el layout global
- ✅ Todas las vistas están dentro del mismo layout
- ✅ Cambio de vista sin cambiar URL

#### Nuxt

```
app.vue (o default.vue)
└─ ProboSidebar (sidebar principal)
   └─ NuxtPage (páginas dinámicas)
      └─ Layout específico (registros, flow-layout, etc.)
```

**Características:**

- ✅ ProboSidebar es el sidebar principal
- ✅ Layouts específicos para diferentes secciones
- ✅ Cada página puede tener su propio layout

---

### 3. Mapeo de Vistas a Rutas

#### React

```typescript
// View IDs
type MainView =
  | "sociedades-dashboard"
  | "sociedades-historial"
  | "sociedades-crear"
  | "junta-dashboard"
  | "junta-historial"
  | "junta-crear";

// Mapeo manual (no existe aún)
// Necesita migración a Nuxt:
// 'sociedades-dashboard' → '/registros/sociedades/dashboard'
```

#### Nuxt

```typescript
// Rutas reales
const routes = {
  "sociedades-dashboard": "/registros/sociedades/dashboard",
  "sociedades-historial": "/registros/sociedades/historial",
  "sociedades-crear": "/registros/sociedades/agregar",
  "junta-dashboard": "/operaciones/junta-accionistas/dashboard",
  "junta-historial": "/operaciones/junta-accionistas/historico",
  "junta-crear": "/operaciones/junta-accionistas/seleccion-agenda",
};
```

---

## 📋 MAPEO COMPLETO: View IDs → Rutas Nuxt

### Registro Societario → Sociedades

| View ID (React)        | Ruta Nuxt                         | Estado    |
| ---------------------- | --------------------------------- | --------- |
| `sociedades-dashboard` | `/registros/sociedades/dashboard` | ✅ Existe |
| `sociedades-historial` | `/registros/sociedades/historial` | ✅ Existe |
| `sociedades-crear`     | `/registros/sociedades/agregar`   | ✅ Existe |

### Registro Societario → Sucursales

| View ID (React)        | Ruta Nuxt                         | Estado    |
| ---------------------- | --------------------------------- | --------- |
| `sucursales-dashboard` | `/registros/sucursales/dashboard` | ✅ Existe |
| `sucursales-historial` | `/registros/sucursales/historial` | ✅ Existe |
| `sucursales-crear`     | `/registros/sucursales/agregar`   | ✅ Existe |

### Operaciones → Junta de Accionistas

| View ID (React)   | Ruta Nuxt                                         | Estado    |
| ----------------- | ------------------------------------------------- | --------- |
| `junta-dashboard` | `/operaciones/junta-accionistas/dashboard`        | ✅ Existe |
| `junta-historial` | `/operaciones/junta-accionistas/historico`        | ✅ Existe |
| `junta-crear`     | `/operaciones/junta-accionistas/seleccion-agenda` | ✅ Existe |

### Operaciones → Directorio

| View ID (React)        | Ruta Nuxt                           | Estado       |
| ---------------------- | ----------------------------------- | ------------ |
| `directorio-dashboard` | `/operaciones/directorio/dashboard` | ⚠️ Verificar |
| `directorio-historial` | `/operaciones/directorio/historico` | ⚠️ Verificar |
| `directorio-crear`     | `/operaciones/directorio/crear`     | ⚠️ Verificar |

---

## 🔄 MIGRACIÓN: React → Nuxt

### Paso 1: Mapear View IDs a Rutas

```typescript
// app/config/view-to-route-map.ts
export const VIEW_TO_ROUTE_MAP: Record<MainView, string> = {
  // Registro Societario → Sociedades
  "sociedades-dashboard": "/registros/sociedades/dashboard",
  "sociedades-historial": "/registros/sociedades/historial",
  "sociedades-crear": "/registros/sociedades/agregar",

  // Registro Societario → Sucursales
  "sucursales-dashboard": "/registros/sucursales/dashboard",
  "sucursales-historial": "/registros/sucursales/historial",
  "sucursales-crear": "/registros/sucursales/agregar",

  // Operaciones → Junta de Accionistas
  "junta-dashboard": "/operaciones/junta-accionistas/dashboard",
  "junta-historial": "/operaciones/junta-accionistas/historico",
  "junta-crear": "/operaciones/junta-accionistas/seleccion-agenda",

  // Operaciones → Directorio
  "directorio-dashboard": "/operaciones/directorio/dashboard",
  "directorio-historial": "/operaciones/directorio/historico",
  "directorio-crear": "/operaciones/directorio/crear",

  // Repositorio
  repository: "/storage/almacen",
  "documentos-generados": "/storage/documentos-generados",

  // Espacios de Trabajo
  "espacios-trabajo": "/features/espacios-trabajo",

  // Herramientas
  chat: "/features/chat-ia",

  // Admin
  "admin-panel": "/admin/panel",
};
```

### Paso 2: Convertir onClick a NuxtLink

**React:**

```tsx
<NavSubItem label="Dashboard" onClick={() => onViewChange("sociedades-dashboard")} />
```

**Nuxt:**

```vue
<NuxtLink to="/registros/sociedades/dashboard">
  Dashboard
</NuxtLink>
```

---

## 📐 ESPECIFICACIONES VISUALES

### React (MainSidebar)

```typescript
// Dimensiones
width: '280px',
maxWidth: '300px',
height: '100vh',

// Tema
backgroundColor: 'var(--primary-800)',  // Dark theme
color: 'white',

// Estados
hover: 'bg-white/5',
active: 'bg-white/10',
disabled: 'text-white/30',
```

### Nuxt (ProboSidebar)

**Necesito verificar:**

- ¿Usa el mismo dark theme?
- ¿Mismas dimensiones?
- ¿Mismos estados?

---

## ✅ CHECKLIST DE HOMOGENIZACIÓN

### Estructura

- [x] 3 niveles (Sección → Sub-Sección → Item)
- [x] Iconos solo en Nivel 1 y 2
- [x] Items sin iconos (Nivel 3)

### Navegación

- [ ] Mapear todos los View IDs a rutas Nuxt
- [ ] Verificar que todas las rutas existen
- [ ] Implementar navegación basada en rutas

### Visual

- [ ] Verificar tema dark (`var(--primary-800)`)
- [ ] Verificar dimensiones (280px width)
- [ ] Verificar estados (hover, active, disabled)

### Funcionalidad

- [ ] Colapsar/expandir secciones
- [ ] Detección de ruta activa
- [ ] Footer con perfil de usuario

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Documentación completada
2. ⏳ Verificar ProboSidebar actual (dimensiones, tema, estados)
3. ⏳ Comparar visualmente con MainSidebar de React
4. ⏳ Homogenizar si es necesario
5. ⏳ Implementar sidebar global basado en rutas

---

**¿Quieres que verifique el ProboSidebar actual para comparar visualmente?** 🚀
