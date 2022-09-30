<script>
import { mapMutations, mapState } from "vuex";
import {
  itemListGetFetch,
  itemUpdateFetch,
  itemSetFetch,
  orderSetFetch,
  itemUpdateStock
} from "../api";
import { NO_ID, USER_TYPE } from "../util/enum";
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
  async created() {
    this.loadingOpen();
    await this.itemListGet();
    this.loadingClose();
  },
  computed: {
    ...mapState(["userType"]),
    itemSelectItem() {
      return this.itemList[this.orderSelectId];
    },
    isAdmin() {
      return this.userType === USER_TYPE.ADMIN;
    }
  },
  methods: {
    ...mapMutations(["loadingOpen", "loadingClose"]),
    async itemListGet() {
      return itemListGetFetch().then((rs) => {
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
      this.loadingOpen();
      // new order
      await orderSetFetch(order_data);
      // calculate stock
      await itemUpdateStock(this.orderSelectId, order_data.count);

      this.orderAlertClose();
      await this.itemListGet();
      this.loadingClose();
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
    async itemDisplayToggleClick(display) {
      this.loadingOpen();
      await itemUpdateFetch(this.orderSelectId, { display });
      this.updateAlertClose();
      await this.itemListGet();
      this.loadingClose();
    },
    async updateSave(data) {
      this.loadingOpen();
      if (this.orderSelectId === NO_ID) {
        // new
        await itemSetFetch(data);
      } else {
        // update
        await itemUpdateFetch(this.orderSelectId, data);
      }
      this.updateAlertClose();
      await this.itemListGet();
      this.loadingClose();
    }
  }
};
</script>

<template lang="pug">
header
  h1.title Product List
  button.btn-primary.add(v-if="isAdmin" @click="updateBtnClick(NO_ID)") ADD
ul(:class="{'is-admin': isAdmin}")
  template(v-for="(id) in Object.keys(itemList)" :key="id")
    li.item(v-if="isAdmin || itemList[id].display " :class="{'sold-out annotation': itemList[id].stock<=0, 'delete-item':!itemList[id].display }")
      div.img-box.annotation
        img(:src="itemList[id].img") 
      div.m-y10-x20.bold
        span {{itemList[id].name}}
      div.m-y10-x20
        span price/
        span {{itemList[id].price}}
      div.m-y10-x20.stock
        span stock/
        span {{itemList[id].stock}}
      div.m-20.btn-block
        button.btn-primary(v-if="isAdmin" @click="updateBtnClick(itemList[id].id)") update
        button.btn-primary(v-else-if="itemList[id].stock>0" @click="buyBtnClick(itemList[id].id)") buy
  Edit(v-if="!isAdmin && orderAlertShow" :item="itemSelectItem" @cancel="orderAlertClose" @save="orderAdd")
  UpdateItem(v-if="isAdmin && updateAlertShow" :item="itemSelectItem" @cancel="updateAlertClose" @save="updateSave" @delete="itemDisplayToggleClick(false)" @show="itemDisplayToggleClick(true)")
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

.is-admin {
  .sold-out .stock {
    color: $color-primary-100;
    font-weight: bold;
  }
}

ul:not(.is-admin) .sold-out::after {
  content: "SOLD OUT";
}

.delete-item {
  opacity: 0.5;

  .annotation::after {
    content: "DELETED";
  }
}

.item {
  & > div {
    display: flex;
    justify-content: space-between;
  }
  & > .btn-block {
    justify-content: flex-end;
  }
}
</style>
