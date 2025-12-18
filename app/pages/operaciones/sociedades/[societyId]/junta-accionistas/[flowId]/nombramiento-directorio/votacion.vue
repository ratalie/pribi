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
  import { computed, onActivated, onMounted, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
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

  const route = useRoute();
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();

  const societyId = computed(() => Number(route.params.societyId));
  const flowId = computed(() => Number(route.params.flowId));

  const metodoVotacion = ref<"unanimidad" | "mayoria">("unanimidad");
  const candidatosSeleccionados = ref<string[]>([]);
  const isLoading = ref(false);

  /**
   * Helper: Obtener nombre completo de un accionista
   */
  function getNombreCompletoShareholder(shareholder: any): string {
    const person = shareholder.person;
    if (person.tipo === "NATURAL") {
      return `${person.nombre} ${person.apellidoPaterno} ${
        person.apellidoMaterno || ""
      }`.trim();
    }
    // Para personas jurídicas y otros tipos
    if ("razonSocial" in person) {
      return person.razonSocial || "";
    }
    return ""; // Fallback
  }

  /**
   * Mapper: Calcular accionistas desde snapshot + asistencias
   * Convierte al formato que espera MayoriaVotacionDirectorio
   */
  function mapearAccionistasDesdeSnapshot() {
    const snapshot = snapshotStore.snapshot;
    const asistencias = asistenciaStore.asistencias;

    if (!snapshot) {
      console.warn(
        "[DEBUG][NombramientoDirectorioVotacion] No hay snapshot disponible para mapear accionistas"
      );
      return [];
    }

    const { shareAllocations, shareClasses, shareholders } = snapshot;

    // 1. Calcular acciones por accionista desde snapshot
    const accionistasConAcciones = shareholders
      .map((accionista) => {
        const asignaciones = shareAllocations.filter(
          (asig) => asig.accionistaId === accionista.id
        );

        // Agrupar acciones por tipo/clase
        const accionesPorClase = asignaciones
          .map((asig) => {
            const shareClass = shareClasses.find((sc) => sc.id === asig.accionId);
            if (!shareClass) return null;

            return {
              derecho_voto: shareClass.conDerechoVoto || false,
              tipo: shareClass.nombre || shareClass.id,
              cantidad: asig.cantidadSuscrita,
            };
          })
          .filter((acc): acc is NonNullable<typeof acc> => acc !== null);

        // Verificar si asistió
        const asistencia = asistencias.find((a) => a.accionista.id === accionista.id);
        if (!asistencia || !asistencia.asistio) {
          return null;
        }

        // Solo incluir si tiene acciones con derecho a voto
        const tieneAccionesConDerechoVoto = accionesPorClase.some(
          (acc) => acc.derecho_voto === true
        );
        if (!tieneAccionesConDerechoVoto) {
          return null;
        }

        return {
          nombre: getNombreCompletoShareholder(accionista),
          acciones: accionesPorClase,
          presidente: false, // TODO: Determinar si es presidente desde algún campo
        };
      })
      .filter((acc): acc is NonNullable<typeof acc> => acc !== null);

    return accionistasConAcciones;
  }

  /**
   * Cargar datos necesarios
   */
  async function loadData() {
    try {
      isLoading.value = true;

      // 1. Cargar snapshot
      if (!snapshotStore.snapshot) {
        await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      }

      // 2. Cargar asistencias
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);

      console.log("[DEBUG][NombramientoDirectorioVotacion] Datos cargados:", {
        hasSnapshot: !!snapshotStore.snapshot,
        asistenciasCount: asistenciaStore.asistencias.length,
        accionistasCount: accionistas.value.length,
      });
    } catch (error: any) {
      console.error("[NombramientoDirectorioVotacion] Error al cargar datos:", error);
    } finally {
      isLoading.value = false;
    }
  }

  // Accionistas calculados desde snapshot
  const accionistas = computed(() => {
    const mapeados = mapearAccionistasDesdeSnapshot();
    console.log("[DEBUG][NombramientoDirectorioVotacion] Accionistas mapeados:", mapeados);
    return mapeados;
  });

  // Inicializar método de votación en el store
  onMounted(async () => {
    await loadData();

    const { useDirectoresStore } = await import(
      "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/composables/useDirectoresStore"
    );
    const directoresStore = useDirectoresStore();
    directoresStore.setMetodoVotacion(metodoVotacion.value);
  });

  // Recargar datos al activar
  onActivated(() => {
    loadData();
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
      const totalVotos = accionistas.value.reduce((sum, accionista) => {
        const votosAccionista = accionista.acciones
          .filter((acc) => acc.derecho_voto === true)
          .reduce((accSum, acc) => accSum + acc.cantidad, 0);
        return sum + votosAccionista;
      }, 0);

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
