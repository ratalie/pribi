<template>
  <div class="flex flex-col gap-4">
    <p class="t-h5 font-semibold font-secondary text-gray-800">Acuerdo de los Accionistas</p>

    <!-- Checkbox de confirmación -->
    <div
      @click="isConfirmed = !isConfirmed"
      :class="[
        'flex items-center gap-3 cursor-pointer rounded-xl border-2 transition-all duration-200',
        'py-[30px] px-[20px]',
        isConfirmed ? 'border-primary-100 bg-primary-25' : 'border-gray-200 bg-white',
      ]"
    >
      <!-- Icono del checkbox -->
      <div class="shrink-0">
        <Icon
          v-if="isConfirmed"
          name="fluent:checkbox-checked-16-filled"
          size="20"
          class="text-primary-800"
        />
        <Icon v-else name="fluent:checkbox-unchecked-24-regular" size="20" />
      </div>

      <!-- Texto -->
      <p class="text-gray-700 t-2 font-secondary">
        Confirmo que todos los accionistas están de acuerdo con realizar el aumento de capital
        mediante Aportes Dinerarios por la suma de S/ 2,000.00 (Dos Mil y 00/100 Soles), con la
        emisión de 2,000 nuevas acciones con un valor nominal de S/ 1.00. (Un Sol).
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  const isConfirmed = ref(false);
</script>
