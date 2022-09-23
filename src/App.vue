<script>
import { mapMutations } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { isLoggedIn, logoutFetch } from "./api";
import Menu from "./components/Menu.vue";

export default {
  components: { Menu },
  data() {
    return {
      isAuth: false,
      route: useRoute(),
      router: useRouter()
    };
  },
  computed: {
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
    ...mapMutations(["userSet"]),
    isAuthRedirect(user) {
      this.isAuth = !!user;
      if (!this.isAuth) {
        return this.router.push("/login");
      } else if (this.route.path === "/login") {
        this.router.push("/");
      }
      this.userSet({ user });
    },
    logoutClick() {
      logoutFetch().then(() => {
        this.isAuth = false;
      });
    }
  }
};
</script>

<template lang="pug">
main
  Menu(v-if="isAuth" @logout="logoutClick")
  router-view
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
