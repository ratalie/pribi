import { ref } from 'vue';
import { RepositorioDocumentosHttpRepository } from '~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository';
import type { RepositorioNode } from '~/core/hexag/repositorio/domain/entities/repositorio-node.entity';

/**
 * Composable para obtener el nodo raíz del repositorio
 * 
 * El nodo raíz es necesario cuando queremos subir archivos en la raíz
 */
export function useObtenerNodoRaiz() {
  const nodoRaizCache = ref<RepositorioNode | null>(null);
  const isLoading = ref(false);

  /**
   * Obtiene el nodo raíz (carpeta /core/) de una sociedad
   * Usa cache para evitar múltiples llamadas
   * 
   * Estrategia:
   * 1. Primero intenta obtener nodos raíz con /nodes/root
   * 2. Si no hay nodos raíz, busca en /nodes/core el nodo con path="/core/"
   * 3. Si la sociedad está vacía, retorna null (no se puede subir sin nodo raíz)
   */
  const obtenerNodoRaiz = async (structureId: string): Promise<string | null> => {
    // Si ya tenemos el nodo raíz en cache, retornarlo
    if (nodoRaizCache.value) {
      return nodoRaizCache.value.id;
    }

    isLoading.value = true;
    try {
      const repository = new RepositorioDocumentosHttpRepository();
      
      // 1. Intentar obtener nodos raíz (core y common) - más eficiente
      let nodoCore: RepositorioNode | undefined;
      
      try {
        const nodosRaiz = await repository.obtenerNodosRaiz(structureId);
        // Buscar el nodo "core" en los nodos raíz
        // Según el backend, el nodo core tiene name: "core", path: "/", parentId: null
        nodoCore = nodosRaiz.find(
          (node) => node.type === "folder" && node.name.toLowerCase() === "core"
        );
        
        if (nodoCore) {
          console.log("🟢 [useObtenerNodoRaiz] Nodo raíz encontrado en /nodes/root:", nodoCore.id);
        }
      } catch (error) {
        console.warn("⚠️ [useObtenerNodoRaiz] No se pudieron obtener nodos raíz, intentando con core...");
      }

      // 2. Si no se encontró en nodos raíz, buscar en nodos core (fallback)
      if (!nodoCore) {
        const nodosCore = await repository.obtenerNodosCore(structureId);
        
        // Si la sociedad está vacía, no hay nodo raíz
        if (nodosCore.length === 0) {
          console.warn("⚠️ [useObtenerNodoRaiz] La sociedad no tiene nodos core (sociedad vacía)");
          return null;
        }

        // El nodo raíz /core/ tiene id: 1 según el backend
        // Buscar el nodo con id: "1" o el que tenga parentId: null y sea carpeta
        nodoCore = nodosCore.find(
          (node) => node.type === "folder" && (node.id === "1" || !node.parentId)
        );

        // Si no se encuentra, buscar el nodo con el menor ID que sea carpeta
        if (!nodoCore) {
          const carpetas = nodosCore.filter(node => node.type === "folder");
          if (carpetas.length > 0) {
            // Ordenar por ID y tomar el primero (probablemente el raíz con id: 1)
            carpetas.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            nodoCore = carpetas[0];
          }
        }
      }

      if (nodoCore) {
        nodoRaizCache.value = nodoCore;
        console.log("🟢 [useObtenerNodoRaiz] Nodo raíz obtenido:", {
          id: nodoCore.id,
          name: nodoCore.name,
          path: nodoCore.path,
        });
        return nodoCore.id;
      }

      console.warn("⚠️ [useObtenerNodoRaiz] No se encontró el nodo raíz (core)");
      return null;
    } catch (error: any) {
      console.error("❌ [useObtenerNodoRaiz] Error al obtener nodo raíz:", error);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Limpia el cache del nodo raíz
   */
  const limpiarCache = () => {
    nodoRaizCache.value = null;
  };

  return {
    obtenerNodoRaiz,
    limpiarCache,
    isLoading,
  };
}

