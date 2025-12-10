# 🏗️ V2.5: Repositorio AI - Arquitectura Frontend Completa

**Fecha**: 2 de Diciembre 2025  
**Enfoque**: Mapeo completo de arquitectura, vistas, flujos y código frontend  
**Estado**: ✅ Documentación completa

---

## 📋 ÍNDICE

1. [Arquitectura General](#arquitectura-general)
2. [Vistas y Páginas](#vistas-paginas)
3. [Flujos Completos por Funcionalidad](#flujos-funcionalidad)
4. [Librerías de Preview](#librerias-preview)
5. [Cómo se Hacen los Fetches](#fetches)
6. [Componentes y Su Flujo](#componentes-flujo)
7. [Composables y Servicios](#composables-servicios)

---

## 1️⃣ <a id="arquitectura-general"></a>ARQUITECTURA GENERAL

### **A. Principio: SIN STORES (Excepto 2 casos)**

El repositorio AI **NO usa Pinia stores** para la mayoría de funcionalidades. Solo usa:

1. **`files.store.ts`** - Estado local de archivos en una carpeta específica
2. **`hierarchical.store.ts`** - Estado local para navegación jerárquica
3. **`breadcrumb.store.ts`** - Estado local para breadcrumbs en carpetas personalizadas

**Todo lo demás funciona con:**
- ✅ **Servicios** (`services/`) - Llamadas HTTP directas
- ✅ **Composables** (`composables/`) - Lógica reactiva reutilizable
- ✅ **Componentes** - UI y eventos

---

### **B. Estructura de Carpetas**

```
src/modules/probo-ai/
├── pages/repository/
│   ├── Index.vue                    # Dashboard principal (carpetas raíz)
│   ├── otherDocuments/
│   │   └── OtherFiles.vue           # Documentos Societarios (navegación)
│   ├── proboDocuments/
│   │   ├── HierarchicalNodeView.vue # Documentos Generados (jerárquico)
│   │   └── AutoFolderView.vue       # Carpetas automáticas
│   └── personalizedFolder/
│       └── PersonalizedFolder.vue   # Carpetas personalizadas
├── components/repository/
│   ├── common/                      # Componentes compartidos
│   ├── documentPreview/             # Sistema de preview
│   ├── modals/                      # Modales (upload, rename, etc.)
│   └── search/                      # Búsqueda
├── services/                        # Servicios HTTP
├── composables/                     # Lógica reactiva
└── store/                           # Solo 3 stores locales
```

---

### **C. Flujo de Datos**

```
Vista (Vue Component)
    ↓
Composable (opcional) - Lógica reactiva
    ↓
Servicio (Service Class) - Llamada HTTP
    ↓
apiClient (axios) - Con interceptores
    ↓
Backend API
```

**Ejemplo Real:**
```typescript
// 1. VISTA: OtherFiles.vue
function onDeleteFile(file: FileWithPreview) {
  // 2. SERVICIO directo (sin composable)
  await NodeService.deleteNode(file.nodeId);
  
  // 3. RECARGAR datos
  await filesStore.fetchFiles(currentNodeId);
}
```

---

## 2️⃣ <a id="vistas-paginas"></a>VISTAS Y PÁGINAS

### **A. Dashboard Principal (`Index.vue`)**

**Ruta**: `/probo-ai/repository`  
**Propósito**: Mostrar carpetas raíz del sistema y carpetas personalizadas

**Funcionalidades**:
- ✅ Listar carpetas del sistema (Core, Common)
- ✅ Listar carpetas personalizadas
- ✅ Crear carpeta personalizada
- ✅ Renombrar carpeta
- ✅ Compartir carpeta
- ✅ Eliminar carpeta
- ✅ Búsqueda global

**GET que realiza**:
```typescript
// onMounted
async function loadRootFolders() {
  // GET /repository/society/{societyId}/virtual-nodes/root
  const folders = await FolderService.getRootFolders(societyId);
  
  // GET /repository/society/{societyId}/virtual-nodes/root (para personalizadas)
  const personalized = await FolderService.getAllPersonalizedFolders();
}
```

**Qué pasa después de acciones**:
- **Crear carpeta**: Recarga `loadRootFolders()`
- **Eliminar carpeta**: Recarga `loadRootFolders()`
- **Renombrar carpeta**: Actualiza estado local + recarga

---

### **B. Documentos Societarios (`OtherFiles.vue`)**

**Ruta**: `/probo-ai/repository/other-files/:nodeId`  
**Propósito**: Navegación tipo Google Drive para documentos societarios

**Funcionalidades**:
- ✅ Navegar por carpetas (breadcrumbs)
- ✅ Subir archivos (drag & drop)
- ✅ Crear carpetas
- ✅ Previsualizar documentos
- ✅ Descargar archivos
- ✅ Eliminar archivos/carpetas
- ✅ Renombrar archivos/carpetas
- ✅ Editar metadata
- ✅ Descargar carpeta ZIP

**GET que realiza**:
```typescript
// onMounted + watch(nodeId)
async function loadFolders() {
  // GET /repository/society/nodes/{nodeId}
  const childNodes = await NodeService.getChildNodes(nodeId);
}

async function loadFiles() {
  // GET /repository/society/nodes/{nodeId} (vía filesStore)
  await filesStore.fetchFiles(nodeId.toString());
}

async function updateBreadcrumbs() {
  // GET /repository/society/nodes/{nodeId} (recursivo hacia arriba)
  const breadcrumbs = await NodeService.getBreadcrumbs(nodeId, companyName);
}
```

**Qué pasa después de acciones**:

| Acción | Endpoint | Después |
|--------|----------|---------|
| **Subir archivo** | `POST /nodes/{folderId}/documents` | `filesStore.fetchFiles()` + `refreshStorage()` |
| **Eliminar archivo** | `DELETE /nodes/{nodeId}` | `filesStore.fetchFiles()` + `refreshStorage()` |
| **Renombrar archivo** | `PATCH /nodes/{nodeId}` | Actualiza estado local |
| **Crear carpeta** | `POST /nodes` | `loadFolders()` |
| **Eliminar carpeta** | `DELETE /nodes/{nodeId}` | `loadFolders()` + `refreshStorage()` |
| **Renombrar carpeta** | `PATCH /nodes/{nodeId}` | Actualiza estado local |
| **Descargar ZIP** | `GET /nodes/{nodeId}/download-zip` | Solo descarga, no recarga |
| **Previsualizar** | `GET /documents/versions/{versionCode}/download` | Abre modal, no recarga lista |

**Código de ejemplo - Eliminar archivo**:
```typescript
async function onDeleteFile(file: FileWithPreview) {
  // 1. Confirmar
  const confirmed = await alertToConfirmDelete({ text: "..." });
  if (!confirmed) return;
  
  // 2. Eliminar
  await NodeService.deleteNode(file.nodeId);
  
  // 3. Actualizar store local
  filesStore.removeFile(file.id);
  
  // 4. Recargar desde backend
  await filesStore.fetchFiles(currentNodeId.toString());
  
  // 5. Actualizar storage
  await refreshStorageAfterFileOperation(societyId);
  
  // 6. Cerrar preview si estaba abierto
  if (selectedFileToPreview.value?.id === file.id) {
    handleDocumentPreviewClose();
  }
}
```

---

### **C. Documentos Generados (`HierarchicalNodeView.vue`)**

**Ruta**: `/probo-ai/repository/probo-documents/:nodeId(.*)`  
**Propósito**: Navegación jerárquica de documentos generados automáticamente

**Funcionalidades**:
- ✅ Navegar jerarquía (Juntas → Junta específica → Documentos)
- ✅ Previsualizar documentos
- ✅ Descargar documentos
- ✅ Eliminar documentos
- ✅ Linkear a carpetas personalizadas

**GET que realiza**:
```typescript
// onMounted
async function loadNodeContent() {
  // GET /repository/society/nodes/{nodeId}
  const node = await NodeService.getNode(nodeId);
  
  // Si es carpeta, obtener hijos
  if (node.type === 1) {
    hierarchicalStore.childNodes = node.children || [];
  }
}
```

**Qué pasa después de acciones**:
- **Eliminar documento**: `loadNodeContent()` (recarga nodo completo)
- **Previsualizar**: Abre modal, no recarga
- **Descargar**: Solo descarga, no recarga

---

### **D. Carpetas Personalizadas (`PersonalizedFolder.vue`)**

**Ruta**: `/probo-ai/repository/personalized-folder/:folderId`  
**Propósito**: Gestionar carpeta personalizada con chat IA

**Funcionalidades**:
- ✅ Ver documentos linkeados
- ✅ Ver subcarpetas
- ✅ Agregar documentos (búsqueda)
- ✅ Crear subcarpetas
- ✅ Previsualizar documentos
- ✅ Eliminar documentos/carpetas
- ✅ Chat con IA (si tiene acceso)

**GET que realiza**:
```typescript
// onMounted
async function loadFolderContent() {
  // GET /repository/society/virtual-nodes/{folderId}
  const folder = await FolderService.getPersonalizedFoldersById(folderId);
  
  // Los documentos vienen en folder.children (rawVirtualChildren)
  rawVirtualChildren.value = folder.children || [];
}
```

**Qué pasa después de acciones**:
- **Agregar documento**: `loadFolderContent()` (recarga carpeta)
- **Eliminar documento**: `loadFolderContent()` (recarga carpeta)
- **Crear subcarpeta**: `loadFolderContent()` (recarga carpeta)

---

## 3️⃣ <a id="flujos-funcionalidad"></a>FLUJOS COMPLETOS POR FUNCIONALIDAD

### **A. SUBIR ARCHIVO**

**Flujo completo**:

```typescript
// 1. VISTA: OtherFiles.vue
const handleFilesSelected = async (files: File[]) => {
  // 2. COMPOSABLE: useFileUpload
  await uploadMultipleFiles(files, folderId, companyName);
  
  // 3. SERVICIO: FileService.uploadFile
  // POST /repository/society/nodes/{folderId}/documents
  const response = await FileService.uploadFile(file, folderId);
  
  // 4. DESPUÉS: Recargar lista
  await filesStore.fetchFiles(folderId);
  
  // 5. DESPUÉS: Actualizar storage
  await refreshStorageAfterFileOperation(societyId);
};
```

**Código completo**:
```typescript
// src/modules/probo-ai/composables/useFileUpload.ts
const uploadFile = async (file: File, folderId: string, metadata: any) => {
  // Crear objeto de archivo
  const uploadedFile: UploadedFile = {
    id: `temp-${Date.now()}`,
    name: file.name,
    status: "uploading",
    // ...
  };
  
  uploadedFiles.value.push(uploadedFile);
  
  // Llamar servicio
  const uploadResponse = await FileService.uploadFile(file, folderId);
  
  // Actualizar estado
  updateFileStatus(uploadedFile.id, "completed", uploadResponse);
};

// src/modules/probo-ai/services/fileService.ts
static async uploadFile(file: File, folderId: string) {
  const formData = new FormData();
  const fileFieldUUID = window.crypto.randomUUID();
  formData.append(fileFieldUUID, file);
  
  const endpoint = `/repository/society/nodes/${folderId}/documents`;
  
  const response = await apiClient.post(endpoint, formData, {
    headers: {
      "x-file-size": file.size.toString(),
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
}
```

---

### **B. PREVISUALIZAR DOCUMENTO**

**Flujo completo**:

```typescript
// 1. VISTA: OtherFiles.vue
function onPreviewFile(file: FileWithPreview) {
  selectedFileToPreview.value = file;
  showDocumentPreviewModal.value = true;
}

// 2. MODAL: DocumentPreviewModal.vue
// Convierte FileWithPreview → DocumentFile
const convertedFile = computed(() => {
  return {
    id: props.file.versionCode || props.file.id,
    name: props.file.name,
    // ...
  };
});

// 3. VIEWER: DocumentViewer.vue
// Usa composable useDocumentViewer
const viewer = useDocumentViewer();

// 4. COMPOSABLE: useDocumentViewer.ts
async function loadPdfDocument(file: DocumentFile) {
  // GET /repository/society/documents/versions/{versionCode}/download
  const fileBlob = await downloadFileVersion(file.id);
  
  // Convertir a PDF con pdfjs-dist
  const pdf = await pdfjsLib.getDocument({
    data: await fileBlob.arrayBuffer(),
  }).promise;
  
  // Renderizar en canvas
  await renderPdfInContainer(pdf, pdfViewerRef.value);
}
```

**Librerías usadas**:
- **PDF**: `pdfjs-dist` (renderiza en canvas)
- **Word**: `mammoth` (convierte DOCX → HTML) + `html2canvas` (HTML → imagen)
- **Excel**: `xlsx` (lee archivo) + `html2canvas` (tabla → imagen)
- **PowerPoint**: `@vue-office/pptx` (renderiza PPTX)

---

### **C. ELIMINAR ARCHIVO**

**Flujo completo**:

```typescript
// 1. VISTA: OtherFiles.vue
async function onDeleteFile(file: FileWithPreview) {
  // 2. Confirmar
  const confirmed = await alertToConfirmDelete({ text: "..." });
  if (!confirmed) return;
  
  // 3. SERVICIO: NodeService.deleteNode
  // DELETE /repository/society/nodes/{nodeId}
  await NodeService.deleteNode(file.nodeId);
  
  // 4. DESPUÉS: Actualizar store local
  filesStore.removeFile(file.id);
  
  // 5. DESPUÉS: Recargar desde backend
  await filesStore.fetchFiles(currentNodeId.toString());
  
  // 6. DESPUÉS: Actualizar storage
  await refreshStorageAfterFileOperation(societyId);
  
  // 7. DESPUÉS: Cerrar preview si estaba abierto
  if (selectedFileToPreview.value?.id === file.id) {
    handleDocumentPreviewClose();
  }
}
```

**Código del servicio**:
```typescript
// src/modules/probo-ai/services/nodeService.ts
static async deleteNode(nodeId: number): Promise<void> {
  const response = await apiClient.delete(
    `/repository/society/nodes/${nodeId}`
  );
  
  if (response.status !== 204) {
    throw new Error(response.data.message);
  }
}
```

---

### **D. EDITAR METADATA (Renombrar)**

**Flujo completo**:

```typescript
// 1. VISTA: OtherFiles.vue
function onPreviewFile(file: FileWithPreview) {
  // Abre modal de preview
  selectedFileToPreview.value = file;
  showDocumentPreviewModal.value = true;
}

// 2. MODAL: DocumentPreviewModal → DocumentViewer
// Usuario edita nombre en sidebar

// 3. VIEWER: DocumentViewer.vue
async function handleSaveChanges() {
  // PATCH /repository/society/nodes/{nodeId}
  await NodeService.updateDocumentName(
    props.file.nodeId,
    metadata.value.name
  );
  
  // Emitir evento
  emit("save", metadata.value);
}

// 4. VISTA: OtherFiles.vue (handler)
async function handleDocumentPreviewSave(metadata: any) {
  // Actualizar nombre en lista local
  const fileIndex = allFiles.value.findIndex(
    (f) => f.id === selectedFileToPreview.value?.id
  );
  if (fileIndex !== -1) {
    allFiles.value[fileIndex].name = metadata.name;
    allFiles.value[fileIndex].metadata.name = metadata.name;
  }
  
  // Cerrar modal
  handleDocumentPreviewClose();
}
```

**Código del servicio**:
```typescript
// src/modules/probo-ai/services/nodeService.ts
static async updateDocumentName(nodeId: number, name: string) {
  return await this.updateNode(nodeId, { name });
}

static async updateNode(nodeId: number, updateData: { name?: string }) {
  const url = `repository/society/nodes/${nodeId}`;
  
  const response = await apiClient.patch(url, updateData);
  
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  
  return response.data.data;
}
```

---

### **E. DESCARGAR ARCHIVO**

**Flujo completo**:

```typescript
// 1. VISTA: OtherFiles.vue
async function onDownloadFile(file: FileWithPreview) {
  // 2. SERVICIO: fileVersionService
  // GET /repository/society/documents/versions/{versionCode}/download
  await downloadFileVersionWithName(file.versionCode, file.name);
}

// 3. SERVICIO: fileVersionService.ts
export async function downloadFileVersionWithName(
  documentVersionCode: string,
  fileName: string
): Promise<void> {
  // Descargar blob
  const blob = await downloadFileVersion(documentVersionCode);
  
  // Crear URL temporal
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  
  // Simular clic
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Limpiar URL
  window.URL.revokeObjectURL(url);
}

export async function downloadFileVersion(
  documentVersionCode: string
): Promise<Blob> {
  const endpoint = `/repository/society/documents/versions/${documentVersionCode}/download`;
  
  const response = await apiClient.get(endpoint, {
    responseType: "blob",
  });
  
  return response.data;
}
```

---

### **F. SUBIR NUEVA VERSIÓN**

**Flujo completo**:

```typescript
// 1. VIEWER: DocumentViewer → DocumentSidebar → HistoryTab
// Usuario hace clic en "Subir nueva versión"

// 2. MODAL: UploadNewVersionModal.vue
async function handleUpload() {
  // 3. SERVICIO: fileVersionService
  // POST /repository/society/documents/{documentCode}/versions
  await uploadNewVersionByNodeId(props.file.nodeId, selectedFile.value);
  
  // 4. DESPUÉS: Recargar versiones
  emit("version-uploaded");
}

// 5. VIEWER: DocumentViewer.vue
async function handleNewVersionUploaded() {
  // Recargar documento completo
  await viewer.handleNewVersionUploaded(
    props.file.id,
    loadDocument,
    props.file.nodeId
  );
  
  // Esto recarga las versiones y actualiza el preview
}
```

**Código del servicio**:
```typescript
// src/modules/probo-ai/services/fileVersionService.ts
export async function uploadNewVersionByNodeId(
  nodeId: number,
  file: File
): Promise<any> {
  // 1. Obtener documentCode del nodo
  const documentCode = await getDocumentCodeFromNode(nodeId);
  
  // 2. Subir nueva versión
  return await uploadNewVersion(documentCode, file);
}

export async function uploadNewVersion(
  documentCode: string,
  file: File
): Promise<any> {
  const formData = new FormData();
  const fileFieldUUID = window.crypto.randomUUID();
  formData.append(fileFieldUUID, file);
  
  const endpoint = `/repository/society/documents/${documentCode}/versions`;
  
  const response = await apiClient.post(endpoint, formData, {
    headers: {
      "x-file-size": file.size.toString(),
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
}
```

---

### **G. RESTAURAR VERSIÓN**

**Flujo completo**:

```typescript
// 1. VIEWER: DocumentViewer → DocumentSidebar → HistoryTab
// Usuario hace clic en "Restaurar" en una versión antigua

// 2. COMPONENTE: CardDocumentVersion.vue
async function handleRestore() {
  // 3. SERVICIO: fileVersionService
  // POST /repository/society/documents/{documentCode}/versions/{versionCode}/restore
  await revertDocumentVersionToRestore(
    props.version.fileId,  // documentCode
    props.version.id        // versionCode
  );
  
  emit("restored");
}

// 4. VIEWER: DocumentViewer.vue
async function handleRefreshVersions() {
  // Recargar versiones
  const versions = await getDocumentVersionsFromNode(nodeId);
  
  // Actualizar versión actual
  currentVersionInfo.value = versions.data[0];
  
  // Recargar documento
  await loadDocument();
}
```

---

### **H. CREAR CARPETA**

**Flujo completo**:

```typescript
// 1. VISTA: OtherFiles.vue
function onAddFolder() {
  showAddFolderModal.value = true;
}

// 2. MODAL: AddFolderModal.vue
async function handleAdd(folderName: string) {
  // 3. SERVICIO: NodeService.createFolder
  // POST /repository/society/nodes
  const newFolder = await NodeService.createFolder({
    name: folderName,
    parentId: currentNodeId,
  });
  
  emit("add", newFolder);
}

// 4. VISTA: OtherFiles.vue (handler)
async function handleAddFolderConfirm(folderName: string) {
  const newFolder = await FolderService.createFolder({
    name: folderName,
    parentId: nodeId.value || 2,
  });
  
  // Agregar a lista local
  folders.value.push(newFolder);
  
  // DESPUÉS: No recarga, solo actualiza estado local
  // (pero podría recargar con loadFolders() si se prefiere)
}
```

---

### **I. BUSCAR DOCUMENTOS**

**Flujo completo**:

```typescript
// 1. COMPONENTE: SearchBar.vue
const handleSearch = async () => {
  // 2. SERVICIO: SearchService
  // GET /repository/society/{societyId}/documents/search?search={query}
  const results = await searchService.searchFilesNew(
    {
      semanticInput: searchQuery.value,
      filters: { page: 1, limit: 20 },
    },
    appStore.societySelectId
  );
  
  // 3. Navegar a resultados
  router.push({
    name: "SearchResults",
    query: { q: searchQuery.value },
  });
};

// 4. PÁGINA: SearchResultsPage.vue
// Muestra resultados y permite abrir/previsualizar
```

**Búsqueda semántica (IA)**:
```typescript
// POST /repository/society/{societyId}/documents/search
const results = await searchService.searchSemanticNew(
  {
    semanticInput: searchQuery.value,
    filters: { page: 1, limit: 20 },
  },
  societyId
);
```

---

## 4️⃣ <a id="librerias-preview"></a>LIBRERÍAS DE PREVIEW

### **A. Librerías Instaladas**

```json
{
  "pdfjs-dist": "^5.3.31",        // PDF rendering
  "mammoth": "^1.9.0",            // DOCX → HTML
  "xlsx": "^0.18.5",              // Excel reading
  "html2canvas": "^1.4.1",        // HTML → Canvas → Image
  "@vue-office/pptx": "^1.0.1"    // PowerPoint rendering
}
```

---

### **B. Cómo Funciona el Preview**

#### **1. PDF (pdfjs-dist)**

```typescript
// src/modules/probo-ai/composables/useDocumentViewer.ts
import * as pdfjsLib from "pdfjs-dist";

async function loadPdfDocument(file: DocumentFile) {
  // 1. Descargar archivo
  const fileBlob = await downloadFileVersion(file.id);
  
  // 2. Cargar PDF con pdfjs-dist
  const pdf = await pdfjsLib.getDocument({
    data: await fileBlob.arrayBuffer(),
    cMapUrl: "...",
    cMapPacked: true,
  }).promise;
  
  // 3. Renderizar cada página en canvas
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: zoom.value / 100 });
    
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
    
    container.appendChild(canvas);
  }
}
```

**Configuración del Worker**:
```typescript
// pdfjs-dist necesita un worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

// En package.json:
"postinstall": "cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.mjs"
```

---

#### **2. Word DOCX (mammoth + html2canvas)**

```typescript
// src/modules/probo-ai/services/filePreviewService.ts
static async generateWordPreview(file: File, options: PreviewOptions) {
  // 1. Convertir DOCX → HTML con mammoth
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.default.convertToHtml({ arrayBuffer });
  
  // 2. Limpiar HTML (eliminar funciones de color no soportadas)
  let cleanedHtml = this.sanitizeHtmlForCanvas(result.value);
  
  // 3. Crear elemento temporal
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = cleanedHtml;
  tempDiv.style.width = `${width}px`;
  tempDiv.style.backgroundColor = "white";
  document.body.appendChild(tempDiv);
  
  // 4. Convertir HTML → Canvas → DataURL con html2canvas
  const html2canvas = await import("html2canvas");
  const canvas = await html2canvas.default(tempDiv, {
    width: width,
    height: height,
    backgroundColor: "#ffffff",
  });
  
  // 5. Obtener imagen
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  
  // 6. Limpiar
  document.body.removeChild(tempDiv);
  
  return dataUrl;
}
```

---

#### **3. Excel (xlsx + html2canvas)**

```typescript
// src/modules/probo-ai/services/filePreviewService.ts
static async generateExcelPreview(file: File, options: PreviewOptions) {
  // 1. Leer Excel con xlsx
  const XLSX = await import("xlsx");
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  
  // 2. Obtener primera hoja
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // 3. Convertir a HTML
  const html = XLSX.utils.sheet_to_html(worksheet);
  
  // 4. Limpiar HTML
  const cleanedHtml = this.sanitizeHtmlForCanvas(html);
  
  // 5. Crear elemento temporal
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = cleanedHtml;
  tempDiv.style.width = `${width}px`;
  document.body.appendChild(tempDiv);
  
  // 6. Convertir a imagen con html2canvas
  const html2canvas = await import("html2canvas");
  const canvas = await html2canvas.default(tempDiv, {
    width: width,
    height: height,
    backgroundColor: "#ffffff",
  });
  
  const dataUrl = canvas.toDataURL("image/jpeg", quality);
  document.body.removeChild(tempDiv);
  
  return dataUrl;
}
```

**Para vista interactiva (ExcelViewer.vue)**:
```typescript
// src/modules/probo-ai/components/repository/documentPreview/ExcelViewer.vue
// Usa xlsx para leer y renderizar tabla HTML interactiva
const XLSX = await import("xlsx");
const workbook = XLSX.read(arrayBuffer, { type: "array" });
const html = XLSX.utils.sheet_to_html(worksheet);
// Renderiza HTML directamente (no imagen)
```

---

#### **4. PowerPoint (@vue-office/pptx)**

```typescript
// src/modules/probo-ai/components/repository/documentPreview/DocumentViewer.vue
import VueOfficePptx from "@vue-office/pptx";

// Descargar archivo
const fileBlob = await downloadFileVersion(file.id);
const blobUrl = URL.createObjectURL(fileBlob);

// Renderizar con VueOfficePptx
<VueOfficePptx
  :src="blobUrl"
  style="height: 100%; width: 100%;"
  @rendered="onPptxRendered"
  @error="onPptxError"
/>
```

---

### **C. Servicio Centralizado: FilePreviewService**

```typescript
// src/modules/probo-ai/services/filePreviewService.ts
export class FilePreviewService {
  static async generateFilePreview(
    file: File,
    options: PreviewOptions = {}
  ): Promise<string | null> {
    const mimeType = file.type;
    const fileName = file.name;
    
    // PDF
    if (isPdfFile(mimeType, fileName)) {
      return await this.generatePdfPreview(file, options);
    }
    
    // Word
    if (isWordFile(mimeType, fileName)) {
      return await this.generateWordPreview(file, options);
    }
    
    // Excel
    if (isExcelFile(mimeType, fileName)) {
      return await this.generateExcelPreview(file, options);
    }
    
    // Imágenes
    if (isImageFile(mimeType)) {
      return await this.generateImagePreview(file, options);
    }
    
    return null;
  }
}
```

---

## 5️⃣ <a id="fetches"></a>CÓMO SE HACEN LOS FETCHES

### **A. apiClient (Axios con Interceptores)**

```typescript
// src/modules/probo-ai/services/apiClient.ts
import axios from "axios";
import { PROBO_AI_CONFIG } from "@/modules/probo-ai/config/environment";

// Crear instancia
export const apiClient = axios.create({
  baseURL: PROBO_AI_CONFIG.API_BASE_URL, // http://localhost:3000/api/v1
  timeout: PROBO_AI_CONFIG.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request: Agregar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(PROBO_AI_CONFIG.AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response: Manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado
      localStorage.removeItem(PROBO_AI_CONFIG.AUTH_TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

---

### **B. Uso en Servicios**

```typescript
// Ejemplo: NodeService
export class NodeService {
  static async getNode(nodeId: number | string): Promise<NodeResponseDto> {
    // GET automático con token
    const response = await apiClient.get<ApiResponse<NodeResponseDto>>(
      `/repository/society/nodes/${nodeId}`
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    return response.data.data;
  }
  
  static async deleteNode(nodeId: number): Promise<void> {
    // DELETE automático con token
    const response = await apiClient.delete<ApiResponse<null>>(
      `/repository/society/nodes/${nodeId}`
    );
    
    if (response.status !== 204) {
      throw new Error(response.data.message);
    }
  }
}
```

---

### **C. FormData para Uploads**

```typescript
// Ejemplo: FileService.uploadFile
static async uploadFile(file: File, folderId: string) {
  // Crear FormData
  const formData = new FormData();
  const fileFieldUUID = window.crypto.randomUUID();
  formData.append(fileFieldUUID, file);
  
  // POST con FormData
  const response = await apiClient.post(endpoint, formData, {
    headers: {
      "x-file-size": file.size.toString(),
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Importante
    },
  });
  
  return response.data;
}
```

---

### **D. Blob para Downloads**

```typescript
// Ejemplo: fileVersionService.downloadFileVersion
export async function downloadFileVersion(
  documentVersionCode: string
): Promise<Blob> {
  const endpoint = `/repository/society/documents/versions/${documentVersionCode}/download`;
  
  // GET con responseType: "blob"
  const response = await apiClient.get(endpoint, {
    responseType: "blob", // Importante para archivos
  });
  
  return response.data; // Es un Blob
}
```

---

## 6️⃣ <a id="componentes-flujo"></a>COMPONENTES Y SU FLUJO

### **A. DocumentPreviewModal**

**Propósito**: Modal wrapper para el viewer completo

**Flujo**:
```
FileWithPreview (desde lista)
    ↓
DocumentPreviewModal (convierte a DocumentFile)
    ↓
DocumentViewer (usa useDocumentViewer)
    ↓
DocumentPreview (renderiza según tipo)
    ↓
DocumentSidebar (metadata, versiones)
```

**Código**:
```vue
<!-- DocumentPreviewModal.vue -->
<template>
  <DocumentViewer
    v-if="file && convertedFile"
    :file="convertedFile"
    :node-id="file.nodeId"
    @close="handleClose"
    @save="handleSave"
  />
</template>

<script setup lang="ts">
// Convierte FileWithPreview → DocumentFile
const convertedFile = computed((): DocumentFile | null => {
  if (!props.file) return null;
  
  return {
    id: props.file.versionCode || props.file.id,
    name: props.file.name,
    size: props.file.size,
    type: props.file.type,
    nodeId: props.file.nodeId,
    // ...
  };
});
</script>
```

---

### **B. DocumentViewer**

**Propósito**: Viewer completo con toolbar, preview y sidebar

**Estructura**:
```vue
<template>
  <!-- Header -->
  <DocumentHeader />
  
  <!-- Toolbar -->
  <DocumentToolbar />
  
  <!-- Preview -->
  <DocumentPreview
    :is-pdf="viewer.isPdf.value(currentFile)"
    :is-office="viewer.isOffice.value(currentFile)"
    @mounted="viewer.setPdfViewerRef"
  />
  
  <!-- Sidebar -->
  <DocumentSidebar
    :metadata="viewer.metadata.value"
    @saveChanges="handleSaveChanges"
  />
</template>
```

**Composable usado**:
```typescript
// useDocumentViewer.ts
const viewer = useDocumentViewer();

// Inicializar
await viewer.initializeDocument(file);

// Cargar PDF
await viewer.loadPdfDocument(file, onPreviewMessage, pdfViewerRef.value);

// Cargar Office
await viewer.loadOfficeDocument(file, onPreviewMessage, officeViewerRef.value);
```

---

### **C. FileList**

**Propósito**: Lista de archivos con acciones

**Eventos emitidos**:
```vue
<FileList
  :files="files"
  @view="onViewFile"           // Ver detalles
  @preview="onPreviewFile"     // Abrir preview
  @download="onDownloadFile"   // Descargar
  @delete="onDeleteFile"       // Eliminar
  @edit-metadata="onEditMetadata" // Editar
/>
```

**Flujo de preview**:
```typescript
// FileList.vue → OtherFiles.vue
function onPreviewFile(file: FileWithPreview) {
  selectedFileToPreview.value = file;
  showDocumentPreviewModal.value = true;
}
```

---

### **D. FolderList**

**Propósito**: Lista de carpetas con acciones

**Eventos emitidos**:
```vue
<FolderList
  :folders="folders"
  @open="onOpenFolder"              // Navegar
  @rename="onRenameFolder"          // Renombrar
  @download="onDownloadFolder"     // ZIP
  @delete="onDeleteFolder"          // Eliminar
  @share="onShareFolder"            // Compartir
  @chat="onStartChat"               // Chat IA
/>
```

---

## 7️⃣ <a id="composables-servicios"></a>COMPOSABLES Y SERVICIOS

### **A. Composables Principales**

#### **1. useFileUpload**

**Propósito**: Gestionar subida de archivos con progreso

```typescript
// src/modules/probo-ai/composables/useFileUpload.ts
export function useFileUpload() {
  const uploadedFiles = ref<UploadedFile[]>([]);
  const isUploading = ref(false);
  
  const uploadFile = async (file: File, folderId: string, metadata: any) => {
    // Crear objeto de archivo
    const uploadedFile: UploadedFile = {
      id: `temp-${Date.now()}`,
      name: file.name,
      status: "uploading",
      uploadProgress: { current: 0, total: file.size, percentage: 0 },
    };
    
    uploadedFiles.value.push(uploadedFile);
    
    // Subir
    const response = await FileService.uploadFile(file, folderId);
    
    // Actualizar estado
    updateFileStatus(uploadedFile.id, "completed", response);
  };
  
  const uploadMultipleFiles = async (
    files: File[],
    folderId: string,
    companyName?: string
  ) => {
    isUploading.value = true;
    
    for (const file of files) {
      const metadata = {
        name: file.name,
        year: new Date().getFullYear().toString(),
        documentType: "documento",
        company: companyName || "Empresa",
      };
      
      await uploadFile(file, folderId, metadata);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    
    isUploading.value = false;
  };
  
  return {
    uploadedFiles,
    isUploading,
    uploadFile,
    uploadMultipleFiles,
    cancelIndividualUpload,
    deleteFile,
  };
}
```

---

#### **2. useDocumentViewer**

**Propósito**: Gestionar estado y lógica del viewer de documentos

**Funciones principales**:
- `loadPdfDocument()` - Cargar y renderizar PDF
- `loadOfficeDocument()` - Cargar y renderizar Word
- `handleSelectVersion()` - Cambiar versión
- `handleRefreshVersions()` - Recargar versiones
- `saveChanges()` - Guardar metadata

**Estado reactivo**:
```typescript
const isLoading = ref(true);
const error = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const zoom = ref(100);
const metadata = ref({ name: "", year: "", documentType: "", company: "" });
const currentVersionInfo = ref({ id: "", name: "", versionNumber: 0 });
```

---

#### **3. useFilePreview**

**Propósito**: Generar previews de archivos (thumbnails)

```typescript
// src/modules/probo-ai/composables/useFilePreview.ts
export function useFilePreview() {
  const state = ref<FilePreviewState>({
    isLoading: false,
    error: null,
    preview: null,
    analysis: null,
  });
  
  const generatePreview = async (file: File, options?: PreviewOptions) => {
    state.value.isLoading = true;
    
    const previewResult = await FilePreviewService.generateFilePreview(file, options);
    
    if (previewResult) {
      state.value.preview = previewResult;
    } else {
      state.value.error = "No se pudo generar el preview";
    }
    
    state.value.isLoading = false;
  };
  
  return {
    state: readonly(state),
    isLoading: computed(() => state.value.isLoading),
    preview: computed(() => state.value.preview),
    generatePreview,
  };
}
```

---

#### **4. useFileSelection**

**Propósito**: Gestionar selección múltiple de archivos

```typescript
// src/modules/probo-ai/composables/useFileSelection.ts
export function useFileSelection() {
  const selectedFiles = ref<Set<string>>(new Set());
  
  const isSelected = (fileId: string) => selectedFiles.value.has(fileId);
  
  const toggleSelection = (fileId: string) => {
    if (selectedFiles.value.has(fileId)) {
      selectedFiles.value.delete(fileId);
    } else {
      selectedFiles.value.add(fileId);
    }
  };
  
  const clearSelection = () => {
    selectedFiles.value.clear();
  };
  
  return {
    isSelected,
    toggleSelection,
    clearSelection,
    selectedCount: computed(() => selectedFiles.value.size),
    hasSelection: computed(() => selectedFiles.value.size > 0),
    selectedFilesList: computed(() => Array.from(selectedFiles.value)),
  };
}
```

---

### **B. Servicios Principales**

#### **1. NodeService**

**Propósito**: Gestionar nodos (carpetas y documentos)

**Métodos principales**:
- `getNode(nodeId)` - Obtener nodo por ID
- `getRootNodes(societyId)` - Obtener nodos raíz
- `getChildNodes(nodeId)` - Obtener hijos
- `createFolder(request)` - Crear carpeta
- `updateNode(nodeId, data)` - Actualizar nodo
- `deleteNode(nodeId)` - Eliminar nodo
- `getBreadcrumbs(nodeId, companyName)` - Obtener breadcrumbs

---

#### **2. FileService**

**Propósito**: Gestionar archivos

**Métodos principales**:
- `uploadFile(file, folderId)` - Subir archivo
- `getFolderFiles(folderId)` - Listar archivos de carpeta
- `generateThumbnail(file)` - Generar miniatura

---

#### **3. FileVersionService**

**Propósito**: Gestionar versiones de documentos

**Métodos principales**:
- `uploadNewVersion(documentCode, file)` - Subir nueva versión
- `downloadFileVersion(versionCode)` - Descargar versión
- `getDocumentVersionsFromNode(nodeId)` - Listar versiones
- `revertDocumentVersionToRestore(documentCode, versionCode)` - Restaurar versión

---

#### **4. FolderService**

**Propósito**: Gestionar carpetas (sistema y personalizadas)

**Métodos principales**:
- `getRootFolders(societyId)` - Obtener carpetas raíz
- `createFolder(request)` - Crear carpeta sistema
- `createPersonalizedFolder(request)` - Crear carpeta personalizada
- `deletePersonalizedFolder(virtualNodeId)` - Eliminar carpeta personalizada
- `linkDocumentToVirtualFolder(virtualNodeId, documentNodeId)` - Linkear documento

---

#### **5. SearchService**

**Propósito**: Búsqueda de documentos

**Métodos principales**:
- `searchFilesNew(params, societyId)` - Búsqueda simple (GET)
- `searchSemanticNew(params, societyId)` - Búsqueda semántica (POST)

---

## ✅ RESUMEN EJECUTIVO

### **Arquitectura**

✅ **Sin stores** (excepto 3 casos locales)  
✅ **Servicios** para llamadas HTTP  
✅ **Composables** para lógica reactiva  
✅ **Componentes** para UI

### **Flujos**

✅ **Subir**: `uploadFile()` → `POST /nodes/{folderId}/documents` → `fetchFiles()`  
✅ **Eliminar**: `deleteNode()` → `DELETE /nodes/{nodeId}` → `fetchFiles()` + `refreshStorage()`  
✅ **Preview**: `downloadFileVersion()` → `GET /versions/{code}/download` → Renderizar con librerías  
✅ **Editar**: `updateDocumentName()` → `PATCH /nodes/{nodeId}` → Actualizar estado local

### **Librerías Preview**

✅ **PDF**: `pdfjs-dist` (canvas)  
✅ **Word**: `mammoth` (DOCX→HTML) + `html2canvas` (HTML→imagen)  
✅ **Excel**: `xlsx` (lectura) + `html2canvas` (tabla→imagen)  
✅ **PowerPoint**: `@vue-office/pptx` (renderizado)

### **Fetches**

✅ **apiClient** (axios) con interceptores automáticos  
✅ **Token** agregado automáticamente  
✅ **FormData** para uploads  
✅ **Blob** para downloads

---

**¡Listo para replicar en V3, mi rey!** 🚀💪

