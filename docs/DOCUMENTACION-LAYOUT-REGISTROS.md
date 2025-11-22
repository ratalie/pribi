# 📚 DOCUMENTACIÓN COMPLETA: Layout Registros

**Fecha:** $(date)  
**Objetivo:** Documentar el layout `registros`, sus páginas, rutas y estructura jerárquica

---

## 1️⃣ PÁGINAS QUE USAN EL LAYOUT "REGISTROS"

### Resumen Estadístico

- **Total de páginas:** ~36 archivos `.vue`
- **Ubicación:** `app/pages/registros/`
- **Estructura:** Sociedades y Sucursales

---

## 2️⃣ ESTRUCTURA DE RUTAS DISPONIBLES

### Nivel 1: Sección Principal

**Registros** (Sección principal)

### Nivel 2: Sub-Secciones (Con Iconos)

#### A. Sociedades

- **Icono:** `Building2`
- **Rutas disponibles:**
  - `/registros/sociedades/dashboard` - Dashboard
  - `/registros/sociedades/agregar` - Agregar sociedad
  - `/registros/sociedades/historial` - Historial de registros

#### B. Sucursales

- **Icono:** `MapPin` (según navigation.ts)
- **Rutas disponibles:**
  - `/registros/sucursales/dashboard` - Dashboard
  - `/registros/sucursales/agregar` - Agregar sucursal
  - `/registros/sucursales/historial` - Historial de registros

### Nivel 3: Items de Flujo (Sin Iconos)

Cuando entras a una sociedad específica (`/registros/sociedades/[id]/...`), tienes acceso a:

#### Flujo de Pasos (10 pasos):

1. **Datos principales** (`datos-sociedad`)

   - Ruta: `/registros/sociedades/[id]/datos-sociedad`
   - Ruta crear: `/registros/sociedades/crear/[id]/datos-sociedad`
   - Ruta editar: `/registros/sociedades/editar/[id]/datos-sociedad`

2. **Accionistas** (`accionistas`)

   - Ruta: `/registros/sociedades/[id]/accionistas`
   - Ruta crear: `/registros/sociedades/crear/[id]/accionistas`
   - Ruta editar: `/registros/sociedades/editar/[id]/accionistas`

3. **Capital Social y Acciones** (`acciones`)

   - Ruta: `/registros/sociedades/[id]/acciones`
   - Ruta crear: `/registros/sociedades/crear/[id]/acciones`
   - Ruta editar: `/registros/sociedades/editar/[id]/acciones`

4. **Asignación de Acciones** (`asignacion-acciones`)

   - Ruta: `/registros/sociedades/[id]/asignacion-acciones`
   - Ruta crear: `/registros/sociedades/crear/[id]/asignacion-acciones`
   - Ruta editar: `/registros/sociedades/editar/[id]/asignacion-acciones`

5. **Directorio** (`directorio`)

   - Ruta: `/registros/sociedades/[id]/directorio`
   - Ruta crear: `/registros/sociedades/crear/[id]/directorio`
   - Ruta editar: `/registros/sociedades/editar/[id]/directorio`

6. **Registro de Apoderados** (`registro-apoderados`)

   - Ruta: `/registros/sociedades/[id]/registro-apoderados`
   - Ruta crear: `/registros/sociedades/crear/[id]/registro-apoderados`
   - Ruta editar: `/registros/sociedades/editar/[id]/registro-apoderados`

7. **Régimen General de Poderes** (`regimen-poderes`)

   - Ruta: `/registros/sociedades/[id]/regimen-poderes`
   - Ruta crear: `/registros/sociedades/crear/[id]/regimen-poderes`
   - Ruta editar: `/registros/sociedades/editar/[id]/regimen-poderes`

8. **Quorums y Mayorías** (`quorums-mayorias`)

   - Ruta: `/registros/sociedades/[id]/quorums-mayorias`
   - Ruta crear: `/registros/sociedades/crear/[id]/quorums-mayorias`
   - Ruta editar: `/registros/sociedades/editar/[id]/quorums-mayorias`

9. **Acuerdos Societarios** (`acuerdos-societarios`)

   - Ruta: `/registros/sociedades/[id]/acuerdos-societarios`
   - Ruta crear: `/registros/sociedades/crear/[id]/acuerdos-societarios`
   - Ruta editar: `/registros/sociedades/editar/[id]/acuerdos-societarios`

10. **Resumen** (`resumen`)
    - Ruta: `/registros/sociedades/[id]/resumen`
    - Ruta crear: `/registros/sociedades/crear/[id]/resumen`
    - Ruta editar: `/registros/sociedades/editar/[id]/resumen`

---

## 3️⃣ CONFIGURACIÓN DEL LAYOUT REGISTROS

### Cómo se Configura

#### A. En las Páginas

```vue
<!-- app/pages/registros/sociedades/[id]/datos-sociedad.vue -->
<script setup lang="ts">
  definePageMeta({
    layout: "registros", // ← Layout base
    flowLayout: true, // ← Activa flow-layout anidado
  });
</script>
```

#### B. En el Layout

```vue
<!-- app/layouts/registros.vue -->
<script setup lang="ts">
  const route = useRoute();

  // Detectar qué layout anidar
  const isFlowLayout = computed(() => route.meta.flowLayout === true);
  const isFlowLayoutJuntas = computed(() => route.meta.flowLayoutJuntas === true);
</script>

<template>
  <div>
    <ProboSidebar />
    <!-- Sidebar principal -->
    <main>
      <!-- Layout para registros (sociedades) -->
      <NuxtLayout v-if="isFlowLayout" name="flow-layout">
        <slot />
      </NuxtLayout>

      <!-- Layout para juntas -->
      <NuxtLayout v-else-if="isFlowLayoutJuntas" name="flow-layout-juntas">
        <slot />
      </NuxtLayout>

      <!-- Sin layout anidado (dashboard, historial, etc.) -->
      <slot v-else />
    </main>
  </div>
</template>
```

---

## 4️⃣ ESTRUCTURA JERÁRQUICA (3 NIVELES)

### Nivel 1: Sección (Con Icono)

```
Registros
├─ Icono: (definido en navigation.ts)
└─ Colapsable: Sí
```

### Nivel 2: Sub-Sección (Con Icono)

```
Registros
└─ Sociedades
   ├─ Icono: Building2
   └─ Colapsable: Sí

└─ Sucursales
   ├─ Icono: MapPin
   └─ Colapsable: Sí
```

### Nivel 3: Items (Sin Icono)

```
Registros
└─ Sociedades
   ├─ Dashboard          (sin icono)
   ├─ Agregar sociedad   (sin icono)
   └─ Historial          (sin icono)

└─ Sucursales
   ├─ Dashboard          (sin icono)
   ├─ Agregar sucursal   (sin icono)
   └─ Historial          (sin icono)
```

**Nota:** Los items del flujo (10 pasos) aparecen en el `ProgressNavBar` del `flow-layout`, no en el sidebar principal.

---

## 5️⃣ RUTAS COMPLETAS DISPONIBLES

### Desde el Layout Registros, puedes navegar a:

#### A. Páginas de Nivel 2 (Dashboard/Historial/Agregar)

**Sociedades:**

- `/registros/sociedades/dashboard` ✅
- `/registros/sociedades/historial` ✅
- `/registros/sociedades/agregar` ✅

**Sucursales:**

- `/registros/sucursales/dashboard` ✅
- `/registros/sucursales/historial` ✅
- `/registros/sucursales/agregar` ✅

#### B. Páginas de Nivel 3 (Flujo de Pasos)

**Modo Editar (desde historial):**

- `/registros/sociedades/[id]/datos-sociedad`
- `/registros/sociedades/[id]/accionistas`
- `/registros/sociedades/[id]/acciones`
- `/registros/sociedades/[id]/asignacion-acciones`
- `/registros/sociedades/[id]/directorio`
- `/registros/sociedades/[id]/registro-apoderados`
- `/registros/sociedades/[id]/regimen-poderes`
- `/registros/sociedades/[id]/quorums-mayorias`
- `/registros/sociedades/[id]/acuerdos-societarios`
- `/registros/sociedades/[id]/resumen`

**Modo Crear:**

- `/registros/sociedades/crear/[id]/datos-sociedad`
- `/registros/sociedades/crear/[id]/accionistas`
- `/registros/sociedades/crear/[id]/acciones`
- `/registros/sociedades/crear/[id]/asignacion-acciones`
- `/registros/sociedades/crear/[id]/directorio`
- `/registros/sociedades/crear/[id]/registro-apoderados`
- `/registros/sociedades/crear/[id]/regimen-poderes`
- `/registros/sociedades/crear/[id]/quorums-mayorias`
- `/registros/sociedades/crear/[id]/acuerdos-societarios`
- `/registros/sociedades/crear/[id]/resumen`

**Modo Editar (ruta alternativa):**

- `/registros/sociedades/editar/[id]/datos-sociedad`
- `/registros/sociedades/editar/[id]/accionistas`
- `/registros/sociedades/editar/[id]/acciones`
- `/registros/sociedades/editar/[id]/asignacion-acciones`
- `/registros/sociedades/editar/[id]/directorio`
- `/registros/sociedades/editar/[id]/registro-apoderados`
- `/registros/sociedades/editar/[id]/regimen-poderes`
- `/registros/sociedades/editar/[id]/quorums-mayorias`
- `/registros/sociedades/editar/[id]/acuerdos-societarios`
- `/registros/sociedades/editar/[id]/resumen`

---

## 6️⃣ CONFIGURACIÓN DE NAVEGACIÓN

### Archivo: `app/config/navigation.ts`

```typescript
{
  id: "registros",
  title: "Registros",
  items: [
    {
      id: "registros-sociedades",
      label: "Sociedades",
      icon: "Building2",  // ← Nivel 2 con icono
      hasSubmenu: true,
      submenuItems: [
        {
          id: "sociedades-dashboard",
          label: "Dashboard",
          // Sin icono en submenuItems (Nivel 3)
          href: "/registros/sociedades/dashboard",
        },
        {
          id: "sociedades-agregar",
          label: "Agregar sociedad",
          href: "/registros/sociedades/agregar",
        },
        {
          id: "sociedades-historial",
          label: "Historial de registros",
          href: "/registros/sociedades/historial",
        },
      ],
    },
    {
      id: "registros-sucursales",
      label: "Sucursales",
      icon: "MapPin",  // ← Nivel 2 con icono
      hasSubmenu: true,
      submenuItems: [
        // Sin iconos (Nivel 3)
      ],
    },
  ],
}
```

### Archivo: `app/config/society-register-navigation.ts`

Define los 10 pasos del flujo:

```typescript
const BASE_STEPS = [
  { slug: "datos-sociedad", title: "Datos principales", ... },
  { slug: "accionistas", title: "Accionistas", ... },
  { slug: "acciones", title: "Capital Social y Acciones", ... },
  { slug: "asignacion-acciones", title: "Asignación de Acciones", ... },
  { slug: "directorio", title: "Directorio", ... },
  { slug: "registro-apoderados", title: "Registro de Apoderados", ... },
  { slug: "regimen-poderes", title: "Régimen General de Poderes", ... },
  { slug: "quorums-mayorias", title: "Quorums y Mayorías", ... },
  { slug: "acuerdos-societarios", title: "Acuerdos Societarios", ... },
  { slug: "resumen", title: "Resumen", ... },
];
```

---

## 7️⃣ FLUJO DE NAVEGACIÓN

### Escenario 1: Usuario entra al Dashboard

```
1. Usuario hace click en "Sociedades" → "Dashboard"
2. Ruta: /registros/sociedades/dashboard
3. Layout: registros (sin flowLayout)
4. Renderiza: Dashboard con cards y estadísticas
```

### Escenario 2: Usuario crea nueva sociedad

```
1. Usuario hace click en "Sociedades" → "Agregar sociedad"
2. Ruta: /registros/sociedades/agregar
3. Layout: registros (sin flowLayout)
4. Renderiza: Página de onboarding
5. Usuario hace click en "Comenzar formulario guiado"
6. Se crea sociedad con ID y redirige a:
   /registros/sociedades/[id]/datos-sociedad
7. Layout: registros + flowLayout: true
8. Renderiza: flow-layout con ProgressNavBar + Formulario
```

### Escenario 3: Usuario edita sociedad existente

```
1. Usuario hace click en "Sociedades" → "Historial"
2. Ruta: /registros/sociedades/historial
3. Layout: registros (sin flowLayout)
4. Renderiza: Tabla con sociedades
5. Usuario hace click en menú → "Editar datos"
6. Redirige a: /registros/sociedades/[id]/datos-sociedad
7. Layout: registros + flowLayout: true
8. Renderiza: flow-layout con ProgressNavBar + Formulario precargado
```

---

## 8️⃣ COMPARACIÓN CON PROYECTO REACT (probo-figma-ai)

### Estructura en React

```typescript
// MainSidebar.tsx
<NavSection title="Registro Societario" icon={Building2}>
  <NavSubSection title="Sociedades" icon={Building2}>
    <NavSubItem label="Dashboard" /> // Sin icono
    <NavSubItem label="Historial" /> // Sin icono
    <NavSubItem label="Crear Sociedad" /> // Sin icono
  </NavSubSection>

  <NavSubSection title="Sucursales" icon={Building2}>
    <NavSubItem label="Dashboard" /> // Sin icono
    <NavSubItem label="Historial" /> // Sin icono
    <NavSubItem label="Crear Sucursal" /> // Sin icono
  </NavSubSection>
</NavSection>
```

### Estructura en Nuxt (Actual)

```typescript
// navigation.ts
{
  id: "registros",
  title: "Registros",
  items: [
    {
      id: "registros-sociedades",
      label: "Sociedades",
      icon: "Building2",  // ✅ Nivel 2 con icono
      submenuItems: [
        {
          label: "Dashboard",
          // ✅ Sin icono (Nivel 3)
        },
      ],
    },
  ],
}
```

### Similitudes ✅

1. **3 niveles:** Sección → Sub-Sección → Item
2. **Iconos:** Solo en Nivel 1 y 2, NO en Nivel 3
3. **Estructura:** Registro Societario → Sociedades/Sucursales → Items

### Diferencias ⚠️

1. **React:** Usa state-based navigation (`onViewChange`)
2. **Nuxt:** Usa routing real (`href` con URLs)
3. **React:** MainSidebar es el layout global
4. **Nuxt:** ProboSidebar es el sidebar principal, `registros` es un layout específico

---

## 9️⃣ MAPEO COMPLETO DE RUTAS

### Rutas de Nivel 2 (Desde Sidebar Principal)

| Item                   | Ruta                              | Layout      | FlowLayout |
| ---------------------- | --------------------------------- | ----------- | ---------- |
| Sociedades → Dashboard | `/registros/sociedades/dashboard` | `registros` | ❌         |
| Sociedades → Agregar   | `/registros/sociedades/agregar`   | `registros` | ❌         |
| Sociedades → Historial | `/registros/sociedades/historial` | `registros` | ❌         |
| Sucursales → Dashboard | `/registros/sucursales/dashboard` | `registros` | ❌         |
| Sucursales → Agregar   | `/registros/sucursales/agregar`   | `registros` | ❌         |
| Sucursales → Historial | `/registros/sucursales/historial` | `registros` | ❌         |

### Rutas de Nivel 3 (Flujo de Pasos)

| Paso | Slug                   | Ruta Base                     | Modo Crear    | Modo Editar    |
| ---- | ---------------------- | ----------------------------- | ------------- | -------------- |
| 1    | `datos-sociedad`       | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 2    | `accionistas`          | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 3    | `acciones`             | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 4    | `asignacion-acciones`  | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 5    | `directorio`           | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 6    | `registro-apoderados`  | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 7    | `regimen-poderes`      | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 8    | `quorums-mayorias`     | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 9    | `acuerdos-societarios` | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |
| 10   | `resumen`              | `/registros/sociedades/[id]/` | `crear/[id]/` | `editar/[id]/` |

**Todas las rutas de Nivel 3 usan:**

- Layout: `registros`
- FlowLayout: `true` (activan `flow-layout` anidado)

---

## 🔟 RESUMEN EJECUTIVO

### Páginas que Usan Layout "registros"

**Total:** ~36 páginas

**Categorías:**

1. **Dashboards:** 2 páginas (sociedades, sucursales)
2. **Historiales:** 2 páginas (sociedades, sucursales)
3. **Agregar:** 2 páginas (sociedades, sucursales)
4. **Flujo de Pasos:** ~30 páginas (10 pasos × 3 modos: crear/editar/[id])

### Configuración

**Layout Base:** `app/layouts/registros.vue`

- Siempre incluye `ProboSidebar`
- Detecta flags para layouts anidados:
  - `flowLayout: true` → `flow-layout` (registros)
  - `flowLayoutJuntas: true` → `flow-layout-juntas` (juntas)

### Estructura Jerárquica

```
Nivel 1: Registros (con icono)
  └─ Nivel 2: Sociedades/Sucursales (con icono)
     └─ Nivel 3: Dashboard/Historial/Agregar (sin icono)
```

**Los 10 pasos del flujo** aparecen en el `ProgressNavBar` del `flow-layout`, no en el sidebar principal.

---

## 1️⃣1️⃣ ANÁLISIS DEL PROBOSIDEBAR ACTUAL

### Estructura Actual

**Archivo:** `app/components/ProboSidebar.vue`

**Características:**

- ✅ Usa `navigationSections` de `app/config/navigation.ts`
- ✅ Soporta 3 niveles (Sección → Item → SubItem)
- ✅ Colapsable (secciones e items)
- ✅ Navegación con `NuxtLink` (routing real)
- ✅ Detección de ruta activa (`isActive`)
- ✅ Footer con `UserDropdownMenu`

### Iconos

**Nivel 1 (Sección):**

- ❌ No muestra icono (solo texto)

**Nivel 2 (Item con submenu):**

- ✅ Muestra icono (`item.icon`)
- ✅ Tamaño: `w-5 h-5`

**Nivel 3 (SubItem):**

- ✅ Muestra icono (`subItem.icon`) - **PERO según navigation.ts NO tiene iconos**
- ✅ Tamaño: `w-4 h-4`

**⚠️ DISCREPANCIA:** El código de ProboSidebar permite iconos en Nivel 3, pero `navigation.ts` no los define.

---

## 1️⃣2️⃣ RUTAS DISPONIBLES DESDE EL LAYOUT REGISTROS

### Si alguien entra al layout "registros", puede navegar a:

#### Desde ProboSidebar (Navegación Principal)

**Registros → Sociedades:**

- `/registros/sociedades/dashboard` ✅
- `/registros/sociedades/agregar` ✅
- `/registros/sociedades/historial` ✅

**Registros → Sucursales:**

- `/registros/sucursales/dashboard` ✅
- `/registros/sucursales/agregar` ✅
- `/registros/sucursales/historial` ✅

#### Desde ProgressNavBar (Flujo de Pasos)

Cuando estás en una sociedad (`/registros/sociedades/[id]/...`):

**10 Pasos del Flujo:**

1. `/registros/sociedades/[id]/datos-sociedad`
2. `/registros/sociedades/[id]/accionistas`
3. `/registros/sociedades/[id]/acciones`
4. `/registros/sociedades/[id]/asignacion-acciones`
5. `/registros/sociedades/[id]/directorio`
6. `/registros/sociedades/[id]/registro-apoderados`
7. `/registros/sociedades/[id]/regimen-poderes`
8. `/registros/sociedades/[id]/quorums-mayorias`
9. `/registros/sociedades/[id]/acuerdos-societarios`
10. `/registros/sociedades/[id]/resumen`

**Variantes:**

- Modo Crear: `/registros/sociedades/crear/[id]/...`
- Modo Editar: `/registros/sociedades/editar/[id]/...`
- Modo Directo: `/registros/sociedades/[id]/...`

---

## 📝 PRÓXIMOS PASOS

1. ✅ Documentación completada
2. ✅ Comparación con proyecto React (MainSidebar)
3. ⏳ Homogenizar estructura si es necesario
4. ⏳ Implementar sidebar global basado en rutas

---

**Documentación completa. ¿Quieres que continúe con la homogenización?** 🚀
