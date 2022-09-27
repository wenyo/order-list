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
      imgName: "",
      newOrder: JSON.parse(JSON.stringify(this.order))
    };
  },
  computed: {
    isNewProduct() {
      return !this.newOrder.id;
    }
  },
  methods: {
    deleteClick() {
      this.$emit("delete");
    },
    async dataFormat(value) {
      let data = {};
      for (const key in value) {
        if (!!value[key] && value[key] !== this.order[key]) {
          data[key] = value[key];
        }
      }

      if (data.img) {
        await this.imgToBase64(value.img).then((img) => {
          data.img = img;
        });
      }
      return data;
    },
    async saveClick(value) {
      const data = await this.dataFormat(value);
      if (Object.keys(data).length === 0) return;
      const update_time = new Date().getTime();
      this.$emit("save", { ...data, update_time });
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
      const img = e.target.files[0];
      this.imgName = img.name;
    },
    imgToBase64(img) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(img);
      });
    },
    padStartZero(number) {
      return number.toString().padStart(2, "0");
    },
    dateFormatGet(timestamp) {
      const fullDate = new Date(timestamp);
      const year = fullDate.getFullYear();
      const month = this.padStartZero(fullDate.getMonth() + 1);
      const date = this.padStartZero(fullDate.getDate());
      const hour = this.padStartZero(fullDate.getHours());
      const minute = this.padStartZero(fullDate.getMinutes());
      return `${year}/${month}/${date} ${hour}:${minute}`;
    }
  }
};
</script>
<template lang="pug">
div.edit-block(@click.self="cancelClick")
  div.edit-alert
    i.icon-close(@click="cancelClick")
    span.time(v-if="!isNewProduct") {{dateFormatGet(newOrder.update_time)}}
    h1.title(v-if="!isNewProduct") {{`Product #${newOrder.id}`}}
    h1.title(v-else) New Product
    VForm(@submit="saveClick").edit
      label
        span.w-80 name/
        VField.input-primary( name="name" type="text" :rules="isPositiveInteger" v-model="newOrder.name" )
        ErrorMessage.error-msg( name="name" )
      label
        span.w-80 price/
        VField.input-primary( name="price" type="number" :rules="isPositiveInteger" v-model="newOrder.price" )
        ErrorMessage.error-msg( name="price" )
      label
        span.w-80 stock/
        VField.input-primary( name="stock" type="number" :rules="isPositiveInteger" v-model="newOrder.stock" )
        ErrorMessage.error-msg( name="stock" )
      label
        span.w-80 img/
        .btn.btn-primary Choose File
        span.img-name {{imgName}}
        VField#img(name="img" type="file" @change="imgChoose")
      .delete(v-if="!isNewProduct")
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
  padding: 4px;
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

.time {
  color: $color-dark-400;
  opacity: 0.7;
  font-size: 14px;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 20px;
  line-height: 28px;
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

.btn-block {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin-top: 50px;
}

#img {
  display: none;
}

.img-name {
  font-size: 14px;
  color: $color-primary-400;
  margin-top: 6px;
  margin-left: 80px;
  overflow: hidden;
  width: 200px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
