<script>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mapGetters, useStore } from "vuex";
import Header from "../components/Header.vue";

export default {
  components: { Header },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const id = computed(() => route.params.id);

    const idExist = computed(() => store.getters.orderExistCheck(id.value));
    if (!idExist) {
      router.push("/list");
    }

    const order = computed(() => store.getters.orderGetById(id.value));

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
Header(:id="id")
.edit
  label
    span.w-80 order/
    input( type="text" :value="order.name" )
  label
    span.w-80 price/
    input( type="number" :value="order.price" )
  label
    span.w-80 count/
    input( type="number" :value="order.count" )
  label
    span.w-80 note/
    textarea.note-input( type="text" :value="order.note" )
  label
    span.w-80 delete/
    button.btn-disable DELETE
  .btn-block
    button.btn-primary SAVE
    button.btn-secondary CANCEL

</template>

<style lang="scss" scoped>
.edit {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

label {
  margin: 8px 0;
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
