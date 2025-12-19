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
  import { computed, nextTick, onMounted, ref, watch } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { useVotacionDirectoresController } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/votacion/composables/useVotacionDirectoresController";
  import MetodoVotacionDirectorio from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/components/votacion/MetodoVotacionDirectorio.vue";
  import { useDirectoresStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/composables/useDirectoresStore";

  /**
   * Página: Votación (Sub-sección de Nombramiento de Directores)
   *
   * Sección dentro del sub-step "Nombramiento de Directores".
   * Se muestra en el sidebar derecho como sección navegable.
   *
   * Ruta: /operaciones/junta-accionistas/[id]/nombramiento-directores/votacion
   */

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // ✅ Controller para manejar la lógica de votación
  const controller = useVotacionDirectoresController();
  const directoresStore = useDirectoresStore();

  const metodoVotacion = ref<"unanimidad" | "mayoria">("unanimidad");
  const candidatosSeleccionados = ref<string[]>([]);
  const isLoadingInitial = ref(true); // ✅ Flag para evitar resetear votos durante carga inicial

  // Cargar datos al montar
  onMounted(async () => {
    try {
      // ✅ 1. Cargar datos del controller (incluye votación desde backend)
      await controller.loadData();

      // ✅ 2. Esperar un tick para asegurar que todas las computed se actualicen
      await nextTick();

      // ✅ 3. Sincronizar candidatos y cantidad con useDirectoresStore
      // (necesario para que MayoriaVotacionDirectorio funcione correctamente)
      const candidatosFromController = controller.candidatos.value;
      const candidatosParaStore = candidatosFromController.map((c) => {
        const nombreCompleto = `${c.person.nombre} ${c.person.apellidoPaterno} ${
          c.person.apellidoMaterno || ""
        }`.trim();

        console.log("[VotacionDirectores] Preparando candidato para store:", {
          nombreCompleto,
          nombre: c.person.nombre,
          apellidoPaterno: c.person.apellidoPaterno,
          apellidoMaterno: c.person.apellidoMaterno,
        });

        return {
          nombreCompleto, // ✅ Construir exactamente igual que en el controller
          personaId: c.person.id || undefined, // ✅ Incluir personaId para hacer match con votos
          tipoDirector: "titular" as const,
          tipoDocumento: c.person.tipoDocumento,
          numeroDocumento: c.person.numeroDocumento,
          nombre: c.person.nombre,
          apellidoPaterno: c.person.apellidoPaterno,
          apellidoMaterno: c.person.apellidoMaterno,
          candidato: true,
        };
      });

      directoresStore.setDirectoresData(candidatosParaStore);
      directoresStore.setCantidadDirectores(controller.cantidadDirectores.value);
      directoresStore.setCuposDisponibles(controller.cuposDisponibles.value); // ✅ Usar cupos calculados correctamente

      // ✅ 4. Sincronizar método de votación desde el store (ya fue detectado en loadData)
      // El método ya fue establecido en loadData basándose en tipoAprobacion del backend
      // ⚠️ IMPORTANTE: Cambiar metodoVotacion DURANTE la carga inicial (isLoadingInitial = true)
      // para que el watch NO resetee los votos que acabamos de cargar del backend
      metodoVotacion.value = directoresStore.metodoVotacion;

      // ✅ Marcar que terminó la carga inicial DESPUÉS de cambiar metodoVotacion
      // y esperar un tick para que el watch termine de procesar
      await nextTick();
      isLoadingInitial.value = false;

      // ✅ 5. Esperar otro tick para que el componente MayoriaVotacionDirectorio detecte los cambios
      await nextTick();

      console.log("[VotacionDirectores] onMounted completado:", {
        candidatosCount: candidatosParaStore.length,
        votosAsignadosCount: directoresStore.votosAsignados.length,
        metodoVotacion: metodoVotacion.value,
      });
    } catch (error) {
      console.error("[VotacionDirectores] Error al cargar datos:", error);
      isLoadingInitial.value = false; // Asegurar que se desactive aunque haya error
    }
  });

  // Guardar método de votación en el store cuando cambie
  watch(metodoVotacion, async (nuevoMetodo, metodoAnterior) => {
    directoresStore.setMetodoVotacion(nuevoMetodo);

    // ⚠️ IMPORTANTE: Solo resetear votos si:
    // 1. El cambio es MANUAL (no durante carga inicial)
    // 2. Cambia de unanimidad a mayoría
    // 3. NO hay votos ya cargados (si hay votos, significa que vienen del backend y no debemos borrarlos)
    const tieneVotosCargados = directoresStore.votosAsignados.length > 0;

    if (
      !isLoadingInitial.value &&
      metodoAnterior === "unanimidad" &&
      nuevoMetodo === "mayoria" &&
      !tieneVotosCargados // ✅ Solo resetear si NO hay votos cargados
    ) {
      console.log(
        "[VotacionDirectores] Cambio manual de unanimidad a mayoría, reseteando votos (no hay votos previos)"
      );
      directoresStore.setVotosAsignados([]);
    } else if (isLoadingInitial.value) {
      console.log(
        "[VotacionDirectores] Cambio durante carga inicial, NO reseteando votos (ya cargados del backend)"
      );
    } else if (tieneVotosCargados) {
      console.log(
        "[VotacionDirectores] Cambio de método detectado pero hay votos cargados, NO reseteando (vienen del backend)"
      );
    }
  });

  // Pregunta para voto por mayoría
  const preguntas = ref<string[]>([
    "¿Se aprueba la designación de los directores propuestos?",
  ]);

  // ✅ Convertir votantes del controller al formato Accionista que espera el componente
  const accionistas = computed(() => {
    const votantesFromController = controller.votantes.value;

    return votantesFromController.map((votante) => ({
      nombre: votante.nombreCompleto,
      acciones: [
        {
          derecho_voto: true,
          tipo: "comun", // TODO: Determinar tipo desde snapshot si es necesario
          cantidad: votante.accionesConDerechoVoto,
        },
      ],
      presidente: false, // TODO: Determinar si es presidente desde snapshot si es necesario
    }));
  });

  // Mensaje de aprobación
  const mensajeAprobacion = "la designación de los directores propuestos.";

  // Manejar cambio de voto (no usado en mayoría, pero necesario para el componente)
  const handleCambiarVoto = (
    accionistaId: string,
    valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
  ) => {
    // No se usa en votación acumulativa
    console.log("Voto cambiado:", accionistaId, valor);
  };

  // Manejar candidatos seleccionados (para unanimidad)
  const handleCandidatosSeleccionados = async (candidatos: string[]) => {
    candidatosSeleccionados.value = candidatos;

    // Guardar en el store
    directoresStore.setCandidatosSeleccionadosUnanimidad(candidatos);

    // Si es votación por unanimidad, calcular y asignar votos iguales
    if (metodoVotacion.value === "unanimidad" && candidatos.length > 0) {
      // Calcular total de votos (suma de todas las acciones con derecho_voto de todos los accionistas)
      const totalVotos = accionistas.value.reduce(
        (sum, acc) =>
          sum + acc.acciones.filter((a) => a.derecho_voto).reduce((s, a) => s + a.cantidad, 0),
        0
      );

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

  // ✅ Configurar el botón "Siguiente" para guardar votación
  useJuntasFlowNext(async () => {
    try {
      // Si hay empate, el usuario debe resolverlo primero
      if (directoresStore.hayEmpate) {
        throw new Error("Debe resolver el empate antes de continuar");
      }

      // Si es votación por mayoría, guardar votos acumulativos
      if (metodoVotacion.value === "mayoria") {
        const votosAsignados = directoresStore.votosAsignados;
        if (votosAsignados.length === 0) {
          throw new Error("Debe asignar votos a los candidatos");
        }

        await controller.guardarVotacion(votosAsignados);
      }

      // ✅ Si es unanimidad, guardar votación por unanimidad
      if (metodoVotacion.value === "unanimidad") {
        const candidatosSeleccionados = directoresStore.candidatosSeleccionadosUnanimidad;
        if (candidatosSeleccionados.length === 0) {
          throw new Error("Debe seleccionar al menos un candidato");
        }

        await controller.guardarVotacionUnanimidad(candidatosSeleccionados);
      }

      console.log("✅ Votación guardada exitosamente");
    } catch (error: any) {
      console.error("[VotacionDirectores] Error al guardar:", error);
      throw error; // Re-lanzar para que useJuntasFlowNext muestre el error
    }
  });
</script>
