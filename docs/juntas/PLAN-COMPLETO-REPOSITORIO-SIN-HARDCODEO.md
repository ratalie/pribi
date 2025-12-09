# 🚀 PLAN COMPLETO: REPOSITORIO SIN HARDCODEO - DATOS REALES

**Fecha**: 9 de Diciembre 2025  
**Estado**: 📋 PLAN DE IMPLEMENTACIÓN COMPLETO  
**Objetivo**: Eliminar todo el hardcodeo del repositorio y conectar con datos reales del backend

---

## 🎯 OBJETIVO PRINCIPAL

Transformar el repositorio de datos hardcodeados a datos reales del backend, permitiendo:
1. ✅ Selector de sociedades funcional (reutilizar de juntas)
2. ✅ Selector visible en todas las páginas del repositorio
3. ✅ Fetch automático cuando cambia la sociedad
4. ✅ Vista de documentos generados con datos reales
5. ✅ Navegación a carpetas de juntas reales

---

## 📋 ANÁLISIS ACTUAL

### **1. Selector de Sociedades en Juntas**

**Ubicación**: `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/crear.vue`

**Cómo funciona**:
- Usa `useSociedadHistorialStore()` para obtener sociedades
- Usa componente `Select` de shadcn/ui
- Carga sociedades desde el backend
- Al seleccionar, navega a la ruta con `societyId`

**Store usado**: `app/core/presentation/registros/sociedades/stores/sociedad-historial.store.ts`

### **2. Selector de Sociedades en Repositorio (ACTUAL - HARDCODEADO)**

**Ubicación**: `app/components/repository/RepositoryDashboard.vue`

**Problema**:
- Usa `useRepositorioDashboardStore()` que tiene datos MOCK
- `RepositorioMockRepository` devuelve datos hardcodeados
- No se conecta con el backend real

**Store actual**: `app/core/presentation/repositorio/stores/repositorio-dashboard.store.ts`

### **3. Vista Documentos Generados (ACTUAL - HARDCODEADO)**

**Ubicación**: `app/components/repository/DocumentosGeneradosView.vue`

**Problema**:
- Usa `useDocumentosGenerados()` que tiene datos MOCK
- Estructura jerárquica hardcodeada: `registros`, `operaciones`, `carpetas`, `juntas`
- No se conecta con el backend real

**Composable actual**: `app/core/presentation/repositorio/composables/useDocumentosGenerados.ts`

---

## 🔄 FLUJO DESEADO

### **Flujo Completo**

```
1. Usuario entra a /storage/documentos-generados
   ↓
2. Se muestra selector de sociedades (arriba, visible en todas las páginas)
   ↓
3. Usuario selecciona sociedad
   ↓
4. Se hace fetch: GET /api/v2/repository/society-profile/:structureId/nodes/core
   ↓
5. Se filtran nodos que empiezan con "/core/juntas/"
   ↓
6. Se muestra estructura:
   - operaciones/
     - juntas/
       - [Carpeta Junta 1] (flowId: 1)
       - [Carpeta Junta 2] (flowId: 2)
   ↓
7. Usuario hace click en "operaciones" → muestra "juntas"
   ↓
8. Usuario hace click en "juntas" → muestra carpetas de juntas reales
   ↓
9. Usuario hace click en carpeta de junta → muestra documentos dentro
```

---

## 📋 PLAN DE IMPLEMENTACIÓN

### **FASE 1: Selector de Sociedades Funcional**

#### **1.1. Crear Componente Compartido de Selector**

**Archivo**: `app/components/repository/SocietySelector.vue`

**Características**:
- Reutiliza el diseño de `RepositoryDashboard.vue`
- Usa `useSociedadHistorialStore()` (igual que juntas)
- Se puede usar en todas las páginas del repositorio
- Emite evento cuando cambia la sociedad

**Código base**:
```vue
<script setup lang="ts">
import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";
import { storeToRefs } from "pinia";

const sociedadStore = useSociedadHistorialStore();
const { sociedades } = storeToRefs(sociedadStore);

const selectedSocietyId = ref<string | null>(null);

// Cargar sociedades al montar
onMounted(async () => {
  if (sociedades.value.length === 0) {
    await sociedadStore.cargarSociedades();
  }
});

// Emitir cuando cambia
watch(selectedSocietyId, (newId) => {
  emit('society-changed', newId);
});

const emit = defineEmits<{
  'society-changed': [societyId: string | null];
}>();
</script>

<template>
  <!-- Mismo diseño que RepositoryDashboard.vue -->
  <DropdownMenu>
    <!-- ... código del selector ... -->
  </DropdownMenu>
</template>
```

#### **1.2. Actualizar Store del Repositorio**

**Archivo**: `app/core/presentation/repositorio/stores/repositorio-dashboard.store.ts`

**Cambios**:
- Eliminar `RepositorioMockRepository`
- Usar `useSociedadHistorialStore()` para obtener sociedades
- Mantener `sociedadSeleccionada` pero conectado con datos reales

**Código**:
```typescript
import { useSociedadHistorialStore } from "~/core/presentation/registros/sociedades/stores/sociedad-historial.store";

export const useRepositorioDashboardStore = defineStore('repositorio-dashboard', {
  state: () => ({
    sociedadSeleccionada: null as { id: string; nombre: string; rut: string; tipo: string } | null,
    // ... otros estados
  }),

  actions: {
    async seleccionarSociedad(societyId: string) {
      const sociedadStore = useSociedadHistorialStore();
      const sociedad = sociedadStore.sociedades.find(s => s.idSociety === societyId);
      
      if (sociedad) {
        this.sociedadSeleccionada = {
          id: sociedad.idSociety,
          nombre: sociedad.razonSocial,
          rut: sociedad.rut,
          tipo: sociedad.tipoSociedad,
        };
        
        // Disparar carga de documentos
        // (se implementará en Fase 2)
      }
    },
  },
});
```

#### **1.3. Agregar Selector a Todas las Páginas del Repositorio**

**Páginas a actualizar**:
- `app/pages/storage/dashboard.vue`
- `app/pages/storage/documentos-generados.vue`
- `app/pages/storage/almacen.vue`
- `app/pages/storage/carpetas-personalizadas.vue`

**Estructura**:
```vue
<template>
  <div>
    <!-- Selector de Sociedades (arriba, siempre visible) -->
    <SocietySelector @society-changed="handleSocietyChanged" />
    
    <!-- Contenido específico de cada página -->
    <DocumentosGeneradosView />
  </div>
</template>
```

---

### **FASE 2: Obtener Documentos Reales del Backend**

#### **2.1. Crear Entidades y DTOs**

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
  versions?: Array<{
    versionCode: string;
    documentCode: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

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
  mimeType?: string;
  sizeInBytes?: number;
  versions?: Array<{
    versionCode: string;
    documentCode: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

#### **2.2. Crear Mapper**

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
      versions: dto.versions,
    };
  }
}
```

#### **2.3. Actualizar Repository**

**Archivo**: `app/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository.ts`

**Agregar método**:
```typescript
async obtenerNodosCore(structureId: string): Promise<RepositorioNode[]> {
  const baseUrl = this.resolveBaseUrl();
  const url = `${baseUrl}${this.basePathV2}/${structureId}/nodes/core`;

  console.log("🔵 [RepositorioDocumentosHttp] OBTENER NODOS CORE");
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

async obtenerNodoPorId(nodeId: number): Promise<RepositorioNode> {
  const baseUrl = this.resolveBaseUrl();
  const url = `${baseUrl}${this.basePathV2}/nodes/${nodeId}`;

  try {
    const response = await $fetch<{
      success: boolean;
      data: RepositorioNodeDTO;
    }>(url, {
      ...withAuthHeaders(),
      method: "GET" as const,
    });

    return RepositorioNodeMapper.toEntity(response.data);
  } catch (error: any) {
    console.error("🔴 [RepositorioDocumentosHttp] ERROR:", error);
    throw new Error(
      `No se pudo obtener el nodo: ${error?.message || "Error desconocido"}`
    );
  }
}
```

#### **2.4. Crear Use Case**

**Archivo**: `app/core/hexag/repositorio/application/use-cases/obtener-documentos-juntas.use-case.ts`

```typescript
import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";
import type { RepositorioNode } from "../../domain/entities/repositorio-node.entity";

export class ObtenerDocumentosJuntasUseCase {
  constructor(
    private readonly repositorioDocumentosRepository: RepositorioDocumentosRepository
  ) {}

  /**
   * Obtiene todas las carpetas de juntas de una sociedad
   */
  async obtenerCarpetasJuntas(structureId: string): Promise<RepositorioNode[]> {
    // 1. Obtener todos los nodos core
    const nodos = await this.repositorioDocumentosRepository.obtenerNodosCore(structureId);

    // 2. Filtrar solo carpetas que están en /core/juntas/
    const carpetasJuntas = nodos.filter(
      (node) => node.type === 1 && node.path.startsWith("/core/juntas/")
    );

    return carpetasJuntas;
  }

  /**
   * Obtiene los documentos dentro de una carpeta de junta
   */
  async obtenerDocumentosDeCarpeta(carpetaId: number): Promise<RepositorioNode[]> {
    // 1. Obtener el nodo (carpeta) con sus hijos
    const carpeta = await this.repositorioDocumentosRepository.obtenerNodoPorId(carpetaId);

    // 2. Retornar solo los documentos (type === 2)
    return carpeta.children?.filter((child) => child.type === 2) || [];
  }

  /**
   * Obtiene la estructura completa de juntas
   * Retorna: { operaciones: { juntas: [carpetas] } }
   */
  async obtenerEstructuraJuntas(structureId: string): Promise<{
    operaciones: {
      juntas: RepositorioNode[];
    };
  }> {
    const carpetasJuntas = await this.obtenerCarpetasJuntas(structureId);

    return {
      operaciones: {
        juntas: carpetasJuntas,
      },
    };
  }
}
```

---

### **FASE 3: Actualizar Store y Composable de Documentos Generados**

#### **3.1. Actualizar Store**

**Archivo**: `app/core/presentation/repositorio/stores/documentos-generados.store.ts`

**Cambios**:
- Eliminar datos MOCK
- Usar `ObtenerDocumentosJuntasUseCase`
- Cargar datos cuando cambia la sociedad

**Código**:
```typescript
import { defineStore } from "pinia";
import type { RepositorioNode } from "~/core/hexag/repositorio/domain/entities/repositorio-node.entity";
import { ObtenerDocumentosJuntasUseCase } from "~/core/hexag/repositorio/application/use-cases/obtener-documentos-juntas.use-case";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";

export const useDocumentosGeneradosStore = defineStore("documentosGenerados", {
  state: () => ({
    estructuraJuntas: null as {
      operaciones: {
        juntas: RepositorioNode[];
      };
    } | null,
    isLoading: false,
    hasError: false,
    errorMessage: null as string | null,
  }),

  getters: {
    hasData: (state) => state.estructuraJuntas !== null,
  },

  actions: {
    async cargarDocumentosGenerados(structureId: string) {
      this.isLoading = true;
      this.hasError = false;
      this.errorMessage = null;

      try {
        const repository = new RepositorioDocumentosHttpRepository();
        const useCase = new ObtenerDocumentosJuntasUseCase(repository);
        
        this.estructuraJuntas = await useCase.obtenerEstructuraJuntas(structureId);
      } catch (error: any) {
        this.hasError = true;
        this.errorMessage = error?.message || "Error al cargar documentos";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    limpiar() {
      this.estructuraJuntas = null;
      this.hasError = false;
      this.errorMessage = null;
    },
  },
});
```

#### **3.2. Actualizar Composable**

**Archivo**: `app/core/presentation/repositorio/composables/useDocumentosGenerados.ts`

**Cambios**:
- Conectar con store actualizado
- Cargar cuando cambia la sociedad

**Código**:
```typescript
import { computed, watch } from "vue";
import { useDocumentosGeneradosStore } from "../stores/documentos-generados.store";
import { useRepositorioDashboardStore } from "../stores/repositorio-dashboard.store";

export function useDocumentosGenerados() {
  const store = useDocumentosGeneradosStore();
  const dashboardStore = useRepositorioDashboardStore();

  const sociedadId = computed(() => dashboardStore.sociedadSeleccionada?.id);

  // Cargar documentos cuando cambie la sociedad
  watch(
    () => sociedadId.value,
    async (id) => {
      if (id) {
        await store.cargarDocumentosGenerados(id);
      } else {
        store.limpiar();
      }
    },
    { immediate: true }
  );

  return {
    estructuraJuntas: computed(() => store.estructuraJuntas),
    isLoading: computed(() => store.isLoading),
    hasError: computed(() => store.hasError),
    errorMessage: computed(() => store.errorMessage),
    hasData: computed(() => store.hasData),
  };
}
```

---

### **FASE 4: Actualizar Vista de Documentos Generados**

#### **4.1. Actualizar Componente**

**Archivo**: `app/components/repository/DocumentosGeneradosView.vue`

**Cambios principales**:
1. Eliminar datos hardcodeados
2. Usar `estructuraJuntas` del store
3. Mostrar estructura real: `operaciones → juntas → [carpetas]`
4. Permitir navegación por carpetas

**Estructura de navegación**:
```typescript
// Nivel 0: Raíz
currentPath = []
→ Muestra: ["operaciones"]

// Nivel 1: operaciones
currentPath = ["operaciones"]
→ Muestra: ["juntas"]

// Nivel 2: juntas
currentPath = ["operaciones", "juntas"]
→ Muestra: [Carpetas de juntas reales del backend]

// Nivel 3: carpeta de junta
currentPath = ["operaciones", "juntas", "carpeta-29"]
→ Muestra: [Documentos dentro de la carpeta]
```

**Código de ejemplo**:
```vue
<script setup lang="ts">
const { estructuraJuntas, isLoading } = useDocumentosGenerados();
const currentPath = ref<string[]>([]);

const getCurrentData = computed(() => {
  if (!estructuraJuntas.value) return { folders: [], files: [] };

  const folders: Array<{ id: string; nombre: string; tipo: string; color: string }> = [];
  const files: Array<{ id: string; nombre: string; fecha: Date; tamaño?: number }> = [];

  // Nivel 0: Raíz → mostrar "operaciones"
  if (currentPath.value.length === 0) {
    folders.push({
      id: "operaciones",
      nombre: "Operaciones",
      tipo: "categoria",
      color: "#10B981",
    });
    return { folders, files };
  }

  // Nivel 1: operaciones → mostrar "juntas"
  if (currentPath.value.length === 1 && currentPath.value[0] === "operaciones") {
    folders.push({
      id: "operaciones-juntas",
      nombre: "Juntas",
      tipo: "carpeta",
      color: "#6366F1",
    });
    return { folders, files };
  }

  // Nivel 2: juntas → mostrar carpetas reales
  if (
    currentPath.value.length === 2 &&
    currentPath.value[0] === "operaciones" &&
    currentPath.value[1] === "juntas"
  ) {
    estructuraJuntas.value.operaciones.juntas.forEach((carpeta) => {
      folders.push({
        id: `carpeta-${carpeta.id}`,
        nombre: carpeta.name,
        tipo: "junta",
        color: "#6366F1",
        nodeId: carpeta.id, // Guardar ID real del nodo
      });
    });
    return { folders, files };
  }

  // Nivel 3: carpeta de junta → mostrar documentos
  if (currentPath.value.length === 3) {
    const carpetaId = currentPath.value[2].replace("carpeta-", "");
    // Cargar documentos de la carpeta
    // (se implementará con obtenerDocumentosDeCarpeta)
  }

  return { folders, files };
});
</script>
```

---

### **FASE 5: Implementar Navegación y Carga de Documentos**

#### **5.1. Cargar Documentos de Carpeta**

**En el componente**:
```typescript
const documentosCarpeta = ref<RepositorioNode[]>([]);

const navigateToFolder = async (folderId: string) => {
  const nodeId = parseInt(folderId.replace("carpeta-", ""));
  
  // Agregar a path
  currentPath.value.push(folderId);
  
  // Cargar documentos
  const repository = new RepositorioDocumentosHttpRepository();
  const useCase = new ObtenerDocumentosJuntasUseCase(repository);
  documentosCarpeta.value = await useCase.obtenerDocumentosDeCarpeta(nodeId);
};
```

#### **5.2. Mostrar Documentos**

**En el template**:
```vue
<!-- Si estamos en una carpeta de junta, mostrar documentos -->
<div v-if="currentPath.length === 3" class="grid grid-cols-4 gap-4">
  <div
    v-for="doc in documentosCarpeta"
    :key="doc.id"
    class="bg-white rounded-xl p-4 border cursor-pointer"
    @click="handleDocumentClick(doc)"
  >
    <FileText class="w-8 h-8" />
    <p>{{ doc.name }}</p>
    <p class="text-xs text-gray-500">{{ formatSize(doc.sizeInBytes) }}</p>
  </div>
</div>
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### **Fase 1: Selector de Sociedades**
- [ ] Crear componente `SocietySelector.vue`
- [ ] Conectar con `useSociedadHistorialStore()`
- [ ] Actualizar `repositorio-dashboard.store.ts`
- [ ] Agregar selector a `dashboard.vue`
- [ ] Agregar selector a `documentos-generados.vue`
- [ ] Agregar selector a `almacen.vue`
- [ ] Agregar selector a `carpetas-personalizadas.vue`
- [ ] Probar cambio de sociedad

### **Fase 2: Backend Integration**
- [ ] Crear entidad `RepositorioNode`
- [ ] Crear DTO `RepositorioNodeDTO`
- [ ] Crear mapper `RepositorioNodeMapper`
- [ ] Agregar método `obtenerNodosCore()` al repository
- [ ] Agregar método `obtenerNodoPorId()` al repository
- [ ] Crear use case `ObtenerDocumentosJuntasUseCase`
- [ ] Probar obtención de nodos

### **Fase 3: Store y Composable**
- [ ] Actualizar `documentos-generados.store.ts`
- [ ] Eliminar datos MOCK
- [ ] Conectar con use case
- [ ] Actualizar `useDocumentosGenerados.ts`
- [ ] Conectar con watch de sociedad
- [ ] Probar carga de datos

### **Fase 4: Vista**
- [ ] Actualizar `DocumentosGeneradosView.vue`
- [ ] Eliminar datos hardcodeados
- [ ] Implementar navegación por niveles
- [ ] Mostrar estructura real: operaciones → juntas
- [ ] Mostrar carpetas de juntas reales
- [ ] Probar navegación

### **Fase 5: Documentos**
- [ ] Implementar carga de documentos de carpeta
- [ ] Mostrar documentos en vista
- [ ] Implementar descarga de documentos
- [ ] Probar descarga

---

## 🚀 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

1. **Fase 1** (Selector) → Base para todo lo demás
2. **Fase 2** (Backend) → Infraestructura de datos
3. **Fase 3** (Store) → Gestión de estado
4. **Fase 4** (Vista) → UI con datos reales
5. **Fase 5** (Documentos) → Funcionalidad completa

---

## 📚 REFERENCIAS

### **Endpoints Backend**
- `GET /api/v2/repository/society-profile/:structureId/nodes/core` - Obtener todos los nodos core
- `GET /api/v2/repository/society-profile/nodes/:nodeId` - Obtener nodo con hijos

### **Documentación**
- `docs/backend/GUIA-VISUALIZAR-DOCUMENTOS-JUNTA-V2.md` - Guía completa de endpoints
- `docs/juntas/PLAN-VISTA-DOCUMENTOS-GENERADOS-REPOSITORIO.md` - Plan anterior

### **Código de Referencia**
- `app/pages/operaciones/sociedades/[societyId]/junta-accionistas/crear.vue` - Selector de sociedades en juntas
- `app/core/presentation/registros/sociedades/stores/sociedad-historial.store.ts` - Store de sociedades

---

**¡Listo para implementar, mi rey!** 🚀💪

