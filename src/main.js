import { createApp } from "vue";
import "./assets/css/reset.css";
import App from "./App.vue";
import store from "./store";
import router from "./router";

createApp(App).use(store).use(router).mount("#app");
