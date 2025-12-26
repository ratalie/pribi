import * as pdfjsLib from "pdfjs-dist";
import { computed, markRaw, nextTick, ref } from "vue";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import { DocumentPreviewService } from "~/core/hexag/repositorio/infrastructure/services/document-preview.service";

// Configurar worker de PDF.js directamente (como V2.5)
const getWorkerSrc = (): string => {
  // @ts-expect-error - import.meta is available in Nuxt/Vite
  if (import.meta.env?.DEV) {
    return "/pdf.worker.min.mjs";
  }
  return "/pdf.worker.min.mjs";
};

pdfjsLib.GlobalWorkerOptions.workerSrc = getWorkerSrc();

export interface DocumentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  mimeType?: string;
  versionCode?: string;
  nodeId?: number;
}

export function useDocumentViewer() {
  // Estado del visor
  const isLoading = ref(true);
  const error = ref("");
  const currentPage = ref(1);
  const totalPages = ref(1);
  const zoom = ref(100);
  const showSidebar = ref(true);

  // Referencias para el PDF
  const currentPdf = ref<any>(null);
  const pdfViewerRef = ref<HTMLElement | null>(null);
  const officeViewerRef = ref<HTMLElement | null>(null);
  const excelViewerRef = ref<HTMLElement | null>(null);
  const pptxViewerRef = ref<HTMLElement | null>(null);
  const previewContainerRef = ref<HTMLElement | null>(null);

  // Documento actual
  const currentDocument = ref<DocumentFile | null>(null);

  // Documento pendiente (para manejar race conditions)
  const pendingDocument = ref<DocumentFile | null>(null);

  // Métodos de navegación y zoom
  function toggleSidebar() {
    showSidebar.value = !showSidebar.value;
  }

  function zoomIn() {
    if (zoom.value < 200) {
      zoom.value += 25;
      updateZoom();
    }
  }

  function zoomOut() {
    if (zoom.value > 50) {
      zoom.value -= 25;
      updateZoom();
    }
  }

  // Debounce para zoom (evitar re-renderizar demasiado rápido)
  let zoomTimeout: ReturnType<typeof setTimeout> | null = null;

  function setZoom(newZoom: number) {
    if (newZoom >= 50 && newZoom <= 200) {
      zoom.value = newZoom;

      // Limpiar timeout anterior
      if (zoomTimeout) {
        clearTimeout(zoomTimeout);
      }

      // Debounce: esperar 300ms antes de actualizar el zoom
      zoomTimeout = setTimeout(() => {
        updateZoom();
        zoomTimeout = null;
      }, 300);
    }
  }

  function updateZoom() {
    // Limpiar cache al cambiar zoom (necesitamos re-renderizar con nueva escala)
    renderedPagesCache.clear();

    // Re-renderizar el PDF con el nuevo zoom si está disponible
    // IMPORTANTE: Verificar que el PDF aún sea válido (no destruido)
    if (currentPdf.value && pdfViewerRef.value) {
      try {
        // Verificar que el PDF tenga las propiedades necesarias (intenta acceder a una propiedad básica)
        if (currentPdf.value.numPages && currentPdf.value.numPages > 0) {
          renderPdfInContainer(currentPdf.value, pdfViewerRef.value);
        } else {
          console.warn("⚠️ [useDocumentViewer] PDF inválido, no se puede aplicar zoom");
        }
      } catch (error) {
        console.error("❌ [useDocumentViewer] Error al aplicar zoom:", error);
        // Si el PDF está destruido, intentar recargarlo
        if (currentDocument.value) {
          console.log("🟡 [useDocumentViewer] Intentando recargar documento...");
          loadPdfDocumentWithPending(currentDocument.value);
        }
      }
    }
  }

  // Establecer página específica
  function setPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      scrollToPage(page);
    }
  }

  // Hacer scroll a una página específica
  function scrollToPage(pageNumber: number) {
    if (!previewContainerRef.value) {
      return;
    }

    // Buscar el elemento de la página específica
    const pageElements = previewContainerRef.value.querySelectorAll("[data-page-number]");
    const targetPageElement = Array.from(pageElements).find(
      (element) => element.getAttribute("data-page-number") === pageNumber.toString()
    );

    if (targetPageElement) {
      // Hacer scroll suave a la página
      targetPageElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });

      // Actualizar la página actual
      currentPage.value = pageNumber;
    }
  }

  // Cambiar a la página anterior
  function previousPage() {
    if (currentPage.value > 1) {
      scrollToPage(currentPage.value - 1);
    }
  }

  // Cambiar a la página siguiente
  function nextPage() {
    if (currentPage.value < totalPages.value) {
      scrollToPage(currentPage.value + 1);
    }
  }

  // Detectar la página actual basada en el scroll
  function detectCurrentPage() {
    if (!previewContainerRef.value) return;

    const pageElements = previewContainerRef.value.querySelectorAll("[data-page-number]");
    const containerRect = previewContainerRef.value.getBoundingClientRect();
    const containerTop = containerRect.top;
    const containerHeight = containerRect.height;

    let currentVisiblePage = 1;
    let minDistance = Infinity;

    pageElements.forEach((element) => {
      const elementRect = element.getBoundingClientRect();
      const elementTop = elementRect.top;
      const elementHeight = elementRect.height;

      // Calcular qué tan centrada está la página en el viewport
      const elementCenter = elementTop + elementHeight / 2;
      const containerCenter = containerTop + containerHeight / 2;
      const distance = Math.abs(elementCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        currentVisiblePage = parseInt(element.getAttribute("data-page-number") || "1");
      }
    });

    if (currentVisiblePage !== currentPage.value) {
      currentPage.value = currentVisiblePage;
    }
  }

  // Agregar listener de scroll al contenedor de preview
  function addScrollListener() {
    if (previewContainerRef.value) {
      previewContainerRef.value.addEventListener("scroll", detectCurrentPage, {
        passive: true,
      });
    }
  }

  // Remover listener de scroll
  function removeScrollListener() {
    if (previewContainerRef.value) {
      previewContainerRef.value.removeEventListener("scroll", detectCurrentPage);
    }
  }

  // Cache de páginas renderizadas para evitar re-renderizar (no usado actualmente pero se mantiene por compatibilidad)
  const renderedPagesCache = new Map<number, HTMLCanvasElement>();

  // Renderizar PDF en el contenedor (simplificado como V2.5 - renderizar todas las páginas)
  async function renderPdfInContainer(pdf: any, container: HTMLElement) {
    try {
      // Limpiar completamente el contenedor para evitar caché visual
      container.innerHTML = "";
      void container.offsetHeight;

      // Crear un contenedor para todas las páginas
      const pagesContainer = document.createElement("div");
      pagesContainer.style.display = "flex";
      pagesContainer.style.flexDirection = "column";
      pagesContainer.style.alignItems = "center";
      pagesContainer.style.gap = "20px";
      pagesContainer.style.padding = "20px";
      pagesContainer.style.backgroundColor = "#f5f5f5"; // Fondo gris como V2.5

      // Renderizar todas las páginas (como V2.5)
      for (let pageNum = 1; pageNum <= totalPages.value; pageNum++) {
        // Obtener la página
        const page = await pdf.getPage(pageNum);

        // Crear contenedor para esta página
        const pageContainer = document.createElement("div");
        pageContainer.style.position = "relative";
        pageContainer.style.marginBottom = "20px";
        pageContainer.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        pageContainer.style.borderRadius = "8px";
        pageContainer.style.overflow = "hidden";
        pageContainer.style.backgroundColor = "white";
        pageContainer.setAttribute("data-page-number", pageNum.toString());

        // Crear canvas para la página
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("No se pudo obtener el contexto del canvas");
        }

        // Calcular escala para ajustar al contenedor
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = container.clientWidth - 80; // Margen de 40px en cada lado
        const baseScale = containerWidth / viewport.width;
        const finalScale = baseScale * (zoom.value / 100); // Aplicar zoom del usuario
        const scaledViewport = page.getViewport({ scale: finalScale });

        // Configurar canvas
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        canvas.style.maxWidth = "100%";
        canvas.style.height = "auto";
        canvas.style.display = "block";

        // Renderizar página
        await page.render({
          canvasContext: context,
          viewport: scaledViewport,
        }).promise;

        // Agregar canvas al contenedor de la página
        pageContainer.appendChild(canvas);

        // Agregar número de página en la parte inferior
        const pageNumberDiv = document.createElement("div");
        pageNumberDiv.style.textAlign = "center";
        pageNumberDiv.style.padding = "10px";
        pageNumberDiv.style.backgroundColor = "#f8f9fa";
        pageNumberDiv.style.borderTop = "1px solid #e9ecef";
        pageNumberDiv.style.fontSize = "14px";
        pageNumberDiv.style.color = "#6c757d";
        pageNumberDiv.innerHTML = "";
        pageNumberDiv.setAttribute("data-page-number", pageNum.toString());

        pageContainer.appendChild(pageNumberDiv);

        // Agregar la página al contenedor principal
        pagesContainer.appendChild(pageContainer);
      }

      // Agregar el contenedor de páginas al contenedor principal
      container.appendChild(pagesContainer);
    } catch (error) {
      console.error("Error renderizando PDF:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <p>Error al renderizar el PDF</p>
          <p>${errorMessage}</p>
        </div>
      `;
    }
  }

  // Cargar documento PDF
  async function loadPdfDocument(file: DocumentFile, pdfViewer?: HTMLElement) {
    try {
      if (!file.versionCode) {
        throw new Error("No se encontró el código de versión del documento");
      }

      // Limpiar PDF anterior antes de cargar uno nuevo
      if (currentPdf.value) {
        try {
          // Intentar destruir el PDF anterior para liberar recursos
          if (typeof currentPdf.value.destroy === "function") {
            await currentPdf.value.destroy();
          }
        } catch (destroyError: any) {
          // Ignorar errores si el PDF ya está destruido o en un estado inválido
          console.warn(
            "⚠️ [useDocumentViewer] Error al destruir PDF anterior:",
            destroyError?.message || destroyError
          );
        } finally {
          // Asegurar que siempre se limpia la referencia
          currentPdf.value = null;
        }
      }

      // Limpiar contenedor antes de cargar
      const container = pdfViewer || pdfViewerRef.value;
      if (container) {
        container.innerHTML = "";
      }

      const repository = new RepositorioDocumentosHttpRepository();

      // Obtener mimeType del archivo antes de usar
      const expectedMimeType = file.mimeType || file.type || "";

      console.log("📥 [useDocumentViewer] Descargando versión del backend:", {
        versionCode: file.versionCode,
        expectedType: expectedMimeType,
        fileName: file.name,
      });

      const fileBlob = await repository.descargarVersion(file.versionCode);

      // Validar que el blob no esté vacío y tenga el tipo correcto
      if (fileBlob.size === 0) {
        console.error("❌ [useDocumentViewer] Blob descargado está VACÍO");
        throw new Error("El archivo descargado está vacío");
      }

      console.log("📦 [useDocumentViewer] Blob descargado del backend:", {
        size: fileBlob.size,
        blobType: fileBlob.type,
        expectedMimeType: expectedMimeType,
        versionCode: file.versionCode,
        fileName: file.name,
        sizeMatches: fileBlob.size === file.size,
      });

      // Validar que sea un PDF (opcional, pero ayuda a detectar problemas temprano)
      const arrayBuffer = await fileBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Verificar el header del archivo para detectar el tipo real
      const header = String.fromCharCode.apply(null, Array.from(uint8Array.slice(0, 4)));
      const firstBytes = String.fromCharCode.apply(null, Array.from(uint8Array.slice(0, 100)));

      console.log("🔍 [useDocumentViewer] Validando header del archivo:", {
        header,
        firstBytesPreview: firstBytes.substring(0, 50),
        expectedMimeType: expectedMimeType,
        fileName: file.name,
        versionCode: file.versionCode,
        isPDFHeader: header.startsWith("%PDF"),
        isOfficeHeader: header.startsWith("PK"),
        isHTMLResponse:
          firstBytes.trim().startsWith("<!DOCTYPE") || firstBytes.trim().startsWith("<html"),
      });

      // También verificar si es HTML (posible error del backend)
      if (firstBytes.trim().startsWith("<!DOCTYPE") || firstBytes.trim().startsWith("<html")) {
        console.error(
          "❌ [useDocumentViewer] El backend devolvió HTML en lugar del archivo:",
          {
            header,
            firstBytes: firstBytes.substring(0, 200),
            versionCode: file.versionCode,
            fileName: file.name,
          }
        );
        throw new Error(
          "Error del servidor: El archivo solicitado no está disponible. Por favor, intenta nuevamente."
        );
      }

      // Validar que el archivo sea realmente un PDF antes de intentar cargarlo
      if (!header.startsWith("%PDF")) {
        // Verificar si el archivo es realmente un tipo Office (PK header indica ZIP/Office)
        if (header.startsWith("PK")) {
          const detectedMimeType = file.mimeType || file.type || fileBlob.type;
          console.error(
            "❌ [useDocumentViewer] DISCREPANCIA: Se intentó cargar como PDF pero el archivo es Office:",
            {
              header,
              detectedMimeType,
              fileName: file.name,
              versionCode: file.versionCode,
              expectedMimeType: expectedMimeType,
              blobType: fileBlob.type,
              fullFile: file,
            }
          );

          // Si el archivo es realmente Office, redirigir a loadOfficeDocument
          console.log("🔄 [useDocumentViewer] Redirigiendo a loadOfficeDocument...");
          await loadOfficeDocumentWithPending(file);
          return; // Salir de esta función, ya se cargó como Office
        }

        console.error(
          "❌ [useDocumentViewer] El archivo descargado no parece ser un PDF válido:",
          {
            header,
            firstBytes: firstBytes.substring(0, 50),
            size: fileBlob.size,
            type: fileBlob.type,
            mimeType: file.mimeType || file.type,
            versionCode: file.versionCode,
          }
        );
        throw new Error(
          `El archivo descargado no es un PDF válido (header: "${header}"). Puede estar corrupto, ser de un formato diferente, o la versión solicitada no existe.`
        );
      }

      console.log("✅ [useDocumentViewer] Blob validado correctamente como PDF");

      // Detectar si es dispositivo móvil
      const isMobile = /mobile|android|iphone|ipad|phone/i.test(navigator.userAgent);

      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        ...(isMobile && {
          maxImageSize: 1024 * 1024,
          disableFontFace: true,
          verbosity: 0,
        }),
      });

      const pdf = await loadingTask.promise;
      totalPages.value = pdf.numPages;
      currentPage.value = 1;

      // Guardar referencias - usar markRaw para evitar que PDF.js se vuelva reactivo
      // Esto previene errores al acceder a campos privados (#port, etc.)
      currentPdf.value = markRaw(pdf);
      currentDocument.value = file;

      // Renderizar el PDF en el contenedor si se proporciona
      if (container) {
        await renderPdfInContainer(pdf, container);
      }
    } catch (err: any) {
      const errorMessage =
        err?.message || String(err) || "Error desconocido al cargar el documento PDF";
      console.error("❌ [useDocumentViewer] Error loading PDF document:", {
        error: err,
        message: errorMessage,
        stack: err?.stack,
        fileName: file.name,
        versionCode: file.versionCode,
        mimeType: file.mimeType || file.type,
      });
      error.value = errorMessage;
      // Limpiar estado en caso de error
      currentPdf.value = null;
      throw err;
    }
  }

  // Cargar documento PDF (versión con pending document pattern)
  async function loadPdfDocumentWithPending(file: DocumentFile) {
    // Si no hay referencia disponible, guardar como pendiente
    if (!pdfViewerRef.value) {
      pendingDocument.value = file;
      return;
    }

    // Si hay referencia, cargar inmediatamente
    try {
      await loadPdfDocument(file, pdfViewerRef.value);
    } catch (error: any) {
      const errorMessage =
        error?.message || String(error) || "Error desconocido al cargar PDF";
      console.error("❌ [useDocumentViewer] Error cargando PDF:", {
        error,
        message: errorMessage,
        stack: error?.stack,
        fileName: file.name,
        versionCode: file.versionCode,
      });
      throw error;
    }
  }

  // Cargar documento Office
  async function loadOfficeDocument(file: DocumentFile, officeViewer?: HTMLElement) {
    try {
      if (!file.versionCode) {
        throw new Error("No se encontró el código de versión del documento");
      }

      const repository = new RepositorioDocumentosHttpRepository();
      const fileBlob = await repository.descargarVersion(file.versionCode);

      // Determinar qué contenedor usar según el tipo de archivo
      const mimeType = file.mimeType || file.type;
      const extension = file.name.toLowerCase().split(".").pop() || "";
      const isExcelFile =
        mimeType === "application/vnd.ms-excel" ||
        mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        extension === "xlsx" ||
        extension === "xls";
      const isPptxFile =
        mimeType === "application/vnd.ms-powerpoint" ||
        mimeType ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        extension === "pptx" ||
        extension === "ppt";

      // Seleccionar el contenedor correcto
      let container: HTMLElement | null = officeViewer || null;
      if (!container) {
        if (isExcelFile) {
          container = excelViewerRef.value;
        } else if (isPptxFile) {
          container = pptxViewerRef.value;
        } else {
          container = officeViewerRef.value;
        }
      }

      // Esperar a que el contenedor esté disponible (con retry)
      if (!container) {
        // Esperar hasta 2 segundos para que el contenedor esté disponible
        for (let i = 0; i < 20; i++) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          if (isExcelFile) {
            container = excelViewerRef.value;
          } else if (isPptxFile) {
            container = pptxViewerRef.value;
          } else {
            container = officeViewerRef.value;
          }
          if (container) break;
        }
      }

      if (!container) {
        throw new Error("No se encontró el contenedor para el documento de Office");
      }

      const preview = await DocumentPreviewService.previewDocument(fileBlob, mimeType);

      // Limpiar el contenedor
      container.innerHTML = "";

      // Renderizar según el tipo de preview
      if (preview.type === "html") {
        const previewDiv = document.createElement("div");
        previewDiv.className = "w-full h-full overflow-auto p-4";
        previewDiv.innerHTML = `
          <div class="max-w-4xl mx-auto">
            <div style="background: white; color: black; padding: 40px 60px; border-radius: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-height: 800px;">
              ${preview.content as string}
            </div>
          </div>
        `;
        container.appendChild(previewDiv);
      } else if (preview.type === "image") {
        const img = document.createElement("img");
        img.src = preview.content as string;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.display = "block";
        img.style.margin = "0 auto";
        container.appendChild(img);
      } else if (preview.type === "canvas") {
        container.appendChild(preview.content as HTMLCanvasElement);
      }

      currentDocument.value = file;
    } catch (err: any) {
      const errorMessage =
        err?.message || String(err) || "Error desconocido al cargar el documento de Office";
      console.error("❌ [useDocumentViewer] Error loading Office document:", {
        error: err,
        message: errorMessage,
        stack: err?.stack,
        fileName: file.name,
        versionCode: file.versionCode,
        mimeType: file.mimeType || file.type,
      });
      error.value = errorMessage;
      throw err;
    }
  }

  // Cargar documento Office (versión con pending document pattern)
  async function loadOfficeDocumentWithPending(file: DocumentFile) {
    // Determinar qué referencia necesitamos
    const mimeType = file.mimeType || file.type;
    const extension = file.name.toLowerCase().split(".").pop() || "";
    const isExcelFile =
      mimeType === "application/vnd.ms-excel" ||
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      extension === "xlsx" ||
      extension === "xls";
    const isPptxFile =
      mimeType === "application/vnd.ms-powerpoint" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      extension === "pptx" ||
      extension === "ppt";

    // Verificar si la referencia necesaria está disponible
    const neededRef = isExcelFile
      ? excelViewerRef.value
      : isPptxFile
      ? pptxViewerRef.value
      : officeViewerRef.value;

    // Si no hay referencia disponible, guardar como pendiente
    if (!neededRef) {
      pendingDocument.value = file;
      return;
    }

    // Si hay referencia, cargar inmediatamente
    try {
      await loadOfficeDocument(file, neededRef);
    } catch (error: any) {
      const errorMessage =
        error?.message || String(error) || "Error desconocido al cargar documento Office";
      console.error("❌ [useDocumentViewer] Error cargando Office:", {
        error,
        message: errorMessage,
        stack: error?.stack,
        fileName: file.name,
        versionCode: file.versionCode,
      });
      throw error;
    }
  }

  // Cargar documento (detecta tipo automáticamente) - usa pending document pattern
  async function loadDocument(file: DocumentFile) {
    try {
      // Limpiar completamente antes de cargar un nuevo documento
      await cleanup();

      isLoading.value = true;
      error.value = "";
      currentDocument.value = file;

      const mimeType = file.mimeType || file.type;
      const extension = file.name.toLowerCase().split(".").pop() || "";

      console.log("🔵 [useDocumentViewer] loadDocument INICIO:", {
        fileName: file.name,
        mimeType,
        type: file.type,
        extension,
        versionCode: file.versionCode,
        nodeId: file.nodeId,
        size: file.size,
        fullFile: file,
      });

      // Validar tipo de archivo antes de intentar cargar
      if (mimeType === "application/pdf" || extension === "pdf") {
        console.log("🔵 [useDocumentViewer] Detectado como PDF");
        await loadPdfDocumentWithPending(file);
      } else if (
        mimeType === "application/msword" ||
        mimeType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        extension === "docx" ||
        extension === "doc"
      ) {
        console.log("🔵 [useDocumentViewer] Detectado como Word");
        await loadOfficeDocumentWithPending(file);
      } else if (
        mimeType === "application/vnd.ms-excel" ||
        mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        extension === "xlsx" ||
        extension === "xls"
      ) {
        await loadOfficeDocumentWithPending(file);
      } else if (
        mimeType === "application/vnd.ms-powerpoint" ||
        mimeType ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        extension === "pptx" ||
        extension === "ppt"
      ) {
        await loadOfficeDocumentWithPending(file);
      } else if (mimeType.startsWith("image/")) {
        await loadOfficeDocumentWithPending(file);
      } else {
        // Para archivos no soportados, NO establecer error, solo retornar
        // El componente DocumentPreview detectará que es no soportado automáticamente
        console.log("🟡 [useDocumentViewer] Archivo no soportado detectado:", {
          fileName: file.name,
          mimeType,
          extension,
        });
        isLoading.value = false;
        error.value = ""; // Limpiar cualquier error previo
        // Mantener currentDocument para que DocumentPreview pueda mostrar la info del archivo
        return; // No lanzar error, solo retornar
      }
    } catch (err: any) {
      const errorMessage =
        err?.message || String(err) || "Error desconocido al cargar el documento";
      console.error("❌ [useDocumentViewer] Error loading document:", {
        error: err,
        message: errorMessage,
        stack: err?.stack,
        fileName: file.name,
        versionCode: file.versionCode,
        mimeType: file.mimeType || file.type,
      });
      error.value = errorMessage;
    } finally {
      isLoading.value = false;
    }
  }

  // Computed para detectar tipo de archivo
  const isPdf = computed(() => {
    if (!currentDocument.value) return false;
    const mimeType = currentDocument.value.mimeType || currentDocument.value.type;
    const extension = currentDocument.value.name.toLowerCase().split(".").pop() || "";
    return mimeType === "application/pdf" || extension === "pdf";
  });

  const isOffice = computed(() => {
    if (!currentDocument.value || isPdf.value) return false;
    const mimeType = currentDocument.value.mimeType || currentDocument.value.type;
    const extension = currentDocument.value.name.toLowerCase().split(".").pop() || "";
    return (
      mimeType === "application/msword" ||
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      extension === "docx" ||
      extension === "doc"
    );
  });

  const isExcel = computed(() => {
    if (!currentDocument.value) return false;
    const mimeType = currentDocument.value.mimeType || currentDocument.value.type;
    const extension = currentDocument.value.name.toLowerCase().split(".").pop() || "";
    return (
      mimeType === "application/vnd.ms-excel" ||
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      extension === "xlsx" ||
      extension === "xls"
    );
  });

  const isPptx = computed(() => {
    if (!currentDocument.value) return false;
    const mimeType = currentDocument.value.mimeType || currentDocument.value.type;
    const extension = currentDocument.value.name.toLowerCase().split(".").pop() || "";
    return (
      mimeType === "application/vnd.ms-powerpoint" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      extension === "pptx" ||
      extension === "ppt"
    );
  });

  // Cargar documento pendiente
  async function loadPendingDocument() {
    if (!pendingDocument.value) return;

    const file = pendingDocument.value;
    pendingDocument.value = null;

    try {
      if (isPdf.value) {
        await loadPdfDocument(file, pdfViewerRef.value || undefined);
      } else if (isOffice.value || isExcel.value || isPptx.value) {
        await loadOfficeDocument(file);
      }
    } catch (error: any) {
      const errorMessage =
        error?.message || String(error) || "Error desconocido al cargar documento pendiente";
      console.error("❌ [useDocumentViewer] Error cargando documento pendiente:", {
        error,
        message: errorMessage,
        stack: error?.stack,
        pendingDocument: pendingDocument.value,
      });
    }
  }

  // Establecer referencias
  function setPdfViewerRef(ref: HTMLElement | null) {
    pdfViewerRef.value = ref;

    // Si hay un documento pendiente de carga, cargarlo ahora
    if (ref && pendingDocument.value) {
      nextTick(() => {
        loadPendingDocument();
      });
    }
  }

  function setOfficeViewerRef(ref: HTMLElement | null) {
    officeViewerRef.value = ref;

    // Si hay un documento pendiente de carga, cargarlo ahora
    if (ref && pendingDocument.value) {
      nextTick(() => {
        loadPendingDocument();
      });
    }
  }

  function setExcelViewerRef(ref: HTMLElement | null) {
    excelViewerRef.value = ref;

    // Si hay un documento pendiente de carga, cargarlo ahora
    if (ref && pendingDocument.value) {
      nextTick(() => {
        loadPendingDocument();
      });
    }
  }

  function setPptxViewerRef(ref: HTMLElement | null) {
    pptxViewerRef.value = ref;

    // Si hay un documento pendiente de carga, cargarlo ahora
    if (ref && pendingDocument.value) {
      nextTick(() => {
        loadPendingDocument();
      });
    }
  }

  function setPreviewContainerRef(ref: HTMLElement | null) {
    // Remover listener anterior si existe
    if (previewContainerRef.value) {
      removeScrollListener();
    }

    previewContainerRef.value = ref;

    // Agregar listener de scroll si hay referencia
    if (ref) {
      addScrollListener();
    }
  }

  // Limpiar al desmontar
  async function cleanup() {
    removeScrollListener();

    // Limpiar timeout de zoom si existe
    if (zoomTimeout) {
      clearTimeout(zoomTimeout);
      zoomTimeout = null;
    }

    // Limpiar cache de páginas
    renderedPagesCache.clear();

    // Limpiar contenedores del DOM
    if (pdfViewerRef.value) {
      pdfViewerRef.value.innerHTML = "";
    }
    if (officeViewerRef.value) {
      officeViewerRef.value.innerHTML = "";
    }
    if (excelViewerRef.value) {
      excelViewerRef.value.innerHTML = "";
    }
    if (pptxViewerRef.value) {
      pptxViewerRef.value.innerHTML = "";
    }

    // Limpiar PDF si existe - usar markRaw previene errores con campos privados
    if (currentPdf.value) {
      try {
        // Verificar que el método destroy existe antes de llamarlo
        if (typeof currentPdf.value.destroy === "function") {
          await currentPdf.value.destroy();
        }
      } catch (err: any) {
        // Ignorar errores al destruir PDF (puede ser que ya esté destruido)
        console.warn(
          "⚠️ [useDocumentViewer] Error al destruir PDF en cleanup:",
          err?.message || err
        );
      }
      currentPdf.value = null;
    }

    currentDocument.value = null;
    pendingDocument.value = null;
    isLoading.value = false;
    error.value = "";
    totalPages.value = 0;
    currentPage.value = 1;
    currentPage.value = 1;
    totalPages.value = 1;
    zoom.value = 100;
  }

  return {
    // Estado
    isLoading,
    error,
    currentPage,
    totalPages,
    zoom,
    showSidebar,
    currentDocument,

    // Referencias
    pdfViewerRef,
    officeViewerRef,
    excelViewerRef,
    pptxViewerRef,
    previewContainerRef,

    // Métodos de navegación
    toggleSidebar,
    zoomIn,
    zoomOut,
    setZoom,
    setPage,
    previousPage,
    nextPage,

    // Métodos de carga
    loadDocument,
    loadPdfDocument,
    loadOfficeDocument,

    // Métodos de referencia
    setPdfViewerRef,
    setOfficeViewerRef,
    setExcelViewerRef,
    setPptxViewerRef,
    setPreviewContainerRef,

    // Computed
    isPdf,
    isOffice,
    isExcel,
    isPptx,

    // Cleanup
    cleanup,
  };
}
