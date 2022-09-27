<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { ERROR_MSG } from "../util/enum";
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
    }
  },
  data() {
    return {
      imgName: "",
      newItem: JSON.parse(JSON.stringify(this.item))
    };
  },
  computed: {
    isNewProduct() {
      return !this.newItem.id;
    }
  },
  methods: {
    deleteClick() {
      this.$emit("delete");
    },
    async dataFormat(value) {
      let data = {};
      const intValueKey = ["price", "stock"];

      for (const key in value) {
        if (!value[key] || value[key] === this.item[key]) continue;
        const valueTmp = intValueKey.includes(key)
          ? parseInt(value[key])
          : value[key];
        data[key] = valueTmp;
      }

      if (data.img) {
        await this.imgToBase64(value.img).then((img) => {
          data.img = img;
        });
      }
      return data;
    },
    async saveClick(value) {
      let data = await this.dataFormat(value);
      // check: need to update
      if (Object.keys(data).length === 0) return;
      data = { ...data, display: true };

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
div.alert-block(@click.self="cancelClick")
  div.alert-content
    i.icon-close(@click="cancelClick")
    div(v-if="!isNewProduct").img-box
      img(:src="newItem.img")
    span.time(v-if="!isNewProduct") {{dateFormatGet(newItem.update_time)}}
    h1.title(v-if="!isNewProduct") {{`Product #${newItem.id}`}}
    h1.title(v-else) New Product
    VForm(@submit="saveClick").alert-form
      label
        span.w-80 name/
        VField.input-primary( name="name" type="text" :rules="isPositiveInteger" v-model="newItem.name" )
        ErrorMessage.error-msg( name="name" )
      label
        span.w-80 price/
        VField.input-primary( name="price" type="number" :rules="isPositiveInteger" v-model="newItem.price" )
        ErrorMessage.error-msg( name="price" )
      label
        span.w-80 stock/
        VField.input-primary( name="stock" type="number" :rules="isPositiveInteger" v-model="newItem.stock" )
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

.img-box {
  padding-bottom: 40%;
}
</style>
