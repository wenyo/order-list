<script>
import { useRoute, useRouter } from "vue-router";
import { ROUTES_CONFIG } from "../router";
import { mapState, mapMutations } from "vuex";
import { isLoggedIn, userTypeGet } from "../api";

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
    ...mapMutations(["loginStatusSet", "userTypeSet", "loadingOpen"]),
    isAuthCheck(user) {
      this.loginStatusSet({
        user,
        auth: !!user
      });
    },
    async isAuthRedirect() {
      if (!this.auth) {
        this.router.push(this.loginPath);
      } else if (this.auth && this.isLoginPage) {
        this.loadingOpen();
        this.router.push(ROUTES_CONFIG.home.path);
        await this.userTypeUpdate();
      }
    },
    async userTypeUpdate() {
      return await userTypeGet().then((userType) => {
        this.userTypeSet({ userType });
      });
    }
  }
};
</script>

<template lang="pug">
slot(v-if="(auth && userType !== -1) || isLoginPage")
</template>
