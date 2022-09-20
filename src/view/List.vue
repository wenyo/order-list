<script>
import Header from "../components/Header.vue";
import { useRouter } from "vue-router";
import { mapState, mapMutations } from "vuex";

export default {
  components: { Header },
  setup() {
    console.log("List setup");

    const router = useRouter();

    function toAddPage() {
      router.push("/add");
    }

    return {
      toAddPage
    };
  },
  beforeCreate() {
    console.log("List beforeCreate");
  },
  created() {
    console.log("List created");
  },
  beforeMount() {
    console.log("List beforeMount");
  },
  mounted() {
    console.log("List mounted");
  },
  beforeUpdate() {
    console.log("List beforeUpdate");
  },
  updated() {
    console.log("List updated");
  },
  beforeUnmount() {
    console.log("List beforeUnmount");
  },
  unmounted() {
    console.log("List unmounted");
  },
  computed: {
    ...mapState(["orderList"])
  },
  methods: {
    ...mapMutations(["orderDelete"])
  }
};
</script>

<template lang="pug">
Header(@add="toAddPage")
ul
  li.title
    div.w-50 id
    div.w-200 order
    div.w-100 price
    div.w-100 count
    div.grow note
  template(v-for="(order, key) in orderList")
    router-link(:to="`/list/${order.id}`" custom v-slot="{ navigate }" v-if="order.display")
      li.content(@click="navigate" :key="key")
        div.w-50.shrink-0 {{`#${order.id}`}}
        div.w-200.word-break.shrink-0 {{order.name}}
        div.w-100.shrink-0 {{order.price}}
        div.w-100.shrink-0 {{order.count}}
        div.grow.word-break {{order.note}}
        div.w-100.shrink-0
          button.btn-disable(@click.stop="orderDelete({id:order.id})") DELETE
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

.btn-disable {
  font-size: 12px;
}
</style>
