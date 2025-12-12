# 📊 V2.5: Estados Financieros y Reparto de Dividendos - Flujo Completo

**Fecha**: 2 de Diciembre 2025  
**Enfoque**: Documentación completa del flujo de Estados Financieros y Reparto de Dividendos  
**Estado**: ✅ Documentación completa

---

## 📋 ÍNDICE

1. [Vista General del Flujo](#vista-general)
2. [Estados Financieros - Vista y Componentes](#estados-financieros-vista)
3. [Estados Financieros - Store](#estados-financieros-store)
4. [Estados Financieros - Fetches y Endpoints](#estados-financieros-fetches)
5. [Reparto de Dividendos - Vista y Componentes](#reparto-dividendos-vista)
6. [Reparto de Dividendos - Store](#reparto-dividendos-store)
7. [Reparto de Dividendos - Fetches y Endpoints](#reparto-dividendos-fetches)
8. [Guardado de Documentos en Repositorio AI](#guardado-repositorio)
9. [Flujo Completo de Creación](#flujo-creacion)

---

## 1️⃣ <a id="vista-general"></a>VISTA GENERAL DEL FLUJO

### **A. Estructura del Flujo**

El flujo de **Estados Financieros y Reparto de Dividendos** tiene **11 pasos**:

| Paso | Nombre | Componente Principal |
|------|--------|---------------------|
| 1-5 | Pasos comunes (Tipo Junta, Convocatoria, Representación, Asistencia, Presidente/Secretario) | Compartidos con otros flujos |
| **6** | **Estados Financieros** | `EstadosFinancieros.vue` |
| **7** | **Votación Estados Financieros** | `VotacionEstadosFinancieros.vue` |
| **8** | **Reparto de Dividendos** | `RepartoDividendos.vue` |
| **9** | **Votación Reparto de Dividendos** | `VotacionRepartoDividendos.vue` |
| 10 | Resumen | `ResumenEFRD.vue` |
| 11 | Descarga | `PreviewDocuments.vue` |

**Ruta base**: `/juntas/estados-financieros-y-reparto-dividendos/main`

---

### **B. Flujo de Datos General**

```
Vista (Vue Component)
    ↓
Composable (opcional) - Lógica reactiva
    ↓
Store (Pinia) - Estado global
    ↓
Service (Service Class) - Lógica de negocio
    ↓
API Function - Llamada HTTP
    ↓
Backend API
```

---

## 2️⃣ <a id="estados-financieros-vista"></a>ESTADOS FINANCIEROS - VISTA Y COMPONENTES

### **A. Vista Principal: `EstadosFinancieros.vue`**

**Ubicación**: `src/components/Views/EstadosFinancierosRepartoDividendos/EstadosFinancieros/EstadosFinancieros.vue`

**Propósito**: Permitir al usuario subir múltiples estados financieros (Balance General, Estado de Resultados, y otros personalizados)

**Estructura del Template**:

```vue
<template>
  <div class="flex flex-col gap-14 py-16">
    <!-- Header -->
    <HeaderSecction
      title="Estados Financieros"
      body="Sube los estados financieros."
    />

    <!-- Lista de Estados Financieros -->
    <div class="flex flex-col gap-4">
      <!-- Skeleton mientras carga -->
      <EstadosFinancierosSkeleton v-if="isLoading" />

      <!-- Filas de estados financieros -->
      <RowEstadosFinancieros
        v-for="estadosFinancieros in storeEstadosFinancieros.listaEstadosFinancieros"
        :key="estadosFinancieros.id"
        :valueEstados="estadosFinancieros"
        @deleteItem="handleDeleteEstadosFinanciero"
      />

      <!-- Botón para agregar más estados -->
      <CustomButton @click="handleOpenModal">
        Agregar otro estado financiero
      </CustomButton>
    </div>
  </div>

  <!-- Modal para agregar estado financiero -->
  <ModalEstadosFinancieros
    v-model:value-modal="valueModal"
    :openModal="openModal"
    @onClose="handleCloseModal"
    @onsubmit="handleSubmitModal"
  />
</template>
```

**Script Setup**:

```typescript
// Composables y stores
const {
  storeEstadosFinancieros,
  openModal,
  valueModal,
  handleOpenModal,
  handleCloseModal,
  handleSubmitModal,
  handleDeleteEstadosFinanciero,
} = useEstadosFinancieros();

const layoutStore = useLayoutStore();
const financialStatementsService = new FinancialStatementsService();

// Validación: Deshabilitar botón "Siguiente" si falta algún archivo
watchEffect(() => {
  layoutStore.isButtonDisabled = storeEstadosFinancieros.validateNextPath;
});

// Cargar datos al montar
onMounted(async () => {
  layoutStore.currentStep = 6;
  layoutStore.nextPath = NameEstadosFinancieros.VOTACION_ESTADOS_FINANCIEROS_7;
  
  // Cargar estados financieros desde backend
  await financialStatementsService.getLocalData();
});
```

---

### **B. Componentes Utilizados**

#### **1. `RowEstadosFinancieros.vue`**

**Propósito**: Renderizar una fila de estado financiero (nombre + input de archivo)

**Estructura**:
```vue
<template>
  <div class="grid grid-cols-[250px_1fr]">
    <!-- Nombre del estado financiero -->
    <div class="border rounded-md p-4">
      <p>{{ valueEstados.name }}</p>
    </div>
    
    <!-- Input y preview del archivo -->
    <div class="flex gap-4">
      <InputAndPreviewEstados
        v-model:stateFile="valueEstados.file"
        :estadoId="Number(valueEstados.id)"
      />
      <ButtonTrash
        v-if="!valueEstados.isDefault"
        @trash="handleDelete"
      />
    </div>
  </div>
</template>
```

**Props**:
- `valueEstados: IEstadosFinancieros` - Estado financiero a mostrar
- `isPreview?: boolean` - Modo preview

**Eventos**:
- `@deleteItem` - Eliminar estado financiero

---

#### **2. `InputAndPreviewEstados.vue`**

**Propósito**: Componente que maneja la subida y preview del archivo

**Estructura**:
```vue
<template>
  <div>
    <!-- Drag & Drop cuando no hay archivo -->
    <DragAndDropEstadosFinancieros
      v-if="stateFile === null && localFile === null"
      v-model:file="localFile"
      @update:file="handleFile"
      message-event-click="Haz click"
      message-body=" o arrastra el documento Word, Excel o PDF (max, 5MB)"
      :allowed-mime-types="[...]"
      accept-extensions=".pdf,.doc,.docx,.xlsx,.xls"
    />

    <!-- Preview cuando hay archivo -->
    <div v-else class="flex justify-between items-start border rounded-md p-4">
      <div class="flex items-start gap-2">
        <Icon icon="heroicons:document-arrow-up" />
        <div>
          <p>{{ stateFile?.name }}</p>
          <p>{{ formatFileSize(stateFile?.size) }}</p>
        </div>
      </div>
      <button @click="deleteFile">
        <Icon icon="mingcute:close-fill" />
      </button>
    </div>
  </div>
</template>
```

**Lógica de Subida**:

```typescript
const handleFile = async (file: File) => {
  localFile.value = file;
  isLoading.value = true;

  try {
    const flowId = typeMeetingStore.meetingFlowId;
    
    // ⭐ SUBIR ARCHIVO AL REPOSITORIO
    const uploadedFile = await archiveService.archive(file, undefined, flowId);

    if (uploadedFile.success) {
      // Crear objeto de archivo
      const newStateFile: EstadosFinancierosFile = {
        fileId: uploadedFile.data.fileId,
        version: uploadedFile.data.versionId,
        name: file.name,
        size: file.size,
      };

      // Actualizar store
      if (props.estadoId) {
        store.updateFile(props.estadoId, newStateFile);
      }

      emits("update:stateFile", newStateFile);
      toastMessage("success", "Archivo subido correctamente");
    }
  } catch (error) {
    toastMessage("error", "Error al subir el archivo");
  } finally {
    isLoading.value = false;
  }
};
```

---

#### **3. `DragAndDropEstadosFinancieros.vue`**

**Propósito**: Componente de drag & drop para subir archivos

**Funcionalidades**:
- ✅ Drag & drop
- ✅ Click para seleccionar archivo
- ✅ Validación de tipos MIME
- ✅ Validación de extensiones
- ✅ Preview del archivo seleccionado

**Tipos permitidos**:
```typescript
allowedMimeTypes: [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]

acceptExtensions: ".pdf,.doc,.docx,.xlsx,.xls,.xlsm,.xlsb"
```

---

#### **4. `ModalEstadosFinancieros.vue`**

**Propósito**: Modal para agregar un nuevo estado financiero personalizado

**Estructura**:
```vue
<template>
  <LayoutModal
    title="Agregar otro Estado Financiero"
    subtitle="Ingresa el nombre del estado financiero."
    :open="openModal"
  >
    <BaseInputText
      v-model="newValueModal"
      placeholder="ej. Estado de Flujo de Efectivo"
    />
    
    <template #actions>
      <ButtonForm variant="cancel" @onAction="handleCancel" />
      <ButtonForm variant="submit" @onAction="handleSubmit" />
    </template>
  </LayoutModal>
</template>
```

**Flujo**:
1. Usuario ingresa nombre
2. Click en "Agregar"
3. Se agrega al store: `storeEstadosFinancieros.addEstadosFinanciero(nombre)`

---

### **C. Composable: `useEstadosFinancieros.ts`**

**Propósito**: Lógica reactiva para manejar el modal y acciones

```typescript
export const useEstadosFinancieros = () => {
  const storeEstadosFinancieros = useStoreEstadosFinancieros();
  const openModal = ref(false);
  const valueModal = ref("");

  const handleOpenModal = () => {
    openModal.value = true;
  };

  const handleCloseModal = () => {
    openModal.value = false;
    valueModal.value = "";
  };

  const handleSubmitModal = () => {
    // Agregar al store
    storeEstadosFinancieros.addEstadosFinanciero(valueModal.value);
    handleCloseModal();
  };

  const handleDeleteEstadosFinanciero = (id: string | number) => {
    storeEstadosFinancieros.deleteEstadosFinanciero(id);
  };

  return {
    storeEstadosFinancieros,
    openModal,
    valueModal,
    handleOpenModal,
    handleCloseModal,
    handleSubmitModal,
    handleDeleteEstadosFinanciero,
  };
};
```

---

## 3️⃣ <a id="estados-financieros-store"></a>ESTADOS FINANCIEROS - STORE

### **A. Store: `useStoreEstadosFinancieros.ts`**

**Ubicación**: `src/components/Views/EstadosFinancierosRepartoDividendos/EstadosFinancieros/useStoreEstadosFinancieros.ts`

**Estado Inicial**:

```typescript
state: (): State => ({
  listaEstadosFinancieros: [
    {
      id: 1,
      name: "Balance General",
      file: null,
      isDefault: true,
    },
    {
      id: 2,
      name: "Estado de Resultados",
      file: null,
      isDefault: true,
    },
  ],
})
```

**Interfaz del Estado Financiero**:

```typescript
export interface IEstadosFinancieros {
  id: number | string;           // UUID o número
  name: string;                  // "Balance General", "Estado de Resultados", etc.
  file: EstadosFinancierosFile | null;  // Archivo subido
  isDefault?: boolean;            // Si es por defecto (no se puede eliminar)
}

export interface EstadosFinancierosFile {
  fileId: number;                // ID del archivo en el repositorio
  version: number;                // Versión del archivo
  name: string;                   // Nombre del archivo
  size: number;                    // Tamaño en bytes
  url?: string;                    // URL para descargar (opcional)
}
```

**Getters**:

```typescript
getters: {
  // Valida que todos los estados financieros tengan archivo
  validateNextPath(): boolean {
    return this.listaEstadosFinancieros.every((estado) => estado.file !== null);
  },
}
```

**Actions**:

```typescript
actions: {
  // Agregar nuevo estado financiero
  addEstadosFinanciero(nuevoEstado: string) {
    const nuevoEstadoFinanciero: IEstadosFinancieros = {
      id: uuid(),
      name: capitalizeWords(nuevoEstado),
      file: null,
    };
    this.listaEstadosFinancieros.push(nuevoEstadoFinanciero);
  },

  // Eliminar estado financiero
  deleteEstadosFinanciero(id: string | number) {
    this.listaEstadosFinancieros = this.listaEstadosFinancieros.filter(
      (estado) => estado.id !== id
    );
  },

  // Actualizar archivo de un estado financiero
  updateFile(estadoId: number, newFile: EstadosFinancierosFile) {
    const estado = this.listaEstadosFinancieros.find((e) => e.id === estadoId);
    if (estado) {
      estado.file = newFile;
    }
  },

  // Cargar datos desde API
  async ApiToStoreEstadosFinancieros(listaEstados: ApiFinancialStatements[]) {
    // 1. Crear lista temporal
    const nuevaLista: IEstadosFinancieros[] = [];

    // 2. Procesar cada estado con su archivo
    const estadosConPromesas = listaEstados.map((estado) => {
      const nuevoEstado: IEstadosFinancieros = {
        id: estado.id || uuid(),
        name: capitalizeWords(estado.name),
        file: null,
      };

      return {
        estado: nuevoEstado,
        promesaArchivo: estado.link ? getDocumentFile(estado.link) : Promise.resolve(null),
      };
    });

    // 3. Resolver todas las promesas
    const resultados = await Promise.allSettled(
      estadosConPromesas.map((item) => item.promesaArchivo)
    );

    // 4. Construir lista final con archivos
    resultados.forEach((resultado, index) => {
      const { estado } = estadosConPromesas[index];

      if (resultado.status === "fulfilled" && resultado.value) {
        estado.file = {
          fileId: estado.id as number,
          version: 1,
          name: estado.name,
          size: resultado.value.size || 0,
        };
      }

      nuevaLista.push(estado);
    });

    // 5. Reemplazar lista completa
    this.listaEstadosFinancieros = nuevaLista;
  },
}
```

**Persistencia**:
```typescript
persist: {
  key: "storeEstadosFinancieros",
}
```

---

## 4️⃣ <a id="estados-financieros-fetches"></a>ESTADOS FINANCIEROS - FETCHES Y ENDPOINTS

### **A. Endpoints Utilizados**

#### **1. Subir Archivo de Estado Financiero**

**Endpoint**: `POST /society-profile/{societyId}/flow/{flowId}/financial-statements/files`

**Función**: `postFinancialStatementsFile`

**Ubicación**: `src/api/financial-statements-dividend/postFinancialStatementsFile.ts`

**Código**:
```typescript
export const postFinancialStatementsFile = async (
  societyId: number,
  flowId: number,
  formData: FormData
): Promise<ApiResponse<CreateFileResponse>> => {
  const response = await axios.post<ApiResponse<CreateFileResponse>>(
    `${URL_SOCIETY_PROFILE}/${societyId}/flow/${flowId}/financial-statements/files`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  
  return response.data;
};
```

**FormData enviado**:
```typescript
const formData = new FormData();
formData.append("file", file);  // Archivo File
// Opcional: formData.append("fileId", fileId.toString()); // Si es actualización
```

**Respuesta**:
```typescript
{
  success: true,
  data: {
    fileId: number,      // ID del archivo en el repositorio
    versionId: number,   // Versión del archivo
  }
}
```

**Cuándo se llama**:
- Cuando el usuario sube un archivo en `InputAndPreviewEstados.vue`
- Se llama desde `FinancialStatementsArchiveService.archive()`

---

#### **2. Guardar Estados Financieros (Metadatos)**

**Endpoint**: `POST /society-profile/{societyId}/flow/{flowId}/financial-statements`

**Función**: `postFinancialStatements`

**Ubicación**: `src/api/financial-statements-dividend/postFinancialStatements.ts`

**Código**:
```typescript
export const postFinancialStatements = async (
  societyId: number,
  flowId: number,
  dto: FinancialStatementsDto
): Promise<ApiResponse<FinancialStatementsApiResponse>> => {
  const response = await axios.post<ApiResponse<FinancialStatementsApiResponse>>(
    `${URL_SOCIETY_PROFILE}/${societyId}/flow/${flowId}/financial-statements`,
    dto
  );
  
  return response.data;
};
```

**DTO enviado**:
```typescript
interface FinancialStatementsDto {
  financialStatements: Array<{
    name: string;        // "Balance General", "Estado de Resultados", etc.
    file: {
      fileId: number;    // ID del archivo (ya subido)
      version: number;   // Versión del archivo
    };
    id?: number;         // Si existe (actualización)
  }>;
}
```

**Ejemplo**:
```typescript
{
  financialStatements: [
    {
      name: "Balance General",
      file: {
        fileId: 123,
        version: 1,
      },
    },
    {
      name: "Estado de Resultados",
      file: {
        fileId: 124,
        version: 1,
      },
    },
  ]
}
```

**Cuándo se llama**:
- Al hacer click en "Siguiente" (desde `FinancialStatementsService.create()`)
- Se llama desde `wizardController()` cuando se avanza al siguiente paso

---

#### **3. Obtener Estados Financieros**

**Endpoint**: `GET /society-profile/{societyId}/flow/{flowId}/financial-statements`

**Función**: `getFinancialStatements`

**Ubicación**: `src/api/financial-statements-dividend/getFinancialStatements.ts`

**Código**:
```typescript
export const getFinancialStatements = async (
  societyId: number,
  flowId: number
): Promise<ApiResponse<FinancialStatementsApiResponse>> => {
  const response = await axios.get<ApiResponse<FinancialStatementsApiResponse>>(
    `${URL_SOCIETY_PROFILE}/${societyId}/flow/${flowId}/financial-statements`
  );
  
  return response.data;
};
```

**Respuesta**:
```typescript
{
  success: true,
  data: {
    financialStatements: [
      {
        id: number,
        name: string,
        file: {
          fileId: number,
          version: number,
          originalName: string,
          size: number,
          url?: string,  // URL para descargar
        },
      },
    ],
  },
}
```

**Cuándo se llama**:
- Al cargar la vista (`onMounted` en `EstadosFinancieros.vue`)
- Se llama desde `FinancialStatementsService.getLocalData()`

---

#### **4. Actualizar Estados Financieros**

**Endpoint**: `PUT /society-profile/{societyId}/flow/{flowId}/financial-statements`

**Función**: `putFinancialStatements`

**Código**: Similar a `postFinancialStatements`, pero con `PUT`

**Cuándo se llama**:
- Si ya existen estados financieros y se actualizan
- Se llama desde `FinancialStatementsService.update()`

---

### **B. Servicio: `FinancialStatementsService`

**Ubicación**: `src/wizards/shareholders-meeting/financials/financial-dividends/financial-statements/financial-statements.service.ts`

**Métodos principales**:

```typescript
export class FinancialStatementsService {
  // Obtener estados financieros
  async get(societyProfileId: number, meetingFlowId: number): Promise<ApiResponse<any>> {
    const response = await getFinancialStatements(societyProfileId, meetingFlowId);
    await this.mapper.apiToStore(response);  // Actualizar store
    return response;
  }

  // Crear estados financieros
  async create(societyProfileId: number, meetingFlowId: number): Promise<ApiResponse<any>> {
    const createDto = await this.mapper.storeToApi();  // Convertir store → DTO
    const response = await postFinancialStatements(societyProfileId, meetingFlowId, createDto);
    return response;
  }

  // Actualizar estados financieros
  async update(societyProfileId: number, meetingFlowId: number): Promise<any> {
    const dto = await this.mapper.storeToApi();
    const response = await putFinancialStatements(societyProfileId, meetingFlowId, dto);
    return response;
  }

  // Upsert (crear o actualizar)
  async upsert(societyProfileId: number): Promise<ApiResponse<any>> {
    // 1. Verificar si existen datos
    let existingData;
    try {
      existingData = await this.get(societyProfileId, meetingFlowId, true);
    } catch {
      existingData = null;
    }

    // 2. Si existen, actualizar; si no, crear
    if (existingData?.data?.financialStatements?.length > 0) {
      return await this.update(societyProfileId, meetingFlowId);
    } else {
      return await this.create(societyProfileId, meetingFlowId);
    }
  }

  // Cargar datos locales (wrapper)
  async getLocalData() {
    await this.getData();
  }

  async getData() {
    const appStore = useAppStore();
    const societyStore = useStoreSocietyFlow();
    const societyId = appStore.societySelectId;
    const meetingFlowId = societyStore.idFlowSelect;

    if (!societyId || !meetingFlowId) {
      return;
    }

    const resp = await this.get(societyId, meetingFlowId);
    // El mapper actualiza el store automáticamente
  }
}
```

---

### **C. Mapper: `FinancialStatementsMapper`

**Ubicación**: `src/wizards/shareholders-meeting/financials/financial-dividends/financial-statements/financial-statements.mapper.ts`

**Store → API**:

```typescript
public async storeToApi(): Promise<any> {
  const financialStatementsStore = useStoreEstadosFinancieros();
  const financialStatements: any[] = [];

  for (const estado of financialStatementsStore.listaEstadosFinancieros) {
    if (estado.file) {
      // Si es un File nuevo, subirlo primero
      if (estado.file instanceof File) {
        const uploadedFile = await this.archiveService.archive(estado.file);
        fileData = {
          fileId: uploadedFile.data.fileId,
          version: uploadedFile.data.versionId,
        };
      } else {
        // Si es un archivo existente, usar fileId
        fileData = {
          fileId: estado.file.fileId,
          version: estado.file.version || 1,
        };
      }

      financialStatements.push({
        name: estado.name,
        file: fileData,
        id: typeof estado.id === "number" ? estado.id : undefined,
      });
    }
  }

  return financialStatements;
}
```

**API → Store**:

```typescript
public async apiToStore(apiData: ApiResponse<any>): Promise<any> {
  const financialStatementsStore = useStoreEstadosFinancieros();
  const { data } = apiData;

  if (!data || !data.financialStatements) {
    return;
  }

  // Mapear cada estado financiero
  const mappedEstadosFinancieros: IEstadosFinancieros[] = data.financialStatements.map(
    (estado: any) => {
      const mappedEstado: IEstadosFinancieros = {
        id: estado.id,
        name: estado.name,
        file: null,
        isDefault: estado.name === "Balance General" || estado.name === "Estado de Resultados",
      };

      if (estado.file) {
        mappedEstado.file = {
          fileId: estado.file.fileId || estado.file.id,
          version: estado.file.version || 1,
          name: estado.file.originalName || estado.name,
          size: estado.file.size || 0,
        };
      }

      return mappedEstado;
    }
  );

  // Actualizar store
  financialStatementsStore.listaEstadosFinancieros = mappedEstadosFinancieros;
}
```

---

### **D. Archive Service: `FinancialStatementsArchiveService`

**Ubicación**: `src/wizards/shareholders-meeting/financials/financial-dividends/financial-statements/financial-statements-archive.service.ts`

**Propósito**: Subir archivos al repositorio

```typescript
export class FinancialStatementsArchiveService {
  async archive(
    file: File,
    fileId?: number,
    flowId?: number
  ): Promise<ApiResponse<CreateFileResponse>> {
    const societyId = this.appStore.societySelectId;

    const formData = new FormData();
    formData.append("file", file);

    if (fileId !== undefined) {
      formData.append("fileId", fileId.toString());
    }

    // POST /society-profile/{societyId}/flow/{flowId}/financial-statements/files
    const response = await postFinancialStatementsFile(societyId!, flowId!, formData);
    return response;
  }
}
```

---

## 5️⃣ <a id="reparto-dividendos-vista"></a>REPARTO DE DIVIDENDOS - VISTA Y COMPONENTES

### **A. Vista Principal: `RepartoDividendos.vue`**

**Ubicación**: `src/components/Views/EstadosFinancierosRepartoDividendos/RepartoDividendos/RepartoDividendos.vue`

**Propósito**: Permitir al usuario ingresar valores financieros para calcular el reparto de dividendos

**Estructura del Template**:

```vue
<template>
  <div class="pt-16 w-full flex flex-col gap-spc-50 pb-20">
    <!-- Header -->
    <HeaderSecction
      title="Reparto dividendos"
      body="Definir monto a repartir como dividendos."
    />

    <!-- Secciones de cálculo -->
    <ValorePreliminares :is-preview="isPreview" />
    <UtilidadAntesReservaLegal :is-preview="isPreview" v-if="!isPreview" />
    <CalculoReservaLegal
      v-if="condicionesCumplidas"
      :is-preview="isPreview"
    />
    <ValorUtilidadDistribuible
      v-if="condicionesCumplidas"
      :is-preview="isPreview"
    />
  </div>

  <!-- Modal de advertencia si no es posible el reparto -->
  <ModalRepartoDividendos
    v-if="!isPreview"
    :open="isOpenModal"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>
```

**Script Setup**:

```typescript
// Composable simplificado
const { isOpenModal, storeRepartoDividendos, handleConfirm, handleCancel } =
  useDividendDistribution({
    isPreview: props.isPreview,
  });
```

---

### **B. Componentes Utilizados**

#### **1. `ValorePreliminares.vue`**

**Propósito**: Ingresar valores preliminares (Capital Social Pagado, Utilidad/Pérdida Acumulada, etc.)

**Campos**:
- Capital Social Pagado
- Utilidad o Pérdida Acumulada
- Utilidad o Pérdida del Ejercicio
- Patrimonio Neto

**Código**:
```vue
<template>
  <div class="border rounded-[10px] p-6">
    <HeaderSecction title="Valores Preliminares" />
    <section class="grid grid-cols-2 gap-5">
      <BaseInputNumber
        v-model="storeRepartoDividendos.capitalSocialPagado"
        label="Capital Social Pagado"
        :variant="Variant.MONETARY_SOLES"
      />
      <BaseInputNumber
        v-model="storeRepartoDividendos.utilidadPerdidaAcumulada"
        label="Utilidad o Pérdida Acumulada"
        :variant="Variant.MONETARY_SOLES"
      />
      <!-- ... más campos ... -->
    </section>
  </div>
</template>
```

---

#### **2. `UtilidadAntesReservaLegal.vue`**

**Propósito**: Mostrar cálculos automáticos de utilidad antes de la reserva legal

**Cálculos mostrados**:
- Diferencia Patrimonio - Capital Pagado
- Utilidad Distribuible antes de Reserva

**Lógica**: Estos valores se calculan automáticamente en el store

---

#### **3. `CalculoReservaLegal.vue`**

**Propósito**: Mostrar y calcular la reserva legal

**Campos**:
- Capital Social Suscrito (calculado automáticamente)
- Reserva Legal Actual
- Porcentaje a Retraerse a Reserva Legal
- Monto Destinado a Reserva Legal
- Nueva Reserva Legal

**Condición para mostrar**: Solo se muestra si:
- `diferenciaPatrimonioCapitalPagado > 0`
- `utilidadPerdidaEjercicio > 0`
- `utilidadDistribuibleReserva > 0`

---

#### **4. `ValorUtilidadDistribuible.vue`**

**Propósito**: Mostrar y permitir ingresar el monto a distribuir

**Campos**:
- Utilidad Distribuible (calculada)
- Monto Utilidad a Distribuir (input del usuario)
- Utilidad No Distribuida (calculada)

---

#### **5. `ModalRepartoDividendos.vue`**

**Propósito**: Mostrar advertencia si no es posible el reparto

**Cuándo se muestra**:
- Si `patrimonioNeto <= capitalSocialPagado`
- Si hay valores negativos no permitidos
- Si hay errores de validación

**Mensaje**:
> "El reparto de dividendos no puede realizarse porque la cifra del patrimonio neto es igual o inferior al capital social pagado."

---

### **C. Composable: `useDividendDistribution.ts`**

**Ubicación**: `src/wizards/shareholders-meeting/financials/financial-dividends/dividend-distribution/composables/useDividendDistribution.ts`

**Propósito**: Lógica reactiva para manejar el flujo de reparto de dividendos

```typescript
export function useDividendDistribution(options: UseDividendDistributionOptions = {}) {
  const { isPreview = false } = options;
  const isOpenModal = ref(false);
  const storeRepartoDividendos = useRepartoDividendosStore();
  const storeVotacionEFRD = useVotacionStoreEFRD();

  // Setup del servicio
  const { layoutStore, dividendService, setOnClickHandler } = useDividendDistributionSetup({
    isPreview,
  });

  // Handler principal con validación
  const handleNext = async () => {
    const validation = storeRepartoDividendos.validationStatus;

    // Si hay errores, mostrar modal
    if (validation.hasNegative || !validation.isValid) {
      isOpenModal.value = true;
      return;
    }

    try {
      layoutStore.isLoading = true;
      layoutStore.isButtonDisabled = true;
      // Guardar datos (se hace automáticamente en el servicio)
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleConfirm = () => {
    isOpenModal.value = false;
    router.push({ name: NameEstadosFinancieros.RESUMEN_10 });
  };

  const handleCancel = () => {
    isOpenModal.value = false;
  };

  onMounted(() => {
    setOnClickHandler(handleNext);
  });

  return {
    isOpenModal,
    storeRepartoDividendos,
    handleNext,
    handleConfirm,
    handleCancel,
  };
}
```

---

## 6️⃣ <a id="reparto-dividendos-store"></a>REPARTO DE DIVIDENDOS - STORE

### **A. Store: `useRepartoDividendosStore`**

**Ubicación**: `src/store/juntas/estados-financieros-reparto-dividendos/reparto-dividendos.store.ts`

**Estado**:

```typescript
state: (): RepartoDividendosState => ({
  // Valores Preliminares
  capitalSocialPagado: 0,
  utilidadPerdidaAcumulada: 0,
  utilidadPerdidaEjercicio: 0,
  patrimonioNeto: 0,
  
  // Utilidad antes de la reserva legal
  diferenciaPatrimonioCapitalPagado: 0,  // Calculado: patrimonioNeto - capitalSocialPagado
  utilidadDistribuibleReserva: 0,         // Calculado: utilidadPerdidaEjercicio
  
  // Calculo de la reserva legal
  capitalSocialSuscrito: 0,               // Calculado automáticamente desde acciones
  reservaLegalActual: 0,
  porcentageRetraerseReservaLegal: 0,
  montoDestinadoReservaLegal: 0,
  nuevaReservaLegal: 0,
  
  // Valor de la Utilidad Distribuible
  utilidadDistribuible: 0,
  montoUtilidadDistribuir: 0,             // Input del usuario
  utilidadNoDistribuida: 0,                // Calculado: utilidadDistribuible - montoUtilidadDistribuir
  
  faltaReserva: false,
})
```

**Getters**:

```typescript
getters: {
  // Validación general del paso
  validationStatus: (state) => {
    const errors: string[] = [];
    const negatives: string[] = [];

    // Negativos no permitidos
    if (state.capitalSocialSuscrito < 0) negatives.push("capitalSocialSuscrito");
    if (state.capitalSocialPagado < 0) negatives.push("capitalSocialPagado");
    // ... más validaciones ...

    // Reglas básicas
    if (state.capitalSocialSuscrito === 0) {
      errors.push("El capital social suscrito debe ser mayor a 0");
    }
    if (state.diferenciaPatrimonioCapitalPagado <= 0) {
      errors.push("La diferencia patrimonio - capital pagado debe ser positiva");
    }
    if (state.utilidadDistribuibleReserva <= 0) {
      errors.push("La utilidad distribuible antes de reserva debe ser positiva");
    }
    if (state.montoUtilidadDistribuir > state.utilidadDistribuible) {
      errors.push("El monto a distribuir no puede ser mayor que la utilidad distribuible");
    }

    return {
      isValid: errors.length === 0 && negatives.length === 0,
      hasNegative: negatives.length > 0,
      errors,
      negatives,
    };
  },

  // Utilidad distribuible después de reserva (calculada)
  utilidadDistribuibleReservaCalculated: (state) => {
    const value = state.utilidadDistribuibleReserva - 
      (state.faltaReserva ? state.nuevaReservaLegal : 0);
    state.utilidadDistribuibleReserva = value;
    return value;
  },

  // Validación para avanzar (siempre true, la validación real está en validationStatus)
  validateNextPath(): boolean {
    return true;
  },
}
```

**Actions**:

```typescript
actions: {
  // Resetea el estado
  reset() {
    this.capitalSocialPagado = 0;
    this.utilidadPerdidaAcumulada = 0;
    // ... resetear todos los campos ...
  },

  // Actualizar datos desde la sociedad (capital social suscrito)
  updateData() {
    const appStore = useAppStore();
    const societySelectShares = appStore.societySelectShares?.customActions || [];
    const montoSociedad = societySelectShares.reduce((acc, element: any) => {
      const nominal = Number(element?.nominalValue) || 0;
      const subscribed = Number(element?.subscribedAmounts) || Number(element?.sharesQuantity) || 0;
      return acc + nominal * subscribed;
    }, 0);
    this.capitalSocialSuscrito = montoSociedad;
  },

  // Cargar datos desde API
  ApiToStoreRepartoDividendos(data: ApiDistributionDividends) {
    this.capitalSocialPagado = Number(data.paidSocialCapital) || 0;
    this.utilidadPerdidaAcumulada = Number(data.accumulatedProfitLoss) || 0;
    this.utilidadPerdidaEjercicio = Number(data.currentYearProfitLoss) || 0;
    this.patrimonioNeto = Number(data.netEquity) || 0;
    this.diferenciaPatrimonioCapitalPagado = Number(data.equityCapitalDiff) || 0;
    this.capitalSocialSuscrito = Number(data.subscribedSocialCapital) || 0;
    this.porcentageRetraerseReservaLegal = Number(data.legalReservePercentage) || 0;
    this.nuevaReservaLegal = Number(data.newLegalReserve) || 0;
    this.reservaLegalActual = Number(data.currentLegalReserve) || 0;
    this.montoDestinadoReservaLegal = Number(data.allocatedLegalReserve) || 0;
    this.utilidadDistribuible = Number(data.finalDistributableProfit) || 0;
    this.utilidadNoDistribuida = Number(data.undistributedProfit) || 0;
    this.montoUtilidadDistribuir = Number(data.profitToDistribute) || 0;
  },
}
```

**Persistencia**:
```typescript
persist: {
  key: "reparto-dividendos-store",
  storage: localStorage,
}
```

---

## 7️⃣ <a id="reparto-dividendos-fetches"></a>REPARTO DE DIVIDENDOS - FETCHES Y ENDPOINTS

### **A. Endpoints Utilizados**

#### **1. Guardar Reparto de Dividendos**

**Endpoint**: `POST /society-profile/{societyId}/flow/{flowId}/financial-statements/distribution-dividends/`

**Función**: `saveRepartosDividendos`

**Ubicación**: `src/api/flows/EFRD/saveRepartosDividendos.ts`

**Código**:
```typescript
export const saveRepartosDividendos = async (
  flowId: number,
  dataSend: any
) => {
  const { data } = await axios.post(
    `${URL_CAPITAL_INCREASE}/${flowId}/financial-statements/distribution-dividends/`,
    dataSend
  );
  return data;
};
```

**DTO enviado**:
```typescript
interface ApiDistributionDividends {
  paidSocialCapital: number;                    // capitalSocialPagado
  accumulatedProfitLoss: number;                 // utilidadPerdidaAcumulada
  currentYearProfitLoss: number;                 // utilidadPerdidaEjercicio
  netEquity: number;                             // patrimonioNeto
  equityCapitalDiff: number;                     // diferenciaPatrimonioCapitalPagado
  distributableProfitBeforeReserve: number;     // utilidadDistribuibleReserva
  subscribedSocialCapital: number;               // capitalSocialSuscrito
  legalReservePercentage: number;               // porcentageRetraerseReservaLegal
  newLegalReserve: number;                       // nuevaReservaLegal
  currentLegalReserve: number;                   // reservaLegalActual
  allocatedLegalReserve: number;                 // montoDestinadoReservaLegal
  finalDistributableProfit: number;              // utilidadDistribuible
  undistributedProfit: number;                   // utilidadNoDistribuida
  profitToDistribute: number;                    // montoUtilidadDistribuir
}
```

**Cuándo se llama**:
- Al hacer click en "Siguiente" (desde `wizardController()`)
- Se llama desde `CreateEFRDHandler.handle()` al crear el flujo completo

---

#### **2. Obtener Reparto de Dividendos**

**Endpoint**: `GET /society-profile/{societyId}/flow/{flowId}/financial-statements/distribution-dividends/`

**Función**: `getRepartoDividendos`

**Ubicación**: `src/api/flows/EFRD/getRepartoDividendos.ts`

**Código**:
```typescript
export const getRepartoDividendos = async (flowId: number) => {
  const { data } = await axios.get(
    `${URL_CAPITAL_INCREASE}/${flowId}/financial-statements/distribution-dividends/`
  );
  return data;
};
```

**Cuándo se llama**:
- Al cargar la vista en modo edición
- Se llama desde `ApiToStoreEFRD()` cuando se carga un flujo existente

---

### **B. Mapper: Store → API**

**Ubicación**: `src/components/Views/AumentoCapital/Api/StoreToApi/StoreToApiEFRD.ts`

**Método**: `objectRepartosDividendos()`

```typescript
public static objectRepartosDividendos(): ApiDistributionDividends {
  const storeRepartoDividendos = useRepartoDividendosStore();

  return {
    paidSocialCapital: storeRepartoDividendos.capitalSocialPagado,
    accumulatedProfitLoss: storeRepartoDividendos.utilidadPerdidaAcumulada,
    currentYearProfitLoss: storeRepartoDividendos.utilidadPerdidaEjercicio,
    netEquity: storeRepartoDividendos.patrimonioNeto,
    equityCapitalDiff: storeRepartoDividendos.diferenciaPatrimonioCapitalPagado,
    distributableProfitBeforeReserve: storeRepartoDividendos.utilidadDistribuibleReservaCalculated,
    subscribedSocialCapital: storeRepartoDividendos.capitalSocialSuscrito,
    legalReservePercentage: storeRepartoDividendos.porcentageRetraerseReservaLegal,
    newLegalReserve: storeRepartoDividendos.nuevaReservaLegal,
    currentLegalReserve: storeRepartoDividendos.reservaLegalActual,
    allocatedLegalReserve: storeRepartoDividendos.montoDestinadoReservaLegal,
    finalDistributableProfit: storeRepartoDividendos.utilidadDistribuible,
    undistributedProfit: storeRepartoDividendos.utilidadNoDistribuida,
    profitToDistribute: storeRepartoDividendos.montoUtilidadDistribuir,
  };
}
```

---

## 8️⃣ <a id="guardado-repositorio"></a>GUARDADO DE DOCUMENTOS EN REPOSITORIO AI

### **A. Flujo de Guardado**

Cuando se genera el acta final, los documentos se guardan en el repositorio AI usando `useSaveDocumentsByFlow`.

**Ubicación**: `src/composables/connection-probo-ai/useSaveDocumentsByFlow.ts`

**Flujo**:

```typescript
// 1. Obtener folderId del repositorio
const folderId = await handleGetNodeIdByFlow({
  societyId: number,
  folderPath: PathNameEnum.ESTADOS_FINANCIEROS_REPARTO_DIVIDENDOS,
  folderName: FoldersNameEnum.ESTADOS_FINANCIEROS_REPARTO_DIVIDENDOS,
});

// 2. Guardar documentos
await handleSaveToBackend({
  listDocument: documentosGenerados,  // Array de { blob, nameFile }
  folderId: number,
  nameFlowToDocument: string,  // Nombre del documento (ej: "ACTA-EFRD-2024")
});
```

**Función `handleGetNodeIdByFlow`**:

```typescript
const handleGetNodeIdByFlow = async (baseData: IBaseDataToGetNode) => {
  // GET /repository/society/{societyId}/nodes/root
  const folders = await getNodeBySociety(baseData.societyId);

  // Buscar carpeta específica
  const folderId = folders.data.find(
    (folder) =>
      folder.path === baseData.folderPath && 
      folder.name === baseData.folderName
  )?.id || 0;

  return folderId;
};
```

**Función `handleSaveToBackend`**:

```typescript
const handleSaveToBackend = async (baseData: IBaseDataToSaveDocument) => {
  // Convertir blobs a Files
  const files: File[] = baseData.listDocument.map((doc) => {
    const correctMimeType = getCorrectMimeType(doc.value.nameFile, doc.value.blob.type);
    return new File([doc.value.blob], doc.value.nameFile, {
      type: correctMimeType,
    });
  });

  // POST /repository/society/nodes/{folderId}/documents (múltiples archivos)
  await postFilesToNode(files, baseData.folderId.toString(), baseData.nameFlowToDocument);

  toastMessage("success", "Documentos guardados correctamente en el repositorio.");
};
```

**Path y Folder Name para Estados Financieros**:

```typescript
case FlowsByIdEnum.ESTADOS_FINANCIEROS_REPARTO_DIVIDENDOS:
  return {
    pathName: PathNameEnum.ESTADOS_FINANCIEROS_REPARTO_DIVIDENDOS,
    folderName: FoldersNameEnum.ESTADOS_FINANCIEROS_REPARTO_DIVIDENDOS,
  };
```

---

### **B. Endpoints del Repositorio**

#### **1. Obtener Nodos por Sociedad**

**Endpoint**: `GET /repository/society/{societyId}/nodes/root`

**Función**: `getNodeBySociety`

**Propósito**: Obtener todas las carpetas raíz para buscar la carpeta específica

---

#### **2. Subir Múltiples Archivos**

**Endpoint**: `POST /repository/society/nodes/{folderId}/documents`

**Función**: `postFilesToNode`

**FormData**:
```typescript
const formData = new FormData();
files.forEach((file, index) => {
  const fileFieldUUID = window.crypto.randomUUID();
  formData.append(fileFieldUUID, file);
});
```

**Headers**:
```typescript
{
  "x-file-size": file.size.toString(),
  "Content-Type": "multipart/form-data",
  Authorization: `Bearer ${token}`,
}
```

---

## 9️⃣ <a id="flujo-creacion"></a>FLUJO COMPLETO DE CREACIÓN

### **A. Crear Flujo Completo: `CreateEFRDHandler`**

**Ubicación**: `src/components/Views/AumentoCapital/Api/Crud/CreateEFRD.ts`

**Flujo paso a paso**:

```typescript
export class CreateEFRDHandler {
  static async handle(): Promise<{ success: boolean; flowId: number }> {
    // PASO 1: Crear el flujo principal
    const sendTipoJunta = StoreToDataSendEFRD.objectTipoJunta();
    const flowResponse = await postGeneracionConvocatoria(
      sendTipoJunta,
      societySelectData.id
    );
    
    const flowId = flowResponse.data.id;

    // PASO 2: Preparar datos para guardado
    const sendInstalacionJunta = StoreToDataSendEFRD.objectInstalacionJunta();
    const sendPresidenteSecretario = StoreToDataSendEFRD.objectPresidenteSecretario();
    const sendEstadosFinancieros = StoreToDataSendEFRD.objectEstadosFinancieros();
    const sendVotacionesEstadosFinancieros = StoreToDataSendEFRD.objectVotacionEstadosFinancieros();
    const sendRepartoDividendos = StoreToDataSendEFRD.objectRepartosDividendos();
    const sendVotacionesRepartoDividendos = StoreToDataSendEFRD.objectVotacionRepartoDividendos();

    // PASO 3: Ejecutar operaciones en paralelo
    const results = await Promise.allSettled([
      postPoderesAsistencia(sendInstalacionJunta, flowId),
      postNewPresiSecre(sendPresidenteSecretario, flowId),
      saveEstadosFinancieros(flowId, sendEstadosFinancieros),
      saveVotacionEstadosFinancieros(flowId, sendVotacionesEstadosFinancieros),
      saveRepartosDividendos(flowId, sendRepartoDividendos),
      saveVotacionRepartosDividendos(flowId, sendVotacionesRepartoDividendos),
    ]);

    return { success: true, flowId };
  }
}
```

---

### **B. Cargar Flujo Existente: `ApiToStoreEFRD`**

**Ubicación**: `src/components/Views/AumentoCapital/Api/ApiToStore/ApiToStoreEFRD.ts`

**Flujo paso a paso**:

```typescript
export async function ApiToStoreEFRD(flowId: number) {
  const storeEstadosFinancieros = useStoreEstadosFinancieros();
  const storeRepartoDividendos = useRepartoDividendosStore();
  const storeVotaciones = useVotacionStoreEFRD();

  // Obtener todos los datos en paralelo
  const results = await Promise.allSettled([
    getPoderesAsistencia(flowId),
    getNewPresiSecre(flowId),
    getEstadosFinancieros(flowId),
    getVotacionEstadosFinancieros(flowId),
    getRepartoDividendos(flowId),
    getVotacionRepartosDividendos(flowId),
  ]);

  // Actualizar stores
  if (results[2].status === "fulfilled") {
    await storeEstadosFinancieros.ApiToStoreEstadosFinancieros(results[2].value.data);
  }

  if (results[4].status === "fulfilled") {
    storeRepartoDividendos.ApiToStoreRepartoDividendos(results[4].value.data);
  }

  // ... más actualizaciones ...
}
```

---

## ✅ RESUMEN EJECUTIVO

### **Estados Financieros**

✅ **Vista**: `EstadosFinancieros.vue` - Lista de estados financieros con drag & drop  
✅ **Store**: `useStoreEstadosFinancieros` - Lista de estados con archivos  
✅ **Subida de archivos**: `POST /society-profile/{societyId}/flow/{flowId}/financial-statements/files`  
✅ **Guardar metadatos**: `POST /society-profile/{societyId}/flow/{flowId}/financial-statements`  
✅ **Obtener datos**: `GET /society-profile/{societyId}/flow/{flowId}/financial-statements`

### **Reparto de Dividendos**

✅ **Vista**: `RepartoDividendos.vue` - Formulario con 4 secciones  
✅ **Store**: `useRepartoDividendosStore` - Valores financieros y cálculos  
✅ **Guardar datos**: `POST /society-profile/{societyId}/flow/{flowId}/financial-statements/distribution-dividends/`  
✅ **Obtener datos**: `GET /society-profile/{societyId}/flow/{flowId}/financial-statements/distribution-dividends/`

### **Guardado en Repositorio**

✅ **Obtener folderId**: `GET /repository/society/{societyId}/nodes/root`  
✅ **Subir documentos**: `POST /repository/society/nodes/{folderId}/documents` (múltiples archivos)

### **Diferencias para V3**

⚠️ **En V3**:
- Estados Financieros y Reparto de Dividendos serán **2 puntos de agenda separados**
- Se agregará **"Memoria Anual"** como punto adicional
- Se enviarán **varios archivos** (no solo 1) por cada punto de agenda
- La estructura de endpoints puede cambiar, pero el flujo será similar

---

**¡Listo para replicar en V3, mi rey!** 🚀💪

