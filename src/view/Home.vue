<script>
import {
  itemListGetFetch,
  itemUpdateFetch,
  itemSetFetch,
  orderSetFetch,
  itemUpdateStock
} from "../api";
import { NO_ID } from "../util/enum";
import Edit from "../components/Edit.vue";
import UpdateItem from "../components/UpdateItem.vue";

export default {
  components: { Edit, UpdateItem },
  data() {
    return {
      itemList: [],
      orderAlertShow: false,
      updateAlertShow: false,
      orderSelectId: NO_ID,
      NO_ID
    };
  },
  created() {
    this.itemListGet();
  },
  computed: {
    orderSelectItem() {
      return this.itemList[this.orderSelectId];
    }
  },
  methods: {
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
    buyBtnClick(id) {
      this.orderAlertToggle(true);
      this.orderSelectId = id;
    },
    async orderAdd(order_data) {
      // new order
      await orderSetFetch(order_data);
      // calculate stock
      await itemUpdateStock(this.orderSelectId, order_data.count);

      this.orderAlertClose();
      this.itemListGet();
    },
    // update items
    updateAlertToggle(alert_show) {
      this.updateAlertShow = alert_show;
    },
    updateAlertClose() {
      this.updateAlertToggle(false);
      this.orderSelectId = NO_ID;
    },
    updateBtnClick(id) {
      this.updateAlertToggle(true);
      this.orderSelectId = id;
    },
    async itemDeleteClick() {
      await itemUpdateFetch(this.orderSelectId, { display: false });
      this.updateAlertClose();
      this.itemListGet();
    },
    async updateSave(data) {
      if (this.orderSelectId === NO_ID) {
        // new
        await itemSetFetch(data);
      } else {
        // update
        await itemUpdateFetch(this.orderSelectId, data);
      }
      this.updateAlertClose();
      this.itemListGet();
    }
  }
};
</script>

<template lang="pug">
header
  h1.title Product List
  button.btn-primary.add(@click="updateBtnClick(NO_ID)") ADD
ul 
  template(v-for="(id) in Object.keys(itemList)")
    li.item(v-if="itemList[id].display" :key="id")
      div.img-box
        img(:src="itemList[id].img") 
      div.m-y10-x20
        span {{itemList[id].name}}
      div.m-y10-x20
        span price/
        span {{itemList[id].price}}
      div.m-y10-x20 
        span stock/
        span {{itemList[id].stock}}
      div.m-20
        button.btn-primary(@click="buyBtnClick(itemList[id].id)") buy
        button.btn-primary(@click="updateBtnClick(itemList[id].id)") update
  Edit(v-if="orderAlertShow" :order="orderSelectItem" @cancel="orderAlertClose" @save="orderAdd")
  UpdateItem(v-if="updateAlertShow" :item="orderSelectItem" @cancel="updateAlertClose" @save="updateSave" @delete="itemDeleteClick")
</template>

<style lang="scss" scoped>
ul {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(3, 1fr);

  li {
    border-radius: 2px;
    box-shadow: 2px 2px 4px $color-shadow-200;
  }

  .img-box {
    padding-bottom: 60%;
  }
}

.item > div {
  display: flex;
  justify-content: space-between;
}
</style>
