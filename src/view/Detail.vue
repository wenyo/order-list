<script>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mapGetters, useStore } from "vuex";

export default {
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
.edit
  div
    span {{`#${order.id}`}}
  label
    span.w-100 order/
    input( type="text" :value="order.name" )
  label
    span.w-100 price/
    input( type="number" :value="order.price" )
  label
    span.w-100 count/
    input( type="number" :value="order.count" )
  label
    span.w-100 note/
    textarea( type="text" :value="order.note" )
  label
    span.w-100 delete/
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
}

input {
  margin: 10px 0;
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
