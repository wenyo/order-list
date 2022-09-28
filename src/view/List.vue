<script>
import Header from "../components/Header.vue";
import { useRouter } from "vue-router";
import { mapState, mapMutations } from "vuex";
import {
  orderListGetByUidFetch,
  itemListGetFetch,
  orderUpdateFetch,
  itemUpdateStock
} from "../api";
import { NO_ID } from "../util/enum";
import Edit from "../components/Edit.vue";

export default {
  components: { Header, Edit },
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
      itemList: {},
      itemSelectId: NO_ID,
      orderSelectId: NO_ID,
      orderAlertShow: false
    };
  },
  created() {
    this.itemListGet();
    this.orderListGet();
  },
  computed: {
    ...mapState(["user"]),
    uid() {
      return this.user?.uid;
    },
    orderSelectItem() {
      console.log(this.orderSelectId);
      return this.orderList[this.orderSelectId];
    },
    itemSelectItem() {
      return this.itemList[this.itemSelectId];
    }
  },
  watch: {
    uid() {
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
    // order
    orderAlertToggle(alert_show) {
      this.orderAlertShow = alert_show;
    },
    orderAlertClose() {
      this.orderAlertToggle(false);
      this.orderSelectId = NO_ID;
    },
    orderClick(item_id, order_id) {
      this.orderAlertToggle(true);
      this.itemSelectId = item_id;
      this.orderSelectId = order_id;
    },
    orderListGet() {
      if (!this.uid) return;
      orderListGetByUidFetch(this.uid).then((rs) => {
        this.orderList = rs;
      });
    },
    async orderUpdate(new_order) {
      // check stock
      if (new_order.count) {
        let oldStock = 0;
        await itemByIdGetFetch(item_id).then(
          (order) => (oldStock = order.stock)
        );

        const allStock = oldStock + this.orderSelectItem.count;
        if (allStock - new_order.count < 0) return;
      }

      // order update
      await orderUpdateFetch(this.orderSelectId, new_order);

      // stock update
      if (new_order.count) {
        const stockAddCount = new_order.count - this.orderSelectItem.count;
        await itemUpdateStock(this.itemSelectId, stockAddCount);
      }

      this.orderAlertClose();
      this.orderListGet();
    },
    async orderDelete(id) {
      // delete order
      await orderUpdateFetch(id, { display: false });
      this.orderListGet();

      // update stock
      const deleteOrderCount = -parseInt(this.orderList[id].count);
      await itemUpdateStock(this.orderList[id].item_id, deleteOrderCount);
    },
    async orderDeleteClick() {
      await this.orderDelete(this.orderSelectId, { display: false });
      this.orderAlertClose();
    }
  }
};
</script>

<template lang="pug">
header
  h1.title ORDER List
ul
  li.title
    div.w-50 id
    div.w-200 order
    div.w-100 price
    div.w-100 count
    div.grow note
  template(v-for="(order, id) in orderList" :key="id")
    li.content(@click="orderClick(order.item_id, id)")
      div.w-50.shrink-0 {{`${order.id}`}}
      div.w-200.word-break.shrink-0 {{itemList[order.item_id].name}}
      div.w-100.shrink-0 {{itemList[order.item_id].price}}
      div.w-100.shrink-0 {{order.count}}
      div.grow.word-break {{order.note}}
      div.w-100.shrink-0
        button.btn-disable(@click.stop="orderDelete(order.id)" v-if="itemList[order.item_id].display") DELETE
Edit(v-if="orderAlertShow" :is-edit="itemSelectItem.display" :item="itemSelectItem" :order="orderSelectItem" @cancel="orderAlertClose" @save="orderUpdate" @delete="orderDeleteClick")
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
