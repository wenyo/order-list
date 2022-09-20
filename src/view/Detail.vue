<script>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mapGetters, useStore, mapMutations } from "vuex";
import Edit from "../components/Edit.vue";

export default {
  components: { Edit },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const id = computed(() => route.params.id);

    function backList() {
      router.push("/list");
    }

    // check id exist
    const idExist = computed(() => store.getters.orderExistCheck(id.value));
    if (!idExist.value) {
      backList();
    }

    return {
      id,
      idExist,
      backList
    };
  },
  computed: {
    ...mapGetters(["orderGetById"]),
    orderInput() {
      if (!this.idExist) {
        return {};
      }
      const order = this.orderGetById(this.id);
      return JSON.parse(JSON.stringify(order));
    }
  },
  methods: {
    ...mapMutations(["orderEdit", "orderDelete"]),
    saveClick() {
      this.orderEdit({ new_order: this.orderInput });
      this.backList();
    },
    deleteClick() {
      this.orderDelete({ id: this.id });
      this.backList();
    }
  }
};
</script>

<template lang="pug">
Edit(@delete="deleteClick" @save="saveClick" @cancel="backList" :order="orderInput")
</template>
