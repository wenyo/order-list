<script setup></script>

<template lang="pug">
main
  router-view
</template>

<style lang="scss">
body{
  background-color: $color-dark-200;
  display: flex;
  justify-content: center;
}

main {
  min-height: 100vh;
  max-width: 1028px;
  min-width: 900px;
  width: 80vw;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
</style>
