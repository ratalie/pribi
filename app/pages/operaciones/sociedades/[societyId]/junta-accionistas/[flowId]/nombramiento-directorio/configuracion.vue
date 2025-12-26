<template>
  <SlotWrapper>
    <div class="flex flex-col gap-10">
      <!-- Switch y subtítulo -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <p class="t-h5 text-primary-800 font-primary font-semibold">Configurar directorio</p>
          <Switch v-model="configurarDirectorio" />
          <VDropdownComponent
            message-dropdown="Activa o desactiva la votación para la configuración del directorio. Si se activa, se creará una sesión de votación para aprobar esta configuración."
            :button-add-visible="true"
          />
        </div>
        <p class="t-b2 text-gray-600 font-secondary">
          Indique si corresponde renovar el directorio y defina la configuración de sus
          miembros.
        </p>
      </div>

      <!-- Estado vacío cuando el switch está en false -->
      <DirectorioEmptyState v-if="!configurarDirectorio" />

      <!-- Formulario cuando el switch está en true -->
      <SimpleCard v-if="configurarDirectorio">
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
  import { onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import { z } from "zod";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import SlotWrapper from "~/components/containers/SlotWrapper.vue";
  import Switch from "~/components/ui/switch/Switch.vue";
  import VDropdownComponent from "~/components/VDropdownComponent.vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import { useDirectoryConfigurationStore } from "~/core/presentation/juntas/puntos-acuerdo/nombramiento-directores/stores/useDirectoryConfigurationStore";
  import DirectorioEmptyState from "~/core/presentation/registros/sociedades/pasos/directorio/components/DirectorioEmptyState.vue";
  import { termOptions } from "~/core/presentation/registros/sociedades/pasos/directorio/constants/directorio.constants";
  import type { TypeOption } from "~/types/TypeOptions";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const route = useRoute();
  const directoryConfigStore = useDirectoryConfigurationStore();

  // Estado del switch (default: false)
  const configurarDirectorio = ref(false);

  // Formulario
  const form = ref({
    cantidadDirectores: "" as string | number,
    fechaInicio: "" as string,
    fechaFin: "" as string,
    duracionDirectorio: "" as string,
  });

  // Opciones para Cantidad de Directores
  const cantidadDirectoresOptions: TypeOption[] = [
    { id: 1, label: "3", name: "3", value: "3", acronimo: "3" },
    { id: 2, label: "4", name: "4", value: "4", acronimo: "4" },
    { id: 3, label: "5", name: "5", value: "5", acronimo: "5" },
    { id: 4, label: "6", name: "6", value: "6", acronimo: "6" },
    { id: 5, label: "7", name: "7", value: "7", acronimo: "7" },
  ];

  // Opciones para Duración del Directorio (1, 2, 3 años)
  const duracionDirectorioOptions: TypeOption[] = termOptions;

  // Mapeo de periodo del frontend al backend
  const periodoMap: Record<string, string> = {
    "1": "ONE_YEAR",
    "2": "TWO_YEARS",
    "3": "THREE_YEARS",
  };

  // Mapeo inverso: del backend al frontend
  const periodoMapReverse: Record<string, string> = {
    ONE_YEAR: "1",
    TWO_YEARS: "2",
    THREE_YEARS: "3",
  };

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

  // Cargar configuración existente si hay
  onMounted(async () => {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    if (societyId && flowId) {
      try {
        await directoryConfigStore.loadConfiguration(societyId, flowId);

        // Si hay configuración cargada, prellenar el formulario
        if (directoryConfigStore.configuration) {
          const config = directoryConfigStore.configuration;

          // Prellenar cantidadDirectores si existe
          if (config.cantidadDirectores) {
            form.value.cantidadDirectores = String(config.cantidadDirectores);
          }

          // Prellenar periodo (convertir del backend al frontend)
          if (config.periodo) {
            const periodoFrontend = periodoMapReverse[config.periodo] || config.periodo;
            form.value.duracionDirectorio = periodoFrontend;
          }

          // Prellenar fechas
          if (config.inicioMandato) {
            form.value.fechaInicio = config.inicioMandato;
          }
          if (config.finMandato) {
            form.value.fechaFin = config.finMandato;
          }

          // Si hay configuración, activar el switch
          if (
            config.cantidadDirectores ||
            config.periodo ||
            config.inicioMandato ||
            config.finMandato
          ) {
            configurarDirectorio.value = true;
          }
        }
      } catch (error: any) {
        // Si no existe configuración (404), es normal
        if (error?.statusCode === 404 || error?.status === 404) {
          console.debug("[Configuracion.vue] No hay configuración previa (404)");
        } else {
          console.error("[Configuracion.vue] Error al cargar configuración:", error);
        }
      }
    }
  });

  // Handler para submit - se ejecuta cuando se hace click en "Siguiente"
  const handleSubmit = async () => {
    const societyId = Number(route.params.societyId);
    const flowId = Number(route.params.flowId);

    if (!societyId || !flowId) {
      console.error("[Configuracion.vue] Faltan parámetros de ruta");
      return;
    }

    try {
      // Preparar el DTO para enviar al backend
      const dto: {
        cantidadDirectores?: number;
        periodo?: string;
        inicioMandato?: string;
        finMandato?: string;
        configurarDirectorio?: boolean;
      } = {};

      // Solo enviar campos si el switch está activo y hay valores
      if (configurarDirectorio.value) {
        if (form.value.cantidadDirectores) {
          dto.cantidadDirectores = Number(form.value.cantidadDirectores);
        }

        // Convertir periodo del frontend al backend
        if (form.value.duracionDirectorio) {
          dto.periodo =
            periodoMap[form.value.duracionDirectorio] || form.value.duracionDirectorio;
        }

        if (form.value.fechaInicio) {
          dto.inicioMandato = form.value.fechaInicio;
        }

        if (form.value.fechaFin) {
          dto.finMandato = form.value.fechaFin;
        }
      }

      // Siempre enviar configurarDirectorio para activar/desactivar la votación
      dto.configurarDirectorio = configurarDirectorio.value;

      console.debug("[Configuracion.vue] Enviando configuración:", dto);

      // Actualizar configuración en el backend
      await directoryConfigStore.updateConfiguration(societyId, flowId, dto);

      console.debug("[Configuracion.vue] Configuración actualizada correctamente");
    } catch (error: any) {
      console.error("[Configuracion.vue] Error al actualizar configuración:", error);
      throw error; // Re-lanzar para que useJuntasFlowNext pueda manejarlo
    }
  };

  // Conectar el botón "Siguiente" del layout
  useJuntasFlowNext(handleSubmit);
</script>
