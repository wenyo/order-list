<script>
import _ from "lodash";
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
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      NO_ID,
      newOrder: { ...ORDER_TEMP(), ...this.order }
    };
  },
  computed: {
    ...mapState(["user", "loading"]),
    isNewOrder() {
      return _.isEmpty(this.order);
    },
    count: {
      get() {
        return _.toString(this.newOrder["count"]);
      },
      set(countStr) {
        this.newOrder["count"] = _.toInteger(countStr);
      }
    },
    stock() {
      const oldOrderCount = this.order.count || 0;
      return _.toInteger(this.item.stock) + _.toInteger(oldOrderCount);
    }
  },
  methods: {
    deleteClick() {
      if (this.loading) return;
      this.$emit("delete");
    },
    saveClick() {
      if (this.loading) return;
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
        updated: false
      };

      for (const key in this.newOrder) {
        // new data || update data
        if (this.isNewOrder || this.newOrder[key] !== this.order[key]) {
          result.updated = true;
          result.data[key] = this.newOrder[key];
        }
      }

      if (this.isNewOrder) {
        result.data = {
          ...result.data,
          item_id: this.item.id,
          user_uid: this.user.uid
        };
      }

      return result;
    },
    isRequired(value) {
      if (!value) {
        return ERROR_MSG.IS_REQUIRED;
      }

      return true;
    },
    isCountValid(valStr) {
      const value = Number(valStr);

      if (!valStr) {
        return ERROR_MSG.IS_REQUIRED;
      }

      if (value === 0) {
        return ERROR_MSG.AT_LEAST_ONE;
      }

      if (!Number.isInteger(value)) {
        return ERROR_MSG.NEED_INTEGER;
      }

      if (value < 0) {
        return ERROR_MSG.AT_LEAST_ONE;
      }

      if (this.stock - value < 0) {
        return ERROR_MSG.UNDERSTOCK;
      }

      return true;
    },
    isPositiveIntegerOrZero(valStr) {
      const value = Number(valStr);

      if (!valStr) {
        return ERROR_MSG.IS_REQUIRED;
      }

      if (value === 0) {
        return true;
      }

      if (!Number.isInteger(value)) {
        return ERROR_MSG.NEED_INTEGER;
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
    VForm(@submit="saveClick" v-slot="{meta}").alert-form
      label(v-if="!isNewOrder")
        span.w-80 id/
        span {{order.id}}
      label
        span.w-80 price/
        span {{item.price}}
      label
        span.w-80.shrink-0 count/
        template(v-if="isEdit")
          VField.input-primary.shrink-0( name="count" type="number" :max="stock" :rules="isCountValid" v-model="count" )
          div.answer.shrink-0
            span max: {{stock}}
            ErrorMessage.error-msg( name="count" )
        span(v-else) {{count}}
      label
        span.w-80 note/
        textarea.note-input( type="text" v-if="isEdit" v-model="newOrder.note" )
        span(v-else) {{newOrder.note}}
      .delete(v-if="!isNewOrder && isEdit")
        span.w-80 delete/
        button.btn-disable(@click="deleteClick") DELETE
      .btn-block
        button.btn-primary(type="submit" :disabled="!meta.valid || loading") SAVE
        button.btn-secondary(@click="cancelClick") CANCEL
</template>

<style lang="scss" scoped>
label,
.delete {
  width: fit-content;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 12px 0;

  span {
    display: inline-block;
  }
}

.answer {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
  margin-left: 80px;
  font-size: 14px;
  color: $color-dark-400;

  .error-msg {
    position: absolute;
    bottom: -100%;
    white-space: nowrap;
  }
}

.note-input {
  display: block;
}

.btn-block {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 30px;
}

.img-box {
  padding-bottom: 50%;
}
</style>
