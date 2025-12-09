# 📋 Estructura de Historial Reutilizable

> Sistema de componentes modulares para crear páginas de historial consistentes y bien dimensionadas.

---

## 🎯 Objetivo

Proporcionar una estructura unificada y reutilizable para todas las páginas de historial del sistema, con:
- ✅ Dimensionamiento adecuado (max-width: 1600px, centrado)
- ✅ Componentes modulares y reutilizables
- ✅ Diseño consistente entre todas las páginas
- ✅ Fácil de replicar y mantener

---

## 📦 Componentes Disponibles

### 1. `HistorialLayout.vue`
**Wrapper principal** que proporciona la estructura base con dimensionamiento.

**Props:**
- `showFooter?: boolean` - Mostrar footer con contador
- `total?: number` - Total para el contador
- `footerLabel?: string` - Label del footer (ej: "Sociedades", "Juntas")

**Slots:**
- `header` - Header de la página
- `default` - Contenido principal

**Ejemplo:**
```vue
<HistorialLayout
  :show-footer="true"
  :total="items.length"
  footer-label="Sociedades"
>
  <template #header>
    <!-- Header aquí -->
  </template>
  
  <!-- Contenido aquí -->
</HistorialLayout>
```

---

### 2. `HistorialHeader.vue`
**Header reutilizable** con título, descripción y acciones opcionales.

**Props:**
- `title: string` - Título principal
- `description?: string` - Descripción opcional
- `showActions?: boolean` - Mostrar área de acciones

**Slots:**
- `actions` - Botones de acción (opcional)

**Ejemplo:**
```vue
<HistorialHeader
  title="Registro de Sociedades"
  description="Gestiona aquí las sociedades: agrega, edita o elimina fácilmente"
  :show-actions="true"
>
  <template #actions>
    <Button>Agregar</Button>
    <Button variant="destructive">Eliminar Todas</Button>
  </template>
</HistorialHeader>
```

---

### 3. `HistorialFooter.vue`
**Footer sticky** con contador de totales.

**Props:**
- `total: number` - Número total de items
- `label: string` - Label (ej: "Sociedades", "Juntas")

**Ejemplo:**
```vue
<HistorialFooter
  :total="sociedades.length"
  label="Sociedades"
/>
```

---

## 🏗️ Estructura de Página Completa

### Template Base

```vue
<template>
  <HistorialLayout
    :show-footer="true"
    :total="items.length"
    footer-label="Items"
  >
    <template #header>
      <HistorialHeader
        title="Título del Historial"
        description="Descripción del historial"
        :show-actions="true"
      >
        <template #actions>
          <!-- Botones de acción aquí -->
        </template>
      </HistorialHeader>
    </template>

    <!-- Contenido principal -->
    <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CustomTable
        :config="tableConfig"
        :data="tableData"
        :is-loading="isLoading"
        :cell-renderers="cellRenderers"
        :actions="tableActions"
        :get-row-id="(row) => row.id"
        empty-message="Mensaje cuando no hay datos"
      >
        <!-- Slots personalizados para celdas -->
        <template #cell-estado="{ rowData }">
          <!-- Renderizado personalizado -->
        </template>
      </CustomTable>
    </div>
  </HistorialLayout>
</template>
```

---

## 📝 Guía de Implementación Paso a Paso

### Paso 1: Importar Componentes

```typescript
import HistorialLayout from "~/components/historial/HistorialLayout.vue";
import HistorialHeader from "~/components/historial/HistorialHeader.vue";
import CustomTable from "~/components/tables/CustomTable.vue";
```

### Paso 2: Crear Configuración de Tabla

```typescript
// app/config/tables/mi-historial.config.ts
import type { TableConfig } from "~/types/tables/table-config";

export const miHistorialTableConfig: TableConfig = {
  columns: [
    { id: 1, label: "Columna 1", key: "col1" },
    { id: 2, label: "Columna 2", key: "col2" },
    { id: 3, label: "", key: "options" }, // Columna de acciones
  ],
  gridClass: "grid grid-cols-[2fr_2fr_1fr]",
  containerClass: "",
};
```

### Paso 3: Definir Renderizadores y Acciones

```typescript
// Renderizadores personalizados
const cellRenderers: TableCellRenderer[] = [
  {
    columnKey: "col1",
    render: (rowData) => rowData.col1,
  },
  // ... más renderizadores
];

// Acciones del dropdown
const tableActions: TableAction[] = [
  {
    id: "edit",
    label: "Editar",
    icon: "Pencil",
    handler: (rowData) => goToEdit(rowData.id),
  },
  {
    id: "delete",
    label: "Eliminar",
    icon: "Trash2",
    destructive: true,
    handler: (rowData) => handleDelete(rowData.id),
  },
];
```

### Paso 4: Estructurar la Página

```vue
<script setup lang="ts">
// ... imports y lógica

const tableData = computed(() => items.value);
</script>

<template>
  <HistorialLayout
    :show-footer="true"
    :total="items.length"
    footer-label="Items"
  >
    <template #header>
      <HistorialHeader
        title="Mi Historial"
        description="Descripción del historial"
      />
    </template>

    <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
      <CustomTable
        :config="miHistorialTableConfig"
        :data="tableData"
        :is-loading="isLoading"
        :cell-renderers="cellRenderers"
        :actions="tableActions"
        :get-row-id="(row) => row.id"
      />
    </div>
  </HistorialLayout>
</template>
```

---

## 🎨 Características de Diseño

### Dimensionamiento
- **Max-width:** `1600px` (centrado con `mx-auto`)
- **Padding horizontal:** `px-8` (32px)
- **Padding vertical:** `py-6` (24px)
- **Background:** `bg-gray-50` para el layout, `bg-white` para las cards

### Cards/Contenedores
- **Border:** `border border-gray-200`
- **Shadow:** `shadow-sm`
- **Border radius:** `rounded-lg`
- **Padding interno:** Según necesidad (típicamente `p-6`)

### Espaciado
- **Gap entre elementos:** `space-y-6` (24px)
- **Gap en flex:** `gap-2` (8px) para botones

---

## 📚 Ejemplos Completos

### Ejemplo 1: Historial de Sociedades

Ver: `app/pages/registros/sociedades/historial.vue`

**Características:**
- ✅ Header con acciones (Test, Eliminar Todas)
- ✅ Tabla con CustomTable
- ✅ Footer con contador
- ✅ Renderizadores personalizados para estado y razón social

### Ejemplo 2: Historial de Juntas

Ver: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/historial.vue`

**Características:**
- ✅ Header simple (sin acciones)
- ✅ Selector de sociedad antes de la tabla
- ✅ Tabla con CustomTable
- ✅ Sin footer (opcional)

---

## 🔄 Replicación Rápida

### Checklist para Nueva Página de Historial

- [ ] Crear configuración de tabla en `app/config/tables/`
- [ ] Importar componentes: `HistorialLayout`, `HistorialHeader`, `CustomTable`
- [ ] Definir `cellRenderers` y `tableActions`
- [ ] Estructurar template con `HistorialLayout`
- [ ] Agregar `HistorialHeader` en slot `#header`
- [ ] Envolver `CustomTable` en card con estilos
- [ ] Agregar slots personalizados si es necesario
- [ ] Decidir si mostrar footer o no

---

## 🎯 Ventajas del Sistema

1. **Consistencia:** Todas las páginas de historial se ven igual
2. **Mantenibilidad:** Cambios en un componente afectan todas las páginas
3. **Dimensionamiento:** No ocupa 100% del ancho, mejor UX
4. **Reutilización:** Componentes modulares y flexibles
5. **Escalabilidad:** Fácil agregar nuevas páginas de historial

---

## 📍 Ubicación de Archivos

```
app/
├── components/
│   └── historial/
│       ├── HistorialLayout.vue      # Wrapper principal
│       ├── HistorialHeader.vue      # Header reutilizable
│       └── HistorialFooter.vue       # Footer con contador
├── components/
│   └── tables/
│       └── CustomTable.vue          # Tabla genérica
├── config/
│   └── tables/
│       ├── historial-juntas.config.ts
│       └── historial-sociedades.config.ts
└── pages/
    ├── registros/sociedades/historial.vue
    └── operaciones/.../historial.vue
```

---

## 🚀 Próximos Pasos

Para replicar en otras páginas de historial:

1. **Seguir la estructura base** del template
2. **Crear configuración de tabla** específica
3. **Definir renderizadores** según necesidades
4. **Agregar acciones** del dropdown
5. **Personalizar slots** si es necesario

---

**Última actualización:** Diciembre 2025

