<script>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IsLoggedIn } from "./api";
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
  created() {
    IsLoggedIn(this.isAuthRedirect);
  },
  methods: {
    isAuthRedirect(user) {
      this.isAuth = !!user;
      if (!this.isAuth) {
        this.router.push("/login");
      } else if (this.route.path === "/login") {
        this.router.push("/");
      }
    }
  }
};
</script>

<template lang="pug">
main
  Menu(v-if="isAuth")
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
