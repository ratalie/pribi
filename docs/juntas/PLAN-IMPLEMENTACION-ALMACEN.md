# 🚀 PLAN COMPLETO: Implementación Módulo "Almacén" (Google Drive Básico)

**Fecha**: 10 de Diciembre 2025  
**Versión Backend**: 2.5  
**Arquitectura**: Hexagonal DDD  
**Enfoque**: Funcionalidades tipo Google Drive

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Análisis de Estado Actual](#analisis-estado-actual)
3. [Funcionalidades Core](#funcionalidades-core)
4. [Fases de Implementación](#fases-implementacion)
5. [Arquitectura Detallada](#arquitectura-detallada)
6. [Checklist de Implementación](#checklist-implementacion)

---

## 1️⃣ <a id="resumen-ejecutivo"></a>RESUMEN EJECUTIVO

### **Objetivo**
Implementar el módulo "Almacén" que funcione como un Google Drive básico, permitiendo a los usuarios gestionar sus archivos y carpetas de forma intuitiva.

### **Funcionalidades Principales**
1. ✅ **Navegación de carpetas** (ya implementado en Documentos Generados)
2. ⏳ **Subir archivos** (drag & drop + click)
3. ⏳ **Crear carpetas**
4. ⏳ **Renombrar archivos/carpetas**
5. ⏳ **Mover archivos/carpetas** (drag & drop entre carpetas)
6. ⏳ **Eliminar archivos/carpetas**
7. ✅ **Descargar archivos** (ya implementado)
8. ✅ **Previsualizar archivos** (ya implementado)
9. ⏳ **Buscar archivos** (búsqueda por nombre)
10. ⏳ **Ver almacenamiento usado**

### **Endpoints V2 Disponibles**
- ✅ `POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/documents` - Subir archivo
- ✅ `POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/folder` - Crear carpeta
- ✅ `PATCH /api/v2/repository/nodes/{nodeId}` - Renombrar/Mover nodo
- ✅ `DELETE /api/v2/repository/nodes/{nodeId}` - Eliminar nodo
- ✅ `GET /api/v2/repository/nodes/{nodeId}` - Obtener nodo con hijos
- ✅ `GET /api/v2/repository/society-profile/{structureId}/documents/search` - Buscar documentos
- ✅ `GET /api/v2/repository/society-profile/{structureId}/storage-usage` - Ver almacenamiento

---

## 2️⃣ <a id="analisis-estado-actual"></a>ANÁLISIS DE ESTADO ACTUAL

### **✅ Ya Implementado (Reutilizable)**
1. ✅ **Navegación de carpetas** - `DocumentosGeneradosView.vue`
2. ✅ **Descargar documentos** - `useDescargarDocumento.ts`
3. ✅ **Previsualizar documentos** - `usePrevisualizarDocumento.ts`
4. ✅ **Eliminar documentos** - `useEliminarDocumento.ts`
5. ✅ **Descargar carpeta ZIP** - `useDescargarCarpetaZip.ts`
6. ✅ **Obtener nodos** - `RepositorioDocumentosHttpRepository`
7. ✅ **Mappers** - `RepositorioNodeMapper`
8. ✅ **Stores** - `useDocumentosGeneradosStore`

### **⏳ Pendiente de Implementar**
1. ⏳ Subir archivos (single + multiple)
2. ⏳ Crear carpetas
3. ⏳ Renombrar archivos/carpetas
4. ⏳ Mover archivos/carpetas
5. ⏳ Buscar archivos
6. ⏳ Ver almacenamiento usado
7. ⏳ Drag & Drop para subir y mover

---

## 3️⃣ <a id="funcionalidades-core"></a>FUNCIONALIDADES CORE

### **3.1. Subir Archivos**

**Casos de uso:**
- Subir un archivo a la carpeta actual
- Subir múltiples archivos a la carpeta actual
- Drag & Drop de archivos desde el sistema de archivos
- Mostrar progreso de subida
- Validar tipo y tamaño de archivo

**Endpoints:**
- `POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/documents`

### **3.2. Crear Carpetas**

**Casos de uso:**
- Crear carpeta en la carpeta actual
- Validar nombre único
- Mostrar modal de creación

**Endpoints:**
- `POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/folder`

### **3.3. Renombrar Archivos/Carpetas**

**Casos de uso:**
- Renombrar desde menú contextual
- Validar nombre único
- Mostrar modal de edición

**Endpoints:**
- `PATCH /api/v2/repository/nodes/{nodeId}`

### **3.4. Mover Archivos/Carpetas**

**Casos de uso:**
- Mover arrastrando a otra carpeta
- Mover desde menú contextual
- Validar que no se mueva a sí mismo o a sus hijos

**Endpoints:**
- `PATCH /api/v2/repository/nodes/{nodeId}` (actualizar `parentId`)

### **3.5. Buscar Archivos**

**Casos de uso:**
- Búsqueda por nombre
- Búsqueda semántica (opcional)
- Filtrar por tipo (archivo/carpeta)
- Mostrar resultados con breadcrumbs

**Endpoints:**
- `GET /api/v2/repository/society-profile/{structureId}/documents/search?query={query}`
- `POST /api/v2/repository/society-profile/{structureId}/documents/search` (semántica)

### **3.6. Ver Almacenamiento**

**Casos de uso:**
- Mostrar espacio usado vs disponible
- Mostrar por tipo de archivo
- Mostrar en dashboard

**Endpoints:**
- `GET /api/v2/repository/society-profile/{structureId}/storage-usage`

---

## 4️⃣ <a id="fases-implementacion"></a>FASES DE IMPLEMENTACIÓN

### **FASE 1: Funcionalidades Básicas de Gestión** (8-10 horas)

#### **1.1. Subir Archivos** (3-4 horas)

**Domain:**
- ✅ Ya existe `RepositorioNode` entity

**Application:**
- ⏳ `SubirArchivoUseCase`
  - Input: `structureId`, `parentNodeId`, `file: File`
  - Output: `RepositorioNode`
- ⏳ `SubirMultiplesArchivosUseCase`
  - Input: `structureId`, `parentNodeId`, `files: File[]`
  - Output: `RepositorioNode[]`

**Infrastructure:**
- ⏳ `RepositorioDocumentosHttpRepository.subirArchivo()`
- ⏳ `RepositorioDocumentosHttpRepository.subirMultiplesArchivos()`

**Presentation:**
- ⏳ `useSubirArchivo.ts` composable
- ⏳ `useSubirMultiplesArchivos.ts` composable
- ⏳ `AlmacenView.vue` - Componente principal
- ⏳ `UploadModal.vue` - Modal para subir archivos
- ⏳ Drag & Drop zone en `AlmacenView.vue`

#### **1.2. Crear Carpetas** (2 horas)

**Application:**
- ⏳ `CrearCarpetaUseCase`
  - Input: `structureId`, `parentNodeId`, `nombre: string`, `descripcion?: string`
  - Output: `RepositorioNode`

**Infrastructure:**
- ⏳ `RepositorioDocumentosHttpRepository.crearCarpeta()`

**Presentation:**
- ⏳ `useCrearCarpeta.ts` composable
- ⏳ `CrearCarpetaModal.vue` - Modal para crear carpeta

#### **1.3. Renombrar Archivos/Carpetas** (2 horas)

**Application:**
- ⏳ `RenombrarNodoUseCase`
  - Input: `nodeId: string`, `nuevoNombre: string`
  - Output: `RepositorioNode`

**Infrastructure:**
- ⏳ `RepositorioDocumentosHttpRepository.renombrarNodo()`

**Presentation:**
- ⏳ `useRenombrarNodo.ts` composable
- ⏳ `RenombrarModal.vue` - Modal para renombrar

#### **1.4. Eliminar Archivos/Carpetas** (1 hora)

**Application:**
- ✅ Ya existe `EliminarDocumentoUseCase` (reutilizar)

**Infrastructure:**
- ✅ Ya existe `RepositorioDocumentosHttpRepository.eliminarNodo()` (reutilizar)

**Presentation:**
- ✅ Ya existe `useEliminarDocumento.ts` (reutilizar)

---

### **FASE 2: Funcionalidades Avanzadas** (6-8 horas)

#### **2.1. Mover Archivos/Carpetas** (3-4 horas)

**Application:**
- ⏳ `MoverNodoUseCase`
  - Input: `nodeId: string`, `nuevoParentId: string`
  - Output: `RepositorioNode`
  - Validaciones:
    - No mover a sí mismo
    - No mover a sus hijos
    - Validar permisos

**Infrastructure:**
- ⏳ `RepositorioDocumentosHttpRepository.moverNodo()`

**Presentation:**
- ⏳ `useMoverNodo.ts` composable
- ⏳ Drag & Drop para mover en `AlmacenView.vue`
- ⏳ `MoverModal.vue` - Modal para seleccionar destino

#### **2.2. Buscar Archivos** (2-3 horas)

**Application:**
- ⏳ `BuscarDocumentosUseCase`
  - Input: `structureId: string`, `query: string`, `filtros?: FiltrosBusqueda`
  - Output: `RepositorioNode[]`

**Infrastructure:**
- ⏳ `RepositorioDocumentosHttpRepository.buscarDocumentos()`

**Presentation:**
- ⏳ `useBuscarDocumentos.ts` composable
- ⏳ `BusquedaBar.vue` - Barra de búsqueda
- ⏳ `ResultadosBusqueda.vue` - Vista de resultados

#### **2.3. Ver Almacenamiento** (1 hora)

**Application:**
- ⏳ `ObtenerAlmacenamientoUseCase`
  - Input: `structureId: string`
  - Output: `AlmacenamientoInfo`

**Infrastructure:**
- ⏳ `RepositorioDocumentosHttpRepository.obtenerAlmacenamiento()`

**Presentation:**
- ⏳ `useAlmacenamiento.ts` composable
- ⏳ `AlmacenamientoWidget.vue` - Widget de almacenamiento

---

### **FASE 3: Mejoras UX** (4-6 horas)

#### **3.1. Drag & Drop Mejorado** (2-3 horas)
- Drag & Drop para subir archivos
- Drag & Drop para mover archivos/carpetas
- Indicadores visuales durante drag
- Validación de destino

#### **3.2. Vista de Grid/Lista** (1-2 horas)
- Toggle entre vista grid y lista
- Ordenamiento (nombre, fecha, tamaño)
- Filtros (tipo, fecha)

#### **3.3. Acciones Rápidas** (1 hora)
- Menú contextual (click derecho)
- Atajos de teclado
- Selección múltiple

---

## 5️⃣ <a id="arquitectura-detallada"></a>ARQUITECTURA DETALLADA

### **5.1. Estructura de Archivos**

```
app/
├── core/
│   ├── hexag/
│   │   └── repositorio/
│   │       ├── domain/
│   │       │   ├── entities/
│   │       │   │   ├── repositorio-node.entity.ts ✅
│   │       │   │   └── almacenamiento-info.entity.ts ⏳
│   │       │   └── ports/
│   │       │       └── repositorio-documentos.repository.ts ✅ (extender)
│   │       ├── application/
│   │       │   ├── dtos/
│   │       │   │   ├── repositorio-node.dto.ts ✅
│   │       │   │   └── almacenamiento-info.dto.ts ⏳
│   │       │   └── use-cases/
│   │       │       ├── subir-archivo.use-case.ts ⏳
│   │       │       ├── subir-multiples-archivos.use-case.ts ⏳
│   │       │       ├── crear-carpeta.use-case.ts ⏳
│   │       │       ├── renombrar-nodo.use-case.ts ⏳
│   │       │       ├── mover-nodo.use-case.ts ⏳
│   │       │       ├── buscar-documentos.use-case.ts ⏳
│   │       │       └── obtener-almacenamiento.use-case.ts ⏳
│   │       └── infrastructure/
│   │           ├── repositories/
│   │           │   └── repositorio-documentos-http.repository.ts ✅ (extender)
│   │           └── mappers/
│   │               ├── repositorio-node.mapper.ts ✅
│   │               └── almacenamiento-info.mapper.ts ⏳
│   └── presentation/
│       └── repositorio/
│           ├── stores/
│           │   └── almacen.store.ts ⏳
│           ├── composables/
│           │   ├── useSubirArchivo.ts ⏳
│           │   ├── useSubirMultiplesArchivos.ts ⏳
│           │   ├── useCrearCarpeta.ts ⏳
│           │   ├── useRenombrarNodo.ts ⏳
│           │   ├── useMoverNodo.ts ⏳
│           │   ├── useBuscarDocumentos.ts ⏳
│           │   └── useAlmacenamiento.ts ⏳
│           └── components/
│               └── almacen/
│                   ├── AlmacenView.vue ⏳
│                   ├── UploadModal.vue ⏳
│                   ├── CrearCarpetaModal.vue ⏳
│                   ├── RenombrarModal.vue ⏳
│                   ├── MoverModal.vue ⏳
│                   ├── BusquedaBar.vue ⏳
│                   ├── ResultadosBusqueda.vue ⏳
│                   └── AlmacenamientoWidget.vue ⏳
└── pages/
    └── storage/
        └── almacen/
            ├── index.vue ⏳
            └── [idSociety]/
                └── [...path].vue ⏳
```

### **5.2. Flujo de Datos**

```
Usuario → Componente Vue → Composable → Use Case → Repository → Backend
                                                              ↓
Usuario ← Componente Vue ← Composable ← Use Case ← Repository ← Backend
```

### **5.3. Store de Almacén**

```typescript
// app/core/presentation/repositorio/stores/almacen.store.ts
export const useAlmacenStore = defineStore('almacen', {
  state: () => ({
    carpetaActual: null as RepositorioNode | null,
    archivos: [] as RepositorioNode[],
    carpetas: [] as RepositorioNode[],
    breadcrumbs: [] as RepositorioNode[],
    busqueda: {
      query: '',
      resultados: [] as RepositorioNode[],
      activa: false,
    },
    almacenamiento: null as AlmacenamientoInfo | null,
    loading: false,
    error: null as string | null,
  }),
  
  getters: {
    items: (state) => [...state.carpetas, ...state.archivos],
    tieneItems: (state) => state.carpetas.length > 0 || state.archivos.length > 0,
  },
  
  actions: {
    async cargarCarpeta(nodeId: string) { ... },
    async subirArchivo(file: File, parentNodeId: string) { ... },
    async crearCarpeta(nombre: string, parentNodeId: string) { ... },
    async renombrarNodo(nodeId: string, nuevoNombre: string) { ... },
    async moverNodo(nodeId: string, nuevoParentId: string) { ... },
    async buscarDocumentos(query: string) { ... },
    async obtenerAlmacenamiento(structureId: string) { ... },
  },
});
```

---

## 6️⃣ <a id="checklist-implementacion"></a>CHECKLIST DE IMPLEMENTACIÓN

### **FASE 1: Funcionalidades Básicas**

#### **1.1. Subir Archivos**
- [ ] Crear `SubirArchivoUseCase`
- [ ] Crear `SubirMultiplesArchivosUseCase`
- [ ] Extender `RepositorioDocumentosHttpRepository` con `subirArchivo()`
- [ ] Extender `RepositorioDocumentosHttpRepository` con `subirMultiplesArchivos()`
- [ ] Crear `useSubirArchivo.ts` composable
- [ ] Crear `useSubirMultiplesArchivos.ts` composable
- [ ] Crear `UploadModal.vue`
- [ ] Crear `AlmacenView.vue` con zona de drag & drop
- [ ] Integrar en store `useAlmacenStore`

#### **1.2. Crear Carpetas**
- [ ] Crear `CrearCarpetaUseCase`
- [ ] Extender `RepositorioDocumentosHttpRepository` con `crearCarpeta()`
- [ ] Crear `useCrearCarpeta.ts` composable
- [ ] Crear `CrearCarpetaModal.vue`
- [ ] Integrar en `AlmacenView.vue`

#### **1.3. Renombrar**
- [ ] Crear `RenombrarNodoUseCase`
- [ ] Extender `RepositorioDocumentosHttpRepository` con `renombrarNodo()`
- [ ] Crear `useRenombrarNodo.ts` composable
- [ ] Crear `RenombrarModal.vue`
- [ ] Integrar en `AlmacenView.vue` (menú contextual)

#### **1.4. Eliminar**
- [ ] Reutilizar `useEliminarDocumento.ts`
- [ ] Integrar en `AlmacenView.vue` (menú contextual)

### **FASE 2: Funcionalidades Avanzadas**

#### **2.1. Mover**
- [ ] Crear `MoverNodoUseCase`
- [ ] Extender `RepositorioDocumentosHttpRepository` con `moverNodo()`
- [ ] Crear `useMoverNodo.ts` composable
- [ ] Crear `MoverModal.vue`
- [ ] Implementar drag & drop para mover en `AlmacenView.vue`

#### **2.2. Buscar**
- [ ] Crear `BuscarDocumentosUseCase`
- [ ] Extender `RepositorioDocumentosHttpRepository` con `buscarDocumentos()`
- [ ] Crear `useBuscarDocumentos.ts` composable
- [ ] Crear `BusquedaBar.vue`
- [ ] Crear `ResultadosBusqueda.vue`
- [ ] Integrar en `AlmacenView.vue`

#### **2.3. Almacenamiento**
- [ ] Crear `AlmacenamientoInfo` entity
- [ ] Crear `AlmacenamientoInfoDTO`
- [ ] Crear `AlmacenamientoInfoMapper`
- [ ] Crear `ObtenerAlmacenamientoUseCase`
- [ ] Extender `RepositorioDocumentosHttpRepository` con `obtenerAlmacenamiento()`
- [ ] Crear `useAlmacenamiento.ts` composable
- [ ] Crear `AlmacenamientoWidget.vue`
- [ ] Integrar en `AlmacenView.vue`

### **FASE 3: Mejoras UX**

#### **3.1. Drag & Drop**
- [ ] Mejorar drag & drop para subir archivos
- [ ] Implementar drag & drop para mover archivos
- [ ] Indicadores visuales durante drag
- [ ] Validación de destino

#### **3.2. Vistas**
- [ ] Toggle grid/lista
- [ ] Ordenamiento
- [ ] Filtros

#### **3.3. Acciones Rápidas**
- [ ] Menú contextual (click derecho)
- [ ] Atajos de teclado
- [ ] Selección múltiple

---

## 📝 NOTAS IMPORTANTES

### **Reutilización de Código**
- ✅ Reutilizar `RepositorioNode` entity
- ✅ Reutilizar `RepositorioNodeMapper`
- ✅ Reutilizar `RepositorioDocumentosHttpRepository` (extender)
- ✅ Reutilizar composables de descarga, preview, eliminación

### **Validaciones**
- Validar tamaño máximo de archivo
- Validar tipos de archivo permitidos
- Validar nombres únicos en carpeta
- Validar que no se mueva nodo a sí mismo o a sus hijos

### **UX/UI**
- Mostrar progreso de subida
- Mostrar mensajes de éxito/error
- Confirmar acciones destructivas (eliminar, mover)
- Feedback visual durante operaciones

### **Performance**
- Lazy loading de carpetas grandes
- Paginación si es necesario
- Cache de nodos cargados
- Debounce en búsqueda

---

## 🎯 PRÓXIMOS PASOS

1. **Comenzar con FASE 1.1** (Subir Archivos)
2. **Seguir con FASE 1.2** (Crear Carpetas)
3. **Continuar con FASE 1.3 y 1.4** (Renombrar y Eliminar)
4. **Avanzar a FASE 2** (Funcionalidades Avanzadas)
5. **Finalizar con FASE 3** (Mejoras UX)

---

**¡Éxito en la implementación! 🚀**

