<script>
import Header from "../components/Header.vue";
import { useRouter } from "vue-router";
import { mapState, mapMutations } from "vuex";
import { orderListGetByUidFetch, itemListGetFetch } from "../api";

export default {
  components: { Header },
  setup() {
    const router = useRouter();

    function toAddPage() {
      router.push("/add");
    }

    return {
      toAddPage
    };
  },
  data() {
    return {
      orderList: [],
      itemList: {}
    };
  },
  created() {
    this.itemListGet();
  },
  computed: {
    ...mapState(["user"]),
    uid() {
      return this.user?.uid;
    }
  },
  watch: {
    uid() {
      if (!this.uid) return;
      this.orderListGet();
    }
  },
  methods: {
    ...mapMutations(["orderDelete"]),
    itemListGet() {
      itemListGetFetch().then((rs) => {
        this.itemList = rs;
      });
    },
    orderListGet() {
      const uid = this.user.uid;
      orderListGetByUidFetch(uid).then((rs) => (this.orderList = rs));
    }
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
        div.w-200.word-break.shrink-0 {{itemList[order.item_id].name}}
        div.w-100.shrink-0 {{itemList[order.item_id].price}}
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
