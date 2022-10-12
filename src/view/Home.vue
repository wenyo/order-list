<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import { NO_ID, USER_TYPE } from '../util/enum';
import Edit from '../components/Edit.vue';
import UpdateItem from '../components/UpdateItem.vue';

export default {
  components: { Edit, UpdateItem },
  data() {
    return {
      itemList: [],
      orderAlertShow: false,
      updateAlertShow: false,
      orderSelectId: NO_ID,
      NO_ID,
    };
  },
  async created() {
    await this.itemLisSet();
  },
  computed: {
    ...mapState(['userType']),
    itemSelectItem() {
      return this.itemList[this.orderSelectId];
    },
    isAdmin() {
      return this.userType === USER_TYPE.ADMIN;
    },
  },
  methods: {
    ...mapMutations(['loadingOpen', 'loadingClose']),
    ...mapActions(['itemListGet', 'orderInfoSet']),
    async itemLisSet() {
      this.loadingOpen();
      return await this.itemListGet().then((rs) => {
        this.itemList = rs;
        this.loadingClose();
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
    buyBtnClick(id) {
      this.orderAlertToggle(true);
      this.orderSelectId = id;
    },
    async orderAdd(orderNewData) {
      // new order
      this.orderAlertClose();
      await this.orderInfoSet({ orderNewData });
      await this.itemLisSet();
    },
    // items
    updateAlertToggle(alertShow) {
      this.updateAlertShow = alertShow;
    },
    async updateAlertClose() {
      this.updateAlertToggle(false);
      this.orderSelectId = NO_ID;
      await this.itemLisSet();
    },
    updateBtnClick(id) {
      this.updateAlertToggle(true);
      this.orderSelectId = id;
    },
  },
};
</script>

<template lang="pug">
header
  h1.title Product List
  button.btn-primary.add(v-if="isAdmin" @click="updateBtnClick(NO_ID)") ADD
ul(:class="{'is-admin': isAdmin}")
  template(v-for="(id) in Object.keys(itemList)" :key="id")
    li.item(v-if="isAdmin || itemList[id].display " :data-id="id" :class="{'sold-out annotation': itemList[id].stock<=0, 'delete-item':!itemList[id].display }")
      div.img-box.annotation
        img(:src="itemList[id].img") 
      div.m-y10-x20.bold
        span {{itemList[id].name}}
      div.m-y10-x20
        span price/
        span {{itemList[id].price}}
      div.m-y10-x20.stock
        span stock/
        span.stock-data {{itemList[id].stock}}
      div.m-20.btn-block
        button.update.btn-primary(v-if="isAdmin" @click="updateBtnClick(itemList[id].id)") update
        button.buy.btn-primary(v-else-if="itemList[id].stock>0" @click="buyBtnClick(itemList[id].id)") buy
  Edit(v-if="!isAdmin && orderAlertShow" :item="itemSelectItem" @cancel="orderAlertClose" @save="orderAdd")
  UpdateItem(v-if="isAdmin && updateAlertShow" :item="itemSelectItem" @close-alert="updateAlertClose" )
</template>

<style lang="scss" scoped>
ul {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);

  @include desktop {
    grid-template-columns: repeat(3, 1fr);
  }
  @include pad {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mobile {
    grid-template-columns: repeat(1, 1fr);
  }

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
  content: 'SOLD OUT';
}

.delete-item {
  opacity: 0.5;

  .annotation::after {
    content: 'DELETED';
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
