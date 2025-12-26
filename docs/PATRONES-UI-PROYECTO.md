# 🎨 PATRONES DE UI - Proyecto UI

**Documento que resume los patrones de estructura, componentes y estilos del proyecto `probo-frontend-v30-ui` para replicarlos en `probo-frontend-v30-panel-administrativo`.**

**Fecha:** Diciembre 2024

---

## 📋 ÍNDICE

1. [Estructura de Vistas](#estructura-de-vistas)
2. [Patrones de Componentes](#patrones-de-componentes)
3. [Sistema de Estilos](#sistema-de-estilos)
4. [Composables y Lógica](#composables-y-lógica)
5. [Componentes Compartidos](#componentes-compartidos)
6. [Checklist de Implementación](#checklist-de-implementación)

---

## 🏗️ ESTRUCTURA DE VISTAS

### Organización

```
app/core/presentation/[dominio]/vistas/[nombre-vista]/
├── components/
│   ├── [NombreVista]Manager.vue        # Componente principal (contenedor)
│   ├── organisms/                       # Componentes grandes
│   │   ├── [Nombre]Table.vue
│   │   ├── [Nombre]Header.vue
│   │   └── [Nombre]Grid.vue
│   └── molecules/                       # Componentes pequeños
│       ├── [Nombre]Card.vue
│       ├── [Nombre]Badge.vue
│       └── ActionButton.vue
├── composables/
│   └── use[NombreVista].ts              # Controller de la vista
└── types/
    └── [nombre-vista].types.ts          # Tipos TypeScript
```

### Ejemplo Real: Historial

```
vistas/historial/
├── components/
│   ├── HistorialSociedadesManager.vue  # Manager principal
│   ├── organisms/
│   │   ├── HistorialSociedadesTable.vue
│   │   ├── HistorialSociedadesHeader.vue
│   │   └── HistorialTableGrid.vue
│   └── molecules/
│       ├── HistorialTableHeader.vue
│       ├── SociedadCard.vue
│       ├── EstadoBadge.vue
│       └── ActionButton.vue
├── composables/
│   └── useHistorialSociedades.ts
└── types/
    └── historial.types.ts
```

---

## 🧩 PATRONES DE COMPONENTES

### 1. Manager Component (Componente Principal)

**Patrón:** Componente contenedor que orquesta toda la vista.

**Estructura:**

```vue
<template>
  <div class="min-h-full bg-gray-50">
    <!-- Header -->
    <VistaHeader
      :icon="IconComponent"
      title="Título de la Vista"
      description="Descripción de la vista"
    >
      <template #right>
        <!-- Acciones del header -->
      </template>
    </VistaHeader>

    <!-- Contenido Principal -->
    <div class="vista-container">
      <!-- Componentes de la vista -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { use[NombreVista] } from "../composables/use[NombreVista]";
import VistaHeader from "~/core/presentation/shared/components/VistaHeader.vue";

const {
  // Estado y métodos del composable
} = use[NombreVista]();
</script>

<style scoped>
  /* Estilos responsivos */
</style>
```

**Ejemplo Real:**

```vue
<!-- HistorialSociedadesManager.vue -->
<template>
  <div class="min-h-full bg-gray-50">
    <HistorialSociedadesHeader
      :show-delete-all="sociedades.length > 0"
      :is-loading="isLoading"
      @go-to-test="goToTestPage"
      @create="handleCreate"
      @delete-all="handleDeleteAll"
    />

    <div class="vista-container">
      <HistorialSociedadesTable
        :data="sociedades"
        :is-loading="isLoading"
        :actions="tableActions"
        :get-estado="getEstado"
      />
    </div>
  </div>
</template>
```

### 2. Organisms (Componentes Grandes)

**Patrón:** Componentes complejos que combinan múltiples molecules.

**Características:**
- Encapsulan lógica de presentación
- Usan molecules como sub-componentes
- Tienen estilos propios con media queries

**Ejemplo:**

```vue
<template>
  <div class="historial-table-wrapper">
    <div class="historial-table-header">
      <HistorialTableHeader :total="total" />
    </div>

    <HistorialTableGrid
      :data="data"
      :is-loading="isLoading"
      :actions="actions"
    />
  </div>
</template>

<style scoped>
  .historial-table-wrapper {
    background-color: white;
    border-radius: 0.75rem;
    border: 1px solid rgb(229, 231, 235);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .historial-table-header {
    padding: 1rem;
    border-bottom: 1px solid rgb(229, 231, 235);
  }

  /* Breakpoint >= 1280px y < 1440px */
  @media (min-width: 1280px) and (max-width: 1439px) {
    .historial-table-header {
      padding: 1.25rem;
    }
  }

  /* Breakpoint >= 1440px */
  @media (min-width: 1440px) {
    .historial-table-header {
      padding: 1.5rem;
    }
  }
</style>
```

### 3. Molecules (Componentes Pequeños)

**Patrón:** Componentes reutilizables que encapsulan UI específica.

**Características:**
- Props bien definidas
- Estilos scoped con variables CSS
- Media queries para responsividad

**Ejemplo:**

```vue
<template>
  <div class="historial-header-content">
    <div>
      <h3 class="historial-title" style="color: var(--text-primary); font-family: var(--font-primary)">
        Sociedades Registradas
      </h3>
      <p class="historial-subtitle" style="color: var(--text-muted); font-family: var(--font-secondary)">
        Total: {{ total }} {{ total === 1 ? "sociedad" : "sociedades" }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    total: number;
  }

  defineProps<Props>();
</script>

<style scoped>
  .historial-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .historial-subtitle {
    font-size: 0.75rem;
  }

  /* Breakpoint >= 1280px y < 1440px */
  @media (min-width: 1280px) and (max-width: 1439px) {
    .historial-title {
      font-size: 1.0625rem;
    }
    .historial-subtitle {
      font-size: 0.8125rem;
    }
  }

  /* Breakpoint >= 1440px */
  @media (min-width: 1440px) {
    .historial-title {
      font-size: 1.125rem;
    }
    .historial-subtitle {
      font-size: 0.875rem;
    }
  }
</style>
```

---

## 🎨 SISTEMA DE ESTILOS

### Variables CSS

**Uso consistente de variables del sistema de diseño:**

```css
/* Colores */
color: var(--text-primary);
color: var(--text-muted);
background-color: var(--primary-100);
color: var(--primary-700);

/* Fuentes */
font-family: var(--font-primary);
font-family: var(--font-secondary);
```

### Breakpoints Responsivos

**Sistema de 3 breakpoints:**

1. **Base:** `< 1280px`
2. **Medio:** `1280px - 1439px`
3. **Grande:** `>= 1440px`

**Patrón de Padding:**

```css
/* Base */
padding: 1rem;

/* Medio (1280px - 1439px) */
@media (min-width: 1280px) and (max-width: 1439px) {
  padding: 1.25rem;
}

/* Grande (>= 1440px) */
@media (min-width: 1440px) {
  padding: 1.5rem;
}
```

**Patrón de Font Size:**

```css
/* Base */
font-size: 1rem;

/* Medio */
@media (min-width: 1280px) and (max-width: 1439px) {
  font-size: 1.0625rem;
}

/* Grande */
@media (min-width: 1440px) {
  font-size: 1.125rem;
}
```

### Clase `vista-container`

**Uso:** Contenedor principal del contenido de la vista.

**Estilos:**

```css
.vista-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1rem;
}

/* Breakpoint >= 1280px y < 1440px */
@media (min-width: 1280px) and (max-width: 1439px) {
  .vista-container {
    padding: 1.5rem;
  }
}

/* Breakpoint >= 1440px */
@media (min-width: 1440px) {
  .vista-container {
    padding: 2rem;
  }
}
```

### Estilos de Componentes

**Patrones comunes:**

1. **Cards/Tables:**
   - `background-color: white`
   - `border-radius: 0.75rem`
   - `border: 1px solid rgb(229, 231, 235)`
   - `box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`

2. **Headers:**
   - `border-bottom: 1px solid rgb(229, 231, 235)`
   - Padding responsivo

3. **Botones:**
   - Usan componente `ActionButton` o `Button` de shadcn
   - Clases personalizadas para variantes

---

## 🔧 COMPOSABLES Y LÓGICA

### Patrón de Composable

**Estructura:**

```typescript
/**
 * Controller para la vista de [NombreVista]
 * 
 * Orquesta la lógica de la vista y coordina con el store
 */

import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { use[Nombre]Store } from "~/core/presentation/[dominio]/stores/[nombre].store";

export function use[NombreVista]() {
  const router = useRouter();
  const store = use[Nombre]Store();
  const { data, status, errorMessage } = storeToRefs(store);

  const isLoading = computed(() => status.value === "loading");

  // Handlers
  const handleAction = async () => {
    // Lógica
  };

  // Retornar estado y métodos
  return {
    data,
    isLoading,
    handleAction,
    // ...
  };
}
```

**Ejemplo Real:**

```typescript
export function useHistorialSociedades() {
  const router = useRouter();
  const historialStore = useSociedadHistorialStore();
  const { sociedades, status, errorMessage } = storeToRefs(historialStore);

  const isLoading = computed(() => status.value === "loading");

  const handleCreate = async () => {
    await router.push("/registros/sociedades/agregar");
  };

  return {
    sociedades,
    isLoading,
    handleCreate,
    // ...
  };
}
```

---

## 🧩 COMPONENTES COMPARTIDOS

### VistaHeader

**Ubicación:** `app/core/presentation/shared/components/VistaHeader.vue`

**Uso:**

```vue
<VistaHeader
  :icon="Building2"
  title="Título"
  description="Descripción"
>
  <template #right>
    <!-- Acciones del header -->
  </template>
</VistaHeader>
```

**Características:**
- Icono con gradiente
- Título y descripción
- Slot `#right` para acciones
- Slot `#left` para contenido personalizado

### ActionButton

**Ubicación:** `app/core/presentation/[dominio]/vistas/[vista]/components/molecules/ActionButton.vue`

**Uso:**

```vue
<ActionButton
  variant="primary"
  size="md"
  label="Crear Sociedad"
  :icon="Plus"
  button-class="shadow-md hover:shadow-lg transition-all"
  icon-class="h-4 w-4"
  label-class="ml-2"
  @click="handleCreate"
/>
```

**Props:**
- `variant`: `primary` | `outline` | `destructive`
- `size`: `sm` | `md` | `lg`
- `label`: string
- `icon`: Componente de lucide-vue-next
- `button-class`: Clases adicionales para el botón
- `icon-class`: Clases para el icono
- `label-class`: Clases para el label
- `disabled`: boolean

### CustomTable

**Ubicación:** `app/components/tables/CustomTable.vue`

**Uso:**

```vue
<CustomTable
  :config="tableConfig"
  :data="data"
  :is-loading="isLoading"
  :cell-renderers="cellRenderers"
  :actions="actions"
  empty-message="Mensaje cuando no hay datos"
>
  <!-- Slots personalizados -->
  <template #cell-razonSocial="{ rowData }">
    <SociedadCard :razon-social="rowData.razonSocial" />
  </template>
</CustomTable>
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Estructura de Archivos

- [ ] Crear carpeta `vistas/[nombre-vista]/`
- [ ] Crear `components/[NombreVista]Manager.vue`
- [ ] Crear `components/organisms/` y `components/molecules/`
- [ ] Crear `composables/use[NombreVista].ts`
- [ ] Crear `types/[nombre-vista].types.ts`

### Componentes

- [ ] Manager component con `VistaHeader` y `vista-container`
- [ ] Organisms con estilos scoped y media queries
- [ ] Molecules con props bien definidas
- [ ] Uso de variables CSS (`var(--text-primary)`, etc.)

### Estilos

- [ ] Media queries con 3 breakpoints
- [ ] Padding responsivo (1rem → 1.25rem → 1.5rem)
- [ ] Font sizes responsivos
- [ ] Uso de `vista-container` para contenido principal

### Lógica

- [ ] Composable que orquesta la vista
- [ ] Integración con stores (si aplica)
- [ ] Handlers para acciones
- [ ] Estados de loading/error

### Componentes Compartidos

- [ ] Usar `VistaHeader` para headers
- [ ] Usar `ActionButton` para botones con iconos
- [ ] Usar `CustomTable` para tablas (si aplica)

---

## 📚 REFERENCIAS

- **Proyecto UI:** `/home/yull23/workspaces/probo/probo-frontend-v30-ui`
- **Ejemplo Historial:** `app/core/presentation/registros/sociedades/vistas/historial/`
- **Ejemplo Agregar:** `app/core/presentation/registros/sociedades/vistas/agregar/`
- **Componentes Compartidos:** `app/core/presentation/shared/components/`

---

**Última actualización:** Diciembre 2024








