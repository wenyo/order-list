import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../view/Home.vue";
import List from "../view/List.vue";
import Detail from "../view/Detail.vue";

const routes = [
  {
    path: "/",
    component: Home,
    name: "home"
  },
  {
    path: "/list",
    component: List,
    name: "list"
  },
  {
    path: "/list/:id",
    component: Detail,
    name: "detail"
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
