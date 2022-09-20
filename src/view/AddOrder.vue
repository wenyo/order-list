<script>
import Edit from "../components/Edit.vue";
import { useRouter } from "vue-router";
import { ORDER_TEMP } from "../util/enum";
import { mapMutations } from "vuex";

export default {
  components: { Edit },
  setup() {
    const router = useRouter();

    function backList() {
      router.push("/list");
    }

    return {
      backList
    };
  },
  data() {
    return {
      order: ORDER_TEMP()
    };
  },
  methods: {
    ...mapMutations(["orderAdd"]),
    newOrderSave() {
      this.orderAdd({ new_order: this.order });
      this.backList();
    }
  }
};
</script>

<template lang="pug">
Edit(@save="newOrderSave" @cancel="backList" :order="order")
</template>
