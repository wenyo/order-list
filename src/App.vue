<script>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authUser, IsLoggedIn } from "./api";
import Menu from "./components/Menu.vue";

export default {
  components: { Menu },
  setup() {
    const authStatus = computed(() => authUser()); // !!!need fix
    const route = useRoute();
    const router = useRouter();

    if (!authStatus.auth) {
      router.push("/login");
    } else if (route.path === "/login") {
      router.push("/");
    }

    return {
      authStatus,
      authUser,
      IsLoggedIn
    };
  },
  data() {
    return {
      isAuth: false
    };
  }
};
</script>

<template lang="pug">
main
  Menu
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
