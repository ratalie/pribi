import { ref } from "vue";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import type { RepositorioNode } from "~/core/hexag/repositorio/domain/entities/repositorio-node.entity";

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
  const obtenerCarpetaDocumentosSocietarios = async (
    structureId: string
  ): Promise<string | null> => {
    // Si ya tenemos la carpeta en cache, retornarla
    if (carpetaCache.value) {
      return carpetaCache.value.id;
    }

    isLoading.value = true;
    try {
      const repository = new RepositorioDocumentosHttpRepository();

      console.log(
        "🔵 [useObtenerCarpetaDocumentosSocietarios] ========================================"
      );
      console.log("🔵 [useObtenerCarpetaDocumentosSocietarios] Obteniendo carpeta /core/");
      console.log("🔵 [useObtenerCarpetaDocumentosSocietarios] structureId:", structureId);
      console.log(
        "🔵 [useObtenerCarpetaDocumentosSocietarios] ========================================"
      );

      // Según la nueva estructura V2, /core/ es la raíz del almacén
      // Se obtiene de /nodes/root buscando el nodo con name === "core"
      const nodosRaiz = await repository.obtenerNodosRaiz(structureId);
      console.log(
        "🔵 [useObtenerCarpetaDocumentosSocietarios] Nodos raíz obtenidos:",
        nodosRaiz.length
      );

      // Buscar la carpeta "core"
      const carpetaCore = nodosRaiz.find(
        (node) => node.type === "folder" && node.name.toLowerCase() === "core"
      );

      // ❌ ELIMINADO: Lógica de inicialización automática
      // El repositorio debe crearse automáticamente al crear la sociedad (backend)
      // Si no existe, es un error
      if (!carpetaCore) {
        console.error(
          "❌ [useObtenerCarpetaDocumentosSocietarios] Repositorio no existe. La sociedad debe tener el repositorio creado automáticamente al crearse."
        );
        return null;
      }

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

      // Si después de todo no se encuentra, mostrar error
      console.error(
        "❌ [useObtenerCarpetaDocumentosSocietarios] No se pudo obtener la carpeta 'core' después de inicializar"
      );
      return null;
    } catch (error: any) {
      console.error(
        "❌ [useObtenerCarpetaDocumentosSocietarios] Error al obtener carpeta:",
        error
      );
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
