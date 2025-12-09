# 🔗 V2.5 → V2 Backend → V3: Conexión al Repositorio

**Fecha**: 2 de Diciembre 2025  
**Enfoque**: Documentar flujo completo de conexión al repositorio desde V2.5 hasta V3  
**Estado**: ✅ Documentación completa | ⏳ Implementación V2/V3 pendiente

---

## 📋 ÍNDICE

1. [Flujo Completo V2.5 (Actual)](#flujo-v25)
2. [Código Vue.js 3 - V2.5](#codigo-v25)
3. [Adaptación a Backend V2](#adaptacion-v2)
4. [Implementación V3 (Nuxt 4 + Hexagonal)](#implementacion-v3)
5. [Reglas de Negocio: Dónde se Envían los Documentos](#reglas-negocio)
6. [Documentos Societarios (Google Drive Simple)](#documentos-societarios)

---

## 1️⃣ <a id="flujo-v25"></a>FLUJO COMPLETO V2.5 (ACTUAL)

### Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│  VISTA DE JUNTAS - PASO FINALIZAR                          │
│  (PreviewDocuments.vue / FinalizarACAD.vue)                │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  onMounted()                                                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. loadAll() - Cargar stores V2                      │  │
│  │ 2. handleListDocument() - Generar documentos          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  handleListDocument()                                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ generateAporteDinerarioDocumentsV2({                   │  │
│  │   storeFlowMeeting,                                    │  │
│  │   storeTable,                                          │  │
│  │   storeAportes,                                        │  │
│  │   // ... más stores                                    │  │
│  │ })                                                     │  │
│  │ → Retorna: { results, ui }                            │  │
│  │   - results: PromiseSettledResult<IGeneratedDocument>[]│  │
│  │   - ui: GeneratedDocUIItem[] (para mostrar en UI)     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  watch(listDocument) - AUTOMÁTICO ⚡                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Se activa cuando listDocument cambia                  │  │
│  │                                                       │  │
│  │ 1. Obtener pathName y folderName por flowId          │  │
│  │ 2. Obtener folderId del repositorio                   │  │
│  │ 3. Combinar documentos generados + del flujo         │  │
│  │ 4. Enviar al repositorio                              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  handleGetNodeIdByFlow()                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ GET /repository/society/{societyId}/nodes/core        │  │
│  │ → Busca folder por path + name                        │  │
│  │ → Retorna folderId (nodeId)                           │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  handleSaveToBackend()                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 1. Convertir blobs a Files                           │  │
│  │ 2. POST /repository/society/nodes/{nodeId}/core      │  │
│  │ 3. Mostrar toast de éxito                            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  BOTÓN DE DESCARGA ZIP                                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Usuario presiona "Descargar los documentos"          │  │
│  │ → handleDownload()                                    │  │
│  │ → convertToZip() - Genera ZIP y descarga              │  │
│  │ → launchCustomConfetti() - Celebración 🎉             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Características Clave V2.5

✅ **Envío Automático**: El `watch()` envía documentos automáticamente al repositorio  
✅ **Descarga Manual**: El usuario puede descargar ZIP cuando quiera  
✅ **Combinación de Documentos**: Generados + del flujo (ej: Asientos contables)  
✅ **Mapeo por Flujo**: Cada flujo tiene su carpeta específica

---

## 2️⃣ <a id="codigo-v25"></a>CÓDIGO VUE.JS 3 - V2.5

### Composable Principal

**Ubicación**: `src/wizards/shareholders-meeting/capital-increase/monetary-contribution/composables/useMonetaryContributionFinalizer.ts`

```typescript
import { computed, onMounted, ref, watch } from "vue";
import { useSaveDocumentsByFlow } from "@/composables/connection-probo-ai/useSaveDocumentsByFlow";
import { generateAporteDinerarioDocumentsV2 } from "@/composables/documents/monetary-contributions/useAporteDinerarioPrintV2";
import { convertToZip } from "@/utils/handleGenerateZipDocuments";
import { getDocumentsFromFlowAD } from "@/composables/connection-probo-ai/documents-from-flow/getDocumentsFromFlowAD";

export function useMonetaryContributionFinalizer() {
  const appStore = useAppStore();
  const societyStore = useStoreSocietyFlow();
  const typeMeetingStore = useTypeMeetingStore();
  
  const society = computed(() => appStore.societySelectData);
  
  // Estado de documentos
  const listDocument = ref<PromiseSettledResult<{ nameFile: string; blob: Blob }>[]>();
  const listDocumentUI = ref<GeneratedDocUIItem[]>([]);
  const disabledButton = ref(true);
  
  // Composable para guardar en repositorio
  const { 
    handleGetNodeIdByFlow, 
    handleSaveToBackend, 
    getPathNameAndFolderNameByFlow 
  } = useSaveDocumentsByFlow();
  
  // 1. GENERAR DOCUMENTOS
  const handleListDocument = async () => {
    try {
      const result = await generateAporteDinerarioDocumentsV2({
        storeFlowMeeting,
        storeTable,
        storeAportes,
        storeVotacionTable,
        tempMeeting1: tempMeeting1.value,
        tempMeeting2: tempMeeting2.value,
      });
      
      listDocument.value = result.results;
      listDocumentUI.value = result.ui;
      
      // Habilitar botón solo si hay documentos exitosos
      const successfulDocs = result.results.filter(
        (doc) => doc.status === "fulfilled"
      );
      disabledButton.value = successfulDocs.length === 0;
      
      return result;
    } catch (error) {
      console.error("❌ Error generando documentos:", error);
      throw error;
    }
  };
  
  // 2. WATCH AUTOMÁTICO - ENVÍO AL REPOSITORIO ⚡
  const nameFlowToDocument = "Documentos Aporte Dinerario";
  
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
  
  // 3. DESCARGA ZIP (MANUAL)
  const handleDownload = async () => {
    if (!listDocument.value || listDocument.value.length === 0) {
      console.warn("⚠️ No hay documentos para descargar");
      return;
    }
    
    try {
      const successfulDocs = listDocument.value.filter(
        (doc): doc is PromiseFulfilledResult<{ nameFile: string; blob: Blob }> =>
          doc.status === "fulfilled"
      );
      
      // Generar y descargar ZIP
      await convertToZip(successfulDocs, "Documentos_Aumento_Capital_Aporte_Dinerario");
      
      // Celebración 🎉
      if (canvasElement.value) {
        launchCustomConfetti(canvasElement.value);
      }
    } catch (error) {
      console.error("❌ Error en descarga:", error);
    }
  };
  
  // 4. LIFECYCLE
  onMounted(async () => {
    try {
      await loadAll(); // Cargar stores V2
      await handleListDocument(); // Generar documentos
    } catch (error) {
      toastMessage("error", "Error al cargar los documentos");
    }
  });
  
  return {
    listDocumentUI,
    disabledButton,
    handleDownload,
    isLoadingFinalizer,
  };
}
```

---

### Composable de Repositorio

**Ubicación**: `src/composables/connection-probo-ai/useSaveDocumentsByFlow.ts`

```typescript
import { getNodeBySociety } from "@/api/connection-probo-ai/getNodeBySociety";
import { postFilesToNode } from "@/api/connection-probo-ai/postFilesToNode";

export const useSaveDocumentsByFlow = () => {
  // 1. OBTENER FOLDER ID POR FLUJO
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
  
  // 2. ENVIAR DOCUMENTOS AL REPOSITORIO
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
  
  // 3. MAPEO DE FLUJOS A CARPETAS
  const getPathNameAndFolderNameByFlow = (flowId: FlowsByIdEnum) => {
    switch (flowId) {
      case FlowsByIdEnum.APORTE_DINERARIO:
        return {
          pathName: PathNameEnum.AUMENTO_CAPITAL,        // "/core/juntas/aumento capital/"
          folderName: FoldersNameEnum.APORTE_DINERARIO,  // "aporte dinerario"
        };
      case FlowsByIdEnum.CAPITALIZACION_DE_CREDITOS:
        return {
          pathName: PathNameEnum.AUMENTO_CAPITAL,
          folderName: FoldersNameEnum.CAPITALIZACION_DE_CREDITOS,
        };
      // ... más casos
    }
  };
  
  return {
    handleGetNodeIdByFlow,
    handleSaveToBackend,
    getPathNameAndFolderNameByFlow,
  };
};
```

---

### API Calls

**Ubicación**: `src/api/connection-probo-ai/getNodeBySociety.ts`

```typescript
export const getNodeBySociety = async (societyId: number): Promise<ApiResponse<INode[]>> => {
  const response = await axios.get<ApiResponse<INode[]>>(
    `${API_PROBO}repository/society/${societyId}/nodes/core`
  );
  return response.data;
};
```

**Ubicación**: `src/api/connection-probo-ai/postFilesToNode.ts`

```typescript
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

---

### Utilidad de ZIP

**Ubicación**: `src/utils/handleGenerateZipDocuments.ts`

```typescript
import JSZip from "jszip";

export const convertToZip = async (
  results: PromiseSettledResult<IGeneratedDocument>[],
  nameZip: string
): Promise<void> => {
  const zip = new JSZip();
  
  // Agregar los blobs exitosos al ZIP
  results.forEach((result) => {
    if (result.status === "fulfilled" && result.value) {
      const { nameFile, blob } = result.value;
      zip.file(nameFile, blob);
    }
  });
  
  // Generar y descargar el ZIP
  try {
    const finalZipBlob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(finalZipBlob);
    link.download = `${nameZip}.zip`;
    link.click();
  } catch (error) {
    console.error("Error generando el archivo ZIP:", error);
  }
};
```

---

## 3️⃣ <a id="adaptacion-v2"></a>ADAPTACIÓN A BACKEND V2

### Cambios Principales

| V2.5 (V1 Backend) | V2 Backend |
|-------------------|------------|
| `societyId` (number) | `structureId` (UUID) |
| `GET /repository/society/{societyId}/nodes/core` | `GET /api/v2/repository/society-profile/{structureId}/nodes/core` |
| `POST /repository/society/nodes/{nodeId}/core` | `POST /api/v2/repository/society-profile/{structureId}/nodes/{parentNodeId}/core` |
| Buscar folder manualmente | `GET /api/v2/repository/society-profile/{structureId}/juntas/{flowId}/folder-id` |

---

### Nuevo Composable V2

```typescript
// src/composables/connection-probo-ai/useSaveDocumentsByFlowV2.ts
import { useAppStore } from "@/store/app-store/app-store.store";

export const useSaveDocumentsByFlowV2 = () => {
  const appStore = useAppStore();
  
  // 1. OBTENER FOLDER ID POR FLUJO (V2)
  const handleGetNodeIdByFlowV2 = async (
    structureId: string,
    flowId: number
  ): Promise<number> => {
    try {
      // ✅ NUEVO: Endpoint específico para juntas
      const response = await axios.get(
        `/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder-id`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      
      return response.data.data.folderId;
    } catch (error) {
      console.error("Error al obtener folderId:", error);
      throw error;
    }
  };
  
  // 2. ENVIAR DOCUMENTOS AL REPOSITORIO (V2)
  const handleSaveToBackendV2 = async (
    structureId: string,
    parentNodeId: number,
    files: File[],
    folderName?: string
  ): Promise<void> => {
    try {
      const formData = new FormData();
      
      // Agregar archivos
      for (const file of files) {
        formData.append(file.size.toString(), file, file.name);
      }
      
      // ✅ NUEVO: Endpoint V2
      const response = await axios.post(
        `/api/v2/repository/society-profile/${structureId}/nodes/${parentNodeId}/core`,
        formData,
        {
          params: {
            ...(folderName && { name: folderName }),
          },
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
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
  
  return {
    handleGetNodeIdByFlowV2,
    handleSaveToBackendV2,
  };
};
```

---

### Composable Finalizer V2

```typescript
// src/wizards/shareholders-meeting/.../useMonetaryContributionFinalizerV2.ts
export function useMonetaryContributionFinalizerV2() {
  const appStore = useAppStore();
  const societyStore = useStoreSocietyFlow();
  
  // ✅ NUEVO: Obtener structureId (UUID) en lugar de societyId
  const structureId = computed(() => appStore.societySelectData.structureId);
  const flowId = computed(() => societyStore.idFlowSelect);
  
  const { handleGetNodeIdByFlowV2, handleSaveToBackendV2 } = useSaveDocumentsByFlowV2();
  
  // Watch automático (igual que V2.5)
  watch(listDocument, async (newVal) => {
    if (newVal && newVal.length > 0) {
      try {
        // ✅ NUEVO: Usar endpoint específico de juntas
        const folderId = await handleGetNodeIdByFlowV2(
          structureId.value,
          flowId.value
        );
        
        const successfulDocuments = newVal.filter(
          (doc): doc is PromiseFulfilledResult<{ nameFile: string; blob: Blob }> =>
            doc.status === "fulfilled"
        );
        
        // Convertir blobs a Files
        const files: File[] = successfulDocuments.map((doc) => {
          return new File([doc.value.blob], doc.value.nameFile, {
            type: getCorrectMimeType(doc.value.nameFile, doc.value.blob.type),
          });
        });
        
        // ✅ NUEVO: Enviar con structureId
        await handleSaveToBackendV2(
          structureId.value,
          folderId,
          files,
          "Documentos Aporte Dinerario"
        );
      } catch (error) {
        console.error("Error enviando documentos al repositorio:", error);
      }
    }
  });
  
  // Descarga ZIP (igual que V2.5)
  const handleDownload = async () => {
    // ... mismo código
  };
  
  return {
    listDocumentUI,
    disabledButton,
    handleDownload,
  };
}
```

---

## 4️⃣ <a id="implementacion-v3"></a>IMPLEMENTACIÓN V3 (NUXT 4 + HEXAGONAL)

### Estructura de Archivos

```
app/core/hexag/repositorio/
├── domain/
│   ├── entities/
│   │   ├── documento.entity.ts
│   │   └── nodo-repositorio.entity.ts
│   └── ports/
│       └── repositorio.repository.ts
├── application/
│   ├── dtos/
│   │   ├── upload-documentos.dto.ts
│   │   └── documento-response.dto.ts
│   └── use-cases/
│       ├── upload-documentos-junta.use-case.ts
│       └── download-documentos-junta.use-case.ts
└── infrastructure/
    ├── repositories/
    │   └── repositorio.http.repository.ts
    └── mappers/
        └── documento.mapper.ts
```

---

### Domain Entity

```typescript
// app/core/hexag/repositorio/domain/entities/documento.entity.ts
export class DocumentoEntity {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly blob: Blob,
    public readonly mimeType: string,
    public readonly tamaño: number,
    public readonly folderId: number,
    public readonly flowId: number,
    public readonly tipoDocumento?: TipoDocumento
  ) {}
  
  toFile(): File {
    return new File([this.blob], this.nombre, {
      type: this.mimeType,
    });
  }
}
```

---

### Repository Port

```typescript
// app/core/hexag/repositorio/domain/ports/repositorio.repository.ts
export interface RepositorioRepository {
  obtenerFolderIdJunta(
    structureId: string,
    flowId: number
  ): Promise<number>;
  
  subirDocumentos(
    structureId: string,
    folderId: number,
    documentos: DocumentoEntity[],
    folderName?: string
  ): Promise<void>;
  
  descargarDocumentos(
    structureId: string,
    flowId: number
  ): Promise<DocumentoEntity[]>;
}
```

---

### Use Case: Subir Documentos

```typescript
// app/core/hexag/repositorio/application/use-cases/upload-documentos-junta.use-case.ts
export class UploadDocumentosJuntaUseCase {
  constructor(
    private readonly repositorioRepository: RepositorioRepository
  ) {}
  
  async execute(
    structureId: string,
    flowId: number,
    documentos: DocumentoEntity[],
    folderName?: string
  ): Promise<void> {
    // 1. Obtener folderId
    const folderId = await this.repositorioRepository.obtenerFolderIdJunta(
      structureId,
      flowId
    );
    
    // 2. Subir documentos
    await this.repositorioRepository.subirDocumentos(
      structureId,
      folderId,
      documentos,
      folderName
    );
  }
}
```

---

### HTTP Repository

```typescript
// app/core/hexag/repositorio/infrastructure/repositories/repositorio.http.repository.ts
export class RepositorioHttpRepository implements RepositorioRepository {
  constructor(private readonly httpClient: HttpClient) {}
  
  async obtenerFolderIdJunta(
    structureId: string,
    flowId: number
  ): Promise<number> {
    const response = await this.httpClient.get<{ data: { folderId: number } }>(
      `/api/v2/repository/society-profile/${structureId}/juntas/${flowId}/folder-id`
    );
    
    return response.data.folderId;
  }
  
  async subirDocumentos(
    structureId: string,
    folderId: number,
    documentos: DocumentoEntity[],
    folderName?: string
  ): Promise<void> {
    const formData = new FormData();
    
    // Convertir entidades a Files
    documentos.forEach((doc) => {
      const file = doc.toFile();
      formData.append(file.size.toString(), file, file.name);
    });
    
    await this.httpClient.post(
      `/api/v2/repository/society-profile/${structureId}/nodes/${folderId}/core`,
      formData,
      {
        params: folderName ? { name: folderName } : {},
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }
}
```

---

### Composable V3 (Nuxt 4)

```typescript
// app/composables/juntas/useRepositorioJunta.ts
export const useRepositorioJunta = () => {
  const route = useRoute();
  const structureId = computed(() => route.params.societyId as string);
  const flowId = computed(() => route.params.flowId as string);
  
  // Inyectar dependencias
  const repositorioRepository = new RepositorioHttpRepository(useHttpClient());
  const uploadUseCase = new UploadDocumentosJuntaUseCase(repositorioRepository);
  
  // Estado
  const documentos = ref<DocumentoEntity[]>([]);
  const isUploading = ref(false);
  
  // Subir documentos al repositorio
  const subirDocumentos = async (
    documentosGenerados: DocumentoEntity[],
    folderName?: string
  ) => {
    try {
      isUploading.value = true;
      
      await uploadUseCase.execute(
        structureId.value,
        parseInt(flowId.value),
        documentosGenerados,
        folderName
      );
      
      toast.success("Documentos guardados correctamente en el repositorio.");
    } catch (error) {
      toast.error("Error al guardar los documentos en el repositorio.");
      throw error;
    } finally {
      isUploading.value = false;
    }
  };
  
  // Descargar ZIP (igual que V2.5)
  const descargarZIP = async (documentos: DocumentoEntity[], nombreZIP: string) => {
    const zip = new JSZip();
    
    documentos.forEach((doc) => {
      zip.file(doc.nombre, doc.blob);
    });
    
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${nombreZIP}.zip`;
    link.click();
  };
  
  return {
    documentos,
    isUploading,
    subirDocumentos,
    descargarZIP,
  };
};
```

---

### Vista V3 (Nuxt 4)

```vue
<!-- app/pages/operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/descargar.vue -->
<script setup lang="ts">
const route = useRoute();
const structureId = computed(() => route.params.societyId as string);
const flowId = computed(() => route.params.flowId as string);

// Composable de repositorio
const { subirDocumentos, descargarZIP, isUploading } = useRepositorioJunta();

// Composable de generación de documentos
const { documentos, generarDocumentos } = useGenerarDocumentosJunta();

// Estado
const listDocumentUI = ref<GeneratedDocUIItem[]>([]);
const disabledButton = ref(true);

// Generar documentos al montar
onMounted(async () => {
  try {
    await generarDocumentos(structureId.value, parseInt(flowId.value));
    
    // Convertir a UI
    listDocumentUI.value = documentos.value.map((doc) => ({
      name: doc.nombre,
      size: formatFileSize(doc.tamaño),
    }));
    
    disabledButton.value = documentos.value.length === 0;
  } catch (error) {
    toast.error("Error al generar documentos");
  }
});

// Watch automático - Enviar al repositorio
watch(documentos, async (newDocs) => {
  if (newDocs.length > 0) {
    try {
      await subirDocumentos(newDocs, "Documentos Aporte Dinerario");
    } catch (error) {
      console.error("Error enviando al repositorio:", error);
    }
  }
});

// Descargar ZIP
const handleDownload = async () => {
  if (documentos.value.length === 0) return;
  
  try {
    await descargarZIP(documentos.value, "Documentos_Aumento_Capital_Aporte_Dinerario");
    launchCustomConfetti();
  } catch (error) {
    toast.error("Error al descargar documentos");
  }
};
</script>

<template>
  <div class="flex flex-col items-center gap-11">
    <!-- Lista de documentos -->
    <div v-if="listDocumentUI.length > 0" class="grid grid-cols-2 gap-5">
      <DocumentCard 
        v-for="doc in listDocumentUI" 
        :key="doc.name" 
        :document="doc" 
      />
    </div>
    
    <!-- Botón descarga -->
    <Button
      :disabled="disabledButton || isUploading"
      @click="handleDownload"
    >
      <DownloadIcon />
      <span>Descargar los documentos</span>
    </Button>
  </div>
</template>
```

---

## 5️⃣ <a id="reglas-negocio"></a>REGLAS DE NEGOCIO: DÓNDE SE ENVÍAN LOS DOCUMENTOS

### Mapeo de Flujos a Carpetas

| Flujo | Path | Folder Name | Endpoint V2 |
|-------|------|-------------|-------------|
| **Aporte Dinerario** | `/core/juntas/aumento capital/` | `aporte dinerario` | `GET /api/v2/.../juntas/{flowId}/folder-id` |
| **Capitalización Créditos** | `/core/juntas/aumento capital/` | `capitalización de créditos` | `GET /api/v2/.../juntas/{flowId}/folder-id` |
| **Nombramiento Directores** | `/core/juntas/designación y/o remoción/` | `directores` | `GET /api/v2/.../juntas/{flowId}/folder-id` |
| **Nombramiento Gerente** | `/core/juntas/designación y/o remoción/` | `gerentes y/o apoderados` | `GET /api/v2/.../juntas/{flowId}/folder-id` |
| **Estados Financieros** | `/core/juntas/estados financieros y reparto de dividendos/` | `estados financieros y reparto de dividendos` | `GET /api/v2/.../juntas/{flowId}/folder-id` |

### Registros de Sociedades

| Módulo | Path | Folder Name |
|--------|------|-------------|
| **Acciones** | `/core/sociedades/registro sociedades/capital social y acciones/` | `capital social y acciones` |
| **Facultades** | `/core/sociedades/registro sociedades/régimen de facultades/` | `régimen de facultades` |
| **Acuerdos Societarios** | `/core/sociedades/registro sociedades/estatutos/` | `estatutos` |

---

## 6️⃣ <a id="documentos-societarios"></a>DOCUMENTOS SOCIETARIOS (GOOGLE DRIVE SIMPLE)

### Funcionalidad Actual

✅ **Subir archivos** a carpetas del sistema  
✅ **Listar archivos** de una carpeta  
✅ **Descargar archivos** individuales  
✅ **Eliminar archivos**  
✅ **Navegar** por carpetas

### Endpoints V2 Disponibles

```typescript
// 1. Obtener nodos core
GET /api/v2/repository/society-profile/:structureId/nodes/core

// 2. Subir documento
POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/documents

// 3. Subir múltiples documentos
POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/core

// 4. Obtener nodo por ID
GET /api/v2/repository/nodes/:nodeId

// 5. Crear carpeta
POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/folder

// 6. Eliminar nodo
DELETE /api/v2/repository/nodes/:nodeId

// 7. Descargar carpeta como ZIP
GET /api/v2/repository/nodes/:nodeId/download-zip
```

### Composable para Documentos Societarios

```typescript
// app/composables/repositorio/useDocumentosSocietarios.ts
export const useDocumentosSocietarios = () => {
  const route = useRoute();
  const structureId = computed(() => route.params.societyId as string);
  
  // Estado
  const archivos = ref<Archivo[]>([]);
  const carpetaActual = ref<Carpeta | null>(null);
  const isLoading = ref(false);
  
  // 1. Obtener archivos de una carpeta
  const obtenerArchivos = async (folderId: number) => {
    try {
      isLoading.value = true;
      
      const response = await httpClient.get(
        `/api/v2/repository/nodes/${folderId}`
      );
      
      carpetaActual.value = response.data.data;
      archivos.value = response.data.data.children || [];
    } catch (error) {
      toast.error("Error al obtener archivos");
    } finally {
      isLoading.value = false;
    }
  };
  
  // 2. Subir archivo
  const subirArchivo = async (file: File, folderId: number) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      await httpClient.post(
        `/api/v2/repository/society-profile/${structureId.value}/nodes/${folderId}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      toast.success("Archivo subido correctamente");
      await obtenerArchivos(folderId); // Refrescar lista
    } catch (error) {
      toast.error("Error al subir archivo");
    }
  };
  
  // 3. Descargar archivo
  const descargarArchivo = async (nodeId: number, nombre: string) => {
    try {
      const response = await httpClient.get(
        `/api/v2/repository/nodes/${nodeId}/download`,
        {
          responseType: "blob",
        }
      );
      
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = nombre;
      link.click();
    } catch (error) {
      toast.error("Error al descargar archivo");
    }
  };
  
  // 4. Eliminar archivo
  const eliminarArchivo = async (nodeId: number) => {
    try {
      await httpClient.delete(`/api/v2/repository/nodes/${nodeId}`);
      
      toast.success("Archivo eliminado correctamente");
      if (carpetaActual.value) {
        await obtenerArchivos(carpetaActual.value.id); // Refrescar lista
      }
    } catch (error) {
      toast.error("Error al eliminar archivo");
    }
  };
  
  return {
    archivos,
    carpetaActual,
    isLoading,
    obtenerArchivos,
    subirArchivo,
    descargarArchivo,
    eliminarArchivo,
  };
};
```

---

## ✅ RESUMEN

### V2.5 (Actual)
- ✅ Envío automático con `watch()`
- ✅ Descarga manual ZIP
- ✅ Endpoints V1: `/repository/society/...`
- ✅ Mapeo manual de folders

### V2 Backend (Nuevo)
- ✅ Endpoints V2: `/api/v2/repository/...`
- ✅ Endpoint específico: `GET /.../juntas/{flowId}/folder-id`
- ✅ Usa `structureId` (UUID) en lugar de `societyId`
- ✅ Mismo flujo, solo cambian endpoints

### V3 (Futuro)
- ✅ Arquitectura hexagonal
- ✅ Use Cases para lógica de negocio
- ✅ Repositorios desacoplados
- ✅ Nuxt 4 composables

---

**¡Listo para implementar, mi rey!** 🚀💪

