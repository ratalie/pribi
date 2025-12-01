<template>
  <SlotWrapper>
    <TitleH2
      title="Detalles de la Junta"
      subtitle="Configura los datos esenciales de la junta antes de iniciar el flujo."
    />

    <div class="flex flex-col gap-10">
      <TipoJuntaSection />
      <ConvocatoriaJuntaSection />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import ConvocatoriaJuntaSection from "~/components/juntas/detalles/ConvocatoriaJuntaSection.vue";
  import TipoJuntaSection from "~/components/juntas/detalles/TipoJuntaSection.vue";
  import TitleH2 from "~/components/titles/TitleH2.vue";
  import { useToast } from "~/components/ui/toast/use-toast";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";

  /**
   * Página: Detalles de la Junta
   *
   * Paso 2 del flujo de Juntas de Accionistas.
   * Configura los datos esenciales de la junta (tipo, modalidad, convocatoria).
   *
   * Ruta: /operaciones/junta-accionistas/[societyId]/[flowId]/detalles
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();
  const store = useMeetingDetailsStore();
  const { toast } = useToast();

  // Obtener IDs de la ruta
  const societyId = computed(() => {
    const id = route.params.societyId;
    return typeof id === "string" ? parseInt(id, 10) : null;
  });

  const flowId = computed(() => {
    const id = route.params.flowId;
    return typeof id === "string" ? parseInt(id, 10) : null;
  });

  // Cargar datos al montar
  onMounted(async () => {
    if (societyId.value && flowId.value) {
      try {
        await store.loadMeetingDetails(societyId.value, flowId.value);
      } catch (error) {
        console.error("[Page][Detalles] Error al cargar:", error);
        // No mostrar error si es 404 (no hay datos guardados aún)
        const statusCode =
          (error as any)?.statusCode ?? (error as any)?.response?.status ?? null;
        if (statusCode !== 404) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudieron cargar los detalles de la junta",
          });
        }
      }
    }
  });

  // Configurar el botón "Siguiente"
  // ⚠️ IMPORTANTE: El handler NO debe retornar valores
  // Si lanza un error, el composable NO navegará al siguiente paso
  // El loading se maneja automáticamente en el composable
  useJuntasFlowNext(async () => {
    console.log("🚀 [Detalles] Handler de 'Siguiente' ejecutado");
    console.log("🚀 [Detalles] societyId:", societyId.value);
    console.log("🚀 [Detalles] flowId:", flowId.value);
    console.log("🚀 [Detalles] meetingDetails:", store.meetingDetails);

    // Validar que tengamos los IDs necesarios
    if (!societyId.value || !flowId.value) {
      const error = new Error("Faltan los IDs de la sociedad o flujo");
      console.error("❌ [Detalles] Error de validación:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }

    // Validar que tengamos datos para guardar
    if (!store.meetingDetails) {
      const error = new Error("Debes completar los detalles de la junta");
      console.error("❌ [Detalles] Error de validación:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }

    // TODO: Agregar validaciones de plazos aquí
    // - Primera convocatoria: mínimo 3 días
    // - Segunda convocatoria: 3-10 días entre convocatorias

    console.log("💾 [Detalles] Iniciando guardado en backend...");
    // Guardar en el backend
    // Si hay error, se lanza automáticamente y el composable no navegará
    try {
      await store.updateMeetingDetails(store.meetingDetails);
      console.log("✅ [Detalles] Guardado exitoso");

      // Si llegamos aquí, el guardado fue exitoso
      toast({
        variant: "success",
        title: "Éxito",
        description: "Detalles de la junta guardados correctamente",
      });
    } catch (error: any) {
      console.error("❌ [Detalles] Error al guardar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Error al guardar los detalles de la junta",
      });
      throw error;
    }

    console.log("✅ [Detalles] Handler completado, el composable navegará al siguiente paso");
    // El composable automáticamente navegará al siguiente paso después de esto
  });
</script>
