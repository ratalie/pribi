<script setup lang="ts">
  import { X, Loader2, Upload } from "lucide-vue-next";
  import { usePrevisualizarDocumento } from "~/core/presentation/repositorio/composables/usePrevisualizarDocumento";
  import { useActualizarNombreDocumento } from "~/core/presentation/repositorio/composables/useActualizarNombreDocumento";
  import { useVersionesDocumento } from "~/core/presentation/repositorio/composables/useVersionesDocumento";
  import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
  import {
    useDocumentViewer,
    type DocumentFile,
  } from "~/core/presentation/repositorio/composables/useDocumentViewer";
  import GeneralTab from "./GeneralTab.vue";
  import HistoryTab from "./HistoryTab.vue";
  import UploadVersionPopover from "./UploadVersionPopover.vue";
  import DocumentToolbar from "./DocumentToolbar.vue";
  import DocumentPreview from "./DocumentPreview.vue";
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
      const codeToUse = selectedVersion || versionCode;

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
        await nextTick();
        console.log("✅ [PreviewModal] Viewer limpiado, preparando DocumentFile...");

        // Obtener el mimeType de la versión específica si está seleccionada
        let mimeTypeToUse = getDocumentMimeType();
        let fileNameToUse = getDocumentName();

        // Si hay una versión seleccionada específica, usar su mimeType
        if (selectedVersion && versionsList.value.length > 0) {
          const selectedVersionData = versionsList.value.find((v) => v.id === selectedVersion);
          if (selectedVersionData) {
            console.log("📋 [PreviewModal] Usando mimeType de versión seleccionada:", {
              versionCode: selectedVersion,
              versionMimeType: selectedVersionData.mimeType,
              versionTitle: selectedVersionData.title,
              previousMimeType: mimeTypeToUse,
            });
            mimeTypeToUse = selectedVersionData.mimeType || mimeTypeToUse;
            fileNameToUse = selectedVersionData.title || fileNameToUse;
          } else {
            console.warn("⚠️ [PreviewModal] Versión seleccionada no encontrada en la lista:", {
              selectedVersion,
              availableVersions: versionsList.value.map((v) => v.id),
            });
          }
        }

        // Inferir mimeType desde el nombre si no está disponible
        if (!mimeTypeToUse) {
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

        // Crear objeto DocumentFile para el visor
        const documentFile: DocumentFile = {
          id: codeToUse,
          name: fileNameToUse,
          size: props.document.size || 0,
          type: mimeTypeToUse,
          mimeType: mimeTypeToUse,
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
          await loadDocument(documentFile);
          console.log("✅ [PreviewModal] Documento cargado exitosamente");
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
            const mimeTypeForPreview = mimeTypeToUse || "";
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
  const handleVersionSelected = (versionCode: string, isCurrentVersion: boolean) => {
    console.log("🟡 [PreviewModal] Versión seleccionada desde HistoryTab:", {
      versionCode,
      isCurrentVersion,
      previousSelectedVersion: selectedVersionCode.value,
      totalVersions: versionsList.value.length,
      availableVersions: versionsList.value.map((v) => ({ id: v.id, title: v.title, mimeType: v.mimeType })),
    });
    
    // Actualizar la versión seleccionada (esto disparará el watch principal que hará el cleanup)
    selectedVersionCode.value = versionCode;
    
    const version = versionsList.value.find((v) => v.id === versionCode);
    if (version) {
      console.log("🟡 [PreviewModal] Versión encontrada en lista:", {
        versionCode: version.id,
        versionMimeType: version.mimeType,
        versionTitle: version.title,
        versionNumber: version.versionNumber,
        isCurrentVersion: version.isCurrentVersion,
      });
    } else {
      console.warn("⚠️ [PreviewModal] Versión NO encontrada en lista:", {
        requestedVersionCode: versionCode,
        availableVersions: versionsList.value.map((v) => v.id),
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

        await cargarVersionesDesdeNodo(props.document.nodeId);

        // Obtener el nodo actualizado para actualizar el versionCode
        const repository = new RepositorioDocumentosHttpRepository();
        const updatedNode = await repository.obtenerNodoPorId(props.document.nodeId);

        if (updatedNode && updatedNode.versions && updatedNode.versions.length > 0) {
          // Encontrar la versión actual (isCurrentVersion = true)
          const currentVersion = updatedNode.versions.find((v: any) => v.isCurrentVersion);
          if (currentVersion) {
            // Limpiar la versión seleccionada para cargar la actual
            // Esto disparará el watch principal que recargará el documento
            selectedVersionCode.value = "";
            
            // Esperar un tick adicional para asegurar que el cleanup terminó
            await nextTick();
          }
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

    // Recargar versiones en HistoryTab si está disponible
    if (historyTabRef.value) {
      try {
        historyTabRef.value.recargarVersiones();
      } catch (error) {
        console.error("❌ [PreviewModal] Error al recargar versiones en HistoryTab:", error);
      }
    }

    // También recargar usando el composable como fallback
    if (props.document?.nodeId) {
      try {
        // Obtener el nuevo nodo para actualizar el documentCode y versionCode
        const repository = new RepositorioDocumentosHttpRepository();
        const updatedNode = await repository.obtenerNodoPorId(props.document.nodeId);

        if (updatedNode && updatedNode.versions && updatedNode.versions.length > 0) {
          // Recargar versiones usando el composable
          await cargarVersionesDesdeNodo(props.document.nodeId);

          // Encontrar la versión actual (isCurrentVersion = true)
          const currentVersion = updatedNode.versions.find((v: any) => v.isCurrentVersion);
          if (currentVersion) {
            // Limpiar la versión seleccionada para cargar la nueva versión actual
            // Esto disparará el watch principal que recargará el documento
            selectedVersionCode.value = "";
            
            // Esperar un tick adicional para asegurar que el cleanup terminó
            await nextTick();
          }

          // Emitir evento para actualizar el documento en el componente padre
          emits("nameUpdated", localDocumentName.value);
        }
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
              'w-full': isPptx,
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

            <!-- Document Preview -->
            <DocumentPreview
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
            />

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
