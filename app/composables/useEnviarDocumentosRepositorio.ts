import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useDownloadData } from "./useDownloadData";
import { useDocumentosGeneradosStore } from "~/core/presentation/juntas/documentos/stores/documentos-generados.store";
import { EnviarDocumentosRepositorioUseCase } from "~/core/hexag/repositorio/application/use-cases/enviar-documentos-repositorio.use-case";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import { useToast } from "~/components/ui/toast/use-toast";

/**
 * Composable para enviar documentos al repositorio
 * 
 * Gestiona el envío de documentos generados al repositorio documental
 */
export function useEnviarDocumentosRepositorio() {
  const route = useRoute();
  const { downloadData } = useDownloadData();
  const documentosStore = useDocumentosGeneradosStore();

  const isUploading = ref(false);
  const errorMessage = ref<string | null>(null);

  /**
   * Extrae el societyId de los parámetros de la ruta
   */
  const extractSocietyId = (): string | undefined => {
    const param = route.params.societyId;
    if (typeof param === "string" && param.length > 0) return param;
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return param[0];
    }
    return undefined;
  };

  /**
   * Extrae el flowId de los parámetros de la ruta
   */
  const extractFlowId = (): string | undefined => {
    const param = route.params.flowId;
    if (typeof param === "string" && param.length > 0) return param;
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return param[0];
    }
    return undefined;
  };

  // ✅ CONFIRMADO: structureId = societyId (son el mismo valor)
  const structureId = computed(() => {
    return extractSocietyId();
  });

  const flowId = computed(() => {
    return extractFlowId();
  });

  // Obtener fecha de la junta
  const fechaJunta = computed(() => {
    return downloadData.value?.meetingDetails?.firstCall?.dateFormatted || "";
  });

  /**
   * Envía documentos al repositorio
   * @param documentosEspecificos - Documentos específicos a enviar. Si no se proporciona, envía todos del store.
   */
  const enviarDocumentos = async (documentosEspecificos?: Documento[]) => {
    console.log("🟣 [useEnviarDocumentosRepositorio] ========================================");
    console.log("🟣 [useEnviarDocumentosRepositorio] ENVIAR DOCUMENTOS - INICIO");
    console.log("🟣 [useEnviarDocumentosRepositorio] ========================================");
    
    const currentStructureId = structureId.value;
    const currentFlowId = flowId.value;

    console.log("🟣 [useEnviarDocumentosRepositorio] Ruta actual:", route.path);
    console.log("🟣 [useEnviarDocumentosRepositorio] route.params:", route.params);
    console.log("🟣 [useEnviarDocumentosRepositorio] currentStructureId:", currentStructureId);
    console.log("🟣 [useEnviarDocumentosRepositorio] currentFlowId:", currentFlowId);
    console.log("🟣 [useEnviarDocumentosRepositorio] fechaJunta:", fechaJunta.value);

    if (!currentStructureId || !currentFlowId) {
      const missing = [];
      if (!currentStructureId) missing.push("societyId");
      if (!currentFlowId) missing.push("flowId");
      console.error("🔴 [useEnviarDocumentosRepositorio] ERROR: Faltan parámetros:", missing);
      throw new Error(
        `No se encontraron los siguientes parámetros en la ruta: ${missing.join(", ")}. ` +
        `Ruta actual: ${route.path}`
      );
    }

    if (!fechaJunta.value) {
      console.error("🔴 [useEnviarDocumentosRepositorio] ERROR: No hay fecha de junta");
      throw new Error("No se encontró la fecha de la junta");
    }

    // Usar documentos específicos si se proporcionan, sino usar todos del store
    const documentos = documentosEspecificos || documentosStore.documentos;
    console.log("🟣 [useEnviarDocumentosRepositorio] Documentos a enviar:", documentos.length);
    console.log("🟣 [useEnviarDocumentosRepositorio] Usando documentos específicos:", !!documentosEspecificos);
    
    if (documentos.length === 0) {
      console.error("🔴 [useEnviarDocumentosRepositorio] ERROR: No hay documentos");
      throw new Error("No hay documentos para enviar");
    }

    isUploading.value = true;
    errorMessage.value = null;

    try {
      console.log("🟣 [useEnviarDocumentosRepositorio] Creando repositorio y use case...");
      // Crear repositorio y use case
      const repository = new RepositorioDocumentosHttpRepository();
      const useCase = new EnviarDocumentosRepositorioUseCase(repository);

      console.log("🟣 [useEnviarDocumentosRepositorio] Ejecutando use case...");
      // Ejecutar envío
      await useCase.execute(
        currentStructureId,
        currentFlowId,
        documentos,
        fechaJunta.value
      );
      
      console.log("🟣 [useEnviarDocumentosRepositorio] ✅ Use case ejecutado exitosamente");

      // Mostrar éxito
      console.log("🟣 [useEnviarDocumentosRepositorio] Mostrando toast de éxito...");
      const toast = useToast();
      toast.toast({
        title: "Documentos enviados correctamente",
        description: "Los documentos se han enviado al repositorio documental",
        variant: "success",
      });
      console.log("🟣 [useEnviarDocumentosRepositorio] ========================================");
      console.log("✅ [useEnviarDocumentosRepositorio] PROCESO COMPLETADO EXITOSAMENTE");
      console.log("🟣 [useEnviarDocumentosRepositorio] ========================================");
    } catch (error: any) {
      console.error("🔴 [useEnviarDocumentosRepositorio] ========================================");
      console.error("🔴 [useEnviarDocumentosRepositorio] ERROR EN ENVÍO:");
      console.error("🔴 [useEnviarDocumentosRepositorio] Error completo:", error);
      console.error("🔴 [useEnviarDocumentosRepositorio] Error message:", error?.message);
      console.error("🔴 [useEnviarDocumentosRepositorio] Error stack:", error?.stack);
      console.error("🔴 [useEnviarDocumentosRepositorio] ========================================");
      
      const message =
        error?.message || "Error al enviar documentos al repositorio";
      errorMessage.value = message;
      const toast = useToast();
      toast.toast({
        title: "Error al enviar documentos",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      isUploading.value = false;
      console.log("🟣 [useEnviarDocumentosRepositorio] isUploading = false");
    }
  };

  return {
    isUploading,
    errorMessage,
    enviarDocumentos,
  };
}

