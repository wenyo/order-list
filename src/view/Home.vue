<script>
import { itemListGetFetch } from "../api";
import Edit from "../components/Edit.vue";
import UpdateItem from "../components/UpdateItem.vue";

export default {
  components: { Edit, UpdateItem },
  data() {
    return {
      itemList: [],
      orderAlertShow: false,
      updateAlertShow: false,
      orderSelectId: "i002"
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
    imgToBase64(e) {
      const file = e.target.files[0];
      console.log(file);
      new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      }).then((r) => console.log(r));
    },
    itemListGet() {
      itemListGetFetch().then((rs) => {
        this.itemList = rs;
      });
    },
    orderAlertToggle(alert_show) {
      this.orderAlertShow = alert_show;
    },
    orderAlertClose() {
      this.orderAlertToggle(false);
      this.orderSelectId = "";
    },
    buyBtnClick(id) {
      this.orderAlertToggle(true);
      this.orderSelectId = id;
    },
    updateAlertToggle(alert_show) {
      this.updateAlertShow = alert_show;
    },
    updateAlertClose() {
      this.updateAlertToggle(false);
      this.orderSelectId = "";
    },
    updateBtnClick(id) {
      this.updateAlertToggle(true);
      this.orderSelectId = id;
    }
  }
};
</script>

<template lang="pug">
h1.title Product List
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
  Edit(v-if="orderAlertShow" :order="orderSelectItem" @cancel="orderAlertClose")
  UpdateItem(v-if="updateAlertShow" :order="orderSelectItem" @cancel="updateAlertClose")
</template>

<style lang="scss" scoped>
ul {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);

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
