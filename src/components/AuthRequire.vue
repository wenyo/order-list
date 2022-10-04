<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ROUTES_CONFIG } from "../router";

export default {
  data() {
    return {
      loginPath: ROUTES_CONFIG.login.path,
      route: useRoute(),
      router: useRouter()
    };
  },
  computed: {
    ...mapState(["auth", "userType"]),
    isLoginPage() {
      return this.path === this.loginPath;
    },
    path() {
      return this.route.path;
    }
  },
  async created() {
    this.isLoggedInCheck();
  },
  watch: {
    auth() {
      this.isAuthRedirect();
    },
    async path() {
      this.isLoggedInCheck();
    }
  },
  methods: {
    ...mapMutations(["loadingOpen"]),
    ...mapActions(["userTypeUpdate", "isLoggedInCheck"]),
    async isAuthRedirect() {
      if (!this.auth) {
        this.router.push(this.loginPath);
      } else if (this.auth && this.isLoginPage) {
        this.loadingOpen();
        this.router.push(ROUTES_CONFIG.home.path);
        await this.userTypeUpdate();
      }
    }
  }
};
</script>

<template lang="pug">
slot(v-if="(auth && userType !== -1) || isLoginPage")
</template>
