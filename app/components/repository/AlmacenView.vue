<script setup lang="ts">
import {
  Folder,
  FolderOpen,
  FileText,
  Grid,
  List,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Plus,
  Upload,
  ChevronRight,
  // ArrowLeft, // No usado
} from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdvancedSearchBar from "./AdvancedSearchBar.vue";
import type { AdvancedFilters } from "./types";
import PreviewModal from "./PreviewModal.vue";
import UploadModal from "./UploadModal.vue";
import CreateFolderModal from "./CreateFolderModal.vue";
import DeleteConfirmModal from "./DeleteConfirmModal.vue";
// import DocumentCard from "./DocumentCard.vue"; // No usado
import { useAlmacenamiento } from "~/core/presentation/repositorio/composables/useAlmacenamiento";
import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";
import { useObtenerCarpetaDocumentosSocietarios } from "~/core/presentation/repositorio/composables/useObtenerCarpetaDocumentosSocietarios";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";

const router = useRouter();

const {
  documentos,
  carpetaActual,
  breadcrumb,
  vista,
  isLoading,
  carpetas: _carpetas,
  archivos: _archivos,
  cargarDocumentos,
  navegarACarpeta,
  navegarAtras: _navegarAtras,
  obtenerDocumento,
  eliminarDocumento,
  crearCarpeta,
} = useAlmacenamiento();

const dashboardStore = useRepositorioDashboardStore();
const { obtenerCarpetaDocumentosSocietarios } = useObtenerCarpetaDocumentosSocietarios();

const searchQuery = ref("");
const previewModalOpen = ref(false);
const selectedDocument = ref<any>(null);
const uploadModalOpen = ref(false);
const createFolderModalOpen = ref(false);
const parentNodeIdForUpload = ref<string | null>(null);

// Estado de filtros avanzados
const filters = ref<AdvancedFilters>({ scope: "societarios" });

// Cargar documentos cuando cambie la sociedad
watch(
  () => dashboardStore.sociedadSeleccionada?.id,
  async (sociedadId) => {
    if (sociedadId) {
      await cargarDocumentos(carpetaActual.value);
    }
  },
  { immediate: true }
);

// Filtrar documentos por búsqueda
const documentosFiltrados = computed(() => {
  if (!searchQuery.value.trim()) return documentos.value;
  const query = searchQuery.value.toLowerCase();
  return documentos.value.filter(
    (doc) => doc.nombre.toLowerCase().includes(query)
  );
});

const handleDocumentClick = async (doc: any) => {
  if (doc.tipo === "folder") {
    await navegarACarpeta(doc.id);
  } else {
    try {
      console.log("🔵 [AlmacenView] Obteniendo documento para preview:", doc.id);
      
      // Si el documento ya tiene versionCode, usarlo directamente
      if (doc.versionCode && doc.mimeType) {
        console.log("🟢 [AlmacenView] Usando versionCode del documento:", doc.versionCode);
        selectedDocument.value = {
          name: doc.nombre,
          type: doc.mimeType || "documento",
          owner: doc.propietario || "Sistema",
          dateModified: doc.fechaModificacion || new Date(),
          size: doc.tamaño,
          versionCode: doc.versionCode,
          mimeType: doc.mimeType,
        };
        previewModalOpen.value = true;
        return;
      }
      
      // Si no tiene versionCode, obtener el nodo completo del backend
      console.log("🟡 [AlmacenView] No hay versionCode, obteniendo nodo completo...");
      const repository = new RepositorioDocumentosHttpRepository();
      const nodeIdNumber = parseInt(doc.id, 10);
      
      if (isNaN(nodeIdNumber)) {
        throw new Error(`ID de documento inválido: ${doc.id}`);
      }
      
      const node = await repository.obtenerNodoPorId(nodeIdNumber);
      
      if (!node) {
        throw new Error("No se pudo obtener el documento del servidor");
      }
      
      if (node.type !== "document") {
        throw new Error("El nodo no es un documento");
      }
      
      // Obtener versionCode de las versiones del nodo
      let versionCode: string | undefined;
      if (node.versions && node.versions.length > 0) {
        versionCode = node.versions[0].versionCode;
        console.log("🟢 [AlmacenView] versionCode obtenido del nodo:", versionCode);
      }
      
      if (!versionCode) {
        console.error("❌ [AlmacenView] No se pudo obtener versionCode del documento");
        alert("No se pudo obtener la versión del documento para previsualizar");
        return;
      }
      
      selectedDocument.value = {
        name: node.name,
        type: node.mimeType || "documento",
        owner: "Sistema",
        dateModified: new Date(node.updatedAt),
        size: node.sizeInBytes,
        versionCode: versionCode,
        mimeType: node.mimeType,
      };
      previewModalOpen.value = true;
    } catch (error: any) {
      console.error("❌ [AlmacenView] Error al obtener documento:", error);
      alert(`Error al abrir el documento: ${error?.message || "Error desconocido"}`);
    }
  }
};

const deleteConfirmModalOpen = ref(false);
const itemToDelete = ref<any>(null);

const handleDelete = async (doc: any) => {
  itemToDelete.value = doc;
  deleteConfirmModalOpen.value = true;
};

const confirmDelete = async () => {
  if (!itemToDelete.value) return;
  
  try {
    console.log("🔵 [AlmacenView] Eliminando:", itemToDelete.value);
    await eliminarDocumento(itemToDelete.value.id);
    await cargarDocumentos(carpetaActual.value);
    deleteConfirmModalOpen.value = false;
    itemToDelete.value = null;
  } catch (error: any) {
    console.error("❌ [AlmacenView] Error al eliminar:", error);
    alert(`Error al eliminar: ${error?.message || "Error desconocido"}`);
  }
};

const handleDownload = async (doc: any) => {
  try {
    console.log("🔵 [AlmacenView] Descargando documento:", doc.id);
    await descargarDocumento(doc.id);
    console.log("✅ [AlmacenView] Documento descargado exitosamente");
  } catch (error: any) {
    console.error("❌ [AlmacenView] Error al descargar:", error);
    alert(`Error al descargar el documento: ${error?.message || "Error desconocido"}`);
  }
};

const handleCreateFolder = async (folderName: string) => {
  try {
    console.log("🔵 [AlmacenView] Creando carpeta:", folderName);
    console.log("🔵 [AlmacenView] carpetaActual:", carpetaActual.value);
    console.log("🔵 [AlmacenView] sociedadSeleccionada:", dashboardStore.sociedadSeleccionada?.id);
    
    // Si estamos en la raíz (carpetaActual es null), usar la carpeta /core/
    let parentId = carpetaActual.value;
    
    if (!parentId && dashboardStore.sociedadSeleccionada?.id) {
      console.log("🔵 [AlmacenView] Obteniendo carpeta /core/...");
      parentId = await obtenerCarpetaDocumentosSocietarios(dashboardStore.sociedadSeleccionada.id);
      console.log("🔵 [AlmacenView] Carpeta /core/ obtenida:", parentId);
    }
    
    if (!parentId) {
      const errorMsg = "No se pudo obtener la carpeta /core/ para crear la carpeta. Asegúrate de que la sociedad tenga la estructura configurada.";
      console.error("🔴 [AlmacenView]", errorMsg);
      alert(errorMsg);
      return;
    }
    
    console.log("🔵 [AlmacenView] Creando carpeta con parentId:", parentId);
    await crearCarpeta({
      nombre: folderName,
      parentId: parentId,
    });
    console.log("✅ [AlmacenView] Carpeta creada exitosamente");
    await cargarDocumentos(carpetaActual.value);
  } catch (error: any) {
    console.error("🔴 [AlmacenView] Error al crear carpeta:", error);
    alert(`Error al crear la carpeta: ${error?.message || "Error desconocido"}`);
  }
};

const navigateToDocumentosGenerados = () => {
  if (dashboardStore.sociedadSeleccionada?.id) {
    router.push(`/storage/documentos-generados/${dashboardStore.sociedadSeleccionada.id}/operaciones/`);
  }
};

const navegarARaiz = async () => {
  await cargarDocumentos(null);
};

const handleUploadClick = () => {
  if (!parentNodeIdForUpload.value) {
    console.warn("⚠️ [AlmacenView] No se puede subir: parentNodeIdForUpload es null");
    alert("No se pudo obtener la carpeta destino. Por favor, recarga la página.");
    return;
  }
  
  if (!dashboardStore.sociedadSeleccionada?.id) {
    console.warn("⚠️ [AlmacenView] No se puede subir: no hay sociedad seleccionada");
    alert("Por favor, selecciona una sociedad primero.");
    return;
  }
  
  console.log("🔵 [AlmacenView] Abriendo modal de subida:", {
    structureId: dashboardStore.sociedadSeleccionada.id,
    parentNodeId: parentNodeIdForUpload.value,
  });
  
  uploadModalOpen.value = true;
};

const handleUploadSuccess = async () => {
  // Recargar documentos después de subir exitosamente
  await cargarDocumentos(carpetaActual.value);
  uploadModalOpen.value = false;
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
  return `Hace ${Math.floor(days / 30)} meses`;
};

const formatSize = (bytes?: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Obtener el parentNodeId para subir archivos
// Si estamos en la raíz (carpetaActual es null), necesitamos obtener la carpeta /core/
watch(
  () => [carpetaActual.value, dashboardStore.sociedadSeleccionada?.id],
  async ([carpetaId, structureId]) => {
    console.log("🔵 [AlmacenView] Watch parentNodeIdForUpload:", { carpetaId, structureId });
    
    if (!structureId) {
      console.log("🔵 [AlmacenView] No hay structureId, limpiando parentNodeIdForUpload");
      parentNodeIdForUpload.value = null;
      return;
    }

    if (carpetaId) {
      // Si hay carpeta actual, usar su ID
      console.log("🔵 [AlmacenView] Usando carpeta actual:", carpetaId);
      parentNodeIdForUpload.value = carpetaId;
    } else {
      // Si estamos en la raíz, obtener la carpeta /core/
      console.log("🔵 [AlmacenView] Obteniendo carpeta /core/ para subir archivos...");
      const carpetaCoreId = await obtenerCarpetaDocumentosSocietarios(structureId);
      console.log("🔵 [AlmacenView] Carpeta /core/ obtenida:", carpetaCoreId);
      parentNodeIdForUpload.value = carpetaCoreId;
      
      if (!carpetaCoreId) {
        console.warn("⚠️ [AlmacenView] No se pudo obtener la carpeta /core/. El botón de subir no funcionará.");
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <div
    class="h-full overflow-y-auto"
    style="background-color: var(--bg-muted)"
  >
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Header con Breadcrumb -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-4">
          <FolderOpen
            class="w-5 h-5"
            :style="{ color: 'var(--primary-700)' }"
          />
          <button
            class="text-sm hover:underline"
            :style="{
              color: carpetaActual ? 'var(--primary-700)' : 'var(--text-primary)',
              fontFamily: 'var(--font-secondary)',
            }"
            @click="navegarARaiz"
          >
            Almacén
          </button>
          <template v-if="breadcrumb.length > 0">
            <ChevronRight
              class="w-4 h-4"
              :style="{ color: 'var(--text-muted)' }"
            />
            <button
              v-for="(item, index) in breadcrumb"
              :key="item.id"
              class="flex items-center gap-2 text-sm hover:underline"
              :style="{
                color:
                  index === breadcrumb.length - 1
                    ? 'var(--text-primary)'
                    : 'var(--primary-700)',
                fontFamily: 'var(--font-secondary)',
              }"
              @click="
                index < breadcrumb.length - 1
                  ? navegarACarpeta(item.id)
                  : null
              "
            >
              {{ item.nombre }}
              <ChevronRight
                v-if="index < breadcrumb.length - 1"
                class="w-4 h-4"
                :style="{ color: 'var(--text-muted)' }"
              />
            </button>
          </template>
        </div>

        <!-- Barra de herramientas -->
        <div class="flex items-center justify-between">
          <AdvancedSearchBar
            v-model="searchQuery"
            :current-scope="'societarios'"
            :filters="filters"
            placeholder="Buscar en documentos societarios..."
            @update:filters="filters = $event"
          />

          <div class="flex items-center gap-3">
            <!-- Toggle Grid/List -->
            <div class="flex items-center gap-2 bg-white rounded-lg border p-1">
              <button
                class="p-2 rounded transition-colors"
                :class="vista === 'grid' ? 'bg-gray-100' : ''"
                @click="vista = 'grid'"
              >
                <Grid
                  class="w-4 h-4"
                  :style="{
                    color:
                      vista === 'grid'
                        ? 'var(--primary-700)'
                        : 'var(--text-muted)',
                  }"
                />
              </button>
              <button
                class="p-2 rounded transition-colors"
                :class="vista === 'list' ? 'bg-gray-100' : ''"
                @click="vista = 'list'"
              >
                <List
                  class="w-4 h-4"
                  :style="{
                    color:
                      vista === 'list'
                        ? 'var(--primary-700)'
                        : 'var(--text-muted)',
                  }"
                />
              </button>
            </div>

            <!-- Botón Subir -->
            <button
              @click="handleUploadClick"
              class="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :style="{
                borderColor: 'var(--border-light)',
                fontFamily: 'var(--font-secondary)',
              }"
              :disabled="!parentNodeIdForUpload"
            >
              <Upload class="w-4 h-4" />
              <span>Subir</span>
            </button>

            <!-- Botón Nueva Carpeta -->
            <button
              @click="createFolderModalOpen = true"
              class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style="
                background-color: var(--primary-700);
                color: white;
                font-family: var(--font-secondary);
                font-weight: 500;
              "
            >
              <Plus class="w-4 h-4" />
              <span>Nueva Carpeta</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Contenido -->
      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <p
          class="text-sm"
          :style="{ color: 'var(--text-muted)' }"
        >
          Cargando documentos...
        </p>
      </div>

      <!-- Grid View -->
      <div
        v-else-if="vista === 'grid'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <!-- Carpeta visual "Documentos Generados" (solo en raíz) -->
        <div
          v-if="!carpetaActual && dashboardStore.sociedadSeleccionada?.id"
          class="bg-white rounded-xl p-4 border hover:shadow-md transition-all cursor-pointer group relative"
          :style="{ borderColor: 'var(--border-light)' }"
          @click="navigateToDocumentosGenerados"
        >
          <!-- Icono -->
          <div class="flex items-center justify-center mb-3">
            <div
              class="p-4 rounded-lg"
              style="background-color: #EEF2FF"
            >
              <Folder
                class="w-8 h-8"
                :style="{ color: 'var(--primary-700)' }"
              />
            </div>
          </div>

          <!-- Nombre -->
          <h4
            class="text-sm font-medium truncate mb-2"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            Documentos Generados
          </h4>

          <!-- Metadata -->
          <div class="text-xs space-y-1">
            <p :style="{ color: 'var(--text-muted)' }">
              Sistema
            </p>
          </div>
        </div>

        <!-- Documentos reales -->
        <div
          v-for="doc in documentosFiltrados"
          :key="doc.id"
          class="bg-white rounded-xl p-4 border hover:shadow-md transition-all cursor-pointer group relative"
          :style="{ borderColor: 'var(--border-light)' }"
          @click="handleDocumentClick(doc)"
        >
          <!-- Icono -->
          <div class="flex items-center justify-center mb-3">
            <div
              v-if="doc.tipo === 'folder'"
              class="p-4 rounded-lg"
              style="background-color: #EEF2FF"
            >
              <Folder
                class="w-8 h-8"
                :style="{ color: 'var(--primary-700)' }"
              />
            </div>
            <div
              v-else
              class="p-4 rounded-lg"
              style="background-color: #FEE2E2"
            >
              <FileText
                class="w-8 h-8"
                style="color: #DC2626"
              />
            </div>
          </div>

          <!-- Nombre -->
          <h4
            class="text-sm font-medium truncate mb-2"
            :style="{
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-secondary)',
            }"
          >
            {{ doc.nombre }}
          </h4>

          <!-- Metadata -->
          <div class="text-xs space-y-1">
            <p :style="{ color: 'var(--text-muted)' }">
              {{ formatDate(doc.fechaModificacion) }}
            </p>
            <p v-if="formatSize(doc.tamaño)" :style="{ color: 'var(--text-muted)' }">
              {{ formatSize(doc.tamaño) }}
            </p>
          </div>

          <!-- Menú de acciones -->
          <div
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            @click.stop
          >
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button
                  class="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  @click.stop
                >
                  <MoreVertical
                    class="w-4 h-4"
                    :style="{ color: 'var(--text-muted)' }"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click.stop="handleDocumentClick(doc)">
                  <Eye class="w-4 h-4 mr-2" />
                  Vista previa
                </DropdownMenuItem>
                <DropdownMenuItem
                  v-if="doc.tipo === 'file'"
                  @click.stop="handleDownload(doc)"
                >
                  <Download class="w-4 h-4 mr-2" />
                  Descargar
                </DropdownMenuItem>
                <DropdownMenuItem
                  class="text-red-600"
                  @click.stop="handleDelete(doc)"
                >
                  <Trash2 class="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div
        v-else
        class="bg-white rounded-xl border overflow-hidden"
        :style="{ borderColor: 'var(--border-light)' }"
      >
        <table class="w-full">
          <thead>
            <tr
              class="bg-gray-50 border-b"
              :style="{ borderColor: 'var(--border-light)' }"
            >
              <th
                class="px-6 py-3 text-left text-xs font-medium"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                Nombre
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                Propietario
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                Última modificación
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                Tamaño
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium"
                :style="{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-secondary)',
                }"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Fila especial: Documentos Generados (solo en raíz) - Carpeta visual -->
            <tr
              v-if="!carpetaActual && dashboardStore.sociedadSeleccionada?.id"
              class="border-b hover:bg-gray-50 cursor-pointer transition-colors"
              :style="{ borderColor: 'var(--border-light)' }"
              @click="navigateToDocumentosGenerados"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="p-2 rounded-lg"
                    style="background-color: #EEF2FF"
                  >
                    <Folder
                      class="w-4 h-4"
                      :style="{ color: 'var(--primary-700)' }"
                    />
                  </div>
                  <span
                    class="text-sm"
                    :style="{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 500,
                    }"
                  >
                    Documentos Generados
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-sm"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  Sistema
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-sm"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  -
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-sm"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  -
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <!-- Sin acciones para Documentos Generados -->
              </td>
            </tr>

            <!-- Filas normales: documentos y carpetas -->
            <tr
              v-for="doc in documentosFiltrados"
              :key="doc.id"
              class="border-b hover:bg-gray-50 cursor-pointer transition-colors"
              :style="{ borderColor: 'var(--border-light)' }"
              @click="handleDocumentClick(doc)"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    v-if="doc.tipo === 'folder'"
                    class="p-2 rounded-lg"
                    style="background-color: #EEF2FF"
                  >
                    <Folder
                      class="w-4 h-4"
                      :style="{ color: 'var(--primary-700)' }"
                    />
                  </div>
                  <div
                    v-else
                    class="p-2 rounded-lg"
                    style="background-color: #FEE2E2"
                  >
                    <FileText
                      class="w-4 h-4"
                      style="color: #DC2626"
                    />
                  </div>
                  <span
                    class="text-sm"
                    :style="{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-secondary)',
                      fontWeight: 500,
                    }"
                  >
                    {{ doc.nombre }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-sm"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  {{ doc.propietario }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-sm"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  {{ formatDate(doc.fechaModificacion) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-sm"
                  :style="{
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-secondary)',
                  }"
                >
                  {{ formatSize(doc.tamaño) || "-" }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button
                      class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      @click.stop
                    >
                      <MoreVertical
                        class="w-4 h-4"
                        :style="{ color: 'var(--text-muted)' }"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem @click.stop="handleDocumentClick(doc)">
                      <Eye class="w-4 h-4 mr-2" />
                      Vista previa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      v-if="doc.tipo === 'file'"
                      @click.stop="handleDownload(doc)"
                    >
                      <Download class="w-4 h-4 mr-2" />
                      Descargar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      class="text-red-600"
                      @click.stop="handleDelete(doc)"
                    >
                      <Trash2 class="w-4 h-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Preview Modal -->
      <PreviewModal
        :is-open="previewModalOpen"
        :document="selectedDocument"
        @close="
          previewModalOpen = false;
          selectedDocument = null;
        "
      />

      <!-- Delete Confirm Modal -->
      <DeleteConfirmModal
        :is-open="deleteConfirmModalOpen"
        :item-name="itemToDelete?.nombre || ''"
        :item-type="itemToDelete?.tipo === 'folder' ? 'folder' : 'file'"
        @close="
          deleteConfirmModalOpen = false;
          itemToDelete = null;
        "
        @confirm="confirmDelete"
      />

      <!-- Upload Modal -->
      <UploadModal
        v-if="dashboardStore.sociedadSeleccionada?.id && parentNodeIdForUpload"
        :is-open="uploadModalOpen"
        :structure-id="dashboardStore.sociedadSeleccionada.id"
        :parent-node-id="parentNodeIdForUpload"
        @close="uploadModalOpen = false"
        @uploaded="handleUploadSuccess"
      />

      <!-- Create Folder Modal -->
      <CreateFolderModal
        :is-open="createFolderModalOpen"
        @close="createFolderModalOpen = false"
        @created="handleCreateFolder"
      />
    </div>
  </div>
</template>


