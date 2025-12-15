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
            v-model="nombrePresidente"
            :options="opcionesPresidente"
            :placeholder="
              tieneCambioPresidente ? 'Seleccione el presidente' : presidenteActual
            "
            :is-disabled="!tieneCambioPresidente"
            class="border border-gray-700 bg-gray-100 text-gray-500"
          />
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
  import { useDirectoresStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directores/composables/useDirectoresStore";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();
  const directoresStore = useDirectoresStore();

  // Log para verificar que se está cargando el componente correcto
  onMounted(() => {
    console.log("✅ [presidente.vue] Componente presidente.vue montado");
    console.log("✅ [presidente.vue] Ruta actual:", route.path);
  });

  // Estado
  const tieneCambioPresidente = ref(false);
  const nombrePresidente = ref("");
  const isModalEmpateOpen = ref(false);
  const candidatosSeleccionadosEmpate = ref<string[]>([]);

  // Obtener presidente actual (hardcodeado por ahora, luego vendrá del store)
  const presidenteActual = computed(() => {
    // Esto debería venir del store o props, por ahora hardcodeado
    return "Olenka Sanchez Aguilar";
  });

  // Opciones para el select del presidente (solo candidatos SELECCIONADOS + presidente actual)
  const opcionesPresidente = computed<BaseSelectOption[]>(() => {
    const presidente = presidenteActual.value;

    // Obtener solo los candidatos que están SELECCIONADOS según los resultados de votación
    const candidatosSeleccionados = resultadosVotacion.value
      .filter((candidato) => candidato.estado === "SELECCIONADO")
      .map((candidato) => candidato.nombreCompleto);

    // Incluir solo los candidatos seleccionados + presidente actual
    const todos = [
      ...candidatosSeleccionados,
      presidente, // Asegurar que el presidente actual esté incluido
    ];

    // Eliminar duplicados y crear opciones
    const unicos = Array.from(new Set(todos));
    return unicos.map((nombre, index) => ({
      id: index,
      value: nombre,
      label: nombre,
    }));
  });

  // Precargar nombre del presidente
  watch(
    () => tieneCambioPresidente.value,
    (nuevoValor) => {
      if (!nuevoValor) {
        // Si el switch está en false, mostrar el presidente actual
        nombrePresidente.value = presidenteActual.value;
      } else if (opcionesPresidente.value.length > 0 && !nombrePresidente.value) {
        // Si el switch está en true y no hay valor, usar el primero disponible
        nombrePresidente.value = opcionesPresidente.value[0]?.value.toString() || "";
      }
    },
    { immediate: true }
  );

  // Asegurar que el presidente actual esté en las opciones cuando está disabled
  watch(
    () => presidenteActual.value,
    (presidente: string) => {
      if (!tieneCambioPresidente.value) {
        nombrePresidente.value = presidente;
      }
    },
    { immediate: true }
  );

  // Método de votación (obtenido del store) - DEBE declararse ANTES de los watch que lo usan
  const metodoVotacion = computed(() => directoresStore.metodoVotacion);

  // Verificar si hay empate al montar el componente (solo para votación por mayoría)
  onMounted(async () => {
    await nextTick();
    console.log("🔍 [presidente.vue] onMounted - hayEmpate:", directoresStore.hayEmpate);
    console.log("🔍 [presidente.vue] onMounted - metodoVotacion:", metodoVotacion.value);

    // Solo mostrar modal si es votación por mayoría
    if (directoresStore.hayEmpate && metodoVotacion.value === "mayoria") {
      console.log(
        "✅ [presidente.vue] Mostrando modal de empate al montar (votación por mayoría)"
      );
      // Usar setTimeout para asegurar que el DOM esté listo
      setTimeout(() => {
        isModalEmpateOpen.value = true;
      }, 100);
    }
  });

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

  // Candidatos con votos (viene del store de votación)
  interface CandidatoConVotos {
    nombreCompleto: string;
    votos_asignados: number;
    tipoDirector: string;
  }

  const candidatosConVotos = computed<CandidatoConVotos[]>(() => {
    const candidatos = directoresStore.directoresTitularesCandidatos;

    // Si es votación por unanimidad, usar los votos asignados del store
    if (metodoVotacion.value === "unanimidad") {
      const votosPorCandidato = directoresStore.votosPorCandidato;
      return candidatos.map((candidato) => ({
        nombreCompleto: candidato.nombreCompleto,
        votos_asignados: votosPorCandidato.get(candidato.nombreCompleto) || 0,
        tipoDirector: "Director titular",
      }));
    }

    // Si es votación por mayoría, usar los votos asignados
    const votosPorCandidato = directoresStore.votosPorCandidato;
    return candidatos.map((candidato) => ({
      nombreCompleto: candidato.nombreCompleto,
      votos_asignados: votosPorCandidato.get(candidato.nombreCompleto) || 0,
      tipoDirector: "Director titular",
    }));
  });

  // Ordenar por votos y asignar posiciones
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

        // Si la cantidad de candidatos es menor o igual a plazas disponibles: todos SELECCIONADO
        // Si no: NO SELECCIONADO
        const estado =
          cantidadCandidatos <= plazasDisponibles && estaSeleccionado
            ? "SELECCIONADO"
            : "NO SELECCIONADO";

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
      const esSeleccionado = posicion <= plazasDisponibles;

      return {
        ...candidato,
        posicion,
        estado: esSeleccionado ? "SELECCIONADO" : "NO SELECCIONADO",
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
        return h(
          "div",
          {
            class: [
              "flex px-2.5 py-2 rounded-full uppercase font-secondary text-sm",
              esSeleccionado ? "bg-[#DEF7EC] text-[#03543f]" : "bg-[#FDE8E8] text-[#9B1C1C]",
            ],
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
