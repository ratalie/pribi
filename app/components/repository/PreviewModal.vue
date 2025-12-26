<script setup lang="ts">
  import { X, Loader2, Upload } from "lucide-vue-next";
  import { usePrevisualizarDocumento } from "~/core/presentation/repositorio/composables/usePrevisualizarDocumento";
  import { useActualizarNombreDocumento } from "~/core/presentation/repositorio/composables/useActualizarNombreDocumento";
  import { useVersionesDocumento } from "~/core/presentation/repositorio/composables/useVersionesDocumento";
  import {
    useDocumentViewer,
    type DocumentFile,
  } from "~/core/presentation/repositorio/composables/useDocumentViewer";
  import GeneralTab from "./GeneralTab.vue";
  import HistoryTab from "./HistoryTab.vue";
  import UploadVersionPopover from "./UploadVersionPopover.vue";
  import DocumentToolbar from "./DocumentToolbar.vue";
  import DocumentPreview from "./DocumentPreview.vue";
  import VueOfficePptx from "@vue-office/pptx";
  import { Icon } from "@iconify/vue";
  import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
  import { Button } from "@/components/ui/button";
  import { ref, watch, computed, onMounted, onUnmounted, nextTick } from "vue";

  interface Document {
    name: string | true;
    type: string | true;
    owner: string;
    dateModified: Date;
    size?: number;
    versionCode?: string;
    mimeType?: string | true;
    nodeId?: number; // ID del nodo para obtener versiones
    documentCode?: string; // Código del documento (UUID) para restaurar versiones
  }

  interface Props {
    isOpen: boolean;
    document: Document | null;
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "close"): void;
    (e: "nameUpdated", name: string): void;
  }>();

  const { previsualizar } = usePrevisualizarDocumento();
  const { actualizarNombre } = useActualizarNombreDocumento();
  const { cargarVersionesDesdeNodo, versions: versionsList } = useVersionesDocumento();

  // Funciones helper para convertir valores a string de forma segura
  const getDocumentName = (): string => {
    // NO acceder a localDocumentName aquí para evitar dependencia circular
    // localDocumentName se inicializa usando esta función
    const name = props.document?.name;
    if (typeof name === "string") {
      return name;
    }
    return "documento";
  };

  const getDocumentType = (): string => {
    const type = props.document?.type;
    if (typeof type === "string") {
      return type;
    }
    return "application/octet-stream";
  };

  const getDocumentMimeType = (): string | undefined => {
    const mimeType = props.document?.mimeType;
    if (typeof mimeType === "string") {
      return mimeType;
    }
    return undefined;
  };

  // Document Viewer
  const {
    isLoading: isViewerLoading,
    error: viewerError,
    currentPage,
    totalPages,
    zoom,
    showSidebar: showViewerSidebar,
    loadDocument,
    loadPptxDocument,
    setPdfViewerRef,
    setOfficeViewerRef,
    setExcelViewerRef,
    setPptxViewerRef,
    setPreviewContainerRef,
    toggleSidebar: toggleViewerSidebar,
    zoomIn,
    zoomOut,
    setZoom,
    setPage,
    previousPage,
    nextPage,
    isPdf,
    isOffice,
    isExcel,
    isPptx,
    cleanup: cleanupViewer,
  } = useDocumentViewer();

  // Referencia al popover de subir versión
  const uploadPopoverRef = ref<InstanceType<typeof UploadVersionPopover> | null>(null);

  const previewContent = ref<{
    type: "image" | "html" | "canvas";
    content: string | HTMLCanvasElement;
  } | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const previewContainer = ref<HTMLElement | null>(null);
  const canvasContainer = ref<HTMLElement | null>(null);

  // Tabs
  const activeTab = ref<"general" | "history">("general");
  const selectedVersionCode = ref<string>("");

  // Referencias a los tabs
  const generalTabRef = ref<InstanceType<typeof GeneralTab> | null>(null);
  const historyTabRef = ref<InstanceType<typeof HistoryTab> | null>(null);

  // Referencia al componente DocumentPreview (para cargar PPTX)
  const documentPreviewRef = ref<InstanceType<typeof DocumentPreview> | null>(null);

  // Variables para PowerPoint (similar a v2.5)
  const pptxSource = ref<string | ArrayBuffer | null>(null);
  const pptxError = ref<string>("");

  // Funciones de formato (no usadas actualmente, pero pueden ser útiles)
  // const formatDate = (date: Date) => {
  //   return new Intl.DateTimeFormat("es-ES", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   }).format(date);
  // };

  // const formatSize = (bytes?: number) => {
  //   if (!bytes) return "N/A";
  //   if (bytes < 1024) return `${bytes} B`;
  //   if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  //   return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  // };

  // Determinar si podemos mostrar el tab de historial
  const canShowHistory = computed(() => {
    return Boolean(props.document?.nodeId && props.document?.documentCode);
  });

  // Cargar preview cuando se abre el modal o cambia la versión seleccionada
  watch(
    () => [props.isOpen, props.document?.versionCode, selectedVersionCode.value],
    async ([isOpen, versionCode, selectedVersion]) => {
      // Usar la versión seleccionada si existe, sino la del documento
      // Asegurar que codeToUse siempre sea string
      const codeToUse: string = (selectedVersion || versionCode) as string;

      console.log("🔵 [PreviewModal] Watch activado:", {
        isOpen,
        versionCodeFromDocument: versionCode,
        selectedVersionCode: selectedVersion,
        codeToUse,
        hasDocument: !!props.document,
        documentNodeId: props.document?.nodeId,
        documentName: props.document?.name,
        documentMimeType: props.document?.mimeType,
      });

      if (isOpen && codeToUse && props.document) {
        // Limpiar el viewer ANTES de cargar una nueva versión
        // Esperar a que el cleanup termine completamente
        console.log("🧹 [PreviewModal] Limpiando viewer antes de cargar versión:", codeToUse);
        await cleanupViewer();
        // Esperar múltiples ticks y un delay para asegurar que Vue termine de actualizar el DOM
        await nextTick();
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 150));
        console.log("✅ [PreviewModal] Viewer limpiado, preparando DocumentFile...");

        // Obtener el mimeType de la versión específica si está seleccionada
        const rawMimeType = getDocumentMimeType();
        let mimeTypeToUse: string | undefined =
          typeof rawMimeType === "string" ? rawMimeType : undefined;
        let fileNameToUse: string = getDocumentName();

        // Si hay una versión seleccionada específica, usar su información completa
        let versionSize = props.document.size || 0;
        if (selectedVersion && versionsList.value.length > 0) {
          const selectedVersionData = versionsList.value.find((v) => v.id === selectedVersion);
          if (selectedVersionData) {
            console.log("📋 [PreviewModal] Usando información de versión seleccionada:", {
              versionCode: selectedVersion,
              versionMimeType: selectedVersionData.mimeType,
              versionTitle: selectedVersionData.title,
              versionSize: selectedVersionData.sizeInBytes,
              previousMimeType: mimeTypeToUse,
              previousFileName: fileNameToUse,
            });
            mimeTypeToUse = selectedVersionData.mimeType || mimeTypeToUse;
            fileNameToUse = selectedVersionData.title || fileNameToUse;
            versionSize = selectedVersionData.sizeInBytes || versionSize;
          } else {
            console.warn("⚠️ [PreviewModal] Versión seleccionada no encontrada en la lista:", {
              selectedVersion,
              availableVersions: versionsList.value.map((v) => v.id),
            });
          }
        }

        // Inferir mimeType desde el nombre si no está disponible
        if (!mimeTypeToUse || typeof mimeTypeToUse !== "string") {
          const ext = fileNameToUse.toLowerCase().split(".").pop() || "";
          const mimeTypeMap: Record<string, string> = {
            pdf: "application/pdf",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            doc: "application/msword",
            xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            xls: "application/vnd.ms-excel",
            pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            ppt: "application/vnd.ms-powerpoint",
          };
          mimeTypeToUse = mimeTypeMap[ext] || "application/octet-stream";
          console.log("🔍 [PreviewModal] mimeType inferido desde extensión:", {
            fileName: fileNameToUse,
            extension: ext,
            inferredMimeType: mimeTypeToUse,
          });
        }

        // Asegurar que mimeTypeToUse es string (ya está garantizado arriba, pero TypeScript no lo sabe)
        const finalMimeType: string =
          typeof mimeTypeToUse === "string" ? mimeTypeToUse : "application/octet-stream";

        // Crear objeto DocumentFile para el visor con la información de la versión seleccionada
        const documentFile: DocumentFile = {
          id: codeToUse,
          name: fileNameToUse,
          size: versionSize,
          type: finalMimeType,
          mimeType: finalMimeType,
          versionCode: codeToUse,
          nodeId: props.document.nodeId || undefined,
        };

        console.log("📄 [PreviewModal] DocumentFile creado:", {
          id: documentFile.id,
          name: documentFile.name,
          mimeType: documentFile.mimeType,
          type: documentFile.type,
          versionCode: documentFile.versionCode,
          nodeId: documentFile.nodeId,
          size: documentFile.size,
        });

        try {
          // Cargar documento usando el visor
          console.log("🚀 [PreviewModal] Iniciando carga del documento...");
          // Asegurar que isViewerLoading se establece correctamente
          isViewerLoading.value = true;

          // Esperar un poco más después del cleanup para asegurar que el DOM esté listo
          await nextTick();
          await new Promise((resolve) => setTimeout(resolve, 50));

          await loadDocument(documentFile);
          console.log("✅ [PreviewModal] Documento cargado exitosamente");

          // Verificar isPptx después de loadDocument
          console.log("🔍 [PreviewModal] Verificando isPptx después de loadDocument:", {
            isPptx: isPptx.value,
            documentFileName: documentFile.name,
            documentMimeType: documentFile.mimeType,
            hasDocumentPreviewRef: !!documentPreviewRef.value,
          });

          // Si es PPTX, cargar el blob directamente (similar a v2.5)
          if (isPptx.value) {
            console.log("📊 [PreviewModal] PPTX detectado, cargando...");
            try {
              pptxError.value = "";

              // Limpiar fuente anterior
              if (pptxSource.value && typeof pptxSource.value === "string") {
                URL.revokeObjectURL(pptxSource.value);
              }
              pptxSource.value = null;

              // Descargar el archivo
              const pptxBlob = await loadPptxDocument(documentFile);

              // Crear URL para visualización
              const url = URL.createObjectURL(pptxBlob);

              // Forzar actualización con timeout para asegurar recarga (similar a v2.5)
              await new Promise((resolve) => setTimeout(resolve, 100));
              pptxSource.value = url;

              console.log("✅ [PreviewModal] PPTX cargado:", url);

              // Limpiar URL después de 5 minutos
              setTimeout(() => {
                if (pptxSource.value === url) {
                  URL.revokeObjectURL(url);
                  pptxSource.value = null;
                }
              }, 300000); // 5 minutos
            } catch (error: any) {
              console.error("❌ [PreviewModal] Error loading PowerPoint document:", error);
              pptxError.value = "Error al cargar la presentación PowerPoint";
            }
          }

          // Esperar a que Vue termine de renderizar antes de actualizar el estado de loading
          await nextTick();
          await nextTick();
          await new Promise((resolve) => setTimeout(resolve, 150));
          isViewerLoading.value = false;
        } catch (err: any) {
          console.error("❌ [PreviewModal] Error al cargar documento:", {
            error: err,
            message: err?.message,
            stack: err?.stack,
            documentFile,
          });
          // Fallback al método anterior si el visor falla
          isLoading.value = true;
          error.value = null;
          previewContent.value = null;

          try {
            const mimeTypeForPreview: string = finalMimeType;
            console.log("🔄 [PreviewModal] Intentando fallback con preview:", {
              versionCode: codeToUse,
              mimeType: mimeTypeForPreview,
            });
            const preview = await previsualizar(codeToUse, mimeTypeForPreview);
            previewContent.value = preview;

            if (preview.type === "canvas" && canvasContainer.value) {
              canvasContainer.value.appendChild(preview.content as HTMLCanvasElement);
            }
          } catch (previewErr: any) {
            console.error("❌ [PreviewModal] Error en fallback preview:", previewErr);
            error.value = previewErr.message || "Error al cargar la vista previa";
          } finally {
            isLoading.value = false;
          }
        }
      } else {
        console.log("⏭️ [PreviewModal] Condiciones no cumplidas, no se carga documento:", {
          isOpen,
          codeToUse,
          hasDocument: !!props.document,
        });
      }
    },
    { immediate: true }
  );

  // Limpiar preview al cerrar
  watch(
    () => props.isOpen,
    (isOpen) => {
      if (!isOpen) {
        previewContent.value = null;
        error.value = null;
        activeTab.value = "general";
        selectedVersionCode.value = "";
        cleanupViewer();
      }
    }
  );

  // Cargar versiones cuando se abre el modal
  watch(
    () => [props.isOpen, props.document?.nodeId],
    async ([isOpen, nodeId]) => {
      // Asegurar que nodeId es un número válido
      const nodeIdNumber = typeof nodeId === "number" ? nodeId : undefined;
      if (isOpen && nodeIdNumber) {
        console.log(
          "📋 [PreviewModal] Modal abierto, cargando versiones para nodeId:",
          nodeIdNumber
        );
        try {
          await cargarVersionesDesdeNodo(nodeIdNumber);
          console.log(
            "✅ [PreviewModal] Versiones cargadas al abrir modal:",
            versionsList.value.length
          );
        } catch (error) {
          console.error("❌ [PreviewModal] Error al cargar versiones al abrir modal:", error);
        }
      }
    },
    { immediate: true }
  );

  // Configurar referencias del visor cuando se monta
  onMounted(async () => {
    await nextTick();
    // Las referencias se configurarán cuando DocumentPreview emita los eventos
  });

  // Cleanup al desmontar
  onUnmounted(() => {
    cleanupViewer();
  });

  // Manejar selección de versión desde HistoryTab
  const handleVersionSelected = async (versionCode: string, isCurrentVersion: boolean) => {
    console.log("🟡 [PreviewModal] Versión seleccionada desde HistoryTab:", {
      versionCode,
      isCurrentVersion,
      previousSelectedVersion: selectedVersionCode.value,
      totalVersions: versionsList.value.length,
      availableVersions: versionsList.value.map((v) => ({
        id: v.id,
        title: v.title,
        mimeType: v.mimeType,
      })),
    });

    // Verificar que la versión existe en la lista antes de seleccionarla
    let version = versionsList.value.find((v) => v.id === versionCode);

    // Si no se encuentra, esperar múltiples ticks y verificar de nuevo (las versiones pueden estar cargando)
    if (!version) {
      console.warn(
        "⚠️ [PreviewModal] Versión NO encontrada en lista, esperando a que se carguen las versiones...",
        {
          requestedVersionCode: versionCode,
          availableVersions: versionsList.value.map((v) => v.id),
        }
      );

      // Esperar múltiples ticks para dar tiempo a que las versiones se carguen
      for (let i = 0; i < 5; i++) {
        await nextTick();
        await new Promise((resolve) => setTimeout(resolve, 50)); // Esperar 50ms entre cada intento
        version = versionsList.value.find((v) => v.id === versionCode);
        if (version) {
          console.log(`✅ [PreviewModal] Versión encontrada después de ${i + 1} intentos`);
          break;
        }
      }

      if (!version) {
        console.error(
          "❌ [PreviewModal] Versión no encontrada después de esperar:",
          versionCode,
          {
            availableVersions: versionsList.value.map((v) => v.id),
            totalVersions: versionsList.value.length,
          }
        );
        return;
      }
    }

    // Actualizar la versión seleccionada (esto disparará el watch principal que hará el cleanup y cargará el nuevo documento)
    // El watch principal ya maneja el cleanup, así que no necesitamos hacerlo aquí
    selectedVersionCode.value = versionCode;

    if (version) {
      console.log("✅ [PreviewModal] Versión encontrada y seleccionada:", {
        versionCode: version.id,
        versionMimeType: version.mimeType,
        versionTitle: version.title,
        versionNumber: version.versionNumber,
        isCurrentVersion: version.isCurrentVersion,
      });
    }
  };

  // Manejar restauración de versión
  const handleVersionRestored = async () => {
    console.log("🟢 [PreviewModal] Versión restaurada, recargando preview...");

    // Recargar versiones si tenemos nodeId
    if (props.document?.nodeId) {
      try {
        // Limpiar completamente el viewer PRIMERO
        await cleanupViewer();
        await nextTick();

        // Recargar versiones
        await cargarVersionesDesdeNodo(props.document.nodeId);

        // Esperar a que las versiones se carguen completamente
        await nextTick();

        // Encontrar la versión actual en la lista de versiones recargada
        const currentVersion = versionsList.value.find((v) => v.isCurrentVersion);
        if (currentVersion && currentVersion.id) {
          // Establecer el nuevo versionCode para disparar el watch y recargar el documento
          selectedVersionCode.value = currentVersion.id;
          console.log(
            "✅ [PreviewModal] Versión actualizada después de restaurar:",
            currentVersion.id
          );
        }
      } catch (error) {
        console.error("❌ [PreviewModal] Error al recargar versiones:", error);
      }
    }
  };

  // Manejar subida completa de nueva versión
  const handleUploadComplete = async () => {
    console.log("🟢 [PreviewModal] Nueva versión subida, recargando...");

    // Limpiar completamente el viewer PRIMERO
    await cleanupViewer();
    await nextTick();

    // Recargar versiones si tenemos nodeId
    if (props.document?.nodeId) {
      try {
        // Solo recargar usando el composable (HistoryTab se actualizará automáticamente)
        await cargarVersionesDesdeNodo(props.document.nodeId);

        // Esperar a que las versiones se carguen completamente
        await nextTick();

        // Encontrar la versión actual en la lista de versiones recargada
        const currentVersion = versionsList.value.find((v) => v.isCurrentVersion);
        if (currentVersion && currentVersion.id) {
          // Establecer el nuevo versionCode para disparar el watch y recargar el documento
          selectedVersionCode.value = currentVersion.id;
          console.log(
            "✅ [PreviewModal] Versión actualizada después de subir:",
            currentVersion.id
          );
        }

        // Emitir evento para actualizar el documento en el componente padre
        emits("nameUpdated", localDocumentName.value);
      } catch (error) {
        console.error("❌ [PreviewModal] Error al recargar versiones:", error);
      }
    }
  };

  // Manejar mostrar historial después de subir
  const handleShowHistory = () => {
    activeTab.value = "history";
  };

  // Estado para el nombre local (para detectar cambios)
  const localDocumentName = ref(getDocumentName());

  // Sincronizar cuando cambie el documento
  watch(
    () => props.document?.name,
    (newName) => {
      if (newName && typeof newName === "string") {
        localDocumentName.value = newName;
      }
    },
    { immediate: true }
  );

  // Detectar si hay cambios pendientes
  const hasChanges = computed(() => {
    return localDocumentName.value !== getDocumentName();
  });

  // Manejar actualización de nombre (solo emite, no guarda)
  const handleNameUpdate = (newName: string) => {
    localDocumentName.value = newName;
    // NO hacer fetch automático, solo actualizar el estado local
  };

  // Manejar guardar cambios
  const handleSaveChanges = async () => {
    if (!props.document?.nodeId || !hasChanges.value) {
      return;
    }

    try {
      await actualizarNombre(props.document.nodeId, localDocumentName.value);

      // Emitir evento para actualizar el documento en el componente padre
      emits("nameUpdated", localDocumentName.value);

      // Actualizar también el nombre en el header usando localDocumentName
      // El watch ya sincroniza localDocumentName cuando cambia props.document?.name
      // Pero aquí forzamos la actualización después de guardar
    } catch (error: any) {
      console.error("❌ [PreviewModal] Error al actualizar nombre:", error);
      // El toast ya se muestra en el composable
    }
  };

  // Manejar revertir cambios
  const handleRevertChanges = () => {
    localDocumentName.value = getDocumentName();
  };

  // Callbacks para VueOfficePptx (similar a v2.5)
  function onPptxRendered() {
    console.log("✅ [PreviewModal] PowerPoint presentation rendered successfully");
    pptxError.value = "";
  }

  function onPptxError(error: any) {
    console.error("❌ [PreviewModal] PowerPoint rendering error:", error);
    pptxError.value = "Error al renderizar la presentación PowerPoint";
  }

  // Descargar presentación PowerPoint
  async function handleDownloadPptx() {
    if (!props.document?.versionCode && !selectedVersionCode.value) {
      console.error("❌ [PreviewModal] No hay versionCode para descargar");
      return;
    }

    try {
      const versionCodeToUse = selectedVersionCode.value || props.document?.versionCode;
      if (!versionCodeToUse) {
        console.error("❌ [PreviewModal] No se encontró versionCode");
        return;
      }

      const repository = new RepositorioDocumentosHttpRepository();
      const blob = await repository.descargarVersion(versionCodeToUse);

      // Crear URL temporal y descargar
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getDocumentName();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("✅ [PreviewModal] PPTX descargado exitosamente");
    } catch (error: any) {
      console.error("❌ [PreviewModal] Error al descargar PPTX:", error);
    }
  }

  // Abrir presentación PowerPoint en nueva pestaña
  function handleOpenPptxInNewTab() {
    if (pptxSource.value && typeof pptxSource.value === "string") {
      window.open(pptxSource.value, "_blank");
    }
  }
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 bg-gray-900 flex flex-col z-50">
        <!-- Header -->
        <div
          class="flex items-center justify-between p-4 border-b bg-gray-800"
          :style="{ borderColor: 'var(--border-light)' }"
        >
          <div class="flex-1 min-w-0">
            <h3
              class="text-lg truncate text-white"
              :style="{
                fontFamily: 'var(--font-primary)',
                fontWeight: 600,
              }"
            >
              {{ localDocumentName || "Vista Previa" }}
            </h3>
            <p class="text-xs mt-1 text-gray-400">
              {{ getDocumentType() }}
            </p>
          </div>
          <button
            class="ml-4 p-2 rounded-lg hover:bg-gray-700 transition-colors text-white"
            @click="emits('close')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Main Content: Split View -->
        <div class="flex flex-1 overflow-hidden w-full">
          <!-- Left Side: Preview with Toolbar -->
          <div
            class="flex-1 flex flex-col bg-gray-100 overflow-hidden"
            :class="{
              'w-2/3 max-w-2/3': showViewerSidebar && !isPptx,
              'w-full': isPptx && !showViewerSidebar,
              'w-2/3': isPptx && showViewerSidebar,
            }"
          >
            <!-- Toolbar (solo para PDFs) -->
            <DocumentToolbar
              v-if="isPdf && !isViewerLoading && !viewerError"
              :current-page="currentPage"
              :total-pages="totalPages"
              :zoom="zoom"
              :show-sidebar="showViewerSidebar"
              @zoom-in="zoomIn"
              @zoom-out="zoomOut"
              @zoom-change="setZoom"
              @page-change="setPage"
              @previous-page="previousPage"
              @next-page="nextPage"
              @toggle-sidebar="toggleViewerSidebar"
            />

            <!-- Barra de herramientas simplificada para PowerPoint (similar a v2.5) -->
            <div
              v-if="isPptx && !isViewerLoading"
              class="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between"
            >
              <div class="flex items-center gap-4">
                <h3 class="text-sm font-medium text-gray-700">{{ getDocumentName() }}</h3>
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="toggleViewerSidebar"
                  class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  :title="
                    showViewerSidebar ? 'Ocultar panel lateral' : 'Mostrar panel lateral'
                  "
                >
                  <Icon
                    :icon="showViewerSidebar ? 'heroicons:x-mark' : 'heroicons:bars-3'"
                    width="20"
                    height="20"
                  />
                </button>
                <button
                  @click="handleDownloadPptx"
                  class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Descargar presentación"
                >
                  <Icon icon="heroicons:arrow-down-tray" width="20" height="20" />
                </button>
                <button
                  @click="handleOpenPptxInNewTab"
                  v-if="typeof pptxSource === 'string'"
                  class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Abrir en nueva pestaña"
                >
                  <Icon icon="heroicons:arrow-top-right-on-square" width="20" height="20" />
                </button>
              </div>
            </div>

            <!-- Document Preview -->
            <DocumentPreview
              ref="documentPreviewRef"
              :is-pdf="isPdf"
              :is-office="isOffice"
              :is-pptx="isPptx"
              :is-excel="isExcel"
              :is-loading="isViewerLoading || isLoading"
              :error="viewerError || error || ''"
              :file-name="getDocumentName()"
              :file-mime-type="getDocumentMimeType()"
              @mounted="setPdfViewerRef"
              @office-mounted="setOfficeViewerRef"
              @excel-mounted="setExcelViewerRef"
              @pptx-mounted="setPptxViewerRef"
              @preview-container-mounted="setPreviewContainerRef"
            >
              <!-- Slot para PowerPoint (similar a v2.5) -->
              <template #pptx-viewer>
                <div v-if="isPptx" class="w-full h-full flex flex-col">
                  <!-- Vista previa completa con VueOfficePptx -->
                  <div
                    v-if="pptxSource && typeof pptxSource === 'string'"
                    class="flex-1 w-full h-full"
                  >
                    <VueOfficePptx
                      :src="pptxSource"
                      style="height: 100%; width: 100%; border: none"
                      @rendered="onPptxRendered"
                      @error="onPptxError"
                    />
                  </div>

                  <!-- Fallback UI si no hay fuente o hay error -->
                  <div v-else class="flex-1 flex flex-col items-center justify-center p-8">
                    <div class="text-center">
                      <div class="text-6xl mb-4">📊</div>
                      <h2 class="text-2xl font-bold text-gray-700 mb-4">
                        Presentación PowerPoint
                      </h2>
                      <p class="text-gray-500 mb-6">{{ getDocumentName() }}</p>
                      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p class="text-blue-800 text-sm">
                          {{ pptxError || "Cargando presentación..." }}
                        </p>
                      </div>
                      <div class="flex gap-4 justify-center">
                        <button
                          @click="handleDownloadPptx"
                          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          📥 Descargar Presentación
                        </button>
                        <button
                          @click="handleOpenPptxInNewTab"
                          v-if="typeof pptxSource === 'string'"
                          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          🔗 Abrir en Nueva Pestaña
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </DocumentPreview>

            <!-- Fallback: Preview anterior si el visor no está disponible -->
            <div
              v-if="!isPdf && !isOffice && !isPptx && !isExcel && previewContent"
              class="flex-1 overflow-auto p-6"
            >
              <div
                ref="previewContainer"
                class="w-full min-h-[500px] bg-gray-50 rounded-lg flex items-center justify-center border-2"
                :class="{
                  'border-dashed': isLoading || error || !previewContent,
                  'border-solid': previewContent && !isLoading && !error,
                }"
                :style="{ borderColor: 'var(--border-light)' }"
              >
                <!-- Loading -->
                <div v-if="isLoading" class="text-center">
                  <Loader2
                    class="w-8 h-8 animate-spin mx-auto mb-4"
                    :style="{ color: 'var(--primary-600)' }"
                  />
                  <p class="text-sm" :style="{ color: 'var(--text-muted)' }">
                    Cargando vista previa...
                  </p>
                </div>

                <!-- Error -->
                <div v-else-if="error" class="text-center">
                  <p class="text-lg mb-2" :style="{ color: 'var(--text-danger)' }">
                    Error al cargar vista previa
                  </p>
                  <p class="text-sm" :style="{ color: 'var(--text-muted)' }">
                    {{ error }}
                  </p>
                </div>

                <!-- Preview Content -->
                <div v-else-if="previewContent" class="w-full h-full overflow-auto">
                  <!-- Image Preview -->
                  <img
                    v-if="previewContent.type === 'image'"
                    :src="previewContent.content as string"
                    :alt="getDocumentName()"
                    class="max-w-full h-auto mx-auto"
                  />

                  <!-- HTML Preview -->
                  <div
                    v-else-if="previewContent.type === 'html'"
                    class="bg-white p-8 max-w-4xl mx-auto"
                    v-html="previewContent.content as string"
                  />

                  <!-- Canvas Preview (PDF) -->
                  <div
                    v-else-if="previewContent.type === 'canvas'"
                    class="flex justify-center items-center p-4"
                    ref="canvasContainer"
                  />
                </div>

                <!-- No Preview Available -->
                <div v-else class="text-center">
                  <p class="text-lg mb-2" :style="{ color: 'var(--text-muted)' }">
                    Vista previa no disponible
                  </p>
                  <p class="text-sm" :style="{ color: 'var(--text-muted)' }">
                    El documento se abrirá en una nueva ventana al descargar
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side: Sidebar with Tabs -->
          <div
            v-if="showViewerSidebar && !isPptx"
            class="w-96 flex flex-col border-l bg-white"
            :style="{ borderColor: 'var(--border-light)' }"
          >
            <!-- Header con botón de subir versión -->
            <div
              class="flex items-center justify-between p-4 border-b overflow-visible"
              :style="{ borderColor: 'var(--border-light)' }"
            >
              <div class="flex gap-2">
                <button
                  class="px-4 py-2 text-sm font-semibold transition-colors border-b-2"
                  :class="
                    activeTab === 'general'
                      ? 'text-primary border-primary'
                      : 'text-gray-700 border-transparent hover:text-primary'
                  "
                  @click="activeTab = 'general'"
                >
                  General
                </button>
                <button
                  v-if="canShowHistory"
                  class="px-4 py-2 text-sm font-semibold transition-colors border-b-2"
                  :class="
                    activeTab === 'history'
                      ? 'text-primary border-primary'
                      : 'text-gray-700 border-transparent hover:text-primary'
                  "
                  @click="activeTab = 'history'"
                >
                  Historial
                </button>
              </div>

              <!-- Botón Subir Nueva Versión -->
              <div v-if="document?.documentCode" class="relative">
                <Button variant="outline" size="sm" @click.stop="uploadPopoverRef?.open()">
                  <Upload class="w-4 h-4 mr-2" />
                  Subir Versión
                </Button>

                <UploadVersionPopover
                  ref="uploadPopoverRef"
                  :document-code="document.documentCode"
                  @upload-complete="handleUploadComplete"
                  @show-history="handleShowHistory"
                />
              </div>
            </div>

            <!-- Tab Content -->
            <div class="flex-1 overflow-auto p-6">
              <!-- General Tab -->
              <GeneralTab
                v-if="activeTab === 'general'"
                ref="generalTabRef"
                :document-name="localDocumentName"
                :upload-date="document?.dateModified || new Date()"
                :file-size="document?.size"
                :uploaded-by="document?.owner"
                :can-edit="true"
                @update-name="handleNameUpdate"
              />

              <!-- History Tab -->
              <HistoryTab
                v-else-if="
                  activeTab === 'history' && document?.nodeId && document?.documentCode
                "
                ref="historyTabRef"
                :node-id="document.nodeId"
                :document-code="document.documentCode"
                :selected-version-code="selectedVersionCode"
                @version-selected="handleVersionSelected"
                @version-restored="handleVersionRestored"
              />
            </div>

            <!-- Botones de acción - Solo en pestaña General y si hay cambios -->
            <div
              v-if="activeTab === 'general' && hasChanges"
              class="flex gap-3 p-6 border-t border-gray-200"
            >
              <button
                class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                @click="handleRevertChanges"
              >
                Revertir
              </button>
              <button
                class="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors text-sm font-medium text-white"
                @click="handleSaveChanges"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }

  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }

  .modal-enter-active .relative,
  .modal-leave-active .relative {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .modal-enter-from .relative,
  .modal-leave-to .relative {
    transform: scale(0.95);
    opacity: 0;
  }
</style>
