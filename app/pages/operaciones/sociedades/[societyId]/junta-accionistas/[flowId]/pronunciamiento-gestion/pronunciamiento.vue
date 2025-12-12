<template>
  <SlotWrapper>
    <TitleH2
      title="Carga de resultados y gestión social"
      subtitle="Sube la Memoria y los documentos que respaldan los resultados."
      title-color="text-primary-800"
    />
    <CargaResultadosGestionManager />
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import { useToast } from "~/components/ui/toast/use-toast";
  import CargaResultadosGestionManager from "~/core/presentation/operaciones/junta-accionistas/pasos/pronunciamiento-gestion/CargaResultadosGestionManager.vue";
  import { usePronunciamientoStore } from "~/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/stores/usePronunciamientoStore";
  import { usePronunciamientoController } from "~/core/presentation/juntas/puntos-acuerdo/pronunciamiento-gestion/composables/usePronunciamientoController";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";

  const route = useRoute();
  const { toast } = useToast();
  const store = usePronunciamientoStore();
  const { guardarDatos } = usePronunciamientoController();

  const societyId = computed(() => {
    const param = route.params.societyId;
    if (typeof param === "string") return parseInt(param, 10);
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return parseInt(param[0], 10);
    }
    return null;
  });

  const flowId = computed(() => {
    const param = route.params.flowId;
    if (typeof param === "string") return parseInt(param, 10);
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return parseInt(param[0], 10);
    }
    return null;
  });

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    console.log("🎯 [Pronunciamiento] Handler de 'Siguiente' ejecutado");

    // Validar que tengamos los IDs necesarios
    if (!societyId.value || !flowId.value) {
      const error = new Error("Faltan los IDs de la sociedad o flujo");
      console.error("❌ [Pronunciamiento] Error de validación:", error.message);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      throw error;
    }

    // Validar que se pueda avanzar
    if (!store.validateNextPath) {
      const error = new Error(
        "Debes completar todos los campos requeridos. Si habilitaste Memoria Anual o algún Estado Financiero, debes subir al menos un archivo."
      );
      console.error("❌ [Pronunciamiento] Error de validación:", error.message);
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: error.message,
      });
      throw error;
    }

    console.log("💾 [Pronunciamiento] Iniciando guardado en backend...");
    try {
      await guardarDatos();
      console.log("✅ [Pronunciamiento] Guardado exitoso");

      toast({
        variant: "success",
        title: "Éxito",
        description: "Documentos guardados correctamente",
      });
    } catch (error: any) {
      console.error("❌ [Pronunciamiento] Error al guardar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Error al guardar los documentos",
      });
      throw error;
    }

    console.log("✅ [Pronunciamiento] Handler completado, el composable navegará al siguiente paso");
  });

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });
</script>
