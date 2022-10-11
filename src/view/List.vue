<script>
import _ from 'lodash';
import Header from '../components/Header.vue';
import { mapState, mapMutations, mapActions } from 'vuex';
import { NO_ID } from '../util/enum';
import Edit from '../components/Edit.vue';

export default {
  components: { Header, Edit },
  data() {
    return {
      orderList: [],
      itemList: {},
      itemSelectId: NO_ID,
      orderSelectId: NO_ID,
      orderAlertShow: false,
    };
  },
  async created() {
    this.loadingOpen();
    await this.itemLisSet();
    await this.orderListGet();
    this.loadingClose();
  },
  computed: {
    ...mapState(['user']),
    uid() {
      return this.user?.uid;
    },
    orderSelectItem() {
      return this.orderList[this.orderSelectId];
    },
    itemSelectItem() {
      return this.itemList[this.itemSelectId];
    },
  },
  watch: {
    uid() {
      this.orderListGet();
    },
  },
  methods: {
    ...mapMutations(['loadingOpen', 'loadingClose']),
    ...mapActions([
      'itemListGet',
      'itemUpdateStock',
      'orderListGetByUid',
      'orderUpdate',
      'itemByIdGet',
    ]),
    async itemLisSet() {
      this.itemListGet().then((rs) => {
        this.itemList = rs;
      });
    },
    async orderListGet() {
      if (!this.uid) return;
      return this.orderListGetByUid({ uid: this.uid }).then((rs) => {
        this.orderList = rs;
      });
    },
    // order
    orderAlertToggle(alertShow) {
      this.orderAlertShow = alertShow;
    },
    orderAlertClose() {
      this.orderAlertToggle(false);
      this.orderSelectId = NO_ID;
    },
    orderClick(itemId, orderId) {
      this.orderAlertToggle(true);
      this.itemSelectId = itemId;
      this.orderSelectId = orderId;
    },
    async orderUpdateClick(newOrder) {
      this.loadingOpen();

      // check stock
      if (newOrder.count) {
        let oldStock = 0;
        await this.itemByIdGet({ id: this.itemSelectId }).then((order) => (oldStock = order.stock));

        const allStock = oldStock + this.orderSelectItem.count;
        if (allStock - newOrder.count < 0) return;
      }

      // order update
      await this.orderUpdate({ id: this.orderSelectId, newOrder });

      // stock update
      if (!!newOrder.count) {
        const stockMinusCount = newOrder.count - this.orderSelectItem.count;
        await this.itemUpdateStock({ id: this.itemSelectId, stockMinusCount });
      }

      this.orderAlertClose();
      await this.orderListGet();
      await this.itemLisSet();

      this.loadingClose();
    },
    async orderDelete(id) {
      this.loadingOpen();

      // delete order
      const stockMinusCount = -_.toInteger(this.orderList[id].count);
      const itemId = this.orderList[id].item_id;
      await this.orderUpdate({ id, newOrder: { display: false } });
      await this.orderListGet();
      await this.itemLisSet();

      // update stock
      await this.itemUpdateStock({ id: itemId, stockMinusCount });
      this.loadingClose();
    },
    async orderDeleteClick() {
      this.loadingOpen();
      await this.orderDelete(this.orderSelectId, { display: false });
      this.orderAlertClose();
      await this.orderListGet();
      await this.itemLisSet();

      this.loadingClose();
    },
  },
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
    li.content(:data-id="order.id" @click="orderClick(order.item_id, id)")
      div.w-50.shrink-0 {{`${order.id}`}}
      div.w-200.word-break.shrink-0 {{itemList[order.item_id].name}}
      div.w-100.shrink-0 {{itemList[order.item_id].price}}
      div.count.w-100.shrink-0 {{order.count}}
      div.note.grow.word-break {{order.note}}
      div.w-100.shrink-0
        button.btn-disable(@click.stop="orderDelete(order.id)" v-if="itemList[order.item_id].display") DELETE
Edit(v-if="orderAlertShow" :is-edit="itemSelectItem.display" :item="itemSelectItem" :order="orderSelectItem" @cancel="orderAlertClose" @save="orderUpdateClick" @delete="orderDeleteClick")
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
