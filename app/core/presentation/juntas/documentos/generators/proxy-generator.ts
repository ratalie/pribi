import { useProxy } from "../composables/useProxy";
import { DocxtemplaterProcessor } from "~/core/hexag/documentos/infrastructure/processors/docxtemplater-processor";
import { TemplateHttpRepository } from "~/core/hexag/documentos/infrastructure/repositories/template.http.repository";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import { TipoDocumento } from "~/core/hexag/documentos/domain/enums/tipo-documento.enum";
import { CategoriaDocumento } from "~/core/hexag/documentos/domain/enums/categoria-documento.enum";

/**
 * Generador de Poderes Especiales (Proxy)
 *
 * Genera documentos de proxy para Persona Natural y Persona Jurídica
 * Un documento por cada accionista con representante
 */
export class ProxyGenerator {
  /**
   * Genera todos los proxies necesarios
   * @returns Array de documentos generados
   */
  static async generate(): Promise<Documento[]> {
    const documentos: Documento[] = [];

    const {
      variablesTemplateNatural,
      variablesTemplateJuridica,
      necesitaProxyNatural,
      necesitaProxyJuridica,
    } = useProxy();

    // 1. Generar proxies para Persona Natural
    if (necesitaProxyNatural.value && variablesTemplateNatural.value) {
      console.log(
        `📋 [ProxyGenerator] Generando ${variablesTemplateNatural.value.length} proxy(ies) para Persona Natural`
      );

      for (const vars of variablesTemplateNatural.value) {
        const documento = await this.generateSingleProxy(vars, "natural");
        documentos.push(documento);
      }
    }

    // 2. Generar proxies para Persona Jurídica
    if (necesitaProxyJuridica.value && variablesTemplateJuridica.value) {
      console.log(
        `📋 [ProxyGenerator] Generando ${variablesTemplateJuridica.value.length} proxy(ies) para Persona Jurídica`
      );

      for (const vars of variablesTemplateJuridica.value) {
        const documento = await this.generateSingleProxy(vars, "juridica");
        documentos.push(documento);
      }
    }

    console.log(`✅ [ProxyGenerator] Generados ${documentos.length} proxy(ies) en total`);
    return documentos;
  }

  /**
   * Genera un solo documento de proxy
   */
  private static async generateSingleProxy(
    vars: NonNullable<ReturnType<typeof useProxy>["variablesTemplateNatural"]>["value"][0],
    tipo: "natural" | "juridica"
  ): Promise<Documento> {
    // 1. Obtener template según tipo
    const templatePath =
      tipo === "natural" ? "no-punto/proxy-natural.docx" : "no-punto/proxy-juridica.docx";

    const templateBlob = await TemplateHttpRepository.getTemplate(templatePath);

    // 2. Procesar template con datos
    const documentoBlob = await DocxtemplaterProcessor.process(templateBlob, vars);

    // 3. Crear nombre del archivo
    const nombreArchivo = `proxy-${tipo}-${vars.numero_documento_apoderado || "sin-dni"}.docx`;

    // 4. Crear entidad Documento
    const documento: Documento = {
      id: crypto.randomUUID(),
      nombre: nombreArchivo,
      tipo: tipo === "natural" ? TipoDocumento.PROXY_NATURAL : TipoDocumento.PROXY_JURIDICA,
      categoria: CategoriaDocumento.DETALLES_JUNTA,
      blob: documentoBlob,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      tamano: documentoBlob.size,
      tamanoLegible: this.formatFileSize(documentoBlob.size),
    };

    return documento;
  }

  /**
   * Formatea el tamaño del archivo
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }
}

