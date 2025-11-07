<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { X } from "lucide-vue-next";
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import BaseButton from "~/components/base/buttons/BaseButton.vue";
  import OptionButton from "~/components/base/buttons/OptionButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import NumberInputZod from "~/components/base/inputs/number/ui/NumberInputZod.vue";
  import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { TiemposVigenciaEnum } from "~/types/enums/TiemposVigenciaEnum";
  import { TipoMontoEnum } from "~/types/enums/TipoMontoEnum";
  import {
    fechaFinSchema,
    fechaInicioSchema,
    montoDesdeSchema,
    montoHastaSchema,
    selectCantidadFirmantesSchema,
    selectFacultadSchema,
    selectGrupoFirmantesSchema,
    selectMonedaSchema,
    selectTipoFirmaSchema,
    selectTipoMontoSchema,
  } from "../../schemas/FacultadApoderado";
  import { useApoderadoFacultadStore } from "../../stores/modal/useApoderadoFacultadStore";

  interface Props {
    modelValue: boolean;
    mode: "crear" | "editar";
    listaFacultadesOptions: BaseSelectOption[];
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close" | "submit"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const apoderadoFacultadStore = useApoderadoFacultadStore();

  const handleSubmit = () => {
    emits("submit");
  };

  const handleCancel = () => {
    emits("close");
    modelValue.value = false;
  };

  const handleInvalidSubmit = () => {
    //colocar logica de error, mostrar un toast
    console.log("Formulario inválido");
  };
</script>

<template>
  <BaseModal
    v-model="modelValue"
    size="lg"
    @close="handleCancel"
    @submit="handleSubmit"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col gap-10">
      <CardTitle
        title="Asignar Facultad"
        body="Selecciona una facultad y define el tipo de firma."
      />

      <div class="grid grid-cols-2 gap-10">
        <SelectInputZod
          v-model="apoderadoFacultadStore.tipoFacultad"
          name="facultad"
          label="Tipo de facultad"
          placeholder="Selecciona una facultad"
          :options="listaFacultadesOptions"
          :schema="selectFacultadSchema"
        />
      </div>

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
          <div class="p-5 flex flex-col gap-10">
            <div class="grid grid-cols-2 gap-10">
              <SelectInputZod
                v-model="apoderadoFacultadStore.tipoFacultad"
                name="moneda"
                label="Tipo de Moneda"
                placeholder="Selecciona una moneda"
                :options="apoderadoFacultadStore.monedaOptions"
                :schema="selectMonedaSchema"
              />
            </div>

            <div class="flex flex-col gap-4 border p-4 rounded-md bg-gray-25">
              <div class="flex justify-center items-center gap-2">
                <span class="t-t2 font-secondary text-gray-700 font-medium">De</span>
                <NumberInputZod
                  v-model="apoderadoFacultadStore.desde"
                  name="desde"
                  placeholder="Ingrese el monto desde"
                  currency="PEN"
                  format="decimal"
                  :schema="montoDesdeSchema"
                />
                <span class="t-t2 font-secondary text-gray-700 font-medium">Hasta</span>

                <!-- Si el tipo de monto es monto, mostrar el select y el input -->
                <template v-if="apoderadoFacultadStore.tipoMonto === TipoMontoEnum.MONTO">
                  <SelectInputZod
                    v-model="apoderadoFacultadStore.tipoMonto"
                    name="tipo-monto"
                    placeholder="Selecciona un tipo de monto"
                    :options="apoderadoFacultadStore.tipoMontoOptions"
                    :schema="selectTipoMontoSchema"
                  />
                  <NumberInputZod
                    v-model="apoderadoFacultadStore.hasta"
                    name="hasta"
                    placeholder="Ingrese el monto hasta"
                    currency="PEN"
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
                      @click="apoderadoFacultadStore.tipoMonto = TipoMontoEnum.MONTO"
                    >
                      <X :size="18" />
                    </button>
                  </div>
                </template>

                <span class="t-t2 font-secondary text-gray-700 font-medium">es</span>
                <SelectInputZod
                  v-model="apoderadoFacultadStore.tipoFirma"
                  name="tipo-firma"
                  placeholder="Selecciona un tipo de firma"
                  :options="apoderadoFacultadStore.tipoFirmaOptions"
                  :schema="selectTipoFirmaSchema"
                />
              </div>

              <!-- Firmantes -->
              <div class="flex flex-col gap-3 px-6">
                <div class="flex items-center gap-4">
                  <div class="flex justify-center items-center gap-4 border p-4 rounded-md">
                    <span class="t-t2 font-secondary text-gray-700 font-medium">con</span>
                    <div>
                      <SelectInputZod
                        v-model="apoderadoFacultadStore.cantidad"
                        name="cantidad-firmantes"
                        placeholder="0"
                        :options="apoderadoFacultadStore.cantidadFirmantesOptions"
                        :schema="selectCantidadFirmantesSchema"
                      />
                    </div>

                    <span class="t-t2 font-secondary text-gray-700 font-medium">
                      integrante(s) de
                    </span>
                    <div>
                      <SelectInputZod
                        v-model="apoderadoFacultadStore.grupo"
                        name="grupo-firmantes"
                        placeholder="Selecciona el grupo de firmantes"
                        :options="apoderadoFacultadStore.grupoFirmantesOptions"
                        :schema="selectGrupoFirmantesSchema"
                      />
                    </div>
                  </div>
                  <BaseButton type="button" variant="ghost" class="w-4 h-4" @click="() => {}">
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
                />
              </div>
            </div>
          </div>
        </template>
      </SimpleCardDropDown>

      <!-- ¿Este poder es irrevocable? -->
      <SimpleCardDropDown>
        <template #title>
          <div class="flex justify-between gap-2 p-5">
            <div class="flex flex-col gap-2">
              <span class="t-t1 text-gray-800 font-bold font-secondary">
                ¿Este poder es irrevocable?
              </span>
              <span class="t-t1 text-gray-500 font-normal font-primary">
                Esta opción puede activarse o desactivarse según corresponda.
              </span>
            </div>

            <CustomSwitch
              :checked="apoderadoFacultadStore.esIrrevocable"
              @update:checked="apoderadoFacultadStore.esIrrevocable = $event"
            />
          </div>
        </template>
        <template #content>
          <!-- Fecha de inicio y fin -->
          <div v-if="apoderadoFacultadStore.esIrrevocable" class="px-5 py-8">
            <div class="grid grid-cols-2 gap-4">
              <DateInputZod
                v-model="apoderadoFacultadStore.fechaInicio"
                name="fecha-inicio"
                label="Fecha de inicio"
                placeholder="Ingrese la fecha de inicio"
                :schema="fechaInicioSchema"
              />

              <DateInputZod
                v-model="apoderadoFacultadStore.fechaFin"
                name="fecha-fin"
                label="Fecha de fin"
                placeholder="Ingrese la fecha de fin"
                :schema="fechaFinSchema"
              />
            </div>
          </div>

          <!-- Vigencia del cargo -->
          <div v-else class="px-5 py-8">
            <div class="flex flex-col gap-5">
              <span class="t-t2 font-secondary text-gray-800 font-bold">
                Vigencia del cargo
              </span>

              <div class="grid grid-cols-2 gap-4">
                <OptionButton
                  label="Tiempo indefinido"
                  :selected="
                    apoderadoFacultadStore.vigencia === TiemposVigenciaEnum.INDEFINIDO
                  "
                  @click="apoderadoFacultadStore.vigencia = TiemposVigenciaEnum.INDEFINIDO"
                />
              </div>
            </div>
          </div>
        </template>
      </SimpleCardDropDown>
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleCancel"
        />

        <ActionButton
          type="submit"
          variant="primary"
          :label="mode === 'crear' ? 'Guardar' : 'Editar'"
          size="md"
        />
      </div>
    </template>
  </BaseModal>
</template>
