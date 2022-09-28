<script>
import { mapMutations, mapState } from "vuex";
import { isLoggedIn, logoutFetch } from "./api";
import Menu from "./components/Menu.vue";
import Loading from "./components/Loading.vue";
import AuthRequire from "./components/AuthRequire.vue";

export default {
  components: { Menu, Loading, AuthRequire },
  data() {
    return {
      isAuth: false
    };
  },
  computed: {
    ...mapState(["loading"])
  },
  created() {
    isLoggedIn(this.isAuthCheck);
  },
  watch: {
    path() {
      isLoggedIn(this.isAuthCheck);
    }
  },
  methods: {
    ...mapMutations(["userSet", "loadingOpen", "loadingClose"]),
    isAuthCheck(user) {
      this.userSet({ user });
      this.isAuth = !!user;
    },
    async logoutClick() {
      this.loadingOpen();
      await logoutFetch().then(() => {
        this.isAuth = false;
      });
      this.loadingClose();
    }
  }
};
</script>

<template lang="pug">
main
  Menu(v-if="isAuth" @logout="logoutClick")
  AuthRequire(:auth ="isAuth" )
    router-view
  Loading(v-if="loading")
</template>

<style lang="scss">
body {
  background-color: $color-dark-200;
  display: flex;
  justify-content: center;
}

main {
  min-height: 100vh;
  max-width: 1028px;
  min-width: 900px;
  width: 80vw;
  display: flex;
  flex-direction: column;
  padding: 40px;
}
</style>
