<script>
import Header from "../components/Header.vue";
import { mapState } from "vuex";

export default {
  components: { Header },
  computed: {
    ...mapState(["orderList"])
  },
  mounted() {
    console.log(this.orderList);
  }
};
</script>

<template lang="pug">
Header
ul
  li.title
    div.w-50 id
    div.w-200 item
    div.w-100 price
    div.w-100 count
    div.grow note
  template(v-for="item in orderList")
    router-link(:to="`/list/${item.id}`" custom v-slot="{ navigate }" )
      li.content(@click="navigate")
        div.w-50 {{`#${item.id}`}}
        div.w-200 {{item.name}}
        div.w-100 {{item.price}}
        div.w-100 {{item.count}}
        div.grow {{item.note}}
</template>

<style lang="scss" scoped>
ul {
  li {
    display: flex;
  }

  .title > div {
    background-color: $color-dark-300;
    text-align: left;
    padding: 5px 10px;
  }

  .content {
    border: 1px solid $color-dark-300;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      box-shadow: 2px 2px 10px $color-dark-300;
    }

    div {
      padding: 20px 10px;
    }
  }
}
</style>
