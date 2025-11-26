<template>
  <SlotWrapper>
    <TitleH2
      title="Acreedores"
      subtitle="Identifica a los acreedores cuyos créditos serán capitalizados."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: "default",
  });
</script>
