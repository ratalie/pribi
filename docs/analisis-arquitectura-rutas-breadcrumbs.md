# 📊 Análisis de Arquitectura: Rutas y Breadcrumbs

**Fecha**: 11 de Diciembre 2025  
**Propósito**: Análisis de la arquitectura actual de rutas y breadcrumbs para preparar componentes atómicos

---

## 🎯 Objetivo

Implementar un sistema de navegación con:
1. ✅ Rutas dinámicas que reflejen la navegación (no solo SPA)
2. ✅ Breadcrumbs sincronizados con las rutas
3. ✅ Navegación bidireccional (rutas ↔ breadcrumbs)
4. ✅ Mismo comportamiento en Almacén y Documentos Generados

---

## 📁 Estructura de Rutas Actual

### **Almacén** (Nuevo - Implementado)

```
/storage/almacen/[idSociety]/[...path]
```

**Ejemplos:**
- `/storage/almacen/5` → Raíz del almacén
- `/storage/almacen/5/carpeta-32` → Dentro de carpeta 32
- `/storage/almacen/5/carpeta-32/carpeta-45` → Dentro de carpeta 45 dentro de 32

### **Documentos Generados** (Ya existente)

```
/storage/documentos-generados/[idSociety]/operaciones/[...path]
```

**Ejemplos:**
- `/storage/documentos-generados/5/operaciones/` → Operaciones
- `/storage/documentos-generados/5/operaciones/junta-accionistas` → Juntas
- `/storage/documentos-generados/5/operaciones/junta-accionistas/carpeta-26` → Carpeta de junta

---

## 🏗️ Arquitectura de Componentes

### **Niveles de Componentes (Atomic Design)**

```
Pages (Páginas)
  └── storage/
      ├── almacen.vue (Redirige a ruta dinámica)
      └── almacen/[idSociety]/[...path].vue (Ruta dinámica)
      
Components (Componentes)
  └── repository/
      ├── AlmacenView.vue (Vista principal)
      ├── DocumentosGeneradosView.vue (Vista principal)
      ├── Breadcrumb.vue (Componente atómico - FUTURO)
      ├── FolderCard.vue (Componente atómico - FUTURO)
      └── DocumentCard.vue (Componente atómico - FUTURO)
```

---

## 🔄 Flujo de Navegación

### **1. Navegación hacia adelante (Click en carpeta)**

```
Usuario click en carpeta
  ↓
AlmacenView.navegarACarpeta(carpetaId)
  ↓
1. Actualizar ruta: router.push(`/storage/almacen/${idSociety}/${path}/${carpetaId}`)
2. Navegar en store: store.navegarACarpeta(carpetaId)
  ↓
Watch detecta cambio de ruta
  ↓
Cargar documentos de la carpeta
  ↓
Breadcrumb se actualiza automáticamente desde routePath
```

### **2. Navegación hacia atrás (Click en breadcrumb)**

```
Usuario click en breadcrumb[index]
  ↓
AlmacenView.navegarABreadcrumb(index)
  ↓
1. Calcular targetPath: routePath.slice(0, index + 1)
2. Actualizar ruta: router.push(`/storage/almacen/${idSociety}/${targetPath}`)
3. Navegar en store: store.navegarACarpeta(carpetaId)
  ↓
Watch detecta cambio de ruta
  ↓
Cargar documentos de la carpeta objetivo
```

### **3. Navegación directa (URL directa o refresh)**

```
Usuario entra a URL: /storage/almacen/5/carpeta-32/carpeta-45
  ↓
Page component lee route.params.path
  ↓
AlmacenView.routePath computed extrae: ["carpeta-32", "carpeta-45"]
  ↓
Watch detecta routePath
  ↓
1. Cargar nombres de carpetas del backend (cache)
2. Navegar a última carpeta: store.navegarACarpeta("carpeta-45")
  ↓
Breadcrumb se construye desde routePath + cache de nombres
```

---

## 💾 Estado y Sincronización

### **Estado en Store (Pinia)**

```typescript
// almacenamiento.store.ts
state: {
  documentos: DocumentoSocietario[],
  carpetaActual: string | null, // ID de carpeta actual
  breadcrumb: Array<{ id: string; nombre: string }>, // DEPRECADO - usar ruta
}
```

### **Estado en Componente (AlmacenView)**

```typescript
// AlmacenView.vue
const routePath = computed(() => {
  // Extrae path de route.params.path
  return [...]
});

const breadcrumbFromRoute = computed(() => {
  // Construye breadcrumb desde routePath + cache de nombres
  return [...]
});

const folderNamesCache = ref<Record<string, string>>({});
```

### **Sincronización**

```
Ruta (Source of Truth)
  ↓
routePath computed
  ↓
breadcrumbFromRoute computed
  ↓
UI (Breadcrumb + Documentos)
```

**Ventajas:**
- ✅ La ruta es la fuente de verdad
- ✅ Refresh mantiene la navegación
- ✅ Compartir URL funciona
- ✅ Historial del navegador funciona

---

## 🔧 Implementación Actual

### **AlmacenView.vue**

**Funciones clave:**
1. `navegarACarpeta(carpetaId)` - Navega hacia adelante
2. `navegarABreadcrumb(index)` - Navega hacia atrás
3. `breadcrumbFromRoute` - Computed que construye breadcrumb desde ruta
4. `loadFolderName(folderId)` - Carga nombre de carpeta del backend

**Watch:**
- `routePath` → Sincroniza ruta con store
- `sociedadSeleccionada` → Redirige si cambia sociedad

### **DocumentosGeneradosView.vue**

**Ya implementado:**
- ✅ Rutas dinámicas con `[...path]`
- ✅ Breadcrumb desde `currentPath`
- ✅ Navegación con `router.push`

**Mejoras necesarias:**
- ⚠️ Verificar sincronización breadcrumb ↔ ruta
- ⚠️ Cache de nombres de carpetas

---

## 🎨 Componentes Atómicos (Futuro)

### **1. Breadcrumb.vue** (Molecule)

```vue
<template>
  <nav class="breadcrumb">
    <button @click="$emit('navigate', index)" v-for="(item, index) in items">
      {{ item.nombre }}
    </button>
  </nav>
</template>

<script setup>
interface Props {
  items: Array<{ id: string; nombre: string }>;
}
</script>
```

**Uso:**
```vue
<Breadcrumb 
  :items="breadcrumbFromRoute" 
  @navigate="navegarABreadcrumb"
/>
```

### **2. FolderCard.vue** (Molecule)

```vue
<template>
  <div @click="$emit('click', folder)">
    <FolderIcon />
    <span>{{ folder.nombre }}</span>
  </div>
</template>
```

### **3. DocumentCard.vue** (Molecule)

```vue
<template>
  <div @click="$emit('click', document)">
    <FileIcon />
    <span>{{ document.nombre }}</span>
  </div>
</template>
```

### **4. FolderGrid.vue** (Organism)

```vue
<template>
  <div class="grid">
    <FolderCard 
      v-for="folder in folders"
      :key="folder.id"
      :folder="folder"
      @click="$emit('navigate', folder.id)"
    />
  </div>
</template>
```

---

## 📋 Checklist de Implementación

### ✅ Completado

- [x] Ruta dinámica para almacén: `/storage/almacen/[idSociety]/[...path]`
- [x] Sincronización ruta ↔ breadcrumb en AlmacenView
- [x] Navegación con `router.push`
- [x] Cache de nombres de carpetas
- [x] Watch para sincronizar ruta con store

### ⏳ Pendiente

- [ ] Verificar breadcrumbs en DocumentosGeneradosView
- [ ] Crear componente atómico `Breadcrumb.vue`
- [ ] Crear componente atómico `FolderCard.vue`
- [ ] Crear componente atómico `DocumentCard.vue`
- [ ] Refactorizar AlmacenView para usar componentes atómicos
- [ ] Refactorizar DocumentosGeneradosView para usar componentes atómicos

---

## 🚀 Próximos Pasos

1. **Verificar DocumentosGeneradosView**
   - Asegurar que breadcrumbs funcionan correctamente
   - Implementar cache de nombres si falta

2. **Crear Componentes Atómicos**
   - `Breadcrumb.vue`
   - `FolderCard.vue`
   - `DocumentCard.vue`

3. **Refactorizar Vistas**
   - Extraer lógica común a composables
   - Usar componentes atómicos en lugar de HTML inline

4. **Testing**
   - Probar navegación hacia adelante
   - Probar navegación hacia atrás
   - Probar refresh de página
   - Probar compartir URL

---

## 📝 Notas Técnicas

### **Cache de Nombres**

El cache `folderNamesCache` almacena los nombres de las carpetas para evitar múltiples requests al backend. Se limpia cuando se navega a la raíz.

### **Sincronización Bidireccional**

```
Usuario → Click carpeta → router.push → Watch ruta → Store
Usuario → Click breadcrumb → router.push → Watch ruta → Store
Usuario → URL directa → Watch ruta → Store
```

La ruta es siempre la fuente de verdad.

---

**Fin del análisis**

