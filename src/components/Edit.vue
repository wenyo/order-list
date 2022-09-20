<script>
import { NO_ID } from "../util/enum";
import Header from "./Header.vue";

export default {
  components: { Header },
  emits: ["delete", "save", "cancel"],
  props: {
    order: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      NO_ID
    };
  },
  methods: {
    delete() {
      this.$emit("delete");
    },
    save() {
      this.$emit("save");
    },
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>
<template lang="pug">
Header(:id="order.id")
.edit
  label
    span.w-80 order/
    input( type="text" v-model="order.name" )
  label
    span.w-80 price/
    input( type="number" v-model="order.price" )
  label
    span.w-80 count/
    input( type="number" v-model="order.count" )
  label
    span.w-80 note/
    textarea.note-input( type="text" v-model="order.note" )
  .delete(v-if="order.id !== NO_ID")
    span.w-80 delete/
    button.btn-disable()(@click="delete") DELETE
  .btn-block
    button.btn-primary(@click="save") SAVE
    button.btn-secondary(@click="cancel") CANCEL
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
