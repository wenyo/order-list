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
      fileName: "",
      NO_ID
    };
  },
  methods: {
    deleteClick() {
      this.$emit("delete");
    },
    saveClick(value) {
      this.$emit("save", value);
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
    },
    imgChoose(e) {
      const file = e.target.files[0];
      this.fileName = file.name;
    }
  }
};
</script>
<template lang="pug">
div.edit-block(@click.self="cancelClick")
  div.edit-alert
    i.icon-close(@click="cancelClick")
    h1.title {{`Product #${order.id}`}}
    VForm(@submit="saveClick").edit
      label
        span.w-80 name/
        VField.input-primary( name="name" type="text" :rules="isPositiveInteger" v-model="order.name" )
        ErrorMessage.error-msg( name="name" )
      label
        span.w-80 price/
        VField.input-primary( name="price" type="number" :rules="isPositiveInteger" v-model="order.price" )
        ErrorMessage.error-msg( name="price" )
      label
        span.w-80 stock/
        VField.input-primary( name="stock" type="number" :rules="isPositiveInteger" v-model="order.stock" )
        ErrorMessage.error-msg( name="stock" )
      label
        span.w-80 img/
        .btn.btn-primary Choose File
        span.file-name {{fileName}}
        VField#file(name="file" type="file" @change="imgChoose")
      .delete(v-if="order.id !== NO_ID")
        span.w-80 delete/
        button.btn-disable(@click="deleteClick") DELETE
      .btn-block
        button.btn-primary(type="submit") SAVE
        button.btn-secondary(@click="cancelClick") CANCEL
</template>

<style lang="scss" scoped>
.edit-block {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $color-shadow-100;
}

.edit-alert {
  position: relative;
  width: 40vw;
  border-radius: 2px;
  padding: 20px;
  background-color: $color-dark-200;
}

.icon-close {
  color: $color-dark-400;
  border-radius: 999px;
  padding: 2px;
  cursor: pointer;
  font-size: 32px;
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.7;
  transition: all 0.3s;

  &:hover {
    opacity: 1;
  }
}

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
  flex-wrap: wrap;
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

#file {
  display: none;
}
.file-name {
  font-size: 14px;
  color: $color-primary-400;
  margin-top: 6px;
  margin-left: 80px;
  overflow: hidden;
  width: 180px;
  text-overflow: ellipsis;
}
</style>
