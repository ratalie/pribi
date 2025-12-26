<script setup lang="ts">
interface Props {
  message?: string;
  heightCustom?: string;
}

const props = withDefaults(defineProps<Props>(), {
  message: "Aún no has registrado información. No te preocupes, puedes hacerlo en cualquier momento.",
  heightCustom: "min-h-[200px]",
});
</script>

<template>
  <div
    :class="[
      'w-full py-6',
      heightCustom,
      'flex justify-center items-center gap-1',
      'bg-gray-50',
      'text-gray-600',
    ]"
  >
    <Icon name="line-md:emoji-frown" class="w-5 h-5" />
    <span class="font-medium text-t2">
      {{ message }}
    </span>
  </div>
</template>

