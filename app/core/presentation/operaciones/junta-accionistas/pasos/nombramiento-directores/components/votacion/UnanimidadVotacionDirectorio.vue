<script setup lang="ts">
  import { Check, Info } from "lucide-vue-next";
  import { computed, ref } from "vue";
  import { useDirectoresStore } from "../../composables/useDirectoresStore";

  interface Props {
    candidatosSeleccionados?: string[];
  }

  const props = withDefaults(defineProps<Props>(), {
    candidatosSeleccionados: () => [],
  });

  const emits = defineEmits<{
    (e: "update:candidatosSeleccionados", candidatos: string[]): void;
  }>();

  const directoresStore = useDirectoresStore();

  // Candidatos disponibles (solo titulares con candidato: true)
  const candidatos = computed(() => directoresStore.directoresTitularesCandidatos);

  // Cantidad disponible para seleccionar
  const cantidadDisponibles = computed(() => directoresStore.cantidadDisponibles);

  // Candidatos seleccionados
  const candidatosSeleccionados = computed({
    get: () => props.candidatosSeleccionados,
    set: (value) => emits("update:candidatosSeleccionados", value),
  });

  // Mostrar mensaje si hay más candidatos que la cantidad disponible para seleccionar
  const mostrarMensajeLimite = computed(() => {
    return candidatos.value.length > cantidadDisponibles.value;
  });

  // Toggle selección de candidato
  const toggleCandidato = (nombreCompleto: string) => {
    const index = candidatosSeleccionados.value.indexOf(nombreCompleto);
    if (index > -1) {
      // Deseleccionar
      candidatosSeleccionados.value = candidatosSeleccionados.value.filter(
        (c) => c !== nombreCompleto
      );
    } else {
      // Seleccionar solo si no se ha alcanzado el límite
      if (candidatosSeleccionados.value.length < cantidadDisponibles.value) {
        candidatosSeleccionados.value = [...candidatosSeleccionados.value, nombreCompleto];
      }
    }
  };

  // Verificar si un candidato está seleccionado
  const isCandidatoSeleccionado = (nombreCompleto: string) => {
    return candidatosSeleccionados.value.includes(nombreCompleto);
  };

  // Verificar si se puede seleccionar más candidatos
  const puedeSeleccionarMas = computed(() => {
    return candidatosSeleccionados.value.length < cantidadDisponibles.value;
  });

  const isConfirmed = ref(false);
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="t-h5 text-gray-800 font-primary">Acuerdo de los Accionistas</p>

    <!-- Mensaje de límite si aplica -->
    <div
      v-if="mostrarMensajeLimite"
      class="w-full bg-[#C2E2FF] p-2.5 border rounded-[5px] flex items-center gap-2"
    >
      <Info class="w-5 h-5 text-[#0B76B7] shrink-0" />
      <p class="text-gray-600 font-secondary t-b1">
        Solo puedes seleccionar hasta {{ cantidadDisponibles }} directores adicionales (límite
        máximo: {{ directoresStore.cantidadDirectores }} directores en total)
      </p>
    </div>

    <!-- Tabla de candidatos -->
    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <div class="grid" style="grid-template-columns: 0.5fr 2fr 2fr">
        <!-- Headers -->
        <div class="p-4 bg-gray-50 border-b border-gray-200"></div>
        <div class="p-4 bg-gray-50 border-b border-gray-200">
          <p class="font-primary font-semibold text-gray-800 t-b1">Candidatos a designar</p>
        </div>
        <div class="p-4 bg-gray-50 border-b border-gray-200">
          <p class="font-primary font-semibold text-gray-800 t-b1">Tipo de Director</p>
        </div>

        <!-- Filas de contenido -->
        <template v-for="candidato in candidatos" :key="candidato.nombreCompleto">
          <div
            class="p-4 border-b border-gray-100 flex items-center justify-center transition-all"
            :class="{
              'cursor-pointer':
                puedeSeleccionarMas || isCandidatoSeleccionado(candidato.nombreCompleto),
              'opacity-50 cursor-not-allowed':
                !puedeSeleccionarMas && !isCandidatoSeleccionado(candidato.nombreCompleto),
              'bg-primary-25': isCandidatoSeleccionado(candidato.nombreCompleto),
            }"
            @click="
              puedeSeleccionarMas || isCandidatoSeleccionado(candidato.nombreCompleto)
                ? toggleCandidato(candidato.nombreCompleto)
                : null
            "
          >
            <!-- Checkbox -->
            <div
              :class="[
                'w-5 h-5 border rounded-[3px] flex items-center justify-center transition-all',
                isCandidatoSeleccionado(candidato.nombreCompleto)
                  ? 'bg-gray-800 border-gray-800'
                  : 'border-gray-700 bg-white',
                !puedeSeleccionarMas && !isCandidatoSeleccionado(candidato.nombreCompleto)
                  ? 'opacity-50'
                  : '',
              ]"
            >
              <Check
                v-if="isCandidatoSeleccionado(candidato.nombreCompleto)"
                class="w-3.5 h-3.5 text-white"
              />
            </div>
          </div>
          <div
            class="p-4 border-b border-gray-100 flex items-center transition-all"
            :class="{
              'bg-primary-25': isCandidatoSeleccionado(candidato.nombreCompleto),
            }"
          >
            <p class="font-secondary text-gray-800 t-b1">{{ candidato.nombreCompleto }}</p>
          </div>
          <div
            class="p-4 border-b border-gray-100 flex items-center transition-all"
            :class="{
              'bg-primary-25': isCandidatoSeleccionado(candidato.nombreCompleto),
            }"
          >
            <p class="font-secondary text-gray-800 t-b1">Director Titular</p>
          </div>
        </template>
      </div>
    </div>

    <!-- Mensaje de confirmación -->
    <div
      @click="isConfirmed = !isConfirmed"
      :class="[
        'flex items-center gap-3 cursor-pointer rounded-xl border-2 transition-all duration-200',
        'py-[30px] px-[20px]',
        isConfirmed ? 'border-primary-100 bg-primary-25' : 'border-gray-200 bg-white',
      ]"
    >
      <!-- Icono del checkbox -->
      <div class="shrink-0">
        <Icon
          v-if="isConfirmed"
          name="fluent:checkbox-checked-16-filled"
          size="20"
          class="text-primary-800"
        />
        <Icon v-else name="fluent:checkbox-unchecked-24-regular" size="20" />
      </div>

      <!-- Texto de confirmación -->
      <p class="text-gray-700 t-2 font-secondary">
        Confirmo que todos los accionistas están de acuerdo con la designación de los
        directores propuestos.
      </p>
    </div>
  </div>
</template>
