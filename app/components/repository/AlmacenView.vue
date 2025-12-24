<script setup lang="ts">
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import {
    ChevronRight,
    Download,
    Eye,
    FileText,
    Folder,
    FolderOpen,
    Grid,
    List,
    MoreVertical,
    Plus,
    Trash2,
    Upload,
  } from "lucide-vue-next";
  import AdvancedSearchBar from "./AdvancedSearchBar.vue";
  import CreateFolderModal from "./CreateFolderModal.vue";
  import DeleteConfirmModal from "./DeleteConfirmModal.vue";
  import PreviewModal from "./PreviewModal.vue";
  import FileThumbnail from "./FileThumbnail.vue";
  import type { AdvancedFilters } from "./types";
  import UploadModal from "./UploadModal.vue";
  // import DocumentCard from "./DocumentCard.vue"; // No usado
  import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
  import { useAlmacenamiento } from "~/core/presentation/repositorio/composables/useAlmacenamiento";
  import { useObtenerCarpetaDocumentosSocietarios } from "~/core/presentation/repositorio/composables/useObtenerCarpetaDocumentosSocietarios";
  import { useRepositorioDashboardStore } from "~/core/presentation/repositorio/stores/repositorio-dashboard.store";

  const router = useRouter();
  const route = useRoute();

  const {
    documentos,
    carpetaActual,
    vista,
    isLoading,
    carpetas: _carpetas,
    archivos: _archivos,
    cargarDocumentos,
    navegarACarpeta: _navegarACarpetaStore,
    navegarAtras: _navegarAtras,
    descargarDocumento,
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

  // Obtener idSociety de la ruta
  const idSociety = computed(() => {
    const param = route.params.idSociety;
    if (typeof param === "string") return param;
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return param[0];
    }
    return dashboardStore.sociedadSeleccionada?.id;
  });

  // Obtener path de la ruta (catch-all)
  const routePath = computed(() => {
    const path = route.params.path;
    if (Array.isArray(path)) return path.filter((p) => p && typeof p === "string");
    if (typeof path === "string" && path.trim() !== "") return [path];
    return [];
  });

  // Cache de nombres de carpetas para el breadcrumb
  const folderNamesCache = ref<Record<string, string>>({});

  // Breadcrumb sincronizado con la ruta
  const breadcrumbFromRoute = computed(() => {
    const items: Array<{ id: string; nombre: string }> = [];

    // Siempre incluir "Almacén" como primer nivel (clickeable para volver a raíz)
    items.push({
      id: "almacen",
      nombre: "Almacén",
    });

    // Si estamos en la raíz, solo mostrar "Almacén"
    if (routePath.value.length === 0) return items;

    // Construir breadcrumb desde la ruta
    routePath.value.forEach((folderId) => {
      // Primero buscar en el cache
      if (folderId && folderNamesCache.value[folderId]) {
        items.push({
          id: folderId,
          nombre: folderNamesCache.value[folderId] || "",
        });
        return;
      }

      // Buscar el nombre de la carpeta en los documentos actuales
      const carpeta = documentos.value.find((d) => d.id === folderId && d.tipo === "folder");
      if (carpeta) {
        folderNamesCache.value[folderId] = carpeta.nombre;
        items.push({
          id: folderId,
          nombre: carpeta.nombre,
        });
      } else {
        // Si no encontramos la carpeta, usar el ID como nombre temporal
        // y cargar el nombre del backend
        items.push({
          id: folderId,
          nombre: folderNamesCache.value[folderId] || `Carpeta ${folderId}`,
        });

        // Cargar el nombre del backend de forma asíncrona
        loadFolderName(folderId);
      }
    });

    return items;
  });

  // Cargar nombre de carpeta del backend
  const loadFolderName = async (folderId: string) => {
    if (folderNamesCache.value[folderId]) return;

    try {
      const repository = new RepositorioDocumentosHttpRepository();
      const nodeIdNumber = parseInt(folderId, 10);
      if (!isNaN(nodeIdNumber)) {
        const node = await repository.obtenerNodoPorId(nodeIdNumber);
        if (node && node.type === "folder") {
          folderNamesCache.value[folderId] = node.name;
        }
      }
    } catch (error) {
      console.error("❌ [AlmacenView] Error al cargar nombre de carpeta:", error);
    }
  };

  // Navegar a carpeta con actualización de ruta
  const navegarACarpeta = async (carpetaId: string) => {
    console.log("🔵 [AlmacenView] Navegando a carpeta:", carpetaId);

    if (!idSociety.value) {
      console.error("❌ [AlmacenView] No hay idSociety en la ruta");
      return;
    }

    // Actualizar la ruta
    const newPath = [...routePath.value, carpetaId];
    const pathString = newPath.join("/");
    const newRoute = `/storage/almacen/${idSociety.value}/${pathString}`;

    console.log("🔵 [AlmacenView] Actualizando ruta a:", newRoute);
    router.push(newRoute);

    // Navegar en el store
    await _navegarACarpetaStore(carpetaId);
  };

  // Navegar a breadcrumb (retroceder)
  const navegarABreadcrumb = async (index: number) => {
    console.log("🔵 [AlmacenView] Navegando a breadcrumb index:", index);
    console.log("🔵 [AlmacenView] routePath:", routePath.value);
    console.log("🔵 [AlmacenView] breadcrumb items:", breadcrumbFromRoute.value);

    if (!idSociety.value) return;

    // El breadcrumb tiene "Almacén" como index 0
    // Necesitamos mapear el índice del breadcrumb al path real

    if (index === 0) {
      // Click en "Almacén" → volver a raíz
      router.push(`/storage/almacen/${idSociety.value}`);
      await cargarDocumentos(null);
      return;
    }

    // Para índices > 0, necesitamos mapear al path real
    // index 1 = primera carpeta → routePath[0]
    // index 2 = segunda carpeta → routePath[0] + routePath[1]
    // etc.

    const targetPath = routePath.value.slice(0, index - 1); // -1 porque index 0 es "Almacén"

    if (targetPath.length === 0) {
      // Volver a raíz
      router.push(`/storage/almacen/${idSociety.value}`);
      await cargarDocumentos(null);
    } else {
      // Navegar a la carpeta específica
      const pathString = targetPath.join("/");
      router.push(`/storage/almacen/${idSociety.value}/${pathString}`);

      // Cargar documentos de la carpeta objetivo
      if (targetPath.length > 0) {
        const carpetaId = targetPath[targetPath.length - 1];
        if (carpetaId) {
          await _navegarACarpetaStore(carpetaId);
        }
      }
    }
  };

  // Sincronizar ruta con store cuando cambia la ruta
  watch(
    () => {
      const path = routePath.value;
      const society = idSociety.value;
      return { path: Array.isArray(path) ? path : [], society };
    },
    async ({ path: newPath, society: societyId }, oldValue) => {
      console.log("🔵 [AlmacenView] Ruta cambió:", { newPath, oldValue, societyId });

      // Manejar caso donde oldValue puede ser undefined en la primera ejecución
      const oldPathArray = oldValue?.path
        ? Array.isArray(oldValue.path)
          ? oldValue.path
          : []
        : [];
      const newPathArray = Array.isArray(newPath) ? newPath : [];

      if (!societyId) {
        console.log("🔵 [AlmacenView] No hay societyId, esperando...");
        return;
      }

      // Limpiar cache si cambió el path completamente
      if (oldPathArray.length > 0 && newPathArray.length === 0) {
        folderNamesCache.value = {};
      }

      try {
        if (newPathArray.length === 0) {
          // Estamos en la raíz
          console.log("🔵 [AlmacenView] Cargando documentos de raíz...");
          await cargarDocumentos(null);
        } else {
          // Cargar nombres de todas las carpetas del path si no están en cache
          for (const folderId of newPathArray) {
            if (folderId && !folderNamesCache.value[folderId]) {
              await loadFolderName(folderId);
            }
          }

          // Navegar a la última carpeta del path
          if (newPathArray.length > 0) {
            const carpetaId = newPathArray[newPathArray.length - 1];
            if (carpetaId) {
              console.log("🔵 [AlmacenView] Navegando a carpeta:", carpetaId);
              await _navegarACarpetaStore(carpetaId);
            }
          }
        }
      } catch (error: any) {
        console.error("❌ [AlmacenView] Error al sincronizar ruta:", error);
      }
    },
    { immediate: true }
  );

  // Cargar documentos cuando cambie la sociedad
  watch(
    () => dashboardStore.sociedadSeleccionada?.id,
    async (sociedadId) => {
      if (sociedadId && idSociety.value !== sociedadId) {
        // Redirigir a la nueva ruta con la sociedad correcta
        const currentPath = routePath.value.join("/");
        if (currentPath) {
          router.push(`/storage/almacen/${sociedadId}/${currentPath}`);
        } else {
          router.push(`/storage/almacen/${sociedadId}`);
        }
      } else if (sociedadId) {
        await cargarDocumentos(carpetaActual.value);
      }
    }
  );

  // Filtrar documentos por búsqueda
  const documentosFiltrados = computed(() => {
    if (!searchQuery.value.trim()) return documentos.value;
    const query = searchQuery.value.toLowerCase();
    return documentos.value.filter((doc) => doc.nombre.toLowerCase().includes(query));
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

          // Intentar obtener nodeId y documentCode si están disponibles
          const nodeIdNumber = doc.nodeId ? parseInt(doc.nodeId, 10) : undefined;

          selectedDocument.value = {
            name: doc.nombre,
            type: doc.mimeType || "documento",
            owner: doc.propietario || "Sistema",
            dateModified: doc.fechaModificacion || new Date(),
            size: doc.tamaño,
            versionCode: doc.versionCode,
            mimeType: doc.mimeType,
            nodeId: nodeIdNumber && !isNaN(nodeIdNumber) ? nodeIdNumber : undefined,
            documentCode: doc.documentCode || doc.code,
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

        // Obtener versionCode y userName de las versiones del nodo
        let versionCode: string | undefined;
        let userName: string | null = null;
        if (
          node.versions &&
          Array.isArray(node.versions) &&
          node.versions.length > 0 &&
          node.versions[0]
        ) {
          versionCode = node.versions[0].versionCode;
          userName = node.versions[0].userName || null;
          console.log("🟢 [AlmacenView] versionCode obtenido del nodo:", versionCode);
          console.log("🟢 [AlmacenView] userName obtenido del nodo:", userName);
        }

        if (!versionCode) {
          console.error("❌ [AlmacenView] No se pudo obtener versionCode del documento");
          alert("No se pudo obtener la versión del documento para previsualizar");
          return;
        }

        selectedDocument.value = {
          name: node.name,
          type: node.mimeType || "documento",
          owner: userName || "Usuario desconocido",
          dateModified: new Date(node.updatedAt),
          size: node.sizeInBytes,
          versionCode: versionCode,
          mimeType: node.mimeType,
          nodeId: nodeIdNumber, // Agregar nodeId para el tab de historial
          documentCode: node.code, // Agregar documentCode para restaurar versiones
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
      console.log(
        "🔵 [AlmacenView] sociedadSeleccionada:",
        dashboardStore.sociedadSeleccionada?.id
      );

      // Si estamos en la raíz (carpetaActual es null), usar la carpeta /core/
      let parentId = carpetaActual.value;

      if (!parentId && dashboardStore.sociedadSeleccionada?.id) {
        console.log("🔵 [AlmacenView] Obteniendo carpeta /core/...");
        console.log("🔵 [AlmacenView] structureId:", dashboardStore.sociedadSeleccionada.id);
        try {
          parentId = await obtenerCarpetaDocumentosSocietarios(
            dashboardStore.sociedadSeleccionada.id
          );
          console.log("🔵 [AlmacenView] Carpeta /core/ obtenida:", parentId);

          if (!parentId) {
            const errorMsg =
              "No se pudo obtener la carpeta /core/ para crear la carpeta. La sociedad puede no tener la estructura inicializada. Por favor, contacta al administrador.";
            console.error("🔴 [AlmacenView]", errorMsg);
            alert(errorMsg);
            return;
          }
        } catch (error: any) {
          console.error("🔴 [AlmacenView] Error al obtener carpeta /core/:", error);
          const errorMsg = `No se pudo obtener la carpeta /core/ para crear la carpeta: ${
            error?.message || "Error desconocido"
          }. Asegúrate de que la sociedad tenga la estructura configurada.`;
          alert(errorMsg);
          return;
        }
      }

      if (!parentId) {
        const errorMsg =
          "No se pudo obtener la carpeta /core/ para crear la carpeta. Asegúrate de que la sociedad tenga la estructura configurada.";
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
      router.push(`/storage/documentos-generados/${dashboardStore.sociedadSeleccionada.id}`);
    }
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
        console.log("🔵 [AlmacenView] structureId:", structureId);
        try {
          const carpetaCoreId = await obtenerCarpetaDocumentosSocietarios(structureId);
          console.log("🔵 [AlmacenView] Carpeta /core/ obtenida:", carpetaCoreId);
          parentNodeIdForUpload.value = carpetaCoreId;

          if (!carpetaCoreId) {
            console.warn(
              "⚠️ [AlmacenView] No se pudo obtener la carpeta /core/. El botón de subir no funcionará."
            );
            console.warn(
              "⚠️ [AlmacenView] La sociedad puede no tener la estructura inicializada."
            );
          }
        } catch (error: any) {
          console.error("🔴 [AlmacenView] Error al obtener carpeta /core/:", error);
          console.error("🔴 [AlmacenView] structureId usado:", structureId);
          parentNodeIdForUpload.value = null;
          console.warn(
            "⚠️ [AlmacenView] No se pudo obtener la carpeta /core/. El botón de subir no funcionará."
          );
        }
      }
    },
    { immediate: true }
  );
</script>

<template>
  <div class="h-full overflow-y-auto" style="background-color: var(--bg-muted)">
    <div class="max-w-[1600px] mx-auto px-8 py-6">
      <!-- Header con Breadcrumb -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-4">
          <FolderOpen class="w-5 h-5" :style="{ color: 'var(--primary-700)' }" />
          <template v-if="breadcrumbFromRoute.length > 0">
            <button
              v-for="(item, index) in breadcrumbFromRoute"
              :key="`${item.id}-${index}`"
              class="flex items-center gap-2 text-sm transition-colors"
              :class="index === breadcrumbFromRoute.length - 1 ? '' : 'hover:underline'"
              :style="{
                color:
                  index === breadcrumbFromRoute.length - 1
                    ? 'var(--text-primary)'
                    : 'var(--primary-700)',
                fontFamily: 'var(--font-secondary)',
                cursor: index === breadcrumbFromRoute.length - 1 ? 'default' : 'pointer',
              }"
              :disabled="index === breadcrumbFromRoute.length - 1"
              @click="navegarABreadcrumb(index)"
            >
              {{ item.nombre }}
              <ChevronRight
                v-if="index < breadcrumbFromRoute.length - 1"
                class="w-4 h-4"
                :style="{ color: 'var(--text-muted)' }"
              />
            </button>
          </template>
          <template v-else>
            <span
              class="text-sm"
              :style="{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-secondary)',
              }"
            >
              Almacén
            </span>
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
                    color: vista === 'grid' ? 'var(--primary-700)' : 'var(--text-muted)',
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
                    color: vista === 'list' ? 'var(--primary-700)' : 'var(--text-muted)',
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
        <p class="text-sm" :style="{ color: 'var(--text-muted)' }">Cargando documentos...</p>
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
            <div class="p-4 rounded-lg" style="background-color: #eef2ff">
              <Folder class="w-8 h-8" :style="{ color: 'var(--primary-700)' }" />
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
            <p :style="{ color: 'var(--text-muted)' }">Sistema</p>
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
          <!-- Thumbnail o Icono -->
          <div class="flex items-center justify-center mb-3">
            <!-- Para archivos, mostrar FileThumbnail si está en modo grid -->
            <FileThumbnail
              v-if="doc.tipo === 'file' && vista === 'grid'"
              :file-name="doc.nombre"
              :node-code="doc.code"
              :version-code="doc.versionCode"
              :mime-type="doc.mimeType"
              :show-thumbnail="true"
              class="w-full"
            />
            <!-- Para carpetas o modo lista, mostrar icono -->
            <div
              v-else-if="doc.tipo === 'folder'"
              class="p-4 rounded-lg"
              style="background-color: #eef2ff"
            >
              <Folder class="w-8 h-8" :style="{ color: 'var(--primary-700)' }" />
            </div>
            <div v-else class="p-4 rounded-lg" style="background-color: #fee2e2">
              <FileText class="w-8 h-8" style="color: #dc2626" />
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
                <button class="p-1 rounded-lg hover:bg-gray-100 transition-colors" @click.stop>
                  <MoreVertical class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click.stop="handleDocumentClick(doc)">
                  <Eye class="w-4 h-4 mr-2" />
                  Vista previa
                </DropdownMenuItem>
                <DropdownMenuItem v-if="doc.tipo === 'file'" @click.stop="handleDownload(doc)">
                  <Download class="w-4 h-4 mr-2" />
                  Descargar
                </DropdownMenuItem>
                <DropdownMenuItem class="text-red-600" @click.stop="handleDelete(doc)">
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
            <tr class="bg-gray-50 border-b" :style="{ borderColor: 'var(--border-light)' }">
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
                  <div class="p-2 rounded-lg" style="background-color: #eef2ff">
                    <Folder class="w-4 h-4" :style="{ color: 'var(--primary-700)' }" />
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
                    style="background-color: #eef2ff"
                  >
                    <Folder class="w-4 h-4" :style="{ color: 'var(--primary-700)' }" />
                  </div>
                  <div v-else class="p-2 rounded-lg" style="background-color: #fee2e2">
                    <FileText class="w-4 h-4" style="color: #dc2626" />
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
                      <MoreVertical class="w-4 h-4" :style="{ color: 'var(--text-muted)' }" />
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
                    <DropdownMenuItem class="text-red-600" @click.stop="handleDelete(doc)">
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
