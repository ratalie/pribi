import { ref } from 'vue';
import { RepositorioDocumentosHttpRepository } from '~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository';
import type { RepositorioNode } from '~/core/hexag/repositorio/domain/entities/repositorio-node.entity';

/**
 * Composable para obtener la carpeta /core/
 * 
 * Según la nueva estructura V2, /core/ es la raíz del almacén (Google Drive clone).
 * Cuando se sube un archivo desde la raíz del almacén, debe subirse a /core/.
 */
export function useObtenerCarpetaDocumentosSocietarios() {
  const carpetaCache = ref<RepositorioNode | null>(null);
  const isLoading = ref(false);

  /**
   * Obtiene la carpeta /core/ de una sociedad
   * 
   * Según la nueva estructura V2:
   * - /core/ es la raíz del almacén (Google Drive clone)
   * - Se obtiene de /nodes/root buscando el nodo con name === "core"
   * - NO existe una carpeta "Documentos Societarios" separada
   */
  const obtenerCarpetaDocumentosSocietarios = async (structureId: string): Promise<string | null> => {
    // Si ya tenemos la carpeta en cache, retornarla
    if (carpetaCache.value) {
      return carpetaCache.value.id;
    }

    isLoading.value = true;
    try {
      const repository = new RepositorioDocumentosHttpRepository();
      
      console.log("🔵 [useObtenerCarpetaDocumentosSocietarios] ========================================");
      console.log("🔵 [useObtenerCarpetaDocumentosSocietarios] Obteniendo carpeta /core/");
      console.log("🔵 [useObtenerCarpetaDocumentosSocietarios] structureId:", structureId);
      console.log("🔵 [useObtenerCarpetaDocumentosSocietarios] ========================================");
      
      // Según la nueva estructura V2, /core/ es la raíz del almacén
      // Se obtiene de /nodes/root buscando el nodo con name === "core"
      const nodosRaiz = await repository.obtenerNodosRaiz(structureId);
      console.log("🔵 [useObtenerCarpetaDocumentosSocietarios] Nodos raíz obtenidos:", nodosRaiz.length);
      
      if (nodosRaiz.length === 0) {
        console.warn("⚠️ [useObtenerCarpetaDocumentosSocietarios] No se encontraron nodos raíz. La sociedad puede no tener la estructura inicializada.");
        console.warn("⚠️ [useObtenerCarpetaDocumentosSocietarios] structureId usado:", structureId);
        return null;
      }
      
      // Buscar la carpeta "core"
      const carpetaCore = nodosRaiz.find(node => 
        node.type === 'folder' && node.name.toLowerCase() === 'core'
      );

      if (carpetaCore) {
        carpetaCache.value = carpetaCore;
        console.log("🟢 [useObtenerCarpetaDocumentosSocietarios] Carpeta /core/ encontrada:", {
          id: carpetaCore.id,
          name: carpetaCore.name,
          path: carpetaCore.path,
          code: carpetaCore.code,
        });
        return carpetaCore.id;
      }

      // Si no se encuentra, mostrar todos los nodos raíz para debugging
      console.warn("⚠️ [useObtenerCarpetaDocumentosSocietarios] No se encontró la carpeta 'core'");
      console.warn("⚠️ [useObtenerCarpetaDocumentosSocietarios] NODOS RAÍZ DISPONIBLES:");
      nodosRaiz.forEach((nodo, index) => {
        console.warn(`⚠️ [useObtenerCarpetaDocumentosSocietarios] Nodo raíz ${index + 1}:`, {
          id: nodo.id,
          name: nodo.name,
          code: nodo.code || '(sin código)',
          path: nodo.path,
          type: nodo.type,
        });
      });
      
      return null;
    } catch (error: any) {
      console.error("❌ [useObtenerCarpetaDocumentosSocietarios] Error al obtener carpeta:", error);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Limpia el cache de la carpeta
   */
  const limpiarCache = () => {
    carpetaCache.value = null;
  };

  return {
    obtenerCarpetaDocumentosSocietarios,
    limpiarCache,
    isLoading,
  };
}

