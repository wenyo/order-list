<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { mapGetters, useStore } from "vuex";

export default {
  setup() {
    const route = useRoute();
    const id = computed(() => route.params.id);
    const store = useStore()
    const order = computed(() => store.getters.orderGetById(id.value));
    console.log(store.state.orderList[2]);
    return {
      id,
      order
    };
  },
  computed: {
    ...mapGetters(["orderGetById"])
  }
};
</script>

<template lang="pug">
.edit
    div
        span {{`#${order.id}`}}
    label
        span.w-50 order/
        input( type="text" :value="order.name" )
    label
        span.w-50 price/
        input( type="number" :value="order.price" )
    label
        span.w-50 count/
        input( type="number" :value="order.count" )
    label
        span.w-50 note/
        textarea( type="text" :value="order.note" )
</template>

<style lang="scss" scoped>

.edit{
    display: flex;
    flex-direction: column;
}

input{
    margin: 10px 0;
}
</style>
