<script setup lang="ts">
  import { Form } from "vee-validate";
  import { reactive, watch } from "vue";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import type { DirectorioFormUI } from "~/core/presentation/registros/sociedades/pasos/directorio/composables/useDirectorioFormSync";
  import { presidenteDirectorioSchema } from "~/core/presentation/registros/sociedades/pasos/directorio/schemas/directorio";
  import type { TypeOption } from "~/types/TypeOptions";
  import { EntityModeEnum } from "~/types/enums/EntityModeEnum";

  interface Props {
    form: DirectorioFormUI;
    presidenteOptions: TypeOption[];
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
    <CardTitle title="Presidente del Directorio" body="" />

    <Form
      class="flex flex-col gap-14 w-full"
      @submit="handleSubmit"
      @invalid-submit="handleInvalidSubmit"
    >
      <div class="flex justify-between gap-2 col-span-2">
        <div class="flex flex-col gap-2">
          <label for="preside-juntas" class="t-t2 font-secondary text-gray-800 font-bold">
            ¿El presidente del Directorio preside las juntas de accionistas?
          </label>
          <span class="t-b2 text-gray-500 font-secondary">
            Selecciona una de las dos opciones.
          </span>
        </div>
        <SimpleSwitchYesNo
          v-model="localForm.presideJuntas"
          label=""
          :is-disabled="mode === EntityModeEnum.RESUMEN"
        />
      </div>

      <div class="flex justify-between gap-2 col-span-2">
        <div class="flex flex-col gap-2">
          <label for="voto-dirimente" class="t-t2 font-secondary text-gray-800 font-bold">
            ¿El presidente del Directorio tiene voto dirimente?
          </label>
          <span class="t-b2 text-gray-500 font-secondary">
            Selecciona una de las dos opciones.
          </span>
        </div>
        <SimpleSwitchYesNo
          v-model="localForm.votoDirimente"
          label=""
          :is-disabled="mode === EntityModeEnum.RESUMEN"
        />
      </div>

      <div class="flex flex-col gap-2 w-1/2">
        <SelectInputZod
          v-model="localForm.presidenteDirectorio"
          :options="presidenteOptions"
          name="presidente-directorio"
          label="Presidente del Directorio"
          placeholder="Seleccionar"
          :schema="presidenteDirectorioSchema"
          :is-disabled="mode === EntityModeEnum.RESUMEN"
        />
        <span class="t-b2 text-gray-500 font-secondary">
          Este campo se habilita al registrar al menos un director titular.
        </span>
      </div>
    </Form>
  </SimpleCard>
</template>
