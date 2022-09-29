<script>
import { mapMutations } from "vuex";
import { Form, Field, ErrorMessage } from "vee-validate";
import { loginFetch, authUser } from "../api";
import { ERROR_MSG } from "../util/enum";

export default {
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage
  },
  data() {
    return {
      account: "wenda897436@gmail.com",
      password: "123456",
      ERROR_MSG,
      loginFailed: false
    };
  },
  methods: {
    ...mapMutations(["loadingOpen", "loadingClose", "loginStatusSet"]),
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
        this.loadingClose();
        return;
      }

      this.loginStatusSet({
        user: result.currentUser,
        auth: result.auth
      });
    },
    async login() {
      this.loadingOpen();
      await loginFetch({
        account: this.account,
        password: this.password
      }).then(() => {
        this.loginStatus();
      });
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
