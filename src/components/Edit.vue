<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { NO_ID, ERROR_MSG } from "../util/enum";
import Header from "./Header.vue";

export default {
  components: {
    Header,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage
  },
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
    deleteClick() {
      this.$emit("delete");
    },
    saveClick() {
      this.$emit("save");
    },
    cancel() {
      this.$emit("cancelClick");
    },
    isRequired(value) {
      if (!value) {
        return ERROR_MSG.IS_REQUIRED;
      }

      return true;
    },
    isPositiveInteger(value) {
      if (!value) {
        return ERROR_MSG.IS_REQUIRED;
      }

      if (value <= 0) {
        return ERROR_MSG.AT_LEAST_ONE;
      }

      return true;
    },
    isPositiveIntegerOrZero(value) {
      if (!value && value !== 0) {
        return ERROR_MSG.IS_REQUIRED;
      }

      if (value < 0) {
        return ERROR_MSG.AT_LEAST_ZERO;
      }

      return true;
    }
  }
};
</script>
<template lang="pug">
Header(:id="order.id")
VForm(@submit="saveClick").edit
  label
    span.w-80 order/
    VField( name="name" type="text" :rules="isRequired"  v-model="order.name" placeholder="order" )
    ErrorMessage( name="name" )
  label
    span.w-80 price/
    VField( name="price" type="number" :rules="isPositiveIntegerOrZero" v-model="order.price" )
    ErrorMessage( name="price" )
  label
    span.w-80 count/
    VField( name="count" type="number" :rules="isPositiveInteger" v-model="order.count" )
    ErrorMessage( name="count" )
  label
    span.w-80 note/
    textarea.note-input( type="text" v-model="order.note" )
  .delete(v-if="order.id !== NO_ID")
    span.w-80 delete/
    button.btn-disable()(@click="deleteClick") DELETE
  .btn-block
    button.btn-primary(type="submit") SAVE
    button.btn-secondary(@click="cancelClick") CANCEL
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
