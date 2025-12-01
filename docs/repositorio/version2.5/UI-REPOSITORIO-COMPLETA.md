# 🎨 Documentación Completa de la UI del Repositorio Probo AI

## 📋 Índice

1. [Visión General](#visión-general)
2. [Estructura de Componentes](#estructura-de-componentes)
3. [Layout Principal](#layout-principal)
4. [Componentes de Carpetas](#componentes-de-carpetas)
5. [Componentes de Archivos](#componentes-de-archivos)
6. [Componentes de Búsqueda](#componentes-de-búsqueda)
7. [Componentes de Preview](#componentes-de-preview)
8. [Estilos y Temas](#estilos-y-temas)
9. [Guía de Migración a Dashboard](#guía-de-migración-a-dashboard)

---

## 🎯 Visión General

Esta documentación describe **completamente** la estructura, componentes y estilos de la UI del Repositorio Probo AI para facilitar su replicación en un dashboard o cualquier otra vista.

### Arquitectura de la UI

```
RepositoryLayout (Layout Principal)
├── Header (Breadcrumbs, Search, Actions)
├── Upload Area (Drag & Drop)
└── Content Area
    ├── Index.vue (Vista Principal)
    │   ├── Carpetas del Sistema
    │   └── Carpetas Personalizadas
    ├── FolderList (Lista de Carpetas)
    │   └── FolderCard (Tarjeta de Carpeta)
    ├── FileList (Lista de Archivos)
    │   └── FileCard (Tarjeta de Archivo)
    └── DocumentViewer (Preview de Documentos)
```

---

## 🏗️ Estructura de Componentes

### Ubicación de Archivos

```
src/modules/probo-ai/
├── layouts/
│   └── RepositoryLayout.vue          # Layout principal
├── pages/
│   └── repository/
│       └── Index.vue                 # Vista principal del repositorio
├── components/
│   └── repository/
│       ├── common/                   # Componentes comunes
│       │   ├── folder/               # Componentes de carpetas
│       │   │   ├── FolderList.vue
│       │   │   └── FolderCard.vue
│       │   ├── files/                # Componentes de archivos
│       │   │   ├── FileList.vue
│       │   │   └── FileCard.vue
│       │   ├── SearchBar.vue         # Barra de búsqueda
│       │   ├── LoadingSpinner.vue    # Spinner de carga
│       │   ├── EmptyState.vue        # Estado vacío
│       │   └── InfoPopover.vue       # Popover informativo
│       ├── modals/                   # Modales
│       │   ├── AddPersonalizedFolderModal.vue
│       │   ├── RenameFolderModal.vue
│       │   ├── ShareFolderModal.vue
│       │   └── UploadDocumentsModal.vue
│       └── documentPreview/          # Preview de documentos
│           ├── DocumentViewer.vue
│           ├── DocumentHeader.vue
│           ├── DocumentToolbar.vue
│           └── DocumentSidebar.vue
```

---

## 📐 Layout Principal

### RepositoryLayout.vue

**Ubicación**: `src/modules/probo-ai/layouts/RepositoryLayout.vue`

**Propósito**: Layout contenedor principal que proporciona estructura común a todas las vistas del repositorio.

#### Estructura Visual

```
┌─────────────────────────────────────────────────────────┐
│ Header (Breadcrumbs + Título)                          │
├─────────────────────────────────────────────────────────┤
│ Search Bar | View Toggle | Action Buttons              │
├─────────────────────────────────────────────────────────┤
│ Upload Area (Drag & Drop) [Opcional]                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Content Area (Scrollable)                               │
│   - Carpetas del Sistema                                │
│   - Carpetas Personalizadas                             │
│   - Archivos                                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Props

```typescript
interface Props {
  companyName: string;              // Nombre de la empresa
  breadcrumbs: BreadcrumbItem[];    // Breadcrumbs de navegación
}
```

#### Slots

- `#search`: Barra de búsqueda
- `#actions`: Botones de acción (ej: "Crear Carpeta")
- `default`: Contenido principal (carpetas y archivos)

#### Características Clave

1. **Breadcrumbs Dinámicos**:
   - Navegación jerárquica
   - Click en breadcrumb → navega a esa carpeta
   - Muestra ellipsis (...) si hay muchos niveles

2. **Barra de Búsqueda**:
   - Slot para componente de búsqueda personalizado
   - Ocupa espacio flexible

3. **Toggle de Vista**:
   - Vista de lista (list)
   - Vista de mosaico (grid)
   - Persistencia en localStorage

4. **Área de Subida**:
   - Drag & Drop de archivos
   - Múltiples archivos
   - Validación de tipos

#### Estilos Principales

```css
/* Header */
.bg-white {
  background-color: white;
}
.border-b {
  border-bottom: 1px solid var(--layout-gray-100);
}
.text-layout-gray-800 {
  color: var(--layout-gray-800);
}

/* Breadcrumbs */
.text-primary-600 {
  color: var(--layout-primary-600);
}
.hover\:text-layout-gray-900:hover {
  color: var(--layout-gray-900);
}

/* Content Area */
.max-h-[calc(100dvh-245px)] {
  max-height: calc(100dvh - 245px);
}
.overflow-y-auto {
  overflow-y: auto;
}
```

---

## 📁 Componentes de Carpetas

### FolderList.vue

**Ubicación**: `src/modules/probo-ai/components/repository/common/folder/FolderList.vue`

**Propósito**: Renderiza una lista de carpetas en vista de lista o mosaico.

#### Props

```typescript
interface Props {
  folders: RepositoryFolder[];
}
```

#### Events

```typescript
interface Events {
  open: [folder: RepositoryFolder];
  rename: [folder: RepositoryFolder];
  download: [folder: RepositoryFolder];
  share: [folder: RepositoryFolder];
  delete: [folder: RepositoryFolder];
  chat: [folder: RepositoryFolder];
}
```

#### Vista de Mosaico (Grid)

```vue
<div class="flex flex-row gap-4 flex-wrap">
  <RepositoryFolderCard
    v-for="folder in folders"
    :key="folder.id"
    :name="folder.name"
    :count="folder.count"
    :lastModified="folder.lastModified"
    ...
  />
</div>
```

**Estilos**:
- `flex flex-row gap-4 flex-wrap`: Grid flexible con gap de 16px

#### Vista de Lista

```vue
<div class="bg-white overflow-hidden">
  <!-- Headers -->
  <div class="flex items-center px-4 py-3 border-b ...">
    <div class="flex-1">Nombre</div>
    <div class="w-72 text-center">Última Modificación</div>
    <div class="w-48 text-center">Tamaño</div>
    <div class="w-20"></div>
  </div>
  
  <!-- Folders -->
  <RepositoryFolderCard ... />
</div>
```

**Estilos**:
- Headers con `font-semibold text-sm`
- Columnas con anchos fijos
- Border entre headers y contenido

---

### FolderCard.vue

**Ubicación**: `src/modules/probo-ai/components/repository/common/folder/FolderCard.vue`

**Propósito**: Tarjeta individual de carpeta (usada en ambas vistas).

#### Props Principales

```typescript
interface Props {
  name: string;                      // Nombre de la carpeta
  count: number | string;            // Cantidad de items
  lastModified: string;              // Fecha de última modificación
  isPersonalizedFolder?: boolean;    // Si es carpeta personalizada
  hasAIChatAccess?: boolean;         // Si tiene chat con IA
  sizeInBytes?: number;              // Tamaño en bytes
  fileCount?: number;                // Cantidad de archivos
  description?: string;               // Descripción
}
```

#### Características Visuales

**Vista de Mosaico**:
- Tarjeta con sombra y hover
- Icono de carpeta
- Nombre destacado
- Información secundaria (count, fecha)
- Menú de acciones (3 puntos)

**Vista de Lista**:
- Fila de tabla
- Mismo contenido pero en formato horizontal
- Acciones alineadas a la derecha

#### Acciones Disponibles

1. **Abrir**: Navegar a la carpeta
2. **Renombrar**: Cambiar nombre
3. **Descargar**: Descargar carpeta como ZIP
4. **Compartir**: Compartir con otros usuarios
5. **Eliminar**: Eliminar carpeta
6. **Chat**: Iniciar chat con IA (si tiene acceso)
7. **Agregar a Carpeta Personalizada**: Enlazar a otra carpeta

#### Estilos Clave

```css
/* Vista Mosaico */
.folder-card {
  background: white;
  border: 1px solid var(--layout-gray-200);
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s;
}

.folder-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Vista Lista */
.folder-row {
  border-bottom: 1px solid var(--layout-gray-200);
  padding: 12px 16px;
}

.folder-row:hover {
  background-color: var(--layout-gray-50);
}
```

---

## 📄 Componentes de Archivos

### FileList.vue

**Ubicación**: `src/modules/probo-ai/components/repository/common/files/FileList.vue`

**Propósito**: Renderiza lista de archivos (similar a FolderList).

#### Estructura

Similar a `FolderList.vue` pero para archivos:
- Vista de mosaico con `FileCard`
- Vista de lista con tabla
- Mismo sistema de toggle

---

### FileCard.vue

**Ubicación**: `src/modules/probo-ai/components/repository/common/files/FileCard.vue`

**Propósito**: Tarjeta individual de archivo.

#### Características

1. **Thumbnail/Preview**:
   - Muestra preview del documento
   - Fallback a icono según tipo
   - Lazy loading

2. **Información**:
   - Nombre del archivo
   - Tamaño
   - Fecha de modificación
   - Tipo de archivo

3. **Acciones**:
   - Abrir/Preview
   - Descargar
   - Eliminar (si tiene permisos)
   - Agregar a carpeta personalizada

#### Estilos

```css
.file-card {
  position: relative;
  background: white;
  border: 1px solid var(--layout-gray-200);
  border-radius: 8px;
  overflow: hidden;
}

.file-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: var(--layout-gray-100);
}

.file-info {
  padding: 12px;
}
```

---

## 🔍 Componentes de Búsqueda

### SearchBar.vue

**Ubicación**: `src/modules/probo-ai/components/repository/common/SearchBar.vue`

**Propósito**: Barra de búsqueda con funcionalidades avanzadas.

#### Características

1. **Búsqueda en Tiempo Real**:
   - Debounce de 300ms
   - Búsqueda semántica
   - Búsqueda por texto

2. **Filtros**:
   - Por tipo de archivo
   - Por origen (Documentos Generados / Otros)
   - Por fecha

3. **Resultados**:
   - Muestra resultados mientras escribe
   - Opción para ir a página de resultados
   - Opción para iniciar chat con IA

#### Estilos

```css
.search-bar {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--layout-gray-300);
  border-radius: 6px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--layout-primary-500);
  box-shadow: 0 0 0 3px rgba(var(--layout-primary-500), 0.1);
}
```

---

## 👁️ Componentes de Preview

### DocumentViewer.vue

**Ubicación**: `src/modules/probo-ai/components/repository/documentPreview/DocumentViewer.vue`

**Propósito**: Visor completo de documentos con preview, zoom, y metadata.

#### Estructura

```
┌─────────────────────────────────────────────────────────┐
│ DocumentHeader (Título, Ruta, Versión, Cerrar)          │
├─────────────────────────────────────────────────────────┤
│ DocumentToolbar (Zoom, Paginación, Acciones)            │
├──────────────────────┬──────────────────────────────────┤
│                      │                                    │
│ DocumentPreview      │ DocumentSidebar                    │
│ (Contenido)          │ (Metadata, Historial)              │
│                      │                                    │
│                      │                                    │
└──────────────────────┴──────────────────────────────────┘
```

#### Componentes Modulares

1. **DocumentHeader.vue**:
   - Título del documento
   - Ruta completa
   - Información de versión
   - Botón cerrar

2. **DocumentToolbar.vue**:
   - Controles de zoom (+, -, 100%)
   - Navegación de páginas
   - Botones de acción (descargar, imprimir, más opciones)
   - Toggle de sidebar

3. **DocumentPreview.vue**:
   - Renderizado de PDF (PDF.js)
   - Renderizado de Office (Mammoth, SheetJS)
   - Manejo de errores
   - Loading states

4. **DocumentSidebar.vue**:
   - Tabs (General, Historial)
   - Metadata editable
   - Historial de versiones
   - Subir nueva versión

#### Estilos

```css
.document-viewer {
  position: fixed;
  inset: 0;
  background: var(--gray-900);
  z-index: 50;
  display: flex;
  flex-direction: column;
}

.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--gray-100);
  overflow: hidden;
}

.sidebar {
  width: 25%;
  min-width: 25%;
  background: white;
  border-left: 1px solid var(--layout-gray-200);
  display: flex;
  flex-direction: column;
}
```

---

## 🎨 Estilos y Temas

### Variables CSS Principales

```css
/* Colores Primarios */
--layout-primary-500: #6366f1;
--layout-primary-600: #4f46e5;
--layout-primary-700: #4338ca;

/* Colores Grises */
--layout-gray-50: #f9fafb;
--layout-gray-100: #f3f4f6;
--layout-gray-200: #e5e7eb;
--layout-gray-300: #d1d5db;
--layout-gray-400: #9ca3af;
--layout-gray-500: #6b7280;
--layout-gray-600: #4b5563;
--layout-gray-700: #374151;
--layout-gray-800: #1f2937;
--layout-gray-900: #111827;

/* Tipografía */
--font-primary: 'Inter', sans-serif;
--font-secondary: 'Inter', sans-serif;
```

### Clases de Utilidad Tailwind

```css
/* Espaciado */
.p-6 { padding: 1.5rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.gap-4 { gap: 1rem; }

/* Bordes */
.border-b { border-bottom-width: 1px; }
.border-layout-gray-200 { border-color: var(--layout-gray-200); }
.rounded-lg { border-radius: 0.5rem; }

/* Tipografía */
.text-lg { font-size: 1.125rem; }
.font-semibold { font-weight: 600; }
.text-layout-gray-800 { color: var(--layout-gray-800); }

/* Flexbox */
.flex { display: flex; }
.flex-1 { flex: 1 1 0%; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
```

---

## 🔄 Guía de Migración a Dashboard

### Consideraciones

Al migrar la UI del repositorio a un dashboard, considera:

#### 1. Estructura de Layout

**Actual (Repositorio)**:
- Layout vertical con header fijo
- Contenido scrollable
- Sidebar opcional (solo en preview)

**Dashboard (Propuesto)**:
- Layout con sidebar de navegación
- Área principal con múltiples secciones
- Widgets y cards informativos

#### 2. Componentes Reutilizables

**Componentes que puedes reutilizar directamente**:

✅ **FolderCard.vue**: Para mostrar carpetas en dashboard
✅ **FileCard.vue**: Para mostrar archivos recientes
✅ **SearchBar.vue**: Para búsqueda global
✅ **LoadingSpinner.vue**: Para estados de carga
✅ **EmptyState.vue**: Para estados vacíos

**Componentes a adaptar**:

⚠️ **FolderList.vue**: Adaptar a grid de dashboard
⚠️ **RepositoryLayout.vue**: Reemplazar con layout de dashboard
⚠️ **Index.vue**: Convertir en secciones de dashboard

#### 3. Nuevos Componentes Necesarios

1. **DashboardLayout.vue**:
   - Sidebar de navegación
   - Header con búsqueda global
   - Área de contenido con grid

2. **DashboardSection.vue**:
   - Sección de dashboard (ej: "Juntas Recientes")
   - Header con título y acciones
   - Grid de items

3. **StatsCard.vue**:
   - Tarjeta de estadísticas
   - Números destacados
   - Gráficos pequeños

4. **RecentActivity.vue**:
   - Lista de actividad reciente
   - Documentos recientes
   - Juntas recientes

#### 4. Estructura Propuesta para Dashboard

```
DashboardLayout
├── Sidebar (Navegación)
├── Main Content
│   ├── Header (Búsqueda Global, Notificaciones)
│   ├── Stats Section (Cards de estadísticas)
│   ├── Recent Juntas (Grid de juntas recientes)
│   ├── Recent Documents (Grid de documentos recientes)
│   └── Quick Actions (Acciones rápidas)
└── Modals (Mismos modales del repositorio)
```

#### 5. Migración de Estilos

**Mantener**:
- Variables CSS de colores
- Clases de utilidad Tailwind
- Componentes de UI base

**Adaptar**:
- Layout de flex a grid
- Espaciado para dashboard
- Tamaños de componentes

#### 6. Ejemplo de Componente Dashboard

```vue
<template>
  <DashboardLayout>
    <!-- Stats Section -->
    <DashboardSection title="Estadísticas">
      <div class="grid grid-cols-4 gap-4">
        <StatsCard
          title="Total Juntas"
          :value="totalJuntas"
          icon="folder"
        />
        <StatsCard
          title="Documentos"
          :value="totalDocuments"
          icon="file"
        />
        <!-- ... más stats -->
      </div>
    </DashboardSection>

    <!-- Recent Juntas -->
    <DashboardSection title="Juntas Recientes">
      <div class="grid grid-cols-3 gap-4">
        <FolderCard
          v-for="junta in recentJuntas"
          :key="junta.id"
          :name="junta.name"
          :lastModified="junta.lastModified"
          @open="openJunta"
        />
      </div>
    </DashboardSection>
  </DashboardLayout>
</template>
```

---

## 📊 Resumen de Componentes

### Componentes Core

| Componente | Ubicación | Propósito | Reutilizable en Dashboard |
|------------|-----------|-----------|---------------------------|
| RepositoryLayout | `layouts/RepositoryLayout.vue` | Layout principal | ⚠️ Adaptar |
| FolderList | `common/folder/FolderList.vue` | Lista de carpetas | ✅ Sí |
| FolderCard | `common/folder/FolderCard.vue` | Tarjeta de carpeta | ✅ Sí |
| FileList | `common/files/FileList.vue` | Lista de archivos | ✅ Sí |
| FileCard | `common/files/FileCard.vue` | Tarjeta de archivo | ✅ Sí |
| SearchBar | `common/SearchBar.vue` | Búsqueda | ✅ Sí |
| DocumentViewer | `documentPreview/DocumentViewer.vue` | Preview completo | ✅ Sí |

### Componentes de Soporte

| Componente | Ubicación | Propósito |
|------------|-----------|-----------|
| LoadingSpinner | `common/LoadingSpinner.vue` | Spinner de carga |
| EmptyState | `common/EmptyState.vue` | Estado vacío |
| InfoPopover | `common/InfoPopover.vue` | Popover informativo |
| AddPersonalizedFolderModal | `modals/AddPersonalizedFolderModal.vue` | Modal crear carpeta |
| RenameFolderModal | `modals/RenameFolderModal.vue` | Modal renombrar |
| ShareFolderModal | `modals/ShareFolderModal.vue` | Modal compartir |

---

## 🎯 Checklist para Migración

### Fase 1: Análisis
- [ ] Identificar componentes reutilizables
- [ ] Documentar dependencias entre componentes
- [ ] Listar estilos y temas necesarios
- [ ] Identificar funcionalidades específicas del repositorio

### Fase 2: Diseño Dashboard
- [ ] Diseñar layout del dashboard
- [ ] Definir secciones y widgets
- [ ] Planear navegación
- [ ] Diseñar componentes nuevos necesarios

### Fase 3: Implementación
- [ ] Crear DashboardLayout
- [ ] Migrar componentes reutilizables
- [ ] Crear componentes nuevos
- [ ] Adaptar estilos
- [ ] Integrar funcionalidades

### Fase 4: Testing
- [ ] Probar componentes individuales
- [ ] Probar integración
- [ ] Validar estilos y responsive
- [ ] Probar funcionalidades

---

**Última actualización**: Diciembre 2024  
**Versión**: 2.5.0


