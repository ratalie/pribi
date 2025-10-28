<script setup lang="ts">
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

  defineProps({
    opcionA: { type: String, required: true },
    opcionB: { type: String, required: true },
  });
</script>

<template>
  <Tabs default-value="opcion-a" class="w-full! rounded-full!">
    <TabsList class="w-full rounded-full h-[48px] p-[6px]">
      <TabsTrigger value="opcion-a" class="rounded-full">
        {{ opcionA }}
      </TabsTrigger>
      <TabsTrigger value="opcion-b" class="rounded-full">
        {{ opcionB }}
      </TabsTrigger>
    </TabsList>
    <TabsContent value="opcion-a">
      <slot name="opcion-a" />
    </TabsContent>
    <TabsContent value="opcion-b">
      <slot name="opcion-b" />
    </TabsContent>
  </Tabs>
</template>
