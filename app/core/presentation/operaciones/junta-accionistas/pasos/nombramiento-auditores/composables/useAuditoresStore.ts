import { ref } from "vue";

/**
 * Store compartido para el flujo de nombramiento de auditores
 * Permite compartir el estado entre las páginas de nombramiento y votación
 */
export const useAuditoresStore = () => {
  const nombreAuditor = ref("");

  return {
    nombreAuditor,
  };
};
