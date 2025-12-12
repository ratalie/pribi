<template>
  <MetodoVotacionDirectorio
    v-model="metodoVotacion"
    v-model:candidatos-seleccionados="candidatosSeleccionados"
    title="Votación para la designación de directores"
    subtitle="Votación para aprobar la designación de los directores propuestos."
    title-color="text-primary-800"
    :preguntas="preguntas"
    :accionistas="accionistas"
    :mensaje-aprobacion="mensajeAprobacion"
    @cambiar-voto="handleCambiarVoto"
    @update:candidatos-seleccionados="handleCandidatosSeleccionados"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import MetodoVotacionDirectorio from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/components/votacion/MetodoVotacionDirectorio.vue";

  /**
   * Página: Votación (Sub-sección de Nombramiento de Directorio)
   *
   * Sección dentro del sub-step "Nombramiento de Directorio".
   * Se muestra en el sidebar derecho como sección navegable.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/nombramiento-directorio/votacion
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const metodoVotacion = ref<"unanimidad" | "mayoria">("unanimidad");
  const candidatosSeleccionados = ref<string[]>([]);

  // Inicializar método de votación en el store
  onMounted(async () => {
    const { useDirectoresStore } = await import(
      "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/composables/useDirectoresStore"
    );
    const directoresStore = useDirectoresStore();
    directoresStore.setMetodoVotacion(metodoVotacion.value);
  });

  // Guardar método de votación en el store cuando cambie
  watch(metodoVotacion, async (nuevoMetodo, metodoAnterior) => {
    const { useDirectoresStore } = await import(
      "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/composables/useDirectoresStore"
    );
    const directoresStore = useDirectoresStore();
    directoresStore.setMetodoVotacion(nuevoMetodo);

    // Si cambia de unanimidad a mayoría, resetear votos
    if (metodoAnterior === "unanimidad" && nuevoMetodo === "mayoria") {
      directoresStore.setVotosAsignados([]);
    }
  });

  // Pregunta para voto por mayoría
  const preguntas = ref<string[]>([
    "¿Se aprueba la designación de los directores propuestos?",
  ]);

  // Accionistas (hardcodeados por el momento)
  const accionistas = ref<string[]>([
    "Olenka Sanchez Aguilar",
    "Melanie Sanchez Aguilar",
    "Braulio Sanchez Aguilar",
  ]);

  // Mensaje de aprobación
  const mensajeAprobacion = "la designación de los directores propuestos.";

  // Manejar cambio de voto
  const handleCambiarVoto = (
    accionistaId: string,
    valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
  ) => {
    // TODO: Implementar lógica de guardado de votos
    console.log("Voto cambiado:", accionistaId, valor);
  };

  // Manejar candidatos seleccionados
  const handleCandidatosSeleccionados = async (candidatos: string[]) => {
    candidatosSeleccionados.value = candidatos;
    console.log("Candidatos seleccionados:", candidatos);

    // Guardar en el store
    const { useDirectoresStore } = await import(
      "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/composables/useDirectoresStore"
    );
    const directoresStore = useDirectoresStore();
    directoresStore.setCandidatosSeleccionadosUnanimidad(candidatos);

    // Si es votación por unanimidad, calcular y asignar votos iguales
    if (metodoVotacion.value === "unanimidad" && candidatos.length > 0) {
      // Calcular total de votos (suma de todas las acciones con derecho_voto de todos los accionistas)
      // Por ahora usamos los accionistas hardcodeados
      const totalVotos = accionistas.value.length * 100; // 3 accionistas * 100 votos cada uno = 300

      // Dividir votos iguales entre candidatos seleccionados
      const votosPorCandidato = Math.floor(totalVotos / candidatos.length);

      // Guardar votos en el store
      const votosAsignados = candidatos.map((candidatoNombre) => ({
        candidatoNombreCompleto: candidatoNombre,
        accionistaIndex: 0, // En unanimidad, todos los accionistas votan igual
        cantidad: votosPorCandidato,
      }));

      directoresStore.setVotosAsignados(votosAsignados);
    }
  };

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    // La verificación de empate ya se hace automáticamente cuando se completa el último voto
    // Solo necesitamos limpiar el flag si no hay empate
    const { useDirectoresStore } = await import(
      "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/composables/useDirectoresStore"
    );
    const directoresStore = useDirectoresStore();

    // Si no hay empate, limpiar el flag
    if (!directoresStore.hayEmpate) {
      directoresStore.setHayEmpate(false);
    }

    // TODO: Agregar validación y guardado de datos adicionales
  });
</script>
