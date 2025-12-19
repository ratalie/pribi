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

        console.log("[VotacionDirectorio] Preparando candidato para store:", {
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

      console.log("[VotacionDirectorio] onMounted completado:", {
        candidatosCount: candidatosParaStore.length,
        votosAsignadosCount: directoresStore.votosAsignados.length,
        metodoVotacion: metodoVotacion.value,
      });
    } catch (error) {
      console.error("[VotacionDirectorio] Error al cargar datos:", error);
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
        "[VotacionDirectorio] Cambio manual de unanimidad a mayoría, reseteando votos (no hay votos previos)"
      );
      directoresStore.setVotosAsignados([]);
    } else if (isLoadingInitial.value) {
      console.log(
        "[VotacionDirectorio] Cambio durante carga inicial, NO reseteando votos (ya cargados del backend)"
      );
    } else if (tieneVotosCargados) {
      console.log(
        "[VotacionDirectorio] Cambio de método detectado pero hay votos cargados, NO reseteando (vienen del backend)"
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

    return votantesFromController.map((votante) => {
      // Calcular total de acciones con derecho a voto para este accionista
      const totalAcciones = votante.acciones
        .filter((acc) => acc.derecho_voto === true)
        .reduce((sum, acc) => sum + acc.cantidad, 0);

      return {
        nombre: votante.nombre,
        acciones: votante.acciones.map((acc) => ({
          derecho_voto: acc.derecho_voto,
          tipo: acc.tipo,
          cantidad: acc.cantidad,
        })),
        presidente: votante.presidente || false,
        totalAcciones,
      };
    });
  });

  // Mensaje de aprobación
  const mensajeAprobacion = "la designación de los directores propuestos.";

  // ✅ Manejar cambio de voto (por unanimidad - SIMPLE)
  const handleCambiarVoto = async (
    accionistaId: string,
    valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
  ) => {
    console.log("[VotacionDirectorio] handleCambiarVoto:", accionistaId, valor);
    // La lógica de guardado se maneja en el componente MetodoVotacionDirectorio
    // cuando se detecta unanimidad y se completa la votación
  };

  // ✅ Manejar candidatos seleccionados (por unanimidad)
  const handleCandidatosSeleccionados = async (candidatos: string[]) => {
    candidatosSeleccionados.value = candidatos;
    console.log("[VotacionDirectorio] Candidatos seleccionados:", candidatos);

    // Guardar en el store
    directoresStore.setCandidatosSeleccionadosUnanimidad(candidatos);

    // Si es votación por unanimidad, calcular y asignar votos iguales
    if (metodoVotacion.value === "unanimidad" && candidatos.length > 0) {
      // Calcular total de votos (suma de todas las acciones con derecho_voto de todos los accionistas)
      const totalVotos = accionistas.value.reduce((sum, accionista) => {
        const votosAccionista = accionista.acciones
          .filter((acc) => acc.derecho_voto === true)
          .reduce((accSum, acc) => accSum + acc.cantidad, 0);
        return sum + votosAccionista;
      }, 0);

      // Dividir votos iguales entre candidatos seleccionados
      const votosPorCandidato = Math.floor(totalVotos / candidatos.length);

      // Guardar votos en el store (para guardar después cuando se complete la votación)
      const votosAsignados = candidatos.map((candidatoNombre) => ({
        candidatoNombreCompleto: candidatoNombre,
        candidatoPersonaId: undefined, // En unanimidad no tenemos personaId aquí
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

        console.log("[VotacionDirectorio] Guardando votación por mayoría (acumulativa)");
        await controller.guardarVotacion(votosAsignados);
        console.log("[VotacionDirectorio] ✅ Votación por mayoría guardada exitosamente");
      }

      // ✅ Si es unanimidad, guardar votación por unanimidad
      if (metodoVotacion.value === "unanimidad") {
        const candidatosSeleccionados = directoresStore.candidatosSeleccionadosUnanimidad;
        if (candidatosSeleccionados.length === 0) {
          throw new Error("Debe seleccionar al menos un candidato");
        }

        console.log("[VotacionDirectorio] Guardando votación por unanimidad");
        await controller.guardarVotacionUnanimidad(candidatosSeleccionados);
        console.log("[VotacionDirectorio] ✅ Votación por unanimidad guardada exitosamente");
      }

      console.log("[VotacionDirectorio] ✅ Votación guardada exitosamente");
    } catch (error: any) {
      console.error("[VotacionDirectorio] ❌ Error al guardar:", error);
      throw error; // Re-lanzar para que useJuntasFlowNext muestre el error
    }
  });
</script>
