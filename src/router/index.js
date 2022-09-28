import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../view/Home.vue";
import Login from "../view/Login.vue";
import List from "../view/List.vue";
import Detail from "../view/Detail.vue";

export const ROUTES_CONFIG = {
  home: {
    path: "/",
    component: Home,
    name: "home"
  },
  login: {
    path: "/login",
    component: Login,
    name: "login"
  },
  list: {
    path: "/list",
    component: List,
    name: "list"
  },
  detail: {
    path: "/list/:id",
    component: Detail,
    name: "detail"
  }
};

const routes = Object.values(ROUTES_CONFIG);

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
