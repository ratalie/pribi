<template>
  <SlotWrapper>
    <div class="flex flex-col gap-10">
      <!-- Switch y subtítulo -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <p class="t-h5 text-primary-800 font-primary font-semibold">Configurar directorio</p>
          <Switch v-model="tieneDirectorio" />
          <VDropdownComponent
            message-dropdown="Puede activar o desactivar este paso según la preferencia de la sociedad. Si no se desea tratar, manténgalo desactivado."
            :button-add-visible="true"
          />
        </div>
        <p class="t-b2 text-gray-600 font-secondary">
          Indique si corresponde renovar el directorio y defina la remuneración de sus
          miembros.
        </p>
      </div>

      <!-- Estado vacío cuando el switch está en false -->
      <DirectorioEmptyState v-if="!tieneDirectorio" />

      <!-- Formulario cuando el switch está en true -->
      <SimpleCard v-if="tieneDirectorio">
        <Form :validation-schema="schema" @submit="handleSubmit">
          <div class="grid grid-cols-2 gap-4">
            <!-- Columna 1 -->
            <div class="flex flex-col gap-4">
              <SelectInputZod
                v-model="form.cantidadDirectores"
                name="cantidad-directores"
                label="Cantidad de Directores"
                placeholder="Seleccione la cantidad"
                :options="cantidadDirectoresOptions"
                :schema="cantidadDirectoresSchema"
              />
              <DateInputZod
                v-model="form.fechaInicio"
                name="fecha-inicio"
                label="Fecha de Inicio"
                placeholder="Seleccione la fecha"
                :schema="fechaInicioSchema"
              />
            </div>

            <!-- Columna 2 -->
            <div class="flex flex-col gap-4">
              <SelectInputZod
                v-model="form.duracionDirectorio"
                name="duracion-directorio"
                label="Duración del Directorio"
                placeholder="Seleccione la duración"
                :options="duracionDirectorioOptions"
                :schema="duracionDirectorioSchema"
              />
              <DateInputZod
                v-model="form.fechaFin"
                name="fecha-fin"
                label="Fecha de Fin"
                placeholder="Seleccione la fecha"
                :schema="fechaFinSchema"
              />
            </div>
          </div>
        </Form>
      </SimpleCard>
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  import { Form } from "vee-validate";
  import { ref, watch } from "vue";
  import { z } from "zod";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import Switch from "~/components/ui/switch/Switch.vue";
  import VDropdownComponent from "~/components/VDropdownComponent.vue";
  import { useDirectorioConfigStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directorio/composables/useDirectorioConfigStore";
  import DirectorioEmptyState from "~/core/presentation/registros/sociedades/pasos/directorio/components/DirectorioEmptyState.vue";
  import { termOptions } from "~/core/presentation/registros/sociedades/pasos/directorio/constants/directorio.constants";
  import type { TypeOption } from "~/types/TypeOptions";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  // Store para compartir configuración
  const directorioConfigStore = useDirectorioConfigStore();

  // Estado del switch
  const tieneDirectorio = ref(true);

  // Formulario
  const form = ref({
    cantidadDirectores: directorioConfigStore.cantidadDirectores || "",
    fechaInicio: directorioConfigStore.fechaInicio || "",
    fechaFin: directorioConfigStore.fechaFin || "",
    duracionDirectorio: directorioConfigStore.duracionDirectorio || "",
  });

  // Sincronizar con el store cuando cambien los valores
  watch(
    () => form.value.cantidadDirectores,
    (value) => {
      directorioConfigStore.setCantidadDirectores(value);
    }
  );

  watch(
    () => form.value.duracionDirectorio,
    (value) => {
      directorioConfigStore.setDuracionDirectorio(value);
    }
  );

  watch(
    () => form.value.fechaInicio,
    (value) => {
      directorioConfigStore.setFechaInicio(value);
    }
  );

  watch(
    () => form.value.fechaFin,
    (value) => {
      directorioConfigStore.setFechaFin(value);
    }
  );

  // Opciones para Cantidad de Directores (3, 4, 5)
  const cantidadDirectoresOptions: TypeOption[] = [
    { id: 1, label: "3", name: "3", value: "3", acronimo: "3" },
    { id: 2, label: "4", name: "4", value: "4", acronimo: "4" },
    { id: 3, label: "5", name: "5", value: "5", acronimo: "5" },
  ];

  // Opciones para Duración del Directorio (1, 2, 3 años)
  const duracionDirectorioOptions: TypeOption[] = termOptions;

  // Schemas de validación
  const cantidadDirectoresSchema = z
    .string()
    .min(1, "La cantidad de directores es obligatoria");
  const fechaInicioSchema = z.string().min(1, "La fecha de inicio es obligatoria");
  const fechaFinSchema = z.string().min(1, "La fecha de fin es obligatoria");
  const duracionDirectorioSchema = z
    .string()
    .min(1, "La duración del directorio es obligatoria");

  const schema = z.object({
    cantidadDirectores: cantidadDirectoresSchema,
    fechaInicio: fechaInicioSchema,
    fechaFin: fechaFinSchema,
    duracionDirectorio: duracionDirectorioSchema,
  });

  // Handler para submit (por ahora solo console.log)
  const handleSubmit = (values: any) => {
    console.log("Form submitted:", values);
  };
</script>
