<script setup lang="ts">
  import { Form } from "vee-validate";
  import { reactive, watch } from "vue";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import SwitchTabs from "~/components/base/Switch/SwitchTabs.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import NumberInputStepper from "~/components/base/inputs/number/NumberInputStepper.vue";
  import DateInputZod from "~/components/base/inputs/text/ui/DateInputZod.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import Checkbox from "~/components/ui/checkbox/Checkbox.vue";
  import type { DirectorioFormUI } from "~/core/presentation/registros/sociedades/pasos/directorio/composables/useDirectorioFormSync";
  import {
    duracionDirectorioSchema,
    fechaFinDirectorioSchema,
    fechaInicioDirectorioSchema,
  } from "~/core/presentation/registros/sociedades/pasos/directorio/schemas/directorio";
  import type { TypeOption } from "~/types/TypeOptions";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  interface Props {
    form: DirectorioFormUI;
    termOptions: TypeOption[];
    mode: EntityModeEnum;
  }

  const props = defineProps<Props>();

  const emit = defineEmits<{
    "update:form": [value: DirectorioFormUI];
  }>();

  // Crear un objeto reactivo local que se sincroniza con el prop
  const localForm = reactive<DirectorioFormUI>({ ...props.form });

  // Sincronizar cuando el prop cambie desde el padre
  watch(
    () => props.form,
    (newForm) => {
      Object.assign(localForm, newForm);
    },
    { deep: true }
  );

  // Emitir cambios cuando localForm cambie
  watch(
    () => localForm,
    (newForm) => {
      emit("update:form", { ...newForm });
    },
    { deep: true }
  );

  const handleSubmit = () => {
    // El submit se maneja en el componente padre
  };

  const handleInvalidSubmit = (ctx: any) => {
    console.log("Errores en el formulario:", ctx.errors);
  };
</script>

<template>
  <SimpleCard>
    <CardTitle title="Configuracion del Directorio" body="" />

    <Form
      class="grid grid-cols-2 gap-14 w-full"
      @submit="handleSubmit"
      @invalid-submit="handleInvalidSubmit"
    >
      <!-- Primera columna: NumberInputStepper -->
      <div class="flex flex-col gap-2">
        <label for="cantidad-directores" class="t-t2 font-secondary text-gray-800 font-bold">
          Cantidad de directores
        </label>
        <NumberInputStepper
          id="cantidad-directores"
          v-model="localForm.cantidadDirectores"
          :min="3"
          :max="9"
          placeholder="3"
          size="large"
          :is-disabled="localForm.cantidadPersonalizado || mode === EntityModeEnum.RESUMEN"
        />
        <p class="t-t2 text-gray-500 font-secondary">Valor mínimo: {{ 2 }}.</p>
      </div>

      <!-- Segunda columna: Checkbox -->
      <div class="flex items-center gap-2">
        <Checkbox
          id="cantidad-personalizado"
          v-model="localForm.cantidadPersonalizado"
          :is-disabled="mode === EntityModeEnum.RESUMEN"
        />
        <label
          for="cantidad-personalizado"
          class="t-t2 font-secondary text-gray-800 font-medium cursor-pointer"
        >
          Definir cantidad personalizada
        </label>
      </div>

      <!-- Inputs condicionales cuando cantidadPersonalizado está activo -->
      <div v-if="localForm.cantidadPersonalizado" class="flex flex-col gap-2">
        <label
          for="cantidad-minima-directores"
          class="t-t2 font-secondary text-gray-800 font-bold"
        >
          Cantidad Mínima de directores
        </label>
        <NumberInputStepper
          id="cantidad-minima-directores"
          v-model="localForm.minimoDirectores"
          :min="3"
          :max="9"
          placeholder="3"
          size="large"
        />
        <p class="t-t2 text-gray-500 font-secondary">Valor mínimo: {{ 3 }}.</p>
      </div>

      <div v-if="localForm.cantidadPersonalizado" class="flex flex-col gap-2">
        <label
          for="cantidad-maxima-directores"
          class="t-t2 font-secondary text-gray-800 font-bold"
        >
          Cantidad Máxima de directores
        </label>
        <NumberInputStepper
          id="cantidad-maxima-directores"
          v-model="localForm.maximoDirectores"
          :min="3"
          :max="9"
          placeholder="3"
          size="large"
        />
      </div>

      <div class="flex gap-2">
        <SelectInputZod
          v-model="localForm.duracionDirectorio"
          :options="termOptions"
          name="duracion-directorio"
          label="Duración del Directorio"
          placeholder="Duración del Directorio"
          :schema="duracionDirectorioSchema"
        />
      </div>
      <div />
      <div class="flex gap-2">
        <DateInputZod
          v-model="localForm.fechaInicioDirectorio"
          name="fecha-inicio-directorio"
          label="Fecha de Inicio del Directorio"
          placeholder="Ingrese la fecha de inicio del directorio"
          :schema="fechaInicioDirectorioSchema"
        />
      </div>
      <div class="flex gap-2">
        <DateInputZod
          v-model="localForm.fechaFinDirectorio"
          name="fecha-fin-directorio"
          label="Fecha de Fin del Directorio"
          placeholder="Ingrese la fecha de fin del directorio"
          :schema="fechaFinDirectorioSchema"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="quorum-minimo" class="t-t2 font-secondary text-gray-800 font-bold">
          Quorum mínimo de asistencia
        </label>
        <NumberInputStepper
          id="quorum-minimo"
          v-model="localForm.quorumMinimo"
          :min="3"
          :max="100"
          placeholder="0"
          size="large"
        />
        <p class="t-t2 text-gray-500 font-secondary">
          Mínimo requerido: la mitad más uno de sus miembros.
        </p>
      </div>
      <div class="flex flex-col gap-2">
        <label for="quorum-mayoria" class="t-t2 font-secondary text-gray-800 font-bold">
          Mayoría para aprobar acuerdos
        </label>
        <NumberInputStepper
          id="quorum-mayoria"
          v-model="localForm.quorumMayoria"
          :min="3"
          :max="100"
          placeholder="0"
          size="large"
        />
        <p class="t-t2 text-gray-500 font-secondary">
          Mínimo requerido: la mitad más uno de los participantes.
        </p>
      </div>
      <div class="flex flex-col gap-2 col-span-2">
        <div class="flex flex-col gap-2">
          <label for="nombra-presidente" class="t-t2 font-secondary text-gray-800 font-bold">
            ¿Quién nombra al Presidente del Directorio?
          </label>
          <span class="t-b2 text-gray-500 font-secondary">
            Selecciona una de las dos opciones.
          </span>
        </div>
        <SwitchTabs
          v-model="localForm.nombraPresidente"
          opcion-a="El Directorio"
          opcion-b="La Asamblea de Accionistas"
          variant="default"
        />
      </div>
      <div class="flex flex-col gap-2 col-span-2">
        <div class="flex flex-col gap-2">
          <label for="ejerce-secretaria" class="t-t2 font-secondary text-gray-800 font-bold">
            ¿Quién ejercerá la secretaria de las juntas de accionistas?
          </label>
          <span class="t-b2 text-gray-500 font-secondary">
            Selecciona una de las dos opciones.
          </span>
        </div>
        <SwitchTabs
          v-model="localForm.ejerceSecretaria"
          opcion-a="El Gerente General"
          opcion-b="La Junta de Accionistas lo designa"
          variant="default"
        />
      </div>

      <div class="flex justify-between gap-2 col-span-2">
        <div class="flex flex-col gap-2">
          <label
            for="reeleccion-directores"
            class="t-t2 font-secondary text-gray-800 font-bold"
          >
            ¿Los directores pueden ser reelegidos?
          </label>
          <span class="t-b2 text-gray-500 font-secondary">
            Selecciona una de las dos opciones.
          </span>
        </div>
        <SimpleSwitchYesNo v-model="localForm.reeleccionDirectores" label="" />
      </div>
    </Form>
  </SimpleCard>
</template>
