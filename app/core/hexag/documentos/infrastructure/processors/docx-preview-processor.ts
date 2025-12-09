/**
 * Processor para previsualizar documentos DOCX en el navegador
 * 
 * Usa docx-preview para convertir DOCX Blob a HTML renderizable
 */
export class DocxPreviewProcessor {
  /**
   * Renderiza un Blob DOCX en un contenedor HTML
   * @param blob Blob del documento DOCX
   * @param container Elemento HTML donde se renderizará el preview
   */
  static async render(blob: Blob, container: HTMLElement): Promise<void> {
    try {
      console.log("🔧 [DocxPreviewProcessor] Iniciando render...", {
        blobSize: blob.size,
        blobType: blob.type,
        hasContainer: !!container,
        containerTag: container.tagName,
      });

      // Limpiar contenedor
      container.innerHTML = "";
      console.log("🧹 [DocxPreviewProcessor] Contenedor limpiado");

      // Verificar que el blob sea válido
      if (!blob || blob.size === 0) {
        throw new Error("El blob está vacío o no es válido");
      }

      // Verificar que el blob sea un DOCX
      if (!blob.type.includes("wordprocessingml") && !blob.type.includes("msword")) {
        console.warn("⚠️ [DocxPreviewProcessor] El tipo MIME no es DOCX:", blob.type);
        // Continuar de todas formas, puede ser que el tipo no esté bien definido
      }

      console.log("📦 [DocxPreviewProcessor] Importando docx-preview...");
      // Importar docx-preview dinámicamente (para evitar problemas de SSR en Nuxt)
      let renderAsync: any;
      
      try {
        // Importar docx-preview
        const docxPreview = await import("docx-preview");
        console.log("✅ [DocxPreviewProcessor] docx-preview importado:", {
          keys: Object.keys(docxPreview),
          hasRenderAsync: typeof docxPreview.renderAsync === "function",
          hasDefault: !!docxPreview.default,
          defaultType: typeof docxPreview.default,
        });

        // Probar diferentes formas de importación
        if (typeof docxPreview.renderAsync === "function") {
          renderAsync = docxPreview.renderAsync;
          console.log("✅ [DocxPreviewProcessor] Usando renderAsync directo");
        } else if (docxPreview.default && typeof docxPreview.default === "function") {
          renderAsync = docxPreview.default;
          console.log("✅ [DocxPreviewProcessor] Usando default como función");
        } else if (docxPreview.default && typeof docxPreview.default.renderAsync === "function") {
          renderAsync = docxPreview.default.renderAsync;
          console.log("✅ [DocxPreviewProcessor] Usando default.renderAsync");
        } else {
          // Si no encontramos renderAsync, lanzar error con información útil
          console.error("❌ [DocxPreviewProcessor] No se encontró renderAsync. Estructura del módulo:", docxPreview);
          throw new Error("No se encontró renderAsync en docx-preview. Verifica la instalación del paquete.");
        }
      } catch (importError) {
        console.error("❌ [DocxPreviewProcessor] Error al importar docx-preview:", importError);
        throw new Error(`Error al importar docx-preview: ${importError instanceof Error ? importError.message : String(importError)}`);
      }
      
      if (!renderAsync || typeof renderAsync !== "function") {
        throw new Error(`renderAsync no es una función. Tipo: ${typeof renderAsync}`);
      }
      
      console.log("✅ [DocxPreviewProcessor] renderAsync obtenido correctamente");

      console.log("🎨 [DocxPreviewProcessor] Renderizando documento...");
      
      // Renderizar el documento directamente en el contenedor
      // docx-preview maneja el wrapper internamente cuando inWrapper: true
      await renderAsync(blob, container, container, {
        className: "docx-preview",
        inWrapper: true,
        ignoreWidth: false,
        ignoreHeight: false,
        ignoreFonts: false,
        breakPages: true,
        ignoreLastRenderedPageBreak: true,
        experimental: false,
        trimXmlDeclaration: true,
        useBase64URL: false,
        useMathMLPolyfill: true,
        showChanges: false,
        showComments: false,
        showInserted: true,
        showDeleted: false,
      });
      
      console.log("✅ [DocxPreviewProcessor] renderAsync completado");

      // Logs detallados del contenido renderizado
      const innerHTML = container.innerHTML;
      const textContent = container.textContent || "";
      const childrenCount = container.children.length;
      const firstChild = container.firstElementChild;
      
      // Buscar el contenido real del documento (dentro de section.docx-preview)
      const docxPreviewSection = container.querySelector("section.docx-preview");
      const docxPreviewArticle = container.querySelector("section.docx-preview article");
      
      console.log("✅ [DocxPreviewProcessor] Documento renderizado exitosamente");
      console.log("📊 [DocxPreviewProcessor] Estadísticas del renderizado:", {
        containerChildren: childrenCount,
        innerHTMLLength: innerHTML.length,
        textContentLength: textContent.length,
        firstChildTag: firstChild?.tagName || "N/A",
        firstChildClass: firstChild?.className || "N/A",
        hasDocxPreviewSection: !!docxPreviewSection,
        hasDocxPreviewArticle: !!docxPreviewArticle,
        docxPreviewSectionHTML: docxPreviewSection?.innerHTML.substring(0, 500) || "N/A",
        docxPreviewArticleHTML: docxPreviewArticle?.innerHTML.substring(0, 500) || "N/A",
        docxPreviewArticleText: docxPreviewArticle?.textContent?.substring(0, 300) || "N/A",
      });
      
      console.log("📄 [DocxPreviewProcessor] Contenido HTML completo (primeros 2000 caracteres):");
      console.log(innerHTML.substring(0, 2000));
      
      console.log("📝 [DocxPreviewProcessor] Contenido de texto visible (primeros 1000 caracteres):");
      console.log(textContent.substring(0, 1000));
      
      if (docxPreviewArticle) {
        console.log("📄 [DocxPreviewProcessor] Contenido del ARTICLE (primeros 1000 caracteres):");
        console.log(docxPreviewArticle.innerHTML.substring(0, 1000));
        console.log("📝 [DocxPreviewProcessor] Texto del ARTICLE (primeros 500 caracteres):");
        console.log(docxPreviewArticle.textContent?.substring(0, 500) || "N/A");
      }
      
      console.log("🏗️ [DocxPreviewProcessor] Estructura del DOM:");
      if (firstChild) {
        console.log("  - Primer hijo:", {
          tag: firstChild.tagName,
          class: firstChild.className,
          id: firstChild.id,
          children: firstChild.children.length,
          innerHTML: firstChild.innerHTML.substring(0, 200),
        });
      }
      
      // Verificar si realmente hay contenido visible
      const hasRealContent = docxPreviewArticle && (docxPreviewArticle.textContent || "").trim().length > 0;
      
      if (!hasRealContent) {
        console.warn("⚠️ [DocxPreviewProcessor] ADVERTENCIA: El documento puede estar vacío o no tener contenido visible");
        console.warn("⚠️ [DocxPreviewProcessor] Verifica que el template base tenga contenido y que los datos se hayan inyectado correctamente");
      } else {
        console.log("✅ [DocxPreviewProcessor] Contenido detectado correctamente en el ARTICLE");
      }
    } catch (error) {
      console.error("❌ [DocxPreviewProcessor] Error al renderizar documento:", error);
      console.error("❌ [DocxPreviewProcessor] Error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      
      container.innerHTML = `
        <div class="p-4 text-center text-red-600">
          <p class="font-semibold">Error al previsualizar el documento</p>
          <p class="text-sm mt-2">${error instanceof Error ? error.message : "Error desconocido"}</p>
          <details class="mt-4 text-left">
            <summary class="cursor-pointer text-xs">Detalles técnicos</summary>
            <pre class="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">${error instanceof Error ? error.stack : String(error)}</pre>
          </details>
        </div>
      `;
      throw error;
    }
  }

  /**
   * Crea un contenedor temporal para el preview
   * Útil para crear modales o drawers
   */
  static createContainer(): HTMLDivElement {
    const container = document.createElement("div");
    container.className = "docx-preview-container";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.overflow = "auto";
    return container;
  }
}

