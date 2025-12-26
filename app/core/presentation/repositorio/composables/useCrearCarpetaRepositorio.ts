import { ref } from "vue";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import type { RepositorioNode } from "~/core/hexag/repositorio/domain/entities/repositorio-node.entity";

/**
 * Composable para crear carpetas en el repositorio
 * 
 * Endpoint: POST /api/v2/repository/society-profile/:structureId/nodes/:parentNodeId/folder
 */
export function useCrearCarpetaRepositorio() {
  const isCreating = ref(false);
  const errorMessage = ref<string | null>(null);

  /**
   * Crea una carpeta en el repositorio
   * 
   * @param structureId ID de la estructura de la sociedad
   * @param parentNodeId ID del nodo padre donde se creará la carpeta
   * @param nombre Nombre de la carpeta (ej: "20 de diciembre del 2025")
   * @param description Descripción opcional
   * @returns Nodo creado de la carpeta
   */
  const crearCarpeta = async (
    structureId: string,
    parentNodeId: number,
    nombre: string,
    description?: string
  ): Promise<RepositorioNode> => {
    console.log("🟣 [useCrearCarpetaRepositorio] ========================================");
    console.log("🟣 [useCrearCarpetaRepositorio] CREAR CARPETA");
    console.log("🟣 [useCrearCarpetaRepositorio] ========================================");
    console.log("🟣 [useCrearCarpetaRepositorio] structureId:", structureId);
    console.log("🟣 [useCrearCarpetaRepositorio] parentNodeId:", parentNodeId);
    console.log("🟣 [useCrearCarpetaRepositorio] nombre:", nombre);
    console.log("🟣 [useCrearCarpetaRepositorio] description:", description);

    isCreating.value = true;
    errorMessage.value = null;

    try {
      const repository = new RepositorioDocumentosHttpRepository();
      const carpeta = await repository.crearCarpeta(
        structureId,
        parentNodeId,
        nombre,
        description
      );

      console.log("✅ [useCrearCarpetaRepositorio] Carpeta creada exitosamente:", {
        id: carpeta.id,
        name: carpeta.name,
        path: carpeta.path,
      });
      console.log("🟣 [useCrearCarpetaRepositorio] ========================================");

      return carpeta;
    } catch (error: any) {
      console.error("🔴 [useCrearCarpetaRepositorio] ========================================");
      console.error("🔴 [useCrearCarpetaRepositorio] ERROR AL CREAR CARPETA:");
      console.error("🔴 [useCrearCarpetaRepositorio] Error completo:", error);
      console.error("🔴 [useCrearCarpetaRepositorio] ========================================");

      const message = error?.message || "Error al crear la carpeta";
      errorMessage.value = message;
      throw error;
    } finally {
      isCreating.value = false;
    }
  };

  return {
    isCreating,
    errorMessage,
    crearCarpeta,
  };
}


