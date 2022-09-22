<script>
import { itemListGetFetch } from "../api";

export default {
  data() {
    return {
      itemList: []
    };
  },
  created() {
    this.itemListGet();
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
    }
  }
};
</script>

<template lang="pug">
h1.title Product List
ul 
  li(v-for="(item,key) in itemList" :key="key")
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
      button.btn-primary buy
      button.btn-primary update
</template>

<style lang="scss" scoped>
ul {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);

  li {
    box-shadow: 2px 2px 4px $color-shadow-200;
  }

  .img-box {
    position: relative;
    width: 100%;
    padding-bottom: 60%;
    overflow: hidden;

    img {
      position: absolute;
      min-width: 100%;
      min-height: 100%;
      top: 0;
      left: 0;
    }
  }

  div {
    display: flex;
    justify-content: space-between;
  }
}
</style>
