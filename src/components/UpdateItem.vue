<script>
import _ from "lodash";
import { Form, Field, ErrorMessage } from "vee-validate";
import { mapState } from "vuex";
import { ERROR_MSG } from "../util/enum";
import Header from "./Header.vue";

export default {
  components: {
    Header,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage
  },
  emits: ["delete", "save", "cancel", "show"],
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
    ...mapState(["loading"]),
    isNewProduct() {
      return !this.newItem.id;
    },
    price: {
      get() {
        return _.toString(this.newItem["price"]);
      },
      set(priceStr) {
        this.newItem["price"] = _.toInteger(priceStr);
      }
    },
    stock: {
      get() {
        return _.toString(this.newItem["stock"]);
      },
      set(stockStr) {
        this.newItem["stock"] = _.toInteger(stockStr);
      }
    }
  },
  methods: {
    deleteClick() {
      if (this.loading) return;
      this.$emit("delete");
    },
    showClick() {
      if (this.loading) return;
      this.$emit("show");
    },
    async dataFormat() {
      let result = {
        data: {},
        updated: false
      };

      for (const key in this.newItem) {
        if (this.newItem[key] !== this.item[key]) {
          result.data[key] = this.newItem[key];
          result.updated = true;
        }
      }

      if (result.data.img) {
        await this.imgToBase64(this.newItem.img).then((img) => {
          result.data.img = img;
        });
      }
      return result;
    },
    async saveClick() {
      if (this.loading) return;

      let { data, updated } = await this.dataFormat();
      // check: need to update
      if (!updated) return this.cancelClick();

      const updateTime = new Date().getTime();
      this.$emit("save", { ...data, update_time: updateTime });
    },
    async cancelClick() {
      this.$emit("cancel");
    },
    isRequired(value) {
      if (!value) {
        return ERROR_MSG.IS_REQUIRED;
      }

      return true;
    },
    isPositiveInteger(valStr) {
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

      if (value <= 0) {
        return ERROR_MSG.AT_LEAST_ONE;
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
    div(v-if="!isNewProduct" :class="{'annotation': !newItem.img}").img-box
      img(:src="newItem.img")
    span.time(v-if="!isNewProduct") {{dateFormatGet(newItem.update_time)}}
    h1.title(v-if="!isNewProduct") {{`Product #${newItem.id}`}}
    h1.title(v-else) New Product
    VForm(@submit="saveClick" v-slot="{meta}").alert-form
      label
        span.w-80 name/
        VField.input-primary( name="name" type="text" :rules="isRequired" v-model="newItem.name" )
        ErrorMessage.error-msg( name="name" )
      label
        span.w-80 price/
        VField.input-primary( name="price" type="number" :rules="isPositiveInteger" v-model="price" )
        ErrorMessage.error-msg( name="price" )
      label
        span.w-80 stock/
        VField.input-primary( name="stock" type="number" :rules="isPositiveIntegerOrZero" v-model="stock" )
        ErrorMessage.error-msg( name="stock" )
      label
        span.w-80 img/
        .btn.btn-primary Choose File
        span.img-name {{imgName}}
        VField#img(name="img" type="file" @change="imgChoose")
      .delete(v-if="!isNewProduct")
        span.w-80 display/
        button.btn-disable(v-if="newItem.display" @click="deleteClick") DELETE
        button.btn-secondary(v-else @click="showClick") SHOW
      .btn-block
        button.btn-primary(type="submit" :disabled="!meta.valid || loading") SAVE
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
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.img-box {
  padding-bottom: 40%;

  &.annotation::after {
    content: "NO IMAGE";
  }
}
</style>
