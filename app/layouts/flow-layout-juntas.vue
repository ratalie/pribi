<script setup lang="ts">
  import { nextTick } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import HeaderJuntasNavbar from "~/components/flow-layout-juntas/HeaderJuntasNavbar.vue";
  import SingleWizardSidebarJuntas from "~/components/flow-layout-juntas/SingleWizardSidebarJuntas.vue";
  import WizardRightSidebar from "~/components/flow-layout-juntas/WizardRightSidebar.vue";
  import { useJuntasNavbarRoutes } from "~/composables/useJuntasNavbarRoutes";
  import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";
  import type { SectionItem } from "~/types/junta-navigation.types";

  /**
   * FlowLayoutJuntas - Layout para el flujo de Juntas de Accionistas
   *
   * Este layout será usado cuando las páginas de juntas definan:
   * definePageMeta({
   *   layout: "registros",
   *   flowLayoutJuntas: true,
   * });
   *
   * Estructura:
   * - Header: Breadcrumbs y botones de acción
   * - Sidebar Izquierdo: Pasos principales y sub-steps colapsables
   * - Contenido: Área principal con slot
   * - Sidebar Derecho: Secciones dentro de un sub-step (condicional)
   * - Footer: Botón "Siguiente"
   */

  const { steps, currentStepIndex, currentStepSlug, currentSubStepId, currentSectionId } =
    useJuntasNavbarRoutes();

  const juntasFlowStore = useJuntasFlowStore();

  // Determinar si debe mostrarse el sidebar derecho
  // Se muestra cuando hay un sub-step activo Y hay secciones configuradas
  const hasRightSidebar = computed(() => {
    const hasSubStep = !!currentSubStepId.value;
    const hasSections = sections.value && sections.value.length > 0;
    const result = hasSubStep && hasSections;
    console.log("🟪 [flow-layout-juntas] hasRightSidebar:", {
      hasSubStep,
      hasSections,
      currentSubStepId: currentSubStepId.value,
      sectionsCount: sections.value?.length || 0,
      result,
    });
    return result;
  });

  // Obtener las secciones del sub-step actual
  // TODO: Esto debería venir de una configuración o del store
  // Por ahora, creamos secciones básicas según el sub-step
  const getSectionsForSubStep = (
    subStepId?: string,
    currentSection?: string
  ): SectionItem[] => {
    if (!subStepId) return [];

    // Mapeo básico de sub-steps a secciones
    // Esto se puede expandir con una configuración más completa
    const baseSectionsMap: Record<string, Array<Omit<SectionItem, "status">>> = {
      "aporte-dinerarios": [
        {
          id: "aporte-dinerario",
          title: "Aporte Dinerario",
          description: "Vista general del acuerdo",
          navigationType: "route",
        },
        {
          id: "seleccion-aportantes",
          title: "Selección de Aportantes",
          description: "Selecciona los aportantes",
          navigationType: "route",
        },
        {
          id: "aportes-dinerarios",
          title: "Aportes Dinerarios",
          description: "Completa los montos de aporte",
          navigationType: "route",
        },
        {
          id: "test-anclas",
          title: "Test por Anclas",
          description: "Prueba de hijos con anclas",
          navigationType: "anchor",
          subSections: [
            {
              id: "ancla-1",
              title: "Ancla 1: Introducción",
              description: "Primera sección de prueba",
              navigationType: "anchor",
            },
            {
              id: "ancla-2",
              title: "Ancla 2: Desarrollo",
              description: "Segunda sección de prueba",
              navigationType: "anchor",
            },
            {
              id: "ancla-3",
              title: "Ancla 3: Conclusión",
              description: "Tercera sección de prueba",
              navigationType: "anchor",
            },
          ],
        },
        {
          id: "test-rutas",
          title: "Test por Rutas",
          description: "Prueba de hijos con rutas",
          navigationType: "route",
          subSections: [
            {
              id: "ruta-1",
              title: "Ruta 1: Primera Página",
              description: "Navega a página de prueba 1",
              navigationType: "route",
            },
            {
              id: "ruta-2",
              title: "Ruta 2: Segunda Página",
              description: "Navega a página de prueba 2",
              navigationType: "route",
            },
            {
              id: "ruta-3",
              title: "Ruta 3: Tercera Página",
              description: "Navega a página de prueba 3",
              navigationType: "route",
            },
          ],
        },
        {
          id: "votacion",
          title: "Votación",
          description: "Registra la votación",
          navigationType: "route",
        },
        {
          id: "resumen",
          title: "Resumen",
          description: "Revisa el resumen",
          navigationType: "route",
        },
      ],
      "aplicacion-resultados": [
        {
          id: "aplicacion-resultados",
          title: "Aplicación de Resultados",
          description: "Vista general",
          navigationType: "route",
        },
        {
          id: "utilidades-montos",
          title: "Utilidades y Montos a Distribuir",
          description: "Cálculos y valores",
          navigationType: "anchor",
          subSections: [
            {
              id: "valores-preliminares",
              title: "Valores Preliminares",
              navigationType: "anchor",
            },
            {
              id: "calculo-utilidad-antes-reserva",
              title: "Cálculo de la Utilidad antes de la Reserva Legal",
              navigationType: "anchor",
            },
            {
              id: "calculo-reserva-legal",
              title: "Cálculo de la Reserva Legal",
              navigationType: "anchor",
            },
            {
              id: "valores-utilidad-distribuible",
              title: "Valores de la Utilidad Distribuible",
              navigationType: "anchor",
            },
          ],
        },
        {
          id: "votacion",
          title: "Votación",
          description: "Registra la votación",
          navigationType: "route",
        },
        {
          id: "resumen",
          title: "Resumen",
          description: "Revisa el resumen",
          navigationType: "route",
        },
      ],
      // Agregar más mapeos según sea necesario
    };

    const baseSections = baseSectionsMap[subStepId] || [];

    // Asignar estados basados en la sección actual
    if (!currentSection) {
      return baseSections.map((section, index) => ({
        ...section,
        status: index === 0 ? "current" : "upcoming",
      }));
    }

    const currentIndex = baseSections.findIndex((s) => s.id === currentSection);
    return baseSections.map((section, index) => {
      if (index < currentIndex) {
        return { ...section, status: "completed" as const };
      } else if (index === currentIndex) {
        return { ...section, status: "current" as const };
      } else {
        return { ...section, status: "upcoming" as const };
      }
    });
  };

  const sections = computed(() => {
    const result = getSectionsForSubStep(currentSubStepId.value, detectedCurrentSection.value);
    console.log("🟦 [flow-layout-juntas] sections computed:", {
      currentSubStepId: currentSubStepId.value,
      detectedCurrentSection: detectedCurrentSection.value,
      sectionsCount: result.length,
      sections: result.map((s) => ({ id: s.id, title: s.title })),
    });
    return result;
  });

  // Función para obtener la ruta o ancla de una sección basada en el sub-step actual
  const getSectionNavigation = (
    sectionId: string,
    subStepId?: string
  ): { type: "route" | "anchor"; target: string } | null => {
    const juntaId = route.params.id;
    const basePath = juntaId
      ? `/operaciones/junta-accionistas/${juntaId}`
      : `/operaciones/junta-accionistas`;

    // Mapeo de secciones a rutas para "aporte-dinerarios"
    if (subStepId === "aporte-dinerarios") {
      const sectionRouteMap: Record<string, string> = {
        "aporte-dinerario": `${basePath}/aporte-dinerario`,
        "seleccion-aportantes": `${basePath}/aporte-dinerario/aportantes`,
        "aportes-dinerarios": `${basePath}/aporte-dinerario/aportes`,
        "test-anclas": `${basePath}/aporte-dinerario/test-anclas`, // Página con anclas
        "test-rutas": `${basePath}/aporte-dinerario/test-rutas`, // Página principal de rutas
        "ruta-1": `${basePath}/aporte-dinerario/test-rutas/ruta-1`,
        "ruta-2": `${basePath}/aporte-dinerario/test-rutas/ruta-2`,
        "ruta-3": `${basePath}/aporte-dinerario/test-rutas/ruta-3`,
        votacion: `${basePath}/aporte-dinerario/votacion`,
        resumen: `${basePath}/aporte-dinerario/resumen`,
      };
      const route = sectionRouteMap[sectionId];
      if (route) {
        return { type: "route", target: route };
      }
      // Si es una ancla (ancla-1, ancla-2, ancla-3), retornar como anchor
      if (sectionId.startsWith("ancla-")) {
        return { type: "anchor", target: sectionId };
      }
    }

    // Mapeo para "aplicacion-resultados" (con anclas)
    if (subStepId === "aplicacion-resultados") {
      const sectionRouteMap: Record<string, string> = {
        "aplicacion-resultados": `${basePath}/aplicacion-resultados`,
        "utilidades-montos": `${basePath}/aplicacion-resultados`, // Misma página, ancla
        votacion: `${basePath}/aplicacion-resultados/votacion`,
        resumen: `${basePath}/aplicacion-resultados/resumen`,
      };
      const route = sectionRouteMap[sectionId];
      if (route) {
        // Si es "utilidades-montos", es un ancla
        if (sectionId === "utilidades-montos") {
          return { type: "anchor", target: sectionId };
        }
        return { type: "route", target: route };
      }
    }

    return null;
  };

  // Encontrar la sección padre de una ancla
  const findParentSectionForAnchor = (
    anchorId: string,
    subStepId?: string
  ): { parentId: string; parentRoute: string } | null => {
    if (!subStepId) return null;

    const juntaId = route.params.id;
    const basePath = juntaId
      ? `/operaciones/junta-accionistas/${juntaId}`
      : `/operaciones/junta-accionistas`;

    // Buscar en las secciones configuradas
    const sections = getSectionsForSubStep(subStepId, "");
    for (const section of sections) {
      if (section.subSections) {
        const hasAnchor = section.subSections.some((sub) => sub.id === anchorId);
        if (hasAnchor) {
          // Encontrar la ruta de la sección padre
          const parentRouteMap: Record<string, string> = {
            "test-anclas": `${basePath}/aporte-dinerario/test-anclas`,
            "utilidades-montos": `${basePath}/aplicacion-resultados`,
          };
          const parentRoute = parentRouteMap[section.id] || `${basePath}/${subStepId}`;
          return { parentId: section.id, parentRoute };
        }
      }
    }
    return null;
  };

  // Manejar click en sección (navegar a la ruta o ancla correspondiente)
  const handleSectionClick = (sectionId: string) => {
    console.log("🟦 [flow-layout-juntas] handleSectionClick:", sectionId);
    juntasFlowStore.setCurrentSection(sectionId);

    const navigation = getSectionNavigation(sectionId, currentSubStepId.value);
    const currentPath = route.path;

    if (navigation) {
      if (navigation.type === "route") {
        console.log("🟦 [flow-layout-juntas] Navegando a ruta:", navigation.target);
        router.push(navigation.target);
      } else {
        // Es un ancla
        console.log("🟦 [flow-layout-juntas] Navegando a ancla:", navigation.target);
        
        // Buscar la sección padre de esta ancla
        const parentInfo = findParentSectionForAnchor(sectionId, currentSubStepId.value);
        
        if (parentInfo) {
          // Verificar si estamos en la página correcta
          const isOnParentPage = currentPath.includes(parentInfo.parentRoute.split('/').pop() || '');
          
          if (!isOnParentPage) {
            // Estamos en otra ruta, navegar primero a la página padre con el hash
            console.log("🟦 [flow-layout-juntas] Navegando primero a página padre:", parentInfo.parentRoute);
            router.push(`${parentInfo.parentRoute}#${navigation.target}`).then(() => {
              // Después de navegar, hacer scroll cuando la página se cargue
              nextTick(() => {
                const element = document.getElementById(navigation.target);
                if (element) {
                  setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 100);
                }
              });
            });
          } else {
            // Ya estamos en la página correcta, solo hacer scroll
            const element = document.getElementById(navigation.target);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
              router.replace({ hash: `#${navigation.target}` });
            }
          }
        } else {
          // No se encontró padre, intentar scroll directo
          const element = document.getElementById(navigation.target);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            router.replace({ hash: `#${navigation.target}` });
          }
        }
      }
    } else {
      // Si no hay mapeo, intentar scroll a un elemento con ese ID (ancla por defecto)
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        router.replace({ hash: `#${sectionId}` });
      }
    }
  };

  // Detectar la sección actual basándose en la ruta y hash
  const detectedCurrentSection = computed(() => {
    const path = route.path;
    const hash = route.hash?.replace("#", "") || "";
    const subStepId = currentSubStepId.value;

    // Si hay hash, es probablemente un ancla
    if (hash) {
      return hash;
    }

    if (subStepId === "aporte-dinerarios") {
      if (path.includes("/aporte-dinerario/aportantes")) return "seleccion-aportantes";
      if (path.includes("/aporte-dinerario/aportes")) return "aportes-dinerarios";
      if (path.includes("/aporte-dinerario/test-rutas/ruta-1")) return "ruta-1";
      if (path.includes("/aporte-dinerario/test-rutas/ruta-2")) return "ruta-2";
      if (path.includes("/aporte-dinerario/test-rutas/ruta-3")) return "ruta-3";
      if (path.includes("/aporte-dinerario/test-rutas")) return "test-rutas";
      if (path.includes("/aporte-dinerario/test-anclas")) {
        // Si hay hash, retornar el hash (ancla)
        if (hash) return hash;
        return "test-anclas";
      }
      if (path.includes("/aporte-dinerario/votacion")) return "votacion";
      if (path.includes("/aporte-dinerario/resumen")) return "resumen";
      if (path.includes("/aporte-dinerario") && !path.includes("/aporte-dinerario/"))
        return "aporte-dinerario";
    }

    if (subStepId === "aplicacion-resultados") {
      if (path.includes("/aplicacion-resultados/votacion")) return "votacion";
      if (path.includes("/aplicacion-resultados/resumen")) return "resumen";
      if (path.includes("/aplicacion-resultados") && !path.includes("/aplicacion-resultados/"))
        return "aplicacion-resultados";
      // Si estamos en la página principal, verificar hash para anclas
      if (hash) return hash;
    }

    return currentSectionId.value || "";
  });

  // Manejar click en paso
  const handleStepClick = (_stepId: string) => {
    // La navegación se maneja automáticamente por el NuxtLink en el sidebar
  };

  // Manejar click en sub-step
  const handleSubStepClick = (_subStepId: string) => {
    // La navegación se maneja automáticamente por el router en el sidebar
  };

  const router = useRouter();
  const route = useRoute();

  // Manejar botón "Salir"
  const handleBack = () => {
    router.push("/operaciones/junta-accionistas");
  };

  // Manejar botón "Guardar"
  const handleSave = () => {
    // TODO: Implementar lógica de guardado
    console.log("Guardar cambios");
  };

  // Manejar botón "Restablecer"
  const handleReset = () => {
    // TODO: Implementar lógica de restablecimiento
    console.log("Restablecer formulario");
  };

  // Manejar botón "Anterior"
  const handlePrev = () => {
    // Si estamos en una sección dentro de un sub-step, navegar a la sección anterior
    if (currentSubStepId.value && detectedCurrentSection.value) {
      const currentSections = sections.value;
      const currentIdx = currentSections.findIndex(
        (s) => s.id === detectedCurrentSection.value
      );

      if (currentIdx > 0) {
        const prevSection = currentSections[currentIdx - 1];
        if (prevSection) {
          handleSectionClick(prevSection.id);
          return;
        }
      }
    }

    // Si estamos en un paso principal, navegar al paso anterior
    const currentIdx = currentStepIndex.value;
    if (currentIdx > 0) {
      const prevStep = steps.value[currentIdx - 1];
      if (prevStep) {
        router.push(prevStep.route);
      }
    }
  };
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar Izquierdo (inicia desde arriba, no limitado por header) -->
    <SingleWizardSidebarJuntas
      :steps="steps"
      :current-step-id="currentStepSlug"
      :current-sub-step-id="currentSubStepId"
      :on-step-click="handleStepClick"
      :on-sub-step-click="handleSubStepClick"
      title="Junta de Accionistas"
      :progress="{
        current: currentStepIndex + 1,
        total: steps.length,
      }"
    />

    <!-- Contenido Principal -->
    <div class="flex flex-col min-h-0 flex-1">
      <!-- Header -->
      <HeaderJuntasNavbar
        :steps="steps"
        :current-step-index="currentStepIndex"
        :on-back="handleBack"
        :on-save="handleSave"
        :on-reset="handleReset"
      />

      <!-- Área de Contenido + Sidebar Derecho -->
      <div class="flex-1 overflow-hidden">
        <div v-if="hasRightSidebar" class="flex h-full">
          <!-- Contenido Principal (con sidebar derecho) -->
          <div class="flex-1 overflow-y-auto px-8 py-6">
            <slot />
          </div>

          <!-- Sidebar Derecho (solo cuando hay sub-step activo) -->
          <WizardRightSidebar
            v-if="sections && sections.length > 0"
            :sections="sections"
            :current-section-id="detectedCurrentSection || sections[0]?.id || ''"
            :on-section-click="handleSectionClick"
            :title="
              steps.find((s: any) => s.subSteps?.some((ss: any) => ss.id === currentSubStepId))?.title ||
              'Secciones'
            "
          />
        </div>

        <!-- Contenido Principal (sin sidebar derecho) -->
        <div v-else class="overflow-y-auto px-8 py-6">
          <slot />
        </div>
      </div>

      <!-- Footer -->
      <div
        class="bg-white border-t px-8 py-4 shrink-0"
        style="border-color: var(--border-light, #e5e7eb)"
      >
        <div class="flex flex-col gap-3 max-w-5xl mx-auto">
          <!-- Información contextual -->
          <div class="flex items-center justify-between">
            <div class="flex flex-col gap-1">
              <!-- Paso actual -->
              <div class="flex items-center gap-2">
                <span
                  class="text-xs font-secondary uppercase tracking-wide"
                  style="color: var(--text-muted, #6b7280)"
                >
                  {{ currentSubStepId ? "Punto de Acuerdo" : "Paso" }}
                </span>
                <span
                  class="text-sm font-primary font-semibold"
                  style="color: var(--text-primary, #111827)"
                >
                  {{
                    currentSubStepId
                      ? steps
                          ?.find((s: any) =>
                            s.subSteps?.some((ss: any) => ss.id === currentSubStepId)
                          )
                          ?.subSteps?.find((ss: any) => ss.id === currentSubStepId)?.title ||
                        "Punto de Acuerdo"
                      : (currentStepIndex >= 0 && steps?.[currentStepIndex]?.title) ||
                        "Paso Actual"
                  }}
                </span>
              </div>
              <!-- Sección actual (solo si hay sub-step) -->
              <div
                v-if="
                  currentSubStepId && detectedCurrentSection && sections && sections.length > 0
                "
                class="flex items-center gap-2"
              >
                <span
                  class="text-xs font-secondary uppercase tracking-wide"
                  style="color: var(--text-muted, #6b7280)"
                >
                  Sección:
                </span>
                <span
                  class="text-xs font-primary font-medium"
                  style="color: var(--text-muted, #6b7280)"
                >
                  {{
                    sections.find((s) => s.id === detectedCurrentSection)?.title ||
                    detectedCurrentSection
                  }}
                </span>
              </div>
            </div>
            <!-- Contador de pasos -->
            <div class="text-xs font-secondary" style="color: var(--text-muted, #6b7280)">
              {{
                currentStepIndex >= 0 && steps?.length
                  ? `Paso ${currentStepIndex + 1} de ${steps.length}`
                  : "Paso 0 de 0"
              }}
            </div>
          </div>

          <!-- Botones de navegación -->
          <div class="flex items-center justify-between">
            <!-- Botón Anterior -->
            <ActionButton
              :label="
                currentSubStepId
                  ? 'Anterior Sección'
                  : currentStepIndex === 0
                  ? 'Anterior'
                  : 'Anterior Paso'
              "
              size="md"
              variant="outline"
              :is-disabled="currentStepIndex === 0 && !currentSubStepId"
              icon="ArrowLeft"
              icon-position="left"
              @click="handlePrev"
            />

            <!-- Botón Siguiente -->
            <ActionButton
              :label="
                currentStepIndex >= 0 && steps?.length && currentStepIndex === steps.length - 1
                  ? 'Finalizar'
                  : currentSubStepId
                  ? 'Siguiente Sección'
                  : currentStepIndex >= 0 &&
                    steps?.[currentStepIndex + 1]?.title === 'Puntos de Acuerdo'
                  ? 'Siguiente: Puntos de Acuerdo'
                  : 'Siguiente Paso'
              "
              size="md"
              :is-loading="juntasFlowStore.isLoading"
              :icon="
                currentStepIndex >= 0 && steps?.length && currentStepIndex === steps.length - 1
                  ? 'Check'
                  : 'ArrowRight'
              "
              icon-position="right"
              @click="juntasFlowStore.onClickNext"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .flow-layout-juntas {
    display: flex;
    min-height: 100vh;
    background-color: var(--color-background, #f9fafb);
  }
</style>
