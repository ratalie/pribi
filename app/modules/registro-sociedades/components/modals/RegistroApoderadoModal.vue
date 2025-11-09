<script setup lang="ts">
  import { useVModel } from "@vueuse/core";
  import { computed } from "vue";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import CardTitle from "~/components/base/cards/CardTitle.vue";
  import SimpleCardDropDown from "~/components/base/cards/SimpleCardDropDown.vue";
  import SelectInputZod from "~/components/base/inputs/text/ui/SelectInputZod.vue";
  import BaseModal from "~/components/base/modal/BaseModal.vue";
  import CustomSwitch from "~/components/base/Switch/CustomSwitch.vue";
  import LabeledCardSwitch from "~/components/base/Switch/LabeledCardSwitch.vue";
  import SimpleSwitchYesNo from "~/components/base/Switch/SimpleSwitchYesNo.vue";
  import PersonaJuridicaExtranjeraForm from "~/components/composite/forms/PersonaJuridicaExtranjeraForm.vue";
  import PersonaJuridicaForm from "~/components/composite/forms/PersonaJuridicaForm.vue";
  import PersonaNaturalForm from "~/components/composite/forms/PersonaNaturalForm.vue";
  import { tipoAccionistaSchema } from "~/modules/registro-sociedades/schemas/modalAccionistas";
  import { usePersonaNaturalStore } from "~/stores/usePersonaNaturalStore";
  import { useRegistroApoderadoModalStore } from "../../stores/modal/useRegistroApoderadoModalStore";
  import { useRegistroApoderadosStore } from "../../stores/useRegistroApoderadosStore";

  interface Props {
    modelValue?: boolean;
  }

  const props = defineProps<Props>();

  const emits = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
    (e: "close" | "submit"): void;
  }>();

  const modelValue = useVModel(props, "modelValue", emits, {
    passive: true,
  });

  const personaNaturalStore = usePersonaNaturalStore();
  const registroApoderadosStore = useRegistroApoderadosStore();
  const registroApoderadoModalStore = useRegistroApoderadoModalStore();

  const claseApoderadoOptions = computed(() => registroApoderadosStore.clasesApoderadoOptions);
  const personaOptions = [
    {
      value: "natural",
      label: "Persona Natural",
      description: "",
    },
    {
      value: "juridica",
      label: "Persona Jurídica",
      description: "",
    },
  ];

  const handleCancel = () => {
    emits("close");
    modelValue.value = false;

    personaNaturalStore.$reset();
    registroApoderadoModalStore.$reset();
  };

  const handleSave = async () => {
    emits("submit");
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
    @submit="handleSave"
    @invalid-submit="handleInvalidSubmit"
  >
    <div class="flex flex-col gap-12">
      <CardTitle title="Registrar Apoderado" body="Asigna a una persona como apoderado.">
        <template #actions>
          <div class="w-[440px]">
            <SelectInputZod
              v-model="registroApoderadoModalStore.tipoApoderado"
              name="tipo_apoderado"
              label="Tipo de Apoderado"
              placeholder="Selecciona un tipo"
              :options="claseApoderadoOptions"
              :schema="tipoAccionistaSchema"
            />
          </div>
        </template>
      </CardTitle>
      <LabeledCardSwitch
        v-model="registroApoderadoModalStore.tipoPersona"
        label="Tipo de persona"
        sub-label="Selecciona una de las dos opciones."
        :options="personaOptions"
        :columns="2"
        default-value="natural"
      />
      <PersonaNaturalForm
        v-if="registroApoderadoModalStore.tipoPersona === 'natural'"
        :show-estado-civil="false"
      />
      <SimpleCardDropDown v-if="registroApoderadoModalStore.tipoPersona === 'juridica'">
        <template #title>
          <div class="flex justify-between gap-2 py-4 px-8">
            <span class="t-t2 text-gray-800 font-bold font-secondary">
              La empresa se constituyo en Perú
            </span>
            <SimpleSwitchYesNo
              v-model="registroApoderadoModalStore.esEmpresaConstituidaEnPeru"
            />
          </div>
        </template>
        <!-- v-if="showEstatutosSociales" -->
        <template #content>
          <div class="p-8">
            <PersonaJuridicaForm
              v-if="registroApoderadoModalStore.esEmpresaConstituidaEnPeru"
            />
            <PersonaJuridicaExtranjeraForm v-else />
          </div>
        </template>
      </SimpleCardDropDown>

      <div class="flex flex-col gap-4">
        <span class="t-h5 text-gray-800 font-bold font-secondary">
          Registrar representante
        </span>
        <SimpleCardDropDown>
          <template #title>
            <div class="flex justify-between gap-2 py-4 px-8">
              <span class="t-t2 text-gray-800 font-bold font-secondary">
                Registrar representante en la sociedad
              </span>
              <!-- <SimpleSwitchYesNo v-model="isEmpresaConstituidaEnPeru" /> -->
              <CustomSwitch
                :checked="registroApoderadoModalStore.tieneRepresentante"
                @update:checked="registroApoderadoModalStore.tieneRepresentante = $event"
              />
            </div>
          </template>
          <!-- v-if="showEstatutosSociales" -->
          <template v-if="registroApoderadoModalStore.tieneRepresentante" #content>
            <div class="p-8">
              <PersonaNaturalForm />
            </div>
          </template>
        </SimpleCardDropDown>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-center gap-3 w-full px-14">
        <ActionButton
          variant="primary_outline"
          label="Cancelar"
          size="md"
          @click="handleCancel"
        />

        <ActionButton type="submit" variant="primary" label="Guardar" size="md" />
      </div>
    </template>
  </BaseModal>
</template>
