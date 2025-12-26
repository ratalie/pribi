import { ref } from "vue";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import type { RepositorioNode } from "~/core/hexag/repositorio/domain/entities/repositorio-node.entity";

/**
 * Composable para obtener el nodo "juntas" del repositorio
 * 
 * Este nodo se usa como parent para crear carpetas de juntas
 */
export function useObtenerNodoJuntas() {
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);
  const nodoJuntas = ref<RepositorioNode | null>(null);

  /**
   * Obtiene el nodo "juntas" desde /core/juntas/
   * 
   * @param structureId ID de la estructura de la sociedad
   * @returns Nodo "juntas" (parent para crear carpetas de juntas)
   */
  const obtenerNodoJuntas = async (structureId: string): Promise<RepositorioNode> => {
    console.log("🟣 [useObtenerNodoJuntas] ========================================");
    console.log("🟣 [useObtenerNodoJuntas] OBTENER NODO JUNTAS");
    console.log("🟣 [useObtenerNodoJuntas] ========================================");
    console.log("🟣 [useObtenerNodoJuntas] structureId:", structureId);

    isLoading.value = true;
    errorMessage.value = null;

    try {
      const repository = new RepositorioDocumentosHttpRepository();
      
      // 1. Obtener todos los nodos core
      const nodos = await repository.obtenerNodosCore(structureId);
      
      // 2. Buscar el nodo "juntas" (type: folder, name: "juntas", path: "/core/")
      const nodo = nodos.find(
        (node) => 
          node.type === "folder" && 
          node.name === "juntas" && 
          node.path === "/core/"
      );

      if (!nodo) {
        throw new Error("No se encontró el nodo 'juntas' en el repositorio");
      }

      nodoJuntas.value = nodo;
      
      console.log("✅ [useObtenerNodoJuntas] Nodo 'juntas' encontrado:", {
        id: nodo.id,
        name: nodo.name,
        path: nodo.path,
      });
      console.log("🟣 [useObtenerNodoJuntas] ========================================");

      return nodo;
    } catch (error: any) {
      console.error("🔴 [useObtenerNodoJuntas] ========================================");
      console.error("🔴 [useObtenerNodoJuntas] ERROR AL OBTENER NODO JUNTAS:");
      console.error("🔴 [useObtenerNodoJuntas] Error completo:", error);
      console.error("🔴 [useObtenerNodoJuntas] ========================================");

      const message = error?.message || "Error al obtener el nodo 'juntas'";
      errorMessage.value = message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    errorMessage,
    nodoJuntas,
    obtenerNodoJuntas,
  };
}


