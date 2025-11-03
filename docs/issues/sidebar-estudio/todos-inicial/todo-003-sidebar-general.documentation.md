# 📚 TODO-003: SidebarGeneral + SidebarFlow - Documentación Técnica

**Fecha:** 3 de Noviembre, 2025  
**Proyecto:** Sistema Universal de Sidebars  
**Estado:** 📋 Expediente en Progreso

---

## 🎯 OBJETIVO

Refactorizar la arquitectura de sidebars para permitir **navegación principal + navegación de flujo simultáneas**, manteniendo aislamiento con el código existente de Registro de Sociedades.

---

## 📚 CONTEXTO

### **Situación Actual:**

```
ProboSidebar.vue (legacy)
└─ Usado en: default.vue layout
   └─ Registro de Sociedades ✅
   └─ Otras secciones ✅

FlowSidebar.vue (recién creado)
└─ Usado en: flow-with-sidebar.vue layout
   └─ Junta de Accionistas (solo FlowSidebar, sin navegación principal) ❌
   └─ Sucursales (solo FlowSidebar, sin navegación principal) ❌
```

### **Problema:**

Juntas y Sucursales necesitan **ambos sidebars** (navegación principal + pasos del flujo), pero actualmente solo tienen uno.

### **Restricción:**

**NO TOCAR** Registro de Sociedades (otro equipo trabaja ahí).

---

## 💡 SOLUCIÓN PROPUESTA

### **Arquitectura Nueva:**

```
┌───────────────────────────────────────────────────────────┐
│                    ARQUITECTURA DE SIDEBARS               │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  ProboSidebar.vue (legacy)                               │
│  └─ default.vue layout                                    │
│     └─ Registro de Sociedades                            │
│        └─ ✅ Sigue funcionando igual                     │
│                                                           │
│  ──────────────────────────────────────────────────      │
│                                                           │
│  SidebarGeneral.vue (nuevo)                              │
│  ├─ Navegación principal (copia mejorada de ProboSidebar)│
│  └─ Slot/Prop para SidebarFlow (opcional)                │
│                                                           │
│  SidebarFlow.vue (nuevo)                                 │
│  └─ Navegación de flujo (versión simplificada)           │
│                                                           │
│  sidebar-general.vue layout (nuevo)                      │
│  └─ Orquesta SidebarGeneral + SidebarFlow                │
│     ├─ Junta de Accionistas                              │
│     └─ Sucursales                                         │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### **Separación de Responsabilidades:**

```typescript
// ProboSidebar.vue (NO TOCAR)
- Navegación principal
- Usado por: Registro de Sociedades
- Layout: default.vue

// SidebarGeneral.vue (NUEVO)
- Navegación principal (copy de ProboSidebar)
- + Slot para sidebar adicional
- Usado por: Juntas, Sucursales
- Layout: sidebar-general.vue

// SidebarFlow.vue (NUEVO)
- Navegación de pasos del flujo
- Versión simplificada de FlowSidebar.vue
- Se integra dentro de SidebarGeneral
```

---

## 💻 IMPLEMENTACIÓN

### **COMPONENTE 1: SidebarFlow.vue**

**Ubicación:** `app/components/sidebar/SidebarFlow.vue`

**Propósito:** Versión simplificada de FlowSidebar que se integra dentro de SidebarGeneral.

#### **Props:**

```typescript
interface Props {
  config: FlowConfigWithTree; // FlowConfig con items de tipo FlowItemTree[]
  isCollapsed?: boolean; // Controlar colapso externamente
}

type FlowConfigWithTree = Omit<FlowConfig, "items"> & {
  items: FlowItemTree[];
};
```

#### **Template:**

```vue
<template>
  <aside
    v-if="!isCollapsed"
    class="sidebar-flow border-r bg-background"
    :style="{ width: `${config.sidebarOptions.width || 280}px` }"
  >
    <!-- Navigation Items (sin header) -->
    <nav class="p-4 space-y-2 overflow-y-auto" style="max-height: calc(100vh - 80px)">
      <FlowSidebarItem
        v-for="item in config.items"
        :key="item.identity.id"
        :item="item"
        :level="0"
      />
    </nav>

    <!-- Toggle collapse button -->
    <button class="collapse-btn" @click="$emit('toggle-collapse')">
      <ChevronLeft v-if="!isCollapsed" />
    </button>
  </aside>
</template>
```

#### **Diferencias con FlowSidebar.vue:**

```diff
- ❌ Header (título y descripción)
+ ✅ Sin header (se muestra en SidebarGeneral)

- ❌ height: 100vh (ocupaba toda la altura)
+ ✅ max-height: calc(100vh - 80px) (respeta header de SidebarGeneral)

- ❌ Sticky position
+ ✅ Normal flow (dentro de contenedor)

+ ✅ Emit toggle-collapse para control externo
+ ✅ Prop isCollapsed para colapso sincronizado
```

#### **Estilos:**

```vue
<style scoped>
  .sidebar-flow {
    position: relative;
    overflow-y: auto;
    transition: width 0.3s ease;
  }

  .collapse-btn {
    position: absolute;
    top: 50%;
    right: -12px;
    width: 24px;
    height: 48px;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 0 8px 8px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    z-index: 10;
  }

  .collapse-btn:hover {
    background: var(--color-accent);
  }
</style>
```

---

### **COMPONENTE 2: SidebarGeneral.vue**

**Ubicación:** `app/components/sidebar/SidebarGeneral.vue`

**Propósito:** Versión mejorada de ProboSidebar que puede incluir un SidebarFlow adicional.

#### **Props:**

```typescript
interface Props {
  // Props originales de ProboSidebar
  isCollapsed: boolean;
  toggleSidebar: () => void;

  // Props nuevos para FlowSidebar
  flowConfig?: FlowConfigWithTree | null; // FlowConfig opcional
  showFlowSidebar?: boolean; // Mostrar/ocultar FlowSidebar
}
```

#### **Template:**

```vue
<template>
  <div class="sidebar-container flex">
    <!-- Sidebar Principal (navegación app) -->
    <SidebarProvider class="w-auto">
      <Sidebar
        :class="
          cn(
            'bg-sidebar h-screen flex flex-col overflow-hidden border-r border-sidebar-border',
            isCollapsedMain ? 'w-0 opacity-0' : 'w-[280px] opacity-100'
          )
        "
      >
        <!-- Header -->
        <SidebarHeader class="p-6 pb-8">
          <div class="flex items-center justify-between mb-4">
            <NuxtLink to="/" class="flex items-center gap-2">
              <img :src="logoProbo" alt="logo" />
            </NuxtLink>

            <Button variant="ghost" size="sm" @click="toggleSidebar">
              <X class="w-4 h-4" />
            </Button>
          </div>
        </SidebarHeader>

        <!-- Navigation Content (igual que ProboSidebar) -->
        <SidebarContent class="flex-1 overflow-y-auto overflow-x-hidden px-3">
          <!-- ... mismo contenido que ProboSidebar.vue ... -->
        </SidebarContent>

        <!-- User Profile Footer -->
        <SidebarFooter class="p-4 border-t border-sidebar-border">
          <UserDropdownMenu />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>

    <!-- Sidebar de Flujo (opcional) -->
    <SidebarFlow
      v-if="showFlowSidebar && flowConfig"
      :config="flowConfig"
      :is-collapsed="isCollapsedFlow"
      @toggle-collapse="toggleFlowSidebar"
    />
  </div>
</template>
```

#### **Script:**

```vue
<script setup lang="ts">
  import { ref } from "vue";
  import type { FlowConfigWithTree } from "@/types/flow-system";
  import SidebarFlow from "./SidebarFlow.vue";
  // ... otros imports igual que ProboSidebar

  interface Props {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    flowConfig?: FlowConfigWithTree | null;
    showFlowSidebar?: boolean;
  }

  const props = defineProps<Props>();

  // Estado del sidebar principal (igual que antes)
  const isCollapsedMain = computed(() => props.isCollapsed);

  // Estado del sidebar de flujo (nuevo)
  const isCollapsedFlow = ref(false);

  const toggleFlowSidebar = () => {
    isCollapsedFlow.value = !isCollapsedFlow.value;
  };

  // ... resto del código igual que ProboSidebar
</script>
```

#### **Estilos:**

```vue
<style scoped>
  .sidebar-container {
    position: relative;
    height: 100vh;
  }

  /* Resto de estilos igual que ProboSidebar */
</style>
```

---

### **LAYOUT: sidebar-general.vue**

**Ubicación:** `app/layouts/sidebar-general.vue`

**Propósito:** Layout que orquesta SidebarGeneral con detección automática de FlowConfig.

#### **Template:**

```vue
<template>
  <div class="flex h-screen overflow-hidden bg-safe">
    <!-- Toggle Button (cuando está colapsado) -->
    <Button v-if="isCollapsed" class="fixed top-2 left-2 z-40" @click="toggleSidebar">
      <Menu class="w-4 h-4" />
    </Button>

    <!-- Sidebar General + Flow -->
    <SidebarGeneral
      v-if="!isCollapsed"
      :is-collapsed="isCollapsed"
      :toggle-sidebar="toggleSidebar"
      :flow-config="currentFlowConfigWithTree"
      :show-flow-sidebar="!!currentFlowConfigWithTree"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
```

#### **Script:**

```vue
<script setup lang="ts">
  import { ref, computed } from "vue";
  import { useRoute } from "vue-router";
  import { Menu } from "lucide-vue-next";
  import SidebarGeneral from "@/components/sidebar/SidebarGeneral.vue";
  import Button from "@/components/ui/button/Button.vue";
  import { juntaAccionistasFlowConfig, sucursalesFlowConfig } from "@/config/flows";
  import { buildFlowItemTree } from "@/utils/flowHelpers";
  import type { FlowConfig, FlowItemTree } from "@/types/flow-system";

  const route = useRoute();

  // Estado de colapso del sidebar principal
  const isCollapsed = ref(false);

  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  // Detectar FlowConfig según ruta actual
  const currentFlowConfig = computed(() => {
    const path = route.path;

    // Rutas de Junta de Accionistas
    if (path.startsWith("/operaciones/junta-accionistas")) {
      return juntaAccionistasFlowConfig;
    }

    // Rutas de Sucursales
    if (path.startsWith("/registro-societario/sucursales")) {
      return sucursalesFlowConfig;
    }

    // Sin FlowSidebar para otras rutas
    return null;
  });

  // Convertir FlowConfig con FlowItem[] a FlowConfig con FlowItemTree[]
  const currentFlowConfigWithTree = computed(() => {
    if (!currentFlowConfig.value) return null;

    return {
      ...currentFlowConfig.value,
      items: buildFlowItemTree(currentFlowConfig.value.items),
    } as FlowConfig & { items: FlowItemTree[] };
  });
</script>
```

---

### **ACTUALIZACIÓN: Páginas de Juntas y Sucursales**

#### **Antes (flow-with-sidebar):**

```vue
<script setup lang="ts">
  definePageMeta({
    layout: "flow-with-sidebar", // ❌ Solo FlowSidebar
  });
</script>
```

#### **Después (sidebar-general):**

```vue
<script setup lang="ts">
  definePageMeta({
    layout: "sidebar-general", // ✅ Ambos sidebars
  });
</script>
```

#### **Archivos a actualizar:**

```
app/pages/operaciones/junta-accionistas/
├─ seleccion-agenda.vue
├─ detalles.vue
├─ instalacion.vue
├─ puntos-acuerdo.vue
├─ resumen.vue
└─ descargar.vue

app/pages/registro-societario/sucursales/
├─ datos-sociedad.vue
├─ domicilio.vue
├─ representante-legal.vue
├─ documentacion.vue
├─ resumen.vue
└─ enviar.vue
```

---

## ✅ CRITERIOS DE ACEPTACIÓN

### **Funcionales:**

1. **SidebarGeneral muestra navegación principal**

   ```
   Dado: Usuario navega a /operaciones/junta-accionistas/seleccion-agenda
   Cuando: La página carga
   Entonces:
     - Se muestra logo ProBO
     - Se muestra navegación principal (Registro, Operaciones, etc.)
     - Se puede navegar a otras secciones
   ```

2. **SidebarFlow muestra pasos del flujo**

   ```
   Dado: Usuario navega a /operaciones/junta-accionistas/seleccion-agenda
   Cuando: La página carga
   Entonces:
     - Se muestra sidebar secundario con pasos del flujo
     - Se muestran 6 items de nivel 0
     - El item activo está resaltado
   ```

3. **Ambos sidebars funcionan independientemente**

   ```
   Dado: Ambos sidebars están visibles
   Cuando: Usuario colapsa SidebarGeneral
   Entonces: SidebarFlow sigue visible

   Y: Cuando usuario colapsa SidebarFlow
   Entonces: SidebarGeneral sigue visible
   ```

4. **Registro de Sociedades no se afecta**
   ```
   Dado: Usuario navega a /registro-societario/sociedades
   Cuando: La página carga
   Entonces:
     - Solo se muestra ProboSidebar (layout default)
     - NO se muestra SidebarFlow
     - Navegación funciona igual que antes
   ```

### **Técnicos:**

5. **TypeScript sin errores**

   ```bash
   npm run typecheck
   # ✅ 0 errors
   ```

6. **ESLint sin warnings**

   ```bash
   npm run lint
   # ✅ 0 warnings
   ```

7. **Consola del navegador limpia**
   ```
   Al navegar por la app:
   # ✅ 0 errors
   # ✅ 0 warnings
   ```

### **UX:**

8. **Transiciones suaves**

   ```
   Cuando: Usuario colapsa/expande sidebar
   Entonces: Transición de 300ms smooth
   ```

9. **Estados visuales claros**
   ```
   - Item activo: bg-accent + font-semibold
   - Item hover: bg-accent/50
   - Item normal: text-muted-foreground
   ```

---

## 🧪 TESTING

### **Test Manual 1: Junta de Accionistas**

```markdown
1. Iniciar dev server: npm run dev
2. Navegar a: http://localhost:3000/indiceSidebarsPruebas
3. Click en: "📋 Junta de Accionistas"
4. ✅ Verificar: Redirige a /operaciones/junta-accionistas/seleccion-agenda
5. ✅ Verificar: Se muestran 2 sidebars (SidebarGeneral + SidebarFlow)
6. ✅ Verificar: SidebarGeneral muestra navegación principal
7. ✅ Verificar: SidebarFlow muestra 6 items de nivel 0
8. ✅ Verificar: "Selección de Agenda" está activo (resaltado)
9. Click en: "Detalles" en SidebarFlow
10. ✅ Verificar: Navega correctamente
11. ✅ Verificar: "Detalles" ahora está activo
12. Click en: "Sucursales" en SidebarGeneral
13. ✅ Verificar: Navega a sucursales con FlowConfig de sucursales
```

### **Test Manual 2: Sucursales**

```markdown
1. Navegar a: http://localhost:3000/indiceSidebarsPruebas
2. Click en: "🏢 Sucursales"
3. ✅ Verificar: Redirige a /registro-societario/sucursales/datos-sociedad
4. ✅ Verificar: Se muestran 2 sidebars
5. ✅ Verificar: SidebarFlow muestra items de sucursales
6. ✅ Verificar: "Datos de la Sociedad" está activo
7. Click en: "Domicilio" en SidebarFlow
8. ✅ Verificar: Navega correctamente
```

### **Test Manual 3: Registro de Sociedades (no romper)**

```markdown
1. Navegar a: http://localhost:3000/registro-societario/sociedades
2. ✅ Verificar: Solo se muestra ProboSidebar (1 sidebar)
3. ✅ Verificar: NO se muestra SidebarFlow
4. ✅ Verificar: Layout es "default", no "sidebar-general"
5. ✅ Verificar: Navegación funciona como siempre
6. ✅ Verificar: 0 errores en consola
```

### **Test Manual 4: Colapso Independiente**

```markdown
1. Navegar a: /operaciones/junta-accionistas/seleccion-agenda
2. ✅ Verificar: Ambos sidebars visibles
3. Click en: Botón [X] de SidebarGeneral
4. ✅ Verificar: SidebarGeneral se colapsa
5. ✅ Verificar: SidebarFlow sigue visible
6. Click en: Botón [<] de SidebarFlow (si existe)
7. ✅ Verificar: SidebarFlow se colapsa
8. ✅ Verificar: Solo contenido principal visible
9. Click en: Botón [Menu] (top-left)
10. ✅ Verificar: SidebarGeneral se expande
11. ✅ Verificar: SidebarFlow sigue colapsado
```

---

## 📖 REFERENCIAS

### **Archivos Relacionados:**

**Legacy (no tocar):**

- `app/components/ProboSidebar.vue`
- `app/layouts/default.vue`
- `app/pages/registro-societario/sociedades/*.vue`

**Actuales (base para refactor):**

- `app/components/flow/FlowSidebar.vue`
- `app/components/flow/FlowSidebarItem.vue`
- `app/layouts/flow-with-sidebar.vue`

**Nuevos (a crear):**

- `app/components/sidebar/SidebarGeneral.vue`
- `app/components/sidebar/SidebarFlow.vue`
- `app/layouts/sidebar-general.vue`

**Configuración:**

- `app/config/flows/junta-accionistas.flow.ts`
- `app/config/flows/sucursales.flow.ts`
- `app/config/navigation.ts`

**Utilidades:**

- `app/utils/flowHelpers.ts`

---

## 🔄 FLUJO DE TRABAJO

### **Fase 1: Crear SidebarFlow**

```bash
1. cp app/components/flow/FlowSidebar.vue app/components/sidebar/SidebarFlow.vue
2. Editar SidebarFlow.vue:
   - Remover header
   - Agregar props isCollapsed, @toggle-collapse
   - Ajustar estilos (max-height, no sticky)
3. Probar aisladamente (crear página de prueba)
```

### **Fase 2: Crear SidebarGeneral**

```bash
1. cp app/components/ProboSidebar.vue app/components/sidebar/SidebarGeneral.vue
2. Editar SidebarGeneral.vue:
   - Agregar props flowConfig, showFlowSidebar
   - Importar SidebarFlow
   - Renderizar SidebarFlow condicionalmente
   - Ajustar layout flex
3. Probar aisladamente
```

### **Fase 3: Crear Layout**

```bash
1. Crear app/layouts/sidebar-general.vue
2. Copiar lógica de flow-with-sidebar.vue
3. Reemplazar FlowSidebar por SidebarGeneral
4. Agregar detección de FlowConfig
5. Probar en navegador
```

### **Fase 4: Actualizar Páginas**

```bash
1. Actualizar definePageMeta en páginas de juntas
2. Actualizar definePageMeta en páginas de sucursales
3. Probar navegación
4. Verificar que registro-sociedades sigue igual
```

---

## 🎯 RESULTADO ESPERADO

### **Antes:**

```
/operaciones/junta-accionistas/seleccion-agenda
└─ Layout: flow-with-sidebar
   └─ FlowSidebar (solo este)
      └─ ❌ Sin navegación principal
```

### **Después:**

```
/operaciones/junta-accionistas/seleccion-agenda
└─ Layout: sidebar-general
   ├─ SidebarGeneral
   │  └─ ✅ Navegación principal (Registro, Operaciones, etc.)
   └─ SidebarFlow
      └─ ✅ Pasos del flujo (Selección, Detalles, etc.)
```

### **Sin cambios:**

```
/registro-societario/sociedades
└─ Layout: default
   └─ ProboSidebar
      └─ ✅ Sigue funcionando igual (no afectado)
```

---

**FIN DE LA DOCUMENTACIÓN**
