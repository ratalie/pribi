# 📋 Plan de Refactorización: Vista de Descarga de Documentos

## 🎯 Objetivos

1. **Mejoras Inmediatas de UI/UX**
2. **Detección de Documentos Duplicados**
3. **Refactorización Completa con Arquitectura Hexagonal**
4. **Componentización Atómica**

---

## 📊 Análisis Actual

### Estructura Actual

```
app/
├── pages/
│   └── operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/descargar.vue
│       └── Usa: JuntaDocumentosGenerados.vue
│
├── components/
│   └── juntas/documentos/
│       ├── JuntaDocumentosGenerados.vue (344 líneas - MONOLÍTICO)
│       ├── HeaderExito.vue
│       ├── CategoriaDocumentos.vue
│       └── DocumentoItem.vue
│
├── composables/
│   ├── useDownloadData.ts
│   └── useEnviarDocumentosRepositorio.ts
│
└── core/
    ├── presentation/juntas/documentos/
    │   └── stores/documentos-generados.store.ts
    └── hexag/
        └── documentos/
            └── domain/entities/documento.entity.ts
```

### Problemas Identificados

1. **Componente Monolítico**: `JuntaDocumentosGenerados.vue` tiene 344 líneas y mezcla:
   - Lógica de negocio
   - Estado de UI
   - Llamadas a API
   - Renderizado

2. **Falta de Separación de Responsabilidades**:
   - El componente maneja selección, envío, descarga, generación
   - No hay separación clara entre presentación y lógica

3. **Falta Detección de Duplicados**:
   - No hay forma de saber si un documento ya existe en el repositorio
   - No hay opciones para actualizar/reemplazar

4. **UI/UX Mejorable**:
   - Checkbox "enviar automáticamente" confuso
   - Botón "enviar" está abajo
   - No hay "seleccionar todo"

---

## 🚀 Fase 1: Mejoras Inmediatas de UI/UX

### Cambios Requeridos

1. ✅ **Quitar checkbox "Enviar automáticamente"**
2. ✅ **Mover botón "Enviar al Repositorio" arriba** (después del botón "Descargar Todo")
3. ✅ **Agregar checkbox "Seleccionar Todo"** en la sección de categorías

### Implementación

```vue
<!-- Nueva estructura -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <HeaderExito />
    
    <!-- Acciones Principales (ARRIBA) -->
    <div class="flex gap-4">
      <button @click="handleDownloadAll">Descargar Todo (ZIP)</button>
      <button @click="handleEnviarManual" :disabled="!haySeleccionados">
        Enviar al Repositorio ({{ documentosSeleccionadosArray.length }})
      </button>
    </div>
    
    <!-- Categorías con "Seleccionar Todo" -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3>Categorías</h3>
        <label>
          <input type="checkbox" v-model="seleccionarTodo" />
          Seleccionar Todo
        </label>
      </div>
      <CategoriaDocumentos v-for="..." />
    </div>
  </div>
</template>
```

---

## 🔍 Fase 2: Detección de Documentos Duplicados

### Requerimientos del Backend

#### Opción 1: Endpoint de Verificación (Recomendado)

```typescript
// GET /api/v2/repository/society-profile/:structureId/nodes/:folderId/documents/check
// Query params: ?fileName={nombre}&fileHash={hash}

Response:
{
  "success": true,
  "data": {
    "exists": true,
    "document": {
      "id": 123,
      "name": "acta-junta-universal.docx",
      "documentCode": "abc-123",
      "latestVersion": {
        "versionCode": "v1",
        "createdAt": "2025-12-11T10:00:00Z"
      }
    }
  }
}
```

#### Opción 2: Usar Endpoint Existente (Alternativa)

```typescript
// GET /api/v2/repository/society-profile/:structureId/nodes/:folderId
// Obtener todos los documentos de la carpeta y buscar por nombre en frontend

// Problema: Menos eficiente, requiere cargar todos los documentos
```

### Flujo de Detección

```typescript
// 1. Al seleccionar un documento
const verificarDuplicado = async (documento: Documento) => {
  const folderId = await obtenerFolderIdJunta(structureId, flowId);
  const existe = await verificarDocumentoExiste(folderId, documento.nombre);
  
  if (existe) {
    // Mostrar modal con opciones
    mostrarModalDuplicado({
      documento,
      documentoExistente: existe.document,
      opciones: [
        "Volver a enviar (crear nueva versión)",
        "Actualizar documento (reemplazar)",
        "Cancelar"
      ]
    });
  }
};
```

### Componente: Modal de Duplicado

```vue
<!-- components/juntas/documentos/DocumentoDuplicadoModal.vue -->
<template>
  <Dialog>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Documento Ya Existe</DialogTitle>
        <DialogDescription>
          El documento "{{ documento.nombre }}" ya existe en el repositorio.
        </DialogDescription>
      </DialogHeader>
      
      <div class="space-y-4">
        <div class="bg-yellow-50 p-4 rounded">
          <p><strong>Documento existente:</strong></p>
          <p>Versión: {{ documentoExistente.latestVersion.versionCode }}</p>
          <p>Fecha: {{ formatoFecha(documentoExistente.latestVersion.createdAt) }}</p>
        </div>
        
        <div class="space-y-2">
          <button @click="handleCrearNuevaVersion">
            Volver a enviar (crear nueva versión)
          </button>
          <button @click="handleReemplazar">
            Actualizar documento (reemplazar)
          </button>
          <button @click="handleCancelar">Cancelar</button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
```

---

## 🏗️ Fase 3: Refactorización Completa

### Nueva Estructura (Arquitectura Hexagonal)

```
app/
├── pages/
│   └── operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/descargar.vue
│       └── Solo orquesta componentes, sin lógica
│
├── components/
│   └── juntas/documentos/
│       ├── JuntaDocumentosGeneradosContainer.vue (ORQUESTADOR)
│       │
│       ├── header/
│       │   └── HeaderExito.vue ✅ (ya existe)
│       │
│       ├── actions/
│       │   ├── DescargarTodoButton.vue (NUEVO)
│       │   ├── EnviarRepositorioButton.vue (NUEVO)
│       │   └── SeleccionarTodoCheckbox.vue (NUEVO)
│       │
│       ├── categories/
│       │   ├── CategoriaDocumentos.vue ✅ (ya existe, mejorar)
│       │   └── DocumentoItem.vue ✅ (ya existe, mejorar)
│       │
│       ├── modals/
│       │   ├── DocumentoDuplicadoModal.vue (NUEVO)
│       │   └── ConfirmarEnvioModal.vue (NUEVO)
│       │
│       └── info/
│           └── InfoBanner.vue (NUEVO - extraer del componente actual)
│
├── composables/
│   └── juntas/documentos/
│       ├── useDocumentosDescarga.ts (NUEVO - lógica de descarga)
│       ├── useDocumentosSeleccion.ts (NUEVO - lógica de selección)
│       ├── useDocumentosEnvio.ts (NUEVO - lógica de envío)
│       └── useDocumentosDuplicados.ts (NUEVO - detección de duplicados)
│
└── core/
    ├── presentation/juntas/documentos/
    │   └── stores/
    │       ├── documentos-generados.store.ts ✅ (ya existe)
    │       └── documentos-seleccion.store.ts (NUEVO)
    │
    └── hexag/
        └── documentos/
            ├── domain/
            │   ├── entities/
            │   │   └── documento.entity.ts ✅
            │   └── ports/
            │       └── documento-repository.port.ts (NUEVO)
            │
            ├── application/
            │   ├── use-cases/
            │   │   ├── verificar-documento-duplicado.use-case.ts (NUEVO)
            │   │   ├── crear-nueva-version.use-case.ts (NUEVO)
            │   │   └── reemplazar-documento.use-case.ts (NUEVO)
            │   └── dtos/
            │       └── documento-duplicado.dto.ts (NUEVO)
            │
            └── infrastructure/
                ├── repositories/
                │   └── documento-http.repository.ts (NUEVO)
                └── mappers/
                    └── documento-duplicado.mapper.ts (NUEVO)
```

---

## 📝 Plan de Implementación Detallado

### Paso 1: Mejoras Inmediatas (1-2 horas)

1. **Modificar `JuntaDocumentosGenerados.vue`**:
   - Quitar checkbox "enviar automáticamente"
   - Mover botón "enviar" arriba
   - Agregar checkbox "seleccionar todo"

2. **Crear composable `useDocumentosSeleccion.ts`**:
   ```typescript
   export function useDocumentosSeleccion() {
     const seleccionados = ref<Set<string>>(new Set());
     const seleccionarTodo = ref(false);
     
     const toggleSeleccion = (id: string) => { ... };
     const toggleSeleccionarTodo = () => { ... };
     
     return { seleccionados, seleccionarTodo, toggleSeleccion, toggleSeleccionarTodo };
   }
   ```

### Paso 2: Detección de Duplicados (2-3 horas)

1. **Backend**: Implementar endpoint de verificación (si no existe)
2. **Frontend**: Crear `useDocumentosDuplicados.ts`
3. **Frontend**: Crear `DocumentoDuplicadoModal.vue`
4. **Frontend**: Integrar detección en `DocumentoItem.vue`

### Paso 3: Refactorización Completa (4-6 horas)

1. **Extraer componentes atómicos**:
   - `DescargarTodoButton.vue`
   - `EnviarRepositorioButton.vue`
   - `SeleccionarTodoCheckbox.vue`
   - `InfoBanner.vue`

2. **Crear composables especializados**:
   - `useDocumentosDescarga.ts`
   - `useDocumentosEnvio.ts`
   - `useDocumentosSeleccion.ts`

3. **Crear casos de uso**:
   - `VerificarDocumentoDuplicadoUseCase`
   - `CrearNuevaVersionUseCase`
   - `ReemplazarDocumentoUseCase`

4. **Refactorizar componente principal**:
   - `JuntaDocumentosGeneradosContainer.vue` (solo orquesta)

---

## 🔧 Requerimientos del Backend

### Endpoint Necesario: Verificar Documento Duplicado

```http
GET /api/v2/repository/society-profile/:structureId/nodes/:folderId/documents/check
```

**Query Params:**
- `fileName` (string, requerido): Nombre del archivo
- `fileHash` (string, opcional): Hash del archivo para verificación exacta

**Response:**
```json
{
  "success": true,
  "data": {
    "exists": true,
    "document": {
      "id": 123,
      "name": "acta-junta-universal.docx",
      "documentCode": "abc-123-def",
      "latestVersion": {
        "versionCode": "v1-abc",
        "versionNumber": 1,
        "createdAt": "2025-12-11T10:00:00Z",
        "sizeInBytes": 79784
      }
    }
  }
}
```

**Si no existe:**
```json
{
  "success": true,
  "data": {
    "exists": false,
    "document": null
  }
}
```

### Endpoint Opcional: Crear Nueva Versión

```http
POST /api/v2/repository/documents/:documentCode/versions
```

**Body:**
- FormData con el nuevo archivo

**Response:**
```json
{
  "success": true,
  "data": {
    "versionCode": "v2-xyz",
    "versionNumber": 2,
    "createdAt": "2025-12-11T15:00:00Z"
  }
}
```

---

## ✅ Checklist de Implementación

### Fase 1: Mejoras Inmediatas
- [ ] Quitar checkbox "enviar automáticamente"
- [ ] Mover botón "enviar al repositorio" arriba
- [ ] Agregar checkbox "seleccionar todo"
- [ ] Crear composable `useDocumentosSeleccion.ts`
- [ ] Actualizar `JuntaDocumentosGenerados.vue`

### Fase 2: Detección de Duplicados
- [ ] Backend: Implementar endpoint de verificación
- [ ] Frontend: Crear `useDocumentosDuplicados.ts`
- [ ] Frontend: Crear `DocumentoDuplicadoModal.vue`
- [ ] Frontend: Integrar detección en selección de documentos
- [ ] Frontend: Implementar opciones (nueva versión, reemplazar, cancelar)

### Fase 3: Refactorización
- [ ] Extraer `DescargarTodoButton.vue`
- [ ] Extraer `EnviarRepositorioButton.vue`
- [ ] Extraer `SeleccionarTodoCheckbox.vue`
- [ ] Extraer `InfoBanner.vue`
- [ ] Crear `useDocumentosDescarga.ts`
- [ ] Crear `useDocumentosEnvio.ts`
- [ ] Crear casos de uso (Domain)
- [ ] Crear repositorio HTTP (Infrastructure)
- [ ] Refactorizar componente principal a `Container`

---

## 🎨 Estructura Final del Componente Principal

```vue
<!-- JuntaDocumentosGeneradosContainer.vue -->
<template>
  <div class="space-y-6">
    <!-- Header -->
    <HeaderExito />
    
    <!-- Acciones Principales -->
    <div class="flex gap-4">
      <DescargarTodoButton />
      <EnviarRepositorioButton />
    </div>
    
    <!-- Categorías -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3>Categorías</h3>
        <SeleccionarTodoCheckbox />
      </div>
      <CategoriaDocumentos v-for="..." />
    </div>
    
    <!-- Info Banner -->
    <InfoBanner />
    
    <!-- Modals -->
    <DocumentoDuplicadoModal />
    <ConfirmarEnvioModal />
  </div>
</template>

<script setup lang="ts">
// Solo importa composables y componentes
// NO hay lógica de negocio aquí
</script>
```

---

## 📚 Documentación Adicional

- Ver `docs/general/ARCHITECTURE.md` para arquitectura hexagonal
- Ver `docs/general/examples/producto-example.md` para ejemplos
- Ver `app/layouts/flow-layout-juntas.vue` para referencia de componentización

