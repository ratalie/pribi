<template>
  <MetodoVotacio
    v-model="metodoVotacion"
    title="Votación para la configuración del nuevo directorio"
    subtitle="Votación para aprobar la configuración del nuevo directorio"
    title-color="text-primary-800"
    :texto-votacion="mensajeUnanimidad"
    :preguntas="preguntas"
    :votantes="[]"
    :accionistas="accionistas"
    @cambiar-tipo="handleCambiarTipo"
    @cambiar-voto="handleCambiarVoto"
  />
</template>

<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useJuntasFlowNext } from "~/composables/useJuntasFlowNext";
  import MetodoVotacio from "~/core/presentation/operaciones/junta-accionistas/pasos/instalacion/components/votacion/MetodoVotacio.vue";
  import { useDirectorioConfigStore } from "~/core/presentation/operaciones/junta-accionistas/pasos/nombramiento-directorio/composables/useDirectorioConfigStore";
  import { termOptions } from "~/core/presentation/registros/sociedades/pasos/directorio/constants/directorio.constants";

  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });

  const directorioConfigStore = useDirectorioConfigStore();
  const metodoVotacion = ref<"unanimidad" | "mayoria">("unanimidad");

  // Obtener valores del store
  const cantidadDirectores = computed(() => directorioConfigStore.cantidadDirectores || "3");
  const duracionDirectorio = computed(() => {
    const duracion = directorioConfigStore.duracionDirectorio || "1";
    // Buscar el label correspondiente en termOptions
    const opcion = termOptions.find((opt) => opt.value === duracion);
    return opcion ? opcion.label : `${duracion} año${duracion !== "1" ? "s" : ""}`;
  });
  const fechaInicio = computed(() => directorioConfigStore.fechaInicio || "");
  const fechaFin = computed(() => directorioConfigStore.fechaFin || "");

  // Formatear fechas para mostrar
  const fechaInicioFormateada = computed(() => {
    if (!fechaInicio.value) return "";
    // Si la fecha viene en formato ISO (YYYY-MM-DD), convertirla a DD/MM/YYYY
    const fecha = new Date(fechaInicio.value);
    if (!isNaN(fecha.getTime())) {
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const año = fecha.getFullYear();
      return `${dia}/${mes}/${año}`;
    }
    return fechaInicio.value;
  });

  const fechaFinFormateada = computed(() => {
    if (!fechaFin.value) return "";
    // Si la fecha viene en formato ISO (YYYY-MM-DD), convertirla a DD/MM/YYYY
    const fecha = new Date(fechaFin.value);
    if (!isNaN(fecha.getTime())) {
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const año = fecha.getFullYear();
      return `${dia}/${mes}/${año}`;
    }
    return fechaFin.value;
  });

  // Mensaje de unanimidad dinámico
  const mensajeUnanimidad = computed(() => {
    let mensaje = `establecer un nuevo Directorio de ${cantidadDirectores.value} miembros, con una duración de ${duracionDirectorio.value}, considerando las fechas de inicio y fin registradas`;

    // Agregar fechas si están disponibles
    if (fechaInicioFormateada.value && fechaFinFormateada.value) {
      mensaje += `, considerando las fechas de inicio ${fechaInicioFormateada.value} y fin ${fechaFinFormateada.value} registradas`;
    } else if (fechaInicioFormateada.value) {
      mensaje += `, considerando la fecha de inicio ${fechaInicioFormateada.value} registrada`;
    } else if (fechaFinFormateada.value) {
      mensaje += `, considerando la fecha de fin ${fechaFinFormateada.value} registrada`;
    }

    return mensaje;
  });

  // Pregunta para voto por mayoría (reactiva)
  const preguntas = computed(() => [
    `¿Se aprueba que el Directorio esté conformado por ${cantidadDirectores.value} directores, con una duración de ${duracionDirectorio.value}?`,
  ]);

  // Accionistas (hardcodeados por el momento)
  const accionistas = ref<string[]>([
    "Olenka Sanchez Aguilar",
    "Melanie Sanchez Aguilar",
    "Braulio Sanchez Aguilar",
  ]);

  // Manejar cambio de tipo de votación
  const handleCambiarTipo = (tipo: "unanimidad" | "mayoria") => {
    metodoVotacion.value = tipo;
    // TODO: Implementar lógica de guardado
  };

  // Manejar cambio de voto
  const handleCambiarVoto = (
    accionistaId: string,
    valor: "A_FAVOR" | "EN_CONTRA" | "ABSTENCION"
  ) => {
    // TODO: Implementar lógica de guardado de votos
    console.log("Voto cambiado:", accionistaId, valor);
  };

  // Configurar el botón "Siguiente"
  useJuntasFlowNext(async () => {
    // TODO: Agregar validación y guardado de datos
  });
</script>
