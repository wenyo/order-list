<script>
import _ from "lodash";
import { Form, Field, ErrorMessage } from "vee-validate";
import { mapState, mapActions, mapMutations } from "vuex";
import { ERROR_MSG } from "../util/enum";
import Header from "./Header.vue";

export default {
  components: {
    Header,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage
  },
  emits: ["closeAlert"],
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
    ...mapMutations(["loadingOpen", "loadingClose"]),
    ...mapActions(["itemDisplayToggle", "itemInfoUpdate"]),
    async itemDisplayClick(display) {
      if (this.loading) return;
      this.loadingOpen();
      await this.itemDisplayToggle({ id: this.newItem.id, display });
      await this.cloesAlert();
      this.loadingClose();
    },
    dataFormat() {
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

      return result;
    },
    async saveClick() {
      if (this.loading) return;
      this.loadingOpen();

      let { data, updated } = this.dataFormat();
      // check: need to update
      if (!updated) return this.cloesAlert();

      const updateTime = new Date().getTime();
      const itemUpdateData = { ...data, update_time: updateTime };
      await this.itemInfoUpdate({ id: this.newItem.id, itemUpdateData });
      await this.cloesAlert();
      this.loadingClose();
    },
    async cloesAlert() {
      await this.$emit("closeAlert");
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
    async imgChoose(e) {
      const imgFile = e.target.files[0];
      this.imgName = imgFile.name;

      await this.imgToBase64(imgFile).then((img) => {
        this.newItem.img = img;
      });
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
div.alert-block(@click.self="cloesAlert")
  div.alert-content
    i.icon-close(@click="cloesAlert")
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
        button.btn-disable(v-if="newItem.display" @click="itemDisplayClick(false)") DELETE
        button.btn-secondary(v-else @click="itemDisplayClick(true)") SHOW
      .btn-block
        button.btn-primary(type="submit" :disabled="!meta.valid || loading") SAVE
        button.btn-secondary(@click="cloesAlert") CANCEL
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
