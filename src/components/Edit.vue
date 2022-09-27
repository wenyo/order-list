<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { mapState } from "vuex";
import { NO_ID, ERROR_MSG, ORDER_TEMP } from "../util/enum";
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
    item: {
      type: Object,
      default: {}
    },
    order: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      NO_ID,
      newOrder: { ...ORDER_TEMP(), ...this.order }
    };
  },
  computed: {
    ...mapState(["user"]),
    isNewOrder() {
      return Object.keys(this.order).length === 0;
    }
  },
  methods: {
    deleteClick() {
      this.$emit("delete");
    },
    saveClick() {
      const { data, updated } = this.dataFormat();
      // no need to update
      if (!updated) return this.cancelClick();
      this.$emit("save", data);
    },
    cancelClick() {
      this.$emit("cancel");
    },
    dataFormat() {
      let result = {
        data: {},
        updated: true
      };

      if (this.isNewOrder) {
        result.data = {
          ...this.newOrder,
          item_id: this.item.id,
          user_uid: this.user.uid
        };
        return result;
      }

      return this.dataUpdateCheck();
    },
    dataUpdateCheck() {
      const result = {
        data: {},
        updated: false
      };
      const intValueKey = ["count"];

      for (const key in this.newOrder) {
        if (this.newOrder[key] !== this.order[key]) {
          const valueTmp = intValueKey.includes(key)
            ? parseInt(this.newOrder[key])
            : this.newOrder[key];
          result.updated = true;
          result.data[key] = valueTmp;
        }
      }

      return result;
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
div.alert-block(@click.self="cancelClick")
  div.alert-content
    i.icon-close(@click="cancelClick")
    div.img-box
      img(:src="item.img")
    h1.title {{item.name}}
    VForm(@submit="saveClick").alert-form
      label
        span.w-80 id/
        span {{order.id}}
      label
        span.w-80 price/
        span {{item.price}}
      label
        span.w-80 count/
        VField.input-primary( name="count" type="number" :rules="isPositiveInteger" v-model="newOrder.count" )
        ErrorMessage.error-msg( name="count" )
      label
        span.w-80 note/
        textarea.note-input( type="text" v-model="newOrder.note" )
      .delete(v-if="item.id !== NO_ID")
        span.w-80 delete/
        button.btn-disable(@click="deleteClick") DELETE
      .btn-block
        button.btn-primary(type="submit") SAVE
        button.btn-secondary(@click="cancelClick") CANCEL
</template>

<style lang="scss" scoped>
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
  margin-top: 50px;
}

.img-box {
  padding-bottom: 40%;
}
</style>
