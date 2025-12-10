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
      
      // 1. Intentar obtener nodos raíz (core y common)
      let nodoCore: RepositorioNode | undefined;
      
      try {
        const nodosRaiz = await repository.obtenerNodosRaiz(structureId);
        // Buscar el nodo "core" en los nodos raíz
        nodoCore = nodosRaiz.find(
          (node) => node.type === "folder" && (node.path === "/core/" || node.name.toLowerCase() === "core")
        );
      } catch (error) {
        console.warn("⚠️ [useObtenerNodoRaiz] No se pudieron obtener nodos raíz, intentando con core...");
      }

      // 2. Si no se encontró en nodos raíz, buscar en nodos core
      if (!nodoCore) {
        const nodosCore = await repository.obtenerNodosCore(structureId);
        
        // Si la sociedad está vacía, no hay nodo raíz
        if (nodosCore.length === 0) {
          console.warn("⚠️ [useObtenerNodoRaiz] La sociedad no tiene nodos core (sociedad vacía)");
          return null;
        }

        // Buscar el nodo con path="/core/" o el que tenga el menor parentId (probablemente el raíz)
        // Según la respuesta del backend, los nodos con parentId: 1 son hijos directos de /core/
        // El nodo raíz /core/ probablemente tiene id: 1 o parentId: null
        nodoCore = nodosCore.find(
          (node) => node.type === "folder" && node.path === "/core/"
        );

        // Si no se encuentra con path="/core/", buscar el nodo con el menor ID que sea carpeta
        // (probablemente el nodo raíz tiene id: 1)
        if (!nodoCore) {
          const carpetas = nodosCore.filter(node => node.type === "folder");
          if (carpetas.length > 0) {
            // Ordenar por ID y tomar el primero (probablemente el raíz)
            carpetas.sort((a, b) => parseInt(a.id) - parseInt(b.id));
            // Buscar el que tenga parentId más bajo o null
            nodoCore = carpetas.find(node => !node.parentId || node.parentId === "1") || carpetas[0];
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

