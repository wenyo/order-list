<script>
import { mapState } from "vuex";
import Menu from "./components/Menu.vue";
import Loading from "./components/Loading.vue";
import AuthRequire from "./components/AuthRequire.vue";

export default {
  components: { Menu, Loading, AuthRequire },
  computed: {
    ...mapState(["loading", "auth"])
  }
};
</script>

<template lang="pug">
main
  Menu(v-if="auth")
  AuthRequire
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
  max-width: 1280px;
  min-width: 900px;
  width: 80vw;
  display: flex;
  flex-direction: column;
  padding: 40px;

  @include pad {
    min-width: unset;
  }
}
</style>
