import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
import { OrdenConvocatoria } from "~/core/hexag/juntas/domain/enums/orden-convocatoria.enum";

/**
 * Use Case: Enviar Documentos al Repositorio
 * 
 * Orquesta el proceso completo de envío de documentos:
 * 1. Obtiene o crea la carpeta de junta
 * 2. Envía todos los documentos a esa carpeta
 */
export class EnviarDocumentosRepositorioUseCase {
  constructor(
    private readonly repositorio: RepositorioDocumentosRepository
  ) {}

  async execute(
    structureId: string,
    flowId: string,
    documentos: Documento[],
    fechaJuntaLegible: string // Formato: "11 de diciembre del 2025"
  ): Promise<void> {
    if (documentos.length === 0) {
      throw new Error("No hay documentos para enviar al repositorio");
    }

    if (!structureId || !flowId) {
      throw new Error("Se requiere structureId y flowId para enviar documentos");
    }

    if (!fechaJuntaLegible) {
      throw new Error("Se requiere la fecha de la junta en formato legible para renombrar la carpeta");
    }

    console.log("🟡 [EnviarDocumentosRepositorio] ========================================");
    console.log("🟡 [EnviarDocumentosRepositorio] INICIANDO ENVÍO");
    console.log("🟡 [EnviarDocumentosRepositorio] ========================================");
    console.log("🟡 [EnviarDocumentosRepositorio] structureId:", structureId, typeof structureId);
    console.log("🟡 [EnviarDocumentosRepositorio] flowId:", flowId, typeof flowId);
    console.log("🟡 [EnviarDocumentosRepositorio] cantidadDocumentos:", documentos.length);
    console.log("🟡 [EnviarDocumentosRepositorio] nombresDocumentos:", documentos.map(d => d.nombre));
    console.log("🟡 [EnviarDocumentosRepositorio] fechaJuntaLegible:", fechaJuntaLegible);
    console.log("🟡 [EnviarDocumentosRepositorio] NOTA: Los documentos se subirán directamente a la carpeta de la junta creada con el nombre de la fecha");

    // 1. Obtener o crear carpeta de junta CON EL NOMBRE DE LA FECHA directamente
    // El backend ahora acepta folderName como query parameter y crea la carpeta con ese nombre
    console.log("🟡 [EnviarDocumentosRepositorio] Paso 1: Obtener/crear carpeta de junta con nombre de fecha...");
    const folderId = await this.repositorio.obtenerFolderIdJunta(
      structureId,
      flowId,
      fechaJuntaLegible // Pasar el nombre directamente al backend
    );

    console.log("🟡 [EnviarDocumentosRepositorio] ✅ Folder ID obtenido:", folderId, typeof folderId);
    console.log("🟡 [EnviarDocumentosRepositorio] ✅ Carpeta creada/obtenida con nombre:", fechaJuntaLegible);

    // 2. Enviar documentos directamente a la carpeta de la junta
    // NO crear subcarpeta adicional - subir directamente a la carpeta obtenida
    console.log("🟡 [EnviarDocumentosRepositorio] Paso 2: Enviar documentos directamente a la carpeta de la junta...");
    await this.repositorio.enviarDocumentos(
      structureId,
      folderId,
      documentos
    );

    console.log("🟡 [EnviarDocumentosRepositorio] ========================================");
    console.log(`✅ [EnviarDocumentosRepositorio] ${documentos.length} documentos enviados correctamente`);
    console.log("🟡 [EnviarDocumentosRepositorio] ========================================");
  }
}

