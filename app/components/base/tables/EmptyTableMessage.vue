<script setup lang="ts">
  import SadFaceLogo from "@/assets/icons/sad-face-logo.svg";
</script>

<template>
  <div
    class="flex items-center justify-center gap-3 text-gray-700 font-secondary t-t2 font-medium dark:text-gray-900"
  >
    <NuxtImg
      :src="SadFaceLogo"
      alt="No content available"
      class="object-cover w-5 h-5"
      loading="lazy"
    />
    <p>No hay contenidos en esta lista</p>
  </div>
</template>
