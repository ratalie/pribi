import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";

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
    fechaJunta: string
  ): Promise<void> {
    if (documentos.length === 0) {
      throw new Error("No hay documentos para enviar al repositorio");
    }

    if (!structureId || !flowId) {
      throw new Error("Se requiere structureId y flowId para enviar documentos");
    }

    if (!fechaJunta) {
      throw new Error("Se requiere la fecha de la junta para crear el nombre de la carpeta");
    }

    console.log("🟡 [EnviarDocumentosRepositorio] ========================================");
    console.log("🟡 [EnviarDocumentosRepositorio] INICIANDO ENVÍO");
    console.log("🟡 [EnviarDocumentosRepositorio] ========================================");
    console.log("🟡 [EnviarDocumentosRepositorio] structureId:", structureId, typeof structureId);
    console.log("🟡 [EnviarDocumentosRepositorio] flowId:", flowId, typeof flowId);
    console.log("🟡 [EnviarDocumentosRepositorio] cantidadDocumentos:", documentos.length);
    console.log("🟡 [EnviarDocumentosRepositorio] fechaJunta:", fechaJunta);
    console.log("🟡 [EnviarDocumentosRepositorio] nombresDocumentos:", documentos.map(d => d.nombre));

    // 1. Obtener o crear carpeta de junta
    console.log("🟡 [EnviarDocumentosRepositorio] Paso 1: Obtener/crear carpeta de junta...");
    const folderId = await this.repositorio.obtenerFolderIdJunta(
      structureId,
      flowId
    );

    console.log("🟡 [EnviarDocumentosRepositorio] ✅ Folder ID obtenido:", folderId, typeof folderId);

    // 2. Construir nombre de carpeta
    const nombreCarpeta = `Documentos Juntas: ${fechaJunta}`;
    console.log("🟡 [EnviarDocumentosRepositorio] Paso 2: Nombre de carpeta:", nombreCarpeta);

    // 3. Enviar documentos
    console.log("🟡 [EnviarDocumentosRepositorio] Paso 3: Enviar documentos al repositorio...");
    await this.repositorio.enviarDocumentos(
      structureId,
      folderId,
      documentos,
      nombreCarpeta
    );

    console.log("🟡 [EnviarDocumentosRepositorio] ========================================");
    console.log(`✅ [EnviarDocumentosRepositorio] ${documentos.length} documentos enviados correctamente`);
    console.log("🟡 [EnviarDocumentosRepositorio] ========================================");
  }
}

