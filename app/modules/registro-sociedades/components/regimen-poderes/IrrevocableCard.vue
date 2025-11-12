<script setup lang="ts">
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import OptionButton from "~/components/base/buttons/OptionButton.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
  import { TiemposVigenciaEnum } from "~/types/enums/TiemposVigenciaEnum";
  import { fechaFinSchema, fechaInicioSchema } from "../../schemas/FacultadApoderado";
  import { useApoderadoFacultadStore } from "../../stores/modal/useApoderadoFacultadStore";

  const apoderadoFacultadStore = useApoderadoFacultadStore();
</script>

<template>
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
          <span class="t-t2 font-secondary text-gray-800 font-bold">Vigencia del cargo</span>

          <div class="grid grid-cols-2 gap-4">
            <OptionButton
              label="Tiempo indefinido"
              :selected="apoderadoFacultadStore.vigencia === TiemposVigenciaEnum.INDEFINIDO"
              @click="apoderadoFacultadStore.vigencia = TiemposVigenciaEnum.INDEFINIDO"
            />
          </div>
        </div>
      </div>
    </template>
  </SimpleCardDropDown>
</template>
