<script setup lang="ts">
  import { computed, watch } from "vue";
  import { z } from "zod";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import { TipoAccionEnum } from "~/core/hexag/registros/sociedades/pasos/acciones/domain";
  import { useRegistroAccionesStore } from "../../../acciones/stores/useRegistroAccionesStore";
  import {
    accionIdSchema,
    capitalSocialSchema,
    dividendoPasivoTotalSchema,
    porcentajePagadoPorAccionSchema,
    precioPorAccionSchema,
    primaSchema,
  } from "../../schemas/modalAsignarAcciones";
  import { useAsignacionAccionesStore } from "../../stores/useAsignacionAccionesStore";
  import { useRegistroAsignacionAccionesStore } from "../../stores/useRegistroAsignacionAccionesStore";

  interface Props {
    mode?: "crear" | "editar";
    accionistaId?: string | null;
    accionId?: string | null;
  }

  const props = withDefaults(defineProps<Props>(), {
    mode: "crear",
    accionistaId: null,
    accionId: null,
  });

  const asignacionAccionesStore = useAsignacionAccionesStore();
  const registroAccionesStore = useRegistroAccionesStore();
  const registroAsignacionAccionesStore = useRegistroAsignacionAccionesStore();

  // Watcher para resetear porcentajePagadoPorAccion y dividendoPasivoTotal
  // cuando pagadoCompletamente cambia a true
  watch(
    () => asignacionAccionesStore.pagadoCompletamente,
    (newValue) => {
      if (newValue === true) {
        asignacionAccionesStore.porcentajePagadoPorAccion = 0;
        asignacionAccionesStore.dividendoPasivoTotal = 0;
      }
    }
  );

  /**
   * Obtiene el nombre de la acción para mostrar en la UI según su tipo
   */
  const getNombreAccionParaUI = (tipo: TipoAccionEnum, nombreAccion: string): string => {
    switch (tipo) {
      case TipoAccionEnum.CLASES:
        // Para clases, usar el nombre de la acción (ej: "Clase A", "Clase B")
        return nombreAccion || "Acción sin nombre";
      case TipoAccionEnum.COMUN:
        // Para acciones comunes, mostrar "Comunes"
        return "Comunes";
      case TipoAccionEnum.SIN_DERECHO_A_VOTO:
        // Para preferentes sin voto, mostrar "Preferentes sin voto"
        return "Preferentes sin voto";
      default:
        return nombreAccion || "Acción sin nombre";
    }
  };

  // Obtener opciones de acciones disponibles desde el store
  const accionesOptions = computed(() => {
    const acciones = registroAccionesStore.acciones;

    // Si no hay acciones registradas, usar opciones hardcodeadas
    if (acciones.length === 0) {
      return [
        { id: "1", value: "1", label: "Comunes" },
        { id: "2", value: "2", label: "Preferentes sin voto" },
        { id: "3", value: "3", label: "Clase A" },
        { id: "4", value: "4", label: "Clase B" },
      ];
    }

    return acciones.map((accion) => ({
      id: accion.id,
      value: accion.id, // Usar el ID en lugar del nombre
      label: getNombreAccionParaUI(accion.tipo, accion.nombreAccion),
    }));
  });

  // Calcular acciones disponibles para la acción seleccionada
  // Considera si estamos editando una asignación existente (suma las acciones ya asignadas)
  const accionesDisponiblesParaAccion = computed(() => {
    const accionId = asignacionAccionesStore.accionId;
    if (!accionId) return 0;

    // Obtener acciones disponibles desde el store
    const accionesDisponibles = registroAsignacionAccionesStore.accionesDisponibles;
    const accionDisponible = accionesDisponibles.find((a) => a.id === accionId);

    let accionesDisponiblesCalculadas = 0;

    if (!accionDisponible) {
      // Si no encontramos la acción en las disponibles, buscar en las acciones registradas
      const accionesRegistradas = registroAccionesStore.acciones;
      const accionRegistrada = accionesRegistradas.find((a) => a.id === accionId);
      if (accionRegistrada) {
        // Calcular acciones asignadas para esta acción
        let accionesAsignadas = 0;
        registroAsignacionAccionesStore.asignaciones.forEach((asignacion) => {
          asignacion.acciones.forEach((accion) => {
            if (accion.accionId === accionId) {
              accionesAsignadas += accion.cantidadSuscrita;
            }
          });
        });
        accionesDisponiblesCalculadas = accionRegistrada.accionesSuscritas - accionesAsignadas;
      } else {
        return 0;
      }
    } else {
      // Calcular acciones disponibles: accionesSuscritas - accionesAsignadas
      accionesDisponiblesCalculadas =
        accionDisponible.accionesSuscritas - accionDisponible.accionesAsignadas;
    }

    // Si estamos editando una asignación existente, sumar las acciones ya asignadas
    // en esa asignación específica (porque se "liberan" al editar)
    if (props.mode === "editar" && props.accionistaId && props.accionId) {
      const asignacionActual = registroAsignacionAccionesStore.getAsignacionAccionById(
        props.accionistaId,
        props.accionId
      );
      // Si la asignación actual es del mismo tipo de acción que estamos editando,
      // sumar sus acciones a las disponibles (porque se "liberan" al editar)
      if (asignacionActual && asignacionActual.accionId === accionId) {
        accionesDisponiblesCalculadas += asignacionActual.cantidadSuscrita;
      }
    }

    return accionesDisponiblesCalculadas;
  });

  // Schema dinámico para cantidadSuscrita que valida contra acciones disponibles
  const cantidadSuscritaSchemaDinamico = computed(() => {
    const disponibles = accionesDisponiblesParaAccion.value;
    return z
      .number({
        required_error: "La cantidad de acciones es requerida",
        invalid_type_error: "Debe ser un número válido",
      })
      .min(1, "La cantidad de acciones suscritas debe ser mayor a 0")
      .max(
        disponibles > 0 ? disponibles : Infinity,
        disponibles > 0
          ? `Solo quedan ${disponibles.toLocaleString(
              "es-PE"
            )} acciones disponibles para este tipo`
          : "No hay acciones disponibles para este tipo"
      );
  });
</script>

<template>
  <div class="grid grid-cols-2 gap-12">
    <SelectInputZod
      v-model="asignacionAccionesStore.accionId"
      name="accion_id"
      label="Tipo de Acción"
      placeholder="Seleccionar"
      :options="accionesOptions"
      :schema="accionIdSchema"
    />
    <NumberInputZod
      v-model="asignacionAccionesStore.cantidadSuscrita"
      name="cantidad_suscrita"
      label="Cantidad Suscritas de Acciones"
      placeholder="Ingrese cantidad aquí"
      :schema="cantidadSuscritaSchemaDinamico"
    />

    <NumberInputZod
      v-model="asignacionAccionesStore.precioPorAccion"
      name="precio_por_accion"
      label="Precio Pagado por Acción"
      placeholder="S/ Escribe el precio aquí"
      currency="PEN"
      format="decimal"
      :schema="precioPorAccionSchema"
    />
    <NumberInputZod
      v-model="asignacionAccionesStore.capitalSocial"
      name="capital_social"
      label="Capital Social"
      placeholder="S/ Capital Social"
      currency="PEN"
      format="decimal"
      :schema="capitalSocialSchema"
    />

    <NumberInputZod
      v-model="asignacionAccionesStore.prima"
      name="prima"
      label="Prima"
      placeholder="S/ Prima"
      currency="PEN"
      format="decimal"
      :schema="primaSchema"
    />
    <div />

    <div class="flex justify-between gap-2 col-span-2">
      <div class="flex flex-col gap-2">
        <label for="voto-dirimente" class="t-t2 font-secondary text-gray-800 font-bold">
          ¿Todas las Acciones han sido pagadas al 100%?
        </label>
        <span class="t-b2 text-gray-500 font-secondary">
          Selecciona una de las dos opciones.
        </span>
      </div>
      <SimpleSwitchYesNo v-model="asignacionAccionesStore.pagadoCompletamente" label="" />
    </div>

    <NumberInputZod
      v-if="!asignacionAccionesStore.pagadoCompletamente"
      v-model="asignacionAccionesStore.porcentajePagadoPorAccion"
      name="porcentaje_pagado_por_accion"
      label="Porcentaje Pagado por Acción"
      placeholder="% Porcentaje pagado por acción"
      :schema="porcentajePagadoPorAccionSchema"
    />
    <NumberInputZod
      v-if="!asignacionAccionesStore.pagadoCompletamente"
      v-model="asignacionAccionesStore.dividendoPasivoTotal"
      name="total_dividendos_pendientes"
      label="Dividendo Pasivo Total"
      placeholder="% Dividendo pasivo total"
      :schema="dividendoPasivoTotalSchema"
    />
  </div>
</template>
