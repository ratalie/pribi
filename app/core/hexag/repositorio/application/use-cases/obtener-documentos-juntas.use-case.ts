import type { RepositorioDocumentosRepository } from "../../domain/ports/repositorio-documentos.repository";
import type { RepositorioNode } from "../../domain/entities/repositorio-node.entity";

/**
 * Use Case: Obtener Documentos de Juntas
 * 
 * Responsabilidad: Orquestar la obtención de documentos de juntas desde el repositorio
 * Ubicación: Application (según arquitectura hexagonal)
 */
export class ObtenerDocumentosJuntasUseCase {
  constructor(
    private readonly repositorioDocumentosRepository: RepositorioDocumentosRepository
  ) {}

  /**
   * Obtiene todas las carpetas de juntas de una sociedad
   * 
   * Filtra los nodos que:
   * - Son carpetas (type === 1)
   * - Están en el path "/core/juntas/"
   * 
   * @param structureId ID de la estructura de la sociedad
   * @returns Lista de carpetas de juntas
   */
  async obtenerCarpetasJuntas(structureId: string): Promise<RepositorioNode[]> {
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] structureId:", structureId);

    try {
      // 1. Obtener todos los nodos core
      const nodos = await this.repositorioDocumentosRepository.obtenerNodosCore(structureId);
      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core:", nodos.length);

      // 2. Encontrar el nodo "juntas" (parentId: 2, path: "/core/", name: "juntas")
      const nodoJuntas = nodos.find(
        (node) => node.type === "folder" && node.name === "juntas" && node.path === "/core/"
      );
      
      if (!nodoJuntas) {
        console.log("🟡 [ObtenerDocumentosJuntasUseCase] No se encontró el nodo 'juntas'");
        return [];
      }

      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas' encontrado:", {
        id: nodoJuntas.id,
        name: nodoJuntas.name,
        path: nodoJuntas.path,
      });

      // 3. Filtrar carpetas que son hijas directas del nodo "juntas"
      // Estas son las carpetas de juntas individuales (flowId)
      // Estructura: path: "/core/juntas/", name: "{flowId}", parentId: {id del nodo juntas}
      const carpetasJuntas = nodos.filter((node) => {
        if (node.type !== "folder") return false;
        // Debe ser hija directa del nodo "juntas"
        if (node.parentId !== nodoJuntas.id) return false;
        // El path debe ser "/core/juntas/"
        if (node.path !== "/core/juntas/") return false;
        // El name debe ser numérico (el flowId)
        return /^\d+$/.test(node.name);
      });

      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas:", carpetasJuntas.length);
      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Carpetas:", carpetasJuntas.map(c => ({ 
        id: c.id, 
        name: c.name, 
        path: c.path,
        parentId: c.parentId 
      })));

      // 4. Para cada carpeta de junta, obtener sus hijos (carpetas de documentos)
      const carpetasJuntasConHijos = await Promise.all(
        carpetasJuntas.map(async (carpeta) => {
          try {
            const carpetaCompleta = await this.repositorioDocumentosRepository.obtenerNodoPorId(carpeta.id);
            console.log("🟡 [ObtenerDocumentosJuntasUseCase] Carpeta completa obtenida:", {
              id: carpetaCompleta?.id,
              name: carpetaCompleta?.name,
              childrenCount: carpetaCompleta?.children?.length || 0,
            });
            return carpetaCompleta || carpeta;
          } catch (error) {
            console.error("🔴 [ObtenerDocumentosJuntasUseCase] Error al obtener hijos de carpeta:", error);
            return carpeta;
          }
        })
      );

      console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");

      return carpetasJuntasConHijos;
    } catch (error: any) {
      console.error("🔴 [ObtenerDocumentosJuntasUseCase] ERROR:", error);
      throw error;
    }
  }

  /**
   * Obtiene los documentos dentro de una carpeta de junta específica
   * 
   * @param carpetaId ID de la carpeta de junta (string)
   * @returns Lista de documentos dentro de la carpeta
   */
  async obtenerDocumentosDeCarpeta(carpetaId: string): Promise<RepositorioNode[]> {
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] OBTENER DOCUMENTOS DE CARPETA");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] carpetaId:", carpetaId);

    try {
      // 1. Obtener el nodo (carpeta) con sus hijos
      const carpeta = await this.repositorioDocumentosRepository.obtenerNodoPorId(carpetaId);
      
      if (!carpeta) {
        console.log("🟡 [ObtenerDocumentosJuntasUseCase] Carpeta no encontrada");
        return [];
      }

      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Carpeta obtenida:", {
        id: carpeta.id,
        name: carpeta.name,
        type: carpeta.type,
        childrenCount: carpeta.children?.length || 0,
      });

      // 2. Retornar todos los hijos (pueden ser carpetas de documentos o documentos directos)
      // Las carpetas de documentos tienen nombres como "documentos juntas: {fecha}"
      // Los documentos directos tienen type === "document"
      const hijos = carpeta.children || [];

      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Hijos encontrados:", hijos.length);
      if (hijos.length > 0) {
        console.log("🟡 [ObtenerDocumentosJuntasUseCase] Detalle de hijos:", hijos.map(h => ({
          id: h.id,
          name: h.name,
          type: h.type,
        })));
      }
      console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");

      return hijos;
    } catch (error: any) {
      console.error("🔴 [ObtenerDocumentosJuntasUseCase] ERROR:", error);
      throw error;
    }
  }

  /**
   * Obtiene la estructura de "operaciones" (directorio y juntas)
   * 
   * @param structureId ID de la estructura de la sociedad
   * @returns Estructura de operaciones con directorio y juntas
   */
  async obtenerEstructuraOperaciones(structureId: string): Promise<{
    directorio: RepositorioNode | null;
    juntas: RepositorioNode | null;
  }> {
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] structureId:", structureId);

    try {
      // 1. Obtener todos los nodos core
      const nodos = await this.repositorioDocumentosRepository.obtenerNodosCore(structureId);
      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core:", nodos.length);

      // 2. Encontrar nodo "core" (parentId: 2 o null, path: "/core/")
      // Los nodos con parentId: 2 son hijos directos de "core"
      const nodoDirectorio = nodos.find(
        (node) => node.type === "folder" && node.name === "directorio" && node.path === "/core/"
      );
      
      const nodoJuntas = nodos.find(
        (node) => node.type === "folder" && node.name === "juntas" && node.path === "/core/"
      );

      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados:", {
        directorio: nodoDirectorio ? { id: nodoDirectorio.id, name: nodoDirectorio.name } : null,
        juntas: nodoJuntas ? { id: nodoJuntas.id, name: nodoJuntas.name } : null,
      });
      console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");

      return {
        directorio: nodoDirectorio || null,
        juntas: nodoJuntas || null,
      };
    } catch (error: any) {
      console.error("🔴 [ObtenerDocumentosJuntasUseCase] ERROR:", error);
      throw error;
    }
  }

  /**
   * Obtiene la estructura completa de juntas para la vista
   * 
   * Retorna estructura compatible con la vista actual:
   * {
   *   operaciones: {
   *     juntas: [carpetas de juntas]
   *   }
   * }
   * 
   * @param structureId ID de la estructura de la sociedad
   * @returns Estructura de juntas
   */
  async obtenerEstructuraJuntas(structureId: string): Promise<{
    operaciones: {
      juntas: RepositorioNode[];
    };
  }> {
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA JUNTAS");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] structureId:", structureId);

    try {
      const carpetasJuntas = await this.obtenerCarpetasJuntas(structureId);

      const estructura = {
        operaciones: {
          juntas: carpetasJuntas,
        },
      };

      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Estructura obtenida:", {
        totalJuntas: carpetasJuntas.length,
      });
      console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");

      return estructura;
    } catch (error: any) {
      console.error("🔴 [ObtenerDocumentosJuntasUseCase] ERROR:", error);
      throw error;
    }
  }
}

