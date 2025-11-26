<template>
  <SlotWrapper>
    <TitleH2
      title="Detalle de Remoción"
      subtitle="Registra los datos del gerente a remover y las razones que sustentan la decisión."
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
