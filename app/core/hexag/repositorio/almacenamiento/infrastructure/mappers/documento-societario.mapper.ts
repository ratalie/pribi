import type { RepositorioNode } from '~/core/hexag/repositorio/domain/entities/repositorio-node.entity';
import type { DocumentoSocietario } from '../../domain/entities/documento-societario.entity';
import type { CarpetaSistema } from '../../domain/entities/carpeta-sistema.entity';

/**
 * Mapper para convertir RepositorioNode a DocumentoSocietario
 * 
 * Responsabilidad: Transformar nodos del repositorio a documentos societarios
 * Ubicación: Infrastructure (según arquitectura hexagonal)
 */
export class DocumentoSocietarioMapper {
  /**
   * Convierte un RepositorioNode a DocumentoSocietario
   */
  static toDocumentoSocietario(node: RepositorioNode): DocumentoSocietario {
    // Obtener versionCode y userName de la primera versión si está disponible
    const firstVersion = node.versions && node.versions.length > 0 
      ? node.versions[0] 
      : null;
    const versionCode = firstVersion?.versionCode;
    const userName = firstVersion?.userName || null;
    
    return {
      id: node.id,
      nombre: node.name,
      tipo: node.type === 'folder' ? 'folder' : 'file',
      tamaño: node.sizeInBytes,
      fechaModificacion: new Date(node.updatedAt),
      propietario: userName || 'Usuario desconocido',
      mimeType: node.mimeType,
      versionCode: versionCode,
      code: node.code, // UUID del nodo (nodeCode) para previews
      nodeId: node.id, // ID numérico del nodo
    };
  }

  /**
   * Convierte un RepositorioNode a CarpetaSistema
   */
  static toCarpetaSistema(node: RepositorioNode): CarpetaSistema {
    const documento = this.toDocumentoSocietario(node);
    return {
      ...documento,
      tipo: 'folder' as const,
    };
  }

  /**
   * Convierte un array de RepositorioNode a DocumentoSocietario[]
   */
  static toDocumentosSocietarios(nodes: RepositorioNode[]): DocumentoSocietario[] {
    return nodes.map(this.toDocumentoSocietario);
  }
}

