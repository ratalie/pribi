import { ActaGenerator } from "../generators/acta-generator";
import { ConvocatoriaGenerator } from "../generators/convocatoria-generator";
import { ProxyGenerator } from "../generators/proxy-generator";
import { CertificacionGenerator } from "../generators/certificacion-generator";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import { useDocumentosStore } from "../stores/documentos.store";

/**
 * Orquestador de Documentos
 * 
 * Coordina la generación de todos los documentos de la junta según los puntos activos.
 * 
 * Documentos generados:
 * - Acta Principal (siempre)
 * - Convocatoria (solo si es Junta General)
 * - Proxy Natural (si hay representantes naturales)
 * - Proxy Jurídica (si hay representantes jurídicos)
 * - Certificación (siempre)
 * - Minuta (si hay aporte dinerario) - TODO
 * - Certificados de Aporte (si hay aporte dinerario) - TODO
 */
export class DocumentosOrchestrator {
  /**
   * Genera todos los documentos de la junta
   * @returns Array de documentos generados
   */
  static async generateAll(): Promise<Documento[]> {
    const documentos: Documento[] = [];
    const store = useDocumentosStore();

    console.log("🚀 [DocumentosOrchestrator] Iniciando generación de documentos...");

    try {
      // 1. Validar que tengamos datos básicos
      if (!store.datosSociedad || !store.datosJunta) {
        throw new Error("No hay datos suficientes para generar documentos");
      }

      // 2. Generar Acta Principal (siempre)
      console.log("📄 [DocumentosOrchestrator] Generando acta principal...");
      const acta = await ActaGenerator.generate();
      documentos.push(acta);
      console.log("✅ [DocumentosOrchestrator] Acta generada:", acta.nombre);

      // 3. Generar Convocatoria (solo si es Junta General)
      console.log("📄 [DocumentosOrchestrator] Verificando si se genera convocatoria...");
      const convocatoria = await ConvocatoriaGenerator.generate();
      if (convocatoria) {
        documentos.push(convocatoria);
        console.log("✅ [DocumentosOrchestrator] Convocatoria generada:", convocatoria.nombre);
      } else {
        console.log("ℹ️ [DocumentosOrchestrator] No se genera convocatoria (Junta Universal)");
      }

      // 4. Generar Proxies (si hay representantes)
      console.log("📄 [DocumentosOrchestrator] Verificando si se generan proxies...");
      const proxies = await ProxyGenerator.generate();
      if (proxies.length > 0) {
        documentos.push(...proxies);
        console.log(`✅ [DocumentosOrchestrator] ${proxies.length} proxy(ies) generado(s)`);
      } else {
        console.log("ℹ️ [DocumentosOrchestrator] No se generan proxies (no hay representantes)");
      }

      // 5. Generar Certificación (siempre)
      console.log("📄 [DocumentosOrchestrator] Generando certificación...");
      const certificacion = await CertificacionGenerator.generate();
      documentos.push(certificacion);
      console.log("✅ [DocumentosOrchestrator] Certificación generada:", certificacion.nombre);

      // 6. Generar Minuta (si hay aporte dinerario) - TODO
      const puntosActivos = store.puntosAgendaActivos;
      if (puntosActivos.includes("aporteDinerario")) {
        console.log("📄 [DocumentosOrchestrator] Minuta pendiente de implementación");
        // TODO: Implementar MinutaGenerator cuando esté listo
      }

      // 7. Generar Certificados de Aporte (si hay aporte dinerario) - TODO
      if (puntosActivos.includes("aporteDinerario")) {
        console.log("📄 [DocumentosOrchestrator] Certificados de aporte pendientes de implementación");
        // TODO: Implementar CertificadoAporteGenerator cuando esté listo
      }

      console.log(`✅ [DocumentosOrchestrator] Generación completada: ${documentos.length} documento(s)`);
      return documentos;
    } catch (error) {
      console.error("❌ [DocumentosOrchestrator] Error al generar documentos:", error);
      throw error;
    }
  }

  /**
   * Genera solo el acta principal
   * @returns Documento del acta
   */
  static async generateActa(): Promise<Documento> {
    console.log("📄 [DocumentosOrchestrator] Generando solo acta...");
    return await ActaGenerator.generate();
  }

  /**
   * Genera solo la convocatoria (si aplica)
   * @returns Documento de convocatoria o null
   */
  static async generateConvocatoria(): Promise<Documento | null> {
    console.log("📄 [DocumentosOrchestrator] Generando solo convocatoria...");
    return await ConvocatoriaGenerator.generate();
  }

  /**
   * Genera solo los proxies (si aplica)
   * @returns Array de documentos de proxy
   */
  static async generateProxies(): Promise<Documento[]> {
    console.log("📄 [DocumentosOrchestrator] Generando solo proxies...");
    return await ProxyGenerator.generate();
  }

  /**
   * Genera solo la certificación
   * @returns Documento de certificación
   */
  static async generateCertificacion(): Promise<Documento> {
    console.log("📄 [DocumentosOrchestrator] Generando solo certificación...");
    return await CertificacionGenerator.generate();
  }
}


