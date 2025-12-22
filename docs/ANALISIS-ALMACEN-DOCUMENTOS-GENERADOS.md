# Análisis: Almacén y Documentos Generados

## 📋 Resumen del Problema

Existen **dos formas de acceder a Documentos Generados** que resultan en **vistas diferentes** y **breadcrumbs inconsistentes**:

1. **Desde el Sidebar**: `/storage/documentos-generados` → Vista A (con selector de categorías)
2. **Desde Almacén**: Click en "Documentos Generados" → `/storage/documentos-generados/{id}/operaciones/` → Vista B (directo a operaciones)

Al navegar por subcarpetas, el breadcrumb se confunde y termina mostrando la estructura de la Vista A.

---

## 🗂️ Estructura de Almacén

### Rutas

```
/storage/almacen
/storage/almacen/[idSociety]
/storage/almacen/[idSociety]/[...path]
```

### Componente Principal

- **Archivo**: `app/components/repository/AlmacenView.vue`
- **Página**: `app/pages/storage/almacen/[idSociety]/[...path].vue`

### Características

1. **Breadcrumb**: `Almacén` → `Carpeta 1` → `Carpeta 2` → ...
2. **Navegación**: Basada en IDs de carpetas en la ruta
3. **Botón "Documentos Generados"**:
   - Ubicación: Solo visible en la raíz (`!carpetaActual`)
   - Acción: `navigateToDocumentosGenerados()`
   - Ruta destino: `/storage/documentos-generados/${idSociety}/operaciones/`

### Código del Botón

```typescript
const navigateToDocumentosGenerados = () => {
  if (dashboardStore.sociedadSeleccionada?.id) {
    router.push(
      `/storage/documentos-generados/${dashboardStore.sociedadSeleccionada.id}/operaciones/`
    );
  }
};
```

### Breadcrumb en Almacén

```typescript
const breadcrumbFromRoute = computed(() => {
  const items: Array<{ id: string; nombre: string }> = [];

  // Siempre incluir "Almacén" como primer nivel
  items.push({
    id: "almacen",
    nombre: "Almacén",
  });

  // Si estamos en la raíz, solo mostrar "Almacén"
  if (routePath.value.length === 0) return items;

  // Construir breadcrumb desde la ruta
  routePath.value.forEach((folderId) => {
    // Buscar nombre en cache o documentos actuales
    // ...
  });

  return items;
});
```

---

## 📄 Estructura de Documentos Generados

### Rutas

```
/storage/documentos-generados
/storage/documentos-generados/index.vue
/storage/documentos-generados/[idSociety]/operaciones/[...path]
```

### Componentes Principales

1. **Index**: `app/pages/storage/documentos-generados/index.vue`

   - Muestra selector de sociedad
   - Muestra botón "Operaciones" (si hay sociedad seleccionada)
   - NO redirige automáticamente

2. **Vista Principal**: `app/pages/storage/documentos-generados/[idSociety]/operaciones/[...path].vue`

   - Usa `DocumentosGeneradosView.vue`
   - Maneja la navegación por carpetas

3. **Componente**: `app/components/repository/DocumentosGeneradosView.vue`
   - Lógica de navegación
   - Breadcrumb
   - Carga de documentos

### Breadcrumb en Documentos Generados

```typescript
const breadcrumb = computed(() => {
  const items: Array<{ id: string; nombre: string }> = [];

  // Siempre incluir "Documentos Generados" como primer nivel
  items.push({
    id: "documentos-generados",
    nombre: "Documentos Generados",
  });

  // Siempre incluir "Operaciones" como segundo nivel
  items.push({
    id: "operaciones",
    nombre: documentosGenerados.value?.operaciones?.nombre || "Operaciones",
  });

  if (currentPath.value.length === 0) return items;

  // Nivel 1: junta-accionistas o directorio
  if (currentPath.value.length > 0) {
    const nivel1 = currentPath.value[0];
    if (nivel1 === "junta-accionistas") {
      items.push({
        id: "junta-accionistas",
        nombre:
          documentosGenerados.value?.operaciones?.carpetas?.juntas?.nombre ||
          "Juntas de Accionistas",
      });
    }
  }

  // Nivel 2: carpeta de junta específica (carpeta-XX)
  if (currentPath.value.length > 1) {
    const carpetaId = currentPath.value[1];
    if (carpetaId && carpetaId.startsWith("carpeta-")) {
      // Buscar en cache o en juntas
      // ...
    }
  }

  // Nivel 3: carpeta de documentos dentro de junta
  if (currentPath.value.length > 2) {
    const carpetaDocumentosId = currentPath.value[2];
    // Buscar en cache o en documentosCarpeta
    // ...
  }

  return items;
});
```

### Estructura de Navegación

```
/storage/documentos-generados/{id}/operaciones/
  ├── /operaciones/ (raíz - muestra "Directorio" y "Juntas de Accionistas")
  ├── /operaciones/junta-accionistas (nivel 1 - lista de juntas)
  ├── /operaciones/junta-accionistas/carpeta-{nodeId} (nivel 2 - carpeta de junta)
  └── /operaciones/junta-accionistas/carpeta-{nodeId}/{carpetaDocumentosId} (nivel 3 - documentos)
```

---

## 🔗 Cómo Están Relacionados

### Flujo desde Almacén

1. Usuario está en `/storage/almacen/{idSociety}`
2. Ve el botón "Documentos Generados" (solo en raíz)
3. Click → Navega a `/storage/documentos-generados/{idSociety}/operaciones/`
4. **Problema**: Salta directamente a operaciones, sin pasar por el index

### Flujo desde Sidebar

1. Usuario hace click en "Documentos Generados" en el sidebar
2. Navega a `/storage/documentos-generados`
3. Ve el index con selector de sociedad
4. Click en "Operaciones" → Navega a `/storage/documentos-generados/{id}/operaciones/`
5. **Problema**: El breadcrumb se construye diferente porque pasó por el index

### El Problema del Breadcrumb

**Cuando vienes desde Almacén:**

- Ruta: `/storage/documentos-generados/{id}/operaciones/junta-accionistas/carpeta-26/31`
- Breadcrumb esperado: `Documentos Generados > Operaciones > Juntas de Accionistas > Carpeta 26 > Carpeta 31`
- Breadcrumb actual: Puede mostrar estructura incorrecta porque el `currentPath` se calcula diferente

**Cuando vienes desde Sidebar:**

- Ruta: `/storage/documentos-generados/{id}/operaciones/junta-accionistas/carpeta-26/31`
- Breadcrumb esperado: `Documentos Generados > Operaciones > Juntas de Accionistas > Carpeta 26 > Carpeta 31`
- Breadcrumb actual: Funciona correctamente porque pasó por el index

---

## 🐛 Problemas Identificados

### 1. Dos Formas de Acceso Diferentes

- **Desde Almacén**: Salta directamente a `/operaciones/` sin pasar por el index
- **Desde Sidebar**: Pasa por el index primero
- **Resultado**: Estados diferentes del componente

### 2. Breadcrumb Inconsistente

- El breadcrumb en `DocumentosGeneradosView` depende de `currentPath`
- `currentPath` se calcula desde `route.params.path`
- Cuando vienes desde Almacén, el path puede no estar sincronizado correctamente

### 3. Navegación por Breadcrumb Rota

- La función `navigateToBreadcrumb` usa `currentPath.value.slice(0, index - 1)`
- Si el `currentPath` está mal calculado, la navegación falla
- El cálculo `index - 1` asume que index 0 y 1 son fijos, pero puede no ser así

### 4. Falta de Sincronización

- Cuando navegas desde Almacén a Documentos Generados, el estado no se sincroniza
- El `currentPath` puede no reflejar correctamente la ruta actual

---

## 🔍 Análisis del Código

### `currentPath` en DocumentosGeneradosView

```typescript
const currentPath = computed(() => {
  const path = route.params.path;
  let segments: string[] = [];

  if (Array.isArray(path)) {
    segments = path.filter((p) => p && typeof p === "string" && p.trim() !== "");
  } else if (typeof path === "string" && path.trim() !== "") {
    segments = [path];
  }

  console.log("🔵 [DocumentosGeneradosView] currentPath computed:", {
    routeParamsPath: route.params.path,
    segments,
    routePath: route.path,
  });

  return segments;
});
```

**Problema**: Si la ruta es `/storage/documentos-generados/{id}/operaciones/junta-accionistas/carpeta-26`, el `route.params.path` debería ser `["junta-accionistas", "carpeta-26"]`, pero puede no estar parseado correctamente.

### `navigateToBreadcrumb` en DocumentosGeneradosView

```typescript
const navigateToBreadcrumb = async (index: number) => {
  // ...
  // El breadcrumb tiene:
  // index 0 = "Documentos Generados" → /storage/documentos-generados/{id}/operaciones/
  // index 1 = "Operaciones" → /storage/documentos-generados/{id}/operaciones/
  // index 2 = "Juntas de Accionistas" → currentPath[0]
  // index 3 = "carpeta-XX" → currentPath[0] + currentPath[1]
  // index 4 = carpeta de documentos → currentPath[0] + currentPath[1] + currentPath[2]

  const targetPath = currentPath.value.slice(0, index - 1); // -1 porque index 0 y 1 son fijos

  if (targetPath.length === 0) {
    router.push(`/storage/documentos-generados/${idSociety.value}/operaciones/`);
  } else {
    const pathString = targetPath.join("/");
    router.push(`/storage/documentos-generados/${idSociety.value}/operaciones/${pathString}`);
  }
};
```

**Problema**: El cálculo `index - 1` asume que siempre hay 2 niveles fijos (Documentos Generados y Operaciones), pero si el `currentPath` está mal, el slice puede dar resultados incorrectos.

---

## ✅ Soluciones Propuestas

### Solución 1: Unificar el Acceso

**Hacer que desde Almacén también pase por el index:**

- Cambiar `navigateToDocumentosGenerados` para que navegue a `/storage/documentos-generados` en lugar de `/storage/documentos-generados/{id}/operaciones/`
- El index redirigirá automáticamente si hay sociedad seleccionada

### Solución 2: Corregir el Breadcrumb

**Asegurar que el breadcrumb siempre se construya correctamente:**

- Mejorar el cálculo de `currentPath` para que siempre refleje la ruta real
- Validar que el `route.params.path` se parsea correctamente
- Agregar logs para debugging

### Solución 3: Sincronizar Estado

**Asegurar que el estado se sincronice correctamente:**

- Cuando se navega desde Almacén, asegurar que el store esté sincronizado
- Verificar que `idSociety` se obtiene correctamente de la ruta
- Asegurar que `currentPath` se calcula antes de construir el breadcrumb

### Solución 4: Mejorar `navigateToBreadcrumb`

**Hacer el cálculo del breadcrumb más robusto:**

- En lugar de usar `index - 1`, construir el path basándose en los items del breadcrumb
- Validar que el índice corresponde a un nivel válido
- Manejar casos edge (ruta vacía, path mal formado, etc.)

---

## 📝 Recomendación

**Implementar las 4 soluciones en este orden:**

1. **Solución 1** (Unificar acceso): Más importante, asegura consistencia
2. **Solución 2** (Corregir breadcrumb): Crítico para la navegación
3. **Solución 3** (Sincronizar estado): Asegura que todo funcione correctamente
4. **Solución 4** (Mejorar navegación): Robustez adicional

---

## 🧪 Casos de Prueba

### Caso 1: Desde Sidebar

1. Click en "Documentos Generados" en sidebar
2. Seleccionar sociedad (si no está seleccionada)
3. Click en "Operaciones"
4. Navegar a "Juntas de Accionistas"
5. Click en una junta
6. Navegar a subcarpeta
7. **Verificar**: Breadcrumb debe ser correcto en cada paso

### Caso 2: Desde Almacén

1. Ir a `/storage/almacen/{id}`
2. Click en "Documentos Generados"
3. Navegar a "Juntas de Accionistas"
4. Click en una junta
5. Navegar a subcarpeta
6. **Verificar**: Breadcrumb debe ser igual que en Caso 1

### Caso 3: Navegación por Breadcrumb

1. Estar en una subcarpeta profunda
2. Click en cada nivel del breadcrumb
3. **Verificar**: Debe navegar correctamente a cada nivel

### Caso 4: Cambio de Sociedad

1. Estar en Documentos Generados de una sociedad
2. Cambiar de sociedad desde el selector
3. **Verificar**: Debe redirigir correctamente y mantener el breadcrumb

---

## 📊 Estructura de Archivos

```
app/
├── pages/
│   └── storage/
│       ├── almacen.vue
│       ├── almacen/
│       │   └── [idSociety]/
│       │       └── [...path].vue
│       └── documentos-generados/
│           ├── index.vue
│           └── [idSociety]/
│               └── operaciones/
│                   └── [...path].vue
├── components/
│   └── repository/
│       ├── AlmacenView.vue
│       └── DocumentosGeneradosView.vue
└── core/
    └── presentation/
        └── repositorio/
            ├── composables/
            │   ├── useAlmacenamiento.ts
            │   └── useDocumentosGenerados.ts
            └── stores/
                ├── almacenamiento.store.ts
                └── repositorio-dashboard.store.ts
```

---

## 🎯 Próximos Pasos

1. ✅ Revisar y entender la estructura actual (COMPLETADO)
2. ⏳ Implementar Solución 1 (Unificar acceso)
3. ⏳ Implementar Solución 2 (Corregir breadcrumb)
4. ⏳ Implementar Solución 3 (Sincronizar estado)
5. ⏳ Implementar Solución 4 (Mejorar navegación)
6. ⏳ Probar todos los casos de uso
7. ⏳ Verificar que no se rompió nada

