<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import OptionButton from "~/components/base/buttons/OptionButton.vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import type { BaseSelectOption } from "~/components/base/inputs/text/BaseInputSelect.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import { TiemposVigenciaEnum } from "~/types/enums/TiemposVigenciaEnum";
  import {
    fechaFinSchema,
    fechaInicioSchema,
    selectFacultadSchema,
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
              :checked="apoderadoFacultadStore.showReglasFirmas"
              @update:checked="apoderadoFacultadStore.showReglasFirmas = $event"
            />
          </div>
        </template>
        <template v-if="apoderadoFacultadStore.showReglasFirmas" #content>
          <div class="py-12 px-10">
            <p>El tipo de firma es la forma en que se firmará el acuerdo.</p>
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
