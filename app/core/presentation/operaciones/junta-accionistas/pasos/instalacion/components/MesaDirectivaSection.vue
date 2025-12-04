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
   */
  const directorio = computed(() => snapshotStore.snapshot?.directory || null);

  /**
   * ¿Tiene directorio configurado?
   */
  const tieneDirectorio = computed(() => !!directorio.value);

  /**
   * Gerente General del snapshot
   * ✅ Se obtiene de snapshot.attorneys (el primero es el Gerente General)
   * TODO: Buscar por claseApoderadoId si tenemos acceso a las clases
   */
  const gerenteGeneral = computed(() => {
    const attorneys = snapshotStore.snapshot?.attorneys || [];
    const gg = attorneys[0]; // Por ahora, asumimos que el primero es el Gerente General

    if (gg) {
      // Obtener nombre según tipo de persona
      let nombre = "N/A";
      if (gg.persona.tipo === "NATURAL") {
        nombre = `${gg.persona.nombre} ${gg.persona.apellidoPaterno} ${gg.persona.apellidoMaterno}`;
      } else if (gg.persona.tipo === "JURIDICA") {
        nombre = gg.persona.razonSocial;
      }

      console.log("✅ [gerenteGeneral] Obtenido del snapshot:", {
        id: gg.id,
        nombre,
      });
      return gg;
    }

    console.warn("⚠️ [gerenteGeneral] No hay gerenteGeneral en el snapshot");
    return null;
  });

  /**
   * Opciones de asistentes presentes (para selector)
   */
  const asistentesOptions = computed(() => {
    console.log(
      "🔍 [asistentesOptions] Total asistencias:",
      asistenciaStore.asistencias.length
    );
    console.log(
      "🔍 [asistentesOptions] Asistencias enriquecidas:",
      asistenciaStore.asistenciasEnriquecidas.length
    );
    console.log(
      "🔍 [asistentesOptions] Primera asistencia:",
      asistenciaStore.asistenciasEnriquecidas[0]
    );

    const presentes = asistenciaStore.asistenciasEnriquecidas.filter((a) => a.asistio);
    console.log("🔍 [asistentesOptions] Presentes (asistio=true):", presentes.length);
    console.log("🔍 [asistentesOptions] Presentes:", presentes);

    return presentes.map((a, index) => ({
      id: index + 1,
      value: a.id,
      label: a.nombreCompleto,
    }));
  });

  // ========================================
  // COMPUTED - PRESIDENTE
  // ========================================

  /**
   * PRESIDENTE: ¿Modo readonly o selector?
   */
  const presidenteMode = computed<"readonly" | "selector">(() => {
    // ⚠️ IMPORTANTE: Si tiene presidenteId asignado → mostrar
    // NO importa si presidentePreside es true o false
    if (directorio.value?.presidenteId) {
      console.log("🔵 [presidenteMode] READONLY (tiene presidente asignado)");
      return "readonly";
    }
    // Si no tiene presidenteId → selector
    console.log("🔵 [presidenteMode] SELECTOR (no tiene presidente asignado)");
    return "selector";
  });

  /**
   * PRESIDENTE: Nombre (si es readonly)
   */
  const presidenteNombre = computed(() => {
    // Si NO asistió, no mostrar nombre
    if (!presidenteAsistio.value) {
      console.log("🔍 [presidenteNombre] NO asistió, retornando vacío");
      return "";
    }

    // Si asistió y es readonly (tiene directorio)
    if (presidenteMode.value === "readonly" && directorio.value) {
      // ✅ USAR GETTER DEL STORE: presidenteDirectorio
      const presidente = snapshotStore.presidenteDirectorio;

      console.log("🔍 [presidenteNombre] READONLY mode, usando presidenteDirectorio:", {
        presidenteId: directorio.value.presidenteId,
        presidente: presidente,
      });

      if (presidente && presidente.persona) {
        const nombre = `${presidente.persona.nombre} ${presidente.persona.apellidoPaterno} ${presidente.persona.apellidoMaterno}`;
        console.log("✅ [presidenteNombre] Nombre completo:", nombre);
        return nombre;
      }

      console.warn("⚠️ [presidenteNombre] No encontrado en snapshot.presidenteDirectorio");
      return "Presidente del Directorio";
    }

    // Si asistió y es selector (sin directorio o directorio no preside)
    if (presidenteMode.value === "selector" && presidenteId.value) {
      // Buscar en asistentes
      const asistente = asistenciaStore.asistenciasEnriquecidas.find(
        (a) => a.id === presidenteId.value
      );
      if (asistente) {
        console.log(
          "✅ [presidenteNombre] SELECTOR mode, nombre encontrado:",
          asistente.nombreCompleto
        );
        return asistente.nombreCompleto;
      }
      console.warn("⚠️ [presidenteNombre] SELECTOR mode pero no encontrado en asistentes");
    }

    return "";
  });

  /**
   * PRESIDENTE: ID seleccionado
   */
  const presidenteId = computed({
    get: () => {
      // Si es readonly, devolver presidenteId del directorio
      if (presidenteMode.value === "readonly" && directorio.value) {
        const id = directorio.value.presidenteId || "";
        console.log("🔍 [presidenteId.get] READONLY mode, usando directorio:", id);
        return id;
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
        console.log("✅ [presidenteId.set] Guardando en meeting-details");
        meetingDetailsStore.patchMeetingDetails({ presidenteId: value });
      } else {
        console.log("⚠️ [presidenteId.set] READONLY mode, no se actualiza");
      }
    },
  });

  /**
   * PRESIDENTE: ¿Asistió?
   * ✅ REF que se inicializa desde el store y se sincroniza
   */
  const presidenteAsistio = ref(meetingDetailsStore.meetingDetails?.presidenteAsistio ?? true);

  /**
   * PRESIDENTE: ID del reemplazo (cuando NO asistió)
   */
  const presidenteReemplazoId = ref("");

  console.log("🟦 [INIT] presidenteAsistio inicializado en:", presidenteAsistio.value);

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

  // ========================================
  // COMPUTED - SECRETARIO
  // ========================================

  /**
   * SECRETARIO: ¿Modo readonly o selector?
   */
  const secretarioMode = computed<"readonly" | "selector">(() => {
    if (directorio.value) {
      // ⚠️ IMPORTANTE: secretarioAsignado es boolean
      // Si secretarioAsignado = true → Gerente General es secretario → readonly
      if (directorio.value.secretarioAsignado === true && gerenteGeneral.value) {
        console.log("🔵 [secretarioMode] READONLY (gerente general es secretario)");
        return "readonly";
      }
      // Si secretarioAsignado = false → Junta lo designa → selector
      console.log("🔵 [secretarioMode] SELECTOR (junta designa secretario)");
      return "selector";
    }
    // Sin directorio → selector
    console.log("🔵 [secretarioMode] SELECTOR (sin directorio)");
    return "selector";
  });

  /**
   * SECRETARIO: Nombre (si es readonly)
   */
  const secretarioNombre = computed(() => {
    // Si NO asistió, no mostrar nombre
    if (!secretarioAsistio.value) {
      console.log("🔍 [secretarioNombre] NO asistió, retornando vacío");
      return "";
    }

    // Si asistió y es readonly (gerente general es secretario)
    if (secretarioMode.value === "readonly" && gerenteGeneral.value) {
      const gg = gerenteGeneral.value;
      console.log("🔍 [secretarioNombre] READONLY mode, Gerente General:", gg);

      if (gg.persona) {
        let nombre = "";
        if (gg.persona.tipo === "NATURAL") {
          nombre = `${gg.persona.nombre} ${gg.persona.apellidoPaterno} ${
            gg.persona.apellidoMaterno || ""
          }`.trim();
        } else if (gg.persona.tipo === "JURIDICA") {
          nombre = gg.persona.razonSocial;
        }
        console.log("✅ [secretarioNombre] Nombre completo:", nombre);
        return nombre || "Gerente General";
      }

      console.warn("⚠️ [secretarioNombre] No tiene persona, usando fallback");
      return "Gerente General";
    }

    // Si asistió y es selector (junta designa secretario)
    if (secretarioMode.value === "selector" && secretarioId.value) {
      // Buscar en asistentes
      const asistente = asistenciaStore.asistenciasEnriquecidas.find(
        (a) => a.id === secretarioId.value
      );
      if (asistente) {
        console.log(
          "✅ [secretarioNombre] SELECTOR mode, nombre encontrado:",
          asistente.nombreCompleto
        );
        return asistente.nombreCompleto;
      }
      console.warn("⚠️ [secretarioNombre] SELECTOR mode pero no encontrado en asistentes");
    }

    return "";
  });

  /**
   * SECRETARIO: ID seleccionado
   */
  const secretarioId = computed({
    get: () => {
      // Si es readonly, devolver ID del gerente general
      if (secretarioMode.value === "readonly" && gerenteGeneral.value) {
        const id = gerenteGeneral.value.id || "";
        console.log("🔍 [secretarioId.get] READONLY mode, usando gerente:", id);
        return id;
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
        console.log("✅ [secretarioId.set] Guardando en meeting-details");
        meetingDetailsStore.patchMeetingDetails({ secretarioId: value });
      } else {
        console.log("⚠️ [secretarioId.set] READONLY mode, no se actualiza");
      }
    },
  });

  /**
   * SECRETARIO: ¿Asistió?
   * ✅ REF que se inicializa desde el store y se sincroniza
   */
  const secretarioAsistio = ref(meetingDetailsStore.meetingDetails?.secretarioAsistio ?? true);

  /**
   * SECRETARIO: ID del reemplazo (cuando NO asistió)
   */
  const secretarioReemplazoId = ref("");

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

    // PRESIDENTE: Auto-actualizar si es readonly
    if (presidenteMode.value === "readonly" && directorio.value?.presidenteId) {
      console.log(
        "✅ [MesaDirectiva] Auto-actualizando presidenteId:",
        directorio.value.presidenteId
      );
      console.log("   → Nombre:", presidenteNombre.value);
      meetingDetailsStore.patchMeetingDetails({
        presidenteId: directorio.value.presidenteId,
        presidenteAsistio: true, // Por defecto asistió
      });
    } else {
      console.warn("⚠️ [MesaDirectiva] NO auto-actualiza presidenteId:", {
        mode: presidenteMode.value,
        presidenteId: directorio.value?.presidenteId,
        tieneDirectorio: tieneDirectorio.value,
      });
    }

    // SECRETARIO: Auto-actualizar si es readonly
    if (secretarioMode.value === "readonly" && gerenteGeneral.value?.id) {
      console.log(
        "✅ [MesaDirectiva] Auto-actualizando secretarioId:",
        gerenteGeneral.value.id
      );
      console.log("   → Nombre:", secretarioNombre.value);
      meetingDetailsStore.patchMeetingDetails({
        secretarioId: gerenteGeneral.value.id,
        secretarioAsistio: true, // Por defecto asistió
      });
    } else {
      console.warn("⚠️ [MesaDirectiva] NO auto-actualiza secretarioId:", {
        mode: secretarioMode.value,
        gerenteGeneralId: gerenteGeneral.value?.id,
        secretarioAsignado: directorio.value?.secretarioAsignado,
      });
    }

    console.log("╔═══════════════════════════════════════════════════════════════╗");
    console.log("║  ✅ [MesaDirectiva] DEBUG COMPLETADO                        ║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");

    // ========================================
    // LOGS REQUERIDOS POR EL USUARIO
    // ========================================
    console.log("");
    console.log("🎯 RESULTADO FINAL:");
    console.log(`El nombre del presidente es: ${presidenteNombre.value || "NO ASIGNADO"}`);
    console.log(`El nombre del secretario es: ${secretarioNombre.value || "NO ASIGNADO"}`);
    console.log(`El array de presentes es:`, asistentesOptions.value);
    console.log("");
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

          <div class="flex items-center gap-3">
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
        </div>

        <!-- Nombre del Presidente: Depende si asistió o no -->
        <div v-if="presidenteAsistio" class="flex flex-col gap-2">
          <!-- ASISTIÓ: Mostrar nombre bloqueado -->
          <label class="text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            type="text"
            :value="presidenteNombre"
            disabled
            class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-900 cursor-not-allowed"
          />
          <span class="text-xs text-gray-500 italic">Presidente del Directorio</span>
        </div>
        <div v-else class="flex flex-col gap-2">
          <!-- NO ASISTIÓ: Mostrar selector de presentes -->
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

          <div class="flex items-center gap-3">
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
        </div>

        <!-- Nombre del Secretario: Depende si asistió o no -->
        <div v-if="secretarioAsistio" class="flex flex-col gap-2">
          <!-- ASISTIÓ: Mostrar nombre bloqueado -->
          <label class="text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            type="text"
            :value="secretarioNombre"
            disabled
            class="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-gray-900 cursor-not-allowed"
          />
          <span class="text-xs text-gray-500 italic">Gerente General</span>
        </div>
        <div v-else class="flex flex-col gap-2">
          <!-- NO ASISTIÓ: Mostrar selector de presentes -->
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
        </div>
      </div>
    </div>
  </SimpleCard>
</template>
