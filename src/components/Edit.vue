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
  setup() {
    console.log("  Edit setup");
  },
  beforeCreate() {
    console.log("  Edit beforeCreate");
  },
  created() {
    console.log("  Edit created");
  },
  beforeMount() {
    console.log("  Edit beforeMount");
  },
  mounted() {
    console.log("  Edit mounted");
  },
  beforeUpdate() {
    console.log("  Edit beforeUpdate");
  },
  updated() {
    console.log("  Edit updated");
  },
  beforeUnmount() {
    console.log("  Edit beforeUnmount");
  },
  unmounted() {
    console.log("  Edit unmounted");
  },
  methods: {
    deleteClick() {
      this.$emit("delete");
    },
    saveClick() {
      this.$emit("save");
    },
    cancelClick() {
      this.$emit("cancel");
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
    VField.input-primary( name="name" type="text" :rules="isRequired"  v-model="order.name" placeholder="order" )
    ErrorMessage.error-msg( name="name" )
  label
    span.w-80 price/
    VField.input-primary( name="price" type="number" :rules="isPositiveIntegerOrZero" v-model="order.price" )
    ErrorMessage.error-msg( name="price" )
  label
    span.w-80 count/
    VField.input-primary( name="count" type="number" :rules="isPositiveInteger" v-model="order.count" )
    ErrorMessage.error-msg( name="count" )
  label
    span.w-80 note/
    textarea.note-input( type="text" v-model="order.note" )
  .delete(v-if="order.id !== NO_ID")
    span.w-80 delete/
    button.btn-disable(@click="deleteClick") DELETE
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
  gap: 20px;
  margin-top: 100px;
}

.error-msg {
  color: $color-primary-100;
  font-weight: bold;
  margin-left: 5px;
  font-size: 14px;
}
</style>
