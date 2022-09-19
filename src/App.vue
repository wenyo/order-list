<script setup>

</script>

<template lang="pug">
main
  header 
    h1 ORDER LIST
    button.btn-primary.add ADD
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

header{
  display: flex;
  justify-content: space-between;
}

h1 {
  font-weight: bold;
  color: $color-primary-400;
  font-size: 35px;
  margin-bottom: 10px;
}

.add{
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
