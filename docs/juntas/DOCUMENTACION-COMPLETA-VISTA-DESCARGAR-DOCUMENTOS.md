# 📄 DOCUMENTACIÓN COMPLETA: Vista Descargar Documentos

**Fecha**: 2 de Diciembre 2025  
**Versión**: V3 (Basado en Probo Figma AI)  
**Estado**: Documentación completa ✅ | Lista para implementación ⏳

---

## 📋 ÍNDICE

1. [Vista: Diseño y Estructura](#vista-diseño)
2. [Funcionalidades: Descripción y Responsabilidades](#funcionalidades)
3. [Arquitectura: Flujo de Generación](#arquitectura)
4. [Backend: Capacidades y Endpoints](#backend)
5. [Reglas de Negocio](#reglas-negocio)
6. [Plan de Implementación](#plan-implementacion)

---

## 1️⃣ <a id="vista-diseño"></a>VISTA: DISEÑO Y ESTRUCTURA

### 🎨 Diseño Visual (Basado en Probo Figma AI)

**Componente de referencia**: `probo-figma-ai/src/components/JuntaDocumentosGenerados.tsx`

#### **Estructura de la Vista**

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER DE ÉXITO (Gradiente Verde)                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ✅ Icono CheckCircle2 (16x16)                        │ │
│  │ "¡Proceso Finalizado!" (text-3xl, font-primary)      │ │
│  │ "Has completado todos los pasos..." (text-lg)        │ │
│  │                                                       │ │
│  │ ┌──────────┬──────────┬──────────┐                   │ │
│  │ │ Docs Gen │ Puntos   │ Estado   │                   │ │
│  │ │    12    │    5     │ Completo │                   │ │
│  │ └──────────┴──────────┴──────────┘                   │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  BOTÓN DESCARGAR TODO (ZIP)                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 📦 Icono Package                                      │ │
│  │ "Descargar Todos los Documentos"                     │ │
│  │ "12 archivos en formato ZIP (~12.5 MB)"              │ │
│  │ [Botón: Descargar Todo (ZIP)]                        │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  LISTADO POR CATEGORÍAS                                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 📁 Acta Principal                                     │ │
│  │   └─ 📄 Acta de Junta General de Accionistas.pdf     │ │
│  │                                                       │ │
│  │ 📁 Detalles de la Junta                               │ │
│  │   └─ 📄 Proxy - Poderes de Representación.pdf        │ │
│  │   └─ 📄 Junta-Convocatoria.pdf                       │ │
│  │   └─ 📄 Lista de Asistencia.pdf                     │ │
│  │                                                       │ │
│  │ 📁 Acuerdos: Aumento de Capital                      │ │
│  │   └─ 📄 Minuta - Aumento de Capital Social.pdf       │ │
│  │   └─ 📄 Informe de Aporte Dinerario.pdf              │ │
│  │   └─ 📄 Certificado de Aportes - [Nombre].pdf       │ │
│  │                                                       │ │
│  │ 📁 Acuerdos: Nombramientos                           │ │
│  │   └─ 📄 Carta de Aceptación - [Nombre].pdf          │ │
│  │   └─ 📄 Certificado de Nombramiento.pdf             │ │
│  │   └─ 📄 Registro de Facultades y Poderes.pdf       │ │
│  │                                                       │ │
│  │ 📁 Acuerdos: Gestión Social                          │ │
│  │   └─ 📄 Pronunciamiento - Estados Financieros.pdf   │ │
│  │   └─ 📄 Memoria Anual 2024.pdf                       │ │
│  │   └─ 📄 Acuerdo de Distribución de Utilidades.pdf   │ │
│  │                                                       │ │
│  │ 📁 Certificados                                       │ │
│  │   └─ 📄 Certificado de Participación - [Nombre].pdf │ │
│  │   └─ 📄 Certificado de Votación - Todos.pdf         │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  INFORMACIÓN ADICIONAL (Info Box Azul)                      │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 📌 Información Importante                             │ │
│  │ • Todos los documentos generados automáticamente     │ │
│  │ • Listos para firma y envío al repositorio           │ │
│  │ • Descarga individual o ZIP                          │ │
│  │ • Certificados generados para cada accionista        │ │
│  │ • Revisar antes de uso oficial                       │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  CHECKBOX: ENVIAR AL REPOSITORIO                            │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ☑️ Enviar automáticamente al Repositorio Documental  │ │
│  │    "Los documentos se guardarán en tu repositorio..."│ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 🎨 Componentes Visuales

#### **1. Header de Éxito**

```typescript
// Estilo: Gradiente verde (#10B981 → #059669)
// Contenido:
- Icono: CheckCircle2 (w-10 h-10, blanco)
- Título: "¡Proceso Finalizado!" (text-3xl, font-primary, blanco)
- Subtítulo: "Has completado todos los pasos..." (text-lg, blanco, opacity-90)
- 3 Cards con estadísticas:
  * Documentos Generados: {totalDocumentos}
  * Puntos Aprobados: {puntosAprobados}
  * Estado: "Completo"
```

#### **2. Botón Descargar Todo (ZIP)**

```typescript
// Estilo: Card blanca con borde
// Contenido:
- Icono: Package (w-6 h-6, primary-800)
- Título: "Descargar Todos los Documentos"
- Subtítulo: "{total} archivos en formato ZIP (~{tamaño} MB)"
- Botón: "Descargar Todo (ZIP)" (primary-800, hover: primary-900)
```

#### **3. Categoría de Documentos**

```typescript
// Estilo: Card blanca con borde redondeado
// Contenido:
- Título de categoría (text-base, font-primary, font-semibold)
- Lista de documentos (DocumentoItem)
```

#### **4. Documento Individual (DocumentoItem)**

```typescript
// Estilo: Card con hover effect
// Contenido:
- Icono: FileText (w-5 h-5, primary-800, bg: primary-100)
- Nombre: {documento.nombre} (text-sm, font-secondary, font-semibold)
- Tamaño: {documento.tamano} (text-xs, text-muted)
- Botón: "Descargar" (aparece en hover, outline, sm)
```

#### **5. Info Box**

```typescript
// Estilo: bg-blue-50, border-blue-200
// Contenido:
- Icono: FileText (w-5 h-5, text-blue-600)
- Título: "📌 Información Importante" (text-base, text-blue-800)
- Lista de tips (text-sm, text-blue-900)
```

#### **6. Checkbox Repositorio**

```typescript
// Estilo: Card blanca con borde
// Contenido:
- Checkbox: checked por defecto
- Label: "Enviar automáticamente al Repositorio Documental"
- Descripción: "Los documentos se guardarán..."
```

---

## 2️⃣ <a id="funcionalidades"></a>FUNCIONALIDADES: DESCRIPCIÓN Y RESPONSABILIDADES

### 📋 Funcionalidades Principales

| Funcionalidad | Descripción | Frontend | Backend | Frontend+Backend |
|---------------|-------------|----------|---------|------------------|
| **1. Generar Documentos** | Genera todos los documentos de la junta | ✅ 100% | ❌ 0% | ❌ |
| **2. Descargar Documento Individual** | Descarga un documento específico | ✅ 100% | ❌ 0% | ❌ |
| **3. Descargar Varios Documentos** | Descarga múltiples documentos seleccionados | ✅ 100% | ❌ 0% | ❌ |
| **4. Descargar ZIP** | Descarga todos los documentos en un ZIP | ✅ 100% | ❌ 0% | ❌ |
| **5. Enviar al Repositorio** | Guarda documentos en el repositorio | ✅ UI | ✅ API | ✅ |
| **6. Preview de Documento** | Vista previa antes de descargar | ✅ 100% | ❌ 0% | ❌ |
| **7. Categorización** | Organiza documentos por categorías | ✅ 100% | ❌ 0% | ❌ |

### 🔍 Análisis Detallado

#### **1. Generar Documentos**

**Responsabilidad**: 100% Frontend

**Proceso**:
```
1. Usuario completa pasos 1-5 del flujo
2. Al llegar a "Descargar", se ejecuta automáticamente:
   - generateAporteDinerarioDocumentsV2()
   - Carga datos de stores
   - Hace llamadas API (acciones, aportes, etc.)
   - Construye objeto DataV2
   - Llama handlers de cada documento
   - Genera blobs con Docxtemplater
   - Retorna lista de documentos generados
3. Se muestran en la UI
```

**Tecnologías**:
- `Docxtemplater`: Procesamiento de templates .docx
- `PizZip`: Carga de templates
- `JSZip`: Generación de ZIP (opcional)

**Archivos clave**:
- `useAporteDinerarioPrintV2.ts`: Orquestador principal
- `handlePrintActa.ts`: Handler del acta
- `handleGenerateZipDocuments.ts`: Generación de ZIP

#### **2. Descargar Documento Individual**

**Responsabilidad**: 100% Frontend

**Proceso**:
```typescript
const handleDownload = (documento: Documento) => {
  // 1. Obtener blob del documento (ya generado)
  const blob = documento.blob;
  
  // 2. Crear link de descarga
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = documento.nombre;
  
  // 3. Trigger descarga
  link.click();
  
  // 4. Limpiar
  URL.revokeObjectURL(link.href);
};
```

**Datos necesarios**:
- `blob`: Blob del documento (ya generado)
- `nombre`: Nombre del archivo
- `tamaño`: Tamaño en bytes (para mostrar)

#### **3. Descargar Varios Documentos**

**Responsabilidad**: 100% Frontend

**Proceso**:
```typescript
const handleDownloadMultiple = (documentos: Documento[]) => {
  // 1. Crear ZIP con JSZip
  const zip = new JSZip();
  
  // 2. Agregar cada documento al ZIP
  documentos.forEach(doc => {
    zip.file(doc.nombre, doc.blob);
  });
  
  // 3. Generar ZIP
  zip.generateAsync({ type: "blob" }).then(zipBlob => {
    // 4. Descargar ZIP
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = `documentos-seleccionados-${Date.now()}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  });
};
```

**UI necesaria**:
- Checkboxes para seleccionar documentos
- Botón "Descargar Seleccionados"
- Contador de documentos seleccionados

#### **4. Descargar ZIP (Todos)**

**Responsabilidad**: 100% Frontend

**Proceso**:
```typescript
const handleDownloadAll = async () => {
  // 1. Obtener todos los documentos generados
  const documentos = await generateAllDocuments();
  
  // 2. Crear ZIP con JSZip
  const zip = new JSZip();
  
  // 3. Agregar todos los documentos
  documentos.forEach(doc => {
    zip.file(doc.nombre, doc.blob);
  });
  
  // 4. Generar y descargar ZIP
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(zipBlob);
  link.download = `documentos-junta-${societyId}-${flowId}.zip`;
  link.click();
  URL.revokeObjectURL(link.href);
};
```

**Archivo clave**: `handleGenerateZipDocuments.ts`

#### **5. Enviar al Repositorio**

**Responsabilidad**: Frontend + Backend

**Frontend (UI)**:
```typescript
// Checkbox para habilitar/deshabilitar
const enviarAlRepositorio = ref(true);

// Al descargar, si está habilitado:
if (enviarAlRepositorio.value) {
  await guardarEnRepositorio(documentos);
}
```

**Backend (API)**:
```typescript
// Endpoint: POST /api/v2/repositorio/:societyId/documentos-generados
// Body: {
//   flowId: number,
//   documentos: [
//     {
//       nombre: string,
//       blob: Blob, // Convertido a base64 o multipart
//       categoria: string,
//       tipo: string
//     }
//   ]
// }
```

**Archivo clave**: `useSaveDocumentsByFlow.ts` (V2.5)

#### **6. Preview de Documento**

**Responsabilidad**: 100% Frontend

**Proceso**:
```typescript
const handlePreview = (documento: Documento) => {
  // 1. Convertir blob a URL
  const url = URL.createObjectURL(documento.blob);
  
  // 2. Abrir en nueva pestaña o modal
  window.open(url, '_blank');
  
  // O usar componente de preview
  // <DocumentPreview :blob="documento.blob" />
};
```

**Componente**: `DocumentPreview.vue` (si existe)

#### **7. Categorización**

**Responsabilidad**: 100% Frontend

**Lógica**:
```typescript
const categorizarDocumentos = (documentos: Documento[]) => {
  return {
    'Acta Principal': documentos.filter(d => d.tipo === 'ACTA'),
    'Detalles de la Junta': documentos.filter(d => 
      ['PROXY', 'CONVOCATORIA', 'ASISTENCIA'].includes(d.tipo)
    ),
    'Acuerdos: Aumento de Capital': documentos.filter(d => 
      d.categoria === 'AUMENTO_CAPITAL'
    ),
    'Acuerdos: Nombramientos': documentos.filter(d => 
      d.categoria === 'NOMBRAMIENTOS'
    ),
    'Acuerdos: Gestión Social': documentos.filter(d => 
      d.categoria === 'GESTION_SOCIAL'
    ),
    'Certificados': documentos.filter(d => d.tipo === 'CERTIFICADO'),
  };
};
```

---

## 3️⃣ <a id="arquitectura"></a>ARQUITECTURA: FLUJO DE GENERACIÓN

### 🔄 Flujo Completo (V2.5)

```
┌─────────────────────────────────────────────────────────────┐
│  FUNCIÓN BISABUELO: generateAporteDinerarioDocumentsV2()  │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 1. Instancia stores (appStore, presidentSecretary...) │ │
│  │ 2. Hace llamadas API en paralelo (Promise.allSettled)│ │
│  │ 3. Construye objeto DataV2 consolidado                │ │
│  │ 4. Llama handlers (función abuelo)                    │ │
│  │ 5. Genera ZIP (función nieto)                         │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  FUNCIÓN ABUELO: useDownloadDocAporteDinerario()           │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ handlers: {                                           │ │
│  │   handleDownloadConvocatoria,                        │ │
│  │   handleDownloadRepresentationPowers,                │ │
│  │   handlerDownloadActaOrQuorum,                       │ │
│  │   handlerDownloadCertification,                      │ │
│  │   handlerDownloadMinuta,                             │ │
│  │   handleDownloadCartaAviso,                          │ │
│  │   handleDownloadAsiento,                             │ │
│  │   handleDownloadCertificado                          │ │
│  │ }                                                     │ │
│  │                                                       │ │
│  │ objectToGenerateZip: []                              │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  FUNCIÓN HIJO: handlerDownloadActaOrQuorum()               │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 1. Recibe DataV2 y otros parámetros                   │ │
│  │ 2. Llama handlePrintActa() (función nieto)           │ │
│  │ 3. Agrega resultado a objectToGenerateZip            │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  FUNCIÓN NIETO: handlePrintActa()                           │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 1. Recibe 20+ parámetros + DataV2                    │ │
│  │ 2. Construye objeto ActaAumentoCapital               │ │
│  │ 3. Retorna objeto para template                       │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  FUNCIÓN BISNIETO: generateListDocuments()                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 1. Recibe objectToGenerateZip[]                        │ │
│  │ 2. Para cada documento:                                │ │
│  │    a. Fetch template desde /templates/                │ │
│  │    b. Cargar con PizZip                               │ │
│  │    c. Instanciar Docxtemplater                        │ │
│  │    d. setData(data)                                    │ │
│  │    e. render()                                         │ │
│  │    f. Generar blob                                     │ │
│  │ 3. Retorna Promise.allSettled(blobs[])                │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  FUNCIÓN TATARANIETO: convertToZip()                        │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 1. Recibe resultados de generateListDocuments()       │ │
│  │ 2. Crea JSZip                                          │ │
│  │ 3. Agrega cada blob al ZIP                            │ │
│  │ 4. Genera ZIP blob                                    │ │
│  │ 5. Descarga automáticamente                           │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 📊 Análisis de la Arquitectura

#### **Problemas Identificados**

1. **Demasiadas capas de funciones**:
   - Bisabuelo → Abuelo → Hijo → Nieto → Bisnieto → Tatarabuelo
   - Dificulta el mantenimiento
   - Prop drilling excesivo

2. **Parámetros excesivos**:
   - `handlePrintActa()` recibe 20+ parámetros
   - Dificulta testing
   - Propenso a errores

3. **Acoplamiento fuerte**:
   - Stores directamente en funciones de generación
   - Difícil reutilizar en otros contextos

4. **Sin separación de responsabilidades**:
   - Lógica de negocio mezclada con generación
   - No hay capas claras (Domain/Application/Infrastructure)

#### **Propuesta V3 (Arquitectura Hexagonal)**

```
┌─────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ useGenerateDocumentosController()                     │ │
│  │ - Carga datos de stores                              │ │
│  │ - Llama Use Case                                      │ │
│  │ - Maneja UI (loading, error, success)                 │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  APPLICATION LAYER (Use Cases)                              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ GenerateActaUseCase                                    │ │
│  │ - Obtiene datos del Repository                         │ │
│  │ - Usa Builder para construir datos                     │ │
│  │ - Usa Processor para generar documento                 │ │
│  │ - Retorna DocumentoResponse                            │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  DOMAIN LAYER (Services)                                    │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ActaBuilderService                                     │ │
│  │ - withSociedad()                                       │ │
│  │ - withDetallesJunta()                                  │ │
│  │ - withInstalacion()                                    │ │
│  │ - withPuntosAcuerdo()                                  │ │
│  │ - build() → ActaData                                   │ │
│  │                                                       │ │
│  │ TemplateProcessorService                               │ │
│  │ - process(template, data) → Blob                      │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  INFRASTRUCTURE LAYER                                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ DocumentoHttpRepository                                │ │
│  │ - getDetallesJunta()                                  │ │
│  │ - getInstalacionJunta()                               │ │
│  │ - getPuntosAcuerdo()                                  │ │
│  │                                                       │ │
│  │ TemplateHttpRepository                                │ │
│  │ - getTemplate(tipo, tipoJunta) → Blob                 │ │
│  │                                                       │ │
│  │ DocxtemplaterProcessor                                │ │
│  │ - process(template, data) → Blob                      │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 4️⃣ <a id="backend"></a>BACKEND: CAPACIDADES Y ENDPOINTS

### 🔍 Estado Actual del Backend

**Según `docs/version 2.5/INFORME-BACKEND-V3-ESTADO-ACTUAL.md`:**

#### **GAP CRÍTICO: Generación de Documentos**

**Problema**: V3 no tiene sistema de generación de documentos

**Solución Corto Plazo**:
1. Frontend V3 usa sistema V2.5 como servicio
2. Llama a endpoints V2.5 para generar documentos
3. Descarga ZIP generado por V2.5

**Solución Largo Plazo**:
- Backend V3 implementa sistema de generación (2-3 semanas)
- Usar Docxtemplater + templates .docx
- Arquitectura hexagonal desde día 1

### 📡 Endpoints Disponibles

#### **1. Repositorio (Guardar Documentos)**

```typescript
// POST /api/v2/repositorio/:societyId/documentos-generados
// Body: {
//   flowId: number,
//   documentos: DocumentoGenerado[]
// }

// GET /api/v2/repositorio/:societyId/documentos-generados
// Response: {
//   data: DocumentosGenerados
// }

// GET /api/v2/repositorio/:societyId/documentos-generados/:documentoId
// Response: {
//   data: DocumentoGenerado
// }
```

#### **2. Descarga de Archivos (Repositorio)**

```typescript
// GET /repository/society/nodes/:nodeId/download
// Response: Blob (archivo descargable)

// GET /repository/society/nodes/:nodeCode/preview
// Response: Blob (preview del archivo)
```

### ❌ Endpoints NO Disponibles

1. **Generación de Documentos**:
   - ❌ `POST /api/v2/juntas/:societyId/:flowId/documentos/generar`
   - ❌ `POST /api/v2/juntas/:societyId/:flowId/documentos/generar-zip`
   - ❌ `GET /api/v2/juntas/:societyId/:flowId/documentos`

2. **Descarga Individual desde Backend**:
   - ❌ `GET /api/v2/juntas/:societyId/:flowId/documentos/:documentoId/download`

### ✅ Conclusión: Backend NO Soporta Generación

**Todo el proceso de generación es 100% Frontend**:
- ✅ Generación de documentos: Frontend
- ✅ Creación de ZIP: Frontend
- ✅ Descarga individual: Frontend
- ✅ Descarga múltiple: Frontend
- ✅ Descarga ZIP: Frontend
- ✅ Guardar en repositorio: Backend (solo almacenamiento)

---

## 5️⃣ <a id="reglas-negocio"></a>REGLAS DE NEGOCIO

### 📋 Reglas de Generación

#### **1. Documentos Obligatorios**

**Siempre se generan** (independiente de puntos de acuerdo):
- ✅ **Acta de Junta** (principal)
- ✅ **Convocatoria** (si es Junta General)
- ✅ **Proxy** (uno por cada accionista con representante)
- ✅ **Certificación** (del acta)
- ✅ **Solicitud de Copias** (si aplica)

#### **2. Documentos por Tipo de Acuerdo**

**Aporte Dinerario**:
- ✅ Minuta de Aumento de Capital
- ✅ Informe de Aporte Dinerario
- ✅ Certificado de Aportes (uno por aportante)
- ✅ Carta de Aviso
- ✅ Asiento Contable
- ✅ Certificado de Aportes (individual)

**Capitalización de Créditos**:
- ✅ Minuta de Capitalización
- ✅ Informe de Capitalización
- ✅ Certificado de Capitalización
- ✅ Asiento Contable

**Nombramientos**:
- ✅ Carta de Aceptación (uno por nombrado)
- ✅ Certificado de Nombramiento
- ✅ Registro de Facultades y Poderes

**Gestión Social**:
- ✅ Pronunciamiento de Estados Financieros
- ✅ Memoria Anual (si aplica)
- ✅ Acuerdo de Distribución de Utilidades

#### **3. Reglas de Nomenclatura**

**Formato**: `{correlativo}-{tipo}-{numero}-{nombre}.docx`

**Ejemplos**:
- `3-A-1-CONVOCATORIA.docx`
- `3-A-2-PROXY.docx`
- `3-A-4-ACTA.docx`
- `3-A-5-CERTIFICACION.docx`
- `3-A-6-MINUTA.docx`
- `3-A-11-CERTIFICADO.docx`

**Correlativo**: Incrementa por cada documento generado

#### **4. Reglas de Categorización**

**Categorías fijas**:
1. **Acta Principal**: Solo el acta
2. **Detalles de la Junta**: Convocatoria, Proxy, Asistencia
3. **Acuerdos: [Tipo]**: Documentos específicos del acuerdo
4. **Certificados**: Todos los certificados

**Lógica**:
- Un documento puede pertenecer a una sola categoría
- Los certificados siempre van en "Certificados"
- Los documentos de acuerdos van en su categoría específica

#### **5. Reglas de Envío al Repositorio**

**Por defecto**: ✅ Habilitado

**Comportamiento**:
- Si está habilitado: Guarda automáticamente al generar
- Si está deshabilitado: Solo descarga, no guarda

**Estructura en Repositorio**:
```
Operaciones/
  └─ Junta de Accionistas/
      └─ Junta #{flowId}/
          ├─ Acta/
          ├─ Convocatoria/
          ├─ Proxy/
          ├─ Acuerdos/
          │   ├─ Aumento de Capital/
          │   ├─ Nombramientos/
          │   └─ Gestión Social/
          └─ Certificados/
```

#### **6. Reglas de Validación**

**Antes de generar**:
- ✅ Todos los pasos 1-5 completados
- ✅ Quórum alcanzado (si aplica)
- ✅ Puntos de acuerdo con votación completada
- ✅ Presidente y Secretario designados

**Durante la generación**:
- ✅ Si falla un documento, continuar con los demás
- ✅ Registrar errores en consola
- ✅ Mostrar documentos exitosos aunque haya errores

**Después de generar**:
- ✅ Mostrar lista de documentos generados
- ✅ Mostrar errores (si los hay)
- ✅ Habilitar descarga solo si hay al menos 1 documento

---

## 6️⃣ <a id="plan-implementacion"></a>PLAN DE IMPLEMENTACIÓN

### 🎯 Fase 1: Vista y UI (1-2 días)

**Tareas**:
1. ✅ Crear componente `DescargarDocumentos.vue`
2. ✅ Implementar header de éxito
3. ✅ Implementar botón descargar ZIP
4. ✅ Implementar listado por categorías
5. ✅ Implementar DocumentoItem con hover
6. ✅ Implementar info box
7. ✅ Implementar checkbox repositorio

**Archivos**:
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/descargar.vue`
- `app/core/presentation/juntas/descargar/components/DescargarDocumentos.vue`
- `app/core/presentation/juntas/descargar/components/DocumentoItem.vue`
- `app/core/presentation/juntas/descargar/components/CategoriaDocumentos.vue`

### 🎯 Fase 2: Lógica de Generación (2-3 días)

**Tareas**:
1. ✅ Crear composable `useGenerateDocumentos.ts`
2. ✅ Adaptar `generateAporteDinerarioDocumentsV2` a V3
3. ✅ Crear store `useDocumentosGeneradosStore.ts`
4. ✅ Implementar categorización
5. ✅ Implementar generación automática al montar

**Archivos**:
- `app/core/presentation/juntas/descargar/composables/useGenerateDocumentos.ts`
- `app/core/presentation/juntas/descargar/stores/useDocumentosGeneradosStore.ts`

### 🎯 Fase 3: Funcionalidades de Descarga (1 día)

**Tareas**:
1. ✅ Implementar descarga individual
2. ✅ Implementar descarga múltiple (con checkboxes)
3. ✅ Implementar descarga ZIP
4. ✅ Implementar preview (opcional)

**Archivos**:
- `app/core/presentation/juntas/descargar/composables/useDownloadDocumentos.ts`

### 🎯 Fase 4: Integración con Repositorio (1 día)

**Tareas**:
1. ✅ Implementar guardado en repositorio
2. ✅ Manejar checkbox de envío
3. ✅ Mostrar feedback de guardado

**Archivos**:
- `app/core/presentation/juntas/descargar/composables/useSaveToRepository.ts`

### 🎯 Fase 5: Testing y Refinamiento (1 día)

**Tareas**:
1. ✅ Testing manual de flujo completo
2. ✅ Ajustes de UI/UX
3. ✅ Manejo de errores
4. ✅ Loading states

---

## ✅ RESUMEN EJECUTIVO

### **Vista**
- Basada en `JuntaDocumentosGenerados.tsx` (Probo Figma AI)
- Header de éxito con estadísticas
- Listado por categorías
- Botones de descarga individual y ZIP
- Checkbox para enviar al repositorio

### **Funcionalidades**
- **Generación**: 100% Frontend (Docxtemplater)
- **Descarga Individual**: 100% Frontend
- **Descarga Múltiple**: 100% Frontend
- **Descarga ZIP**: 100% Frontend (JSZip)
- **Guardar en Repositorio**: Frontend + Backend (API)

### **Arquitectura**
- **V2.5**: Función bisabuelo → abuelo → hijo → nieto (problemático)
- **V3 Propuesta**: Arquitectura hexagonal (Domain/Application/Infrastructure)

### **Backend**
- ❌ NO soporta generación de documentos
- ✅ Soporta guardar en repositorio
- ✅ Soporta descarga desde repositorio

### **Reglas de Negocio**
- Documentos obligatorios siempre se generan
- Documentos por tipo de acuerdo (condicionales)
- Nomenclatura: `{correlativo}-{tipo}-{numero}-{nombre}.docx`
- Categorización fija
- Envío al repositorio habilitado por defecto

---

**¿Listo para implementar, mi rey?** 🚀💪

