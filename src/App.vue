<script setup></script>

<template lang="pug">
main
  router-view
</template>

<style lang="scss" scoped>
main {
  background-color: $color-dark-200;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
</style>
