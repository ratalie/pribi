# 🔬 INVESTIGACIÓN COMPLETA: Problemas de Sidebar en Juntas y Sucursales

**Fecha:** 2025-11-03  
**Estado:** 🔴 ANÁLISIS COMPLETO  
**Contexto:** TODO-003 - Sistema Dual de Sidebars

---

## 1️⃣ DIAGNÓSTICO INICIAL

### 🔴 Problema 1: Juntas - Falta RightSidebar (Nivel 3-4)

**Síntoma reportado:**

- "Solo se muestra el sidebar izquierdo, no el derecho"
- "Los hijos nivel 3, 4 deberían verse del lado derecho"
- "Distribución está bien, pero falta el sidebar derecho"

**Ubicación:** `/operaciones/junta-accionistas/aporte-dinerario`

### 🔴 Problema 2: Sucursales - Pierde Sidebars al Navegar

**Síntoma reportado:**

- "Al navegar a `/registro-societario/sucursales/acciones`, desaparece el sidebar"
- "Solo veo la ruta, no hay sidebar izquierdo ni derecho"
- "Aparece solo el sidebar global (ProboSidebar)"

**Ubicación:** `/registro-societario/sucursales/acciones` (y otras páginas)

---

## 2️⃣ ESTUDIO E HIPÓTESIS

### 🔍 Análisis del Sistema Actual

#### **Sistema Diseñado (Teórico):**

```
sidebar-general.vue layout:
├─ SidebarGeneral (izquierdo)
│  ├─ ProboSidebar content (navegación global)
│  └─ SidebarFlow (opcional - navegación de flujo) ← PROBLEMA 1
└─ Main Content
   └─ RightSidebar (nivel 3-4) ← PROBLEMA 1: ¡NO EXISTE!
```

#### **Problema Identificado:**

El diseño actual tiene **SOLO 2 sidebars**:

1. **SidebarGeneral** (izquierdo) - Navegación global
2. **SidebarFlow** (también izquierdo) - Navegación de flujo (dentro de SidebarGeneral)

**NO existe un tercer sidebar (derecho) para items Nivel 3-4.**

### 🧠 Hipótesis Formuladas

#### **Hipótesis 1: Arquitectura Incompleta**

**Descripción:** El sistema actual no contempla un RightSidebar separado.

**Evidencia:**

- `SidebarGeneral.vue` solo renderiza: `<SidebarGeneral>` + `<SidebarFlow>`
- No hay componente `RightSidebar.vue` o `FlowRightSidebar.vue`
- El `SidebarFlow` está posicionado junto al `SidebarGeneral` (ambos izquierda)

**Probabilidad:** 🔴 **100% CONFIRMADA**

#### **Hipótesis 2: Confusión de Nomenclatura**

**Descripción:** Se pensó que `SidebarFlow` era el "derecho", pero está junto al "izquierdo".

**Evidencia:**

```vue
<!-- sidebar-general.vue layout -->
<div class="flex">
  <SidebarGeneral />  ← Izquierdo (navegación global)
  <SidebarFlow />     ← Izquierdo también (navegación flujo)
  <main />            ← Centro (contenido)
</div>
<!-- ¿Dónde está el RightSidebar para Nivel 3-4? ❌ NO EXISTE -->
```

**Probabilidad:** 🔴 **100% CONFIRMADA**

#### **Hipótesis 3: Páginas sin Layout**

**Descripción:** Páginas de Sucursales no tienen `definePageMeta({ layout: "sidebar-general" })`.

**Evidencia:**

```vue
<!-- sucursales/acciones.vue -->
<script setup lang="ts">
  // ❌ NO tiene definePageMeta!
  // Por defecto usa layout: "default"
</script>
```

**Resultado:** Usa `default.vue` layout → Solo ProboSidebar (sin SidebarFlow)

**Probabilidad:** 🔴 **100% CONFIRMADA**

---

## 3️⃣ DIAGNÓSTICO DEL PROBLEMA

### 🔴 Problema 1: Arquitectura de 3 Sidebars NO Implementada

#### **Diseño Original de FlowItems (Nivel 0-4):**

```
Nivel 0: Selección Agenda          → LeftSidebar (SidebarFlow)
Nivel 1: Aumento Capital (Section) → LeftSidebar (SidebarFlow)
Nivel 2: Aporte Dinerario          → LeftSidebar (SidebarFlow)
Nivel 3: Aportantes                → RightSidebar ❌ (NO EXISTE)
Nivel 3: Aportes                   → RightSidebar ❌ (NO EXISTE)
Nivel 3: Votación                  → RightSidebar ❌ (NO EXISTE)
Nivel 4: Scroll anchors            → RightSidebar ❌ (NO EXISTE)
```

#### **Lo que SE IMPLEMENTÓ (TODO-003):**

```
SidebarGeneral.vue:
├─ Sidebar 1 (Izquierdo): Navegación global (ProboSidebar content)
└─ Sidebar 2 (Izquierdo): Navegación flujo (SidebarFlow)
    └─ Nivel 0, 1, 2, 3, 4 ← TODOS en el mismo sidebar
```

#### **Lo que FALTA Implementar:**

```
Layout con 3 zonas:
├─ Sidebar 1 (Izquierdo): Navegación global + flujo (Nivel 0-2)
├─ Main Content (Centro): Página actual
└─ Sidebar 3 (Derecho): Sub-navegación (Nivel 3-4) ❌ NO EXISTE
```

### 📊 Comparación Visual

#### **Arquitectura Actual (2 Sidebars):**

```
┌─────────────────────────────────────────────┐
│  LeftSidebar 1    LeftSidebar 2    Main    │
│  (Global Nav)     (Flow Nav)       Content │
│  ───────────────  ──────────────   ────────│
│  - Registro       - Nivel 0        Página  │
│  - Operaciones    - Nivel 1        de      │
│  - Storage        - Nivel 2        Aporte  │
│  - Features       - Nivel 3 ❌      Dinerario│
│  - User Menu      - Nivel 4 ❌              │
└─────────────────────────────────────────────┘
         280px          280px         resto
```

#### **Arquitectura Necesaria (3 Sidebars):**

```
┌───────────────────────────────────────────────────┐
│ LeftSidebar 1  LeftSidebar 2  Main    RightSidebar│
│ (Global Nav)   (Flow Nav)     Content (SubNav)   │
│ ──────────── ───────────────  ─────── ──────────│
│ - Registro    - Nivel 0       Página  - Nivel 3  │
│ - Operaciones - Nivel 1       de      - Aportantes│
│ - Storage     - Nivel 2       Aporte  - Aportes  │
│ - Features    (solo padres)   Dinerario - Votación│
│ - User Menu                            - Acta     │
└───────────────────────────────────────────────────┘
     280px         280px          resto    320px
```

### 🔴 Problema 2: Páginas de Sucursales sin Layout

#### **Páginas Verificadas:**

**✅ Con layout:**

```vue
<!-- datos-sociedad.vue -->
<script setup lang="ts">
  definePageMeta({
    layout: "sidebar-general",  ✅
  });
</script>
```

**❌ Sin layout (6 páginas restantes):**

1. `acciones.vue` ❌
2. `accionistas.vue` ❌
3. `asignacion-acciones.vue` ❌
4. `capital-social.vue` ❌
5. `datos-generales.vue` ❌
6. `index.vue` ❌

#### **Resultado al Navegar:**

```
Ruta: /registro-societario/sucursales/acciones
Layout detectado: "default" (porque NO hay definePageMeta)
Sidebars mostrados: Solo ProboSidebar (global)
SidebarFlow: ❌ NO visible (no está en layout default)
```

### 📋 Análisis de FlowItems (Sucursales)

**FlowItems definidos (6):**

```typescript
// app/types/flows/sucursales/sucursales.items.ts

sucursalDatosSociedadItem   → /sucursales/datos-sociedad    ✅
sucursalDatosGeneralesItem  → /sucursales/datos-generales   ❌
sucursalCapitalSocialItem   → /sucursales/capital-social    ❌
sucursalAccionesItem        → /sucursales/acciones          ❌
sucursalAccionistasItem     → /sucursales/accionistas       ❌
sucursalAsignacionItem      → /sucursales/asignacion-acciones ❌
```

**RightSidebar habilitado:**

```typescript
sucursalDatosGeneralesItem: {
  rightSidebar: {
    enabled: true;
  }
}
sucursalCapitalSocialItem: {
  rightSidebar: {
    enabled: true;
  }
}
// Otros: { rightSidebar: { enabled: false } }
```

**Problema:** Aunque `rightSidebar.enabled = true`, NO hay componente que lo renderice.

---

## 4️⃣ PLANTEAMIENTO DE SOLUCIÓN

### 🎯 Solución General: Implementar Arquitectura de 3 Sidebars

#### **Opción A: RightSidebar Separado (Recomendada)**

**Descripción:** Crear un tercer sidebar (derecho) que muestre items Nivel 3-4.

**Arquitectura:**

```
sidebar-general.vue layout:
├─ SidebarGeneral (izquierdo)
│  └─ Navegación global + Navegación flujo (Nivel 0-2)
├─ Main Content (centro)
└─ RightSidebar (derecho) ← NUEVO
   └─ Sub-navegación (Nivel 3-4)
```

**Ventajas:**

- ✅ Separación clara de responsabilidades
- ✅ UX intuitiva (flujo principal → izquierda, sub-pasos → derecha)
- ✅ Fácil ocultar/mostrar según `rightSidebar.enabled`
- ✅ Mantiene SidebarFlow limpio (solo Nivel 0-2)

**Desventajas:**

- ⚠️ Requiere crear nuevo componente `RightSidebar.vue`
- ⚠️ Modificar layout `sidebar-general.vue`
- ⚠️ Detectar qué items mostrar en RightSidebar

#### **Opción B: Todo en SidebarFlow (No Recomendada)**

**Descripción:** Mostrar Nivel 0-4 en el mismo SidebarFlow (como está ahora).

**Arquitectura:**

```
SidebarFlow:
└─ Todos los niveles (0-4) en el mismo sidebar
   └─ Con indentación visual para cada nivel
```

**Ventajas:**

- ✅ No requiere nuevo componente
- ✅ Jerarquía visual clara con indentación

**Desventajas:**

- ❌ Sidebar muy largo (80+ items)
- ❌ Difícil de navegar
- ❌ No usa el diseño original (rightSidebar)
- ❌ Mala UX (todo mezclado)

### 🎯 Solución Elegida: **Opción A (RightSidebar Separado)**

---

## 5️⃣ PLANIFICACIÓN DE ACCIONES

### 📋 Fase 1: Crear RightSidebar (Nuevo Componente)

#### **Acción 1.1: Crear componente RightSidebar.vue**

**Ubicación:** `app/components/sidebar/RightSidebar.vue`

**Responsabilidades:**

1. Recibir `currentItem` (el item activo de Nivel 2)
2. Extraer `children` del item (Nivel 3-4)
3. Renderizar lista de sub-items
4. Manejar navegación a sub-items
5. Colapsar/expandir

**Props:**

```typescript
interface Props {
  currentItem: FlowItemTree | null; // Item activo (Nivel 2)
  isCollapsed?: boolean;
}
```

**Template:**

```vue
<aside v-if="currentItem && hasChildren">
  <header>
    <h3>{{ currentItem.rightSidebar?.title }}</h3>
  </header>
  
  <nav>
    <RightSidebarItem
      v-for="child in currentItem.children"
      :item="child"
    />
  </nav>
  
  <button @click="toggle">Colapsar</button>
</aside>
```

#### **Acción 1.2: Crear componente RightSidebarItem.vue**

**Ubicación:** `app/components/sidebar/RightSidebarItem.vue`

**Responsabilidades:**

1. Renderizar un item de Nivel 3-4
2. Manejar sub-items (Nivel 4 dentro de Nivel 3)
3. Destacar item activo
4. Navegación

**Props:**

```typescript
interface Props {
  item: FlowItemTree; // Nivel 3 o 4
}
```

#### **Acción 1.3: Modificar sidebar-general.vue layout**

**Cambios:**

```vue
<template>
  <div class="layout-with-sidebar-general flex">
    <SidebarGeneral ... />

    <main class="flex-1">
      <slot />
    </main>

    <!-- NUEVO: RightSidebar -->
    <RightSidebar :current-item="currentItemWithChildren" :is-collapsed="isCollapsedRight" />
  </div>
</template>

<script setup>
  // Detectar item activo (Nivel 2)
  const currentItemWithChildren = computed(() => {
    if (!currentFlowConfig.value) return null;

    // Buscar item activo por ruta
    const item = findItemByRoute(currentFlowConfig.value.items, route.path);

    // Verificar si tiene rightSidebar habilitado y children
    if (item?.rightSidebar?.enabled && item.children?.length > 0) {
      return item;
    }

    return null;
  });
</script>
```

**Estimación:** 2 horas

---

### 📋 Fase 2: Separar Niveles en SidebarFlow

#### **Acción 2.1: Modificar SidebarFlow para filtrar Nivel 0-2**

**Problema:** Actualmente muestra todos los niveles (0-4).

**Solución:** Filtrar solo items Nivel 0-2 antes de renderizar.

**Código:**

```typescript
// SidebarFlow.vue - computed
const filteredItems = computed(() => {
  // Función recursiva para filtrar y limpiar Nivel 3-4
  const filterLevels = (items: FlowItemTree[]): FlowItemTree[] => {
    return items
      .filter((item) => item.hierarchy.level <= 2) // Solo 0-2
      .map((item) => ({
        ...item,
        children: filterLevels(item.children), // Recursivo
      }));
  };

  return filterLevels(props.config.items);
});
```

**Resultado:**

- SidebarFlow: Solo muestra Nivel 0-2
- RightSidebar: Muestra Nivel 3-4 del item activo

**Estimación:** 30 minutos

---

### 📋 Fase 3: Agregar Layout a Páginas de Sucursales

#### **Acción 3.1: Agregar definePageMeta a 6 páginas**

**Páginas a modificar:**

1. `datos-generales.vue`
2. `capital-social.vue`
3. `acciones.vue`
4. `accionistas.vue`
5. `asignacion-acciones.vue`
6. `index.vue`

**Cambio:**

```vue
<script setup lang="ts">
  // Comentarios existentes...

  definePageMeta({
    layout: "sidebar-general",
  });
</script>
```

**Método:** Ejecutar script bash ya creado:

```bash
# Modificar script para incluir sucursales
./scripts/add-layout-to-all-pages.sh
```

**Estimación:** 30 minutos

---

### 📋 Fase 4: Ajustar Distribución de Sidebars

#### **Acción 4.1: Modificar anchos y posiciones**

**CSS Actual:**

```css
/* SidebarGeneral: 280px (izquierdo) */
/* SidebarFlow: 280px (izquierdo también) */
/* Main: resto */
```

**CSS Necesario:**

```css
/* SidebarGeneral: 280px (izquierdo - navegación global) */
/* SidebarFlow: Integrado en SidebarGeneral (no visible por separado) */
/* Main: resto */
/* RightSidebar: 320px (derecho - sub-navegación) */
```

**Decisión de Diseño:**

**Opción A: 2 Sidebars Separados (Actual + Nuevo Derecho)**

```
┌──────────┬───────────┬──────────┐
│ Global + │   Main    │  Right   │
│ Flow     │  Content  │  Sidebar │
│ 280px    │  resto    │  320px   │
└──────────┴───────────┴──────────┘
```

**Opción B: 3 Sidebars Independientes**

```
┌────────┬────────┬────────┬──────────┐
│ Global │  Flow  │  Main  │  Right   │
│ 280px  │ 280px  │ resto  │  320px   │
└────────┴────────┴────────┴──────────┘
```

**Recomendación:** Opción A (más limpia)

**Implementación:**

```vue
<!-- sidebar-general.vue -->
<template>
  <div class="layout-3-zones">
    <!-- Zona 1: Sidebar Izquierdo (Global + Flow) -->
    <div class="left-sidebar-zone" :class="{ collapsed: isCollapsedLeft }">
      <SidebarGeneral :flow-config="currentFlowConfig" />
    </div>

    <!-- Zona 2: Main Content -->
    <main class="main-content">
      <slot />
    </main>

    <!-- Zona 3: RightSidebar (condicional) -->
    <RightSidebar
      v-if="showRightSidebar"
      :current-item="currentItemWithChildren"
      :is-collapsed="isCollapsedRight"
    />
  </div>
</template>

<style scoped>
  .layout-3-zones {
    display: flex;
    height: 100vh;
    width: 100%;
  }

  .left-sidebar-zone {
    width: 280px;
    flex-shrink: 0;
    transition: width 0.3s ease;
  }

  .left-sidebar-zone.collapsed {
    width: 0;
  }

  .main-content {
    flex: 1;
    overflow-y: auto;
  }

  /* RightSidebar tiene su propio ancho interno (320px) */
</style>
```

**Estimación:** 1 hora

---

### 📋 Fase 5: Integrar SidebarFlow Dentro de SidebarGeneral

#### **Decisión:** ¿Mantener SidebarFlow separado o integrarlo?

**Opción A: Mantener Separado (Actual)**

- SidebarGeneral y SidebarFlow son hermanos (ambos en left-sidebar-zone)
- Ventaja: Componentes independientes
- Desventaja: Dos sidebars visuales a la izquierda

**Opción B: Integrar Dentro (Recomendada)**

- SidebarFlow es parte del contenido de SidebarGeneral
- Ventaja: Un solo sidebar visual a la izquierda
- Desventaja: Componente más complejo

**Implementación (Opción B):**

```vue
<!-- SidebarGeneral.vue -->
<template>
  <aside class="sidebar-general">
    <!-- Navegación Global (arriba) -->
    <nav class="global-nav">
      <NavigationSections ... />
    </nav>

    <!-- Separador -->
    <hr v-if="flowConfig" />

    <!-- Navegación de Flujo (abajo) - INTEGRADO -->
    <nav v-if="flowConfig" class="flow-nav">
      <h3>{{ flowConfig.name }}</h3>
      <FlowSidebarItem v-for="item in filteredFlowItems" :item="item" :level="0" />
    </nav>

    <!-- Footer -->
    <footer>
      <UserDropdownMenu />
    </footer>
  </aside>
</template>

<style scoped>
  .sidebar-general {
    width: 280px;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .global-nav {
    flex: 0 0 auto; /* Tamaño fijo */
    overflow-y: auto;
  }

  .flow-nav {
    flex: 1 1 auto; /* Crece/se reduce */
    overflow-y: auto;
    border-top: 1px solid var(--border-color);
    padding-top: 1rem;
  }
</style>
```

**Estimación:** 2 horas

---

## 6️⃣ REVISIÓN DE ACCIONES

### ✅ Checklist de Implementación

#### **Fase 1: RightSidebar (2h)**

- [ ] Crear `app/components/sidebar/RightSidebar.vue`
- [ ] Crear `app/components/sidebar/RightSidebarItem.vue`
- [ ] Modificar `sidebar-general.vue` layout para incluir RightSidebar
- [ ] Implementar lógica de detección de `currentItemWithChildren`
- [ ] Agregar estilos y transiciones

#### **Fase 2: Filtrar SidebarFlow (30min)**

- [ ] Modificar `SidebarFlow.vue` para filtrar solo Nivel 0-2
- [ ] Verificar que children de Nivel 3-4 no aparezcan en SidebarFlow
- [ ] Probar con flujo de Juntas (jerarquía completa)

#### **Fase 3: Layout Sucursales (30min)**

- [ ] Agregar `definePageMeta` a 6 páginas de Sucursales
- [ ] Verificar que todas usan `layout: "sidebar-general"`
- [ ] Probar navegación entre páginas de Sucursales

#### **Fase 4: Ajustar Distribución (1h)**

- [ ] Modificar CSS del layout para 3 zonas
- [ ] Ajustar anchos: 280px (left) + resto (main) + 320px (right)
- [ ] Implementar collapse/expand para RightSidebar
- [ ] Verificar responsive

#### **Fase 5: Integrar SidebarFlow (2h - Opcional)**

- [ ] Decidir: ¿Mantener separado o integrar?
- [ ] Si integrar: Mover lógica de SidebarFlow dentro de SidebarGeneral
- [ ] Ajustar estilos para split vertical (global nav + flow nav)
- [ ] Verificar scroll independiente

### 📊 Estimación Total

**MVP (Sin Fase 5):**

- Fase 1: 2h
- Fase 2: 30min
- Fase 3: 30min
- Fase 4: 1h
- **Total: 4 horas**

**Completo (Con Fase 5):**

- Fases 1-4: 4h
- Fase 5: 2h
- **Total: 6 horas**

### 🎯 Priorización

**Alta Prioridad (Bloqueante):**

1. ✅ Fase 1: RightSidebar (resuelve Problema 1)
2. ✅ Fase 3: Layout Sucursales (resuelve Problema 2)
3. ✅ Fase 2: Filtrar SidebarFlow (limpieza)

**Media Prioridad (Mejora UX):** 4. ⚠️ Fase 4: Ajustar distribución (refinamiento visual)

**Baja Prioridad (Opcional):** 5. ℹ️ Fase 5: Integrar SidebarFlow (refactoring)

---

## 7️⃣ ENTREGA FINAL DEL PLAN

### 📦 Plan de Implementación Recomendado

#### **Sprint 1: Resolver Bloqueantes (4h)**

**Día 1: RightSidebar (2h)**

1. Crear `RightSidebar.vue` y `RightSidebarItem.vue`
2. Modificar `sidebar-general.vue` layout
3. Implementar detección de `currentItemWithChildren`
4. Probar con Juntas → Aporte Dinerario

**Día 2: Completar Funcionalidad (2h)**

1. Filtrar SidebarFlow (solo Nivel 0-2)
2. Agregar layout a páginas de Sucursales
3. Ajustar distribución CSS (3 zonas)
4. Pruebas completas

#### **Estructura de Archivos Final:**

```
app/
├── components/
│   └── sidebar/
│       ├── SidebarGeneral.vue        ✅ (existe - modificar)
│       ├── SidebarFlow.vue           ✅ (existe - filtrar niveles)
│       ├── RightSidebar.vue          🆕 (crear)
│       └── RightSidebarItem.vue      🆕 (crear)
│
├── layouts/
│   └── sidebar-general.vue           ✅ (existe - agregar RightSidebar)
│
└── pages/
    ├── operaciones/junta-accionistas/
    │   └── **/*.vue                  ✅ (tienen layout)
    │
    └── registro-societario/sucursales/
        ├── datos-sociedad.vue        ✅ (tiene layout)
        ├── datos-generales.vue       🔧 (agregar layout)
        ├── capital-social.vue        🔧 (agregar layout)
        ├── acciones.vue              🔧 (agregar layout)
        ├── accionistas.vue           🔧 (agregar layout)
        ├── asignacion-acciones.vue   🔧 (agregar layout)
        └── index.vue                 🔧 (agregar layout)
```

### 🎯 Criterios de Éxito

#### **Problema 1 Resuelto: Juntas con RightSidebar**

- ✅ Navegar a `/operaciones/junta-accionistas/aporte-dinerario`
- ✅ Ver 3 zonas:
  - Izquierda: SidebarGeneral (global) + SidebarFlow (Nivel 0-2)
  - Centro: Página de Aporte Dinerario
  - Derecha: RightSidebar con 4 sub-items (Aportantes, Aportes, Votación, Acta)
- ✅ Hacer click en "Aportantes" → Navega y destaca item activo

#### **Problema 2 Resuelto: Sucursales Mantiene Sidebars**

- ✅ Navegar a `/registro-societario/sucursales/acciones`
- ✅ Ver 2 sidebars:
  - Izquierda: SidebarGeneral + SidebarFlow (6 items de Sucursales)
  - Derecha: NO visible (sucursalAccionesItem.rightSidebar.enabled = false)
- ✅ Navegar entre páginas de Sucursales → Sidebars permanecen visibles

### 📋 Plan de Pruebas

#### **Test 1: Juntas con RightSidebar**

```bash
# Navegación
1. Ir a /operaciones/junta-accionistas/seleccion-agenda
2. Expandir "Puntos de Acuerdo"
3. Expandir "Aumento de Capital"
4. Click en "Aporte Dinerario"

# Verificar
✅ 3 zonas visibles
✅ SidebarFlow muestra hasta Nivel 2
✅ RightSidebar muestra Nivel 3-4 (4 items)
✅ Click en "Aportantes" → Navega correctamente
✅ RightSidebar destaca "Aportantes" como activo
```

#### **Test 2: Sucursales con Sidebars**

```bash
# Navegación
1. Ir a /registro-societario/sucursales/datos-sociedad
2. Verificar ambos sidebars visibles
3. Click en "Acciones" (SidebarFlow)
4. Verificar que sidebars NO desaparecen

# Verificar
✅ SidebarGeneral visible (navegación global)
✅ SidebarFlow visible (6 items de Sucursales)
✅ RightSidebar NO visible (acciones.rightSidebar.enabled = false)
✅ Navegar entre páginas mantiene sidebars
```

#### **Test 3: Sucursales con RightSidebar Habilitado**

```bash
# Navegación
1. Ir a /registro-societario/sucursales/datos-generales
2. Verificar 3 zonas

# Verificar
✅ SidebarGeneral visible
✅ SidebarFlow visible
✅ RightSidebar visible (datosGeneralesItem.rightSidebar.enabled = true)
✅ RightSidebar muestra contenido de ayuda
```

### 🚨 Riesgos y Mitigaciones

#### **Riesgo 1: Complejidad de Layout**

**Descripción:** Layout con 3 zonas puede ser complejo de mantener.  
**Probabilidad:** Media  
**Impacto:** Medio  
**Mitigación:** Documentar claramente la estructura y responsabilidades.

#### **Riesgo 2: Performance con Muchos Items**

**Descripción:** Renderizar 3 sidebars puede afectar performance.  
**Probabilidad:** Baja  
**Impacto:** Bajo  
**Mitigación:** Usar `v-show` en lugar de `v-if` para sidebars colapsados.

#### **Riesgo 3: Responsive (Mobile)**

**Descripción:** 3 sidebars no caben en pantallas pequeñas.  
**Probabilidad:** Alta  
**Impacto:** Alto  
**Mitigación:** En mobile, usar drawers/modals para sidebars secundarios.

---

## 📝 CONCLUSIONES

### ✅ Problemas Identificados

1. **Arquitectura Incompleta:** Sistema tiene solo 2 sidebars (izquierdo), falta RightSidebar (derecho) para Nivel 3-4.

2. **Páginas sin Layout:** 6 páginas de Sucursales no tienen `definePageMeta({ layout: "sidebar-general" })`.

3. **Nomenclatura Confusa:** `SidebarFlow` se pensó como "derecho", pero está posicionado junto al "izquierdo".

### 🎯 Solución Propuesta

**Implementar arquitectura de 3 zonas:**

1. **Izquierda:** SidebarGeneral (navegación global + flujo Nivel 0-2)
2. **Centro:** Main Content (página actual)
3. **Derecha:** RightSidebar (sub-navegación Nivel 3-4)

**Estimación:** 4 horas (MVP) | 6 horas (completo)

### 🚀 Próximo Paso

**Iniciar Fase 1:** Crear componentes `RightSidebar.vue` y `RightSidebarItem.vue`.

---

**Investigación completada por:** GitHub Copilot  
**Fecha:** 2025-11-03  
**Estado:** ✅ LISTA PARA IMPLEMENTACIÓN
