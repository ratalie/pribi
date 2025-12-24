import * as pdfjsLib from "pdfjs-dist";
import { computed, ref } from "vue";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import { DocumentPreviewService } from "~/core/hexag/repositorio/infrastructure/services/document-preview.service";
import { PdfWorkerService } from "~/core/hexag/repositorio/infrastructure/services/pdf-worker.service";

// Configurar worker de PDF.js (centralizado)
PdfWorkerService.configure();

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
  const previewContainerRef = ref<HTMLElement | null>(null);

  // Documento actual
  const currentDocument = ref<DocumentFile | null>(null);

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
    if (currentPdf.value && pdfViewerRef.value) {
      renderPdfInContainer(currentPdf.value, pdfViewerRef.value);
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

  // Cache de páginas renderizadas para evitar re-renderizar
  const renderedPagesCache = new Map<number, HTMLCanvasElement>();

  // Función auxiliar para crear contenedor de página desde cache
  function createPageContainer(pageNum: number, canvas: HTMLCanvasElement): HTMLElement {
    const pageContainer = document.createElement("div");
    pageContainer.style.position = "relative";
    pageContainer.style.marginBottom = "20px";
    pageContainer.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    pageContainer.style.borderRadius = "8px";
    pageContainer.style.overflow = "hidden";
    pageContainer.style.backgroundColor = "white";
    pageContainer.setAttribute("data-page-number", pageNum.toString());

    // Clonar el canvas del cache
    const canvasClone = canvas.cloneNode(true) as HTMLCanvasElement;
    canvasClone.style.maxWidth = "100%";
    canvasClone.style.height = "auto";
    canvasClone.style.display = "block";

    pageContainer.appendChild(canvasClone);

    // Agregar número de página
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

    return pageContainer;
  }

  // Renderizar PDF en el contenedor con optimizaciones
  async function renderPdfInContainer(pdf: any, container: HTMLElement) {
    try {
      // Limpiar completamente el contenedor
      container.innerHTML = "";

      // Crear un contenedor para todas las páginas
      const pagesContainer = document.createElement("div");
      pagesContainer.style.display = "flex";
      pagesContainer.style.flexDirection = "column";
      pagesContainer.style.alignItems = "center";
      pagesContainer.style.gap = "20px";
      pagesContainer.style.padding = "20px";

      // Calcular escala una sola vez para todas las páginas
      const firstPage = await pdf.getPage(1);
      const viewport = firstPage.getViewport({ scale: 1 });
      const containerWidth = container.clientWidth - 80; // Margen de 40px en cada lado
      const baseScale = containerWidth / viewport.width;
      const finalScale = baseScale * (zoom.value / 100);

      // Renderizar páginas de forma optimizada
      // Para PDFs grandes, renderizar solo las primeras páginas inicialmente
      const initialPagesToRender = Math.min(totalPages.value, 10);
      const renderBatch = async (startPage: number, endPage: number) => {
        for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
          // Verificar si la página ya está en cache
          if (renderedPagesCache.has(pageNum)) {
            const cachedCanvas = renderedPagesCache.get(pageNum);
            if (cachedCanvas) {
              const pageContainer = createPageContainer(pageNum, cachedCanvas);
              pagesContainer.appendChild(pageContainer);
              continue;
            }
          }

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

          // Guardar en cache (clonar el canvas para evitar problemas de referencia)
          const cachedCanvas = canvas.cloneNode(true) as HTMLCanvasElement;
          renderedPagesCache.set(pageNum, cachedCanvas);

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
      };

      // Renderizar primeras páginas inmediatamente
      await renderBatch(1, initialPagesToRender);

      // Agregar el contenedor de páginas al contenedor principal
      container.appendChild(pagesContainer);

      // Renderizar el resto de las páginas de forma lazy (solo cuando se necesiten)
      if (totalPages.value > initialPagesToRender) {
        // Usar Intersection Observer para renderizar páginas cuando se acerquen al viewport
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const pageNum = parseInt(entry.target.getAttribute("data-page-number") || "0");
                if (pageNum > initialPagesToRender && pageNum <= totalPages.value) {
                  // Renderizar esta página
                  renderBatch(pageNum, pageNum).then(() => {
                    observer.unobserve(entry.target);
                  });
                }
              }
            });
          },
          { rootMargin: "200px" } // Renderizar cuando esté a 200px de ser visible
        );

        // Crear placeholders para las páginas restantes
        for (let pageNum = initialPagesToRender + 1; pageNum <= totalPages.value; pageNum++) {
          const placeholder = document.createElement("div");
          placeholder.style.minHeight = "800px"; // Altura aproximada
          placeholder.style.marginBottom = "20px";
          placeholder.setAttribute("data-page-number", pageNum.toString());
          placeholder.className = "pdf-page-placeholder";
          pagesContainer.appendChild(placeholder);
          observer.observe(placeholder);
        }
      }
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

      const repository = new RepositorioDocumentosHttpRepository();
      const fileBlob = await repository.descargarVersion(file.versionCode);

      // Detectar si es dispositivo móvil
      const isMobile = /mobile|android|iphone|ipad|phone/i.test(navigator.userAgent);

      const loadingTask = pdfjsLib.getDocument({
        data: await fileBlob.arrayBuffer(),
        ...(isMobile && {
          maxImageSize: 1024 * 1024,
          disableFontFace: true,
          verbosity: 0,
        }),
      });

      const pdf = await loadingTask.promise;
      totalPages.value = pdf.numPages;
      currentPage.value = 1;

      // Guardar referencias
      currentPdf.value = pdf;
      currentDocument.value = file;

      // Renderizar el PDF en el contenedor si se proporciona
      const container = pdfViewer || pdfViewerRef.value;
      if (container) {
        await renderPdfInContainer(pdf, container);
      }
    } catch (err: any) {
      console.error("Error loading PDF document:", err);
      error.value = err.message || "Error al cargar el documento PDF";
      throw err;
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

      const mimeType = file.mimeType || file.type;
      const preview = await DocumentPreviewService.previewDocument(fileBlob, mimeType);

      const container = officeViewer || officeViewerRef.value;
      if (!container) {
        throw new Error("No se encontró el contenedor para el documento de Office");
      }

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
      console.error("Error loading Office document:", err);
      error.value = err.message || "Error al cargar el documento de Office";
      throw err;
    }
  }

  // Cargar documento (detecta tipo automáticamente)
  async function loadDocument(file: DocumentFile) {
    try {
      isLoading.value = true;
      error.value = "";
      currentDocument.value = file;

      const mimeType = file.mimeType || file.type;
      const extension = file.name.toLowerCase().split(".").pop() || "";

      if (mimeType === "application/pdf" || extension === "pdf") {
        await loadPdfDocument(file);
      } else if (
        mimeType === "application/msword" ||
        mimeType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        extension === "docx" ||
        extension === "doc"
      ) {
        await loadOfficeDocument(file);
      } else if (
        mimeType === "application/vnd.ms-excel" ||
        mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        extension === "xlsx" ||
        extension === "xls"
      ) {
        await loadOfficeDocument(file);
      } else if (
        mimeType === "application/vnd.ms-powerpoint" ||
        mimeType ===
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
        extension === "pptx" ||
        extension === "ppt"
      ) {
        await loadOfficeDocument(file);
      } else if (mimeType.startsWith("image/")) {
        await loadOfficeDocument(file);
      } else {
        throw new Error(`Tipo de archivo no soportado: ${mimeType || extension}`);
      }
    } catch (err: any) {
      console.error("Error loading document:", err);
      error.value = err.message || "Error al cargar el documento";
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

  // Establecer referencias
  function setPdfViewerRef(ref: HTMLElement | null) {
    pdfViewerRef.value = ref;
  }

  function setOfficeViewerRef(ref: HTMLElement | null) {
    officeViewerRef.value = ref;
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
  function cleanup() {
    removeScrollListener();

    // Limpiar timeout de zoom si existe
    if (zoomTimeout) {
      clearTimeout(zoomTimeout);
      zoomTimeout = null;
    }

    // Limpiar cache de páginas
    renderedPagesCache.clear();

    currentPdf.value = null;
    currentDocument.value = null;
    isLoading.value = true;
    error.value = "";
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
