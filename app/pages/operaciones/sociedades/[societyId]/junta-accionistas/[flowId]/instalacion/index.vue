<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import DetallesCelebracionSection from "~/components/juntas/instalacion/DetallesCelebracionSection.vue";
  import QuorumSection from "~/components/juntas/instalacion/QuorumSection.vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { TipoJunta } from "~/core/hexag/juntas/domain/enums/tipo-junta.enum";
  import { useAsistenciaStore } from "~/core/presentation/juntas/stores/asistencia.store";
  import { useMeetingDetailsStore } from "~/core/presentation/juntas/stores/meeting-details.store";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
  import AsistenciaRepresentacionSection from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/AsistenciaRepresentacionSection.vue";
  import MesaDirectivaSection from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/MesaDirectivaSection.vue";

  /**
   * Página: Instalación de la Junta
   *
   * Paso 3 del flujo de Juntas de Accionistas.
   * Registra la asistencia, representación, quorum y mesa directiva.
   *
   * Ruta: /operaciones/sociedades/[societyId]/junta-accionistas/[flowId]/instalacion
   */

  // ========================================
  // PAGE META
  // ========================================
  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true, // ← CLAVE PARA EL SIDEBAR
  });

  // ========================================
  // ROUTE PARAMS
  // ========================================
  const route = useRoute();
  const societyId = computed(() => parseInt(route.params.societyId as string, 10));
  const flowId = computed(() => parseInt(route.params.flowId as string, 10));

  // ========================================
  // STORES
  // ========================================
  const snapshotStore = useSnapshotStore();
  const meetingDetailsStore = useMeetingDetailsStore();
  const asistenciaStore = useAsistenciaStore();

  // ========================================
  // LIFECYCLE
  // ========================================
  onMounted(async () => {
    console.log("🚀 [Instalacion] Página montada", {
      societyId: societyId.value,
      flowId: flowId.value,
    });

    try {
      // 1. Cargar snapshot (accionistas, quórums, directorio)
      console.log("📦 [Instalacion] Cargando snapshot...");
      await snapshotStore.loadSnapshot(societyId.value, flowId.value);
      console.log("✅ [Instalacion] Snapshot cargado");
      console.log("📊 [Instalacion] Snapshot.directory:", snapshotStore.snapshot?.directory);
      console.log(
        "📊 [Instalacion] Snapshot.presidenteDirectorio:",
        snapshotStore.presidenteDirectorio
      );
      console.log("📊 [Instalacion] Snapshot.attorneys:", snapshotStore.snapshot?.attorneys);

      // 2. Cargar meeting details (tipo junta, convocatoria)
      console.log("📄 [Instalacion] Cargando meeting details...");
      await meetingDetailsStore.loadMeetingDetails(societyId.value, flowId.value);
      console.log("✅ [Instalacion] Meeting details cargado (ANTES de inicializar):", {
        presidenteAsistio: meetingDetailsStore.meetingDetails?.presidenteAsistio,
        secretarioAsistio: meetingDetailsStore.meetingDetails?.secretarioAsistio,
      });

      // 3. Inicializar presidenteId y secretarioId SOLO SI NO EXISTEN EN BACKEND
      const directorio = snapshotStore.snapshot?.directory;
      const gerenteGeneral = snapshotStore.snapshot?.attorneys?.[0];
      
      // ✅ IMPORTANTE: Solo inicializar si es READONLY Y no hay valor previo en el backend
      const updates: any = {};
      
      // Presidente: Solo inicializar si NO hay valor en el backend
      if (directorio?.presidentePreside === true && directorio.presidenteId) {
        const presidenteYaAsignado = meetingDetailsStore.meetingDetails?.presidenteId;
        const presidenteAsistioYaDefinido = meetingDetailsStore.meetingDetails?.presidenteAsistio !== undefined;
        
        if (!presidenteYaAsignado) {
          updates.presidenteId = directorio.presidenteId;
          console.log("✅ [Instalacion] Inicializando presidenteId (primera vez):", directorio.presidenteId);
        }
        
        // ✅ CLAVE: NO sobrescribir si ya tiene un valor (true o false)
        if (!presidenteAsistioYaDefinido) {
          updates.presidenteAsistio = true; // Solo inicializar si no existe
          console.log("✅ [Instalacion] Inicializando presidenteAsistio (primera vez): true");
        } else {
          console.log("ℹ️ [Instalacion] presidenteAsistio YA definido en backend:", meetingDetailsStore.meetingDetails?.presidenteAsistio, "- NO se sobrescribe");
        }
      }
      
      // Secretario: Solo inicializar si NO hay valor en el backend
      if (directorio?.secretarioAsignado === true && gerenteGeneral?.id) {
        const secretarioYaAsignado = meetingDetailsStore.meetingDetails?.secretarioId;
        const secretarioAsistioYaDefinido = meetingDetailsStore.meetingDetails?.secretarioAsistio !== undefined;
        
        if (!secretarioYaAsignado) {
          updates.secretarioId = gerenteGeneral.id;
          console.log("✅ [Instalacion] Inicializando secretarioId (primera vez):", gerenteGeneral.id);
        }
        
        // ✅ CLAVE: NO sobrescribir si ya tiene un valor (true o false)
        if (!secretarioAsistioYaDefinido) {
          updates.secretarioAsistio = true; // Solo inicializar si no existe
          console.log("✅ [Instalacion] Inicializando secretarioAsistio (primera vez): true");
        } else {
          console.log("ℹ️ [Instalacion] secretarioAsistio YA definido en backend:", meetingDetailsStore.meetingDetails?.secretarioAsistio, "- NO se sobrescribe");
        }
      }
      
      if (Object.keys(updates).length > 0) {
        await meetingDetailsStore.patchMeetingDetails(updates);
        console.log("✅ [Instalacion] Meeting details inicializado (solo valores nuevos):", updates);
      } else {
        console.log("ℹ️ [Instalacion] No hay valores nuevos para inicializar - Backend ya tiene datos");
      }

      // 4. Cargar asistencias (registros de attendance)
      console.log("👥 [Instalacion] Cargando asistencias...");
      await asistenciaStore.loadAsistencias(societyId.value, flowId.value);
      console.log(
        "✅ [Instalacion] Asistencias cargadas:",
        asistenciaStore.asistencias.length
      );
      console.log(
        "📊 [Instalacion] Estado inicial de asistencias:",
        asistenciaStore.asistencias.map((a) => ({
          id: a.id,
          asistio: a.asistio,
          nombre: asistenciaStore.asistenciasEnriquecidas.find((e) => e.id === a.id)?.nombreCompleto,
        }))
      );

      // 5. Si es Junta Universal, marcar TODOS como presentes automáticamente
      if (meetingDetailsStore.meetingDetails?.tipoJunta === TipoJunta.UNIVERSAL) {
        console.log(
          "🌍 [Instalacion] Junta Universal detectada - Marcando todos como presentes..."
        );
        let marcados = 0;
        for (const asistencia of asistenciaStore.asistencias) {
          if (!asistencia.asistio) {
            console.log(`  ✓ Marcando como presente: ${asistencia.id}`);
            await asistenciaStore.toggleAsistencia(
              societyId.value,
              flowId.value,
              asistencia.id
            );
            marcados++;
          }
        }
        console.log(`✅ [Instalacion] ${marcados} accionistas marcados como presentes (Junta Universal)`);
        
        // Verificar después de marcar
        const presentes = asistenciaStore.asistenciasEnriquecidas.filter((a) => a.asistio);
        console.log(
          "📊 [Instalacion] Estado DESPUÉS de marcar:",
          presentes.length,
          "presentes de",
          asistenciaStore.asistencias.length,
          "total"
        );
        console.log(
          "📊 [Instalacion] Detalle presentes:",
          presentes.map((a) => ({ id: a.id, nombre: a.nombreCompleto }))
        );
      } else {
        // Si NO es Universal, verificar cuántos están presentes
        const presentes = asistenciaStore.asistenciasEnriquecidas.filter((a) => a.asistio);
        console.log(
          "📊 [Instalacion] Junta NO Universal - Presentes:",
          presentes.length,
          "de",
          asistenciaStore.asistencias.length
        );
      }
    } catch (error) {
      console.error("❌ [Instalacion] Error al cargar datos:", error);
    }
  });

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    console.log("🎯 [Instalacion] Handler de Siguiente ejecutado");

    // ========================================
    // VALIDACIONES
    // ========================================

    // 1. Validar que haya al menos un asistente
    console.log("🔍 [Validación] Verificando asistentes...");
    console.log("🔍 [Validación] Total asistencias:", asistenciaStore.asistencias.length);
    console.log("🔍 [Validación] Asistencias enriquecidas:", asistenciaStore.asistenciasEnriquecidas.length);
    
    const asistentes = asistenciaStore.asistenciasEnriquecidas.filter((a) => a.asistio);
    console.log("🔍 [Validación] Asistentes marcados como presentes:", asistentes.length);
    console.log("🔍 [Validación] Detalle asistentes:", asistentes.map(a => ({
      id: a.id,
      nombre: a.nombreCompleto,
      asistio: a.asistio
    })));
    
    if (asistentes.length === 0) {
      console.error("❌ [Validación] No hay asistentes marcados");
      throw new Error("Debe haber al menos un asistente en la junta. Por favor, marque la asistencia de al menos un accionista.");
    }
    
    console.log("✅ [Validación] Hay", asistentes.length, "asistentes");

    // 2. Validar que personas jurídicas/sucursales/etc tengan representante obligatorio
    const TIPOS_CON_REPRESENTANTE_OBLIGATORIO = [
      "JURIDICA",
      "SUCURSAL",
      "FONDO_INVERSION",
      "FIDEICOMISO",
      "SUCESION_INDIVISA",
    ] as const;

    const juridicasSinRepresentante = asistenciaStore.asistenciasEnriquecidas.filter(
      (a) =>
        a.asistio &&
        TIPOS_CON_REPRESENTANTE_OBLIGATORIO.includes(a.tipoPersona as any) &&
        !a.representadoPorId
    );

    if (juridicasSinRepresentante.length > 0) {
      const nombres = juridicasSinRepresentante.map((a) => a.nombreCompleto).join(", ");
      throw new Error(
        `Las siguientes personas jurídicas/sucursales deben tener representante asignado: ${nombres}`
      );
    }

    // 2. Validar que haya presidente
    const presidenteId = meetingDetailsStore.meetingDetails?.presidenteId;
    const presidenteAsistio = meetingDetailsStore.meetingDetails?.presidenteAsistio;
    if (!presidenteId && presidenteAsistio) {
      throw new Error("Debe designar un presidente de la junta");
    }

    // 3. Validar que haya secretario
    const secretarioId = meetingDetailsStore.meetingDetails?.secretarioId;
    const secretarioAsistio = meetingDetailsStore.meetingDetails?.secretarioAsistio;
    if (!secretarioId && secretarioAsistio) {
      throw new Error("Debe designar un secretario de la junta");
    }

    console.log("✅ [Instalacion] Validaciones pasadas");
    console.log("📦 [Instalacion] Meeting Details a guardar:", {
      presidenteId,
      secretarioId,
      presidenteAsistio,
      secretarioAsistio,
    });

    // ========================================
    // GUARDAR EN BACKEND
    // ========================================

    // Preparar datos finales a guardar
    if (!meetingDetailsStore.meetingDetails) {
      throw new Error("No hay meeting details para guardar");
    }

    const finalMeetingDetails = {
      ...meetingDetailsStore.meetingDetails,
      presidenteId: presidenteId || undefined,
      secretarioId: secretarioId || undefined,
      // ✅ RESPETAR valores del store (pueden ser true o false)
      presidenteAsistio: presidenteAsistio ?? false,
      secretarioAsistio: secretarioAsistio ?? false,
      // TODO: Agregar instaladaEnConvocatoria (Primera/Segunda)
      // instaladaEnConvocatoria: OrdenConvocatoria.PRIMERA,
    };

    console.log("📤 [Instalacion] Guardando meeting details:", finalMeetingDetails);

    await meetingDetailsStore.updateMeetingDetails(finalMeetingDetails);
    console.log("✅ [Instalacion] Mesa directiva guardada en backend");

    console.log("✅ [Instalacion] Proceso completado, continuando al siguiente paso...");
  });
</script>

<template>
  <SlotWrapper>
    <TitleH2
      title="Instalación de la Junta"
      subtitle="Registra la asistencia de accionistas, representación y designación de la mesa directiva."
    />

    <!-- Esperar a que el snapshot esté cargado -->
    <div
      v-if="snapshotStore.status === 'loading'"
      class="flex justify-center items-center py-12"
    >
      <span class="text-slate-500">Cargando datos de la junta...</span>
    </div>

    <div
      v-else-if="snapshotStore.snapshot && meetingDetailsStore.meetingDetails"
      class="flex flex-col gap-10"
    >
      <!-- ========================================
           SECCIÓN 1: Detalles de la Celebración
           ======================================== -->
      <DetallesCelebracionSection />

      <!-- Quorum (debajo de detalles, solo si es GENERAL) -->
      <QuorumSection />

      <!-- ========================================
           SECCIÓN 2: Asistencia y Representación
           ======================================== -->
      <AsistenciaRepresentacionSection :society-id="societyId" :flow-id="String(flowId)" />

      <!-- ========================================
           SECCIÓN 3: Mesa Directiva (Presidente y Secretario)
           ======================================== -->
      <MesaDirectivaSection :society-id="societyId" :flow-id="String(flowId)" />
    </div>

    <div v-else class="flex justify-center items-center py-12">
      <span class="text-red-500">Error al cargar el snapshot</span>
    </div>
  </SlotWrapper>
</template>
