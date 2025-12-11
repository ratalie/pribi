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
   * Según la nueva estructura V2:
   * - Las carpetas de juntas están en: /core/documentos-generados/operaciones/juntas-accionistas/
   * - NO en: /core/juntas/ (estructura antigua)
   * 
   * Filtra los nodos que:
   * - Son carpetas (type === 1)
   * - Están en el path "/core/documentos-generados/operaciones/juntas-accionistas/"
   * - Tienen nombres legibles como "junta del 11 de diciembre del 2025"
   * 
   * @param structureId ID de la estructura de la sociedad
   * @returns Lista de carpetas de juntas
   */
  async obtenerCarpetasJuntas(structureId: string): Promise<RepositorioNode[]> {
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] OBTENER CARPETAS JUNTAS (V2)");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] structureId:", structureId);

    try {
      // 1. Obtener todos los nodos core
      const nodos = await this.repositorioDocumentosRepository.obtenerNodosCore(structureId);
      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core:", nodos.length);

      // 2. Encontrar el nodo "juntas-accionistas" en la nueva estructura V2
      // Path: "/core/documentos-generados/operaciones/juntas-accionistas/"
      const nodoJuntasAccionistas = nodos.find(
        (node) => 
          node.type === "folder" && 
          node.name === "juntas-accionistas" && 
          node.path === "/core/documentos-generados/operaciones/"
      );
      
      if (!nodoJuntasAccionistas) {
        console.log("🟡 [ObtenerDocumentosJuntasUseCase] No se encontró el nodo 'juntas-accionistas' (estructura V2)");
        console.log("🟡 [ObtenerDocumentosJuntasUseCase] Buscando nodos con path que contenga 'juntas-accionistas'...");
        const nodosJuntas = nodos.filter(n => 
          n.type === "folder" && 
          (n.path?.includes("juntas-accionistas") || n.name === "juntas-accionistas")
        );
        console.log("🟡 [ObtenerDocumentosJuntasUseCase] Nodos relacionados con juntas-accionistas:", nodosJuntas.map(n => ({
          id: n.id,
          name: n.name,
          path: n.path,
          parentId: n.parentId,
        })));
        return [];
      }

      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Nodo 'juntas-accionistas' encontrado:", {
        id: nodoJuntasAccionistas.id,
        name: nodoJuntasAccionistas.name,
        path: nodoJuntasAccionistas.path,
      });

      // 3. Filtrar carpetas que son hijas directas del nodo "juntas-accionistas"
      // Estas son las carpetas de juntas individuales con nombres como:
      // - "junta del 11 de diciembre del 2025" (formato nuevo con "junta del")
      // - "11 de diciembre del 2025" (formato antiguo sin "junta del")
      // Estructura: path: "/core/documentos-generados/operaciones/juntas-accionistas/", parentId: {id del nodo juntas-accionistas}
      const carpetasJuntas = nodos.filter((node) => {
        if (node.type !== "folder") return false;
        // Debe ser hija directa del nodo "juntas-accionistas"
        if (node.parentId !== nodoJuntasAccionistas.id) return false;
        // El path debe ser "/core/documentos-generados/operaciones/juntas-accionistas/"
        if (node.path !== "/core/documentos-generados/operaciones/juntas-accionistas/") return false;
        // Incluir carpetas con nombre que contenga fecha legible
        // Formato nuevo: "junta del 11 de diciembre del 2025"
        // Formato antiguo: "11 de diciembre del 2025"
        const esFechaLegibleNueva = /^junta\s+del\s+\d+\s+de\s+\w+\s+del\s+\d{4}$/.test(node.name);
        const esFechaLegibleAntigua = /^\d+\s+de\s+\w+\s+del\s+\d{4}$/.test(node.name);
        return esFechaLegibleNueva || esFechaLegibleAntigua;
      });

      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Carpetas de juntas encontradas:", carpetasJuntas.length);
      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Carpetas:", carpetasJuntas.map(c => ({ 
        id: c.id, 
        name: c.name, 
        path: c.path,
        parentId: c.parentId 
      })));

      // 4. Para cada carpeta de junta, obtener sus hijos (documentos)
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
   * Obtiene la estructura de "operaciones" (directorio y juntas-accionistas)
   * 
   * Según la nueva estructura V2:
   * - Directorio: /core/documentos-generados/operaciones/directorio/
   * - Juntas: /core/documentos-generados/operaciones/juntas-accionistas/
   * 
   * @param structureId ID de la estructura de la sociedad
   * @returns Estructura de operaciones con directorio y juntas-accionistas
   */
  async obtenerEstructuraOperaciones(structureId: string): Promise<{
    directorio: RepositorioNode | null;
    juntas: RepositorioNode | null;
  }> {
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] OBTENER ESTRUCTURA OPERACIONES (V2)");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] ========================================");
    console.log("🟡 [ObtenerDocumentosJuntasUseCase] structureId:", structureId);

    try {
      // 1. Obtener todos los nodos core
      const nodos = await this.repositorioDocumentosRepository.obtenerNodosCore(structureId);
      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Total nodos core:", nodos.length);

      // 2. Encontrar nodos en la nueva estructura V2
      // Directorio: /core/documentos-generados/operaciones/directorio/
      // Juntas: /core/documentos-generados/operaciones/juntas-accionistas/
      const nodoDirectorio = nodos.find(
        (node) => 
          node.type === "folder" && 
          node.name === "directorio" && 
          node.path === "/core/documentos-generados/operaciones/"
      );
      
      const nodoJuntas = nodos.find(
        (node) => 
          node.type === "folder" && 
          node.name === "juntas-accionistas" && 
          node.path === "/core/documentos-generados/operaciones/"
      );

      console.log("🟡 [ObtenerDocumentosJuntasUseCase] Nodos encontrados (V2):", {
        directorio: nodoDirectorio ? { id: nodoDirectorio.id, name: nodoDirectorio.name, path: nodoDirectorio.path } : null,
        juntas: nodoJuntas ? { id: nodoJuntas.id, name: nodoJuntas.name, path: nodoJuntas.path } : null,
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

