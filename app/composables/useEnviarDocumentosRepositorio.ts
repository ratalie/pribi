import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useDownloadData } from "./useDownloadData";
import { useDocumentosGeneradosStore } from "~/core/presentation/juntas/documentos/stores/documentos-generados.store";
import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
import { EnviarDocumentosRepositorioUseCase } from "~/core/hexag/repositorio/application/use-cases/enviar-documentos-repositorio.use-case";
import { RepositorioDocumentosHttpRepository } from "~/core/hexag/repositorio/infrastructure/repositories/repositorio-documentos-http.repository";
import { useToast } from "~/components/ui/toast/use-toast";
import type { Documento } from "~/core/hexag/documentos/domain/entities/documento.entity";
import { OrdenConvocatoria } from "~/core/hexag/juntas/domain/enums/orden-convocatoria.enum";

/**
 * Composable para enviar documentos al repositorio
 * 
 * Gestiona el envío de documentos generados al repositorio documental
 */
export function useEnviarDocumentosRepositorio() {
  const route = useRoute();
  const { downloadData } = useDownloadData();
  const documentosStore = useDocumentosGeneradosStore();
  const meetingDetailsStore = useMeetingDetailsStore();

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

  // Obtener fecha de instalación de la junta según lógica de negocio:
  // - JUNTA_UNIVERSAL: siempre usa firstCall.date
  // - JUNTA_GENERAL: usa firstCall.date o secondCall.date según instaladaEnConvocatoria
  // 
  // instaladaEnConvocatoria viene del paso "instalación de la junta" y está en meetingDetailsStore
  const fechaJunta = computed(() => {
    const meetingDetailsFromDownload = downloadData.value?.meetingDetails;
    if (!meetingDetailsFromDownload) {
      console.error("🔴 [useEnviarDocumentosRepositorio] No hay meetingDetails en downloadData");
      return "";
    }

    const meetingType = meetingDetailsFromDownload.meetingType;
    console.log("🔵 [useEnviarDocumentosRepositorio] Tipo de junta:", meetingType);

    // Lógica según tipo de junta
    if (meetingType === "JUNTA_UNIVERSAL") {
      // Junta Universal: siempre usa primera convocatoria
      const dateISO = meetingDetailsFromDownload.firstCall?.date;
      if (!dateISO) {
        console.error("🔴 [useEnviarDocumentosRepositorio] No hay fecha de primera convocatoria para Junta Universal");
        return "";
      }
      console.log("🔵 [useEnviarDocumentosRepositorio] Junta Universal: usando firstCall.date");
      return formatDateToLegible(dateISO);
    }

    // Junta General: usar instaladaEnConvocatoria del store para decidir
    // instaladaEnConvocatoria viene del paso "instalación de la junta"
    // Puede ser OrdenConvocatoria.PRIMERA o OrdenConvocatoria.SEGUNDA
    const meetingDetailsFromStore = meetingDetailsStore.meetingDetails;
    const instaladaEnConvocatoria = meetingDetailsFromStore?.instaladaEnConvocatoria || OrdenConvocatoria.PRIMERA;
    
    console.log("🔵 [useEnviarDocumentosRepositorio] Junta General - instaladaEnConvocatoria:", instaladaEnConvocatoria);
    console.log("🔵 [useEnviarDocumentosRepositorio] meetingDetailsFromStore:", meetingDetailsFromStore);

    if (instaladaEnConvocatoria === OrdenConvocatoria.PRIMERA) {
      const dateISO = meetingDetailsFromDownload.firstCall?.date;
      if (!dateISO) {
        console.error("🔴 [useEnviarDocumentosRepositorio] No hay fecha de primera convocatoria");
        return "";
      }
      console.log("🔵 [useEnviarDocumentosRepositorio] Junta General (PRIMERA): usando firstCall.date");
      return formatDateToLegible(dateISO);
    } else {
      // SEGUNDA convocatoria
      const dateISO = meetingDetailsFromDownload.secondCall?.date;
      if (!dateISO) {
        console.error("🔴 [useEnviarDocumentosRepositorio] No hay fecha de segunda convocatoria");
        return "";
      }
      console.log("🔵 [useEnviarDocumentosRepositorio] Junta General (SEGUNDA): usando secondCall.date");
      return formatDateToLegible(dateISO);
    }
  });

  /**
   * Formatea una fecha ISO a formato legible en español
   * Ejemplo: "2025-12-10T00:00:00.000Z" -> "10 de diciembre del 2025"
   */
  const formatDateToLegible = (dateISO: string): string => {
    try {
      const date = new Date(dateISO);
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
      ];
      
      return `${day} de ${meses[month]} del ${year}`;
    } catch (error) {
      console.error("🔴 [useEnviarDocumentosRepositorio] Error al formatear fecha:", error);
      return "";
    }
  };

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
      console.log("🟣 [useEnviarDocumentosRepositorio] fechaJunta (legible):", fechaJunta.value);
      console.log("🟣 [useEnviarDocumentosRepositorio] NOTA: Los documentos se subirán directamente a la carpeta de la junta y se renombrará con la fecha");
      // Ejecutar envío - Pasamos fechaJunta para renombrar la carpeta
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

