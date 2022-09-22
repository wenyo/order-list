<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import { useRouter } from "vue-router";
import { loginFetch, authUser } from "../api";
import { ERROR_MSG } from "../util/enum";

export default {
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage
  },
  setup() {
    const router = useRouter();
    let account = "wenda897436@gmail.com";
    let password = "123456";

    function toHomePage() {
      router.push("/");
    }

    return {
      account,
      password,
      loginFetch,
      toHomePage,
      authUser,
      ERROR_MSG,
      loginFailed: false
    };
  },
  methods: {
    isRequired(value) {
      if (!value) {
        return ERROR_MSG.IS_REQUIRED;
      }

      return true;
    },
    loginStatus() {
      const result = authUser();
      if (!result.auth) {
        this.loginFailed = true;
      } else {
        this.toHomePage();
      }
    },
    async login() {
      await this.loginFetch({
        account: this.account,
        password: this.password
      }).then((rs) => this.loginStatus());
    }
  }
};
</script>

<template lang="pug">
h1.title Login
VForm(@submit="login")
  label
    span.w-100 account
    VField.input-primary( name="account" type="text" :rules="isRequired" v-model="account")
    ErrorMessage.error-msg( name="account" )
  label
    span.w-100 password
    VField.input-primary( name="password" type="password" :rules="isRequired" v-model="password")
    ErrorMessage.error-msg( name="password" )
  div.btn-block
    button.btn-primary(type="submit") send
    div.error-msg(v-show="loginFailed") {{ERROR_MSG.LOGIN_FAILED}}
</template>

<style lang="scss" scoped>
form {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  background-color: $color-dark-100;
  padding: 20px;
  margin-top: 10px;
  border-radius: 2px;

  label {
    display: flex;
    align-items: flex-end;
  }
}

.btn-block {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 50px;
  gap: 10px;
}
</style>
