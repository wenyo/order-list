<script>
import { useRoute, useRouter } from "vue-router";
import { ROUTES_CONFIG } from "../router";

export default {
  props: ["auth"],
  data() {
    return {
      loginPath: ROUTES_CONFIG.login.path,
      route: useRoute(),
      router: useRouter()
    };
  },
  computed: {
    isLoginPage() {
      return this.path === this.loginPath;
    },
    path() {
      return this.route.path;
    }
  },
  created() {
    this.isAuthRedirect();
  },
  watch: {
    auth() {
      this.isAuthRedirect();
    },
    path() {
      this.isAuthRedirect();
    }
  },
  methods: {
    isAuthRedirect() {
      if (!this.auth) {
        return this.router.push(this.loginPath);
      } else if (this.isLoginPage) {
        this.router.push(ROUTES_CONFIG.home.path);
      }
    }
  }
};
</script>

<template lang="pug">
slot(v-if="auth || isLoginPage")
</template>
