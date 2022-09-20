<script>
import { NO_ID } from "../util/enum";
export default {
  props: ["id"],
  emit: ["add"],
  data() {
    return {
      NO_ID
    };
  },
  methods: {
    addClick() {
      this.$emit("add");
    }
  }
};
</script>

<template lang="pug">
header
  h1.title(v-if="id===NO_ID") NEW ORDER
  h1.title(v-else) ORDER {{id ? `#${id}` : 'LIST'}}
  button.btn-primary.add(v-if="!id" @click="addClick") ADD
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
