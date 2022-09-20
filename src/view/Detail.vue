<script>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mapGetters, useStore, mapMutations } from "vuex";
import Header from "../components/Header.vue";

export default {
  components: { Header },
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
    ...mapMutations(["orderSave", "orderDelete"]),
    saveClick() {
      this.orderSave({ new_order: this.orderInput });
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
Header(:id="id")
.edit
  label
    span.w-80 order/
    input( type="text" v-model="orderInput.name" )
  label
    span.w-80 price/
    input( type="number" v-model="orderInput.price" )
  label
    span.w-80 count/
    input( type="number" v-model="orderInput.count" )
  label
    span.w-80 note/
    textarea.note-input( type="text" v-model="orderInput.note" )
  .delete
    span.w-80 delete/
    button.btn-disable()(@click="deleteClick") DELETE
  .btn-block
    button.btn-primary(@click="saveClick") SAVE
    button.btn-secondary(@click="backList") CANCEL
</template>

<style lang="scss" scoped>
.edit {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

label,
.delete {
  margin: 8px 0;
  width: fit-content;
  display: flex;
  align-items: center;
  margin: 10px 0;

  span {
    display: inline-block;
  }
}

.note-input {
  display: block;
}

.btn-block {
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
  & > :not(:last-child) {
    margin-right: 20px;
  }
}
</style>
