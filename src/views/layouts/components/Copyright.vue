<script setup lang="ts">
const year = new Date().getFullYear();
const author = 'thelastcookies';
const version = __APP_VERSION__;
</script>

<template>
  <div class="absolute w-full text-center p-2! bottom-0">
    <span class="text-sm text-gray-400">v{{ version }} · Copyright © {{ year }} {{ author }}. All rights reserved.</span>
  </div>
</template>
