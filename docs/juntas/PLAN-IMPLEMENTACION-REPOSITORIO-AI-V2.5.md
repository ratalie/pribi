# 🚀 PLAN COMPLETO: Implementación Repositorio AI V2.5

**Fecha**: 9 de Diciembre 2025  
**Versión Backend**: 2.5  
**Arquitectura**: Hexagonal DDD  
**Enfoque**: Módulo por módulo

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Estado Actual](#estado-actual)
3. [Módulo 1: Documentos Generados](#modulo-1-documentos-generados)
4. [Módulo 2: Almacenamiento (Almacen)](#modulo-2-almacenamiento)
5. [Módulo 3: Carpetas Personalizadas](#modulo-3-carpetas-personalizadas)
6. [Checklist General](#checklist-general)

---

## 1️⃣ <a id="resumen-ejecutivo"></a>RESUMEN EJECUTIVO

### **Objetivo**
Implementar todas las funcionalidades del Repositorio AI V2.5 siguiendo arquitectura hexagonal DDD, módulo por módulo, usando endpoints V2 del backend.

### **Estrategia**
1. ✅ **Módulo 1: Documentos Generados** (En progreso - 60% completado)
2. ⏳ **Módulo 2: Almacenamiento** (Pendiente)
3. ⏳ **Módulo 3: Carpetas Personalizadas** (Pendiente)

### **Endpoints V2 Disponibles**
- ✅ Uploads (subir documentos)
- ✅ Nodes (gestión de nodos/carpetas)
- ✅ Juntas (endpoints específicos)
- ✅ Virtual Nodes (carpetas personalizadas)
- ✅ Conversations (chat IA)
- ⚠️ Downloads (pendiente - usar V1 temporalmente)
- ⚠️ Storage Usage (pendiente - usar V1 temporalmente)

---

## 2️⃣ <a id="estado-actual"></a>ESTADO ACTUAL

### **✅ Completado**
1. ✅ Selector de sociedades funcional
2. ✅ Integración con backend V2 para nodos core
3. ✅ Navegación dinámica en Documentos Generados
4. ✅ Visualización de carpetas de juntas
5. ✅ Visualización de carpetas de documentos dentro de juntas
6. ✅ Corrección de rutas dinámicas (`/operaciones/junta-accionistas/carpeta-26`)

### **⏳ Pendiente en Documentos Generados**
1. ⏳ Descargar documentos individuales
2. ⏳ Previsualizar documentos
3. ⏳ Eliminar documentos
4. ⏳ Descargar carpeta ZIP
5. ⏳ Ver versiones de documentos
6. ⏳ Subir nueva versión
7. ⏳ Restaurar versión

---

## 3️⃣ <a id="modulo-1-documentos-generados"></a>MÓDULO 1: DOCUMENTOS GENERADOS

### **FASE 1.1: Descargar Documentos** (2-3 horas)

#### **1.1.1 Use Case**
```typescript
// app/core/hexag/repositorio/application/use-cases/descargar-documento.use-case.ts
export class DescargarDocumentoUseCase {
  constructor(
    private readonly documentoRepository: DocumentoRepository
  ) {}

  async execute(versionCode: string, fileName: string): Promise<void> {
    const blob = await this.documentoRepository.descargarVersion(versionCode);
    
    // Crear URL temporal y descargar
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
```

#### **1.1.2 Repository**
```typescript
// app/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository.ts
async descargarVersion(versionCode: string): Promise<Blob> {
  const baseUrl = this.resolveBaseUrl();
  const url = `${baseUrl}/api/v2/repository/documents/versions/${versionCode}/download`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${this.getToken()}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error al descargar: ${response.statusText}`);
  }
  
  return await response.blob();
}
```

#### **1.1.3 Composable**
```typescript
// app/core/presentation/repositorio/composables/useDescargarDocumento.ts
export function useDescargarDocumento() {
  const repository = new RepositorioDocumentosHttpRepository();
  const useCase = new DescargarDocumentoUseCase(repository);
  
  const descargar = async (versionCode: string, fileName: string) => {
    try {
      await useCase.execute(versionCode, fileName);
      toast.success("Documento descargado correctamente");
    } catch (error) {
      toast.error("Error al descargar documento");
      throw error;
    }
  };
  
  return { descargar };
}
```

#### **1.1.4 Integración en Vista**
```vue
<!-- app/components/repository/DocumentosGeneradosView.vue -->
<script setup lang="ts">
const { descargar } = useDescargarDocumento();

const handleDownload = async (file: any) => {
  if (file.versionCode) {
    await descargar(file.versionCode, file.nombre);
  }
};
</script>
```

---

### **FASE 1.2: Previsualizar Documentos** (4-5 horas)

#### **1.2.1 Use Case**
```typescript
// app/core/hexag/repositorio/application/use-cases/previsualizar-documento.use-case.ts
export class PrevisualizarDocumentoUseCase {
  constructor(
    private readonly documentoRepository: DocumentoRepository,
    private readonly previewService: PreviewService
  ) {}

  async execute(versionCode: string): Promise<string | null> {
    // 1. Descargar documento
    const blob = await this.documentoRepository.descargarVersion(versionCode);
    const file = new File([blob], "documento", { type: blob.type });
    
    // 2. Generar preview según tipo
    return await this.previewService.generatePreview(file);
  }
}
```

#### **1.2.2 Preview Service**
```typescript
// app/core/hexag/repositorio/infrastructure/services/preview.service.ts
export class PreviewService {
  async generatePreview(file: File): Promise<string | null> {
    const mimeType = file.type;
    
    // PDF
    if (mimeType === "application/pdf") {
      return await this.generatePdfPreview(file);
    }
    
    // Word
    if (mimeType.includes("wordprocessingml")) {
      return await this.generateWordPreview(file);
    }
    
    // Excel
    if (mimeType.includes("spreadsheetml")) {
      return await this.generateExcelPreview(file);
    }
    
    return null;
  }
  
  private async generatePdfPreview(file: File): Promise<string> {
    // Usar pdfjs-dist
    const pdfjsLib = await import("pdfjs-dist");
    // ... implementación
  }
  
  private async generateWordPreview(file: File): Promise<string> {
    // Usar mammoth + html2canvas
    const mammoth = await import("mammoth");
    const html2canvas = await import("html2canvas");
    // ... implementación
  }
}
```

#### **1.2.3 Modal de Preview**
```vue
<!-- app/components/repository/DocumentPreviewModal.vue -->
<template>
  <Modal v-model:open="isOpen">
    <DocumentViewer :preview-url="previewUrl" />
  </Modal>
</template>
```

---

### **FASE 1.3: Eliminar Documentos** (2 horas)

#### **1.3.1 Use Case**
```typescript
// app/core/hexag/repositorio/application/use-cases/eliminar-documento.use-case.ts
export class EliminarDocumentoUseCase {
  constructor(
    private readonly documentoRepository: DocumentoRepository
  ) {}

  async execute(nodeId: number): Promise<void> {
    await this.documentoRepository.eliminarNodo(nodeId);
  }
}
```

#### **1.3.2 Repository**
```typescript
async eliminarNodo(nodeId: number): Promise<void> {
  const baseUrl = this.resolveBaseUrl();
  const url = `${baseUrl}/api/v2/repository/nodes/${nodeId}`;
  
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${this.getToken()}`,
    },
  });
  
  if (response.status !== 204) {
    throw new Error("Error al eliminar documento");
  }
}
```

---

### **FASE 1.4: Descargar Carpeta ZIP** (2 horas)

#### **1.4.1 Use Case**
```typescript
// app/core/hexag/repositorio/application/use-cases/descargar-carpeta-zip.use-case.ts
export class DescargarCarpetaZipUseCase {
  constructor(
    private readonly documentoRepository: DocumentoRepository
  ) {}

  async execute(nodeId: number, folderName: string): Promise<void> {
    const blob = await this.documentoRepository.descargarCarpetaZip(nodeId);
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${folderName}.zip`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
```

#### **1.4.2 Repository**
```typescript
async descargarCarpetaZip(nodeId: number): Promise<Blob> {
  const baseUrl = this.resolveBaseUrl();
  const url = `${baseUrl}/api/v2/repository/nodes/${nodeId}/download-zip`;
  
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${this.getToken()}`,
    },
  });
  
  return await response.blob();
}
```

---

### **FASE 1.5: Versiones de Documentos** (3-4 horas)

#### **1.5.1 Use Case**
```typescript
// app/core/hexag/repositorio/application/use-cases/obtener-versiones-documento.use-case.ts
export class ObtenerVersionesDocumentoUseCase {
  constructor(
    private readonly documentoRepository: DocumentoRepository
  ) {}

  async execute(nodeId: number): Promise<VersionDocumento[]> {
    const nodo = await this.documentoRepository.obtenerNodoPorId(nodeId);
    
    if (nodo.type !== "document") {
      throw new Error("El nodo no es un documento");
    }
    
    return nodo.versions || [];
  }
}
```

#### **1.5.2 Subir Nueva Versión**
```typescript
// app/core/hexag/repositorio/application/use-cases/subir-version.use-case.ts
export class SubirVersionUseCase {
  constructor(
    private readonly documentoRepository: DocumentoRepository
  ) {}

  async execute(documentCode: string, file: File): Promise<VersionDocumento> {
    return await this.documentoRepository.subirVersion(documentCode, file);
  }
}
```

#### **1.5.3 Restaurar Versión**
```typescript
// app/core/hexag/repositorio/application/use-cases/restaurar-version.use-case.ts
export class RestaurarVersionUseCase {
  constructor(
    private readonly documentoRepository: DocumentoRepository
  ) {}

  async execute(documentCode: string, versionCode: string): Promise<void> {
    // ⚠️ PENDIENTE: Endpoint V2 no existe, usar V1 temporalmente
    await this.documentoRepository.restaurarVersion(documentCode, versionCode);
  }
}
```

---

## 4️⃣ <a id="modulo-2-almacenamiento"></a>MÓDULO 2: ALMACENAMIENTO (ALMACEN)

### **FASE 2.1: Estructura Base** (2 horas)

#### **2.1.1 Entidad**
```typescript
// app/core/hexag/repositorio/domain/entities/almacenamiento.entity.ts
export interface Almacenamiento {
  structureId: string;
  limitInBytes: number;
  currentUsedInBytes: number;
  percentageUsed: number;
  summaries: AlmacenamientoSummary[];
}

export interface AlmacenamientoSummary {
  mimeType: string;
  currentSizeInBytes: number;
  currentCount: number;
  percentage: number;
}
```

#### **2.1.2 DTO**
```typescript
// app/core/hexag/repositorio/application/dtos/almacenamiento.dto.ts
export interface AlmacenamientoDTO {
  societyId: number;
  limitInBytes: number;
  currentUsedInBytes: number;
  summaries: AlmacenamientoSummaryDTO[];
}

export interface AlmacenamientoSummaryDTO {
  mimeType: string;
  currentSizeInBytes: number;
  currentCount: number;
}
```

#### **2.1.3 Port**
```typescript
// app/core/hexag/repositorio/domain/ports/almacenamiento.repository.ts
export interface AlmacenamientoRepository {
  obtenerUsoAlmacenamiento(structureId: string): Promise<Almacenamiento>;
}
```

---

### **FASE 2.2: Repository HTTP** (2 horas)

#### **2.2.1 Implementación**
```typescript
// app/core/hexag/repositorio/infrastructure/repositories/almacenamiento-http.repository.ts
export class AlmacenamientoHttpRepository implements AlmacenamientoRepository {
  async obtenerUsoAlmacenamiento(structureId: string): Promise<Almacenamiento> {
    // ⚠️ PENDIENTE: Endpoint V2 no existe, usar V1 temporalmente
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v1/repository/society/${structureId}/documents/storage-usage`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
    
    const data: AlmacenamientoDTO = await response.json();
    return AlmacenamientoMapper.toEntity(data);
  }
}
```

---

### **FASE 2.3: Use Case** (1 hora)

#### **2.3.1 Implementación**
```typescript
// app/core/hexag/repositorio/application/use-cases/obtener-uso-almacenamiento.use-case.ts
export class ObtenerUsoAlmacenamientoUseCase {
  constructor(
    private readonly almacenamientoRepository: AlmacenamientoRepository
  ) {}

  async execute(structureId: string): Promise<Almacenamiento> {
    return await this.almacenamientoRepository.obtenerUsoAlmacenamiento(structureId);
  }
}
```

---

### **FASE 2.4: Store y Composable** (2 horas)

#### **2.4.1 Store**
```typescript
// app/core/presentation/repositorio/stores/almacenamiento.store.ts
export const useAlmacenamientoStore = defineStore("almacenamiento", {
  state: () => ({
    almacenamiento: null as Almacenamiento | null,
    loading: false,
    error: null as string | null,
  }),
  
  actions: {
    async cargarUsoAlmacenamiento(structureId: string) {
      this.loading = true;
      this.error = null;
      
      try {
        const repository = new AlmacenamientoHttpRepository();
        const useCase = new ObtenerUsoAlmacenamientoUseCase(repository);
        this.almacenamiento = await useCase.execute(structureId);
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
```

#### **2.4.2 Composable**
```typescript
// app/core/presentation/repositorio/composables/useAlmacenamiento.ts
export function useAlmacenamiento() {
  const store = useAlmacenamientoStore();
  const dashboardStore = useRepositorioDashboardStore();
  const { sociedadSeleccionada } = storeToRefs(dashboardStore);
  
  watch(
    () => sociedadSeleccionada.value?.id,
    async (structureId) => {
      if (structureId) {
        await store.cargarUsoAlmacenamiento(structureId);
      }
    },
    { immediate: true }
  );
  
  return {
    almacenamiento: computed(() => store.almacenamiento),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
  };
}
```

---

### **FASE 2.5: Vista** (3-4 horas)

#### **2.5.1 Componente**
```vue
<!-- app/pages/storage/almacen.vue -->
<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <SocietySelector />
      
      <div v-if="loading">Cargando...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else-if="almacenamiento">
        <!-- Gráfico de uso -->
        <StorageChart :data="almacenamiento" />
        
        <!-- Desglose por tipo -->
        <StorageBreakdown :summaries="almacenamiento.summaries" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAlmacenamiento } from "~/core/presentation/repositorio/composables/useAlmacenamiento";

const { almacenamiento, loading, error } = useAlmacenamiento();
</script>
```

---

## 5️⃣ <a id="modulo-3-carpetas-personalizadas"></a>MÓDULO 3: CARPETAS PERSONALIZADAS

### **FASE 3.1: Estructura Base** (3 horas)

#### **3.1.1 Entidades**
```typescript
// app/core/hexag/repositorio/domain/entities/carpeta-personalizada.entity.ts
export interface CarpetaPersonalizada {
  id: number;
  name: string;
  description: string | null;
  isChatIA: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  owner: Usuario;
  children: (CarpetaPersonalizada | DocumentoEnlazado)[];
  permissions: Permiso[];
}

export interface DocumentoEnlazado {
  id: number;
  documentNodeId: number;
  description: string | null;
  linkedAt: string;
  document: RepositorioNode;
}

export interface Permiso {
  id: number;
  userId: number;
  user: Usuario;
  expireAt: string | null;
  createdAt: string;
}
```

#### **3.1.2 Ports**
```typescript
// app/core/hexag/repositorio/domain/ports/carpeta-personalizada.repository.ts
export interface CarpetaPersonalizadaRepository {
  obtenerCarpetasRaiz(structureId: string): Promise<CarpetaPersonalizada[]>;
  obtenerCarpetaPorId(virtualNodeId: number): Promise<CarpetaPersonalizada>;
  crearCarpeta(structureId: string, data: CrearCarpetaDTO): Promise<CarpetaPersonalizada>;
  actualizarCarpeta(virtualNodeId: number, data: ActualizarCarpetaDTO): Promise<CarpetaPersonalizada>;
  eliminarCarpeta(virtualNodeId: number): Promise<void>;
  linkearDocumento(virtualNodeId: number, documentNodeId: number): Promise<void>;
  deslinkearDocumento(virtualNodeId: number, documentNodeId: number): Promise<void>;
  crearPermiso(virtualNodeId: number, userId: number, expireAt?: string): Promise<Permiso>;
  eliminarPermiso(virtualNodeId: number, userId: number): Promise<void>;
  obtenerPermisos(virtualNodeId: number): Promise<Permiso[]>;
}
```

---

### **FASE 3.2: Repository HTTP** (4-5 horas)

#### **3.2.1 Implementación**
```typescript
// app/core/hexag/repositorio/infrastructure/repositories/carpeta-personalizada-http.repository.ts
export class CarpetaPersonalizadaHttpRepository implements CarpetaPersonalizadaRepository {
  async obtenerCarpetasRaiz(structureId: string): Promise<CarpetaPersonalizada[]> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/virtual-nodes`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
    
    const data: CarpetaPersonalizadaDTO[] = await response.json();
    return data.map(CarpetaPersonalizadaMapper.toEntity);
  }
  
  async crearCarpeta(structureId: string, data: CrearCarpetaDTO): Promise<CarpetaPersonalizada> {
    const baseUrl = this.resolveBaseUrl();
    const url = `${baseUrl}/api/v2/repository/society-profile/${structureId}/virtual-nodes`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    const dto: CarpetaPersonalizadaDTO = await response.json();
    return CarpetaPersonalizadaMapper.toEntity(dto);
  }
  
  // ... más métodos
}
```

---

### **FASE 3.3: Use Cases** (5-6 horas)

#### **3.3.1 Crear Carpeta**
```typescript
// app/core/hexag/repositorio/application/use-cases/crear-carpeta-personalizada.use-case.ts
export class CrearCarpetaPersonalizadaUseCase {
  constructor(
    private readonly carpetaRepository: CarpetaPersonalizadaRepository
  ) {}

  async execute(structureId: string, data: CrearCarpetaDTO): Promise<CarpetaPersonalizada> {
    return await this.carpetaRepository.crearCarpeta(structureId, data);
  }
}
```

#### **3.3.2 Linkear Documento**
```typescript
// app/core/hexag/repositorio/application/use-cases/linkear-documento.use-case.ts
export class LinkearDocumentoUseCase {
  constructor(
    private readonly carpetaRepository: CarpetaPersonalizadaRepository
  ) {}

  async execute(virtualNodeId: number, documentNodeId: number): Promise<void> {
    await this.carpetaRepository.linkearDocumento(virtualNodeId, documentNodeId);
  }
}
```

---

### **FASE 3.4: Store y Composable** (3 horas)

#### **3.4.1 Store**
```typescript
// app/core/presentation/repositorio/stores/carpetas-personalizadas.store.ts
export const useCarpetasPersonalizadasStore = defineStore("carpetas-personalizadas", {
  state: () => ({
    carpetas: [] as CarpetaPersonalizada[],
    carpetaActual: null as CarpetaPersonalizada | null,
    loading: false,
    error: null as string | null,
  }),
  
  actions: {
    async cargarCarpetasRaiz(structureId: string) {
      // ... implementación
    },
    
    async crearCarpeta(structureId: string, data: CrearCarpetaDTO) {
      // ... implementación
    },
  },
});
```

---

### **FASE 3.5: Vistas** (6-8 horas)

#### **3.5.1 Lista de Carpetas**
```vue
<!-- app/pages/storage/carpetas-personalizadas.vue -->
<template>
  <div class="h-full overflow-y-auto">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <SocietySelector />
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <CarpetaCard
          v-for="carpeta in carpetas"
          :key="carpeta.id"
          :carpeta="carpeta"
          @click="navigateToCarpeta(carpeta.id)"
        />
      </div>
      
      <Button @click="showCreateModal = true">Crear Carpeta</Button>
    </div>
  </div>
</template>
```

#### **3.5.2 Detalle de Carpeta**
```vue
<!-- app/pages/storage/carpetas-personalizadas/[id].vue -->
<template>
  <div>
    <CarpetaHeader :carpeta="carpeta" />
    
    <Tabs>
      <Tab label="Documentos">
        <DocumentosEnlazadosList :documentos="carpeta.children" />
      </Tab>
      <Tab label="Chat IA" v-if="carpeta.isChatIA">
        <ChatIA :carpeta-id="carpeta.id" />
      </Tab>
      <Tab label="Permisos">
        <PermisosList :permisos="carpeta.permissions" />
      </Tab>
    </Tabs>
  </div>
</template>
```

---

## 6️⃣ <a id="checklist-general"></a>CHECKLIST GENERAL

### **Módulo 1: Documentos Generados**
- [ ] Fase 1.1: Descargar documentos
- [ ] Fase 1.2: Previsualizar documentos
- [ ] Fase 1.3: Eliminar documentos
- [ ] Fase 1.4: Descargar carpeta ZIP
- [ ] Fase 1.5: Versiones de documentos
  - [ ] Ver versiones
  - [ ] Subir nueva versión
  - [ ] Restaurar versión

### **Módulo 2: Almacenamiento**
- [ ] Fase 2.1: Estructura base
- [ ] Fase 2.2: Repository HTTP
- [ ] Fase 2.3: Use Case
- [ ] Fase 2.4: Store y Composable
- [ ] Fase 2.5: Vista con gráficos

### **Módulo 3: Carpetas Personalizadas**
- [ ] Fase 3.1: Estructura base
- [ ] Fase 3.2: Repository HTTP
- [ ] Fase 3.3: Use Cases
- [ ] Fase 3.4: Store y Composable
- [ ] Fase 3.5: Vistas
  - [ ] Lista de carpetas
  - [ ] Detalle de carpeta
  - [ ] Chat IA
  - [ ] Permisos

---

## 📝 NOTAS IMPORTANTES

1. **Endpoints Pendientes**:
   - ⚠️ `GET /api/v2/repository/society-profile/{structureId}/storage-usage` (usar V1 temporalmente)
   - ⚠️ `POST /api/v2/repository/documents/{documentCode}/versions/{versionCode}/restore` (usar V1 temporalmente)

2. **Arquitectura**:
   - ✅ Siempre seguir: Domain → Application → Infrastructure → Presentation
   - ✅ Usar Option API en stores de Pinia
   - ✅ Mappers en Infrastructure (DTO ↔ Entidad)

3. **Testing**:
   - Probar cada fase antes de continuar
   - Verificar integración con backend
   - Validar manejo de errores

---

**¡Listo para implementar, mi rey!** 🚀💪

