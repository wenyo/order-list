<script>
import { useRoute, useRouter } from "vue-router";
import { ROUTES_CONFIG } from "../router";
import { mapState, mapMutations } from "vuex";
import { isLoggedIn } from "../api";

export default {
  data() {
    return {
      loginPath: ROUTES_CONFIG.login.path,
      route: useRoute(),
      router: useRouter()
    };
  },
  computed: {
    ...mapState([["auth"]]),
    isLoginPage() {
      return this.path === this.loginPath;
    },
    path() {
      return this.route.path;
    }
  },
  async created() {
    await isLoggedIn(this.isAuthCheck);
    this.isAuthRedirect();
  },
  watch: {
    auth() {
      this.isAuthRedirect();
    },
    async path() {
      await isLoggedIn(this.isAuthCheck);
      this.isAuthRedirect();
    }
  },
  methods: {
    ...mapMutations(["loginStatusSet"]),
    isAuthCheck(user) {
      this.loginStatusSet({
        user,
        auth: !!user
      });
    },
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
