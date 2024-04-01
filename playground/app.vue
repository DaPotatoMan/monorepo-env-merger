<script lang="ts" setup>
const env = import.meta.env
</script>

<template>
  <div>
    <template v-for="value, key in env" :key="key">
      {{ key }} = {{ value }}
    </template>
  </div>
</template>
