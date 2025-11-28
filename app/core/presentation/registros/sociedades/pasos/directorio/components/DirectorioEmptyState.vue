<script setup lang="ts">
  import noDirectorioImage from "~/assets/img/no-directorio.jpeg";
</script>

<template>
  <div class="flex flex-col w-full h-full items-center justify-center self-center">
    <img :src="noDirectorioImage" alt="No directorio" class="w-52 h-40 object-contain mb-8" />
    <p class="t-t1 text-gray-600 font-primary text-center font-semibold mb-1">
      Este paso está desactivado
    </p>
    <p class="t-b2 text-gray-400 font-secondary text-center">
      Si decides incluir un Directorio, puedes activarlo en la parte superior.
    </p>
  </div>
</template>
