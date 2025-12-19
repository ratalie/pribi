<template>
  <SlotWrapper>
    <div class="flex flex-col gap-10">
      <!-- Switch y subtítulo -->
      <div class="flex w-full justify-between items-start">
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-2">
            <p class="t-h5 text-primary-700 font-primary font-semibold">
              Cambio de Presidente
            </p>
            <Switch v-model="tieneCambioPresidente" />
            <VDropdownComponent
              message-dropdown="Seleccione si se realizará un cambio de presidente del directorio."
              :button-add-visible="true"
            />
          </div>
          <p class="t-b2 text-gray-600 font-secondary">
            Seleccione si se realizará un cambio de presidente del directorio.
          </p>
        </div>
        <!-- Select del presidente -->
        <div class="flex-1 max-w-xs">
          <BaseInputSelect
            id="nombre-presidente"
            v-model="presidenteId"
            :options="opcionesPresidente"
            :placeholder="
              tieneCambioPresidente ? 'Seleccione el presidente' : presidenteActual
            "
            :is-disabled="!tieneCambioPresidente"
            class="border border-gray-700 bg-gray-100 text-gray-500"
          />
          <p v-if="!tieneCambioPresidente" class="t-b2 text-gray-600 font-secondary mt-1">
            {{ presidenteActual }}
          </p>
        </div>
      </div>

      <!-- Tabla de Resultados de la Votación -->
      <div v-if="tieneCambioPresidente" class="flex flex-col gap-4">
        <p class="t-h5 text-gray-800 font-primary font-semibold">Resultados de la Votación</p>
        <SimpleCard>
          <SimpleTable :columns="columns" :data="resultadosVotacion" />
        </SimpleCard>
      </div>
    </div>

    <!-- Modal de Empate -->
    <BaseModal v-model="isModalEmpateOpen" size="sm">
      <div class="flex flex-col gap-[30px]">
        <!-- Header con icono y X -->
        <div class="flex items-center justify-between">
          <div class="relative w-[60px] h-[60px]">
            <!-- Div rotado de fondo (cuadrado morado sólido) -->
            <div
              class="w-[60px] h-[60px] rounded-xl bg-primary-700 absolute"
              style="transform: rotate(-50deg) translate(4px, 4px)"
            ></div>
            <!-- Cuadrado frontal con degradado -->
            <div
              class="relative w-[60px] h-[60px] rounded-xl flex items-center justify-center bg-gradient-to-br from-white via-primary-50 to-primary-100 shadow-sm"
            >
              <UserCircle class="w-[32px] h-[32px] text-primary-700" />
            </div>
          </div>
          <button
            @click="isModalEmpateOpen = false"
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Subtítulo -->
        <div class="flex flex-col gap-2">
          <p class="t-t3 text-gray-600 font-normal">
            <span class="font-semibold">Empate: se requiere sorteo</span>
          </p>
          <p class="t-t3 text-gray-600 font-normal">
            Se ha producido un empate entre varios postulantes y hay más candidatos que cargos
            disponibles. Para continuar,
            <span class="font-bold">los accionistas deben realizar un sorteo</span>
            y seleccionar manualmente quiénes ocuparán los cargos disponibles.
          </p>
        </div>

        <!-- Tag informativo -->
        <div class="w-full rounded-xl bg-primary-50 text-primary-400 p-4">
          <p class="t-t2 font-secondary">
            Se requiere intervención manual para resolver el empate mediante sorteo.
          </p>
        </div>

        <!-- Checklist de candidatos -->
        <div class="flex flex-col gap-3">
          <p class="t-h5 text-gray-800 font-primary font-semibold">Candidatos en empate:</p>
          <div class="flex flex-col gap-2">
            <label
              v-for="candidato in candidatosEnEmpate"
              :key="candidato.nombreCompleto"
              :class="[
                'flex items-center gap-2',
                isCandidatoDeshabilitado(candidato.nombreCompleto)
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer',
              ]"
            >
              <input
                type="checkbox"
                :checked="candidatosSeleccionadosEmpate.includes(candidato.nombreCompleto)"
                :disabled="isCandidatoDeshabilitado(candidato.nombreCompleto)"
                @change="
                  handleCheckboxChange(
                    candidato.nombreCompleto,
                    ($event.target as HTMLInputElement).checked
                  )
                "
                class="w-4 h-4 rounded border-gray-300 text-primary-700 focus:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span class="t-b1 text-gray-800 font-secondary">
                {{ candidato.nombreCompleto }}
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Botones en el footer del modal -->
      <template #footer>
        <div class="flex justify-center gap-3 w-full">
          <BaseButton variant="outline" size="md" @click="isModalEmpateOpen = false">
            Cancelar
          </BaseButton>
          <BaseButton variant="primary" size="md" @click="confirmarSorteo">
            Confirmar
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import type { ColumnDef } from "@tanstack/vue-table";
  import { UserCircle, X } from "lucide-vue-next";
  import { computed, h, nextTick, onMounted, ref, watch } from "vue";
  import { useRoute } from "vue-router";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import BaseInputSelect, {
    type BaseSelectOption,
  } from "~/components/base/inputs/text/BaseInputSelect.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import SimpleTable from "~/components/base/tables/simple-table/SimpleTable.vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import Switch from "~/components/ui/switch/Switch.vue";
  import VDropdownComponent from "~/components/VDropdownComponent.vue";
  import { VoteAgreementType } from "~/core/hexag/juntas/domain/enums/vote-agreement-type.enum";
  import { useDirectoryConfigurationStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/stores/useDirectoryConfigurationStore";
  import { useNombramientoDirectoresStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/stores/useNombramientoDirectoresStore";
  import { useVotacionDirectoresController } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/votacion/composables/useVotacionDirectoresController";
  import { useVotacionDirectoresStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/votacion/stores/useVotacionDirectoresStore";
  import { useSnapshotStore } from "~/core/presentation/juntas/stores/snapshot.store";
  import { useDirectoresStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/composables/useDirectoresStore";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();
  const directoresStore = useDirectoresStore();
  const nombramientoStore = useNombramientoDirectoresStore();
  const snapshotStore = useSnapshotStore();
  const votacionController = useVotacionDirectoresController();
  const votacionStore = useVotacionDirectoresStore();
  const directoryConfigurationStore = useDirectoryConfigurationStore();

  // Estado
  const tieneCambioPresidente = ref(false);
  const presidenteId = ref<string>(""); // ID del director (no person.id)
  const isModalEmpateOpen = ref(false);
  const candidatosSeleccionadosEmpate = ref<string[]>([]);
  const isLoadingPresidente = ref(false);

  // ✅ Cargar directores designados y votos al montar
  onMounted(async () => {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);
    if (societyId && flowId) {
      try {
        // 1. Cargar snapshot si no está cargado
        if (!snapshotStore.snapshot) {
          await snapshotStore.loadSnapshot(societyId, flowId);
        }

        // 2. Cargar directores designados
        await nombramientoStore.loadDirectoresDesignados(societyId, flowId);

        // 3. Cargar configuración del directorio (para obtener presidenteId actual)
        try {
          await directoryConfigurationStore.loadConfiguration(societyId, flowId);
          // Si hay presidenteId en la configuración, establecerlo
          if (directoryConfigurationStore.configuration?.presidenteId) {
            presidenteId.value = directoryConfigurationStore.configuration.presidenteId;
            tieneCambioPresidente.value = true; // Si ya hay presidente, asumir que hay cambio
          }
        } catch (error: any) {
          // Si no existe (404), es normal - se creará al guardar
          if (error?.statusCode !== 404 && error?.status !== 404) {
            console.error("[presidente.vue] Error al cargar configuración:", error);
          }
        }

        // 4. Cargar todos los datos necesarios (incluye votos desde el backend)
        await votacionController.loadData();

        // Sincronizar candidatos y cantidad con useDirectoresStore
        // (necesario para que los votos se muestren correctamente)
        const candidatosFromController = votacionController.candidatos.value;
        const candidatosParaStore = candidatosFromController.map((c) => ({
          nombreCompleto: `${c.person.nombre} ${c.person.apellidoPaterno} ${
            c.person.apellidoMaterno || ""
          }`.trim(),
          tipoDirector: "titular" as const,
          tipoDocumento: c.person.tipoDocumento,
          numeroDocumento: c.person.numeroDocumento,
          nombre: c.person.nombre,
          apellidoPaterno: c.person.apellidoPaterno,
          apellidoMaterno: c.person.apellidoMaterno,
          candidato: true,
        }));

        directoresStore.setDirectoresData(candidatosParaStore);
        directoresStore.setCantidadDirectores(votacionController.cantidadDirectores.value);
        directoresStore.setCuposDisponibles(votacionController.cuposDisponibles.value);

        // ✅ Detectar método de votación desde la sesión de votación
        // Si hay items con tipoAprobacion: APROBADO_POR_TODOS, es unanimidad
        if (votacionStore.hasVotacion && votacionStore.itemsVotacion.length > 0) {
          const esUnanimidad = votacionStore.itemsVotacion.some(
            (item) => item.tipoAprobacion === VoteAgreementType.APROBADO_POR_TODOS
          );
          const metodoDetectado = esUnanimidad ? "unanimidad" : "mayoria";
          directoresStore.setMetodoVotacion(metodoDetectado);
          console.log("[presidente.vue] Método de votación detectado:", metodoDetectado);
        }

        console.log("[presidente.vue] Datos cargados:", {
          votos: directoresStore.votosAsignados.length,
          candidatos: candidatosParaStore.length,
          votosPorCandidato: Array.from(directoresStore.votosPorCandidato.entries()),
          metodoVotacion: directoresStore.metodoVotacion,
        });
      } catch (error) {
        console.error("[presidente.vue] Error al cargar datos:", error);
      }
    }
  });

  // ✅ Obtener presidente actual desde la configuración del directorio o elegidos (SOLO elegidos, NO titulares del snapshot)
  const presidenteActual = computed(() => {
    // 1. Prioridad: Presidente de la configuración del directorio (si existe)
    if (directoryConfigurationStore.configuration?.presidenteId) {
      const presidenteIdConfig = directoryConfigurationStore.configuration.presidenteId;

      // Buscar en elegidos (candidatos) - NO buscar en titulares del snapshot
      const directorElegido = nombramientoStore.directoresTitularesCandidatos.find(
        (d) => d.id === presidenteIdConfig
      );
      if (directorElegido) {
        return `${directorElegido.person.nombre} ${directorElegido.person.apellidoPaterno} ${
          directorElegido.person.apellidoMaterno || ""
        }`.trim();
      }
    }

    // 2. Fallback: Primer director elegido (si hay)
    const directoresElegidos = nombramientoStore.directoresTitularesCandidatos.filter(
      (d) => d.designationStatus === "ELEGIDO" || d.candidateStatus === "ELECTED"
    );
    if (directoresElegidos.length > 0) {
      const primerElegido = directoresElegidos[0];
      return `${primerElegido.person.nombre} ${primerElegido.person.apellidoPaterno} ${
        primerElegido.person.apellidoMaterno || ""
      }`.trim();
    }

    // Último fallback: mensaje indicando que no hay presidente
    return "No hay presidente designado";
  });

  // ✅ Opciones para el select del presidente (SOLO ELEGIDOS - NO titulares del snapshot)
  const opcionesPresidente = computed<BaseSelectOption[]>(() => {
    // Obtener SOLO los directores elegidos (candidatos que fueron elegidos)
    const directoresElegidos = nombramientoStore.directoresTitularesCandidatos.filter(
      (d) => d.candidateStatus === "ELECTED" || d.designationStatus === "ELEGIDO"
    );

    // Crear opciones con el ID del director como value y el nombre completo como label
    return directoresElegidos.map((director) => {
      const nombreCompleto = `${director.person.nombre} ${director.person.apellidoPaterno} ${
        director.person.apellidoMaterno || ""
      }`.trim();
      return {
        id: director.id,
        value: director.id, // ✅ Usar ID del director (no person.id)
        label: nombreCompleto,
      };
    });
  });

  // Precargar presidenteId desde la configuración
  watch(
    () => directoryConfigurationStore.configuration?.presidenteId,
    (nuevoPresidenteId) => {
      if (nuevoPresidenteId) {
        presidenteId.value = nuevoPresidenteId;
        // Si hay presidenteId, significa que ya hay un presidente asignado
        tieneCambioPresidente.value = true;
      }
    },
    { immediate: true }
  );

  // Manejar cambio del switch
  watch(
    () => tieneCambioPresidente.value,
    (tieneCambio) => {
      if (!tieneCambio) {
        // Si el switch está en false, limpiar el presidenteId (no guardar null, solo limpiar localmente)
        presidenteId.value = "";
      } else if (opcionesPresidente.value.length > 0 && !presidenteId.value) {
        // Si el switch está en true y no hay valor, usar el primero disponible
        presidenteId.value = opcionesPresidente.value[0]?.value.toString() || "";
      }
    }
  );

  // Guardar presidenteId cuando cambie (solo si el switch está activado)
  let saveTimeout: ReturnType<typeof setTimeout> | null = null;
  watch([presidenteId, tieneCambioPresidente], async ([nuevoPresidenteId, tieneCambio]) => {
    // Solo guardar si el switch está activado y hay un presidenteId
    if (!tieneCambio || !nuevoPresidenteId) return;

    // Limpiar timeout anterior si existe
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Debounce: esperar 500ms antes de guardar
    saveTimeout = setTimeout(async () => {
      const societyId = Number(route.params.societyId);
      const flowId = Number(route.params.flowId);
      if (!societyId || !flowId) return;

      isLoadingPresidente.value = true;
      try {
        await directoryConfigurationStore.updateConfiguration(societyId, flowId, {
          presidenteId: nuevoPresidenteId,
        });
        console.log("[presidente.vue] Presidente guardado:", nuevoPresidenteId);
      } catch (error) {
        console.error("[presidente.vue] Error al guardar presidente:", error);
      } finally {
        isLoadingPresidente.value = false;
      }
    }, 500);
  });

  // Método de votación (obtenido del store) - DEBE declararse ANTES de los watch que lo usan
  const metodoVotacion = computed(() => directoresStore.metodoVotacion);

  // Verificar si hay empate después de cargar los datos (solo para votación por mayoría)
  watch(
    () => [
      directoresStore.votosAsignados.length,
      nombramientoStore.directoresTitularesCandidatos.length,
    ],
    async () => {
      await nextTick();
      console.log(
        "🔍 [presidente.vue] Datos actualizados - hayEmpate:",
        directoresStore.hayEmpate
      );
      console.log(
        "🔍 [presidente.vue] Datos actualizados - metodoVotacion:",
        metodoVotacion.value
      );

      // Solo mostrar modal si es votación por mayoría
      if (directoresStore.hayEmpate && metodoVotacion.value === "mayoria") {
        console.log("✅ [presidente.vue] Mostrando modal de empate (votación por mayoría)");
        setTimeout(() => {
          isModalEmpateOpen.value = true;
        }, 100);
      }
    },
    { immediate: true }
  );

  // Watch el flag para mostrar el modal cuando cambie a true (solo para votación por mayoría)
  watch(
    () => [directoresStore.hayEmpate, metodoVotacion.value],
    ([nuevoEmpate, nuevoMetodo]) => {
      if (nuevoEmpate && nuevoMetodo === "mayoria") {
        console.log(
          "✅ [presidente.vue] Flag hayEmpate cambió a true, mostrando modal (votación por mayoría)"
        );
        isModalEmpateOpen.value = true;
      }
    },
    { immediate: true }
  );

  // ✅ Candidatos con votos (SOLO elegidos - NO titulares del snapshot)
  interface CandidatoConVotos {
    nombreCompleto: string;
    directorId: string; // ID del director (para evitar duplicados)
    votos_asignados: number;
    tipoDirector: string;
    estado?: string; // "ELEGIDO" | "NO_ELEGIDO" (NO "TITULAR")
  }

  const candidatosConVotos = computed<CandidatoConVotos[]>(() => {
    // Obtener SOLO candidatos desde nombramientoStore (NO titulares del snapshot)
    const directoresCandidatos = nombramientoStore.directoresTitularesCandidatos;
    const votosPorCandidato = directoresStore.votosPorCandidato;

    // Mapear candidatos (elegidos/no elegidos)
    return directoresCandidatos.map((candidato) => {
      const nombreCompleto = `${candidato.person.nombre} ${candidato.person.apellidoPaterno} ${
        candidato.person.apellidoMaterno || ""
      }`.trim();
      return {
        nombreCompleto,
        directorId: candidato.id,
        votos_asignados: votosPorCandidato.get(nombreCompleto) || 0,
        tipoDirector: "Director titular",
        estado: candidato.designationStatus || undefined, // "ELEGIDO" | "NO_ELEGIDO" | null
      };
    });
  });

  // ✅ Ordenar por votos y asignar posiciones (SOLO 2 estados: SELECCIONADO/NO SELECCIONADO - NO "TITULAR")
  const resultadosVotacion = computed(() => {
    const candidatos = candidatosConVotos.value;
    const plazasDisponibles = directoresStore.cantidadDisponibles;

    // Si es votación por unanimidad
    if (metodoVotacion.value === "unanimidad") {
      const candidatosSeleccionados = directoresStore.candidatosSeleccionadosUnanimidad;
      const cantidadCandidatos = candidatosSeleccionados.length;

      return candidatos.map((candidato, index) => {
        const estaSeleccionado = candidatosSeleccionados.includes(candidato.nombreCompleto);
        const posicion = index + 1;

        // ✅ Usar estado del backend (ELEGIDO/NO_ELEGIDO) si está disponible, sino calcular
        const estadoBackend = candidato.estado;
        let estado: string;
        if (estadoBackend === "ELEGIDO" || estadoBackend === "NO_ELEGIDO") {
          estado = estadoBackend === "ELEGIDO" ? "SELECCIONADO" : "NO SELECCIONADO";
        } else {
          // Fallback: calcular basado en selección
          estado =
            cantidadCandidatos <= plazasDisponibles && estaSeleccionado
              ? "SELECCIONADO"
              : "NO SELECCIONADO";
        }

        return {
          ...candidato,
          posicion,
          estado,
        };
      });
    }

    // Si es votación por mayoría
    const sorted = [...candidatos].sort((a, b) => b.votos_asignados - a.votos_asignados);

    return sorted.map((candidato, index) => {
      const posicion = index + 1;

      // ✅ Usar estado del backend (ELEGIDO/NO_ELEGIDO) si está disponible, sino calcular
      const estadoBackend = candidato.estado;
      let estado: string;
      if (estadoBackend === "ELEGIDO" || estadoBackend === "NO_ELEGIDO") {
        estado = estadoBackend === "ELEGIDO" ? "SELECCIONADO" : "NO SELECCIONADO";
      } else {
        // Fallback: calcular basado en posición
        const esSeleccionado = posicion <= plazasDisponibles;
        estado = esSeleccionado ? "SELECCIONADO" : "NO SELECCIONADO";
      }

      return {
        ...candidato,
        posicion,
        estado,
      };
    });
  });

  // Candidatos en empate (para el modal)
  const candidatosEnEmpate = computed(() => {
    // Lógica para detectar empates
    const sorted = [...candidatosConVotos.value].sort(
      (a, b) => b.votos_asignados - a.votos_asignados
    );
    const plazasDisponibles = directoresStore.cantidadDisponibles;

    // Detectar si hay empate en el segundo puesto o todos tienen mismos votos
    if (sorted.length <= 1) return [];

    const primerVoto = sorted[0]?.votos_asignados;
    const todosIguales = sorted.every((c) => c.votos_asignados === primerVoto);

    // Si todos tienen los mismos votos
    if (todosIguales && sorted.length > plazasDisponibles) {
      return sorted;
    }

    // Si hay empate en el límite de plazas disponibles
    const votoEnLimite = sorted[plazasDisponibles - 1]?.votos_asignados;
    if (
      votoEnLimite !== undefined &&
      votoEnLimite === sorted[plazasDisponibles]?.votos_asignados
    ) {
      // Retornar todos los candidatos que tienen el mismo voto que el límite
      return sorted.filter((c) => c.votos_asignados === votoEnLimite);
    }

    return [];
  });

  // Columnas de la tabla
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "posicion",
      header: "Posición",
      cell: ({ row }) =>
        h("div", { class: "font-secondary text-gray-800 t-b1" }, row.getValue("posicion")),
    },
    {
      accessorKey: "nombreCompleto",
      header: "Candidato",
      cell: ({ row }) =>
        h(
          "div",
          { class: "font-secondary text-gray-800 t-b1" },
          row.getValue("nombreCompleto")
        ),
    },
    {
      accessorKey: "tipoDirector",
      header: "Tipo de Director",
      cell: ({ row }) =>
        h("div", { class: "font-secondary text-gray-800 t-b1" }, row.getValue("tipoDirector")),
    },
    {
      accessorKey: "votos_asignados",
      header: "Votos",
      cell: ({ row }) =>
        h(
          "div",
          { class: "font-secondary text-gray-800 t-b1" },
          row.getValue("votos_asignados")
        ),
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const estado = row.getValue("estado") as string;
        const esSeleccionado = estado === "SELECCIONADO";

        // ✅ Solo 2 estados: SELECCIONADO (verde), NO SELECCIONADO (rojo)
        const claseBg = esSeleccionado
          ? "bg-[#DEF7EC] text-[#03543f]" // Verde para SELECCIONADO
          : "bg-[#FDE8E8] text-[#9B1C1C]"; // Rojo para NO SELECCIONADO

        return h(
          "div",
          {
            class: ["flex px-2.5 py-2 rounded-full uppercase font-secondary text-sm", claseBg],
          },
          estado
        );
      },
    },
  ];

  // Función para confirmar sorteo
  const confirmarSorteo = () => {
    // Lógica para confirmar el sorteo
    console.log("Candidatos seleccionados:", candidatosSeleccionadosEmpate.value);
    isModalEmpateOpen.value = false;
    directoresStore.setHayEmpate(false);
  };

  // Verificar si un candidato está deshabilitado
  const isCandidatoDeshabilitado = (candidatoNombre: string) => {
    const yaSeleccionado = candidatosSeleccionadosEmpate.value.includes(candidatoNombre);
    const limiteAlcanzado =
      candidatosSeleccionadosEmpate.value.length >= directoresStore.cantidadDisponibles;
    return !yaSeleccionado && limiteAlcanzado;
  };

  // Manejar cambio de checkbox
  const handleCheckboxChange = (candidatoNombre: string, checked: boolean) => {
    if (checked) {
      // Solo agregar si no se ha alcanzado el límite
      if (candidatosSeleccionadosEmpate.value.length < directoresStore.cantidadDisponibles) {
        candidatosSeleccionadosEmpate.value.push(candidatoNombre);
      }
    } else {
      // Remover el candidato
      const index = candidatosSeleccionadosEmpate.value.indexOf(candidatoNombre);
      if (index > -1) {
        candidatosSeleccionadosEmpate.value.splice(index, 1);
      }
    }
  };

  // Función para verificar empate antes de continuar (se llamará desde el botón "Siguiente")
  const verificarEmpate = (): boolean => {
    const sorted = [...candidatosConVotos.value].sort(
      (a, b) => b.votos_asignados - a.votos_asignados
    );
    const plazasDisponibles = directoresStore.cantidadDisponibles;

    if (sorted.length <= 1) return false;

    const primerVoto = sorted[0]?.votos_asignados;
    const todosIguales = sorted.every((c) => c.votos_asignados === primerVoto);

    // Empate si todos tienen mismos votos o hay empate en el límite
    if (todosIguales && sorted.length > plazasDisponibles) {
      isModalEmpateOpen.value = true;
      return true;
    }

    // Empate si hay empate en el límite de plazas disponibles
    const votoEnLimite = sorted[plazasDisponibles - 1]?.votos_asignados;
    if (
      votoEnLimite !== undefined &&
      votoEnLimite === sorted[plazasDisponibles]?.votos_asignados
    ) {
      isModalEmpateOpen.value = true;
      return true;
    }

    return false;
  };

  // Exponer función para uso externo
  defineExpose({
    verificarEmpate,
  });
</script>
