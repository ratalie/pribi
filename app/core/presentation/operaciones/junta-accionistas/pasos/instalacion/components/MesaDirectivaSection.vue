<script setup lang="ts">
  import { computed, onMounted, ref, watch } from "vue";
  import { z } from "zod";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
  import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";

  interface Props {
    societyId: number;
    flowId: string;
  }

  defineProps<Props>();

  // ========================================
  // STORES (ORIGINALES)
  // ========================================
  const meetingDetailsStore = useMeetingDetailsStore();
  const asistenciaStore = useAsistenciaStore();
  const snapshotStore = useSnapshotStore();

  // ========================================
  // COMPUTED - SNAPSHOT DATA
  // ========================================

  /**
   * Directorio del snapshot (si existe)
   * ✅ FUENTE: snapshot.directory
   */
  const directorio = computed(() => snapshotStore.snapshot?.directory || null);

  /**
   * ¿Tiene directorio configurado?
   */
  const tieneDirectorio = computed(() => directorio.value !== null);

  /**
   * Gerente General del snapshot
   * ✅ FUENTE: snapshot.gerenteGeneral (viene directo del backend)
   */
  const gerenteGeneral = computed(() => {
    const gg = snapshotStore.snapshot?.gerenteGeneral;

    if (gg) {
      let nombre = "N/A";
      if (gg.persona && gg.persona.tipo === "NATURAL") {
        nombre = `${gg.persona.nombre} ${gg.persona.apellidoPaterno} ${
          gg.persona.apellidoMaterno || ""
        }`.trim();
      } else if (gg.persona && gg.persona.tipo === "JURIDICA") {
        nombre = (gg.persona as any).razonSocial || "N/A";
      }

      console.log("✅ [gerenteGeneral] Obtenido del snapshot:", {
        id: gg.id,
        nombre,
      });
      return gg;
    }

    console.log("ℹ️ [gerenteGeneral] No hay gerente general en el snapshot");
    return null;
  });

  /**
   * Directores del snapshot
   * ✅ FUENTE: snapshot.directors[]
   */
  const directores = computed(() => snapshotStore.snapshot?.directors || []);

  /**
   * Opciones de asistentes presentes (para selector)
   * ✅ IMPORTANTE: value debe ser el ID de la PERSONA (person.id), no el ID del registro de asistencia
   */
  const asistentesOptions = computed(() => {
    console.log(
      "🔍 [asistentesOptions] Total asistencias:",
      asistenciaStore.asistencias.length
    );

    const presentes = asistenciaStore.asistenciasEnriquecidas.filter((a) => a.asistio);
    console.log("🔍 [asistentesOptions] Presentes (asistio=true):", presentes.length);

    const options = presentes.map((a) => {
      const personId = a.accionista.person.id;
      console.log("🔍 [asistentesOptions] Mapeando:", {
        registroId: a.id,
        personId: personId,
        nombre: a.nombreCompleto,
      });
      
      return {
        id: personId,  // ✅ ID de la persona (lo que espera el backend)
        value: personId,  // ✅ ID de la persona (lo que espera el backend)
        label: a.nombreCompleto,
      };
    });

    console.log("✅ [asistentesOptions] Opciones generadas:", options);
    return options;
  });

  // ========================================
  // COMPUTED - PRESIDENTE
  // ========================================

  /**
   * PRESIDENTE: ¿Modo readonly o selector?
   *
   * ✅ LÓGICA FINAL:
   * - SI directory !== null Y presidentePreside === true Y presidenteId existe → READONLY
   * - SINO → SELECTOR
   */
  const presidenteMode = computed<"readonly" | "selector">(() => {
    const hasDirectorio = directorio.value !== null;
    const presideJunta = directorio.value?.presidentePreside === true;
    const tienePresidenteId = !!directorio.value?.presidenteId;

    if (hasDirectorio && presideJunta && tienePresidenteId) {
      console.log("🔵 [presidenteMode] READONLY", {
        presidentePreside: true,
        presidenteId: directorio.value!.presidenteId,
      });
      return "readonly";
    }

    console.log("🔵 [presidenteMode] SELECTOR", {
      hasDirectorio,
      presideJunta,
      tienePresidenteId,
    });
    return "selector";
  });

  /**
   * PRESIDENTE: Nombre
   *
   * ✅ LÓGICA FINAL:
   * - Si READONLY → Buscar en directors[] usando directory.presidenteId
   * - Si SELECTOR → Buscar en asistentes usando presidenteId seleccionado
   */
  const presidenteNombre = computed(() => {
    // Si es readonly → buscar director con ID = directory.presidenteId
    if (presidenteMode.value === "readonly" && directorio.value?.presidenteId) {
      const presidenteId = directorio.value.presidenteId;
      const director = directores.value.find((d) => d.id === presidenteId);

      if (director && director.persona) {
        const nombre = `${director.persona.nombre} ${director.persona.apellidoPaterno} ${
          director.persona.apellidoMaterno || ""
        }`.trim();
        console.log("✅ [presidenteNombre] READONLY - Director:", nombre);
        return nombre;
      }

      console.warn("⚠️ [presidenteNombre] READONLY pero director no encontrado");
      return "Presidente del Directorio";
    }

    // Si es selector y hay ID seleccionado → buscar en asistentes
    if (presidenteMode.value === "selector" && presidenteId.value) {
      const asistente = asistenciaStore.asistenciasEnriquecidas.find(
        (a) => a.id === presidenteId.value
      );
      if (asistente) {
        console.log("✅ [presidenteNombre] SELECTOR - Asistente:", asistente.nombreCompleto);
        return asistente.nombreCompleto;
      }
      console.warn("⚠️ [presidenteNombre] SELECTOR pero asistente no encontrado");
    }

    return "";
  });

  /**
   * PRESIDENTE: ID seleccionado
   * ✅ IMPORTANTE: Debe devolver el ID de la PERSONA, no el ID del director/registro
   */
  const presidenteId = computed({
    get: () => {
      // Si es readonly, buscar el director y devolver su persona.id
      if (presidenteMode.value === "readonly" && directorio.value) {
        const directorId = directorio.value.presidenteId || "";
        const director = directores.value.find((d) => d.id === directorId);
        
        if (director && director.persona) {
          const personId = director.persona.id;
          console.log("🔍 [presidenteId.get] READONLY mode:", {
            directorId,
            personId: personId,
          });
          return personId;  // ✅ Devolver ID de la persona
        }
        
        console.warn("⚠️ [presidenteId.get] READONLY pero director no encontrado");
        return "";
      }
      
      // Si es selector, devolver del meeting-details
      const id = meetingDetailsStore.meetingDetails?.presidenteId || "";
      console.log("🔍 [presidenteId.get] SELECTOR mode, usando meeting-details:", id);
      return id;
    },
    set: (value: string) => {
      console.log(
        "🔍 [presidenteId.set] Intentando actualizar:",
        value,
        "mode:",
        presidenteMode.value
      );
      // Solo actualizar si es selector
      if (presidenteMode.value === "selector") {
        console.log("✅ [presidenteId.set] Guardando en meeting-details (personId):", value);
        meetingDetailsStore.patchMeetingDetails({ presidenteId: value });
      } else {
        console.log("⚠️ [presidenteId.set] READONLY mode, no se actualiza");
      }
    },
  });

  /**
   * PRESIDENTE: ¿Asistió?
   * ✅ Solo se usa cuando es READONLY para cambiar si asistió o no
   * ✅ Default FALSE para respetar valor del backend
   */
  const presidenteAsistio = ref(meetingDetailsStore.meetingDetails?.presidenteAsistio ?? false);

  // Sincronizar con el store cuando cambie
  watch(
    () => meetingDetailsStore.meetingDetails?.presidenteAsistio,
    (newValue) => {
      console.log("🔵 [presidenteAsistio] Watch activado:", {
        newValue,
        isUndefined: newValue === undefined,
        valorAnterior: presidenteAsistio.value,
      });
      
      if (newValue !== undefined) {
        presidenteAsistio.value = newValue;
        console.log("✅ [presidenteAsistio] Actualizado a:", newValue);
      } else {
        console.log("⚠️ [presidenteAsistio] No se actualiza (undefined)");
      }
    },
    { immediate: true }
  );

  /**
   * PRESIDENTE: ID del reemplazo (cuando NO asistió)
   * ✅ Se inicializa con el valor del store si:
   *    - presidenteAsistio === false
   *    - Y hay un presidenteId que NO es el del directorio
   */
  const presidenteReemplazoId = ref("");
  
  // ✅ INICIALIZAR reemplazo desde el backend
  console.log("🔍 [presidenteReemplazoId] Verificando inicialización:", {
    presidenteAsistio: meetingDetailsStore.meetingDetails?.presidenteAsistio,
    presidenteId: meetingDetailsStore.meetingDetails?.presidenteId,
    presidenteDirectorioId: directorio.value?.presidenteId,
    sonDiferentes: meetingDetailsStore.meetingDetails?.presidenteId !== directorio.value?.presidenteId,
  });
  
  if (
    meetingDetailsStore.meetingDetails?.presidenteAsistio === false &&
    meetingDetailsStore.meetingDetails?.presidenteId &&
    meetingDetailsStore.meetingDetails.presidenteId !== directorio.value?.presidenteId
  ) {
    presidenteReemplazoId.value = meetingDetailsStore.meetingDetails.presidenteId;
    console.log("✅ [presidenteReemplazoId] Inicializado desde backend:", presidenteReemplazoId.value);
  }

  // Función para manejar el cambio del switch
  const handlePresidenteAsistioChange = (newValue: boolean) => {
    console.log("🔵 [presidenteAsistio] Switch cambiado a:", newValue);
    presidenteAsistio.value = newValue;

    // Si cambió a NO asistió, limpiar el reemplazo
    if (!newValue) {
      presidenteReemplazoId.value = "";
    }

    // Guardar inmediatamente en el store
    meetingDetailsStore.patchMeetingDetails({
      presidenteAsistio: newValue,
      presidenteId: newValue ? presidenteId.value : presidenteReemplazoId.value,
    });

    console.log("✅ [presidenteAsistio] Guardado en store:", newValue);
  };

  // Watch para guardar el reemplazo cuando se selecciona
  watch(presidenteReemplazoId, (newValue) => {
    if (!presidenteAsistio.value && newValue) {
      console.log("🔵 [presidenteReemplazoId] Seleccionado reemplazo:", newValue);
      meetingDetailsStore.patchMeetingDetails({
        presidenteId: newValue,
        presidenteAsistio: false,
      });
    }
  });
  
  // ✅ Watch para sincronizar reemplazo cuando el store cambie (después de cargar backend)
  watch(
    () => [
      meetingDetailsStore.meetingDetails?.presidenteId,
      meetingDetailsStore.meetingDetails?.presidenteAsistio,
      directorio.value?.presidenteId,
    ],
    ([presidenteIdStore, presidenteAsistioStore, presidenteDirectorioId]) => {
      // Si NO asistió Y el ID es diferente al del directorio, es un reemplazo
      if (
        presidenteAsistioStore === false &&
        typeof presidenteIdStore === 'string' &&
        presidenteIdStore !== presidenteDirectorioId
      ) {
        presidenteReemplazoId.value = presidenteIdStore;
        console.log("🔄 [presidenteReemplazoId] Sincronizado desde store:", presidenteIdStore);
      } else if (presidenteAsistioStore === true) {
        // Si asistió, limpiar reemplazo
        presidenteReemplazoId.value = "";
      }
    },
    { immediate: true }
  );

  // ========================================
  // COMPUTED - SECRETARIO
  // ========================================

  /**
   * SECRETARIO: ¿Modo readonly o selector?
   *
   * ✅ LÓGICA FINAL:
   * - SI directory !== null Y secretarioAsignado === true Y gerenteGeneral existe → READONLY
   * - SINO → SELECTOR
   */
  const secretarioMode = computed<"readonly" | "selector">(() => {
    const hasDirectorio = directorio.value !== null;
    const secretarioAsignado = directorio.value?.secretarioAsignado === true;
    const tieneGerenteGeneral = gerenteGeneral.value !== null;

    if (hasDirectorio && secretarioAsignado && tieneGerenteGeneral) {
      console.log("🔵 [secretarioMode] READONLY", {
        secretarioAsignado: true,
        gerenteGeneralId: gerenteGeneral.value!.id,
      });
      return "readonly";
    }

    console.log("🔵 [secretarioMode] SELECTOR", {
      hasDirectorio,
      secretarioAsignado,
      tieneGerenteGeneral,
    });
    return "selector";
  });

  /**
   * SECRETARIO: Nombre
   *
   * ✅ LÓGICA FINAL:
   * - Si READONLY → Usar gerenteGeneral.persona
   * - Si SELECTOR → Buscar en asistentes usando secretarioId seleccionado
   */
  const secretarioNombre = computed(() => {
    // Si es readonly → mostrar nombre del gerente general
    if (secretarioMode.value === "readonly" && gerenteGeneral.value) {
      const gg = gerenteGeneral.value;

      if (gg.persona) {
        let nombre = "";
        if (gg.persona.tipo === "NATURAL") {
          nombre = `${gg.persona.nombre} ${gg.persona.apellidoPaterno} ${
            gg.persona.apellidoMaterno || ""
          }`.trim();
        } else if (gg.persona.tipo === "JURIDICA") {
          nombre = (gg.persona as any).razonSocial || "N/A";
        }
        console.log("✅ [secretarioNombre] READONLY - Gerente:", nombre);
        return nombre || "Gerente General";
      }

      console.warn("⚠️ [secretarioNombre] READONLY pero no tiene persona");
      return "Gerente General";
    }

    // Si es selector y hay ID seleccionado → buscar en asistentes
    if (secretarioMode.value === "selector" && secretarioId.value) {
      const asistente = asistenciaStore.asistenciasEnriquecidas.find(
        (a) => a.id === secretarioId.value
      );
      if (asistente) {
        console.log("✅ [secretarioNombre] SELECTOR - Asistente:", asistente.nombreCompleto);
        return asistente.nombreCompleto;
      }
      console.warn("⚠️ [secretarioNombre] SELECTOR pero asistente no encontrado");
    }

    return "";
  });

  /**
   * SECRETARIO: ID seleccionado
   * ✅ IMPORTANTE: Debe devolver el ID de la PERSONA, no el ID del apoderado
   */
  const secretarioId = computed({
    get: () => {
      // Si es readonly, devolver gerenteGeneral.persona.id
      if (secretarioMode.value === "readonly" && gerenteGeneral.value) {
        if (gerenteGeneral.value.persona) {
          const personId = gerenteGeneral.value.persona.id;
          console.log("🔍 [secretarioId.get] READONLY mode:", {
            apoderadoId: gerenteGeneral.value.id,
            personId: personId,
          });
          return personId;  // ✅ Devolver ID de la persona
        }
        
        console.warn("⚠️ [secretarioId.get] READONLY pero gerente no tiene persona");
        return "";
      }
      
      // Si es selector, devolver del meeting-details
      const id = meetingDetailsStore.meetingDetails?.secretarioId || "";
      console.log("🔍 [secretarioId.get] SELECTOR mode, usando meeting-details:", id);
      return id;
    },
    set: (value: string) => {
      console.log(
        "🔍 [secretarioId.set] Intentando actualizar:",
        value,
        "mode:",
        secretarioMode.value
      );
      // Solo actualizar si es selector
      if (secretarioMode.value === "selector") {
        console.log("✅ [secretarioId.set] Guardando en meeting-details (personId):", value);
        meetingDetailsStore.patchMeetingDetails({ secretarioId: value });
      } else {
        console.log("⚠️ [secretarioId.set] READONLY mode, no se actualiza");
      }
    },
  });

  /**
   * SECRETARIO: ¿Asistió?
   * ✅ REF sincronizado con el store
   * ✅ Default FALSE para respetar valor del backend
   */
  const secretarioAsistio = ref(meetingDetailsStore.meetingDetails?.secretarioAsistio ?? false);

  // Sincronizar con el store cuando cambie
  watch(
    () => meetingDetailsStore.meetingDetails?.secretarioAsistio,
    (newValue) => {
      console.log("🟢 [secretarioAsistio] Watch activado:", {
        newValue,
        isUndefined: newValue === undefined,
        valorAnterior: secretarioAsistio.value,
      });
      
      if (newValue !== undefined) {
        secretarioAsistio.value = newValue;
        console.log("✅ [secretarioAsistio] Actualizado a:", newValue);
      } else {
        console.log("⚠️ [secretarioAsistio] No se actualiza (undefined)");
      }
    },
    { immediate: true }
  );

  /**
   * SECRETARIO: ID del reemplazo (cuando NO asistió)
   * ✅ Se inicializa con el valor del store si:
   *    - secretarioAsistio === false
   *    - Y hay un secretarioId que NO es el del gerente general
   */
  const secretarioReemplazoId = ref("");
  
  // ✅ INICIALIZAR reemplazo desde el backend
  console.log("🔍 [secretarioReemplazoId] Verificando inicialización:", {
    secretarioAsistio: meetingDetailsStore.meetingDetails?.secretarioAsistio,
    secretarioId: meetingDetailsStore.meetingDetails?.secretarioId,
    secretarioGerenteId: gerenteGeneral.value?.persona?.id,
    sonDiferentes: meetingDetailsStore.meetingDetails?.secretarioId !== gerenteGeneral.value?.persona?.id,
  });
  
  if (
    meetingDetailsStore.meetingDetails?.secretarioAsistio === false &&
    meetingDetailsStore.meetingDetails?.secretarioId &&
    meetingDetailsStore.meetingDetails.secretarioId !== gerenteGeneral.value?.persona?.id
  ) {
    secretarioReemplazoId.value = meetingDetailsStore.meetingDetails.secretarioId;
    console.log("✅ [secretarioReemplazoId] Inicializado desde backend:", secretarioReemplazoId.value);
  }

  // Función para manejar el cambio del switch
  const handleSecretarioAsistioChange = (newValue: boolean) => {
    console.log("🟢 [secretarioAsistio] Switch cambiado a:", newValue);
    secretarioAsistio.value = newValue;

    // Si cambió a NO asistió, limpiar el reemplazo
    if (!newValue) {
      secretarioReemplazoId.value = "";
    }

    // Guardar inmediatamente en el store
    meetingDetailsStore.patchMeetingDetails({
      secretarioAsistio: newValue,
      secretarioId: newValue ? secretarioId.value : secretarioReemplazoId.value,
    });

    console.log("✅ [secretarioAsistio] Guardado en store:", newValue);
  };

  // Watch para guardar el reemplazo cuando se selecciona
  watch(secretarioReemplazoId, (newValue) => {
    if (!secretarioAsistio.value && newValue) {
      console.log("🟢 [secretarioReemplazoId] Seleccionado reemplazo:", newValue);
      meetingDetailsStore.patchMeetingDetails({
        secretarioId: newValue,
        secretarioAsistio: false,
      });
    }
  });
  
  // ✅ Watch para sincronizar reemplazo cuando el store cambie (después de cargar backend)
  watch(
    () => [
      meetingDetailsStore.meetingDetails?.secretarioId,
      meetingDetailsStore.meetingDetails?.secretarioAsistio,
      gerenteGeneral.value?.persona?.id,
    ],
    ([secretarioIdStore, secretarioAsistioStore, secretarioGerenteId]) => {
      // Si NO asistió Y el ID es diferente al del gerente general, es un reemplazo
      if (
        secretarioAsistioStore === false &&
        typeof secretarioIdStore === 'string' &&
        secretarioIdStore !== secretarioGerenteId
      ) {
        secretarioReemplazoId.value = secretarioIdStore;
        console.log("🔄 [secretarioReemplazoId] Sincronizado desde store:", secretarioIdStore);
      } else if (secretarioAsistioStore === true) {
        // Si asistió, limpiar reemplazo
        secretarioReemplazoId.value = "";
      }
    },
    { immediate: true }
  );

  // ========================================
  // LIFECYCLE
  // ========================================
  onMounted(() => {
    console.log("╔═══════════════════════════════════════════════════════════════╗");
    console.log("║  🏛️ [MesaDirectiva] MONTADO - INICIANDO DEBUG              ║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");

    console.log("🟦 [onMounted] presidenteAsistio.value:", presidenteAsistio.value);
    console.log("🟦 [onMounted] secretarioAsistio.value:", secretarioAsistio.value);

    console.log("📦 [MesaDirectiva] Snapshot completo:", snapshotStore.snapshot);
    console.log("📦 [MesaDirectiva] Snapshot Store (computed):", {
      tieneDirectorio: tieneDirectorio.value,
      directorio: directorio.value,
      presidenteDirectorio: snapshotStore.presidenteDirectorio,
      directores: snapshotStore.directores,
      attorneys: snapshotStore.snapshot?.attorneys,
      gerenteGeneral: gerenteGeneral.value,
    });

    console.log("🎯 [MesaDirectiva] PRESIDENTE:", {
      mode: presidenteMode.value,
      presidenteId: presidenteId.value,
      presidenteNombre: presidenteNombre.value,
      presidenteAsistio: presidenteAsistio.value,
      "directorio.presidentePreside": directorio.value?.presidentePreside,
      "directorio.presidenteId": directorio.value?.presidenteId,
    });

    console.log("🎯 [MesaDirectiva] SECRETARIO:", {
      mode: secretarioMode.value,
      secretarioId: secretarioId.value,
      secretarioNombre: secretarioNombre.value,
      secretarioAsistio: secretarioAsistio.value,
      "directorio.secretarioAsignado": directorio.value?.secretarioAsignado,
      "gerenteGeneral.id": gerenteGeneral.value?.id,
    });

    console.log("👥 [MesaDirectiva] Asistentes presentes:", {
      total: asistentesOptions.value.length,
      options: asistentesOptions.value,
    });

    // ========================================
    // AUTO-ACTUALIZAR IDs EN MEETING-DETAILS
    // ========================================

    // ========================================
    // AUTO-ACTUALIZAR IDs EN MEETING-DETAILS (Solo si es READONLY)
    // ========================================

    // PRESIDENTE: Auto-actualizar si es readonly
    if (presidenteMode.value === "readonly" && directorio.value?.presidenteId) {
      const presidenteIdFromDirectorio = directorio.value.presidenteId;
      console.log(
        "✅ [MesaDirectiva] Auto-actualizando presidenteId (READONLY):",
        presidenteIdFromDirectorio
      );
      console.log("   → Director:", presidenteNombre.value);

      meetingDetailsStore.patchMeetingDetails({
        presidenteId: presidenteIdFromDirectorio,
        presidenteAsistio: true, // Por defecto se asume que asiste
      });
    } else {
      console.log("ℹ️ [MesaDirectiva] Presidente en modo SELECTOR - No auto-actualiza");
    }

    // SECRETARIO: Auto-actualizar si es readonly
    if (secretarioMode.value === "readonly" && gerenteGeneral.value?.id) {
      const secretarioIdFromGerente = gerenteGeneral.value.id;
      console.log(
        "✅ [MesaDirectiva] Auto-actualizando secretarioId (READONLY):",
        secretarioIdFromGerente
      );
      console.log("   → Gerente:", secretarioNombre.value);

      meetingDetailsStore.patchMeetingDetails({
        secretarioId: secretarioIdFromGerente,
        secretarioAsistio: true, // Por defecto se asume que asiste
      });
    } else {
      console.log("ℹ️ [MesaDirectiva] Secretario en modo SELECTOR - No auto-actualiza");
    }

    console.log("📊 [MesaDirectiva] Estado final:", {
      presidenteMode: presidenteMode.value,
      presidenteId: presidenteId.value,
      presidenteNombre: presidenteNombre.value,
      secretarioMode: secretarioMode.value,
      secretarioId: secretarioId.value,
      secretarioNombre: secretarioNombre.value,
    });
  });

  // DEBUG: Mostrar info cuando cambia el directorio o gerente
  watch([directorio, gerenteGeneral, asistentesOptions], () => {
    console.log("\n╔═══════════════════════════════════════════════════════════════╗");
    console.log("║  🐛 DEBUG Mesa Directiva                                     ║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");

    console.log("\n📊 Snapshot Data:");
    console.log("  • Tiene directorio:", tieneDirectorio.value);
    console.log("  • presidentePreside:", directorio.value?.presidentePreside);
    console.log("  • presidenteId (directorio):", directorio.value?.presidenteId);
    console.log("  • secretarioAsignado:", directorio.value?.secretarioAsignado);
    console.log("  • gerenteGeneral.id:", gerenteGeneral.value?.id);

    console.log("\n🎭 Modos:");
    console.log("  • Presidente Mode:", presidenteMode.value);
    console.log("  • Secretario Mode:", secretarioMode.value);

    console.log("\n👤 Designaciones:");
    console.log("  • Presidente:", presidenteNombre.value || "NO ASIGNADO");
    console.log("  • Secretario:", secretarioNombre.value || "NO ASIGNADO");

    console.log("\n👥 Asistentes disponibles:", asistentesOptions.value.length);
    console.log(
      "  • Lista:",
      asistentesOptions.value.map((a) => a.label)
    );

    console.log("\n╚═══════════════════════════════════════════════════════════════╝\n");
  });
</script>

<template>
  <div
    v-if="!meetingDetailsStore.meetingDetails"
    class="flex justify-center items-center py-12"
  >
    <span class="text-slate-500">Cargando mesa directiva...</span>
  </div>

  <SimpleCard v-else class="flex flex-col gap-8">
    <CardTitle
      title="Presidente y Secretario de la Junta"
      body="Elija al Presidente y al Secretario de la junta."
    />

    <!-- GRID DE 2 COLUMNAS -->
    <div class="grid grid-cols-2 gap-6">
      <!-- ========================================
           PRESIDENTE DE LA JUNTA (HTML PURO)
           ======================================== -->
      <div class="flex flex-col gap-4 p-6 border border-gray-200 rounded-lg bg-gray-50">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div class="flex flex-col gap-1">
            <span class="font-bold text-gray-800">Presidente de la Junta</span>
            <span class="text-sm text-gray-600">
              {{ presidenteAsistio ? "Asistió" : "No Asistió" }}
            </span>
          </div>

          <!-- Switch solo si es READONLY -->
          <div v-if="presidenteMode === 'readonly'" class="flex items-center gap-3">
            <span class="text-sm text-gray-600">NO</span>
            <!-- Switch nativo estilizado -->
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="presidenteAsistio"
                @change="
                  handlePresidenteAsistioChange(($event.target as HTMLInputElement).checked)
                "
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              ></div>
            </label>
            <span class="text-sm text-gray-600">SI</span>
          </div>
          <!-- Si es SELECTOR, no mostrar switch -->
          <div v-else class="text-sm text-gray-500 italic">Seleccione de los asistentes</div>
        </div>

        <!-- Nombre del Presidente -->
        <div class="flex flex-col gap-2">
          <!-- READONLY mode: Mostrar nombre bloqueado O selector si NO asistió -->
          <template v-if="presidenteMode === 'readonly'">
            <template v-if="presidenteAsistio">
              <!-- ASISTIÓ: Mostrar nombre bloqueado -->
              <label class="text-sm font-medium text-gray-700">Nombre completo</label>
              <input
                type="text"
                :value="presidenteNombre"
                disabled
                class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-900 cursor-not-allowed"
              />
              <span class="text-xs text-gray-500 italic">Presidente del Directorio</span>
            </template>
            <template v-else>
              <!-- NO ASISTIÓ: Mostrar selector de reemplazo -->
              <SelectInputZod
                v-model="presidenteReemplazoId"
                name="presidente_reemplazo"
                label="Seleccionar reemplazo"
                placeholder="Seleccionar accionista o representante presente"
                :options="asistentesOptions"
                :schema="z.string().min(1, 'Debe seleccionar un reemplazo')"
              />
              <span class="text-xs text-orange-600 italic">
                ⚠️ Seleccione quién ejercerá el rol de Presidente
              </span>
            </template>
          </template>

          <!-- SELECTOR mode: Siempre mostrar selector -->
          <template v-else-if="presidenteMode === 'selector'">
            <SelectInputZod
              v-model="presidenteId"
              name="presidente_selector"
              label="Seleccionar Presidente"
              placeholder="Seleccionar accionista o representante presente"
              :options="asistentesOptions"
              :schema="z.string().min(1, 'Debe seleccionar un presidente')"
            />
            <span class="text-xs text-gray-500 italic">
              Seleccione quién ejercerá el rol de Presidente
            </span>
          </template>
        </div>

        <!-- DEBUG TEMPORAL -->
        <div class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <p><strong>🐛 DEBUG Presidente:</strong></p>
          <p>Mode: {{ presidenteMode }}</p>
          <p>Asistió: {{ presidenteAsistio }}</p>
          <p>ID: {{ presidenteId }}</p>
          <p>Nombre: {{ presidenteNombre || "(vacío)" }}</p>
          <p>Asistentes disponibles: {{ asistentesOptions.length }}</p>
        </div>
      </div>

      <!-- ========================================
           SECRETARIO DE LA JUNTA (HTML PURO)
           ======================================== -->
      <div class="flex flex-col gap-4 p-6 border border-gray-200 rounded-lg bg-gray-50">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div class="flex flex-col gap-1">
            <span class="font-bold text-gray-800">Secretario de la Junta</span>
            <span class="text-sm text-gray-600">
              {{ secretarioAsistio ? "Asistió" : "No Asistió" }}
            </span>
          </div>

          <!-- Switch solo si es READONLY -->
          <div v-if="secretarioMode === 'readonly'" class="flex items-center gap-3">
            <span class="text-sm text-gray-600">NO</span>
            <!-- Switch nativo estilizado -->
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                :checked="secretarioAsistio"
                @change="
                  handleSecretarioAsistioChange(($event.target as HTMLInputElement).checked)
                "
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              ></div>
            </label>
            <span class="text-sm text-gray-600">SI</span>
          </div>
          <!-- Si es SELECTOR, no mostrar switch -->
          <div v-else class="text-sm text-gray-500 italic">Seleccione de los asistentes</div>
        </div>

        <!-- Nombre del Secretario -->
        <div class="flex flex-col gap-2">
          <!-- READONLY mode: Mostrar nombre bloqueado O selector si NO asistió -->
          <template v-if="secretarioMode === 'readonly'">
            <template v-if="secretarioAsistio">
              <!-- ASISTIÓ: Mostrar nombre bloqueado -->
              <label class="text-sm font-medium text-gray-700">Nombre completo</label>
              <input
                type="text"
                :value="secretarioNombre"
                disabled
                class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-900 cursor-not-allowed"
              />
              <span class="text-xs text-gray-500 italic">Gerente General</span>
            </template>
            <template v-else>
              <!-- NO ASISTIÓ: Mostrar selector de reemplazo -->
              <SelectInputZod
                v-model="secretarioReemplazoId"
                name="secretario_reemplazo"
                label="Seleccionar reemplazo"
                placeholder="Seleccionar accionista o representante presente"
                :options="asistentesOptions"
                :schema="z.string().min(1, 'Debe seleccionar un reemplazo')"
              />
              <span class="text-xs text-orange-600 italic">
                ⚠️ Seleccione quién ejercerá el rol de Secretario
              </span>
            </template>
          </template>

          <!-- SELECTOR mode: Siempre mostrar selector -->
          <template v-else-if="secretarioMode === 'selector'">
            <SelectInputZod
              v-model="secretarioId"
              name="secretario_selector"
              label="Seleccionar Secretario"
              placeholder="Seleccionar accionista o representante presente"
              :options="asistentesOptions"
              :schema="z.string().min(1, 'Debe seleccionar un secretario')"
            />
            <span class="text-xs text-gray-500 italic">
              Seleccione quién ejercerá el rol de Secretario
            </span>
          </template>
        </div>

        <!-- DEBUG TEMPORAL -->
        <div class="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <p><strong>🐛 DEBUG Secretario:</strong></p>
          <p>Mode: {{ secretarioMode }}</p>
          <p>Asistió: {{ secretarioAsistio }}</p>
          <p>ID: {{ secretarioId }}</p>
          <p>Nombre: {{ secretarioNombre || "(vacío)" }}</p>
          <p>Gerente General: {{ gerenteGeneral ? "Sí" : "No" }}</p>
          <p>Asistentes disponibles: {{ asistentesOptions.length }}</p>
        </div>
      </div>
    </div>
  </SimpleCard>
</template>
