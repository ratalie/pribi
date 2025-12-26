<script setup lang="ts">
  import { Plus, X } from "lucide-vue-next";
  import { v4 as uuidv4 } from "uuid";
  import { computed } from "vue";
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import {
    EntityCoinUIEnum,
    TipoFirmasUIEnum,
    TipoMontoUIEnum,
  } from "~/core/hexag/registros/sociedades/pasos/regimen-poderes/domain";
  import {
    cantidadFirmantesLibreSchema,
    montoDesdeSchema,
    montoHastaSchema,
    selectCantidadFirmantesSchema,
    selectGrupoFirmantesSchema,
    selectMonedaSchema,
    selectTipoFirmaSchema,
    selectTipoMontoSchema,
  } from "../schemas/FacultadApoderado";
  import { useApoderadoFacultadStore } from "../stores/modal/useApoderadoFacultadStore";
  import { useRegimenFacultadesStore } from "../stores/useRegimenFacultadesStore";

  const apoderadoFacultadStore = useApoderadoFacultadStore();
  const regimenFacultadesStore = useRegimenFacultadesStore();

  // Computed para obtener opciones de cantidad basadas en el grupo del firmante
  // Usa el getter del store que maneja tanto snapshot como store de regimen
  const getCantidadFirmantesOptions = (grupoId: string | null | undefined) => {
    // Actualizar claseFirmanteSeleccionada para que el getter se actualice
    apoderadoFacultadStore.claseFirmanteSeleccionada = grupoId || null;

    // Usar el getter del store que maneja snapshot y store de regimen
    const options = apoderadoFacultadStore.cantidadFirmantesOptions;

    // Si retorna null, significa que debe usarse input libre, pero en ese caso
    // no deberíamos llegar aquí porque el v-if debería mostrar NumberInputZod
    // Retornar array vacío como fallback
    return options || [];
  };

  // Indica si debe usarse input libre (cuando el apoderado principal es Gerente General)
  // Los getters de Pinia se acceden como propiedades reactivas (sin paréntesis)
  const debeUsarInputLibre = computed(() => {
    // Verificar que el getter exista antes de accederlo
    if (
      !apoderadoFacultadStore ||
      !("usarInputLibreCantidadFirmantes" in apoderadoFacultadStore)
    ) {
      return false;
    }
    // Acceder como propiedad (los getters de Pinia son propiedades computadas)
    const valor = apoderadoFacultadStore.usarInputLibreCantidadFirmantes;
    // Si es una función (no debería serlo), llamarla; si no, retornar el valor
    return typeof valor === "function" ? valor() : valor ?? false;
  });

  const crearLimiteVacio = () => ({
    id: uuidv4(),
    desde: 0,
    tipoMonto: TipoMontoUIEnum.MONTO,
    hasta: 0,
    tipoFirma: TipoFirmasUIEnum.SOLA_FIRMA,
    firmantes: [],
  });

  const crearFirmanteVacio = () => ({
    id: uuidv4(),
    cantidad: "",
    grupo: "",
  });

  const handleGrupoFirmanteChange = (newVal: string, limiteId: string, firmanteId: string) => {
    const limite = apoderadoFacultadStore.limiteMonetario.find(
      (limite) => limite.id === limiteId
    );

    if (!limite) return;

    const firmante = limite.firmantes.find((f) => f.id === firmanteId);
    if (firmante) {
      firmante.grupo = newVal;
      // Actualizar claseFirmanteSeleccionada para que el getter cantidadFirmantesOptions se actualice
      apoderadoFacultadStore.claseFirmanteSeleccionada = newVal;
    }
  };

  const handleTipoFirmaChange = (newVal: TipoFirmasUIEnum, limiteId: string) => {
    const limite = apoderadoFacultadStore.limiteMonetario.find(
      (limite) => limite.id === limiteId
    );

    if (!limite) return;

    limite.tipoFirma = newVal;

    if (newVal === TipoFirmasUIEnum.FIRMA_CONJUNTA) {
      if (limite.firmantes.length === 0) {
        limite.firmantes.push(crearFirmanteVacio());
      }
    } else {
      //se puede colocar un modal pequeño para confirmar
      limite.firmantes = [];
    }
  };

  const agregarFirmante = (limiteId: string) => {
    const limite = apoderadoFacultadStore.limiteMonetario.find((l) => l.id === limiteId);

    if (!limite) return;

    // Obtener opciones disponibles
    const opcionesDisponibles = apoderadoFacultadStore.grupoFirmantesOptions;
    const totalOpcionesDisponibles = opcionesDisponibles.length;

    // Obtener grupos ya asignados (excluyendo vacíos o sin seleccionar)
    const gruposAsignados = limite.firmantes
      .map((f) => f.grupo)
      .filter((grupo) => grupo && grupo.trim() !== "");

    // Contar firmantes vacíos (sin grupo seleccionado)
    const firmantesVacios = limite.firmantes.filter(
      (f) => !f.grupo || f.grupo.trim() === ""
    ).length;

    // Calcular cuántos slots están ocupados o reservados
    // Los firmantes con grupo asignado + los firmantes vacíos (que pueden ocupar un slot)
    const slotsOcupados = gruposAsignados.length + firmantesVacios;

    // Validar si quedan opciones disponibles
    // Si los slots ocupados/reservados >= opciones disponibles, no se puede agregar más
    if (slotsOcupados >= totalOpcionesDisponibles) {
      console.warn(
        `[ReglasLimitesCard] No hay más apoderados disponibles para asignar como firmantes. Hay ${totalOpcionesDisponibles} opción(es) disponible(s) y ya se han asignado o reservado ${slotsOcupados} slot(s).`
      );
      return;
    }

    // Agregar firmante vacío
    limite.firmantes.push(crearFirmanteVacio());
  };

  const eliminarFirmante = (limiteId: string, firmanteId: string) => {
    const limite = apoderadoFacultadStore.limiteMonetario.find((l) => l.id === limiteId);

    if (!limite) return;
    // Mantener al menos 1 firmante si el tipo es FIRMA_CONJUNTA
    if (limite.firmantes.length > 1) {
      const index = limite.firmantes.findIndex((f) => f.id === firmanteId);
      if (index > -1) {
        limite.firmantes.splice(index, 1);
      }
    }
  };

  // Watch para agregar límite inicial cuando se activa reglasYLimites
  watch(
    () => apoderadoFacultadStore.reglasYLimites,
    (newVal) => {
      if (newVal) {
        if (apoderadoFacultadStore.limiteMonetario.length === 0) {
          apoderadoFacultadStore.limiteMonetario.push(crearLimiteVacio());
        }
      } else {
        //se puede colocar un modal pequeño para confirmar
        apoderadoFacultadStore.limiteMonetario = [];
      }
    },
    { immediate: true }
  );

  const agregarLimite = () => {
    apoderadoFacultadStore.limiteMonetario.push(crearLimiteVacio());
  };

  const eliminarLimite = (limiteId: string) => {
    const index = apoderadoFacultadStore.limiteMonetario.findIndex((l) => l.id === limiteId);
    if (index > -1 && apoderadoFacultadStore.limiteMonetario.length > 1) {
      apoderadoFacultadStore.limiteMonetario.splice(index, 1);
    }
  };
</script>

<template>
  <SimpleCardDropDown>
    <template #title>
      <div class="flex justify-between gap-2 p-5">
        <div class="flex flex-col gap-2">
          <span class="t-t1 text-gray-800 font-bold font-secondary">
            Reglas de firmas y límites monetarios
          </span>
          <span class="t-t1 text-gray-500 font-normal font-primary">
            Esta opción puede activarse o desactivarse según corresponda.
          </span>
        </div>

        <CustomSwitch
          :checked="apoderadoFacultadStore.reglasYLimites"
          @update:checked="apoderadoFacultadStore.reglasYLimites = $event"
        />
      </div>
    </template>
    <template v-if="apoderadoFacultadStore.reglasYLimites" #content>
      <div class="p-5 flex flex-col gap-6">
        <div class="grid grid-cols-2 gap-10">
          <SelectInputZod
            v-model="apoderadoFacultadStore.tipoMoneda"
            name="moneda"
            label="Tipo de Moneda"
            placeholder="Selecciona una moneda"
            :options="apoderadoFacultadStore.monedaOptions"
            :schema="selectMonedaSchema"
          />
        </div>

        <div
          v-for="limite in apoderadoFacultadStore.limiteMonetario"
          :key="limite.id"
          class="flex flex-col gap-4 border p-4 rounded-md bg-gray-25"
        >
          <div class="flex justify-center items-center gap-2">
            <span class="t-t2 font-secondary text-gray-700 font-medium">De</span>
            <NumberInputZod
              v-model="limite.desde"
              :name="`desde-${limite.id}`"
              placeholder="Ingrese el monto desde"
              :currency="
                apoderadoFacultadStore.tipoMoneda === EntityCoinUIEnum.SOLES ? 'PEN' : 'USD'
              "
              format="decimal"
              :schema="montoDesdeSchema"
            />
            <span class="t-t2 font-secondary text-gray-700 font-medium">Hasta</span>

            <!-- Si el tipo de monto es monto, mostrar el select y el input -->
            <template v-if="limite.tipoMonto === TipoMontoUIEnum.MONTO">
              <SelectInputZod
                v-model="limite.tipoMonto"
                :name="`tipo-monto-${limite.id}`"
                placeholder="Selecciona un tipo de monto"
                :options="apoderadoFacultadStore.tipoMontoOptions"
                :schema="selectTipoMontoSchema"
              />
              <NumberInputZod
                v-model="limite.hasta"
                :name="`hasta-${limite.id}`"
                placeholder="Ingrese el monto hasta"
                :currency="
                  apoderadoFacultadStore.tipoMoneda === EntityCoinUIEnum.SOLES ? 'PEN' : 'USD'
                "
                format="decimal"
                :schema="montoHastaSchema"
              />
            </template>

            <!-- Si el tipo de monto es sin límite, mostrar el div con el texto y el botón -->
            <template v-else>
              <div
                class="w-full h-[40px] inline-flex items-center gap-[5px] px-3 rounded-[8px] border border-primary-500 bg-[#F1EEFF]"
              >
                <span class="flex-1 font-secondary font-medium t-t2 text-gray-700">
                  Sin límite
                </span>
                <button
                  type="button"
                  class="size-[18px] shrink-0 text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
                  @click="limite.tipoMonto = TipoMontoUIEnum.MONTO"
                >
                  <X :size="18" />
                </button>
              </div>
            </template>

            <span class="t-t2 font-secondary text-gray-700 font-medium">es</span>
            <SelectInputZod
              :model-value="limite.tipoFirma"
              :name="`tipo-firma-${limite.id}`"
              placeholder="Selecciona un tipo de firma"
              :options="apoderadoFacultadStore.tipoFirmaOptions"
              :schema="selectTipoFirmaSchema"
              @update:model-value="(newVal: string) => handleTipoFirmaChange(newVal as TipoFirmasUIEnum, limite.id)"
            />

            <!-- Solo mostrar el botón de eliminar si hay más de un límite -->
            <!-- Se necesita al menos un límite monetario -->
            <BaseButton
              v-if="apoderadoFacultadStore.limiteMonetario.length > 1"
              type="button"
              variant="ghost"
              class="w-4 h-4"
              @click="eliminarLimite(limite.id)"
            >
              <component :is="X" class="w-4 h-4" />
            </BaseButton>
          </div>

          <!-- Firmantes -->
          <div
            v-if="limite.tipoFirma === TipoFirmasUIEnum.FIRMA_CONJUNTA"
            class="flex flex-col gap-3 px-6"
          >
            <div
              v-for="firmante in limite.firmantes"
              :key="firmante.id"
              class="flex items-center gap-4"
            >
              <div class="flex justify-center items-center gap-4 border p-4 rounded-md">
                <span class="t-t2 font-secondary text-gray-700 font-medium">con</span>
                <div>
                  <!-- Input libre para Gerente General -->
                  <NumberInputZod
                    v-if="debeUsarInputLibre"
                    :model-value="firmante.cantidad ? Number(firmante.cantidad) : 0"
                    @update:model-value="(val: number) => firmante.cantidad = String(val)"
                    :name="`cantidad-firmantes-${limite.id}-${firmante.id}`"
                    placeholder="0"
                    format="integer"
                    :decimals="0"
                    :schema="cantidadFirmantesLibreSchema"
                  />
                  <!-- Select normal para otras clases -->
                  <SelectInputZod
                    v-else
                    v-model="firmante.cantidad"
                    :name="`cantidad-firmantes-${limite.id}-${firmante.id}`"
                    placeholder="0"
                    :options="getCantidadFirmantesOptions(firmante.grupo)"
                    :schema="selectCantidadFirmantesSchema"
                  />
                </div>

                <span class="t-t2 font-secondary text-gray-700 font-medium">
                  integrante(s) de
                </span>
                <div>
                  <SelectInputZod
                    :model-value="firmante.grupo"
                    @update:model-value="(newVal: string) => handleGrupoFirmanteChange(newVal, limite.id, firmante.id)"
                    :name="`grupo-firmantes-${limite.id}-${firmante.id}`"
                    placeholder="Selecciona el grupo de firmantes"
                    :options="apoderadoFacultadStore.grupoFirmantesOptions"
                    :schema="selectGrupoFirmantesSchema"
                  />
                </div>
              </div>
              <!-- Solo mostrar el botón de eliminar si hay más de un firmante -->
              <!-- Una firma conjunta necesita al menos un firmante -->
              <BaseButton
                v-if="limite.firmantes.length > 1"
                type="button"
                variant="ghost"
                class="w-4 h-4"
                @click="eliminarFirmante(limite.id, firmante.id)"
              >
                <component :is="X" class="w-4 h-4" />
              </BaseButton>
            </div>

            <ActionButton
              type="button"
              label="Agregar firmante"
              size="md"
              variant="ghost"
              icon="Plus"
              class="text-primary-600 hover:text-primary-700"
              @click="agregarFirmante(limite.id)"
            />
          </div>
        </div>

        <BaseButton
          class="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-800"
          type="button"
          variant="secondary_outline"
          @click="agregarLimite"
        >
          <component :is="Plus" class="size-4" />
          Agregar Regla
        </BaseButton>
      </div>
    </template>
  </SimpleCardDropDown>
</template>
