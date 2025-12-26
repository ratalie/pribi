import type { Documento } from "../entities/documento.entity";
import { CategoriaDocumento } from "../enums/categoria-documento.enum";
import { TipoDocumento } from "../enums/tipo-documento.enum";

/**
 * Servicio para categorizar documentos según su tipo
 * (Solo para visualización, no afecta el repositorio)
 */
export class DocumentoCategorizerService {
  /**
   * Categoriza un documento según su tipo
   */
  static categorizar(documento: Documento): CategoriaDocumento {
    // Acta principal
    if (documento.tipo === TipoDocumento.ACTA || documento.tipo === TipoDocumento.FALTA_QUORUM) {
      return CategoriaDocumento.ACTA_PRINCIPAL;
    }

    // Documentos no-punto (detalles de la junta)
    if (
      documento.tipo === TipoDocumento.CONVOCATORIA ||
      documento.tipo === TipoDocumento.PROXY_NATURAL ||
      documento.tipo === TipoDocumento.PROXY_JURIDICA ||
      documento.tipo === TipoDocumento.CERTIFICACION ||
      documento.tipo === TipoDocumento.LISTA_ASISTENCIA
    ) {
      return CategoriaDocumento.DETALLES_JUNTA;
    }

    // Certificados
    if (
      documento.tipo === TipoDocumento.CERTIFICADO_APORTE_DINERARIO ||
      documento.tipo === TipoDocumento.CERTIFICADO_CAPITALIZACION
    ) {
      return CategoriaDocumento.CERTIFICADOS;
    }

    // Documentos por punto (el resto)
    return CategoriaDocumento.POR_PUNTO;
  }

  /**
   * Agrupa documentos por categoría
   */
  static agruparPorCategoria(documentos: Documento[]): Record<string, Documento[]> {
    const agrupados: Record<string, Documento[]> = {};

    documentos.forEach((doc) => {
      const categoria = this.categorizar(doc);
      const nombreCategoria = this.getNombreCategoria(categoria, doc);

      if (!agrupados[nombreCategoria]) {
        agrupados[nombreCategoria] = [];
      }

      agrupados[nombreCategoria].push(doc);
    });

    return agrupados;
  }

  /**
   * Obtiene el nombre legible de la categoría
   */
  private static getNombreCategoria(categoria: CategoriaDocumento, doc: Documento): string {
    switch (categoria) {
      case CategoriaDocumento.ACTA_PRINCIPAL:
        return "Acta Principal";

      case CategoriaDocumento.DETALLES_JUNTA:
        return "Detalles de la Junta";

      case CategoriaDocumento.CERTIFICADOS:
        return "Certificados";

      case CategoriaDocumento.POR_PUNTO:
        // Nombre basado en el tipo de punto
        if (doc.puntoAcuerdoTipo === "aporte-dinerario") {
          return "Acuerdos: Aumento de Capital";
        }
        if (doc.puntoAcuerdoTipo === "capitalizacion-creditos") {
          return "Acuerdos: Capitalización de Créditos";
        }
        if (doc.puntoAcuerdoTipo === "nombramiento-directores" || doc.puntoAcuerdoTipo === "nombramiento-gerente") {
          return "Acuerdos: Nombramientos";
        }
        return "Acuerdos: Otros";

      default:
        return "Otros";
    }
  }
}

