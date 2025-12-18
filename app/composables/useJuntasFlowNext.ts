import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";
import { useJuntasNavbarStore } from "~/stores/useJuntasNavbarStore";
import { getBaseSectionsForSubStep } from "~/config/juntas/sections.config";
import { getSectionRoutesForSubStep } from "~/config/juntas/navigation-routes.config";
import { detectCurrentSection } from "~/utils/juntas/navigation.utils";
import { buildBasePath } from "~/utils/juntas/route-detection.utils";
import { buildJuntaRoute } from "~/utils/juntas/route-builder.utils";
import { JuntaRoutes } from "~/config/routes/junta-accionistas.routes";
import type { JuntaNavigationContext } from "~/types/junta-navigation.types";

/**
 * Construye la ruta para un sub-step (punto de agenda)
 * Duplicado de la función en junta-navigation.ts porque es privada
 */
function buildSubStepRoute(subStepId: string, context: JuntaNavigationContext): string {
  // Mapeo de IDs de sub-steps a JuntaRoutes
  const subStepRouteMap: Record<string, JuntaRoutes> = {
    "aporte-dinerarios": JuntaRoutes.APORTE_DINERARIO,
    "aporte-dinerario": JuntaRoutes.APORTE_DINERARIO,
    "aporte-no-dinerario": JuntaRoutes.APORTE_DINERARIO,
    "capitalizacion-creditos": JuntaRoutes.CAPITALIZACION_CREDITOS,
    "remocion-gerente": JuntaRoutes.REMOCION_GERENTE,
    "remocion-apoderados": JuntaRoutes.REMOCION_APODERADOS,
    "remocion-directores": JuntaRoutes.REMOCION_DIRECTORES,
    "nombramiento-gerente": JuntaRoutes.NOMBRAMIENTO_GERENTE,
    "nombramiento-apoderados": JuntaRoutes.NOMBRAMIENTO_APODERADOS,
    "nombramiento-directores": JuntaRoutes.NOMBRAMIENTO_DIRECTORES,
    "nombramiento-nuevo-directorio": JuntaRoutes.NOMBRAMIENTO_DIRECTORIO,
    "nombramiento-directorio": JuntaRoutes.NOMBRAMIENTO_DIRECTORIO,
    "pronunciamiento-gestion": JuntaRoutes.PRONUNCIAMIENTO_GESTION,
    "aplicacion-resultados": JuntaRoutes.APLICACION_RESULTADOS,
    "delegacion-auditores": JuntaRoutes.NOMBRAMIENTO_AUDITORES,
  };

  const route = subStepRouteMap[subStepId];
  if (route) {
    return buildJuntaRoute(route, context.societyId, context.flowId);
  }

  // Fallback: construir manualmente si no está en el mapeo
  const subStepSlugMap: Record<string, string> = {
    "aporte-dinerarios": "aporte-dinerario",
    "aporte-dinerario": "aporte-dinerario",
    "aporte-no-dinerario": "aporte-no-dinerario",
    "capitalizacion-creditos": "capitalizacion-creditos",
    "remocion-gerente": "remocion-gerente",
    "remocion-apoderados": "remocion-apoderados",
    "remocion-directores": "remocion-directores",
    "nombramiento-gerente": "nombramiento-gerente",
    "nombramiento-apoderados": "nombramiento-apoderados",
    "nombramiento-directores": "nombramiento-directores",
    "nombramiento-nuevo-directorio": "nombramiento-directorio",
    "nombramiento-directorio": "nombramiento-directorio",
    "pronunciamiento-gestion": "pronunciamiento-gestion",
    "aplicacion-resultados": "aplicacion-resultados",
    "delegacion-auditores": "nombramiento-auditores",
  };

  const slug = subStepSlugMap[subStepId] || subStepId;
  
  if (context.societyId && context.flowId) {
    return `/operaciones/sociedades/${context.societyId}/junta-accionistas/${context.flowId}/${slug}`;
  }
  if (context.societyId) {
    return `/operaciones/sociedades/${context.societyId}/junta-accionistas/${slug}`;
  }
  return `/operaciones/sociedades/:societyId/junta-accionistas/${slug}`;
}

type FlowNextHandler = (() => void) | (() => Promise<void>);

/**
 * Composable para configurar el handler del botón "Siguiente" en el flujo de Juntas
 * 
 * Similar a useFlowLayoutNext pero adaptado para usar los stores de juntas.
 * 
 * @param handleNext Función que se ejecuta antes de navegar al siguiente paso
 *                   Puede ser síncrona o asíncrona (para validaciones/guardado)
 * 
 * @example
 * ```vue
 * <script setup>
 * useJuntasFlowNext(async () => {
 *   // Validar formulario
 *   await validateForm();
 *   
 *   // Guardar datos
 *   await saveData();
 *   
 *   // El composable automáticamente navega al siguiente paso
 * });
 * </script>
 * ```
 */
export const useJuntasFlowNext = (handleNext: FlowNextHandler) => {
  const juntasFlowStore = useJuntasFlowStore();
  const juntasNavbarStore = useJuntasNavbarStore();
  const router = useRouter();
  const route = useRoute();

  // Configurar el handler inmediatamente (no esperar a onMounted)
  // Esto asegura que el handler esté disponible cuando el botón se renderice
  const handler = async () => {
    console.log("🎯 [useJuntasFlowNext] onClickNext ejecutado desde el botón");
    console.log("🎯 [useJuntasFlowNext] Ruta actual:", route.path);
    try {
      juntasFlowStore.isLoading = true;
      console.log("⏳ [useJuntasFlowNext] Loading activado");
      
      // Ejecutar el handler (validación/guardado)
      console.log("▶️ [useJuntasFlowNext] Ejecutando handleNext...");
      await handleNext();
      console.log("✅ [useJuntasFlowNext] handleNext completado exitosamente");

      // Intentar navegar entre secciones del sub-step actual primero
      const currentSubStepId = juntasFlowStore.currentSubStepId;
      console.log("🔍 [useJuntasFlowNext] Sub-step actual:", currentSubStepId);
      
      if (currentSubStepId) {
        // Obtener las secciones del sub-step
        const sections = getBaseSectionsForSubStep(currentSubStepId);
        console.log("🔍 [useJuntasFlowNext] Secciones disponibles:", sections.map(s => s.id));
        
        if (sections.length > 0) {
          // Detectar la sección actual
          const path = route.path;
          const hash = route.hash?.replace("#", "") || "";
          const currentSectionId = detectCurrentSection(path, hash, currentSubStepId);
          console.log("🔍 [useJuntasFlowNext] Sección actual detectada:", currentSectionId);
          
          // Encontrar el índice de la sección actual
          const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId);
          console.log("🔍 [useJuntasFlowNext] Índice de sección actual:", currentSectionIndex);
          
          // Si hay una sección siguiente dentro del sub-step
          if (currentSectionIndex >= 0 && currentSectionIndex < sections.length - 1) {
            const nextSection = sections[currentSectionIndex + 1];
            if (nextSection) {
              console.log("🔍 [useJuntasFlowNext] Siguiente sección encontrada:", nextSection.id);
              
              // Obtener la ruta de la siguiente sección
              const societyId = route.params.societyId as string;
              const flowId = route.params.flowId as string;
              const basePath = buildBasePath(societyId, flowId);
              const sectionRoutes = getSectionRoutesForSubStep(currentSubStepId, basePath);
              
              if (sectionRoutes && nextSection.id && sectionRoutes[nextSection.id]) {
                const nextRoute = sectionRoutes[nextSection.id];
                if (nextRoute) {
                  console.log("🚀 [useJuntasFlowNext] Navegando a siguiente sección:", nextRoute);
                  await router.push(nextRoute);
                  console.log("✅ [useJuntasFlowNext] Navegación a sección completada");
                  return; // Salir temprano, ya navegamos
                }
              }
            }
          } else {
            console.log("ℹ️ [useJuntasFlowNext] No hay más secciones en el sub-step, buscando siguiente paso principal");
          }
        }
      }

      // Si no hay más secciones en el sub-step, verificar si estamos en puntos-acuerdo o en un punto de agenda
      const path = route.path;
      const societyId = route.params.societyId as string;
      const flowId = route.params.flowId as string;
      
      // Detectar si estamos en la página "puntos-acuerdo" (sin sub-step)
      const isPuntosAcuerdoPage = path.includes("/puntos-acuerdo") && !currentSubStepId;
      
      // Detectar si estamos en un punto de agenda (sub-step)
      const isPuntoAgendaPage = !!currentSubStepId;
      
      // Obtener puntos de agenda seleccionados
      const selectedPuntos = juntasFlowStore.getDynamicSubSteps;
      console.log("🔍 [useJuntasFlowNext] Puntos de agenda seleccionados:", selectedPuntos);
      
      // Si estamos en "puntos-acuerdo", navegar al primer punto de agenda
      if (isPuntosAcuerdoPage && selectedPuntos.length > 0) {
        const firstPuntoId = selectedPuntos[0];
        console.log("🔍 [useJuntasFlowNext] Estamos en puntos-acuerdo, navegando al primer punto:", firstPuntoId);
        
        const context: JuntaNavigationContext = {
          societyId: societyId || undefined,
          flowId: flowId || undefined,
        };
        
        // Construir la ruta del primer punto de agenda
        const firstPuntoRoute = buildSubStepRoute(firstPuntoId, context);
        console.log("🚀 [useJuntasFlowNext] Navegando al primer punto de agenda:", firstPuntoRoute);
        await router.push(firstPuntoRoute);
        console.log("✅ [useJuntasFlowNext] Navegación al primer punto completada");
        return;
      }
      
      // Si estamos en un punto de agenda, navegar al siguiente punto de agenda
      if (isPuntoAgendaPage && selectedPuntos.length > 0) {
        // Buscar el índice del punto actual en la lista de puntos seleccionados
        // El currentSubStepId puede tener variaciones (ej: "aporte-dinerario" vs "aporte-dinerarios")
        const currentPuntoIndex = selectedPuntos.findIndex(id => {
          // Comparación flexible: puede ser exacto o contener el ID
          const normalizedId = id.toLowerCase().replace(/-/g, "");
          const normalizedSubStep = currentSubStepId.toLowerCase().replace(/-/g, "");
          return id === currentSubStepId || 
                 normalizedId === normalizedSubStep ||
                 currentSubStepId.includes(id) || 
                 id.includes(currentSubStepId) ||
                 normalizedId.includes(normalizedSubStep) ||
                 normalizedSubStep.includes(normalizedId);
        });
        
        console.log("🔍 [useJuntasFlowNext] Sub-step actual:", currentSubStepId);
        console.log("🔍 [useJuntasFlowNext] Puntos seleccionados:", selectedPuntos);
        console.log("🔍 [useJuntasFlowNext] Índice del punto actual:", currentPuntoIndex);
        
        // Si encontramos el punto actual y hay un siguiente
        if (currentPuntoIndex >= 0 && currentPuntoIndex < selectedPuntos.length - 1) {
          const nextPuntoId = selectedPuntos[currentPuntoIndex + 1];
          console.log("🔍 [useJuntasFlowNext] Siguiente punto de agenda encontrado:", nextPuntoId);
          
          const context: JuntaNavigationContext = {
            societyId: societyId || undefined,
            flowId: flowId || undefined,
          };
          
          const nextPuntoRoute = buildSubStepRoute(nextPuntoId, context);
          console.log("🚀 [useJuntasFlowNext] Navegando al siguiente punto de agenda:", nextPuntoRoute);
          await router.push(nextPuntoRoute);
          console.log("✅ [useJuntasFlowNext] Navegación al siguiente punto completada");
          return;
        } else if (currentPuntoIndex >= 0 && currentPuntoIndex === selectedPuntos.length - 1) {
          // Estamos en el último punto de agenda, ir a resumen
          console.log("🔍 [useJuntasFlowNext] Estamos en el último punto de agenda, navegando a resumen");
          const context: JuntaNavigationContext = {
            societyId: societyId || undefined,
            flowId: flowId || undefined,
          };
          const resumenRoute = buildJuntaRoute(JuntaRoutes.RESUMEN, context.societyId, context.flowId);
          console.log("🚀 [useJuntasFlowNext] Navegando a resumen:", resumenRoute);
          await router.push(resumenRoute);
          console.log("✅ [useJuntasFlowNext] Navegación a resumen completada");
          return;
        } else {
          // No encontramos el punto actual, intentar usar la lógica normal
          console.warn("⚠️ [useJuntasFlowNext] No se encontró el punto actual en la lista de seleccionados, usando lógica normal");
        }
      }
      
      // Si no estamos en puntos-acuerdo ni en un punto de agenda, usar la lógica normal
      console.log("🔍 [useJuntasFlowNext] Buscando siguiente paso principal para:", route.path);
      const nextStep = juntasNavbarStore.getNextStepByCurrentStep(route.path);
      console.log("🔍 [useJuntasFlowNext] Siguiente paso encontrado:", nextStep);

      if (nextStep) {
        console.log("🚀 [useJuntasFlowNext] Navegando a:", nextStep.route);
        await router.push(nextStep.route);
        console.log("✅ [useJuntasFlowNext] Navegación completada");
      } else {
        console.warn("⚠️ [useJuntasFlowNext] No se encontró siguiente paso");
        console.warn("⚠️ [useJuntasFlowNext] Pasos disponibles:", juntasNavbarStore.steps.map(s => ({ title: s.title, route: s.route })));
      }
    } catch (error) {
      console.error("❌ [useJuntasFlowNext] Error:", error);
      // El error se propaga para que el componente pueda manejarlo
      throw error;
    } finally {
      juntasFlowStore.isLoading = false;
      console.log("⏳ [useJuntasFlowNext] Loading desactivado");
    }
  };

  // Configurar el handler en el store inmediatamente
  juntasFlowStore.onClickNext = handler;
  console.log("✅ [useJuntasFlowNext] Handler configurado inmediatamente");
  console.log("✅ [useJuntasFlowNext] Ruta actual:", route.path);

  onUnmounted(() => {
    // Solo limpiar si el handler actual es el que configuramos
    // Esto evita que se limpie si otro componente ya configuró un nuevo handler
    if (juntasFlowStore.onClickNext === handler) {
      console.log("🧹 [useJuntasFlowNext] Limpiando handler al desmontar");
      juntasFlowStore.clearValues();
    } else {
      console.log("ℹ️ [useJuntasFlowNext] Handler ya fue reemplazado, no limpiar");
    }
  });
};

