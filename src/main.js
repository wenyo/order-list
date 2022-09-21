import { createApp } from "vue";
import { rtdbPlugin } from "vuefire";
import "./assets/css/reset.css";
import "./assets/icon/style.css";
import App from "./App.vue";
import store from "./store";
import router from "./router";

createApp(App).use(store).use(router).mount("#app");
