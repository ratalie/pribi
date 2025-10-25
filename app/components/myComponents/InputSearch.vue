<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { Input } from "@/components/ui/input";

interface Props {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
}
</script>
<template>

  <div class="relative w-full max-w-sm items-center overflow-hidden rounded-lg">
    <Input id="search" type="text" placeholder="Search..." class="pl-10" />
    <span
      class="absolute right-0 inset-y-0 flex items-center justify-center px-2 bg-gray-900 rounded-r-lg"
    >
      <Search class="size-6 text-muted-foreground" />
    </span>
  </div>
</template>
