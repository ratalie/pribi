# 📄 V2.5: Reglas de Negocio de Documentos y Repositorio

**Fecha**: 2 de Diciembre 2025  
**Enfoque**: Reglas de negocio de generación de documentos por flujo + Envío al repositorio  
**Estado**: Documentación completa ✅ | Recomendaciones para Backend V3 ⏳

---

## 📋 ÍNDICE

1. [Reglas de Negocio: Documentos por Flujo](#reglas-negocio)
2. [Envío de Documentos al Repositorio](#envio-repositorio)
3. [Endpoints del Repositorio](#endpoints)
4. [Envío desde Registros](#envio-registros)
5. [Recomendaciones para Backend V3](#recomendaciones-backend)

---

## 1️⃣ <a id="reglas-negocio"></a>REGLAS DE NEGOCIO: DOCUMENTOS POR FLUJO

### 📊 Tabla Resumen

| Flujo | Documentos Generados | Condiciones |
|-------|---------------------|-------------|
| **Aporte Dinerario** | 10 documentos | Ver tabla detallada abajo |
| **Capitalización de Créditos** | 9 documentos | Similar a Aporte Dinerario |
| **Nombramiento Directores** | 7 documentos | Incluye Aceptación de Cargo |
| **Nombramiento Gerente** | 7 documentos | Incluye Renuncia |
| **Estados Financieros** | 3 documentos | Solo si es Junta General |

---

### 🔵 **1. APORTE DINERARIO** (FlowsByIdEnum.APORTE_DINERARIO)

**Ubicación**: `src/composables/useDownloadDocuments/useDownloadDocAporteDinerario.ts`

**Documentos generados**:

| # | Nombre | Archivo | Condición |
|---|--------|---------|-----------|
| 1 | Convocatoria | `3-A-1-CONVOCATORIA.docx` | Solo si `tipoJunta === JUNTA_GENERAL` |
| 2 | Proxy Persona Natural | `3-A-2-PROXY.docx` | Si hay representantes tipo NATURAL |
| 3 | Proxy Persona Jurídica | `3-A-3-PROXY.docx` | Si hay representantes tipo JURIDICA |
| 4 | **Acta** | `3-A-4-ACTA.docx` | Si `!faltaQuorum` |
| 4b | Falta de Quórum | `3-A-12-FALTA DE QUORUM.docx` | Si `faltaQuorum === true` |
| 5 | Certificación | `3-A-5-CERTIFICACION.docx` | Siempre |
| 6 | Minuta | `3-A-6-MINUTA.docx` | Siempre |
| 7 | Aviso | `3-A-7-AVISO.docx` | Solo si `tipoJunta === JUNTA_GENERAL` |
| 8 | Carta de Aviso | `3-A-8-CARTA DE AVISO.docx` | Solo si `tipoJunta === JUNTA_GENERAL` |
| 9 | Asiento | `3-A-9-ASIENTO.docx` | Siempre |
| 10 | Certificado | `3-A-11-CERTIFICADO.docx` | Siempre (aportantes y no-aportantes) |

**Código de generación**:
```typescript
// useDownloadDocAporteDinerario.ts
const objectToGenerate = async () => {
  // 1. Convocatoria (solo Junta General)
  if (storeRoleMeeting.meetingType === MeetingType.JUNTA_GENERAL) {
    handleDownloadConvocatoria(...);
  }
  
  // 2. Poderes de Representación
  handleDownloadRepresentationPowers(...);
  
  // 3. Acta o Falta de Quórum
  handlerDownloadActaOrQuorum(...);
  
  // 4. Certificación
  handlerDownloadCertification(...);
  
  // 5. Minuta
  handlerDownloadMinuta(...);
  
  // 6. Carta de Aviso (solo Junta General)
  if (storeFlowMeeting.workingMeetingId === 1) {
    handleDownloadCartaAviso(...);
  }
  
  // 7. Asiento
  handleDownloadAsiento(...);
  
  // 8. Certificado
  handleDownloadCertificado(...);
};
```

---

### 🟢 **2. CAPITALIZACIÓN DE CRÉDITOS** (FlowsByIdEnum.CAPITALIZACION_DE_CREDITOS)

**Ubicación**: `src/composables/useDownloadDocuments/useDownloadDocCapitalizacionC.ts`

**Documentos generados**:

| # | Nombre | Archivo | Condición |
|---|--------|---------|-----------|
| 1 | Convocatoria | `3-C-1-CONVOCATORIA.docx` | Solo si `tipoJunta === JUNTA_GENERAL` |
| 2 | Proxy Persona Natural | `3-C-2-PROXY.docx` | Si hay representantes tipo NATURAL |
| 3 | Proxy Persona Jurídica | `3-C-3-PROXY.docx` | Si hay representantes tipo JURIDICA |
| 4 | **Acta** | `3-C-4-ACTA.docx` | Si `!faltaQuorum` |
| 4b | Falta de Quórum | `3-C-13-FALTA DE QUORUM.docx` | Si `faltaQuorum === true` |
| 5 | Certificación | `3-C-5-CERTIFICACION.docx` | Siempre |
| 6 | Minuta | `3-C-6-MINUTA.docx` | Siempre |
| 7 | Asiento | `3-C-9-ASIENTO.docx` | Siempre |
| 8 | Certificado | `3-C-11-CERTIFICADO.docx` | Siempre |
| 9 | Informe de Créditos | `3-C-12-INFORME DE CREDITOS.docx` | Siempre |

**Diferencia con Aporte Dinerario**:
- ❌ No genera "Aviso" ni "Carta de Aviso"
- ✅ Genera "Informe de Créditos" (nuevo)

---

### 🟡 **3. NOMBRAMIENTO DIRECTORES** (FlowsByIdEnum.DESIGNACION_REMOCION_DIRECTOR)

**Ubicación**: `src/composables/useDownloadDocuments/useDownloadDocDesigDirector.ts`

**Documentos generados**:

| # | Nombre | Archivo | Condición |
|---|--------|---------|-----------|
| 1 | Convocatoria | `6-A-1-CONVOCATORIA.docx` | Solo si `tipoJunta === JUNTA_GENERAL` |
| 2 | Proxy Persona Natural | `6-A-2-PROXY.docx` | Si hay representantes tipo NATURAL |
| 3 | Proxy Persona Jurídica | `6-A-3-PROXY.docx` | Si hay representantes tipo JURIDICA |
| 4 | **Acta** | `6-A-4-ACTA.docx` | Si `!faltaQuorum` |
| 4b | Falta de Quórum | `6-A-8-FALTA DE QUORUM.docx` | Si `faltaQuorum === true` |
| 5 | Certificación | `6-A-5-CERTIFICACION.docx` | Siempre |
| 5b | Certificación 2 | `6-A-5-CERTIFICACION 2.docx` | Si `!faltaQuorum && listaDirectoresDesignados.length > 0` |
| 6 | Solicitud de Copias | `6-A-6-SOLICITUD DE COPIAS.docx` | Siempre |
| 7 | **Aceptación de Cargo** | `6-A-7-ACEPTACION.docx` | Si `!faltaQuorum && listaDirectoresDesignados.length > 0` |

**Código de generación**:
```typescript
const excuteAllDownloadDocuments = () => {
  if (dataFlowDirector.dataMeetingType === MeetingType.JUNTA_GENERAL) {
    handleDownloadConvocatoria();
  }
  handleDownloadRepresentationPowers();
  handlerDownloadActaOrQuorum();
  handleDownloadCertificacion();
  
  // Certificación 2 solo si hay directores designados
  if (!dataFlowDirector.faltaQuorum && dataFlowDirector.listaDirectoresDesignados.length > 0) {
    handlePrintDownloadCertificacion2();
  }
  
  handleDownloadSolicitudCopias();
  handleDownloadAceptacion(); // ← NUEVO: Aceptación de Cargo
};
```

---

### 🟠 **4. NOMBRAMIENTO GERENTE** (FlowsByIdEnum.DESIGNACION_REMOCION_GERENTE_APODERADOS)

**Ubicación**: `src/composables/useDownloadDocuments/useDownloadDocuments.ts`

**Documentos generados**:

| # | Nombre | Archivo | Condición |
|---|--------|---------|-----------|
| 0 | **Renuncia** | `7-A-0-RENUNCIA.docx` | Si hay gerentes removidos |
| 1 | Convocatoria | `7-A-1-CONVOCATORIA.docx` | Solo si `tipoJunta === JUNTA_GENERAL` |
| 2 | Proxy Persona Natural | `7-A-2-PROXY.docx` | Si hay representantes tipo NATURAL |
| 3 | Proxy Persona Jurídica | `7-A-3-PROXY.docx` | Si hay representantes tipo JURIDICA |
| 4 | **Acta** | `7-A-4-ACTA.docx` | Si `!faltaQuorum` |
| 4b | Falta de Quórum | `7-A-8-FALTA DE QUORUM.docx` | Si `faltaQuorum === true` |
| 5 | Certificación | `7-A-5-CERTIFICACION.docx` | Siempre |
| 6 | Solicitud de Copias | `7-A-6-SOLICITUD DE COPIAS.docx` | Siempre |

**Código de generación**:
```typescript
const excuteAllDownloadDocuments = () => {
  // 0. Renuncia (si hay removidos)
  handlerDownloadRenuncia(listRemovedManagersAttorneys);
  
  if (dataMeetingType === MeetingType.JUNTA_GENERAL) {
    handleDownloadConvocatoria();
  }
  handleDownloadRepresentationPowers();
  handlerDownloadActaOrQuorum(...);
  handlerDownloadCertification(...);
  handlerDownloadSolicitudCopias();
};
```

---

### 🔴 **5. ESTADOS FINANCIEROS** (FlowsByIdEnum.ESTADOS_FINANCIEROS_REPARTO_DIVIDENDOS)

**Ubicación**: `src/composables/useDownloadDocuments/useDownloadDocEstadosFinancieros.ts`

**Documentos generados**:

| # | Nombre | Archivo | Condición |
|---|--------|---------|-----------|
| 1 | Convocatoria | `5-A-1-CONVOCATORIA.docx` | Solo si `tipoJunta === JUNTA_GENERAL` |
| 2 | Proxy Persona Natural | `5-A-2-PROXY.docx` | Si hay representantes tipo NATURAL |
| 3 | Proxy Persona Jurídica | `5-A-3-PROXY.docx` | Si hay representantes tipo JURIDICA |
| 4 | **Acta** | `5-A-4-ACTA.docx` | Si `!faltaQuorum` |
| 4b | Falta de Quórum | `5-A-5-FALTA DE QUORUM.docx` | Si `faltaQuorum === true` |

**Nota**: Este flujo genera menos documentos porque es más simple.

---

## 2️⃣ <a id="envio-repositorio"></a>ENVÍO DE DOCUMENTOS AL REPOSITORIO

### Flujo Completo

```
┌─────────────────────────────────────────────────────────────┐
│  GENERACIÓN DE DOCUMENTOS                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ generateAporteDinerarioDocumentsV2()                 │  │
│  │ → Retorna: PromiseSettledResult<IGeneratedDocument>[]│  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  WATCH AUTOMÁTICO (useMonetaryContributionFinalizer)        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ watch(listDocument, async (newVal) => {              │  │
│  │   // 1. Obtener folderId del repositorio            │  │
│  │   // 2. Combinar documentos generados + del flujo   │  │
│  │   // 3. Enviar al repositorio                        │  │
│  │ })                                                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  OBTENER FOLDER ID                                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ handleGetNodeIdByFlow({                                │  │
│  │   societyId,                                          │  │
│  │   folderPath: PathNameEnum.AUMENTO_CAPITAL,           │  │
│  │   folderName: FoldersNameEnum.APORTE_DINERARIO        │  │
│  │ })                                                     │  │
│  │ → GET /repository/society/{societyId}/nodes/core       │  │
│  │ → Busca folder por path + name                        │  │
│  │ → Retorna folderId                                    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  COMBINAR DOCUMENTOS                                          │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ const successfulDocuments = listDocument.filter(...)  │  │
│  │ const documentsFromFlow = await getDocumentsFromFlowAD│  │
│  │ const allDocuments = [...successfulDocuments, ...]    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  ENVIAR AL REPOSITORIO                                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ handleSaveToBackend({                                 │  │
│  │   listDocument: allDocuments,                         │  │
│  │   folderId: folderId,                                 │  │
│  │   nameFlowToDocument: "Documentos Aporte Dinerario"  │  │
│  │ })                                                     │  │
│  │ → POST /repository/society/nodes/{nodeId}/core       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### Composable Principal

**Ubicación**: `src/composables/connection-probo-ai/useSaveDocumentsByFlow.ts`

**Funciones principales**:

#### **1. handleGetNodeIdByFlow**

Obtiene el `folderId` (nodeId) del repositorio según el flujo.

```typescript
const handleGetNodeIdByFlow = async (baseData: IBaseDataToGetNode) => {
  // 1. Obtener todos los nodos de la sociedad
  const folders = await getNodeBySociety(baseData.societyId);
  
  // 2. Buscar el folder que coincida con path + name
  const folderId = folders.data.find(
    (folder) =>
      folder.path === baseData.folderPath && 
      folder.name === baseData.folderName
  )?.id || 0;
  
  return folderId;
};
```

**Mapeo de Flujos a Folders**:

```typescript
const getPathNameAndFolderNameByFlow = (flowId: FlowsByIdEnum) => {
  switch (flowId) {
    case FlowsByIdEnum.APORTE_DINERARIO:
      return {
        pathName: PathNameEnum.AUMENTO_CAPITAL,        // "/core/juntas/aumento capital/"
        folderName: FoldersNameEnum.APORTE_DINERARIO, // "aporte dinerario"
      };
    case FlowsByIdEnum.CAPITALIZACION_DE_CREDITOS:
      return {
        pathName: PathNameEnum.AUMENTO_CAPITAL,
        folderName: FoldersNameEnum.CAPITALIZACION_DE_CREDITOS,
      };
    case FlowsByIdEnum.DESIGNACION_REMOCION_DIRECTOR:
      return {
        pathName: PathNameEnum.DESIGNACION_REMOCION,
        folderName: FoldersNameEnum.DIRECTORES,
      };
    case FlowsByIdEnum.DESIGNACION_REMOCION_GERENTE_APODERADOS:
      return {
        pathName: PathNameEnum.DESIGNACION_REMOCION,
        folderName: FoldersNameEnum.GERENTES_APODERADOS,
      };
    case FlowsByIdEnum.ESTADOS_FINANCIEROS_REPARTO_DIVIDENDOS:
      return {
        pathName: PathNameEnum.ESTADOS_FINANCIEROS_REPARTO_DIVIDENDOS,
        folderName: FoldersNameEnum.ESTADOS_FINANCIEROS_REPARTO_DIVIDENDOS,
      };
  }
};
```

#### **2. handleSaveToBackend**

Envía los documentos al repositorio.

```typescript
const handleSaveToBackend = async (baseData: IBaseDataToSaveDocument) => {
  // 1. Convertir blobs a Files
  const files: File[] = baseData.listDocument.map((doc) => {
    const correctMimeType = getCorrectMimeType(doc.value.nameFile, doc.value.blob.type);
    
    return new File([doc.value.blob], doc.value.nameFile, {
      type: correctMimeType,
    });
  });
  
  // 2. Enviar al repositorio
  await postFilesToNode(
    files, 
    baseData.folderId.toString(), 
    baseData.nameFlowToDocument
  );
  
  toastMessage("success", "Documentos guardados correctamente en el repositorio.");
};
```

---

## 3️⃣ <a id="endpoints"></a>ENDPOINTS DEL REPOSITORIO

### Endpoints Utilizados

| Método | Endpoint | Propósito |
|--------|----------|-----------|
| **GET** | `/repository/society/{societyId}/nodes/core` | Obtener todos los nodos (folders) de una sociedad |
| **POST** | `/repository/society/nodes/{nodeId}/core` | Subir archivos a un nodo (folder) |
| **POST** | `/repository/society/nodes/{folderId}/documents` | Subir un documento a un folder |
| **POST** | `/repository/society/documents/{documentCode}/versions` | Subir nueva versión de un documento |

---

### **1. GET /repository/society/{societyId}/nodes/core**

**Ubicación**: `src/api/connection-probo-ai/getNodeBySociety.ts`

**Propósito**: Obtener la estructura de carpetas del repositorio de una sociedad.

**Request**:
```typescript
GET /repository/society/123/nodes/core
```

**Response**:
```typescript
{
  ok: true,
  data: [
    {
      id: 456,
      name: "aporte dinerario",
      path: "/core/juntas/aumento capital/",
      type: "folder",
      // ... más campos
    },
    {
      id: 789,
      name: "directores",
      path: "/core/juntas/designación y/o remoción/",
      type: "folder",
    },
    // ... más folders
  ]
}
```

**Uso**:
```typescript
const folders = await getNodeBySociety(societyId);
const folderId = folders.data.find(
  (f) => f.path === "/core/juntas/aumento capital/" && f.name === "aporte dinerario"
)?.id;
```

---

### **2. POST /repository/society/nodes/{nodeId}/core**

**Ubicación**: `src/api/connection-probo-ai/postFilesToNode.ts`

**Propósito**: Subir múltiples archivos a un folder del repositorio.

**Request**:
```typescript
POST /repository/society/nodes/456/core?name=Documentos Aporte Dinerario
Content-Type: multipart/form-data

FormData:
  - "12345": File (blob convertido a File)
  - "67890": File
  - "11111": File
```

**Código**:
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

**Response**:
```typescript
{
  ok: true,
  message: "Archivos subidos exitosamente",
  data: {
    uploadedFiles: [
      { fileId: 1, fileName: "3-A-4-ACTA.docx" },
      { fileId: 2, fileName: "3-A-5-CERTIFICACION.docx" },
      // ...
    ]
  }
}
```

---

### **3. POST /repository/society/nodes/{folderId}/documents**

**Ubicación**: `src/modules/probo-ai/services/fileService.ts`

**Propósito**: Subir un solo documento a un folder (usado en el módulo de repositorio).

**Request**:
```typescript
POST /repository/society/nodes/456/documents
Content-Type: multipart/form-data
x-file-size: 12345
Authorization: Bearer {token}

FormData:
  - {uuid}: File
```

**Código**:
```typescript
static async uploadFile(file: File, folderId: string): Promise<UploadFileResponse> {
  const formData = this.createFormData(file);
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

### **4. POST /repository/society/documents/{documentCode}/versions**

**Ubicación**: `src/modules/probo-ai/services/fileVersionService.ts`

**Propósito**: Subir una nueva versión de un documento existente.

**Request**:
```typescript
POST /repository/society/documents/{documentCode}/versions
Content-Type: multipart/form-data
x-file-size: 12345

FormData:
  - {uuid}: File (nueva versión)
```

**Código**:
```typescript
export async function uploadNewVersion(documentCode: string, file: File): Promise<any> {
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

## 4️⃣ <a id="envio-registros"></a>ENVÍO DESDE REGISTROS

### Estructura del Repositorio en Registros

```
/core/sociedades/registro sociedades/
├── datos principales/
├── capital social y acciones/     ← Acciones
├── accionistas/
├── asignación de acciones/
├── régimen de facultades/         ← Facultades
├── registro de apoderados/
├── quorums y mayoría/
└── estatutos/                     ← Acuerdos Societarios
```

---

### **1. ACCIONES** (Capital Social y Acciones)

**Ubicación**: `src/wizards/society-profile/actions/actions.mapper.ts`

**Documentos que se envían**:
- **Derechos Especiales** (`otroDerechoEspecialDoc`)
- **Obligaciones Adicionales** (`regimenObligacionesDoc`)

**Código**:
```typescript
// ActionsMapper.storeToApi()
const customActions: CustomActionDto[] = await Promise.all(
  storeSociedades.listCapitalSocialAcciones.map(async (action) => {
    let specialRightsArchive: FileDto | undefined;
    let additionalObligationsArchive: FileDto | undefined;
    
    // 1. Subir archivo de derechos especiales (si es nuevo)
    if (actionData.otroDerechoEspecialDoc instanceof File) {
      const uploadedFileLink = await this.actionsArchiveService.archive(
        actionData.otroDerechoEspecialDoc
      );
      specialRightsArchive = {
        fileId: uploadedFileLink.data.fileId,
        version: uploadedFileLink.data.versionId,
      };
    } else if (actionData.otroDerechoEspecialDocServer) {
      // Mantener archivo existente
      specialRightsArchive = {
        fileId: actionData.otroDerechoEspecialDocServer.fileId,
        version: actionData.otroDerechoEspecialDocServer.version,
      };
    }
    
    // 2. Subir archivo de obligaciones adicionales (similar)
    if (actionData.regimenObligacionesDoc instanceof File) {
      // ... mismo proceso
    }
    
    return {
      // ... otros campos
      specialRightsArchive,
      additionalObligationsArchive,
    };
  })
);
```

**Endpoint usado**: `actionsArchiveService.archive()` → Internamente usa el endpoint de subida de documentos.

---

### **2. FACULTADES** (Régimen de Facultades)

**Ubicación**: `src/wizards/society-profile/attorney-registry/attorney-registry-files.helper.ts`

**Documentos que se envían**:
- **Archivos de Tipos de Poder** (`fileDocument` de cada representante)

**Código**:
```typescript
export class AttorneyRegistryFilesHelper {
  async ensureUploaded(): Promise<void> {
    const uploads = this.store.representatives
      .filter((r) => {
        // Solo subir si:
        // 1. Tiene archivo nuevo
        // 2. O el archivo cambió (nombre, tamaño, fecha)
        if (!r.fileDocument) return false;
        if (!r.fileServer) return true; // Nuevo archivo
        return !(
          r.uploadedName === r.fileDocument.name &&
          r.uploadedSize === r.fileDocument.size &&
          r.uploadedLastModified === r.fileDocument.lastModified
        );
      })
      .map(async (rep) => {
        const res = await this.archiveService.archive(
          rep.fileDocument!,
          rep.fileServer ? rep.fileServer.fileId : undefined // Si existe, actualiza versión
        );
        
        // Guardar referencia del servidor
        rep.fileServer = { 
          fileId: res.data.fileId, 
          version: res.data.versionId 
        };
      });
    
    await Promise.all(uploads);
  }
}
```

**Endpoint usado**: `archiveService.archive()` → Similar a acciones.

---

### **3. ACUERDOS SOCIETARIOS** (Estatutos)

**Ubicación**: `src/wizards/society-profile/corporate-agreements/corporate-agreements.mapper.ts`

**Documentos que se envían**:
- **Estatutos Sociales** (`estatutosSociales`)
- **Convenio de Accionistas** (`convenioAccionistas`)
- **Acuerdo con Terceros** (`acuerdoTerceros`)

**Código**:
```typescript
public async storeToApi(): Promise<CreateCorporateAgreementsDto> {
  const acuerdosStore = useStoreAcuerdosSocietarios();
  
  const estatutosFile = acuerdosStore.estatutosSociales;
  const convenioFile = acuerdosStore.convenioAccionistas;
  const acuerdoTercerosFile = acuerdosStore.acuerdoTerceros;
  
  // 1. Subir Estatutos Sociales
  if (estatutosFile) {
    if (estatutosFile instanceof File) {
      // Archivo nuevo → Subir
      const uploadedFile = await this.archiveService.archive(estatutosFile);
      createDto.bylaws = {
        fileId: uploadedFile.data.fileId,
        version: uploadedFile.data.versionId,
      };
    } else {
      // Archivo existente → Mantener referencia
      createDto.bylaws = {
        fileId: (estatutosFile as FileObject).fileId,
        version: (estatutosFile as FileObject).version,
      };
    }
  }
  
  // 2. Subir Convenio de Accionistas (similar)
  if (convenioFile) {
    // ... mismo proceso
  }
  
  // 3. Subir Acuerdo con Terceros (similar)
  if (acuerdoTercerosFile) {
    // ... mismo proceso
  }
  
  return createDto;
}
```

**Endpoint usado**: `archiveService.archive()` → Similar a acciones y facultades.

---

## 5️⃣ <a id="recomendaciones-backend"></a>RECOMENDACIONES PARA BACKEND V3

### 📝 **Carta al Backend**

---

**Hola Backend! 👋**

Ahora que estamos migrando a V3, necesitamos que documentes y adaptes el repositorio para que funcione con la nueva arquitectura. Aquí te dejo lo que necesitamos:

---

### **1. Estructura de Carpetas V3**

**V2.5**:
```
/core/juntas/
├── aumento capital/
│   ├── aporte dinerario/
│   └── capitalización de créditos/
└── designación y/o remoción/
    ├── directores/
    └── gerentes y/o apoderados/
```

**V3** (Propuesta):
```
/core/juntas/
└── {flowId}/                    ← Una carpeta por junta (flowId)
    ├── documentos generados/   ← Todos los documentos de la junta
    │   ├── acta.docx
    │   ├── convocatoria.docx
    │   ├── proxy-*.docx
    │   └── ...
    └── puntos de acuerdo/      ← Subcarpetas por punto
        ├── aporte-dinerario/
        ├── capitalizacion-creditos/
        └── nombramiento-directores/
```

**Razón**: En V3, una junta puede tener múltiples puntos de acuerdo, entonces necesitamos:
- Una carpeta principal por junta (`{flowId}`)
- Subcarpetas por punto de acuerdo (opcional, para organización)

---

### **2. Endpoints Recomendados**

#### **A. Obtener estructura de carpetas de una junta**

```typescript
GET /api/v3/society/{societyId}/flow/{flowId}/repository/structure

Response:
{
  flowId: 123,
  folders: [
    {
      id: 456,
      name: "documentos generados",
      path: "/core/juntas/123/documentos generados/",
      type: "folder",
      documents: [
        { id: 1, name: "acta.docx", version: 1 },
        { id: 2, name: "convocatoria.docx", version: 1 },
      ]
    },
    {
      id: 789,
      name: "puntos de acuerdo",
      path: "/core/juntas/123/puntos de acuerdo/",
      type: "folder",
      subfolders: [
        {
          id: 101,
          name: "aporte-dinerario",
          path: "/core/juntas/123/puntos de acuerdo/aporte-dinerario/",
        }
      ]
    }
  ]
}
```

#### **B. Subir documentos generados de una junta**

```typescript
POST /api/v3/society/{societyId}/flow/{flowId}/repository/documents
Content-Type: multipart/form-data

Params:
  - folder: "documentos generados" | "puntos de acuerdo/{puntoId}" (opcional)
  - puntoAcuerdoId: number (opcional, si se sube a punto específico)

Body:
  FormData con archivos

Response:
{
  ok: true,
  data: {
    uploadedFiles: [
      { fileId: 1, fileName: "acta.docx", version: 1 },
      { fileId: 2, fileName: "convocatoria.docx", version: 1 },
    ]
  }
}
```

#### **C. Obtener documentos de una junta**

```typescript
GET /api/v3/society/{societyId}/flow/{flowId}/repository/documents

Query Params:
  - folder?: string (opcional, filtrar por carpeta)
  - puntoAcuerdoId?: number (opcional, filtrar por punto)

Response:
{
  ok: true,
  data: {
    documents: [
      {
        id: 1,
        name: "acta.docx",
        version: 1,
        folder: "documentos generados",
        puntoAcuerdoId: null,
        uploadedAt: "2025-01-15T10:30:00Z",
      },
      {
        id: 2,
        name: "convocatoria.docx",
        version: 1,
        folder: "documentos generados",
        puntoAcuerdoId: null,
        uploadedAt: "2025-01-15T10:30:00Z",
      }
    ]
  }
}
```

---

### **3. Metadatos de Documentos**

**Recomendación**: Agregar metadatos a los documentos para facilitar búsqueda y organización.

```typescript
interface DocumentMetadata {
  // Identificación
  id: number;
  name: string;
  version: number;
  
  // Ubicación
  societyId: number;
  flowId: number;
  folderId: number;
  folderPath: string;
  
  // Clasificación
  tipoDocumento: TipoDocumento;        // ACTA, CONVOCATORIA, PROXY, etc.
  puntoAcuerdoId?: number;             // Si pertenece a un punto específico
  puntoAcuerdoTipo?: TipoPuntoAcuerdo; // APORTE_DINERARIO, etc.
  
  // Archivo
  fileId: number;
  fileSize: number;
  mimeType: string;
  
  // Timestamps
  uploadedAt: Date;
  updatedAt: Date;
  createdBy: number;
}
```

---

### **4. Reglas de Negocio para V3**

#### **A. Creación automática de carpetas**

Cuando se crea una nueva junta (`POST /api/v3/society/{societyId}/flow`), el backend debe:
1. Crear automáticamente la carpeta `/core/juntas/{flowId}/`
2. Crear subcarpeta `documentos generados/`
3. Crear subcarpeta `puntos de acuerdo/` (opcional)

#### **B. Organización por punto de acuerdo**

Cuando se sube un documento relacionado con un punto de acuerdo:
- Si `puntoAcuerdoId` está presente → Subir a `/core/juntas/{flowId}/puntos de acuerdo/{puntoTipo}/`
- Si no → Subir a `/core/juntas/{flowId}/documentos generados/`

#### **C. Versionado**

- Si se sube un documento con el mismo nombre → Crear nueva versión (no reemplazar)
- Mantener historial de versiones
- Permitir descargar versiones anteriores

#### **D. Límites de almacenamiento**

- Validar límite por sociedad antes de subir
- Retornar error claro si se supera: `"Upload would exceed society storage limit"`

---

### **5. Endpoints de Registros (Mantener igual)**

Los endpoints de registros pueden mantenerse igual, solo necesitamos documentarlos:

```typescript
// Acciones
POST /api/v2/society-profile/{societyId}/actions
→ Sube: otroDerechoEspecialDoc, regimenObligacionesDoc

// Facultades
POST /api/v2/society-profile/{societyId}/attorney-registry
→ Sube: fileDocument de cada representante

// Acuerdos Societarios
POST /api/v2/society-profile/{societyId}/corporate-agreements
→ Sube: estatutosSociales, convenioAccionistas, acuerdoTerceros
```

**Ubicación en repositorio**:
- Acciones → `/core/sociedades/registro sociedades/capital social y acciones/`
- Facultades → `/core/sociedades/registro sociedades/régimen de facultades/`
- Acuerdos → `/core/sociedades/registro sociedades/estatutos/`

---

### **6. Checklist para Backend**

- [ ] Documentar estructura de carpetas V3
- [ ] Implementar endpoints de repositorio para juntas V3
- [ ] Agregar metadatos a documentos (tipoDocumento, puntoAcuerdoId, etc.)
- [ ] Crear carpetas automáticamente al crear junta
- [ ] Implementar versionado de documentos
- [ ] Validar límites de almacenamiento
- [ ] Documentar endpoints de registros (acciones, facultades, acuerdos)
- [ ] Proporcionar ejemplos de request/response
- [ ] Documentar códigos de error

---

### **7. Preguntas para Backend**

1. ❓ ¿Cómo se maneja el versionado actualmente? ¿Se mantiene historial?
2. ❓ ¿Los límites de almacenamiento son por sociedad o por usuario?
3. ❓ ¿Se puede crear una carpeta automáticamente al crear una junta?
4. ❓ ¿Cómo se relacionan los documentos con los puntos de acuerdo en la BD?
5. ❓ ¿Hay algún endpoint para buscar documentos por metadatos (tipo, fecha, etc.)?
6. ❓ ¿Se puede obtener un ZIP con todos los documentos de una junta?

---

## ✅ RESUMEN

### Reglas de Negocio por Flujo

| Flujo | Documentos | Condiciones Especiales |
|-------|------------|------------------------|
| Aporte Dinerario | 10 docs | Convocatoria solo si General |
| Capitalización | 9 docs | Incluye Informe de Créditos |
| Nombramiento Directores | 7 docs | Incluye Aceptación de Cargo |
| Nombramiento Gerente | 7 docs | Incluye Renuncia |
| Estados Financieros | 3 docs | Solo si General |

### Envío al Repositorio

1. **Generar documentos** → `generateXDocumentsV2()`
2. **Obtener folderId** → `GET /repository/society/{societyId}/nodes/core`
3. **Subir documentos** → `POST /repository/society/nodes/{nodeId}/core`

### Envío desde Registros

- **Acciones**: Derechos especiales + Obligaciones adicionales
- **Facultades**: Archivos de tipos de poder
- **Acuerdos**: Estatutos + Convenio + Acuerdo con terceros

### Recomendaciones V3

- Estructura: `/core/juntas/{flowId}/documentos generados/`
- Endpoints: Específicos por flowId
- Metadatos: tipoDocumento, puntoAcuerdoId, etc.
- Organización: Subcarpetas por punto de acuerdo (opcional)

---

**¿Listo para coordinar con Backend, mi rey?** 🚀💪

