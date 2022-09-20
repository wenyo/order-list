<script>
export default {
  props: ["id"]
};
</script>

<template lang="pug">
header 
  h1.title ORDER {{id ? `#${id}` : 'LIST'}}
  button.btn-primary.add(v-if="!id") ADD
</template>

<style lang="scss" scoped>
header {
  display: flex;
  justify-content: space-between;
}

.title {
  font-weight: bold;
  color: $color-primary-400;
  font-size: 35px;
  margin-bottom: 10px;
}

.add {
  flex-grow: 0;
  flex-shrink: 0;
}
</style>
