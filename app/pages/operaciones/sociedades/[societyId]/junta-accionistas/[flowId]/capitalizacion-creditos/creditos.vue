<template>
  <SlotWrapper>
    <TitleH2
      title="Créditos"
      subtitle="Detalla los créditos, montos y condiciones que serán aportados como capital."
    />
    <div class="flex flex-col gap-10">
      <BlankContainer />
    </div>
  </SlotWrapper>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: "registros",
    flowLayoutJuntas: true,
  });
</script>
