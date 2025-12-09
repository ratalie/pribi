# 📋 PLAN DE ACCIÓN: VISTA DOCUMENTOS GENERADOS EN REPOSITORIO

**Fecha**: 9 de Diciembre 2025  
**Estado**: 📋 PLAN DE IMPLEMENTACIÓN  
**Objetivo**: Mostrar los documentos generados de juntas en la vista del repositorio, similar a V2.5

---

## 🎯 OBJETIVO

Implementar la funcionalidad para que el usuario pueda:
1. **Seleccionar una sociedad** en el repositorio
2. **Ver los documentos generados** de las juntas de esa sociedad
3. **Navegar por las carpetas** de juntas (una carpeta por junta)
4. **Ver los documentos** dentro de cada carpeta de junta

---

## 🔍 ANÁLISIS V2.5

### **Cómo Funciona V2.5**

**1. Obtener Nodos del Repositorio**:
```typescript
// V2.5: Obtener todos los nodos de la sociedad
GET /repository/society/{societyId}/nodes/core

// Respuesta:
{
  "data": [
    {
      "id": 26,
      "name": "juntas",
      "path": "/core/juntas/",
      "type": 1, // 1 = folder
      "children": [...]
    },
    {
      "id": 29,
      "name": "documentos juntas: 8 de diciembre de 2025-2025-12-09T04-33-20",
      "path": "/core/juntas/1/",
      "type": 1, // 1 = folder
      "parentId": 26,
      "children": [
        {
          "id": 30,
          "name": "certificado-aporte-00000010.docx",
          "path": "/core/juntas/1/certificado-aporte-00000010.docx",
          "type": 2, // 2 = file
          "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "sizeInBytes": 73728
        }
      ]
    }
  ]
}
```

**2. Filtrar por Path**:
```typescript
// V2.5: Filtrar documentos que empiezan con "/core/juntas/"
const documentosJuntas = folders.data.filter(
  (node) => node.path.startsWith("/core/juntas/")
);
```

**3. Mostrar en Vista Jerárquica**:
- Nivel 1: Categorías (Registros, Operaciones)
- Nivel 2: Carpetas principales (juntas, aumento capital, etc.)
- Nivel 3: Carpetas de juntas individuales
- Nivel 4: Documentos dentro de cada carpeta

---

## 🔄 DIFERENCIAS V2.5 → V3

### **Estructura de Carpetas**

**V2.5**:
```
/core/juntas/aumento capital/aporte dinerario/
/core/juntas/aumento capital/capitalizacion de creditos/
/core/juntas/designacion remocion/directores/
```

**V3**:
```
/core/juntas/{flowId}/
/core/juntas/1/  → "Documentos Juntas: 8 de diciembre de 2025"
/core/juntas/2/  → "Documentos Juntas: 15 de diciembre de 2025"
```

### **Endpoints**

**V2.5**:
```http
GET /repository/society/{societyId}/nodes/core
```

**V3**:
```http
GET /api/v2/repository/society-profile/:structureId/nodes/core
```

**⚠️ IMPORTANTE**: Necesitamos verificar si este endpoint existe en V2 o si debemos usar otro.

---

## 📋 PLAN DE IMPLEMENTACIÓN

### **Fase 1: Obtener Documentos del Repositorio**

#### **1.1. Verificar Endpoint Disponible**

**Opción A: Endpoint V2 Existente**
```typescript
GET /api/v2/repository/society-profile/:structureId/nodes/core
```

**Opción B: Endpoint Alternativo**
```typescript
GET /api/v2/repositorio/:sociedadId/documentos-generados
```

**Tarea**: Verificar en la documentación del backend cuál endpoint usar.

#### **1.2. Crear/Actualizar Repository**

**Archivo**: `app/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository.ts`

**Agregar método**:
```typescript
async obtenerNodosPorSociedad(structureId: string): Promise<RepositorioNode[]> {
  const baseUrl = this.resolveBaseUrl();
  const url = `${baseUrl}${this.basePathV2}/${structureId}/nodes/core`;

  const response = await $fetch<{
    success: boolean;
    data: RepositorioNodeDTO[];
  }>(url, {
    ...withAuthHeaders(),
    method: "GET" as const,
  });

  return response.data.map(RepositorioNodeMapper.toEntity);
}
```

#### **1.3. Crear Use Case**

**Archivo**: `app/core/hexag/repositorio/application/use-cases/obtener-documentos-junta.use-case.ts`

```typescript
export class ObtenerDocumentosJuntaUseCase {
  constructor(
    private readonly repositorioDocumentosRepository: RepositorioDocumentosRepository
  ) {}

  async execute(structureId: string, flowId?: string): Promise<RepositorioNode[]> {
    // 1. Obtener todos los nodos de la sociedad
    const nodos = await this.repositorioDocumentosRepository.obtenerNodosPorSociedad(
      structureId
    );

    // 2. Filtrar por path "/core/juntas/"
    const nodosJuntas = nodos.filter((node) => 
      node.path.startsWith("/core/juntas/")
    );

    // 3. Si se especifica flowId, filtrar por ese flowId
    if (flowId) {
      return nodosJuntas.filter((node) => 
        node.path === `/core/juntas/${flowId}/` || 
        node.path.startsWith(`/core/juntas/${flowId}/`)
      );
    }

    return nodosJuntas;
  }
}
```

---

### **Fase 2: Crear Entidades y DTOs**

#### **2.1. Crear Entidad RepositorioNode**

**Archivo**: `app/core/hexag/repositorio/domain/entities/repositorio-node.entity.ts`

```typescript
export interface RepositorioNode {
  id: number;
  code: string;
  societyId: number;
  parentId: number | null;
  name: string;
  type: 1 | 2; // 1 = folder, 2 = file
  path: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  isCore: boolean;
  children?: RepositorioNode[];
  
  // Para archivos
  mimeType?: string;
  sizeInBytes?: number;
  versionCode?: string;
  documentCode?: string;
}
```

#### **2.2. Crear DTO**

**Archivo**: `app/core/hexag/repositorio/application/dtos/repositorio-node.dto.ts`

```typescript
export interface RepositorioNodeDTO {
  id: number;
  code: string;
  societyId: number;
  parentId: number | null;
  name: string;
  type: 1 | 2;
  path: string;
  description: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  isCore: boolean;
  children?: RepositorioNodeDTO[];
  
  // Para archivos
  mimeType?: string;
  sizeInBytes?: number;
  versionCode?: string;
  documentCode?: string;
}
```

#### **2.3. Crear Mapper**

**Archivo**: `app/core/hexag/repositorio/infrastructure/mappers/repositorio-node.mapper.ts`

```typescript
import type { RepositorioNode } from "../../domain/entities/repositorio-node.entity";
import type { RepositorioNodeDTO } from "../../application/dtos/repositorio-node.dto";

export class RepositorioNodeMapper {
  static toEntity(dto: RepositorioNodeDTO): RepositorioNode {
    return {
      id: dto.id,
      code: dto.code,
      societyId: dto.societyId,
      parentId: dto.parentId,
      name: dto.name,
      type: dto.type,
      path: dto.path,
      description: dto.description,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
      isCore: dto.isCore,
      children: dto.children?.map(RepositorioNodeMapper.toEntity),
      mimeType: dto.mimeType,
      sizeInBytes: dto.sizeInBytes,
      versionCode: dto.versionCode,
      documentCode: dto.documentCode,
    };
  }
}
```

---

### **Fase 3: Actualizar Port y Repository**

#### **3.1. Actualizar Port**

**Archivo**: `app/core/hexag/repositorio/domain/ports/repositorio-documentos.repository.ts`

```typescript
import type { RepositorioNode } from "../entities/repositorio-node.entity";

export interface RepositorioDocumentosRepository {
  obtenerFolderIdJunta(structureId: string, flowId: string): Promise<number>;
  enviarDocumentos(
    structureId: string,
    folderId: number,
    documentos: Documento[],
    nombreCarpeta: string
  ): Promise<void>;
  
  // NUEVO MÉTODO
  obtenerNodosPorSociedad(structureId: string): Promise<RepositorioNode[]>;
}
```

#### **3.2. Implementar en Repository HTTP**

**Archivo**: `app/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository.ts`

```typescript
async obtenerNodosPorSociedad(structureId: string): Promise<RepositorioNode[]> {
  const baseUrl = this.resolveBaseUrl();
  const url = `${baseUrl}${this.basePathV2}/${structureId}/nodes/core`;

  console.log("🔵 [RepositorioDocumentosHttp] ========================================");
  console.log("🔵 [RepositorioDocumentosHttp] OBTENER NODOS POR SOCIEDAD");
  console.log("🔵 [RepositorioDocumentosHttp] ========================================");
  console.log("🔵 [RepositorioDocumentosHttp] URL:", url);
  console.log("🔵 [RepositorioDocumentosHttp] structureId:", structureId);

  try {
    const response = await $fetch<{
      success: boolean;
      data: RepositorioNodeDTO[];
    }>(url, {
      ...withAuthHeaders(),
      method: "GET" as const,
    });

    console.log("🔵 [RepositorioDocumentosHttp] Nodos obtenidos:", response.data.length);

    return response.data.map(RepositorioNodeMapper.toEntity);
  } catch (error: any) {
    console.error("🔴 [RepositorioDocumentosHttp] ERROR:", error);
    throw new Error(
      `No se pudieron obtener los nodos: ${error?.message || "Error desconocido"}`
    );
  }
}
```

---

### **Fase 4: Crear Composable y Store**

#### **4.1. Crear Store**

**Archivo**: `app/core/presentation/repositorio/stores/documentos-juntas.store.ts`

```typescript
import { defineStore } from "pinia";
import type { RepositorioNode } from "~/core/hexag/repositorio/domain/entities/repositorio-node.entity";

export const useDocumentosJuntasStore = defineStore("documentosJuntas", {
  state: () => ({
    nodos: [] as RepositorioNode[],
    isLoading: false,
    hasError: false,
    errorMessage: null as string | null,
  }),

  getters: {
    carpetasJuntas: (state) => {
      // Filtrar solo carpetas (type === 1) que están en /core/juntas/
      return state.nodos.filter(
        (node) => node.type === 1 && node.path.startsWith("/core/juntas/")
      );
    },

    documentosPorCarpeta: (state) => (carpetaId: number) => {
      // Obtener documentos (type === 2) que pertenecen a una carpeta
      return state.nodos.filter(
        (node) => node.type === 2 && node.parentId === carpetaId
      );
    },
  },

  actions: {
    async cargarNodos(structureId: string) {
      this.isLoading = true;
      this.hasError = false;
      this.errorMessage = null;

      try {
        const repository = new RepositorioDocumentosHttpRepository();
        const useCase = new ObtenerDocumentosJuntaUseCase(repository);
        this.nodos = await useCase.execute(structureId);
      } catch (error: any) {
        this.hasError = true;
        this.errorMessage = error?.message || "Error al cargar nodos";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    limpiar() {
      this.nodos = [];
      this.hasError = false;
      this.errorMessage = null;
    },
  },
});
```

#### **4.2. Crear Composable**

**Archivo**: `app/composables/useDocumentosJuntasRepositorio.ts`

```typescript
import { computed, onMounted, watch } from "vue";
import { useDocumentosJuntasStore } from "~/core/presentation/repositorio/stores/documentos-juntas.store";
import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";

export function useDocumentosJuntasRepositorio() {
  const store = useDocumentosJuntasStore();
  const dashboardStore = useRepositorioDashboardStore();

  const sociedadId = computed(() => dashboardStore.sociedadSeleccionada?.id);

  // Cargar nodos cuando cambie la sociedad
  watch(
    () => sociedadId.value,
    async (id) => {
      if (id) {
        await store.cargarNodos(id.toString());
      } else {
        store.limpiar();
      }
    },
    { immediate: true }
  );

  return {
    nodos: computed(() => store.nodos),
    carpetasJuntas: computed(() => store.carpetasJuntas),
    documentosPorCarpeta: (carpetaId: number) => store.documentosPorCarpeta(carpetaId),
    isLoading: computed(() => store.isLoading),
    hasError: computed(() => store.hasError),
    errorMessage: computed(() => store.errorMessage),
    cargarNodos: (structureId: string) => store.cargarNodos(structureId),
  };
}
```

---

### **Fase 5: Actualizar Componente de Vista**

#### **5.1. Actualizar DocumentosGeneradosView.vue**

**Archivo**: `app/components/repository/DocumentosGeneradosView.vue`

**Cambios**:
1. Usar `useDocumentosJuntasRepositorio` en lugar de `useDocumentosGenerados`
2. Mostrar carpetas de juntas en lugar de estructura jerárquica fija
3. Permitir navegación por carpetas de juntas

**Ejemplo de estructura**:
```vue
<script setup lang="ts">
import { useDocumentosJuntasRepositorio } from "~/composables/useDocumentosJuntasRepositorio";

const {
  carpetasJuntas,
  documentosPorCarpeta,
  isLoading,
} = useDocumentosJuntasRepositorio();

const carpetaSeleccionada = ref<number | null>(null);
const documentosActuales = computed(() => {
  if (!carpetaSeleccionada.value) return [];
  return documentosPorCarpeta(carpetaSeleccionada.value);
});
</script>

<template>
  <!-- Lista de carpetas de juntas -->
  <div v-if="!carpetaSeleccionada">
    <div
      v-for="carpeta in carpetasJuntas"
      :key="carpeta.id"
      @click="carpetaSeleccionada = carpeta.id"
    >
      {{ carpeta.name }}
    </div>
  </div>

  <!-- Documentos dentro de la carpeta seleccionada -->
  <div v-else>
    <button @click="carpetaSeleccionada = null">← Volver</button>
    <div
      v-for="doc in documentosActuales"
      :key="doc.id"
    >
      {{ doc.name }}
    </div>
  </div>
</template>
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Obtener Documentos**
- [ ] Verificar endpoint disponible en backend
- [ ] Crear entidad `RepositorioNode`
- [ ] Crear DTO `RepositorioNodeDTO`
- [ ] Crear mapper `RepositorioNodeMapper`
- [ ] Agregar método `obtenerNodosPorSociedad` al port
- [ ] Implementar método en repository HTTP
- [ ] Crear use case `ObtenerDocumentosJuntaUseCase`

### **Fase 2: Store y Composable**
- [ ] Crear store `documentos-juntas.store.ts`
- [ ] Crear composable `useDocumentosJuntasRepositorio.ts`
- [ ] Probar carga de nodos

### **Fase 3: Vista**
- [ ] Actualizar `DocumentosGeneradosView.vue`
- [ ] Mostrar carpetas de juntas
- [ ] Permitir navegación por carpetas
- [ ] Mostrar documentos dentro de cada carpeta

### **Fase 4: Testing**
- [ ] Probar con sociedad que tiene juntas
- [ ] Probar navegación por carpetas
- [ ] Probar visualización de documentos
- [ ] Probar con sociedad sin juntas

---

## 🚀 PRÓXIMOS PASOS

1. **Verificar Endpoint**: Confirmar qué endpoint usar para obtener nodos
2. **Implementar Fase 1**: Crear entidades, DTOs, mappers y repository
3. **Implementar Fase 2**: Crear store y composable
4. **Implementar Fase 3**: Actualizar vista
5. **Testing**: Probar toda la funcionalidad

---

**¡Listo para implementar, mi rey!** 🚀💪



