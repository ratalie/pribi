<template>
  <SlotWrapper>
    <TitleH2
      title="Resumen de la Junta"
      subtitle="Consolidado general de los acuerdos, votaciones y documentación generada durante el flujo."
    />

    <div class="flex flex-col gap-12">
      <!-- Sección: Detalles de la Junta -->
      <!-- Importa el componente de resumen existente -->
      <section id="detalles" class="flex flex-col gap-5 scroll-mt-4">
        <SummarySectionRenderer
          section-id="detalles"
          title-override="Detalles de la Junta"
          description="Consolidado de las decisiones registradas sobre tipo, modalidad y convocatoria de la junta."
        />
      </section>

      <!-- Sección: Instalación -->
      <!-- Importa el componente de resumen existente -->
      <section id="instalacion" class="flex flex-col gap-5 scroll-mt-4">
        <SummarySectionRenderer
          section-id="instalacion"
          title-override="Instalación de la Junta"
          description="Acta de instalación, verificación de quórum y designación de la mesa directiva reunidos en un solo lugar."
        />
      </section>

      <!-- Sección: Puntos de Acuerdo -->
      <section id="puntos-acuerdo" class="flex flex-col gap-6 scroll-mt-4">
        <TitleH4
          title="Puntos de Acuerdo"
          subtitle="Síntesis de cada punto tratado y su estado actual dentro de la junta."
          :variant="Titles.WITH_SUBTITLE_SPACING"
        />
        <div class="flex flex-col gap-8">
          <div
            v-for="agreement in acuerdosResumen"
            :key="agreement.id"
            :id="agreement.id"
            class="flex flex-col gap-5 scroll-mt-4"
          >
            <!-- Buscar si existe un componente de resumen específico para este acuerdo -->
            <component
              :is="acuerdoResumenComponents[agreement.id]"
              v-if="acuerdoResumenComponents[agreement.id]"
              :context="'resumen-general'"
            />
            <!-- Si no hay componente específico, usar SummarySectionRenderer genérico -->
            <SummarySectionRenderer
              v-else
              :section-id="agreement.id"
              :title-override="agreement.title"
              :description="agreement.subtitle"
            />
          </div>
        </div>
      </section>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import SummarySectionRenderer from "~/components/juntas/SummarySectionRenderer.vue";
  import ResumenAporteDinerario from "~/components/juntas/ResumenAporteDinerario.vue";
  import { usePuntosAcuerdoSummary } from "~/modules/junta-accionistas/summaries/puntos-acuerdo";
  import { useJuntasFlowStore } from "~/stores/useJuntasFlowStore";
  import { mapStoreIdToSectionId } from "~/composables/useJuntasResumenSections";
  import Titles from "~/types/enums/Titles.enum";

  /**
   * Mapeo de acuerdos a sus componentes de resumen
   * Cada acuerdo puede tener su propio componente de resumen reutilizable
   */
  const acuerdoResumenComponents: Record<string, any> = {
    "aporte-dinerarios": ResumenAporteDinerario,
    "aporte-dinerario": ResumenAporteDinerario,
    // Agregar más acuerdos aquí cuando tengan sus componentes de resumen
    // "nombramiento-gerente": ResumenNombramientoGerente,
    // "remocion-apoderados": ResumenRemocionApoderados,
    // etc.
  };

  const puntosAcuerdoSummary = usePuntosAcuerdoSummary();
  const juntasFlowStore = useJuntasFlowStore();

  /**
   * Filtrar acuerdos SOLO por los seleccionados en Paso 1
   * Este computed es reactivo y se actualiza cuando cambia el store
   */
  const acuerdosResumen = computed(() => {
    // Acceder directamente al state para asegurar reactividad
    const selectedSubSteps = juntasFlowStore.selectedSubSteps;
    const selectedSectionIds = selectedSubSteps.map(mapStoreIdToSectionId);
    
    console.log("🔵 [resumen/index] selectedSubSteps desde state:", selectedSubSteps);
    console.log("🔵 [resumen/index] selectedSectionIds mapeados:", selectedSectionIds);
    console.log("🔵 [resumen/index] puntosAcuerdoSummary disponibles:", puntosAcuerdoSummary.value.map(s => ({ id: s.id, title: s.title })));
    
    // Filtrar SOLO los acuerdos seleccionados
    const filtered = puntosAcuerdoSummary.value
      .filter((section) => {
        const isIncluded = selectedSectionIds.includes(section.id);
        if (!isIncluded) {
          console.log("🔵 [resumen/index] Sección excluida:", section.id, "no está en", selectedSectionIds);
        }
        return isIncluded;
      })
      .map((section) => ({
        id: section.id,
        title: section.title,
        subtitle:
          section.blocks?.[0]?.description ||
          "Resumen del acuerdo y acciones necesarias para su implementación.",
      }));
    
    console.log("🔵 [resumen/index] acuerdosResumen filtrados:", filtered.map(a => a.id));
    return filtered;
  });

  /**
   * Página: Resumen de la Junta
   * 
   * Paso 5 del flujo de Juntas de Accionistas.
   * Vista de solo lectura que consolida toda la información de la junta.
   * 
   * Ruta: /operaciones/junta-accionistas/[id]/resumen
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });
</script>

<style scoped>
  .page-container {
    background: #f8f7fb;
    min-height: 100%;
  }

  .kicker {
    font-family: var(--font-secondary);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #7a7690;
  }

  .page-title {
    font-family: var(--font-primary);
    font-size: 32px;
    font-weight: 600;
    line-height: 1.15;
    color: #2e293d;
  }

  .route-chip {
    font-family: var(--font-secondary);
    font-size: 12px;
    font-weight: 600;
    color: #3c28a4;
    background: rgba(60, 40, 164, 0.12);
    padding: 6px 12px;
    border-radius: 999px;
  }

  .intro {
    font-family: var(--font-secondary);
    font-size: 14px;
    line-height: 1.6;
    color: #4b475a;
    max-width: 720px;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
  }

  .summary-card {
    background: #ffffff;
    border: 1px solid #eceaf5;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(46, 41, 61, 0.08);
    display: flex;
    flex-direction: column;
    padding: 20px;
    gap: 16px;
  }

  .summary-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .summary-card__title {
    font-family: var(--font-primary);
    font-size: 18px;
    font-weight: 600;
    color: #2e293d;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .summary-card__title:hover {
    color: #3c28a4;
    text-decoration: underline;
  }

  .summary-card__status {
    font-family: var(--font-secondary);
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(209, 213, 219, 0.4);
    color: #4b5563;
    transition: background-color 0.2s ease, color 0.2s ease;
  }

  .summary-card__status.is-completed {
    background: rgba(60, 40, 164, 0.12);
    color: #3c28a4;
  }

  .summary-card__status.is-current,
  .summary-card__status.is-in-progress {
    background: rgba(240, 156, 0, 0.12);
    color: #f09c00;
  }

  .summary-card__status.is-optional {
    background: rgba(103, 100, 114, 0.12);
    color: #676472;
  }

  .summary-card__status.is-error {
    background: rgba(220, 38, 38, 0.12);
    color: #dc2626;
  }

  .summary-card__status.is-locked {
    background: rgba(107, 114, 128, 0.12);
    color: #6b7280;
  }

  .summary-card__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .summary-block {
    background: rgba(246, 245, 252, 0.65);
    border: 1px solid rgba(226, 224, 236, 0.6);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .summary-block__title {
    font-family: var(--font-primary);
    font-size: 16px;
    font-weight: 600;
    color: #2e293d;
  }

  .summary-block__description {
    font-family: var(--font-secondary);
    font-size: 13px;
    line-height: 1.5;
    color: #676472;
  }

  .summary-highlights {
    display: flex;
    flex-direction: column;
    gap: 10px;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .summary-highlight {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  .summary-highlight__label {
    font-family: var(--font-secondary);
    font-size: 13px;
    font-weight: 600;
    color: #3c3750;
  }

  .summary-highlight__description {
    font-family: var(--font-secondary);
    font-size: 12px;
    color: #7a7690;
    margin-top: 2px;
  }

  .summary-highlight__value {
    font-family: var(--font-primary);
    font-size: 14px;
    font-weight: 600;
    color: #3c28a4;
  }

  .summary-notes {
    font-family: var(--font-secondary);
    font-size: 12px;
    color: #7a7690;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 4px;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 1024px) {
    .page-container {
      padding: 24px;
    }
  }

  @media (max-width: 640px) {
    .summary-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
