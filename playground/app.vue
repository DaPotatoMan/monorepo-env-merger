<script lang="ts" setup>
const env = import.meta.env
</script>

<template>
  <div>
    {{ $config.key }}
    {{ $config.public.key }}
    {{ env }}
  </div>
</template>
