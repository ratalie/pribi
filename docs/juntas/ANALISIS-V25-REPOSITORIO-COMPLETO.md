# 📚 ANÁLISIS COMPLETO: REPOSITORIO V2.5 → V3

**Fecha**: 8 de Diciembre 2025  
**Estado**: 📝 ANÁLISIS COMPLETO  
**Objetivo**: Entender cómo funciona el repositorio en V2.5 para implementarlo en V3

---

## 🎯 OBJETIVO DE ESTA ETAPA/ISSUE

### **Objetivo Principal**

Implementar la funcionalidad completa de envío y visualización de documentos en el repositorio V3, basándonos en el funcionamiento de V2.5:

1. ✅ **Botón "Enviar al Repositorio"**: Funcional en la vista de descarga de documentos
2. ✅ **Vista Repositorio**: Seleccionar sociedad y ver documentos subidos
3. ✅ **Repositorio V3 (Google Drive Clone)**: Funcionalidad completa tipo Google Drive

### **Archivos de V2.5 a Revisar Constantemente**

**⚠️ IMPORTANTE**: Estos archivos son la referencia principal para la implementación:

#### **1. Envío de Documentos al Repositorio**

```
../probo-2.5/src/composables/connection-probo-ai/useSaveDocumentsByFlow.ts
```
- ✅ `handleGetNodeIdByFlow()` - Obtener folderId por flujo
- ✅ `handleSaveToBackend()` - Enviar documentos al repositorio
- ✅ `getPathNameAndFolderNameByFlow()` - Mapeo de flujos a carpetas

```
../probo-2.5/src/api/connection-probo-ai/postFilesToNode.ts
```
- ✅ `postFilesToNode()` - API call para subir archivos

```
../probo-2.5/src/api/connection-probo-ai/getNodeBySociety.ts
```
- ✅ `getNodeBySociety()` - API call para obtener nodos de la sociedad

#### **2. Vista del Repositorio**

```
../probo-2.5/src/modules/probo-ai/pages/repository/Index.vue
```
- ✅ Vista principal del repositorio
- ✅ Selector de sociedad
- ✅ Navegación entre secciones

```
../probo-2.5/src/modules/probo-ai/pages/repository/proboDocuments/AutoFolderView.vue
```
- ✅ Vista de documentos generados (jerárquica)

```
../probo-2.5/src/modules/probo-ai/pages/repository/proboDocuments/HierarchicalNodeView.vue
```
- ✅ Vista jerárquica de nodos

#### **3. Repositorio V3 (Google Drive Clone)**

```
../probo-2.5/src/modules/probo-ai/pages/storage/Storage.vue
```
- ✅ Vista de almacenamiento (Google Drive style)
- ✅ Gestión de archivos y carpetas
- ✅ Upload, download, preview

```
../probo-2.5/src/modules/probo-ai/components/repository/common/files/FileCard.vue
```
- ✅ Componente de tarjeta de archivo

```
../probo-2.5/src/modules/probo-ai/components/repository/common/folder/FolderCard.vue
```
- ✅ Componente de tarjeta de carpeta

---

## 🔄 FLUJO COMPLETO: ENVÍO AL REPOSITORIO (V2.5)

### **1. Generación de Documentos**

```typescript
// En la vista de descarga de documentos
const listDocument = ref<PromiseSettledResult<IGeneratedDocument>[]>([]);

// Generar documentos
const result = await generateAporteDinerarioDocumentsV2({...});
listDocument.value = result.results;
```

### **2. Watch Automático (Envío al Repositorio)**

```typescript
// app/components/Views/PreviewDocuments/PreviewDocuments.vue
import { useSaveDocumentsByFlow } from "@/composables/connection-probo-ai/useSaveDocumentsByFlow";

const { handleGetNodeIdByFlow, handleSaveToBackend, getPathNameAndFolderNameByFlow } =
  useSaveDocumentsByFlow();

const nameFlowToDocument = "Documentos Aporte Dinerario";

// Watch automático cuando se generan documentos
watch(listDocument, async (newVal) => {
  if (newVal && newVal.length > 0) {
    try {
      // 2.1. Obtener pathName y folderName según el flujo
      const { pathName, folderName } = getPathNameAndFolderNameByFlow(
        typeMeetingStore.typeFlowId
      );
      
      // 2.2. Obtener folderId del repositorio
      const folderId = await handleGetNodeIdByFlow({
        societyId: society.value.id,
        folderPath: pathName,
        folderName: folderName,
      });
      
      // 2.3. Filtrar solo documentos exitosos
      const successfulDocuments = newVal.filter(
        (doc): doc is PromiseFulfilledResult<{ nameFile: string; blob: Blob }> =>
          doc.status === "fulfilled"
      );
      
      // 2.4. Obtener documentos adicionales del flujo (ej: Asientos contables)
      const documentsFromFlow = await getDocumentsFromFlowAD(
        appStore.societySelectData.id,
        societyStore.idFlowSelect
      );
      
      // 2.5. Combinar todos los documentos
      const allDocuments = [...successfulDocuments, ...documentsFromFlow];
      
      // 2.6. Enviar al repositorio
      await handleSaveToBackend({
        listDocument: allDocuments,
        folderId: folderId,
        nameFlowToDocument: nameFlowToDocument,
      });
    } catch (error) {
      console.error("Error enviando documentos al repositorio:", error);
    }
  }
});
```

### **3. Obtener FolderId por Flujo**

```typescript
// ../probo-2.5/src/composables/connection-probo-ai/useSaveDocumentsByFlow.ts

const handleGetNodeIdByFlow = async (baseData: IBaseDataToGetNode) => {
  try {
    // Obtener todos los nodos de la sociedad
    const folders = await getNodeBySociety(baseData.societyId);
    
    // Buscar el folder que coincida con path + name
    const folderId = folders.data.find(
      (folder) =>
        folder.path === baseData.folderPath && 
        folder.name === baseData.folderName
    )?.id || 0;
    
    return folderId;
  } catch (error) {
    console.error("Error al obtener los nodos:", error);
    return 0;
  }
};
```

**API Call**:
```typescript
// ../probo-2.5/src/api/connection-probo-ai/getNodeBySociety.ts

export const getNodeBySociety = async (societyId: number): Promise<ApiResponse<INode[]>> => {
  const response = await axios.get<ApiResponse<INode[]>>(
    `${API_PROBO}repository/society/${societyId}/nodes/core`
  );
  return response.data;
};
```

**Endpoint V2.5**:
```http
GET /repository/society/{societyId}/nodes/core
```

### **4. Enviar Documentos al Repositorio**

```typescript
// ../probo-2.5/src/composables/connection-probo-ai/useSaveDocumentsByFlow.ts

const handleSaveToBackend = async (baseData: IBaseDataToSaveDocument) => {
  try {
    // Convertir blobs a Files
    const files: File[] = baseData.listDocument.map((doc) => {
      const correctMimeType = getCorrectMimeType(
        doc.value.nameFile, 
        doc.value.blob.type
      );
      
      return new File([doc.value.blob], doc.value.nameFile, {
        type: correctMimeType,
      });
    });
    
    // Enviar al repositorio
    await postFilesToNode(
      files, 
      baseData.folderId.toString(), 
      baseData.nameFlowToDocument
    );
    
    toastMessage("success", "Documentos guardados correctamente en el repositorio.");
  } catch (error) {
    if (error instanceof AxiosError) {
      const keyWord = "Upload would exceed society storage limit";
      const backendMessage = error.response?.data?.message?.includes(keyWord)
        ? "Se superó el límite de almacenamiento permitido para la sociedad."
        : "Error al guardar los documentos en el repositorio.";
      
      toastMessage("error", backendMessage);
    }
  }
};
```

**API Call**:
```typescript
// ../probo-2.5/src/api/connection-probo-ai/postFilesToNode.ts

export const postFilesToNode = async (
  fileList: File[],
  nodeId: string,
  folderName?: string
) => {
  const url = `${API_PROBO}repository/society/nodes/${nodeId}/core`;
  const formData = new FormData();
  
  // Agregar cada archivo con su tamaño como key
  for (const file of fileList) {
    formData.append(file.size.toString(), file, file.name);
  }
  
  const response = await axios.post(url, formData, {
    params: {
      ...(folderName && { name: folderName }),
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};
```

**Endpoint V2.5**:
```http
POST /repository/society/nodes/{nodeId}/core?name={nombre}
Content-Type: multipart/form-data

Body: FormData
- Key: file.size.toString() (ej: "12345")
- Value: File
```

### **5. Mapeo de Flujos a Carpetas**

```typescript
// ../probo-2.5/src/composables/connection-probo-ai/useSaveDocumentsByFlow.ts

const getPathNameAndFolderNameByFlow = (flowId: FlowsByIdEnum) => {
  switch (flowId) {
    case FlowsByIdEnum.APORTE_DINERARIO:
      return {
        pathName: PathNameEnum.AUMENTO_CAPITAL,        // "/core/juntas/aumento capital/"
        folderName: FoldersNameEnum.APORTE_DINERARIO,   // "aporte dinerario"
      };
    case FlowsByIdEnum.CAPITALIZACION_DE_CREDITOS:
      return {
        pathName: PathNameEnum.AUMENTO_CAPITAL,
        folderName: FoldersNameEnum.CAPITALIZACION_DE_CREDITOS,
      };
    // ... más casos
  }
};
```

**⚠️ IMPORTANTE V3**: En V3, **NO** usamos esta estructura de carpetas por flujo. Todos los documentos van a:
```
/core/juntas/{flowId}/
```

---

## 🖼️ VISTA DEL REPOSITORIO (V2.5)

### **1. Vista Principal**

**Ubicación**: `../probo-2.5/src/modules/probo-ai/pages/repository/Index.vue`

**Características**:
- ✅ Selector de sociedad
- ✅ Navegación entre secciones:
  - Documentos Societarios
  - Documentos Generados
  - Carpetas Personalizadas
- ✅ Buscador global
- ✅ Vista de almacenamiento

### **2. Vista de Documentos Generados**

**Ubicación**: `../probo-2.5/src/modules/probo-ai/pages/repository/proboDocuments/AutoFolderView.vue`

**Características**:
- ✅ Vista jerárquica de documentos
- ✅ Navegación por carpetas
- ✅ Filtros por tipo de documento
- ✅ Preview de documentos

### **3. Selector de Sociedad**

```typescript
// En la vista del repositorio
const selectedSociedad = ref<Sociedad>(sociedades[0]);

// Al cambiar la sociedad, cargar documentos
watch(
  () => selectedSociedad.value?.id,
  async (sociedadId) => {
    if (sociedadId) {
      await cargarDocumentos(sociedadId);
    }
  }
);
```

### **4. Cargar Documentos por Sociedad**

```typescript
// Obtener documentos de la sociedad seleccionada
const cargarDocumentos = async (sociedadId: number) => {
  // GET /repository/society/{societyId}/nodes/core
  const folders = await getNodeBySociety(sociedadId);
  
  // Filtrar documentos según el path
  const documentos = folders.data.filter(
    (node) => node.path.startsWith("/core/juntas/")
  );
  
  return documentos;
};
```

---

## 📁 REPOSITORIO V3 (GOOGLE DRIVE CLONE)

### **1. Vista de Almacenamiento**

**Ubicación**: `../probo-2.5/src/modules/probo-ai/pages/storage/Storage.vue`

**Características**:
- ✅ Vista tipo Google Drive
- ✅ Grid/List view
- ✅ Drag & Drop para subir archivos
- ✅ Crear carpetas
- ✅ Preview de documentos
- ✅ Gestión de versiones
- ✅ Compartir carpetas

### **2. Componentes Principales**

#### **FileCard.vue**
```
../probo-2.5/src/modules/probo-ai/components/repository/common/files/FileCard.vue
```
- ✅ Tarjeta de archivo individual
- ✅ Preview thumbnail
- ✅ Acciones: descargar, eliminar, compartir

#### **FolderCard.vue**
```
../probo-2.5/src/modules/probo-ai/components/repository/common/folder/FolderCard.vue
```
- ✅ Tarjeta de carpeta
- ✅ Navegación al hacer click
- ✅ Acciones: renombrar, eliminar, compartir

#### **DocumentPreview.vue**
```
../probo-2.5/src/modules/probo-ai/components/repository/documentPreview/DocumentPreview.vue
```
- ✅ Preview completo de documentos
- ✅ Soporte para PDF, Word, Excel, imágenes
- ✅ Historial de versiones

### **3. Funcionalidades Clave**

#### **Upload de Archivos**
```typescript
// Drag & Drop o botón de upload
const handleUpload = async (files: File[]) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append(file.size.toString(), file, file.name);
  }
  
  await postFilesToNode(files, currentFolderId, "Nueva Carpeta");
};
```

#### **Navegación por Carpetas**
```typescript
// Navegar a una carpeta
const navigateToFolder = async (folderId: number) => {
  const documentos = await getNodeBySociety(societyId);
  const folder = documentos.data.find((node) => node.id === folderId);
  
  if (folder) {
    currentPath.value.push(folder.name);
    await cargarDocumentos(folder.id);
  }
};
```

#### **Breadcrumbs**
```typescript
// Breadcrumbs para navegación
const breadcrumbs = computed(() => {
  return currentPath.value.map((path, index) => ({
    label: path,
    onClick: () => navigateToPath(index),
  }));
});
```

---

## 🔄 DIFERENCIAS V2.5 → V3

### **1. Estructura de Carpetas**

**V2.5**:
```
/core/juntas/aumento capital/aporte dinerario/
/core/juntas/aumento capital/capitalizacion de creditos/
/core/juntas/designacion remocion/directores/
```

**V3**:
```
/core/juntas/{flowId}/
```
- ✅ Todos los documentos de una junta en una sola carpeta
- ✅ Nombre de carpeta: `"Documentos Juntas: {Fecha de la Junta}"`

### **2. Endpoints**

**V2.5**:
```http
GET /repository/society/{societyId}/nodes/core
POST /repository/society/nodes/{nodeId}/core?name={nombre}
```

**V3**:
```http
GET /api/v2/repository/society-profile/:structureId/juntas/:flowId/folder
POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/core?name={nombre}
```

### **3. IDs**

**V2.5**:
- `societyId` (number)

**V3**:
- `structureId` = `societyId` (mismo valor)
- `flowId` (string/number)

### **4. Envío Automático**

**V2.5**:
- ✅ Automático con `watch()` cuando se generan documentos

**V3**:
- ✅ Manual con checkbox "Enviar automáticamente al Repositorio Documental"
- ✅ Se activa cuando el usuario marca el checkbox

---

## 📋 PLAN DE IMPLEMENTACIÓN V3

### **Fase 1: Envío al Repositorio** (2-3 días)

1. ✅ Crear use case: `enviar-documentos-repositorio.use-case.ts`
2. ✅ Crear composable: `useEnviarDocumentosRepositorio.ts`
3. ✅ Habilitar checkbox en `JuntaDocumentosGenerados.vue`
4. ✅ Implementar lógica de envío con endpoints V2
5. ✅ Testing manual

### **Fase 2: Vista Repositorio** (2-3 días)

1. ✅ Mejorar selector de sociedad en `RepositoryDashboard.vue`
2. ✅ Implementar carga de documentos por sociedad
3. ✅ Filtrar documentos de juntas: `/core/juntas/{flowId}/`
4. ✅ Mostrar documentos en `DocumentosGeneradosView.vue`
5. ✅ Testing manual

### **Fase 3: Repositorio V3 (Google Drive)** (3-5 días)

1. ✅ Mejorar `AlmacenView.vue` con funcionalidades de Google Drive
2. ✅ Implementar drag & drop para upload
3. ✅ Implementar creación de carpetas
4. ✅ Implementar preview de documentos
5. ✅ Implementar gestión de versiones
6. ✅ Testing manual

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Envío al Repositorio**

- [ ] Crear `enviar-documentos-repositorio.use-case.ts`
- [ ] Crear `useEnviarDocumentosRepositorio.ts`
- [ ] Habilitar checkbox en `JuntaDocumentosGenerados.vue`
- [ ] Implementar `obtenerFolderIdJunta()` con endpoint V2
- [ ] Implementar `enviarDocumentosAlRepositorio()` con endpoint V2
- [ ] Manejar errores (límite de almacenamiento, etc.)
- [ ] Testing manual: generar documentos y enviar al repositorio

### **Vista Repositorio**

- [ ] Mejorar selector de sociedad en `RepositoryDashboard.vue`
- [ ] Implementar carga de documentos por sociedad
- [ ] Filtrar documentos de juntas: `/core/juntas/{flowId}/`
- [ ] Mostrar documentos en `DocumentosGeneradosView.vue`
- [ ] Implementar navegación por carpetas
- [ ] Testing manual: seleccionar sociedad y ver documentos

### **Repositorio V3 (Google Drive)**

- [ ] Mejorar `AlmacenView.vue` con grid/list view
- [ ] Implementar drag & drop para upload
- [ ] Implementar creación de carpetas
- [ ] Implementar preview de documentos
- [ ] Implementar gestión de versiones
- [ ] Implementar compartir carpetas
- [ ] Testing manual: todas las funcionalidades

---

## 📚 REFERENCIAS CONSTANTES

### **Archivos V2.5 a Revisar**

1. **Envío de Documentos**:
   - `../probo-2.5/src/composables/connection-probo-ai/useSaveDocumentsByFlow.ts`
   - `../probo-2.5/src/api/connection-probo-ai/postFilesToNode.ts`
   - `../probo-2.5/src/api/connection-probo-ai/getNodeBySociety.ts`

2. **Vista del Repositorio**:
   - `../probo-2.5/src/modules/probo-ai/pages/repository/Index.vue`
   - `../probo-2.5/src/modules/probo-ai/pages/repository/proboDocuments/AutoFolderView.vue`

3. **Repositorio V3 (Google Drive)**:
   - `../probo-2.5/src/modules/probo-ai/pages/storage/Storage.vue`
   - `../probo-2.5/src/modules/probo-ai/components/repository/common/files/FileCard.vue`
   - `../probo-2.5/src/modules/probo-ai/components/repository/common/folder/FolderCard.vue`

### **Documentación V3**

- `docs/juntas/ISSUE-REPOSITORIO-DOCUMENTOS-V3.md` - Issue principal
- `docs/juntas/GUIA-COMPLETA-REPOSITORIO-DOCUMENTOS-V3.md` - Guía completa
- `docs/general/FLUJO-CREACION-SOCIEDADES-Y-JUNTAS.md` - Flujo de creación
- `docs/backend/repositorio/GUIA-COMPLETA-ENDPOINTS-V2.md` - Endpoints V2

---

**Documentación completa, mi rey!** 🚀💪

**Recordatorio**: Revisar constantemente los archivos de V2.5 mencionados arriba para guiar la implementación.

