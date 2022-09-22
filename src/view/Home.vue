<script>
import { itemListGetFetch } from "../api";
import Edit from "../components/Edit.vue";

export default {
  components: { Edit },
  data() {
    return {
      itemList: [],
      orderAlertShow: true,
      orderSelectId: "i002"
    };
  },
  created() {
    this.itemListGet();
  },
  computed: {
    orderSelectItem() {
      return this.itemList.find((item) => item.id === this.orderSelectId);
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
      console.log(1);
      this.orderAlertToggle(true);
      this.orderSelectId = id;
    }
  }
};
</script>

<template lang="pug">
h1.title Product List
ul 
  li(v-for="(item, key) in itemList" :key="key")
    div.img-box
      img(:src="item.img")
    div.m-y10-x20
      span {{item.name}}
    div.m-y10-x20
      span price/
      span {{item.price}}
    div.m-y10-x20 
      span stock/
      span {{item.stock}}
    div.m-20
      button.btn-primary(@click="buyBtnClick(item.id)") buy
      button.btn-primary update
  Edit(v-if="orderAlertShow" :order="orderSelectItem" @cancel="orderAlertClose")
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
