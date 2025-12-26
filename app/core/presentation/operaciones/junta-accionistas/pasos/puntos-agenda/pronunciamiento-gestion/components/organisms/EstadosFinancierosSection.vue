<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <p class="t-h5 text-gray-800 font-primary">Estados Financieros</p>
      <ActionButton
        label="Agregar otro estado financiero"
        variant="secondary"
        icon="Plus"
        icon-position="left"
        class="py-[16px] px-[24px]"
        @click="$emit('open-modal')"
      />
    </div>

    <SimpleCard>
      <div class="flex flex-col gap-6">
        <EstadoFinancieroCard
          v-for="estado in store.estadosFinancieros"
          :key="estado.id"
          :estado="estado"
          :society-id="societyId"
          @toggle="store.toggleEstadoFinanciero"
          @delete="store.deleteEstadoFinanciero"
          @file-uploaded="store.addArchivoEstadoFinanciero"
          @file-removed="store.removeArchivoEstadoFinanciero"
        />
      </div>
    </SimpleCard>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import ActionButton from "~/components/base/buttons/composite/ActionButton.vue";
  import SimpleCard from "~/components/base/cards/SimpleCard.vue";
  import { usePronunciamientoStore } from "../../stores/usePronunciamientoStore";
  import EstadoFinancieroCard from "../molecules/EstadoFinancieroCard.vue";

  const route = useRoute();
  const store = usePronunciamientoStore();

  // Obtener societyId de la ruta
  const societyId = computed(() => {
    const param = route.params.societyId;
    if (typeof param === "string") return param;
    if (Array.isArray(param) && param.length > 0 && typeof param[0] === "string") {
      return param[0];
    }
    return "";
  });

  defineEmits<{
    "open-modal": [];
  }>();
</script>


