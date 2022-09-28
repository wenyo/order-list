<script>
import { mapMutations, mapState } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { isLoggedIn, logoutFetch } from "./api";
import Menu from "./components/Menu.vue";
import Loading from "./components/Loading.vue";

export default {
  components: { Menu, Loading },
  data() {
    return {
      isAuth: false,
      route: useRoute(),
      router: useRouter()
    };
  },
  computed: {
    ...mapState(["loading"]),
    path() {
      return this.route.path;
    }
  },
  created() {
    isLoggedIn(this.isAuthRedirect);
  },
  watch: {
    path() {
      isLoggedIn(this.isAuthRedirect);
    }
  },
  methods: {
    ...mapMutations(["userSet", "loadingOpen", "loadingClose"]),
    isAuthRedirect(user) {
      this.isAuth = !!user;
      if (!this.isAuth) {
        return this.router.push("/login");
      } else if (this.route.path === "/login") {
        this.router.push("/");
      }
      this.userSet({ user });
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
