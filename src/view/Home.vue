<script>
import {
  itemListGetFetch,
  itemUpdateFetch,
  itemLastIdGetFetch,
  itemSetFetch
} from "../api";
import { ORDER_TEMP, NO_ID } from "../util/enum";
import { nextIdGet } from "../util/function";
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
    orderDataGet(order_data) {
      let orderData = ORDER_TEMP();
      let newId = "";

      // id
      // orderListGetFetch().then((r) => {});

      orderData = {
        ...order_data,
        item_id: this.orderSelectId
        // user_id: this.uid
      };

      return orderData;
    },
    orderAdd(order_data) {
      const orderData = this.orderDataGet(order_data);
      console.log(orderData);
      // 建立訂單
      // 扣除庫存
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
    async updateSave(data) {
      if (this.orderSelectId === NO_ID) {
        await itemSetFetch(data);
      } else {
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
  li(v-for="(id) in Object.keys(itemList)" :key="id")
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
  UpdateItem(v-if="updateAlertShow" :order="orderSelectItem" @cancel="updateAlertClose" @save="updateSave")
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

  div {
    display: flex;
    justify-content: space-between;
  }
}
</style>
