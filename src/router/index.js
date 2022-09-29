import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../view/Home.vue";
import Login from "../view/Login.vue";
import List from "../view/List.vue";
import Detail from "../view/Detail.vue";
import store from "../store";
import { USER_TYPE } from "../util/enum";

export const ROUTES_CONFIG = {
  home: {
    path: "/",
    component: Home,
    name: "home",
    meta: {
      auth_require: true,
      admin: true,
      customer: true
    }
  },
  login: {
    path: "/login",
    component: Login,
    name: "login"
  },
  list: {
    path: "/list",
    component: List,
    name: "list",
    meta: {
      auth_require: true,
      admin: false,
      customer: true
    }
  },
  detail: {
    path: "/item/:id",
    component: Detail,
    name: "detail",
    meta: {
      auth_require: true,
      admin: true,
      customer: false
    }
  }
};

const routes = Object.values(ROUTES_CONFIG);

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from) => {
  // check admin
  const isAdmin = store.state.userType === USER_TYPE.ADMIN;
  const isCustomer = store.state.userType === USER_TYPE.CUSTOMER;
  const isAuthenticated = store.state.auth;
  const isToLogin = to.name === ROUTES_CONFIG.login.name;

  // need login
  if (!isAuthenticated) {
    return !isToLogin
      ? {
          name: ROUTES_CONFIG.login.name
        }
      : true;
  }

  if (isToLogin) {
    return {
      name: ROUTES_CONFIG.home.name
    };
  }

  // check user type
  if (isAdmin && !to.meta.admin) {
    return {
      name: ROUTES_CONFIG.home.name
    };
  }

  if (isCustomer && !to.meta.customer) {
    return {
      name: ROUTES_CONFIG.home.name
    };
  }
});

export default router;
